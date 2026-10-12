"use client";

import { useState } from "react";
import { clsx } from "clsx";
import type { MarketSeries } from "@/lib/content/types";

const MONTHS = ["Nov", "Dec", "Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct"];

/** Simple SVG line chart with hover readout. No download control by design. */
export function MarketChart({ series }: { series: MarketSeries }) {
  const [range, setRange] = useState<12 | 6 | 3 | 1>(12);
  const [hover, setHover] = useState<number | null>(null);
  const pts = series.points.slice(-range);
  const labels = MONTHS.slice(-range);
  const w = 600;
  const h = 200;
  const padL = 44;
  const padB = 22;
  const min = Math.min(...pts) * 0.995;
  const max = Math.max(...pts) * 1.005;
  const x = (i: number) => padL + (i * (w - padL - 8)) / Math.max(1, pts.length - 1);
  const y = (v: number) => 8 + (1 - (v - min) / (max - min || 1)) * (h - padB - 8);
  const d = pts.map((p, i) => `${i ? "L" : "M"}${x(i)} ${y(p)}`).join("");
  const stale = series.state !== "live";
  const color = stale ? "var(--grey)" : "var(--red)";
  const ticks = [min, (min + max) / 2, max];
  return (
    <div>
      <div className="relative mt-3 rounded-lg border border-line-soft bg-paper-2" onMouseLeave={() => setHover(null)}>
        <svg viewBox={`0 0 ${w} ${h}`} className="h-[200px] w-full" role="img" aria-label={`${series.name}, last ${range} months`}>
          {ticks.map((t, i) => (
            <g key={i}>
              <line x1={padL} x2={w - 8} y1={y(t)} y2={y(t)} stroke="var(--line)" strokeDasharray="2 4" />
              <text x={padL - 6} y={y(t) + 3} textAnchor="end" className="num" fontSize="10" fill="var(--grey)">{Math.round(t).toLocaleString("en-US")}</text>
            </g>
          ))}
          <path d={`${d}L${x(pts.length - 1)} ${h - padB}L${x(0)} ${h - padB}Z`} fill={color} opacity=".07" />
          <path d={d} fill="none" stroke={color} strokeWidth="2.4" strokeLinejoin="round" />
          {labels.map((l, i) => (range <= 6 || i % 2 === 1) && <text key={l + i} x={x(i)} y={h - 6} textAnchor="middle" fontSize="10" fill="var(--grey)">{l}</text>)}
          {pts.map((p, i) => (
            <g key={i}>
              <rect x={x(i) - (w - padL) / pts.length / 2} y={0} width={(w - padL) / pts.length} height={h - padB} fill="transparent" onMouseEnter={() => setHover(i)} />
              {hover === i && (
                <>
                  <line x1={x(i)} x2={x(i)} y1={8} y2={h - padB} stroke="var(--ink)" strokeWidth="1" />
                  <circle cx={x(i)} cy={y(p)} r="4" fill={color} stroke="#fff" strokeWidth="2" />
                </>
              )}
            </g>
          ))}
        </svg>
        {hover !== null && (
          <div className="num pointer-events-none absolute right-3 top-3 rounded-md bg-ink px-2.5 py-1.5 text-[11.5px] font-extrabold text-white">{labels[hover]} · {pts[hover].toLocaleString("en-US")} {series.unit}</div>
        )}
        <span className="num absolute left-3 top-2.5 text-[9.5px] font-extrabold tracking-[0.08em] text-grey">{range} MONTH{range > 1 ? "S" : ""}</span>
      </div>
      <div className="mt-3 flex flex-wrap items-center gap-2">
        {([12, 6, 3, 1] as const).map((r) => (
          <button key={r} type="button" onClick={() => setRange(r)} className={clsx("inline-flex min-h-[32px] items-center rounded-full border px-3.5 text-[12px] font-bold", range === r ? "border-ink bg-ink text-white dark:border-white dark:bg-white dark:text-ink" : "border-line hover:border-ink")}>{r}M</button>
        ))}
        <span className="meta ml-auto text-[11px]">Hover for a single point · no download by design</span>
      </div>
    </div>
  );
}
