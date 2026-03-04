import React from "react";

function NewsCard({ article }) {
  return (
    <a
      href={article.link}
      target="_blank"
      rel="noopener noreferrer"
      className="block"
    >
      <div className="flex gap-5 p-5 bg-white rounded-2xl shadow-sm hover:shadow-md transition-all duration-300 border border-gray-100">

        {/* Image */}
        <div className="w-40 h-32 flex-shrink-0 overflow-hidden rounded-xl">
          <img
            src={article.image}
            alt={article.title}
            className="w-full h-full object-cover"
          />
        </div>

        {/* Content */}
        <div className="flex flex-col justify-between flex-1">

          {/* Title */}
          <h2 className="text-lg font-semibold text-gray-900 hover:text-blue-600 transition-colors duration-200">
            {article.title}
          </h2>

          {/* Source + Date */}
          <div className="text-sm text-gray-500 mt-1">
            <span className="font-medium">{article.source}</span>
            <span className="mx-2">•</span>
            <span>
              {new Date(article.publishedAt).toLocaleDateString()}
            </span>
          </div>

          {/* Preview Text */}
          <p className="text-gray-600 mt-2 text-sm line-clamp-2">
            {article.content}
          </p>

          {/* Link */}
          <div className="mt-3 text-sm font-medium text-blue-600 hover:underline">
            Read Full Article →
          </div>

        </div>
      </div>
    </a>
  );
}

export default NewsCard;