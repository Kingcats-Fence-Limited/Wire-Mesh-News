"use client";

import { useEffect, useState } from "react";

/* Article-C: 3px red progress line (top of page) + TOC highlight + "reading progress / minutes left" line. */
export function ReadBar({ readMin }: { readMin: number }) {
  const [p, setP] = useState(0);
  useEffect(() => {
    const on = () => {
      const h = document.documentElement.scrollHeight - window.innerHeight;
      const v = h > 0 ? Math.min(1, window.scrollY / h) : 0;
      setP(v);
      const heads = Array.from(document.querySelectorAll<HTMLElement>(".body h2[id], .body [data-toc]"));
      let cur = heads[0]?.id;
      for (const el of heads) if (el.getBoundingClientRect().top < 140) cur = el.id;
      document.querySelectorAll<HTMLAnchorElement>(".tocl").forEach((a) => a.classList.toggle("on", a.getAttribute("href") === `#${cur}`));
    };
    on();
    window.addEventListener("scroll", on, { passive: true });
    return () => window.removeEventListener("scroll", on);
  }, []);
  const pct = Math.round(p * 100);
  return (
    <>
      <div className="readbar" aria-hidden="true"><div style={{ width: `${pct}%` }} /></div>
      <div style={{ marginTop: "18px", paddingTop: "16px", borderTop: "1px solid var(--line)", fontSize: "12px", fontWeight: "600", color: "var(--grey)", lineHeight: "1.6" }}>Reading progress <span style={{ color: "var(--red-text)" }} className="mono">{pct}%</span><br />About {Math.max(1, Math.round(readMin * (1 - p)))} min left</div>
    </>
  );
}
