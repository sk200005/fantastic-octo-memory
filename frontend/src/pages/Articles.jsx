import React, { useEffect, useState } from "react";
import api from "../api/axios";
import ArticleCard from "../components/ArticleCard";
import Header from "../components/Header";

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

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">

      <Header />

      <div className="w-full px-16 pb-16 space-y-6">
        {articles.map((article) => (
          <ArticleCard key={article._id} article={article} />
        ))}
      </div>

    </div>
  );
}

export default Articles;