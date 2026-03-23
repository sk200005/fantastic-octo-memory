import React from "react";

const publisherLogos = [
  { label: "BBC", tone: "bg-red-100 text-red-700" },
  { label: "CNN", tone: "bg-slate-900 text-white" },
  { label: "Nat Geo", tone: "bg-amber-100 text-amber-800" },
  { label: "TIME", tone: "bg-rose-100 text-rose-700" },
  { label: "YouTube", tone: "bg-red-50 text-red-600" },
  { label: "NBC", tone: "bg-indigo-100 text-indigo-700" },
  { label: "Traveler", tone: "bg-emerald-100 text-emerald-700" },
  { label: "Reuters", tone: "bg-orange-100 text-orange-700" },
  { label: "Bloomberg", tone: "bg-cyan-100 text-cyan-700" },
];

function PublisherSection() {
  return (
    <section id="about" className="bg-white py-24 sm:py-28">
      <div className="mx-auto grid max-w-7xl gap-14 px-6 lg:grid-cols-[0.95fr_1.05fr] lg:px-10">
        <div className="max-w-xl">
          <p className="text-sm font-black uppercase tracking-[0.28em] text-sky-700">
            FOR PUBLISHERS AND CREATORS
          </p>

          <h2 className="mt-5 text-4xl font-black uppercase leading-tight text-slate-950 sm:text-5xl">
            THE BEST PLATFORM TO AMPLIFY YOUR CONTENT
          </h2>

          <p className="mt-6 text-lg leading-8 text-slate-600">
            InSight AI helps publishers surface timely reporting, highlight perspective, and reach readers who
            care about context. Present smarter coverage, strengthen trust, and keep your stories moving through
            every major conversation.
          </p>

          <button className="mt-9 rounded-full border border-slate-900 px-7 py-3.5 text-sm font-bold uppercase tracking-[0.18em] text-slate-900 transition hover:bg-slate-900 hover:text-white">
            For Publishers
          </button>
        </div>

        <div className="grid grid-cols-3 gap-5 sm:grid-cols-3 lg:grid-cols-3 xl:grid-cols-3">
          {publisherLogos.map((publisher) => (
            <div
              key={publisher.label}
              className="flex aspect-square items-center justify-center rounded-full border border-slate-200 bg-white shadow-[0_22px_40px_rgba(15,23,42,0.08)]"
            >
              <div
                className={`flex h-20 w-20 items-center justify-center rounded-full text-center text-xs font-black uppercase tracking-[0.12em] ${publisher.tone} sm:h-24 sm:w-24 sm:text-sm`}
              >
                {publisher.label}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default PublisherSection;
