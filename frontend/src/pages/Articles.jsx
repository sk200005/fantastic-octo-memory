import React, { useEffect, useState } from "react";
import api from "../api/axios.js";

function Articles() {
  const [articles, setArticles] = useState([]);

  useEffect(() => {
    const fetchArticles = async () => {
      try {
        const res = await api.get("/articles");
        setArticles(res.data);
      } catch (error) {
        console.error("Error fetching articles:", error);
      }
    };

    fetchArticles();
  }, []);

  const getLeanColor = (lean) => {
    switch (lean) {
      case "Left":
        return "bg-blue-100 text-blue-700";
      case "Right":
        return "bg-red-100 text-red-700";
      case "Center":
        return "bg-purple-100 text-purple-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  const getSentimentColor = (sentiment) => {
    switch (sentiment) {
      case "Positive":
        return "bg-green-100 text-green-700";
      case "Negative":
        return "bg-red-100 text-red-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  const getBiasLevel = (score) => {
    if (!score) return "Low";
    if (score < 0.3) return "Low";
    if (score < 0.6) return "Moderate";
    return "High";
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">

      {/* Header */}
      <div className="w-full px-16 pt-12 pb-6">
        <h1 className="text-4xl font-bold text-white tracking-tight">
          InSight AI
        </h1>
        <p className="text-gray-300 mt-2 text-sm">
          AI-powered news bias analysis and aggregation
        </p>
      </div>

      {/* Articles Container */}
      <div className="w-full px-16 pb-16 space-y-6">

        {articles.map((article) => (
          <div
            key={article._id}
            className="bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 flex overflow-hidden border border-gray-200 hover:scale-[1.01]"
          >

            {/* Image */}
            {article.image && (
              <div className="w-64 h-40 flex-shrink-0 overflow-hidden">
                <img
                  src={article.image}
                  alt={article.title}
                  className="h-full w-full object-cover"
                />
              </div>
            )}

            {/* Content */}
            <div className="p-6 flex flex-col justify-between w-full">

              <div>
                {/* Title */}
                <h2 className="text-xl font-semibold text-gray-900 mb-2 leading-snug">
                  {article.title}
                </h2>

                {/* Source */}
                <p className="text-sm text-gray-500 mb-3">
                  <span className="font-medium">{article.source}</span>
                  <span className="mx-2">•</span>
                  {new Date(article.publishedAt).toLocaleDateString()}
                </p>

                {/* Preview */}
                <p className="text-gray-600 text-sm leading-relaxed line-clamp-2">
                  {article.content?.slice(0, 150)}...
                </p>
              </div>

              {/* Bias Section */}
              {article.bias?.biasScore !== undefined && (
                <div className="flex flex-wrap gap-2 mt-4">

                  <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getLeanColor(article.bias.politicalLean)}`}>
                    {article.bias.politicalLean}
                  </span>

                  <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getSentimentColor(article.bias.sentiment)}`}>
                    {article.bias.sentiment}
                  </span>

                  <span className="px-3 py-1 rounded-full text-xs font-semibold bg-gray-200 text-gray-800">
                    Bias {getBiasLevel(article.bias.biasScore)} · {Math.round(article.bias.biasScore * 100)}%
                  </span>

                </div>
              )}

              {/* Link */}
              <div className="mt-4">
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
        ))}

      </div>
    </div>
  );
}

export default Articles;