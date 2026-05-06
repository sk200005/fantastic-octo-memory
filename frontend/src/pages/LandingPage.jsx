import React, { useEffect, useMemo, useState } from "react";
import api from "../api/axios";

import BiasInsightPreview from "../components/BiasInsightPreview";
import Footer from "../components/Footer";
import HeroSection from "../components/HeroSection";
import HowItWorksSection from "../components/HowItWorksSection";
import Navbar from "../components/Navbar";
import NewsCarousel from "../components/NewsCarousel";
import PdfArticleUpload from "../components/PdfArticleUpload";
import PublisherSection from "../components/PublisherSection";

function SectionBreak() {
  return (
    <div className="bg-[#f8fafc] px-6 py-7 md:px-10 xl:px-16">
      <div className="mx-auto flex max-w-7xl items-center gap-4">
        <div className="h-px flex-1 bg-slate-200/80" />
        <div className="h-2 w-2 rounded-full border border-slate-300 bg-white shadow-[0_4px_12px_rgba(15,23,42,0.08)]" />
        <div className="h-px flex-1 bg-slate-200/80" />
      </div>
    </div>
  );
}

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
        .filter((article) => article.title?.trim() && (article.image || article.isUserUploaded))
        .sort(
          (firstArticle, secondArticle) =>
            new Date(secondArticle.createdAt || secondArticle.publishedAt || 0).getTime() -
            new Date(firstArticle.createdAt || firstArticle.publishedAt || 0).getTime()
        )
        .slice(0, 8),
    [latestNews]
  );

  const handleUploadedArticle = (article) => {
    setLatestNews((currentNews) => [
      article,
      ...currentNews.filter((item) => item._id !== article._id),
    ]);
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-950">
      <Navbar />
      <main>
        <HeroSection />
        <NewsCarousel news={latestNewsItems} />
        <HowItWorksSection />
        <BiasInsightPreview />
        <SectionBreak />
        <PdfArticleUpload onArticleUploaded={handleUploadedArticle} />
        <SectionBreak />
        <PublisherSection />
      </main>
      <Footer />
    </div>
  );
}

export default LandingPage;
