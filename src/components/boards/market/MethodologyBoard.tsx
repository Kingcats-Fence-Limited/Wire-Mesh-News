/* Ported 1:1 from canvas board Method-X2. */
import Link from "next/link";
import { Shell } from "@/components/shell/Shell";
import { MARKET_SERIES } from "@/lib/content/market";
import { SITE } from "@/lib/site";
import "@/styles/board-meth.css";

export function MethodologyBoard() {
  return (
    <Shell header="compact" active="market_insights" board="b-meth">
<section style={{ paddingTop: "30px", paddingBottom: "50px" }} className="wrap">
<div style={{ display: "grid", gridTemplateColumns: "180px minmax(0,1fr)", gap: "34px", alignItems: "start", maxWidth: "1000px" }} className="cols">
<nav aria-label="Market data pages" style={{ display: "flex", flexDirection: "column", gap: "9px", position: "sticky", top: "20px" }} className="pnav">
<div style={{ fontSize: "11.5px", fontWeight: "800", letterSpacing: ".12em", color: "var(--slate)", marginBottom: "3px" }}>MARKET DATA</div>
<Link href="/market-data/">Overview</Link>
<a href="#top" className="on">Methodology</a>
<a href="#s2" style={{ paddingLeft: "12px" }}>Series definitions</a>
<a href="#s3" style={{ paddingLeft: "12px" }}>Timing and delays</a>
<a href="#s4" style={{ paddingLeft: "12px" }}>Our own survey price</a>
<a href="#s5" style={{ paddingLeft: "12px" }}>Attribution</a>
<a href="#s6" style={{ paddingLeft: "12px" }}>Disclaimer</a>
<a href="#s7" style={{ paddingLeft: "12px" }}>Corrections</a>
<div style={{ height: "1px", background: "var(--line)", margin: "6px 0" }}></div>
<Link href="/market-insights/">Market Insights →</Link>
</nav>
<div className="body">
<nav aria-label="Breadcrumb" className="meta" style={{ marginBottom: "12px" }}><Link href="/" style={{ color: "var(--slate)" }}>Home</Link> / <Link href="/market-data/" style={{ color: "var(--slate)" }}>Market data</Link> / <b style={{ color: "var(--ink)" }}>Methodology</b></nav>
<h1 style={{ margin: "0 0 10px", fontSize: "34px", letterSpacing: "-.045em" }} className="h">How we source and display market data</h1>
<div style={{ display: "flex", gap: "14px", flexWrap: "wrap", alignItems: "center", paddingBottom: "16px", borderBottom: "1px solid var(--line)", marginBottom: "18px" }}>
<span className="meta">Last updated 12 October 2026</span>
<span style={{ width: "1px", height: "14px", background: "var(--line)" }}></span>
<span className="meta">Version 1</span>
</div>
<div style={{ background: "var(--paper)", borderLeft: "4px solid var(--ink)", borderRadius: "0 10px 10px 0", padding: "14px 18px", marginBottom: "22px" }}>
<div style={{ fontSize: "11.5px", fontWeight: "800", letterSpacing: ".1em", color: "var(--slate)", marginBottom: "5px" }}>IN SHORT</div>
<div style={{ fontSize: "14px", fontWeight: "500", lineHeight: "1.6", color: "var(--fg-3)" }}>The prices on Wire Mesh News come from licensed third-party providers and from our own quarterly survey. Nothing here is a live quote. Exchange data is shown with a delay, benchmark prices are shown as published by their assessors, and every figure carries its source and timestamp. We do not offer downloads, feeds or trading signals.</div>
</div>
<h2 id="s1">1 · What this page covers</h2>
<p>This page explains where each number on the <Link href="/market-data/" className="lnk">Market data</Link> page and in the homepage market snapshot comes from, how often it updates, how long it is delayed, and what it can and cannot be used for. It applies to every chart, table and sparkline on the site that shows a price.</p>
<h2 id="s2">2 · Series definitions</h2>
<p>Six series are published. Each has a fixed definition that does not change without a note in the change history.</p>
<div className="tablewrap">
<table style={{ marginBottom: "14px" }}>
<thead><tr><th style={{ width: "24%" }}>SERIES</th><th>DEFINITION</th><th>UNIT</th><th>UPDATES</th><th>DELAY</th><th>SOURCE</th></tr></thead>
<tbody>
{MARKET_SERIES.map((s) => (
<tr key={s.code}><td><b>{s.name}</b></td><td>{s.definition}</td><td className="mono">{s.unit}</td><td>{s.updates.split(",")[0]}</td><td>{s.licence === "delayed30" ? <span className="badge bad">30 MIN</span> : s.licence === "nextday" ? <span className="badge ok">NEXT DAY</span> : s.licence === "own" ? <span className="badge ok">OWN DATA</span> : <span className="badge warn">AS PUBLISHED</span>}</td><td>{s.source}</td></tr>
))}
</tbody>
</table>
</div>
<h2 id="s3">3 · Timing and delays</h2>
<ul>
<li>Exchange prices are delayed by at least 30 minutes, as required by our licence. The delay is stated next to every figure.</li>
<li>Assessed benchmark prices appear on the site after the provider publishes them, normally within one business day.</li>
<li>Every figure shows an <b>as of</b> time in UTC. If a series has not updated within its expected window, it is marked <b>STALE</b> rather than shown as current. If a source cannot be reached, the last good value is shown with a <b>LAST GOOD VALUE</b> label and its original timestamp.</li>
<li>Charts show the look-back period our licence permits, currently 12 months. Older history is not available on the site.</li>
</ul>
<h2 id="s4">4 · Our own survey price</h2>
<p>The galvanized mesh panel series is produced by Wire Mesh News. Each quarter we request indicative ex-works prices for a fixed reference specification (50 × 200 mm aperture, 5 mm wire, 2 500 × 2 030 mm panel, hot-dip galvanized ≥ 275 g/m²) from manufacturers and distributors in northern Europe. Responses are anonymised; the highest and lowest 10% are excluded and the remainder is averaged. We publish the number of responses with every release. Participants are not named and no individual quotation is published.</p>
<h2 id="s5">5 · Attribution and copyright</h2>
<div style={{ border: "1px solid var(--line)", borderRadius: "12px", padding: "16px 18px", marginBottom: "12px", display: "flex", gap: "18px", alignItems: "center", flexWrap: "wrap" }}>
<span style={{ width: "110px", height: "34px", border: "1.5px dashed #C9CBD4", borderRadius: "6px", display: "inline-flex", alignItems: "center", justifyContent: "center", fontSize: "10px", fontWeight: "800", letterSpacing: ".1em", color: "var(--grey)" }}>LME LOGO</span>
<span style={{ width: "110px", height: "34px", border: "1.5px dashed #C9CBD4", borderRadius: "6px", display: "inline-flex", alignItems: "center", justifyContent: "center", fontSize: "10px", fontWeight: "800", letterSpacing: ".1em", color: "var(--grey)" }}>PROVIDER LOGO</span>
<span style={{ flex: "1 1 260px", fontSize: "12px", lineHeight: "1.55" }} className="meta">LME data &#169; The London Metal Exchange. Delayed by at least 30 minutes. Not for redistribution. Assessed prices &#169; their respective providers, reproduced under licence; the exact attribution wording of each licence is reproduced here when the agreement is signed.</span>
</div>
<p>Third-party data is reproduced under licence and remains the property of its providers. You may quote a figure from this site with attribution to the original source and to Wire Mesh News. You may not scrape, redistribute, or republish the data series, in whole or in part.</p>
<h2 id="s6">6 · Disclaimer</h2>
<p>Market data on this site is provided for general information only. It is not a quotation, an offer to buy or sell, or investment, trading or procurement advice. Prices for specific products vary by specification, volume, delivery terms and counterparty, and may differ materially from the series shown here. Wire Mesh News and its data providers accept no liability for decisions made on the basis of this information.</p>
<h2 id="s7">7 · Corrections</h2>
<p>If you believe a figure is wrong, write to <a href={`mailto:${SITE.email}`} style={{ fontWeight: "800", color: "var(--red)" }}>{SITE.email}</a> with the series, date and the value you expected. Errors originating with a provider are passed to that provider; errors in our own survey are corrected on the site with a dated note. Our general <Link href="/policies/corrections/" className="lnk">Corrections</Link> policy applies.</p>
<div style={{ display: "flex", gap: "14px", alignItems: "center", background: "var(--paper)", borderRadius: "12px", padding: "16px 20px", flexWrap: "wrap", marginTop: "22px" }}>
<span style={{ fontSize: "14px", fontWeight: "700" }}>Questions about a series or a licence?</span>
<a href={`mailto:${SITE.email}`} style={{ fontSize: "13.5px", fontWeight: "800", color: "var(--red)" }}>{SITE.email}</a>
</div>
</div>
</div>
</section>
    </Shell>
  );
}
