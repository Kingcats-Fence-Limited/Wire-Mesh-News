import Link from "next/link";
import { clsx } from "clsx";
import { Badge } from "@/components/ui/Primitives";
import type { MarketSeries } from "@/lib/content/types";
import { fmtNum } from "@/lib/site";

export function Sparkline({ points, className, color = "var(--red)" }: { points: number[]; className?: string; color?: string }) {
  const w = 120;
  const h = 34;
  const min = Math.min(...points);
  const max = Math.max(...points);
  const span = max - min || 1;
  const pts = points.map((p, i) => [i * (w / (points.length - 1)), h - ((p - min) / span) * (h - 4) - 2] as const);
  const d = pts.map(([x, y], i) => `${i ? "L" : "M"}${x.toFixed(1)} ${y.toFixed(1)}`).join("");
  return (
    <svg viewBox={`0 0 ${w} ${h}`} className={clsx("h-[34px] w-[120px]", className)} aria-hidden="true" preserveAspectRatio="none">
      <path d={`${d}L${w} ${h}L0 ${h}Z`} fill={color} opacity=".08" />
      <path d={d} fill="none" stroke={color} strokeWidth="1.8" strokeLinejoin="round" />
    </svg>
  );
}

export function Change({ pct, abs, className }: { pct: number | null; abs?: number | null; className?: string }) {
  if (pct === null) return <span className={clsx("num text-[12px] font-extrabold text-grey", className)}>—</span>;
  const cls = pct > 0 ? "text-up" : pct < 0 ? "text-down" : "text-flat";
  const arrow = pct > 0 ? "▲" : pct < 0 ? "▼" : "▬";
  return (
    <span className={clsx("num whitespace-nowrap text-[12px] font-extrabold", cls, className)}>
      {abs !== undefined && abs !== null && <span className="mr-1.5">{abs > 0 ? "+" : ""}{fmtNum(abs, Math.abs(abs) < 10 ? 2 : 0)}</span>}
      {arrow} {Math.abs(pct).toFixed(2)}%
    </span>
  );
}

export function LicenceBadge({ s }: { s: MarketSeries }) {
  switch (s.licence) {
    case "delayed30":
      return <Badge tone="delayed" size="sm">Delayed 30 min</Badge>;
    case "nextday":
      return <Badge tone="current" size="sm">Next day</Badge>;
    case "own":
      return <Badge tone="current" size="sm">Own data</Badge>;
    default:
      return <Badge tone="review" size="sm">Licensed</Badge>;
  }
}

const asOf = (iso: string) => new Intl.DateTimeFormat("en-GB", { day: "2-digit", month: "short", hour: "2-digit", minute: "2-digit", hour12: false, timeZone: "UTC" }).format(new Date(iso)).replace(",", "").toUpperCase() + " UTC";

/**
 * One cell of the snapshot. Three states: live, stale (last good value,
 * greyed, change hidden), unavailable (text + method link). Never 0 or blank.
 */
export function MarketCell({ s, href = "/market-data/", className }: { s: MarketSeries; href?: string; className?: string }) {
  const stale = s.state === "stale";
  const down = s.state === "unavailable";
  return (
    <Link href={href} className={clsx("relative block border border-line-2 bg-bg p-[18px_20px] transition-colors hover:border-ink", className)}>
      <span className="absolute -left-1 -top-1 h-[7px] w-[7px] rounded-full bg-red" aria-hidden="true" />
      <span className="absolute -right-1 -top-1 h-[7px] w-[7px] rounded-full bg-red" aria-hidden="true" />
      <span className="absolute -left-1 -bottom-1 h-[7px] w-[7px] rounded-full bg-red" aria-hidden="true" />
      <span className="absolute -right-1 -bottom-1 h-[7px] w-[7px] rounded-full bg-red" aria-hidden="true" />
      <span className="flex items-start justify-between gap-2">
        <span className="kicker text-[10px]">{s.name}</span>
        {down ? <Badge tone="withdrawn" size="sm">Unavailable</Badge> : stale ? <Badge tone="review" size="sm">Stale</Badge> : <LicenceBadge s={s} />}
      </span>
      {down ? (
        <span className="mt-3 block">
          <span className="block text-[13px] font-bold leading-[1.5] text-slate">Source not reachable. Last good value {s.lastGood ? fmtNum(s.lastGood.value) : "—"} {s.unit} on {s.lastGood ? asOf(s.lastGood.asOf).slice(0, 6) : ""}.</span>
          <span className="mt-2 inline-block text-[11px] font-extrabold tracking-[0.06em] text-red-text">METHODOLOGY →</span>
        </span>
      ) : (
        <>
          <span className="mt-2 flex items-end justify-between gap-3">
            <span className={clsx("num font-display text-[30px] leading-none tracking-[-0.02em]", stale && "text-grey")}>{fmtNum(s.latest!, s.latest! % 1 ? 2 : 0)}</span>
            <Sparkline points={s.points} color={stale ? "var(--grey)" : "var(--red)"} />
          </span>
          <span className="mt-2 flex items-center justify-between gap-2">
            {stale ? <span className="num text-[11px] font-extrabold tracking-[0.06em] text-grey">LAST GOOD {asOf(s.lastGood!.asOf)}</span> : <Change pct={s.changePct} abs={s.change} />}
            <span className="num text-right text-[9.5px] font-bold leading-[1.4] tracking-[0.04em] text-grey">{s.unit}<br />AS OF {asOf(s.asOf)}</span>
          </span>
        </>
      )}
    </Link>
  );
}

/** Attribution bar that must sit directly under any market data. */
export function Attribution({ className }: { className?: string }) {
  return (
    <div className={clsx("flex flex-wrap items-center gap-x-5 gap-y-2 rounded-lg border border-line bg-paper px-4 py-3", className)}>
      <span className="inline-flex h-7 w-[84px] items-center justify-center rounded border border-dashed border-line-2 text-[9px] font-extrabold tracking-[0.1em] text-grey">LME LOGO</span>
      <span className="inline-flex h-7 w-[84px] items-center justify-center rounded border border-dashed border-line-2 text-[9px] font-extrabold tracking-[0.1em] text-grey">PROVIDER</span>
      <span className="meta text-[11.5px] leading-[1.5]">LME data © The London Metal Exchange. Delayed by at least 30 minutes. Assessed prices as published by their providers under licence. Not for redistribution. Indicative only — not a quotation.</span>
      <Link href="/market-data/methodology/" className="ml-auto text-[11px] font-extrabold tracking-[0.06em] text-red-text">METHODOLOGY →</Link>
    </div>
  );
}
