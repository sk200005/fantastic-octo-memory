import React from "react";
import { Link } from "react-router-dom";

const navLogoSrc = encodeURI("/headLogo/Screenshot 2026-03-24 at 11.36.12 PM.png");

function Navbar() {
  return (
    <header className="sticky top-0 z-50 border-b border-slate-200/80 bg-[#F4F5F6] backdrop-blur">
      <div className="mx-auto flex w-full max-w-7xl items-center justify-between px-2 py-4 shadow-[0_10px_30px_rgba(15,23,42,0.04)] lg:px-3">
        <Link to="/" className="-ml-35 flex items-center lg:-ml-40">
          <img
            src={navLogoSrc}
            alt="InSight AI"
            className="h-auto w-full max-w-[7.75rem] object-contain"
          />
        </Link>

        <nav className="hidden items-center gap-7 text-sm font-semibold text-slate-600 md:flex">
          <a href="/#top" className="transition hover:text-slate-950">Home</a>
          <Link to="/news" className="transition hover:text-slate-950">News</Link>
          <a href="/#bias-analytics" className="transition hover:text-slate-950">Bias Analysis</a>
          <a href="/#about" className="transition hover:text-slate-950">About</a>
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
