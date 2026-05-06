import React from "react";

const styles = `
  .how-card { transition: transform 0.28s ease, box-shadow 0.28s ease, border-color 0.28s ease; }
  .how-card:hover { transform: translateY(-5px); box-shadow: 0 24px 54px rgba(15,23,42,0.16) !important; }

  @keyframes dotTravel {
    0% { transform: translateX(0px); opacity: 0; }
    10% { opacity: 1; }
    90% { opacity: 1; }
    100% { transform: translateX(220px); opacity: 0; }
  }
  .pipe-dot { animation: dotTravel 3.2s cubic-bezier(.4,0,.6,1) infinite; }
  .pipe-dot:nth-child(2) { animation-delay: 1.06s; }
  .pipe-dot:nth-child(3) { animation-delay: 2.12s; }

  @keyframes rssWave {
    0%, 100% { opacity: 0.2; r: 6; }
    50% { opacity: 0.8; r: 10; }
  }
  .rss-ring { animation: rssWave 2.4s ease-in-out infinite; }
  .rss-ring:nth-child(2) { animation-delay: 0.6s; }
  .rss-ring:nth-child(3) { animation-delay: 1.2s; }

  @keyframes lineShrink {
    0%, 100% { transform: scaleX(1); opacity: 0.35; }
    50% { transform: scaleX(0.48); opacity: 0.9; }
  }
  .sum-line { transform-origin: left; animation: lineShrink 3s ease-in-out infinite; }
  .sum-line:nth-child(2) { animation-delay: 0.5s; }
  .sum-line:nth-child(3) { animation-delay: 1.0s; }
  .sum-line:nth-child(4) { animation-delay: 1.5s; }

  @keyframes needleSweep {
    0%, 100% { transform: rotate(-50deg); }
    50% { transform: rotate(40deg); }
  }
  .bias-needle {
    animation: needleSweep 4s ease-in-out infinite;
    transform-origin: 40px 44px;
  }

  @keyframes chipAppear {
    0%, 100% { opacity: 0.15; transform: translateY(3px) scale(0.92); }
    50% { opacity: 1; transform: translateY(0) scale(1); }
  }
  .cat-chip { animation: chipAppear 2.6s ease-in-out infinite; }
  .cat-chip:nth-child(2) { animation-delay: 0.65s; }
  .cat-chip:nth-child(3) { animation-delay: 1.3s; }
  .cat-chip:nth-child(4) { animation-delay: 1.95s; }
`;

function CollectSVG() {
  return (
    <svg viewBox="0 0 80 72" className="h-14 w-16" fill="none">
      <rect x="20" y="10" width="40" height="50" rx="5" fill="#f0f9ff" stroke="#0ea5e9" strokeWidth="1.5" />
      <rect x="20" y="10" width="40" height="10" rx="5" fill="#bae6fd" />
      <circle className="rss-ring" cx="32" cy="44" r="6" stroke="#0ea5e9" strokeWidth="1.5" fill="none" />
      <circle className="rss-ring" cx="32" cy="44" r="10" stroke="#0ea5e9" strokeWidth="1.2" fill="none" />
      <circle className="rss-ring" cx="32" cy="44" r="14" stroke="#0ea5e9" strokeWidth="1" fill="none" />
      <circle cx="32" cy="44" r="2.5" fill="#0ea5e9" />
    </svg>
  );
}

function SummarizeSVG() {
  return (
    <svg viewBox="0 0 80 72" className="h-14 w-16" fill="none">
      {[20, 30, 40, 50].map((y) => (
        <rect key={y} className="sum-line" x="14" y={y} width="52" height="5" rx="2.5" fill="#10b981" />
      ))}
      <path d="M38 12 L42 8 L46 12" stroke="#10b981" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
      <line x1="42" y1="8" x2="42" y2="18" stroke="#10b981" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  );
}

function BiasSVG() {
  return (
    <svg viewBox="0 0 80 72" className="h-14 w-16" fill="none">
      <path d="M14 50 A26 26 0 0 1 66 50" stroke="#fde68a" strokeWidth="9" strokeLinecap="round" />
      <path d="M14 50 A26 26 0 0 1 40 24" stroke="#f59e0b" strokeWidth="9" strokeLinecap="round" />
      <g className="bias-needle">
        <line x1="40" y1="44" x2="40" y2="26" stroke="#92400e" strokeWidth="2.5" strokeLinecap="round" />
        <circle cx="40" cy="44" r="3.5" fill="#92400e" />
      </g>
      <text x="9" y="63" fontSize="8" fill="#92400e" fontFamily="monospace" fontWeight="700">L</text>
      <text x="35" y="19" fontSize="8" fill="#92400e" fontFamily="monospace" fontWeight="700">C</text>
      <text x="63" y="63" fontSize="8" fill="#92400e" fontFamily="monospace" fontWeight="700">R</text>
    </svg>
  );
}

function CategorizeSVG() {
  const chips = [
    { label: "Politics", bg: "#818cf8" },
    { label: "Economy", bg: "#34d399" },
    { label: "Sports", bg: "#fbbf24" },
    { label: "War", bg: "#f87171" },
  ];

  return (
    <div className="flex h-14 w-16 flex-wrap items-center justify-center gap-1.5">
      {chips.map((chip) => (
        <span
          key={chip.label}
          className="cat-chip rounded-full px-2 py-0.5 text-[9px] font-bold tracking-wide text-white"
          style={{ background: chip.bg }}
        >
          {chip.label}
        </span>
      ))}
    </div>
  );
}

function PipelineBar() {
  return (
    <div className="relative mx-auto mb-12 hidden max-w-5xl items-center justify-between px-8 lg:flex">
      <div className="absolute inset-x-8 top-1/2 h-0.5 -translate-y-1/2 rounded-full bg-slate-200" />
      <div className="absolute inset-x-8 top-1/2 flex h-3 -translate-y-1/2 items-center overflow-hidden">
        {[0, 1, 2].map((item) => (
          <div
            key={item}
            className="pipe-dot absolute h-2.5 w-2.5 rounded-full bg-sky-500 shadow-[0_0_6px_2px_rgba(14,165,233,0.45)]"
            style={{ left: 0 }}
          />
        ))}
      </div>
      {["01", "02", "03", "04"].map((step) => (
        <div key={step} className="relative z-10 flex h-9 w-9 items-center justify-center rounded-full border-2 border-sky-400 bg-white text-[11px] font-black text-sky-600 shadow-md">
          {step}
        </div>
      ))}
    </div>
  );
}

const cards = [
  {
    step: "01",
    title: "Collect",
    body: "Fresh articles pulled from rotating RSS feeds across every category.",
    Anim: CollectSVG,
    accent: "#ffffff",
    border: "#7dd3fc",
    tag: "#0ea5e9",
  },
  {
    step: "02",
    title: "Summarize",
    body: "Each article is distilled into concise, bullet-ready insights.",
    Anim: SummarizeSVG,
    accent: "#ffffff",
    border: "#6ee7b7",
    tag: "#10b981",
  },
  {
    step: "03",
    title: "Detect Bias",
    body: "Political lean and sentiment scored transparently per article.",
    Anim: BiasSVG,
    accent: "#ffffff",
    border: "#fcd34d",
    tag: "#f59e0b",
  },
  {
    step: "04",
    title: "Categorise",
    body: "Stories tagged by topic and region, filtered to what matters.",
    Anim: CategorizeSVG,
    accent: "#ffffff",
    border: "#a78bfa",
    tag: "#8b5cf6",
  },
];

function HowItWorksSection({ className = "" }) {
  return (
    <section className={`deferred-section bg-[linear-gradient(180deg,#eef4fb_0%,#f6f9fc_14%,#f8fafc_86%,#eef4fb_100%)] px-6 py-24 md:px-10 xl:px-16 ${className}`.trim()}>
      <style>{styles}</style>

      <div className="mx-auto mb-10 max-w-2xl text-center">
        <p className="text-xs font-semibold uppercase tracking-[0.32em] text-sky-500">
          Under the hood
        </p>
        <h2 className="mt-3 text-4xl font-black tracking-tight text-slate-900 sm:text-5xl">
          How InSight AI Works
        </h2>
        <p className="mt-3 text-base font-medium text-slate-600">
          Four automated steps. Raw headlines to structured intelligence.
        </p>
      </div>

      <PipelineBar />

      <div className="mx-auto grid max-w-6xl gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {cards.map((card) => (
          <div
            key={card.step}
            className="how-card flex min-h-[16rem] flex-col items-center rounded-2xl p-6 text-center"
            style={{
              background: card.accent,
              border: `1.5px solid ${card.border}`,
              boxShadow: "0 16px 36px rgba(15,23,42,0.09)",
            }}
          >
            <span
              className="mb-4 rounded-full px-2.5 py-0.5 text-[10px] font-black uppercase tracking-[0.18em]"
              style={{ background: card.border, color: card.tag }}
            >
              {card.step}
            </span>

            <div className="mb-4 flex h-14 items-center justify-center">
              <card.Anim />
            </div>

            <h3 className="text-lg font-black tracking-tight text-slate-950">
              {card.title}
            </h3>
            <p className="mt-2 text-sm font-medium leading-6 text-slate-600">{card.body}</p>
          </div>
        ))}
      </div>

      <div className="mx-auto mt-10 flex max-w-4xl items-start gap-4 rounded-2xl border border-slate-200 bg-white px-7 py-5 shadow-[0_14px_30px_rgba(15,23,42,0.06)]">
        <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-sky-100">
          <svg className="h-4 w-4 text-sky-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10" />
            <line x1="12" y1="8" x2="12" y2="12" />
            <line x1="12" y1="16" x2="12.01" y2="16" />
          </svg>
        </div>
        <div>
          <p className="text-sm font-semibold text-slate-800">
            Assistive signals, not final verdicts
          </p>
          <p className="mt-1 text-sm leading-6 text-slate-500">
            Bias scores and summaries are AI-generated assistive signals, not editorial judgments. Always consult primary sources for critical decisions.
          </p>
        </div>
      </div>
    </section>
  );
}

export default HowItWorksSection;
