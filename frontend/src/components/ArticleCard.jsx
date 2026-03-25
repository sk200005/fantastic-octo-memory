import React, { useState } from "react";
import api from "../api/axios";
import { getLeanColor, getSentimentColor, getBiasLevel } from "../utils/biasUtils";

function formatCategory(category) {
  if (!category) {
    return "";
  }

  return category
    .replace(/([a-z])([A-Z])/g, "$1 $2")
    .replace(/^./, (letter) => letter.toUpperCase());
}

function getPreviewText(article) {
  const summary = article.summary?.trim();
  if (summary) {
    return summary;
  }

  const rawContent = article.rawContent?.trim();
  if (rawContent) {
    return `${rawContent.slice(0, 120)}...`;
  }

  const content = article.content?.trim();
  if (content) {
    return `${content.slice(0, 120)}...`;
  }

  return "";
}

function ArticleCard({ article }) {
  const biasScore = article.bias?.biasScore ?? article.biasScore;
  const sentiment = article.bias?.sentiment ?? article.sentiment;
  const politicalLean = article.bias?.politicalLean;
  const previewText = getPreviewText(article);
  const [recommendations, setRecommendations] = useState([]);
  const [isExpanded, setIsExpanded] = useState(false);
  const [isLoadingRecommendations, setIsLoadingRecommendations] = useState(false);

  const handleCardClick = async () => {
    const nextExpanded = !isExpanded;
    setIsExpanded(nextExpanded);

    if (!nextExpanded || recommendations.length > 0) {
      return;
    }

    try {
      setIsLoadingRecommendations(true);
      const res = await api.get(`/recommend/${article._id}`);
      setRecommendations(res.data);
    } catch (error) {
      console.error("Error fetching recommendations:", error);
      setRecommendations([]);
    } finally {
      setIsLoadingRecommendations(false);
    }
  };

  return (
    <div
      className="bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden border border-gray-200 hover:scale-[1.01] cursor-pointer"
      onClick={handleCardClick}
    >
      <div className="flex flex-col items-stretch sm:flex-row">
        {article.image && (
          <div className="h-56 w-full flex-shrink-0 overflow-hidden sm:h-auto sm:w-72 sm:self-stretch">
            <img
              src={article.image}
              alt={article.title}
              className="h-full w-full object-cover"
            />
          </div>
        )}

        <div className="p-7 flex flex-col gap-5 lg:flex-row lg:justify-between w-full">
          <div className="flex-1 pr-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-2 leading-snug">
              {article.title}
            </h2>

            <p className="text-sm text-gray-500 mb-3">
              <span className="font-medium">{article.source}</span>
              {article.category && (
                <>
                  <span className="mx-2">•</span>
                  <span className="inline-flex items-center rounded-full bg-blue-50 px-2.5 py-0.5 text-xs font-semibold text-blue-700">
                    {formatCategory(article.category)}
                  </span>
                </>
              )}
              <span className="mx-2">•</span>
              {new Date(article.publishedAt).toLocaleDateString()}
            </p>

            {previewText ? (
              <p className="text-gray-600 text-sm leading-relaxed line-clamp-4">
                {previewText}
              </p>
            ) : null}
          </div>

          <div className="lg:min-w-[370px] flex flex-col gap-5 lg:items-end lg:justify-between">
            {(biasScore !== undefined && biasScore !== null) && (
              <div className="flex flex-wrap lg:flex-nowrap gap-3 lg:justify-end">
                {politicalLean && (
                  <span
                    className={`px-4 py-2 rounded-full text-sm font-semibold whitespace-nowrap ${getLeanColor(politicalLean)}`}
                  >
                    {politicalLean}
                  </span>
                )}

                <span
                  className={`px-4 py-2 rounded-full text-sm font-semibold whitespace-nowrap ${getSentimentColor(sentiment)}`}
                >
                  {sentiment || "Neutral"}
                </span>

                <span className="px-4 py-2 rounded-full text-sm font-semibold whitespace-nowrap bg-gray-200 text-gray-700">
                  Bias {getBiasLevel(biasScore)} · {Math.round((biasScore || 0) * 100)}%
                </span>
              </div>
            )}

            <a
              href={article.link}
              target="_blank"
              rel="noreferrer"
              className="text-blue-600 text-sm font-medium hover:text-blue-700 hover:underline"
              onClick={(event) => event.stopPropagation()}
            >
              Read Full Article →
            </a>
          </div>
        </div>
      </div>

      {isExpanded && (
        <div className="border-t border-gray-200 bg-slate-50 px-7 py-5">
          <h3 className="text-sm font-semibold uppercase tracking-wide text-slate-700">
            Related Articles
          </h3>

          {isLoadingRecommendations ? (
            <p className="mt-3 text-sm text-slate-500">Loading recommendations...</p>
          ) : recommendations.length > 0 ? (
            <div className="mt-3 grid gap-3">
              {recommendations.map((recommendedArticle) => (
                <a
                  key={recommendedArticle._id}
                  href={recommendedArticle.link}
                  target="_blank"
                  rel="noreferrer"
                  className="rounded-xl border border-slate-200 bg-white px-4 py-3 transition hover:border-cyan-400 hover:shadow"
                  onClick={(event) => event.stopPropagation()}
                >
                  <p className="text-sm font-semibold text-slate-900">
                    {recommendedArticle.title}
                  </p>
                  <p className="mt-1 text-xs text-slate-500">
                    {recommendedArticle.source} • {formatCategory(recommendedArticle.category)}
                  </p>
                </a>
              ))}
            </div>
          ) : (
            <p className="mt-3 text-sm text-slate-500">
              No similar articles found yet.
            </p>
          )}
        </div>
      )}
    </div>
  );
}

export default ArticleCard;
