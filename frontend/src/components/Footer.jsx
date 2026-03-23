import React from "react";

function Footer() {
  return (
    <footer className="bg-slate-950 text-white">
      <div className="mx-auto grid max-w-7xl gap-12 px-6 py-16 lg:grid-cols-[1.25fr_repeat(3,0.75fr)] lg:px-10">
        <div>
          <div className="text-2xl font-black tracking-[0.22em] text-white">INSIGHT AI</div>
          <p className="mt-5 max-w-sm text-sm leading-7 text-slate-300">
            Discover balanced reporting, compare perspectives, and stay closer to the stories shaping the world.
          </p>
        </div>

        <div>
          <h3 className="text-sm font-black uppercase tracking-[0.2em] text-slate-400">Product</h3>
          <ul className="mt-5 space-y-3 text-sm text-slate-200">
            <li>Features</li>
            <li>News</li>
            <li>Bias Analysis</li>
          </ul>
        </div>

        <div>
          <h3 className="text-sm font-black uppercase tracking-[0.2em] text-slate-400">Company</h3>
          <ul className="mt-5 space-y-3 text-sm text-slate-200">
            <li>About</li>
            <li>Careers</li>
            <li>Contact</li>
          </ul>
        </div>

        <div>
          <h3 className="text-sm font-black uppercase tracking-[0.2em] text-slate-400">Social</h3>
          <ul className="mt-5 space-y-3 text-sm text-slate-200">
            <li>Twitter</li>
            <li>LinkedIn</li>
            <li>GitHub</li>
          </ul>
        </div>
      </div>

      <div className="border-t border-white/10">
        <div className="mx-auto max-w-7xl px-6 py-6 text-sm text-slate-400 lg:px-10">
          © 2026 InSight AI
        </div>
      </div>
    </footer>
  );
}

export default Footer;
