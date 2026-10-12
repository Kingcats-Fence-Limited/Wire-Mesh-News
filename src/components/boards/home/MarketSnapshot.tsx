/* Ported 1:1 from canvas Home-A market snapshot: mesh cells with weld-dot corners, 12-week sparkline, attribution bar. */
import Link from "next/link";
import type { MarketSeries } from "@/lib/content/types";
import { fmtNum } from "@/lib/site";

function spark(points: number[]) {
  const min = Math.min(...points), max = Math.max(...points), span = max - min || 1;
  return points.map((p, i) => `${i ? "L" : "M"}${(i * 120) / (points.length - 1)} ${(30 - 4 - ((p - min) / span) * 22).toFixed(1)}`).join("");
}
const asOf = (iso: string) => new Intl.DateTimeFormat("en-GB", { day: "2-digit", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit", hour12: false, timeZone: "UTC" }).format(new Date(iso)).replace(",", "").toUpperCase() + " UTC";

export function MarketSnapshot({ series }: { series: MarketSeries[] }) {
  const live = series.find((s) => s.state === "live") ?? series[0];
  return (
    <>
<section style={{ borderBottom: "1px solid var(--line)", background: "var(--card)" }}>
<div className="wrap" style={{ paddingTop: "32px", paddingBottom: "34px" }}>
<div style={{ display: "flex", alignItems: "center", gap: "13px", marginBottom: "20px", flexWrap: "wrap" }}>
<span style={{ width: "9px", height: "9px", borderRadius: "999px", background: "var(--red)" }}></span>
<span className="h" style={{ fontSize: "16px", letterSpacing: ".02em" }}>MARKET SNAPSHOT</span>
<span style={{ display: "inline-flex", alignItems: "center", gap: "6px", background: "var(--st-red-bg)", color: "var(--red-deep)", fontSize: "10px", fontWeight: "800", letterSpacing: ".1em", padding: "5px 9px", borderRadius: "4px" }}><span style={{ width: "6px", height: "6px", borderRadius: "999px", background: "var(--red)" }}></span>DELAYED 30 MIN</span>
<span className="mono" style={{ fontSize: "11px", fontWeight: "700", letterSpacing: ".06em", color: "var(--grey)" }}>AS OF {asOf(live.asOf)}</span>
<Link href="/market-data/methodology/" style={{ marginLeft: "auto", fontSize: "11.5px", fontWeight: "800", letterSpacing: ".1em", color: "var(--red-text)" }}>METHODOLOGY &#8594;</Link>
</div>
<div className="g4 mkt" style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "18px" }}>
{series.map((s) => {
  const stale = s.state === "stale", down = s.state === "unavailable";
  const dir = s.changePct === null ? "flatc" : s.changePct > 0 ? "up" : s.changePct < 0 ? "dn" : "flatc";
  const arrow = s.changePct === null ? "" : s.changePct > 0 ? "▲" : s.changePct < 0 ? "▼" : "▬";
  const stroke = down || stale ? "var(--grey)" : dir === "up" ? "var(--up)" : dir === "dn" ? "var(--red-deep)" : "var(--grey)";
  return (
<Link key={s.code} href={`/market-data/?series=${s.code}#chart`} className="cellbox" style={{ display: "block" }}><span className="nd n1"></span><span className="nd n2"></span><span className="nd n3"></span><span className="nd n4"></span>
<div className="meta" style={{ fontSize: "12px", fontWeight: "700", marginBottom: "9px", display: "flex", justifyContent: "space-between", gap: "8px" }}><span>{s.name}</span>{(stale || down) && <span className="mono" style={{ fontSize: "9px", fontWeight: 800, letterSpacing: ".1em", color: down ? "var(--red-deep)" : "var(--st-review-fg)" }}>{down ? "UNAVAILABLE" : "STALE"}</span>}</div>
{down ? (
<div style={{ fontSize: "12.5px", fontWeight: 600, lineHeight: 1.5, color: "var(--slate)", minHeight: "58px" }}>Source not reachable. Last good value <b className="mono">{s.lastGood ? fmtNum(s.lastGood.value) : "—"}</b> {s.unit}. <span style={{ color: "var(--red-text)", fontWeight: 800 }}>Methodology &#8594;</span></div>
) : (
<div style={{ display: "flex", alignItems: "baseline", gap: "9px" }}><span className="mono h" style={{ fontSize: "32px", color: stale ? "var(--grey)" : undefined }}>{fmtNum(s.latest!, s.latest! % 1 ? 1 : 0)}</span><span className="mono meta" style={{ fontSize: "11px", fontWeight: "700" }}>{s.unit}</span>{stale ? <span className="mono" style={{ fontSize: "10px", fontWeight: 800, letterSpacing: ".06em", color: "var(--grey)", marginLeft: "auto" }}>LAST GOOD</span> : <span className={`mono ${dir}`} style={{ fontSize: "13px", fontWeight: "800", marginLeft: "auto" }}>{arrow} {Math.abs(s.changePct ?? 0).toFixed(1)}%</span>}</div>
)}
<svg className="spark" width="100%" height="30" viewBox="0 0 120 30" preserveAspectRatio="none" style={{ display: "block", marginTop: "12px" }} aria-hidden="true"><path d={spark(s.points)} fill="none" stroke={stroke} strokeWidth="2" strokeLinejoin="round" /></svg>
<div className="mono spark" style={{ fontSize: "10px", fontWeight: "700", letterSpacing: ".1em", color: "var(--grey-4)", marginTop: "7px" }}>12 MONTHS</div>
</Link>
  );
})}
</div>
<div className="mktattr" style={{ display: "flex", alignItems: "center", gap: "14px", flexWrap: "wrap", marginTop: "16px", paddingTop: "14px", borderTop: "1px solid var(--line)" }}>
<span style={{ display: "inline-flex", alignItems: "center", gap: "9px" }}><span style={{ width: "74px", height: "26px", border: "1px solid var(--line)", borderRadius: "5px", display: "inline-flex", alignItems: "center", justifyContent: "center", fontSize: "9px", fontWeight: "800", letterSpacing: ".1em", color: "var(--grey-4)" }}>LOGO</span><span className="mono" style={{ fontSize: "11px", fontWeight: "700", color: "var(--slate)" }}>LME &#183; 30-MIN DELAYED</span></span>
<span style={{ width: "1px", height: "18px", background: "var(--line)" }}></span>
<span style={{ display: "inline-flex", alignItems: "center", gap: "9px" }}><span style={{ width: "74px", height: "26px", border: "1px solid var(--line)", borderRadius: "5px", display: "inline-flex", alignItems: "center", justifyContent: "center", fontSize: "9px", fontWeight: "800", letterSpacing: ".1em", color: "var(--grey-4)" }}>LOGO</span><span className="mono" style={{ fontSize: "11px", fontWeight: "700", color: "var(--slate)" }}>[PRICE AGENCY] &#183; WEEKLY ASSESSMENT</span></span>
<span className="meta" style={{ marginLeft: "auto", fontSize: "11px", lineHeight: "1.5", maxWidth: "560px", textAlign: "right" }}>Zinc: LME 3-month, delayed 30 minutes. Wire rod, HR coil, freight: assessed prices reproduced under licence. &#169; the respective providers. Not for redistribution, scraping or export. Indicative only — not a quotation.</span>
</div>
</div>
</section>
    </>
  );
}
