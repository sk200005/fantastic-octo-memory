import React, { useEffect, useMemo, useState } from "react";
import api from "../api/axios";
import ArticleCard from "../components/ArticleCard";
import Navbar from "../components/Navbar";

const categories = [
  { label: "All", value: "all" },
  { label: "Politics", value: "politics" },
  { label: "Sports", value: "sports" },
  { label: "War", value: "war" },
  { label: "Stocks", value: "stocks" },
  // { label: "Technology", value: "technology" },
  { label: "Economy", value: "economy" },
  // { label: "World", value: "world" },
  // { label: "Entertainment", value: "entertainment" },
];
function hasRenderableContent(article) {
  const hasImage = Boolean(article.image?.trim());
  const hasSummary = Boolean(article.summary?.trim());
  const hasSummaryPoints = Array.isArray(article.summaryPoints)
    && article.summaryPoints.some((point) => String(point || "").trim());
  const hasBiasAnalysis = Boolean(
    article.bias?.biasScore !== undefined ||
      article.bias?.politicalLean ||
      article.bias?.sentiment ||
      article.biasScore !== undefined
  );

  return hasImage || hasSummary || hasSummaryPoints || hasBiasAnalysis;
}

function getApiErrorMessage(error) {
  if (error.response?.data?.message) {
    return error.response.data.message;
  }

  if (error.response?.data?.error) {
    return error.response.data.error;
  }

  if (error.code === "ERR_NETWORK") {
    return "Could not connect to the backend at http://localhost:8000.";
  }

  return error.message || "Unknown error";
}

function News() {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [statusMessage, setStatusMessage] = useState("");
  const [category, setCategory] = useState("all");
  const [region, setRegion] = useState("all");
  const [sortOrder, setSortOrder] = useState("latest");

  const fetchArticles = async (selectedCategory = "all") => {
    const params =
      selectedCategory !== "all" ? { category: selectedCategory } : undefined;
    const res = await api.get("/news", { params });
    setArticles(res.data);
  };

  const regionFilteredArticles = useMemo(
    () =>
      articles
        .filter((article) => {
          if (region === "india") {
            return [
              "Indian Politics",
              "Indian economy",
              "Indian sports",
            ].includes(article.subCategory);
          }

          if (region === "world") {
            return [
              "World Politics",
              "World economy",
              "World sports",
            ].includes(article.subCategory);
          }

          return true;
        })
        .filter(hasRenderableContent),
    [articles, region]
  );

  const sortedArticles = useMemo(
    () =>
      [...regionFilteredArticles].sort((firstArticle, secondArticle) => {
        const firstCreatedAt = new Date(
          firstArticle.createdAt || firstArticle.publishedAt || 0
        ).getTime();
        const secondCreatedAt = new Date(
          secondArticle.createdAt || secondArticle.publishedAt || 0
        ).getTime();
        const firstBias =
          typeof (firstArticle.bias?.biasScore ?? firstArticle.biasScore) === "number"
            ? (firstArticle.bias?.biasScore ?? firstArticle.biasScore)
            : Number(firstArticle.bias?.biasScore ?? firstArticle.biasScore) || 0;
        const secondBias =
          typeof (secondArticle.bias?.biasScore ?? secondArticle.biasScore) === "number"
            ? (secondArticle.bias?.biasScore ?? secondArticle.biasScore)
            : Number(secondArticle.bias?.biasScore ?? secondArticle.biasScore) || 0;

        if (sortOrder === "oldest") {
          return firstCreatedAt - secondCreatedAt;
        }

        if (sortOrder === "most-biased") {
          return secondBias - firstBias;
        }

        if (sortOrder === "least-biased") {
          return firstBias - secondBias;
        }

        return secondCreatedAt - firstCreatedAt;
      }),
    [regionFilteredArticles, sortOrder]
  );

  const articleCountLabel = useMemo(
    () =>
      region === "all" && category === "all"
        ? `${sortedArticles.length} total articles shown`
        : `${sortedArticles.length} articles shown`,
    [category, region, sortedArticles.length]
  );

  const reloadArticles = async () => {
    const runStep = async (label, request, { optional = false } = {}) => {
      try {
        const response = await request();

        if (response?.data?.success === false) {
          throw new Error(response.data.error || response.data.message || `${label} failed.`);
        }

        return { ok: true, response };
      } catch (error) {
        const message = getApiErrorMessage(error);

        if (optional) {
          console.error(`${label} failed:`, error);
          return { ok: false, message };
        }

        throw new Error(`${label} failed: ${message}`);
      }
    };

    try {
      const optionalFailures = [];

      setLoading(true);
      setStatusMessage("Fetching 3 fresh articles from rotating RSS sources...");
      const reloadResult = await runStep("RSS reload", () => api.get("/news/reload-news"));
      const ingestedArticleIds = reloadResult.response?.data?.articles?.map((article) => article._id) || [];

      setStatusMessage("Scraping 3 fetched articles...");
      let scrapedArticleIds = [];
      {
        const result = await runStep(
          "Scraping",
          () => api.post("/scraper/run", { articleIds: ingestedArticleIds }),
          { optional: true }
        );

        if (!result.ok) {
          optionalFailures.push(result.message);
        } else {
          scrapedArticleIds = result.response?.data?.articleIds || [];

          if (scrapedArticleIds.length !== ingestedArticleIds.length) {
            optionalFailures.push(
              `Only ${scrapedArticleIds.length} of ${ingestedArticleIds.length} fetched articles were scraped successfully.`
            );
          }
        }
      }

      setStatusMessage("Generating summaries...");
      let summarizedArticleIds = [];
      {
        const result = await runStep(
          "Summarization",
          () => api.post("/summarize", { articleIds: scrapedArticleIds }),
          { optional: true }
        );

        if (!result.ok) {
          optionalFailures.push(result.message);
        } else {
          summarizedArticleIds = result.response?.data?.articleIds || [];

          if (summarizedArticleIds.length !== scrapedArticleIds.length) {
            optionalFailures.push(
              `Only ${summarizedArticleIds.length} of ${scrapedArticleIds.length} scraped articles were summarized successfully.`
            );
          }
        }
      }

      setStatusMessage("Analyzing bias for 3 articles...");
      let analyzedArticleIds = [];
      let biasFailures = [];
      {
        const result = await runStep(
          "Bias analysis",
          () => api.post("/bias/run", { articleIds: summarizedArticleIds }),
          { optional: true }
        );

        if (!result.ok) {
          optionalFailures.push(result.message);
        } else {
          analyzedArticleIds = result.response?.data?.articleIds || [];
          biasFailures = result.response?.data?.failures || [];

          if (analyzedArticleIds.length !== summarizedArticleIds.length) {
            optionalFailures.push(
              biasFailures[0]?.error ||
              `Only ${analyzedArticleIds.length} of ${summarizedArticleIds.length} summarized articles completed bias analysis.`
            );
          }
        }
      }

      await fetchArticles(category);

      if (analyzedArticleIds.length === 3) {
        setStatusMessage("3 articles reloaded, analyzed, and displayed successfully.");
      } else if (optionalFailures.length > 0) {
        setStatusMessage(`Articles loaded with partial issues: ${optionalFailures[0]}`);
      } else {
        setStatusMessage(`Reload completed with ${analyzedArticleIds.length} fully analyzed article(s).`);
      }
    } catch (error) {
      console.error("Pipeline error:", error);
      setStatusMessage(error.message || "Reload failed.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const loadArticlesByCategory = async () => {
      try {
        await fetchArticles(category);
      } catch (error) {
        console.error("Error fetching filtered articles:", error);
        setStatusMessage("Could not load filtered articles.");
      }
    };

    loadArticlesByCategory();
  }, [category]);

  return (
    <div className="min-h-screen bg-[linear-gradient(180deg,#283e58_0%,#1f3348_46%,#17283b_100%)]">
      <Navbar />

      <div className="w-full px-6 pb-16 pt-8 md:px-10 xl:px-16 space-y-6">
        <div className="flex flex-col gap-4 rounded-3xl border border-white/10 bg-white/5 p-6 shadow-[0_12px_30px_rgba(15,23,42,0.14)]">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <p className="text-xs uppercase tracking-[0.3em] text-cyan-300">
                ADBMS Dashboard
              </p>
              <h1 className="mt-2 text-3xl font-semibold text-white">
                Filter ○ Analyse ○ Relate
              </h1>
              <p className="mt-2 min-h-6 text-sm text-gray-300">
                {statusMessage ||
                  "Explore categories, bias analytics, and similarity-based recommendations."}
              </p>
              <p className="mt-3 text-sm font-medium text-cyan-200">
                {articleCountLabel}
              </p>
            </div>

            <button
              onClick={reloadArticles}
              disabled={loading}
              className="rounded-xl bg-cyan-500 px-6 py-3 text-sm font-semibold text-slate-950 shadow-lg transition hover:bg-cyan-400 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {loading ? "Processing..." : "Reload Articles"}
            </button>
          </div>

          <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
            <div className="flex flex-col gap-4">
              <div className="flex flex-wrap gap-3">
                {categories.map((item) => (
                  <button
                    key={item.value}
                    onClick={() => setCategory(item.value)}
                    className={`rounded-full px-4 py-2 text-sm font-medium transition ${
                      category === item.value
                        ? "bg-cyan-400 text-slate-950"
                        : "bg-white/10 text-white hover:bg-white/20"
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
              </div>

              <div className="flex flex-wrap gap-3">
                <button
                  onClick={() => setRegion("all")}
                  className={`rounded-full px-4 py-2 text-sm font-medium transition ${
                    region === "all"
                      ? "bg-emerald-400 text-slate-950"
                      : "bg-white/10 text-white hover:bg-white/20"
                  }`}
                >
                  All Regions
                </button>
                <button
                  onClick={() => setRegion("india")}
                  className={`rounded-full px-4 py-2 text-sm font-medium transition ${
                    region === "india"
                      ? "bg-emerald-400 text-slate-950"
                      : "bg-white/10 text-white hover:bg-white/20"
                  }`}
                >
                  India
                </button>
                <button
                  onClick={() => setRegion("world")}
                  className={`rounded-full px-4 py-2 text-sm font-medium transition ${
                    region === "world"
                      ? "bg-emerald-400 text-slate-950"
                      : "bg-white/10 text-white hover:bg-white/20"
                  }`}
                >
                  World
                </button>
              </div>
            </div>

            <label className="flex items-center gap-3 text-sm text-gray-300">
              <span className="font-medium text-white">Sort By</span>
              <select
                value={sortOrder}
                onChange={(event) => setSortOrder(event.target.value)}
                className="rounded-xl border border-white/10 bg-slate-900/80 px-4 py-2 text-sm font-medium text-white outline-none transition focus:border-cyan-400"
              >
                <option value="latest">Latest to oldest</option>
                <option value="oldest">Oldest to latest</option>
                <option value="most-biased">Most biased to least biased</option>
                <option value="least-biased">Least biased to most biased</option>
              </select>
            </label>
          </div>
        </div>

        <section className="space-y-5">
          {sortedArticles.length > 0 ? (
            sortedArticles.map((article) => (
              <ArticleCard key={article._id} article={article} />
            ))
          ) : (
            <div className="rounded-2xl border border-white/10 bg-white/5 px-6 py-8 text-center text-sm text-gray-200">
              No articles match the current filters yet.
            </div>
          )}
        </section>
      </div>
    </div>
  );
}

export default News;
