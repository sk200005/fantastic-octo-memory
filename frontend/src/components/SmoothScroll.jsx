import { useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";
import Lenis from "lenis";

const SCROLL_EASING = (t) => 1 - Math.pow(1 - t, 3);

function SmoothScroll({ children }) {
  const lenisRef = useRef(null);
  const frameRef = useRef(0);
  const location = useLocation();

  useEffect(() => {
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (reducedMotion) {
      return undefined;
    }

    const lenis = new Lenis({
      autoRaf: false,
      duration: 0.22,
      easing: SCROLL_EASING,
      smoothWheel: true,
      syncTouch: false,
      touchMultiplier: 1,
      wheelMultiplier: 0.98,
      gestureOrientation: "vertical",
      anchors: false,
    });

    lenisRef.current = lenis;

    const raf = (time) => {
      lenis.raf(time);
      frameRef.current = window.requestAnimationFrame(raf);
    };

    const startLoop = () => {
      if (!frameRef.current) {
        frameRef.current = window.requestAnimationFrame(raf);
      }
    };

    const stopLoop = () => {
      if (frameRef.current) {
        window.cancelAnimationFrame(frameRef.current);
        frameRef.current = 0;
      }
    };

    const handleVisibilityChange = () => {
      if (document.hidden) {
        stopLoop();
        return;
      }

      startLoop();
    };

    startLoop();
    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      stopLoop();
      lenis.destroy();
      lenisRef.current = null;
    };
  }, []);

  useEffect(() => {
    const lenis = lenisRef.current;

    if (!lenis) {
      return;
    }

    if (location.hash) {
      const target = document.querySelector(location.hash);

      if (target) {
        lenis.scrollTo(target, { duration: 0.3 });
      }

      return;
    }

    lenis.scrollTo(0, { immediate: true });
  }, [location.pathname, location.hash]);

  return children;
}

export default SmoothScroll;
