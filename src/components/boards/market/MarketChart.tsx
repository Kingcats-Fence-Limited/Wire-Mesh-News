"use client";

import { useState } from "react";
import type { MarketSeries } from "@/lib/content/types";

/* Market-X chart card: 12-month series within the licensed look-back, range pills, hover value. No download. */
export function MarketChart({ s }: { s: MarketSeries }) {
  const [months, setMonths] = useState(12);
  const [hover, setHover] = useState<number | null>(null);
  const pts = s.points.slice(-months);
  const min = Math.min(...pts), max = Math.max(...pts), span = max - min || 1;
  const W = 560, H = 160;
  const xy = pts.map((p, i) => [pts.length > 1 ? (i * W) / (pts.length - 1) : 0, H - 20 - ((p - min) / span) * (H - 50)] as const);
  const d = xy.map(([x, y], i) => `${i ? "L" : "M"}${x.toFixed(1)} ${y.toFixed(1)}`).join("");
  const labels = ["Nov", "Dec", "Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct"].slice(-months);
  return (
    <div className="card">
      <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", gap: "12px", marginBottom: "12px", flexWrap: "wrap" }}><div style={{ fontSize: "15px" }} className="h">{s.name}</div><span className="mono meta" style={{ fontSize: "11px" }}>{s.unit} · {s.updates}</span></div>
      <div style={{ border: "1px solid var(--line-soft)", borderRadius: "10px", background: "var(--paper-2)", height: "160px", position: "relative", overflow: "hidden" }} onMouseLeave={() => setHover(null)}>
        <svg width="100%" height="160" viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="none" aria-hidden="true" onMouseMove={(e) => { const r = e.currentTarget.getBoundingClientRect(); const x = ((e.clientX - r.left) / r.width) * W; setHover(Math.round((x / W) * (pts.length - 1))); }}>
          <path d={d} fill="none" stroke={s.state === "unavailable" ? "var(--grey)" : "var(--red)"} strokeWidth="2.4" vectorEffect="non-scaling-stroke" />
          <path d={`${d}V${H}H0Z`} fill="var(--red)" opacity=".07" />
          {hover !== null && xy[hover] && <line x1={xy[hover][0]} x2={xy[hover][0]} y1="0" y2={H} stroke="var(--ink)" strokeWidth="1" strokeDasharray="3 3" vectorEffect="non-scaling-stroke" />}
        </svg>
        <span style={{ position: "absolute", right: "10px", top: "9px", fontSize: "9.5px", fontWeight: "800", letterSpacing: ".08em", color: "var(--grey)" }} className="mono">{months} MONTHS</span>
        {hover !== null && pts[hover] !== undefined && <span className="mono" style={{ position: "absolute", left: "10px", top: "9px", fontSize: "11px", fontWeight: 800, background: "var(--ink)", color: "var(--on-ink)", padding: "4px 8px", borderRadius: "4px" }}>{labels[hover]} 2026 · {pts[hover].toLocaleString("en-US")} {s.unit}</span>}
      </div>
      <div style={{ display: "flex", gap: "7px", marginTop: "12px", flexWrap: "wrap", alignItems: "center" }}>
        {[12, 6, 3, 1].map((m) => <button key={m} type="button" onClick={() => setMonths(m)} className={`pill${months === m ? " on" : ""}`}>{m}M</button>)}
        <span style={{ marginLeft: "auto", fontSize: "11px" }} className="meta">Hover for a single value and date · no download</span>
      </div>
    </div>
  );
}
