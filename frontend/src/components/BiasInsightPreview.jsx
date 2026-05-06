import React from "react";
import { Link } from "react-router-dom";

const categoryBars = [
  { label: "Politics", width: "78%", color: "bg-sky-300" },
  { label: "Economy", width: "58%", color: "bg-emerald-300" },
  { label: "Sports", width: "31%", color: "bg-amber-300" },
];

function BiasInsightPreview() {
  return (
    <section className="deferred-section bg-[linear-gradient(180deg,#eef4fb_0%,#f6f9fc_44%,#f8fafc_100%)] px-6 pb-22 pt-20 md:px-10 xl:px-16">
      <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
        <div className="max-w-xl">
          <p className="text-sm font-black uppercase tracking-[0.28em] text-sky-700">
            Bias Insight
          </p>
          <h2 className="mt-4 text-3xl font-black uppercase leading-tight text-slate-950 sm:text-4xl">
            Compare coverage before you form a view
          </h2>
          <p className="mt-5 text-base leading-7 text-slate-600 sm:text-lg">
            The homepage now gives a quick sense of the bias layer before sending readers into the full analytics workspace.
          </p>
          <Link
            to="/bias-analysis"
            className="mt-8 inline-flex rounded-full border border-slate-950 bg-slate-950 px-6 py-3 text-sm font-bold uppercase tracking-[0.18em] text-white shadow-[0_14px_28px_rgba(15,23,42,0.14)] transition hover:-translate-y-0.5 hover:bg-slate-800"
          >
            Open Analytics
          </Link>
        </div>

        <div className="grid gap-5 md:grid-cols-[0.95fr_1.05fr]">
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-[0_16px_34px_rgba(15,23,42,0.08)]">
            <p className="text-xs font-bold uppercase tracking-[0.24em] text-slate-400">
              Article signal
            </p>
            <div className="mt-6 flex items-end justify-between gap-5">
              <div>
                <p className="text-5xl font-black text-slate-950">64%</p>
                <p className="mt-2 text-sm font-semibold text-slate-500">
                  estimated bias intensity
                </p>
              </div>
              <div className="flex h-24 w-24 items-center justify-center rounded-full border-[12px] border-sky-200 border-t-sky-500 text-sm font-black text-sky-700">
                Live
              </div>
            </div>
            <div className="mt-7 grid grid-cols-3 overflow-hidden rounded-full border border-slate-200 bg-slate-100">
              <div className="h-4 bg-blue-700" />
              <div className="h-4 bg-slate-200" />
              <div className="h-4 bg-rose-600" />
            </div>
            <div className="mt-3 flex justify-between text-xs font-bold uppercase tracking-[0.18em] text-slate-400">
              <span>Left</span>
              <span>Center</span>
              <span>Right</span>
            </div>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-[0_16px_34px_rgba(15,23,42,0.08)]">
            <p className="text-xs font-bold uppercase tracking-[0.24em] text-slate-400">
              Category snapshot
            </p>
            <div className="mt-6 space-y-5">
              {categoryBars.map((item) => (
                <div key={item.label}>
                  <div className="mb-2 flex items-center justify-between text-sm font-semibold text-slate-700">
                    <span>{item.label}</span>
                    <span>{item.width}</span>
                  </div>
                  <div className="h-3 overflow-hidden rounded-full bg-slate-100">
                    <div className={`h-full rounded-full ${item.color}`} style={{ width: item.width }} />
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-7 rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm leading-6 text-slate-600">
              Track source neutrality, high-bias stories, and category-level patterns from one focused dashboard.
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default BiasInsightPreview;
