import React from "react";
import { getLeanColor, getSentimentColor, getBiasLevel } from "../utils/biasUtils";

function formatCategory(category) {
  if (!category) {
    return "";
  }

  return category
    .replace(/([a-z])([A-Z])/g, "$1 $2")
    .replace(/^./, (letter) => letter.toUpperCase());
}

function ArticleCard({ article }) {
  return (
    <div className="bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 flex items-start overflow-hidden border border-gray-200 hover:scale-[1.01]">
      {article.image && (
        <div className="w-72 h-full flex-shrink-0 overflow-hidden">
          <img
            src={article.image}
            alt={article.title}
            className="w-full h-full object-cover"
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

          <p className="text-gray-600 text-sm leading-relaxed line-clamp-4">
            {article.summary || `${article.rawContent?.slice(0, 120) || ""}...`}
          </p>
        </div>

        <div className="lg:min-w-[370px] flex flex-col gap-5 lg:items-end lg:justify-between">
          {article.bias?.biasScore !== undefined && (
            <div className="flex flex-wrap lg:flex-nowrap gap-3 lg:justify-end">
              <span
                className={`px-4 py-2 rounded-full text-sm font-semibold whitespace-nowrap ${getLeanColor(article.bias.politicalLean)}`}
              >
                {article.bias.politicalLean}
              </span>

              <span
                className={`px-4 py-2 rounded-full text-sm font-semibold whitespace-nowrap ${getSentimentColor(article.bias.sentiment)}`}
              >
                {article.bias.sentiment}
              </span>

              <span className="px-4 py-2 rounded-full text-sm font-semibold whitespace-nowrap bg-gray-200 text-gray-700">
                Bias {getBiasLevel(article.bias.biasScore)} · {Math.round(article.bias.biasScore * 100)}%
              </span>
            </div>
          )}

          <a
            href={article.link}
            target="_blank"
            rel="noreferrer"
            className="text-blue-600 text-sm font-medium hover:text-blue-700 hover:underline"
          >
            Read Full Article →
          </a>
        </div>
      </div>
    </div>
  );
}

export default ArticleCard;
