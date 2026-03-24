import React from "react";
import CategoryBiasAnalyticsSection from "../components/CategoryBiasAnalyticsSection";
import Footer from "../components/Footer";
import HeroSection from "../components/HeroSection";
import Navbar from "../components/Navbar";
import PublisherSection from "../components/PublisherSection";

function LandingPage() {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-950">
      <Navbar />
      <main>
        <HeroSection />
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
