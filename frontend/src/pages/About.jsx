import React from "react";
import Footer from "../components/Footer";
import Navbar from "../components/Navbar";
import PublisherSection from "../components/PublisherSection";

/* ─────────────────────────────────────────
   Global styles + keyframes
───────────────────────────────────────── */
const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,700;0,900;1,700&display=swap');

  .about-hero-title { font-family: 'Playfair Display', Georgia, serif; }

  /* ── card hover lift ── */
  .how-card { transition: transform 0.28s ease, box-shadow 0.28s ease; }
  .how-card:hover { transform: translateY(-5px); box-shadow: 0 20px 48px rgba(0,0,0,0.09) !important; }

  .dev-card { transition: transform 0.28s ease, box-shadow 0.28s ease; }
  .dev-card:hover { transform: translateY(-4px); box-shadow: 0 20px 48px rgba(0,0,0,0.10) !important; }

  /* ── Pipeline: RSS dot traveling right ── */
  @keyframes dotTravel {
    0%   { transform: translateX(0px);   opacity: 0; }
    10%  { opacity: 1; }
    90%  { opacity: 1; }
    100% { transform: translateX(220px); opacity: 0; }
  }
  .pipe-dot { animation: dotTravel 3.2s cubic-bezier(.4,0,.6,1) infinite; }
  .pipe-dot:nth-child(2) { animation-delay: 1.06s; }
  .pipe-dot:nth-child(3) { animation-delay: 2.12s; }

  /* ── Step icon pulse ── */
  @keyframes iconPulse {
    0%, 100% { transform: scale(1);    opacity: 0.85; }
    50%       { transform: scale(1.08); opacity: 1; }
  }

  /* ── Collect: RSS wave ── */
  @keyframes rssWave {
    0%, 100% { opacity: 0.2; r: 6; }
    50%       { opacity: 0.8; r: 10; }
  }
  .rss-ring { animation: rssWave 2.4s ease-in-out infinite; }
  .rss-ring:nth-child(2) { animation-delay: 0.6s; }
  .rss-ring:nth-child(3) { animation-delay: 1.2s; }

  /* ── Summarize: lines shrink ── */
  @keyframes lineShrink {
    0%, 100% { transform: scaleX(1);    opacity: 0.35; }
    50%       { transform: scaleX(0.48); opacity: 0.9; }
  }
  .sum-line { transform-origin: left; animation: lineShrink 3s ease-in-out infinite; }
  .sum-line:nth-child(2) { animation-delay: 0.5s; }
  .sum-line:nth-child(3) { animation-delay: 1.0s; }
  .sum-line:nth-child(4) { animation-delay: 1.5s; }

  /* ── Bias: needle sweep ── */
  @keyframes needleSweep {
    0%, 100% { transform: rotate(-50deg); }
    50%       { transform: rotate(40deg);  }
  }
  .bias-needle {
    animation: needleSweep 4s ease-in-out infinite;
    transform-origin: 40px 44px;
  }

  /* ── Categorize: chip stagger ── */
  @keyframes chipAppear {
    0%, 100% { opacity: 0.15; transform: translateY(3px) scale(0.92); }
    50%       { opacity: 1;    transform: translateY(0)   scale(1); }
  }
  .cat-chip { animation: chipAppear 2.6s ease-in-out infinite; }
  .cat-chip:nth-child(2) { animation-delay: 0.65s; }
  .cat-chip:nth-child(3) { animation-delay: 1.3s; }
  .cat-chip:nth-child(4) { animation-delay: 1.95s; }
`;

/* ─────────────────────────────────────────
   Step SVG animations
───────────────────────────────────────── */
function CollectSVG() {
  return (
    <svg viewBox="0 0 80 72" className="w-16 h-14" fill="none">
      {/* document */}
      <rect x="20" y="10" width="40" height="50" rx="5" fill="#f0f9ff" stroke="#0ea5e9" strokeWidth="1.5" />
      {/* header bar */}
      <rect x="20" y="10" width="40" height="10" rx="5" fill="#bae6fd" />
      {/* rss waves */}
      <circle className="rss-ring" cx="32" cy="44" r="6"  stroke="#0ea5e9" strokeWidth="1.5" fill="none" />
      <circle className="rss-ring" cx="32" cy="44" r="10" stroke="#0ea5e9" strokeWidth="1.2" fill="none" />
      <circle className="rss-ring" cx="32" cy="44" r="14" stroke="#0ea5e9" strokeWidth="1.0" fill="none" />
      <circle cx="32" cy="44" r="2.5" fill="#0ea5e9" />
    </svg>
  );
}

function SummarizeSVG() {
  return (
    <svg viewBox="0 0 80 72" className="w-16 h-14" fill="none">
      {/* lines */}
      {[20, 30, 40, 50].map((y, i) => (
        <rect key={i} className="sum-line" x="14" y={y} width="52" height="5" rx="2.5" fill="#10b981" />
      ))}
      {/* down arrow */}
      <path d="M38 12 L42 8 L46 12" stroke="#10b981" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
      <line x1="42" y1="8" x2="42" y2="18" stroke="#10b981" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  );
}

function BiasSVG() {
  return (
    <svg viewBox="0 0 80 72" className="w-16 h-14" fill="none">
      {/* gauge track */}
      <path d="M14 50 A26 26 0 0 1 66 50" stroke="#fde68a" strokeWidth="9" strokeLinecap="round" />
      {/* active arc */}
      <path d="M14 50 A26 26 0 0 1 40 24" stroke="#f59e0b" strokeWidth="9" strokeLinecap="round" />
      {/* needle */}
      <g className="bias-needle">
        <line x1="40" y1="44" x2="40" y2="26" stroke="#92400e" strokeWidth="2.5" strokeLinecap="round" />
        <circle cx="40" cy="44" r="3.5" fill="#92400e" />
      </g>
      <text x="9"  y="63" fontSize="8" fill="#92400e" fontFamily="monospace" fontWeight="700">L</text>
      <text x="35" y="19" fontSize="8" fill="#92400e" fontFamily="monospace" fontWeight="700">C</text>
      <text x="63" y="63" fontSize="8" fill="#92400e" fontFamily="monospace" fontWeight="700">R</text>
    </svg>
  );
}

function CategorizeSVG() {
  const chips = [
    { label: "Politics", bg: "#818cf8" },
    { label: "Economy",  bg: "#34d399" },
    { label: "Sports",   bg: "#fbbf24" },
    { label: "War",      bg: "#f87171" },
  ];
  return (
    <div className="flex flex-wrap gap-1.5 justify-center items-center h-14 w-16">
      {chips.map((c) => (
        <span
          key={c.label}
          className="cat-chip rounded-full px-2 py-0.5 text-[9px] font-bold tracking-wide text-white"
          style={{ background: c.bg }}
        >
          {c.label}
        </span>
      ))}
    </div>
  );
}

/* ─────────────────────────────────────────
   Pipeline flow bar (connecting dots)
───────────────────────────────────────── */
function PipelineBar() {
  return (
    <div className="relative mx-auto mb-12 hidden max-w-4xl items-center justify-between lg:flex px-8">
      {/* track */}
      <div className="absolute inset-x-8 top-1/2 h-0.5 -translate-y-1/2 bg-slate-200 rounded-full" />
      {/* traveling dots */}
      <div className="absolute inset-x-8 top-1/2 -translate-y-1/2 overflow-hidden h-3 flex items-center">
        {[0, 1, 2].map((i) => (
          <div
            key={i}
            className="pipe-dot absolute h-2.5 w-2.5 rounded-full bg-sky-500 shadow-[0_0_6px_2px_rgba(14,165,233,0.45)]"
            style={{ left: 0 }}
          />
        ))}
      </div>
      {/* node markers */}
      {["01","02","03","04"].map((n) => (
        <div key={n} className="relative z-10 flex h-8 w-8 items-center justify-center rounded-full bg-white border-2 border-sky-400 text-[10px] font-black text-sky-600 shadow-md">
          {n}
        </div>
      ))}
    </div>
  );
}

/* ─────────────────────────────────────────
   Cards config
───────────────────────────────────────── */
const HOW_CARDS = [
  {
    step: "01",
    title: "Collect",
    body: "Fresh articles pulled from rotating RSS feeds across every category.",
    Anim: CollectSVG,
    accent: "#f0f9ff",
    border: "#bae6fd",
    tag: "#0ea5e9",
  },
  {
    step: "02",
    title: "Summarize",
    body: "Each article is distilled into concise, bullet-ready insights.",
    Anim: SummarizeSVG,
    accent: "#f0fdf4",
    border: "#6ee7b7",
    tag: "#10b981",
  },
  {
    step: "03",
    title: "Detect Bias",
    body: "Political lean and sentiment scored transparently per article.",
    Anim: BiasSVG,
    accent: "#fffbeb",
    border: "#fde68a",
    tag: "#f59e0b",
  },
  {
    step: "04",
    title: "Categorise",
    body: "Stories tagged by topic and region — filtered to what matters.",
    Anim: CategorizeSVG,
    accent: "#f5f3ff",
    border: "#c4b5fd",
    tag: "#8b5cf6",
  },
];

/* ─────────────────────────────────────────
   Developers data
───────────────────────────────────────── */
const DEVELOPERS = [
  {
    name: "Swayam Korde",
    role: "Backend & AI/ML Developer",
    email: "swayamkorde2005@gmail.com",
    img: "/dev_backend_ai.png",
    accent: "#0ea5e9",
    bg: "#f0f9ff",
    border: "#bae6fd",
  },
  {
    name: "Nitish Panse",
    role: "Frontend Developer",
    email: "nitishpanse6@gmail.com",
    img: "/dev_frontend_ui.png",
    accent: "#8b5cf6",
    bg: "#f5f3ff",
    border: "#c4b5fd",
  },
];

/* ─────────────────────────────────────────
   Page component
───────────────────────────────────────── */
function About() {
  return (
    <div className="min-h-screen bg-[linear-gradient(160deg,#0f172a_0%,#1e293b_55%,#0f172a_100%)] text-white">
      <style>{styles}</style>
      <Navbar />

      <main>

        {/* ══ SECTION 1 — Hero ══ */}
        <section className="relative flex flex-col items-center justify-center overflow-hidden px-6 pt-28 pb-20 text-center">
          <div
            aria-hidden
            className="pointer-events-none absolute inset-x-0 top-0 h-96 opacity-30"
            style={{ background: "radial-gradient(ellipse 70% 50% at 50% 0%, rgba(125,211,252,0.35) 0%, transparent 70%)" }}
          />
          <p className="mb-5 text-xs font-semibold uppercase tracking-[0.35em] text-[#7fc6ff]/60">Introducing</p>
          <h1 className="about-hero-title text-[clamp(4rem,12vw,9rem)] font-black italic leading-none tracking-tight text-white drop-shadow-[0_2px_40px_rgba(125,211,252,0.25)]">
            InSight News
          </h1>
          <p className="about-hero-title mt-5 text-[clamp(1rem,2.8vw,1.6rem)] font-bold italic tracking-[0.04em] text-[#7fc6ff]/75">
            Beyond the headline.
          </p>
          <div className="mt-14 h-px w-24 bg-gradient-to-r from-transparent via-[rgba(125,211,252,0.4)] to-transparent" />
        </section>

        {/* ══ SECTION 2 — Publisher (existing, light bg) ══ */}
        <div className="bg-[linear-gradient(180deg,#f8fafc_0%,#ffffff_100%)]">
          <PublisherSection />
        </div>

        {/* ══ SECTION 3 — How It Works (WHITE background) ══ */}
        <section className="bg-white px-6 py-24 md:px-10 xl:px-16">

          {/* header */}
          <div className="mx-auto mb-10 max-w-2xl text-center">
            <p className="text-xs font-semibold uppercase tracking-[0.32em] text-sky-500">
              Under the hood
            </p>
            <h2 className="mt-3 text-4xl font-black tracking-tight text-slate-900 sm:text-5xl">
              How InSight AI Works
            </h2>
            <p className="mt-3 text-base text-slate-500">
              Four automated steps. Raw headlines → structured intelligence.
            </p>
          </div>

          {/* animated pipeline connector */}
          <PipelineBar />

          {/* cards */}
          <div className="mx-auto grid max-w-5xl gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {HOW_CARDS.map((card) => (
              <div
                key={card.step}
                className="how-card flex flex-col items-center rounded-2xl p-6 text-center"
                style={{
                  background: card.accent,
                  border: `1px solid ${card.border}`,
                  boxShadow: "0 4px 18px rgba(0,0,0,0.05)",
                }}
              >
                {/* step badge */}
                <span
                  className="mb-4 rounded-full px-2.5 py-0.5 text-[10px] font-black uppercase tracking-[0.18em]"
                  style={{ background: card.border, color: card.tag }}
                >
                  {card.step}
                </span>

                {/* animation */}
                <div className="flex h-14 items-center justify-center mb-4">
                  <card.Anim />
                </div>

                <h3 className="text-base font-bold tracking-tight text-slate-800">{card.title}</h3>
                <p className="mt-1.5 text-sm leading-6 text-slate-500">{card.body}</p>
              </div>
            ))}
          </div>

          {/* trust note */}
          <div
            className="mx-auto mt-10 max-w-3xl rounded-2xl px-7 py-5 flex items-start gap-4"
            style={{ background: "#f8fafc", border: "1px solid #e2e8f0" }}
          >
            <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-sky-100">
              <svg className="h-4 w-4 text-sky-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10" />
                <line x1="12" y1="8"  x2="12"   y2="12" />
                <line x1="12" y1="16" x2="12.01" y2="16" />
              </svg>
            </div>
            <div>
              <p className="text-sm font-semibold text-slate-800">Assistive signals, not final verdicts</p>
              <p className="mt-1 text-sm leading-6 text-slate-500">
                Bias scores and summaries are AI-generated assistive signals — not editorial judgments. Always consult primary sources for critical decisions.
              </p>
            </div>
          </div>

        </section>

        {/* ══ SECTION 4 — Meet the Developers (WHITE background) ══ */}
        <section className="bg-white px-6 pb-24 pt-4 md:px-10 xl:px-16">

          {/* divider */}
          <div className="mx-auto mb-14 max-w-5xl border-t border-slate-100" />

          {/* header */}
          <div className="mx-auto mb-12 max-w-2xl text-center">
            <p className="text-xs font-semibold uppercase tracking-[0.32em] text-sky-500">The team</p>
            <h2 className="mt-3 text-4xl font-black tracking-tight text-slate-900 sm:text-5xl">
              Meet the Developers
            </h2>
            <p className="mt-3 text-base text-slate-500">Built with purpose by two developers who care about informed reading.</p>
          </div>

          {/* developer cards */}
          <div className="mx-auto grid max-w-3xl gap-8 sm:grid-cols-2">
            {DEVELOPERS.map((dev) => (
              <div
                key={dev.name}
                className="dev-card flex flex-col items-center rounded-2xl p-8 text-center"
                style={{
                  background: dev.bg,
                  border: `1px solid ${dev.border}`,
                  boxShadow: "0 4px 18px rgba(0,0,0,0.05)",
                }}
              >
                {/* illustration */}
                <div
                  className="mb-6 h-40 w-40 overflow-hidden rounded-2xl shadow-md"
                  style={{ border: `2px solid ${dev.border}` }}
                >
                  <img
                    src={dev.img}
                    alt={`${dev.name} — ${dev.role}`}
                    className="h-full w-full object-cover"
                    loading="lazy"
                    decoding="async"
                  />
                </div>

                {/* name */}
                <h3 className="text-xl font-black tracking-tight text-slate-900">{dev.name}</h3>

                {/* role badge */}
                <span
                  className="mt-2 rounded-full px-3 py-1 text-xs font-bold uppercase tracking-[0.15em]"
                  style={{ background: dev.border, color: dev.accent }}
                >
                  {dev.role}
                </span>

                {/* email */}
                <a
                  href={`mailto:${dev.email}`}
                  className="mt-4 text-sm font-medium transition-colors hover:underline"
                  style={{ color: dev.accent }}
                >
                  {dev.email}
                </a>
              </div>
            ))}
          </div>

        </section>

      </main>

      <Footer />
    </div>
  );
}

export default About;
