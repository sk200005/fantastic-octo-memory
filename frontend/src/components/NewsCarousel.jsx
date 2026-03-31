import React, { useCallback, useEffect, useMemo, useRef } from "react";
import { Link } from "react-router-dom";
import { calculateBiasDistribution } from "../utils/biasUtils";

function getSummaryText(article) {
  return (
    article.summary?.trim() ||
    article.rawContent?.trim()?.slice(0, 150) ||
    article.content?.trim()?.slice(0, 150) ||
    "Fresh coverage and perspective highlights from the latest headlines."
  );
}

function BiasBar({ article }) {
  const segments = useMemo(() => {
    const { left, center, right } = calculateBiasDistribution(article.bias);

    return [
      { label: "Left", value: left, tone: "bg-rose-500 text-white" },
      { label: "Center", value: center, tone: "bg-slate-200 text-slate-700" },
      { label: "Right", value: right, tone: "bg-blue-600 text-white" },
    ];
  }, [article.bias]);

  return (
    <div className="mt-5">
      <div className="overflow-hidden rounded-full border border-slate-200/80 bg-slate-100" aria-label="Bias analysis">
        <div className="flex w-full">
          {segments.map((segment) => (
            <div
              key={segment.label}
              className={`flex min-h-9 items-center justify-center px-2 text-center text-[11px] font-bold tracking-tight sm:text-xs ${segment.tone}`}
              style={{ width: `${segment.value}%` }}
            >
              <span className="truncate">
                {segment.label} {segment.value}%
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function NewsCarouselCard({ article }) {
  const summary = getSummaryText(article);

  return (
    <article className="group flex h-full w-[min(78vw,19rem)] shrink-0 flex-col overflow-hidden rounded-[1.75rem] border border-slate-200/70 bg-white/90 shadow-[0_14px_34px_rgba(15,23,42,0.08)] transition duration-300 hover:-translate-y-1 hover:shadow-[0_22px_46px_rgba(15,23,42,0.12)] sm:w-[18rem] lg:w-[19rem] xl:w-[20rem]">
      <div className="relative aspect-[16/10] overflow-hidden bg-slate-100">
        <img
          src={article.image}
          alt={article.title || "Latest news"}
          className="h-full w-full object-cover transition duration-500 group-hover:scale-[1.04]"
          loading="lazy"
          decoding="async"
        />
        <div className="absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-slate-950/35 to-transparent" />
      </div>

      <div className="flex flex-1 flex-col px-5 py-5">
        <div className="mb-3 flex items-center justify-between gap-3 text-[0.68rem] font-bold uppercase tracking-[0.24em] text-slate-400">
          <span>{article.source || "Latest Brief"}</span>
          <span>{article.publishedAt ? new Date(article.publishedAt).toLocaleDateString() : "Today"}</span>
        </div>

        <p className="news-carousel-summary text-base font-medium leading-7 text-slate-700">
          {summary}
        </p>

        <div className="mt-5 flex items-center justify-between">
          <span className="text-xs font-bold uppercase tracking-[0.24em] text-sky-700">
            Latest update
          </span>

          {article.link ? (
            <a
              href={article.link}
              target="_blank"
              rel="noreferrer"
              className="text-sm font-semibold text-slate-900 transition hover:text-sky-700"
            >
              Read more
            </a>
          ) : (
            <Link
              to="/news"
              className="text-sm font-semibold text-slate-900 transition hover:text-sky-700"
            >
              Explore
            </Link>
          )}
        </div>

        <BiasBar article={article} />
      </div>
    </article>
  );
}

function NewsCarousel({ news = [] }) {
  const items = useMemo(() => news.filter((article) => article.image).slice(0, 8), [news]);
  const containerRef = useRef(null);
  const pauseRef = useRef(false);
  const frameRef = useRef(0);
  const lastTimeRef = useRef(0);
  const scrollSpeed = 38;
  const loopItems = useMemo(() => [...items, ...items], [items]);

  const stepByCard = useCallback((direction) => {
    const container = containerRef.current;

    if (!container) {
      return;
    }

    const firstCard = container.querySelector("[data-news-card]");
    const cardWidth = firstCard ? firstCard.getBoundingClientRect().width : 320;
    const styles = window.getComputedStyle(container);
    const gap = Number.parseFloat(styles.columnGap || styles.gap || "24") || 24;

    container.scrollBy({
      left: direction * (cardWidth + gap),
      behavior: "smooth",
    });
  }, []);

  useEffect(() => {
    const container = containerRef.current;

    if (!container || items.length <= 1) {
      return undefined;
    }

    const halfWidth = () => container.scrollWidth / 2;

    const tick = (time) => {
      if (!lastTimeRef.current) {
        lastTimeRef.current = time;
      }

      const delta = time - lastTimeRef.current;
      lastTimeRef.current = time;

      if (!pauseRef.current) {
        container.scrollLeft += (scrollSpeed * delta) / 1000;

        const resetPoint = halfWidth();
        if (container.scrollLeft >= resetPoint) {
          container.scrollLeft -= resetPoint;
        }
      }

      frameRef.current = window.requestAnimationFrame(tick);
    };

    frameRef.current = window.requestAnimationFrame(tick);

    return () => {
      window.cancelAnimationFrame(frameRef.current);
      frameRef.current = 0;
      lastTimeRef.current = 0;
    };
  }, [items.length]);

  if (!items.length) {
    return null;
  }

  return (
    <section className="news-carousel deferred-section relative overflow-hidden bg-[linear-gradient(180deg,#f8fafc_0%,#eef4fb_100%)] py-16 sm:py-18">
      <div className="mx-auto max-w-7xl px-6 md:px-10 xl:px-16">
        <div className="flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
          <div className="max-w-2xl">
            <p className="text-sm font-black uppercase tracking-[0.28em] text-sky-700">
              Latest News
            </p>
            <h2 className="mt-4 text-3xl font-black uppercase leading-tight text-slate-950 sm:text-4xl">
              Fresh headlines moving in real time
            </h2>
            <p className="mt-4 text-base leading-7 text-slate-600 sm:text-lg">
              A live-style stream of the latest coverage, designed to surface key updates quickly
              without interrupting the rhythm of the homepage.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              type="button"
              onClick={() => stepByCard(-1)}
              className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-slate-300 bg-white text-lg font-semibold text-slate-900 shadow-[0_10px_24px_rgba(15,23,42,0.05)] transition hover:-translate-y-0.5 hover:border-sky-200 hover:text-sky-700"
              aria-label="Show previous news cards"
            >
              ←
            </button>
            <button
              type="button"
              onClick={() => stepByCard(1)}
              className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-slate-300 bg-white text-lg font-semibold text-slate-900 shadow-[0_10px_24px_rgba(15,23,42,0.05)] transition hover:-translate-y-0.5 hover:border-sky-200 hover:text-sky-700"
              aria-label="Show next news cards"
            >
              →
            </button>
            <Link
              to="/news"
              className="inline-flex w-fit rounded-full border border-slate-300 bg-white px-5 py-3 text-sm font-bold uppercase tracking-[0.18em] text-slate-900 shadow-[0_10px_24px_rgba(15,23,42,0.05)] transition hover:-translate-y-0.5 hover:border-sky-200 hover:text-sky-700"
            >
              View all news
            </Link>
          </div>
        </div>
      </div>

      <div
        className="relative mt-10 overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_5%,black_95%,transparent)]"
        onMouseEnter={() => {
          pauseRef.current = true;
        }}
        onMouseLeave={() => {
          pauseRef.current = false;
        }}
      >
        <div
          ref={containerRef}
          className="news-carousel-scroll flex gap-6 overflow-x-hidden scroll-smooth"
        >
          {loopItems.map((article, index) => (
            <div
              key={`${index}-${article.id || article._id || article.link}`}
              data-news-card
              className="shrink-0"
              aria-hidden={index >= items.length}
            >
              <NewsCarouselCard article={article} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default NewsCarousel;
