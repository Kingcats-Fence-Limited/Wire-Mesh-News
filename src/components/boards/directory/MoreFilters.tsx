"use client";

import Link from "next/link";
import { useState } from "react";

export type Tick = { label: string; href: string; on: boolean; count: number };
/* Directory-D "More filters" drop panel: two coarse axes (material, product) + profile flags. Opens from the black tool bar. */
export function MoreFilters({ rows, resetHref }: { rows: { label: string; ticks: Tick[] }[]; resetHref: string }) {
  const [open, setOpen] = useState(false);
  return (
    <>
      <button type="button" className="fchip ghost" aria-expanded={open} onClick={() => setOpen((o) => !o)}><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" aria-hidden="true"><path d="M4 7h16M7 12h10M10 17h4" /></svg>More filters</button>
      {open && (
        <div style={{ flexBasis: "100%", order: 9, marginTop: "6px" }}>
          <div style={{ border: "1px solid var(--line)", borderRadius: "16px", background: "#FFFFFF", padding: "20px 24px", boxShadow: "0 20px 40px -26px rgba(21,22,28,.4)", color: "var(--ink)" }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: "12px", marginBottom: "16px" }}>
              <span style={{ fontSize: "16px" }} className="h">More filters</span>
              <span style={{ fontSize: "12px" }} className="meta">Two coarse axes only; grades and processes are not filters</span>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
              {rows.map((r) => (
                <div key={r.label} style={{ display: "flex", alignItems: "center", gap: "10px", flexWrap: "wrap" }}>
                  <span style={{ width: "86px", flexShrink: "0", fontSize: "10.5px", fontWeight: "800", letterSpacing: ".12em", color: "var(--grey)" }} className="mono">{r.label}</span>
                  {r.ticks.map((t) => <Link key={t.label} href={t.href} className={`tickchip${t.on ? " on" : ""}`}><span className="sq"></span>{t.label}<span className="c">{t.count}</span></Link>)}
                </div>
              ))}
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: "10px", marginTop: "16px", paddingTop: "14px", borderTop: "1px solid var(--line)" }}>
              <p style={{ margin: "0", fontSize: "11.5px", lineHeight: "1.5" }} className="meta">Finer specifications (aperture, wire diameter, coating weight) are not filters: use search or the company profile.</p>
              <Link href={resetHref} style={{ marginLeft: "auto" }} className="chip">Reset</Link>
              <button type="button" onClick={() => setOpen(false)} style={{ minHeight: "38px", padding: "0 20px", border: "0", borderRadius: "999px", background: "var(--ink)", color: "#FFFFFF", fontFamily: "inherit", fontSize: "13.5px", fontWeight: "800", cursor: "pointer" }}>Done</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
