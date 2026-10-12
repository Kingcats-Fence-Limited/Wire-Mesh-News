"use client";

import { useEffect, useState } from "react";
import { clsx } from "clsx";

/**
 * Sticky back-to-top (Cookie-Z §back-to-top): appears after 600px, shows
 * reading progress as a ring, lifts above the footer, and returns focus
 * to the top of the page.
 */
export function BackToTop() {
  const [show, setShow] = useState(false);
  const [progress, setProgress] = useState(0);
  const [lift, setLift] = useState(0);

  useEffect(() => {
    let raf = 0;
    function onScroll() {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        const y = window.scrollY;
        const h = document.documentElement.scrollHeight - window.innerHeight;
        setShow(y > 600);
        setProgress(h > 0 ? Math.min(1, y / h) : 0);
        const footer = document.getElementById("site-footer");
        if (footer) {
          const r = footer.getBoundingClientRect();
          const overlap = window.innerHeight - r.top;
          setLift(overlap > 0 ? overlap : 0);
        }
      });
    }
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  function toTop() {
    window.scrollTo({ top: 0, behavior: "smooth" });
    const top = document.getElementById("top");
    top?.focus({ preventScroll: true });
  }

  const r = 20;
  const c = 2 * Math.PI * r;
  return (
    <button
      type="button"
      onClick={toTop}
      aria-label="Back to top"
      className={clsx(
        "fixed right-5 z-[36] inline-flex h-12 w-12 items-center justify-center rounded-full border border-line bg-bg text-fg shadow-[0_8px_24px_rgba(21,22,28,.16)] transition-all hover:border-red hover:text-red-text max-md:right-4",
        show ? "opacity-100" : "pointer-events-none opacity-0 translate-y-2",
      )}
      style={{ bottom: `calc(28px + ${lift}px)` }}
    >
      <svg className="absolute inset-0 -rotate-90" width="48" height="48" viewBox="0 0 48 48" aria-hidden="true">
        <circle cx="24" cy="24" r={r} fill="none" stroke="var(--line)" strokeWidth="2" />
        <circle cx="24" cy="24" r={r} fill="none" stroke="var(--red)" strokeWidth="2" strokeDasharray={c} strokeDashoffset={c * (1 - progress)} strokeLinecap="round" />
      </svg>
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M12 19V5M5 12l7-7 7 7" /></svg>
    </button>
  );
}
