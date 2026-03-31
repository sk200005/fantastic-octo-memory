import React, { useEffect, useMemo, useState } from "react";
import api from "../api/axios";
import CategoryBiasAnalyticsSection from "../components/CategoryBiasAnalyticsSection";
import Footer from "../components/Footer";
import HeroSection from "../components/HeroSection";
import Navbar from "../components/Navbar";
import NewsCarousel from "../components/NewsCarousel";
import PublisherSection from "../components/PublisherSection";

function LandingPage() {
  const [latestNews, setLatestNews] = useState([]);

  useEffect(() => {
    const loadLatestNews = async () => {
      try {
        const response = await api.get("/news");
        setLatestNews(response.data);
      } catch (error) {
        console.error("Error loading latest news for homepage:", error);
      }
    };

    loadLatestNews();
  }, []);

  const latestNewsItems = useMemo(
    () =>
      [...latestNews]
        .filter((article) => article.image && (article.summary || article.rawContent || article.content))
        .sort(
          (firstArticle, secondArticle) =>
            new Date(secondArticle.publishedAt || 0).getTime() -
            new Date(firstArticle.publishedAt || 0).getTime()
        )
        .slice(0, 8),
    [latestNews]
  );

  return (
    <div className="min-h-screen bg-slate-50 text-slate-950">
      <Navbar />
      <main>
        <HeroSection />
        <NewsCarousel news={latestNewsItems} />
        <PublisherSection />
        <div className="px-6 pb-12 md:px-10 xl:px-16">
          <CategoryBiasAnalyticsSection className="mx-auto max-w-7xl" />
        </div>
      </main>
      <Footer />
    </div>
  );
}

export default LandingPage;
