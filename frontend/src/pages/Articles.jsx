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

  return (
    <div>
      <h1>Fetched News</h1>

      {articles.map((article) => (
        <div key={article._id} style={{ marginBottom: "20px" }}>
          <h3>{article.title}</h3>
          <p>{article.source}</p>
          <a href={article.link} target="_blank" rel="noreferrer">
            Read More
          </a>
        </div>
      ))}
    </div>
  );
}

export default Articles;