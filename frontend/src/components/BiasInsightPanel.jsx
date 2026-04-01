import React from "react";

function getBiasLevelLabel(score) {
  const numericScore = Number(score) || 0;

  if (numericScore < 0.2) {
    return "neutral";
  }

  if (numericScore < 0.4) {
    return "slight bias";
  }

  if (numericScore < 0.7) {
    return "moderate bias";
  }

  return "strong bias";
}

function getPerspectiveInsight(score) {
  const numericScore = Number(score);

  if (numericScore > 0.7) {
    return "presents multiple viewpoints";
  }

  if (numericScore >= 0.4) {
    return "includes limited opposing viewpoints";
  }

  return "presents a one-sided narrative";
}

function formatValue(value, fallback) {
  const normalized = String(value || "").trim();
  return normalized || fallback;
}

function BiasInsightPanel({ bias }) {
  const biasLevel = getBiasLevelLabel(bias?.biasScoreFinal);
  const framingType = formatValue(bias?.framingType, "neutral");
  const emotionalTone = formatValue(bias?.emotionalTone, "neutral");
  const missingPerspective = formatValue(
    bias?.missingPerspective,
    "No major missing perspective detected."
  );
  const perspectiveInsight = getPerspectiveInsight(bias?.perspectiveBalanceScore);
  const generatedInsight = `This article shows ${biasLevel} bias and uses ${framingType} framing. The article ${perspectiveInsight}.`;

  return (
    <div className="grid gap-5 rounded-[1.75rem] border border-slate-200/90 bg-gradient-to-br from-slate-50 via-white to-sky-50/55 p-5 shadow-[inset_0_1px_0_rgba(255,255,255,0.68),0_18px_45px_rgba(15,23,42,0.05)] sm:p-6">
      <div className="grid gap-4 lg:grid-cols-[190px_190px_minmax(0,1fr)]">
        <div className="rounded-2xl border border-slate-200/80 bg-white px-5 py-5 shadow-[0_8px_24px_rgba(15,23,42,0.05)]">
          <p className="text-[0.78rem] font-semibold uppercase tracking-[0.24em] text-slate-500">
            Framing
          </p>
          <p className="mt-3 text-[1.02rem] font-semibold capitalize leading-8 text-slate-900 sm:text-[1.05rem]">
            {framingType}
          </p>
        </div>

        <div className="rounded-2xl border border-slate-200/80 bg-white px-5 py-5 shadow-[0_8px_24px_rgba(15,23,42,0.05)]">
          <p className="text-[0.78rem] font-semibold uppercase tracking-[0.24em] text-slate-500">
            Tone
          </p>
          <p className="mt-3 text-[1.02rem] font-semibold leading-8 text-slate-900 sm:text-[1.05rem]">
            {emotionalTone}
          </p>
        </div>

        <div className="rounded-2xl border border-slate-200/80 bg-white px-5 py-5 shadow-[0_8px_24px_rgba(15,23,42,0.05)]">
          <p className="text-[0.78rem] font-semibold uppercase tracking-[0.24em] text-slate-500">
            Missing Perspective
          </p>
          <p className="mt-3 text-[1.02rem] leading-8 text-slate-700 sm:text-[1.05rem]">
            {missingPerspective}
          </p>
        </div>
      </div>

      <div className="relative overflow-hidden rounded-[1.5rem] border border-slate-200/80 bg-white px-5 py-5 shadow-[0_10px_28px_rgba(15,23,42,0.06)] ring-1 ring-sky-100/80 sm:px-6 sm:py-6">
        <div className="pointer-events-none absolute inset-y-0 left-0 w-1.5 bg-gradient-to-b from-sky-400 via-blue-400 to-cyan-300" />
        <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-sky-200 via-transparent to-transparent" />
        <p className="pl-4 text-[0.78rem] font-semibold uppercase tracking-[0.24em] text-slate-500">
          Insight
        </p>
        <p className="mt-3 max-w-5xl pl-4 text-[1.02rem] leading-8 text-slate-800 sm:text-[1.05rem]">
          {generatedInsight}
        </p>
      </div>
    </div>
  );
}

export default BiasInsightPanel;
