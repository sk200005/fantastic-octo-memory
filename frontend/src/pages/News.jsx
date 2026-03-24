import React, { useEffect, useState } from "react";
import api from "../api/axios";
import ArticleCard from "../components/ArticleCard";
import Header from "../components/Header";

const categories = [
  { label: "All", value: "all" },
  { label: "Politics", value: "politics" },
  { label: "Sports", value: "sports" },
  { label: "War", value: "war" },
  { label: "Stocks", value: "stocks" },
  { label: "Technology", value: "technology" },
  { label: "Economy", value: "economy" },
  { label: "World", value: "world" },
  { label: "Entertainment", value: "entertainment" },
];

function formatCategoryLabel(category) {
  if (!category) {
    return "General";
  }

  return category.charAt(0).toUpperCase() + category.slice(1);
}

function News() {
  const [articles, setArticles] = useState([]);
  const [analytics, setAnalytics] = useState([]);
  const [loading, setLoading] = useState(false);
  const [statusMessage, setStatusMessage] = useState("");
  const [category, setCategory] = useState("all");
  const [sortOrder, setSortOrder] = useState("latest");

  const fetchArticles = async (selectedCategory = "all") => {
    const params =
      selectedCategory !== "all" ? { category: selectedCategory } : undefined;
    const res = await api.get("/news", { params });
    setArticles(res.data);
  };

  const fetchAnalytics = async () => {
    const res = await api.get("/analytics/category-bias");
    setAnalytics(res.data);
  };

  const sortedArticles = [...articles].sort((firstArticle, secondArticle) => {
    const firstDate = new Date(firstArticle.publishedAt || 0).getTime();
    const secondDate = new Date(secondArticle.publishedAt || 0).getTime();
    const firstBias =
      typeof (firstArticle.bias?.biasScore ?? firstArticle.biasScore) === "number"
        ? (firstArticle.bias?.biasScore ?? firstArticle.biasScore)
        : Number(firstArticle.bias?.biasScore ?? firstArticle.biasScore) || 0;
    const secondBias =
      typeof (secondArticle.bias?.biasScore ?? secondArticle.biasScore) === "number"
        ? (secondArticle.bias?.biasScore ?? secondArticle.biasScore)
        : Number(secondArticle.bias?.biasScore ?? secondArticle.biasScore) || 0;

    if (sortOrder === "oldest") {
      return firstDate - secondDate;
    }

    if (sortOrder === "most-biased") {
      return secondBias - firstBias;
    }

    if (sortOrder === "least-biased") {
      return firstBias - secondBias;
    }

    return secondDate - firstDate;
  });

  const reloadArticles = async () => {
    try {
      let biasUnavailable = false;

      setLoading(true);
      setStatusMessage("Fetching 6 balanced articles from rotating RSS sources...");
      await api.get("/news/reload-news");

      setStatusMessage("Scraping pending articles...");
      await api.post("/scraper/run");

      setStatusMessage("Generating article summaries...");
      await api.post("/summarize");

      setStatusMessage("Refreshing article list...");
      await fetchArticles(category);

      try {
        setStatusMessage("Analyzing news bias...");
        await api.post("/bias/run");
      } catch (error) {
        biasUnavailable = true;
        console.error("Bias analysis step failed:", error);
        setStatusMessage("Articles loaded. Bias analysis is temporarily unavailable.");
      }

      await Promise.all([fetchArticles(category), fetchAnalytics()]);

      if (!biasUnavailable) {
        setStatusMessage("Articles reloaded successfully.");
      }
    } catch (error) {
      console.error("Pipeline error:", error);
      setStatusMessage("Reload failed. Check backend logs.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const loadAnalytics = async () => {
      try {
        await fetchAnalytics();
      } catch (error) {
        console.error("Error fetching analytics:", error);
        setStatusMessage("Could not load analytics.");
      }
    };

    loadAnalytics();
  }, []);

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
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      <Header />

      <div className="w-full px-6 pb-16 pt-4 md:px-10 xl:px-16 space-y-6">
        <div className="flex flex-col gap-4 rounded-3xl border border-white/10 bg-white/5 p-6 shadow-2xl backdrop-blur-sm">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <p className="text-xs uppercase tracking-[0.3em] text-cyan-300">
                ADBMS Dashboard
              </p>
              <h1 className="mt-2 text-3xl font-semibold text-white">
                Filter, analyze, and relate news articles
              </h1>
              <p className="mt-2 text-sm text-gray-300 min-h-6">
                {statusMessage || "Explore categories, bias analytics, and similarity-based recommendations."}
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

        <section className="rounded-3xl border border-white/10 bg-slate-950/40 p-6 shadow-xl">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-xl font-semibold text-white">Category Bias Analytics</h2>
            <p className="text-sm text-gray-400">Average bias score per category</p>
          </div>

          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            {analytics.map((item) => (
              <div
                key={item.category}
                className="rounded-2xl border border-cyan-400/20 bg-white/5 p-4"
              >
                <p className="text-sm font-medium uppercase tracking-wide text-cyan-300">
                  {formatCategoryLabel(item.category)}
                </p>
                <p className="mt-3 text-3xl font-semibold text-white">
                  {Number(item.avgBias || 0).toFixed(2)}
                </p>
                <p className="mt-1 text-sm text-gray-400">
                  {item.totalArticles} articles
                </p>
              </div>
            ))}
          </div>
        </section>

        <section className="space-y-5">
          {sortedArticles.map((article) => (
            <ArticleCard key={article._id} article={article} />
          ))}
        </section>
      </div>
    </div>
  );
}

export default News;
