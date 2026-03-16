import React, { useEffect, useState } from "react";
import api from "../api/axios";
import ArticleCard from "../components/ArticleCard";
import Header from "../components/Header";

function Articles() {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [statusMessage, setStatusMessage] = useState("");

  const fetchArticles = async () => {
    const res = await api.get("/articles");
    setArticles(res.data);
  };

  const reloadArticles = async () => {
    try {
      setLoading(true);
      setStatusMessage("Fetching 5 articles from RSS...");
      await api.get("/rss/fetch");

      setStatusMessage("Scraping pending articles...");
      await api.post("/scraper/run");

      setStatusMessage("Running Gemini bias analysis...");
      await api.post("/bias/run");

      await fetchArticles();
      setStatusMessage("Articles reloaded successfully.");
    } catch (error) {
      console.error("Pipeline error:", error);
      setStatusMessage("Reload failed. Check backend logs.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const loadInitialArticles = async () => {
      try {
        await fetchArticles();
      } catch (error) {
        console.error("Error fetching articles:", error);
        setStatusMessage("Could not load articles.");
      }
    };

    loadInitialArticles();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">

      <Header />

      <div className="w-full px-16 pb-16 space-y-6">

        {/* Reload Button */}
      <div className="flex items-center justify-between gap-4 mb-6">
        <p className="text-sm text-gray-300 min-h-6">
          {statusMessage}
        </p>
        <button
          onClick={reloadArticles}
          disabled={loading}
          className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg shadow disabled:opacity-50 disabled:cursor-not-allowed"
          >
          {loading ? "Processing..." : "Reload Articles"}
        </button>
      </div>
        {articles.map((article) => (
          <ArticleCard key={article._id} article={article} />
        ))}
      </div>

    </div>
  );
}

export default Articles;
