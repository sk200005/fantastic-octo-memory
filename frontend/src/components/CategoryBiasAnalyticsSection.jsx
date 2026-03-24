import React, { useEffect, useState } from "react";
import api from "../api/axios";

function formatCategoryLabel(category) {
  if (!category) {
    return "General";
  }

  return category.charAt(0).toUpperCase() + category.slice(1);
}

function CategoryBiasAnalyticsSection({ className = "" }) {
  const [analytics, setAnalytics] = useState([]);

  useEffect(() => {
    const loadAnalytics = async () => {
      try {
        const res = await api.get("/analytics/category-bias");
        setAnalytics(res.data);
      } catch (error) {
        console.error("Error fetching analytics:", error);
      }
    };

    loadAnalytics();
  }, []);

  const sortedAnalytics = [...analytics].sort(
    (firstItem, secondItem) => Number(secondItem.avgBias || 0) - Number(firstItem.avgBias || 0)
  );
  const highestBiasCategory = sortedAnalytics[0];
  const mostCoveredCategory = [...analytics].sort(
    (firstItem, secondItem) => (secondItem.totalArticles || 0) - (firstItem.totalArticles || 0)
  )[0];
  const averageBiasAcrossCategories =
    analytics.length > 0
      ? analytics.reduce((total, item) => total + Number(item.avgBias || 0), 0) / analytics.length
      : 0;
  const averageBiasPercentage = Math.round(averageBiasAcrossCategories * 100);

  return (
    <section
      id="bias-analytics"
      className={`rounded-[2rem] border border-[#48637f] bg-[linear-gradient(135deg,#374e68_0%,#425a75_55%,#4d6784_100%)] p-5 shadow-[0_24px_48px_rgba(43,60,79,0.18)] ${className}`.trim()}
    >
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-xl font-semibold text-[#fbf8f1]">Category Bias Analytics</h2>
        <p className="text-sm text-[#dfe8ef]">Average bias score per category</p>
      </div>

      <div className="grid gap-4 lg:grid-cols-[1.9fr_0.65fr]">
        <div className="rounded-[1.75rem] border border-[#5d7a98] bg-[linear-gradient(180deg,#48627d_0%,#53708d_100%)] p-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.06)]">
          <div className="mb-3 flex items-center justify-between">
            <p className="text-sm font-semibold uppercase tracking-[0.22em] text-[#b5d8f6]">
              Bias Distribution
            </p>
            <p className="text-xs text-[#dfe8ef]">Average bias by category</p>
          </div>

          <div className="space-y-3">
            {sortedAnalytics.map((item) => {
              const biasPercent = Math.max(0, Math.min(100, Number(item.avgBias || 0) * 100));
              return (
                <div
                  key={item.category}
                  className="rounded-2xl border border-[rgba(224,235,247,0.16)] bg-[rgba(255,255,255,0.08)] px-4 py-2.5"
                >
                  <div className="mb-2 flex items-start justify-between gap-4">
                    <div>
                      <p className="text-sm font-semibold uppercase tracking-wide text-[#fbf8f1]">
                        {formatCategoryLabel(item.category)}
                      </p>
                      <p className="mt-1 text-xs text-[#dfe8ef]">
                        {item.totalArticles} articles indexed
                      </p>
                    </div>

                    <div className="text-right">
                      <p className="text-2xl font-semibold text-[#fbf8f1]">
                        {Math.round(Number(item.avgBias || 0) * 100)}%
                      </p>
                      <p className="text-xs text-[#b5d8f6]">avg bias</p>
                    </div>
                  </div>

                  <div>
                    <div className="mb-1 flex items-center justify-between text-[11px] uppercase tracking-[0.2em] text-[#bfd8ed]">
                      <span>Bias Intensity</span>
                      <span>{Math.round(biasPercent)}%</span>
                    </div>
                    <div className="h-2.5 overflow-hidden rounded-full bg-[rgba(255,255,255,0.14)]">
                      <div
                        className="h-full rounded-full bg-[linear-gradient(90deg,#7fc6ff_0%,#b5d8f6_100%)]"
                        style={{ width: `${biasPercent}%` }}
                      />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="grid gap-4">
          <div className="rounded-[1.75rem] border border-[#6f8bac] bg-[linear-gradient(180deg,#4f6b88_0%,#5b7897_100%)] p-5 shadow-[inset_0_1px_0_rgba(255,255,255,0.06)]">
            <p className="text-sm font-semibold uppercase tracking-[0.22em] text-[#b5d8f6]">
              Bias Snapshot
            </p>

            <div className="mt-5 flex items-center gap-5">
              <div
                className="grid h-28 w-28 place-items-center rounded-full"
                style={{
                  background: `conic-gradient(#7fc6ff ${Math.round(
                    averageBiasAcrossCategories * 360
                  )}deg, rgba(255,255,255,0.14) 0deg)`,
                }}
              >
                <div className="grid h-20 w-20 place-items-center rounded-full bg-[#47627e] text-center">
                  <span className="text-2xl font-semibold text-[#fbf8f1]">
                    {averageBiasPercentage}%
                  </span>
                </div>
              </div>

              <div className="space-y-2">
                <p className="text-sm text-[#dfe8ef]">Average across all categories</p>
                <p className="text-xs uppercase tracking-[0.2em] text-[#b5d8f6]">
                  Overall Bias Level
                </p>
              </div>
            </div>
          </div>

          <div className="rounded-[1.75rem] border border-[#6f8bac] bg-[linear-gradient(180deg,#4f6b88_0%,#5b7897_100%)] p-5 shadow-[inset_0_1px_0_rgba(255,255,255,0.06)]">
            <p className="text-sm font-semibold uppercase tracking-[0.22em] text-[#b5d8f6]">
              Quick Highlights
            </p>

            <div className="mt-4 space-y-4">
              <div className="rounded-2xl bg-[rgba(255,255,255,0.08)] px-4 py-4">
                <p className="text-xs uppercase tracking-[0.2em] text-[#bfd8ed]">Highest Bias</p>
                <p className="mt-2 text-lg font-semibold text-[#fbf8f1]">
                  {highestBiasCategory ? formatCategoryLabel(highestBiasCategory.category) : "N/A"}
                </p>
                <p className="mt-1 text-sm text-[#dfe8ef]">
                  {highestBiasCategory
                    ? `${Math.round(Number(highestBiasCategory.avgBias || 0) * 100)}% average score`
                    : "No data"}
                </p>
              </div>

              <div className="rounded-2xl bg-[rgba(255,255,255,0.08)] px-4 py-4">
                <p className="text-xs uppercase tracking-[0.2em] text-[#bfd8ed]">Most Coverage</p>
                <p className="mt-2 text-lg font-semibold text-[#fbf8f1]">
                  {mostCoveredCategory ? formatCategoryLabel(mostCoveredCategory.category) : "N/A"}
                </p>
                <p className="mt-1 text-sm text-[#dfe8ef]">
                  {mostCoveredCategory
                    ? `${mostCoveredCategory.totalArticles} indexed articles`
                    : "No data"}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default CategoryBiasAnalyticsSection;
