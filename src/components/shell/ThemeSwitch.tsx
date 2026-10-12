"use client";

import { useEffect, useState } from "react";

/** Canvas utility-bar theme switch, wired to data-theme. (Dark palette pass follows Dark-T; light is the reference.) */
export function ThemeSwitch() {
  const [theme, setTheme] = useState<"light" | "dark">("light");
  useEffect(() => {
    const t = document.documentElement.getAttribute("data-theme");
    if (t === "dark") setTheme("dark");
  }, []);
  function apply(next: "light" | "dark") {
    setTheme(next);
    document.documentElement.setAttribute("data-theme", next);
    try {
      localStorage.setItem("wmn-theme", next);
    } catch {
      /* ignore */
    }
  }
  const on = { width: "30px", height: "26px", border: "0", borderRadius: "999px", background: "var(--card)", color: "var(--ink)", display: "inline-flex", alignItems: "center", justifyContent: "center", cursor: "pointer" } as const;
  const off = { ...on, background: "transparent", color: "var(--grey-2)" } as const;
  return (
    <div style={{ display: "flex", alignItems: "center", gap: "2px", background: "var(--surface-dark-2)", borderRadius: "999px", padding: "3px" }}>
      <button type="button" aria-label="Light theme" aria-pressed={theme === "light"} onClick={() => apply("light")} style={theme === "light" ? on : off}><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" aria-hidden="true"><circle cx="12" cy="12" r="4.2" /><path d="M12 2.8v2.4M12 18.8v2.4M2.8 12h2.4M18.8 12h2.4M5.5 5.5l1.7 1.7M16.8 16.8l1.7 1.7M18.5 5.5l-1.7 1.7M7.2 16.8l-1.7 1.7" /></svg></button>
      <button type="button" aria-label="Dark theme" aria-pressed={theme === "dark"} onClick={() => apply("dark")} style={theme === "dark" ? on : off}><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinejoin="round" aria-hidden="true"><path d="M20 14.5A8.5 8.5 0 0 1 9.5 4a8.5 8.5 0 1 0 10.5 10.5z" /></svg></button>
    </div>
  );
}
