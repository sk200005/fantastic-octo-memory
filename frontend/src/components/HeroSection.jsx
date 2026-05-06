import React from "react";
import { Link } from "react-router-dom";

const heroLogoSrc = encodeURI("/webLogo/home.png");

const logoBadges = [
  {
    id: "bbc",
    position: "top-[42%] left-[3%]",
    shell: "h-40 w-40 xl:h-44 xl:w-44",
    src: "/logos/image copy.png",
    alt: "BBC News",
  },
  {
    id: "hindu",
    position: "top-[60%] left-[14%]",
    shell: "h-40 w-40 xl:h-44 xl:w-44",
    src: "/logos/image copy 2.png",
    alt: "The Hindu",
  },
  {
    id: "toi",
    position: "bottom-6 left-[4%]",
    shell: "h-40 w-40 xl:h-44 xl:w-44",
    src: "/logos/image copy 3.png",
    alt: "Times of India",
  },
  {
    id: "cnn",
    position: "bottom-4 left-[30%]",
    shell: "h-40 w-40 xl:h-44 xl:w-44",
    src: "/logos/image copy 4.png",
    alt: "CNN",
  },
  {
    id: "ht",
    position: "top-[50%] left-[31%]",
    shell: "h-40 w-40 xl:h-44 xl:w-44",
    src: "/logos/image copy 5.png",
    alt: "Hindustan Times",
  },
  {
    id: "ndtv",
    position: "top-[40%] right-[22%]",
    shell: "h-40 w-40 xl:h-44 xl:w-44",
    src: "/logos/image copy 6.png",
    alt: "NDTV 24x7",
  },
  {
    id: "indian-express",
    position: "top-[58%] right-[9%]",
    shell: "h-40 w-40 xl:h-44 xl:w-44",
    src: "/logos/image copy 7.png",
    alt: "The Indian Express",
  },
  {
    id: "india-today",
    position: "bottom-7 right-[5%]",
    shell: "h-40 w-40 xl:h-44 xl:w-44",
    src: "/logos/image copy 8.png",
    alt: "India Today",
  },
  {
    id: "wire",
    position: "bottom-5 right-[22%]",
    shell: "h-40 w-40 xl:h-44 xl:w-44",
    src: "/logos/image copy 9.png",
    alt: "The Wire",
  },
];

function HeroSection() {
  return (
    <section id="top" className="relative overflow-x-hidden overflow-y-visible bg-[#f7f6f2]">
      <div className="absolute inset-x-0 top-0 h-[40%] bg-[#304660]" />
      <div className="absolute left-[3%] top-[7%] hidden lg:block">
        <img
          src={heroLogoSrc}
          alt="InSight AI hero logo"
          className="w-full max-w-[31rem] object-contain xl:max-w-[35rem]"
          decoding="async"
          fetchPriority="high"
        />
      </div>
      {logoBadges.map((badge) => (
        <div
          key={badge.id}
          className={`absolute hidden items-center justify-center rounded-full border-4 border-white/85 bg-white/70 shadow-[0_8px_18px_rgba(15,23,42,0.08)] lg:flex ${badge.position} ${badge.shell}`}
        >
          <div className="relative h-[82%] w-[82%] overflow-hidden rounded-full bg-white">
            <img
              src={badge.src}
              alt={badge.alt}
              className="h-full w-full object-cover"
              loading="lazy"
              decoding="async"
            />
            <div className="absolute inset-0 bg-white/45" />
          </div>
        </div>
      ))}

      <div className="relative mx-auto grid min-h-[calc(100vh-88px)] max-w-7xl px-6 pb-10 pt-10 lg:grid-cols-[0.94fr_1.06fr] lg:px-10 lg:pb-12 lg:pt-10">
        <div className="hidden lg:block" />

        <div className="flex flex-col">
          <div className="pt-2 lg:pt-0">
            <h1 className="hero-title max-w-4xl pl-6 text-[2.7rem] font-black uppercase leading-[0.9] tracking-tight text-white sm:pl-8 sm:text-[3.3rem] lg:pl-14 lg:text-[3.95rem]">
              <span>NEWS</span>
              <span>SUMMARISER</span>
              <span>
                <span className="text-[#ebd469]">&amp;</span>
                <span className="hero-title-accent text-[#9cc7ef]">
                  <span>BIAS</span>
                  <span>ANALYSIS</span>
                </span>
              </span>
            </h1>
          </div>

          {/* <div className="mt-8 rounded-[1.4rem] bg-[#35414f] px-5 py-3 shadow-[0_18px_44px_rgba(15,23,42,0.2)] sm:w-fit">
            <p className="text-sm font-bold text-[#c2d6ea] sm:text-base">
              Read: Announcing Surf
            </p>
          </div> */}
          <br /><br /><br /><br /><br /><br /><br />

          <div className="mt-10 max-w-3xl pb-4 lg:mt-12 lg:ml-6">
            <p className="hero-subtitle font-serif text-3xl font-black leading-[0.98] tracking-[-0.03em] text-[#1f2023] sm:text-4xl lg:text-[4rem]">
              The Best&nbsp;Platform  To Amplify  Your Content.
            </p>

            <div className="mt-7">
              <Link
                to="/news"
                className="inline-flex rounded-full bg-[#1f2023] px-7 py-3 text-xs font-bold uppercase tracking-[0.18em] text-white shadow-[0_10px_20px_rgba(15,23,42,0.12)] transition hover:-translate-y-0.5 hover:bg-slate-800 sm:text-sm"
              >
                Explore News
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default HeroSection;
