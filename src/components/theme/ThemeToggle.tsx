"use client";

import { useEffect, useState } from "react";
import { clsx } from "clsx";

type Theme = "light" | "dark";

function SunIcon() {
  return (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" aria-hidden="true">
      <circle cx="12" cy="12" r="4" />
      <path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" />
    </svg>
  );
}
function MoonIcon() {
  return (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinejoin="round" aria-hidden="true">
      <path d="M20 14.5A8 8 0 0 1 9.5 4a8 8 0 1 0 10.5 10.5z" />
    </svg>
  );
}

/** Segmented light/dark switch used in the footer legal bar (Nav-J, Dark-T). */
export function ThemeToggle({ className }: { className?: string }) {
  const [theme, setTheme] = useState<Theme>("light");

  useEffect(() => {
    const t = document.documentElement.getAttribute("data-theme");
    if (t === "dark" || t === "light") setTheme(t);
  }, []);

  function apply(next: Theme) {
    setTheme(next);
    document.documentElement.setAttribute("data-theme", next);
    try {
      localStorage.setItem("wmn-theme", next);
    } catch {
      /* storage may be unavailable */
    }
  }

  const btn = "inline-flex h-7 w-8 items-center justify-center rounded-full transition-colors";
  return (
    <div
      role="group"
      aria-label="Colour theme"
      className={clsx("inline-flex items-center gap-0.5 rounded-full bg-dark-3 p-[3px]", className)}
    >
      <button
        type="button"
        aria-pressed={theme === "light"}
        aria-label="Light theme"
        onClick={() => apply("light")}
        className={clsx(btn, theme === "light" ? "bg-white text-ink" : "text-grey-2 hover:text-white")}
      >
        <SunIcon />
      </button>
      <button
        type="button"
        aria-pressed={theme === "dark"}
        aria-label="Dark theme"
        onClick={() => apply("dark")}
        className={clsx(btn, theme === "dark" ? "bg-white text-ink" : "text-grey-2 hover:text-white")}
      >
        <MoonIcon />
      </button>
    </div>
  );
}
