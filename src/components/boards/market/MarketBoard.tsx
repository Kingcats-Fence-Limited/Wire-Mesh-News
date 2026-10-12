/* Ported 1:1 from canvas board Market-X ② (the standalone /market-data page). States ③ and the three required texts ④ live in the Method-X2 page. */
import Link from "next/link";
import { Shell } from "@/components/shell/Shell";
import { MarketChart } from "./MarketChart";
import { MARKET_SERIES, MARKET_LICENSED } from "@/lib/content/market";
import { byMarketSeries, bySection } from "@/lib/content/articles";
import { articleHref, fmtDateShort, fmtNum, sectionByCode } from "@/lib/site";
import type { MarketSeries } from "@/lib/content/types";
import "@/styles/board-mkt.css";
import { demoBg } from "@/lib/demo";

const LIC: Record<MarketSeries["licence"], [string, string]> = { delayed30: ["DELAYED 30M", "bad"], nextday: ["NEXT DAY", "ok"], licensed: ["LICENSED", "warn"], own: ["OWN DATA", "ok"] };
const asOf = (s: MarketSeries) => s.licence === "delayed30" ? new Intl.DateTimeFormat("en-GB", { hour: "2-digit", minute: "2-digit", hour12: false, timeZone: "UTC" }).format(new Date(s.asOf)) + " UTC" : s.licence === "nextday" ? "Previous close" : fmtDateShort(s.asOf);

export function MarketBoard({ selected }: { selected?: string }) {
  const sel = MARKET_SERIES.find((s) => s.code === selected) ?? MARKET_SERIES[0];
  const moved = byMarketSeries(sel.code, 3);
  const fallback = bySection("market_insights", 3);
  const items = moved.length ? moved : fallback;
  return (
    <Shell header="compact" active="market_insights" board="b-mkt">
<section style={{ paddingTop: "34px", paddingBottom: "24px", borderBottom: "1px solid var(--line)" }} className="wrap">
<nav aria-label="Breadcrumb" style={{ fontSize: "12.5px", fontWeight: "500", color: "var(--slate)", marginBottom: "14px" }}><Link href="/" style={{ color: "var(--slate)" }}>Home</Link> / <Link href="/market-insights/" style={{ color: "var(--slate)" }}>Market Insights</Link> / <span style={{ color: "var(--ink)", fontWeight: "800" }}>Market data</span></nav>
<div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", gap: "32px", flexWrap: "wrap" }}>
<div style={{ maxWidth: "680px" }}>
<h1 style={{ margin: "0 0 10px", fontSize: "50px", letterSpacing: "-.05em", lineHeight: "1" }} className="h">Market data<span style={{ color: "var(--red-text)" }}>.</span></h1>
<p style={{ margin: "0", fontSize: "16.5px", fontWeight: "500", lineHeight: "1.55", color: "var(--slate)" }}>Six licensed price series behind every quotation — exchange zinc, wire rod, hot-rolled coil, our own panel survey and container freight — with the articles that explain why they moved.</p>
</div>
<div style={{ display: "flex", gap: "10px", flexShrink: "0", alignItems: "center" }}>
<span className="badge bad"><span style={{ width: "6px", height: "6px", borderRadius: "999px", background: "var(--red)" }}></span>DELAYED 30 MIN</span>
<Link href="/market-data/methodology/" style={{ display: "inline-flex", alignItems: "center", gap: "8px", border: "2px solid var(--ink)", fontWeight: "800", fontSize: "14px", padding: "0 20px", minHeight: "48px", borderRadius: "999px" }}>Methodology</Link>
</div>
</div>
</section>
{!MARKET_LICENSED ? (
<section style={{ paddingTop: "30px", paddingBottom: "50px" }} className="wrap"><div className="card" style={{ maxWidth: "720px" }}><div className="h" style={{ fontSize: "20px", marginBottom: "8px" }}>Market data goes live once the data agreements are signed.</div><p className="meta" style={{ margin: 0, fontSize: "14px" }}>Until then this page shows no figures — not placeholders, not estimates.</p></div></section>
) : (
<section style={{ paddingTop: "30px", paddingBottom: "50px" }} className="wrap">
<div className="tablewrap">
<table style={{ marginBottom: "12px" }}>
<thead><tr><th style={{ width: "24%" }}>SERIES</th><th>UNIT</th><th>LATEST</th><th>&#916;</th><th>&#916; %</th><th>AS OF</th><th style={{ width: "20%" }}>SOURCE</th><th>LICENCE</th></tr></thead>
<tbody>
{MARKET_SERIES.map((s) => {
  const dir = s.changePct === null ? "fl" : s.changePct > 0 ? "up" : s.changePct < 0 ? "dn" : "fl";
  const arrow = s.changePct === null ? "" : s.changePct > 0 ? "▲" : s.changePct < 0 ? "▼" : "▬";
  const [lab, cls] = LIC[s.licence];
  const down = s.state === "unavailable", stale = s.state === "stale";
  return (
<tr key={s.code} className={s.code === sel.code ? "on" : undefined}>
<td><Link href={`/market-data/?series=${s.code}#chart`} style={{ fontWeight: 800 }}>{s.name}</Link>{stale && <span className="badge warn" style={{ marginLeft: "8px", fontSize: "9px" }}>STALE</span>}{down && <span className="badge bad" style={{ marginLeft: "8px", fontSize: "9px" }}>UNAVAILABLE</span>}</td>
<td className="mono">{s.unit}</td>
<td className="mono"><b>{down ? "—" : fmtNum(s.latest!, s.latest! % 1 ? 1 : 0)}</b>{down && s.lastGood && <span className="meta" style={{ display: "block", fontSize: "11px" }}>last good {fmtNum(s.lastGood.value)}</span>}</td>
<td className={`mono ${dir}`}>{s.change === null ? "—" : `${s.change > 0 ? "+" : s.change < 0 ? "−" : ""}${fmtNum(Math.abs(s.change), s.change % 1 ? 1 : 0)}`}</td>
<td className={`mono ${dir}`}>{s.changePct === null ? "—" : `${arrow} ${Math.abs(s.changePct).toFixed(1)}%`}</td>
<td className="mono">{asOf(s)}</td>
<td>{s.source}</td>
<td><span style={{ fontSize: "9px" }} className={`badge ${cls}`}>{lab}</span></td>
</tr>
  );
})}
</tbody>
</table>
</div>
<p style={{ margin: "0 0 14px", fontSize: "12px" }} className="meta">Six series in this first phase. History is shown within the look-back each licence allows; there is no export and no API.</p>
<div id="chart" style={{ display: "grid", gridTemplateColumns: "1.3fr 1fr", gap: "18px", marginBottom: "30px" }} className="cols">
<MarketChart key={sel.code} s={sel} />
<div style={{ background: "var(--paper)", borderColor: "var(--line)" }} className="card">
<div style={{ fontSize: "15px", marginBottom: "10px" }} className="h">What this page always carries</div>
<ul>
<li><b>Methodology</b>: the definition, basis, collection method and update frequency of each series</li>
<li><b>Attribution &amp; copyright</b>: source, delay, ownership and the scope of the licence</li>
<li><b>Disclaimer</b>: for reference only; not a quotation or investment advice; errors go through Corrections</li>
</ul>
<p style={{ margin: "12px 0 0", fontSize: "11.5px", lineHeight: "1.6" }} className="meta">Our own survey price states sample size, the kind of respondents and the exclusion rules. The full texts are one page: <Link href="/market-data/methodology/" style={{ color: "var(--red-text)", fontWeight: 800 }}>/market-data/methodology</Link>.</p>
</div>
</div>
{/* What moved the market */}
<div style={{ border: "1px solid var(--line)", borderRadius: "14px", padding: "22px 24px", marginBottom: "30px", background: "var(--card)" }}>
<div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", gap: "16px", marginBottom: "16px", flexWrap: "wrap" }}>
<div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
<span style={{ width: "15px", height: "3px", background: "var(--red)" }}></span>
<span style={{ fontSize: "13px", letterSpacing: ".1em" }} className="h">WHAT MOVED THE MARKET</span>
<span style={{ fontSize: "12px" }} className="meta">· {sel.name}</span>
</div>
<Link href="/market-insights/" style={{ fontSize: "11.5px", fontWeight: "800", letterSpacing: ".06em", color: "var(--red-text)" }} className="mono">ALL MARKET INSIGHTS →</Link>
</div>
<div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "16px", marginBottom: "14px" }} className="g3">
{items.map((a, i) => (
<Link key={a.slug} href={articleHref(a)} style={{ display: "flex", flexDirection: "column", gap: "9px" }}>
<span style={{ display: "block", aspectRatio: "16/9", borderRadius: "10px", background: ["linear-gradient(135deg, #2A2B36, var(--ink))", "linear-gradient(135deg, #3A3B47, #1C1D26)", "linear-gradient(135deg, #2F3040, var(--ink))"][i % 3], position: "relative", overflow: "hidden" }}><span aria-hidden="true" className="demo" style={{ position: "absolute", inset: 0, opacity: .55, ...demoBg(a.slug) }} /></span>
<span style={{ fontSize: "10.5px", fontWeight: "800", letterSpacing: ".08em" }} className="mono meta">{(a.type === "analysis" ? "ANALYSIS" : sectionByCode(a.section)?.label.toUpperCase())} · {fmtDateShort(a.date)}</span>
<span style={{ fontSize: "15.5px", lineHeight: "1.2" }} className="h">{a.title}</span>
</Link>
))}
</div>
<div style={{ paddingTop: "12px", borderTop: "1px solid var(--line-soft)" }}>
<span style={{ fontSize: "12px", lineHeight: "1.55" }} className="meta">{moved.length ? "Articles tagged with this series by the editors, newest first." : "No article is tagged with this series yet, so the latest Market Insights are shown."} The numbers say what happened; the articles say why.</span>
</div>
</div>
<div style={{ display: "flex", gap: "14px", flexWrap: "wrap", alignItems: "center", paddingTop: "14px", borderTop: "1px solid var(--line)" }}>
<span className="meta" style={{ fontSize: "11px", lineHeight: "1.5", maxWidth: "720px" }}>Zinc: LME 3-month and cash settlement. Wire rod, HR coil, freight: assessed prices reproduced under licence. Galvanized mesh panel: Wire Mesh News survey. &#169; the respective providers. Not for redistribution, scraping or export. Indicative only — not a quotation.</span>
</div>
</section>
)}
    </Shell>
  );
}
