"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import "@/styles/board-cook.css";

/**
 * Cookie-Z §back-to-top. Fades in after 1.5 screens, only while scrolling
 * up; sits 22px from the right edge (28px above the bottom on phones);
 * lifts above the footer; on article pages the outer arc is the reading
 * progress (same number as the top bar). Click returns focus to the
 * header's first link; reduced motion jumps instead of scrolling.
 */
export function BackToTop() {
  const pathname = usePathname();
  const [show, setShow] = useState(false);
  const [progress, setProgress] = useState(0);
  const [lift, setLift] = useState(0);
  const [article, setArticle] = useState(false);
  const lastY = useRef(0);

  useEffect(() => {
    setArticle(!!document.querySelector("article[data-article]"));
    let raf = 0;
    function onScroll() {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        const y = window.scrollY;
        const h = document.documentElement.scrollHeight - window.innerHeight;
        const up = y < lastY.current;
        lastY.current = y;
        setShow(y > window.innerHeight * 1.5 && up);
        setProgress(h > 0 ? Math.min(1, y / h) : 0);
        const footer = document.getElementById("site-footer");
        if (footer) {
          const r = footer.getBoundingClientRect();
          const overlap = window.innerHeight - r.top;
          setLift(overlap > 0 ? overlap : 0);
        }
      });
    }
    lastY.current = window.scrollY;
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, [pathname]);

  function toTop() {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    window.scrollTo({ top: 0, behavior: reduce ? "auto" : "smooth" });
    const first = document.querySelector<HTMLElement>("header a, header button");
    (first ?? document.getElementById("top"))?.focus({ preventScroll: true });
  }

  const r = 22;
  const c = 2 * Math.PI * r;
  const phone = typeof window !== "undefined" && window.innerWidth <= 600;
  const arrow = (s: number) => <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M12 20V5M5 12l7-7 7 7" /></svg>;

  return (
    <button type="button" onClick={toTop} aria-label="Back to top" className={`b-cook btt${show ? "" : " hide"}${article ? " ring" : ""}`} style={{ bottom: `calc(${phone ? 28 : 22}px + ${lift}px)` }}>
      {article ? (
        <span className="ringbox">
          <svg className="arc" width="48" height="48" viewBox="0 0 48 48" style={{ position: "absolute", inset: 0 }} aria-hidden="true">
            <circle cx="24" cy="24" r={r} fill="none" stroke="var(--line-soft)" strokeWidth="3" />
            <circle cx="24" cy="24" r={r} fill="none" stroke="var(--red-text)" strokeWidth="3" strokeLinecap="round" strokeDasharray={c} strokeDashoffset={c * (1 - progress)} transform="rotate(-90 24 24)" />
          </svg>
          <span className="disc" style={{ position: "relative" }}>{arrow(16)}<span>Top</span></span>
        </span>
      ) : (
        <span className="disc">{arrow(18)}<span>Top</span></span>
      )}
    </button>
  );
}
