import React from "react";
import CategoryBiasAnalyticsSection from "../components/CategoryBiasAnalyticsSection";
import Footer from "../components/Footer";
import Navbar from "../components/Navbar";

function BiasAnalysis() {
  return (
    <div className="min-h-screen bg-[linear-gradient(180deg,#e9eef5_0%,#dce5ef_100%)] text-slate-950">
      <Navbar />
      <main className="px-6 pb-16 pt-8 md:px-10 xl:px-16">
        <div className="mx-auto max-w-[1600px]">
          <CategoryBiasAnalyticsSection className="w-full" />
        </div>
      </main>
      <Footer />
    </div>
  );
}

export default BiasAnalysis;