import React from "react";
import { Link } from "react-router-dom";

function Navbar() {
  return (
    <header className="sticky top-0 z-50 border-b border-slate-200/80 bg-white/95 backdrop-blur">
      <div className="mx-auto flex w-full max-w-7xl items-center justify-between px-6 py-4 shadow-[0_10px_30px_rgba(15,23,42,0.04)] lg:px-10">
        <Link to="/" className="text-xl font-black tracking-[0.22em] text-slate-900">
          INSIGHT AI
        </Link>

        <nav className="hidden items-center gap-7 text-sm font-semibold text-slate-600 md:flex">
          <a href="#top" className="transition hover:text-slate-950">Home</a>
          <Link to="/news" className="transition hover:text-slate-950">News</Link>
          <Link to="/news" className="transition hover:text-slate-950">Bias Analysis</Link>
          <a href="#about" className="transition hover:text-slate-950">About</a>
          <Link
            to="/news"
            className="rounded-full bg-slate-950 px-5 py-2.5 text-white shadow-[0_14px_34px_rgba(15,23,42,0.16)] transition hover:bg-slate-800"
          >
            Login
          </Link>
        </nav>

        <Link
          to="/news"
          className="rounded-full bg-slate-950 px-4 py-2 text-sm font-semibold text-white shadow-[0_10px_24px_rgba(15,23,42,0.14)] transition hover:bg-slate-800 md:hidden"
        >
          News
        </Link>
      </div>
    </header>
  );
}

export default Navbar;
