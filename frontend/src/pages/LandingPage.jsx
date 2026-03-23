import React from "react";
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
      </main>
      <Footer />
    </div>
  );
}

export default LandingPage;
