import React from "react";
import { Link } from "react-router-dom";

const navLogoSrc = encodeURI("/headLogo/Screenshot 2026-03-24 at 11.36.12 PM.png");

function Navbar() {
  return (
    <header className="sticky top-0 z-50 border-b border-slate-200/80 bg-[#F4F5F6]/95">
      <div className="mx-auto flex w-full max-w-7xl items-center justify-between px-2 py-4 shadow-[0_6px_18px_rgba(15,23,42,0.04)] lg:px-3">
        <Link to="/" className="-ml-35 flex items-center lg:-ml-40">
          <img
            src={navLogoSrc}
            alt="InSight AI"
            className="h-auto w-full max-w-[7.75rem] object-contain"
            decoding="async"
            fetchPriority="high"
          />
        </Link>

        <nav className="ml-auto hidden translate-x-6 items-center gap-10 pl-10 text-[1.05rem] font-semibold text-slate-600 md:flex lg:translate-x-10 lg:pl-16">
          <Link
            to={{ pathname: "/", hash: "#top" }}
            className="rounded-full px-2 py-1.5 transition-all duration-300 hover:-translate-y-0.5 hover:bg-slate-300 hover:text-[#01040c] hover:shadow-[0_12px_24px_rgba(2,8,23,0.18)] focus-visible:-translate-y-0.5 focus-visible:bg-slate-300 focus-visible:text-[#01040c] focus-visible:outline-none"
          >
            Home
          </Link>
          <Link
            to="/news"
            className="rounded-full px-2 py-1.5 transition-all duration-300 hover:-translate-y-0.5 hover:bg-slate-300 hover:text-[#01040c] hover:shadow-[0_12px_24px_rgba(2,8,23,0.18)] focus-visible:-translate-y-0.5 focus-visible:bg-slate-300 focus-visible:text-[#01040c] focus-visible:outline-none"
          >
            News
          </Link>
          <Link
            to="/bias-analysis"
            className="rounded-full px-2 py-1.5 transition-all duration-300 hover:-translate-y-0.5 hover:bg-slate-300 hover:text-[#01040c] hover:shadow-[0_12px_24px_rgba(2,8,23,0.18)] focus-visible:-translate-y-0.5 focus-visible:bg-slate-300 focus-visible:text-[#01040c] focus-visible:outline-none"
          >
            Bias Analysis
          </Link>
          <Link
            to="/about"
            className="rounded-full px-2 py-1.5 transition-all duration-300 hover:-translate-y-0.5 hover:bg-slate-300 hover:text-[#01040c] hover:shadow-[0_12px_24px_rgba(2,8,23,0.18)] focus-visible:-translate-y-0.5 focus-visible:bg-slate-300 focus-visible:text-[#01040c] focus-visible:outline-none"
          >
            About
          </Link>
        </nav>

        <Link
          to="/news"
          className="rounded-full bg-slate-950 px-4 py-2 text-sm font-semibold text-white shadow-[0_8px_18px_rgba(15,23,42,0.12)] transition hover:bg-slate-800 md:hidden"
        >
          News
        </Link>
      </div>
    </header>
  );
}

export default Navbar;
