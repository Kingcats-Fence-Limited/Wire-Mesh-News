"use client";

import { useState } from "react";

/* Article-C "Copy link" pill (and the ghost print button in the dark header). */
export function CopyLink({ url, variant }: { url: string; variant?: "print" }) {
  const [done, setDone] = useState(false);
  if (variant === "print") {
    return (
      <button type="button" aria-label="Print" onClick={() => window.print()} style={{ width: "42px", padding: "0" }} className="icobtn gh">
        <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" aria-hidden="true"><path d="M7 9V3h10v6M7 19H4v-7h16v7h-3M7 15h10v6H7z" /></svg>
      </button>
    );
  }
  return (
    <button type="button" onClick={() => { navigator.clipboard?.writeText(url).then(() => { setDone(true); setTimeout(() => setDone(false), 1800); }); }} style={{ display: "inline-flex", alignItems: "center", gap: "8px", minHeight: "40px", padding: "0 16px", border: "1.5px solid var(--line)", borderRadius: "999px", fontSize: "13px", fontWeight: "800", color: "var(--ink)", background: "#FFFFFF", fontFamily: "inherit", cursor: "pointer" }}>
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true"><path d="M10 13a5 5 0 0 0 7 0l3-3a5 5 0 0 0-7-7l-1 1" /><path d="M14 11a5 5 0 0 0-7 0l-3 3a5 5 0 0 0 7 7l1-1" /></svg>{done ? "Copied" : "Copy link"}
    </button>
  );
}
