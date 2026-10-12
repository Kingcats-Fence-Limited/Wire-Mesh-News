import Link from "next/link";
import type { Metadata } from "next";
import { Shell, Crumbs } from "@/components/site/Shell";
import { Badge } from "@/components/ui/Primitives";
import { PolicyLayout } from "@/components/site/PolicyLayout";
import { MARKET_SERIES } from "@/lib/content/market";
import { SITE } from "@/lib/site";

export const metadata: Metadata = { title: "Market data methodology", description: "How Wire Mesh News sources, delays, displays and corrects the market data it publishes." };

const NAV = [
  { label: "Overview", href: "/market-data/" },
  { label: "Methodology", href: "/market-data/methodology/", active: true },
  { label: "Series definitions", href: "#s2", sub: true },
  { label: "Timing and delays", href: "#s3", sub: true },
  { label: "Our own survey price", href: "#s4", sub: true },
  { label: "Attribution", href: "#s5", sub: true },
  { label: "Disclaimer", href: "#s6", sub: true },
  { label: "Corrections", href: "#s7", sub: true },
];

export default function MethodologyPage() {
  return (
    <Shell>
      <div className="wrap pt-7"><Crumbs items={[{ label: "Market data", href: "/market-data/" }, { label: "Methodology" }]} /></div>
      <PolicyLayout navTitle="Market data" nav={NAV} title="How we source and display market data" updated="2026-10-12" version="1" inShort="The prices on Wire Mesh News come from licensed third-party providers and from our own quarterly survey. Nothing here is a live quote. Exchange data is shown with a delay, benchmark prices are shown as published by their assessors, and every figure carries its source and timestamp. We do not offer downloads, feeds or trading signals.">
        <h2 id="s1">1 · What this page covers</h2>
        <p>This page explains where each number on the <Link href="/market-data/" className="std-link">Market data</Link> page and in the homepage market snapshot comes from, how often it updates, how long it is delayed, and what it can and cannot be used for. It applies to every chart, table and sparkline on the site that shows a price.</p>

        <h2 id="s2">2 · Series definitions</h2>
        <p>Six series are published. Each has a fixed definition that does not change without a note in the change history.</p>
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-[12.5px]">
            <thead><tr>{["Series", "Definition", "Unit", "Updates", "Delay", "Source"].map((h) => <th key={h} className="bg-ink px-3 py-2 text-left text-[10px] font-extrabold tracking-[0.1em] text-white dark:bg-dark-3">{h.toUpperCase()}</th>)}</tr></thead>
            <tbody>
              {MARKET_SERIES.map((s) => (
                <tr key={s.code} className="even:bg-paper-2">
                  <td className="border-b border-line px-3 py-2 font-extrabold">{s.name}</td>
                  <td className="border-b border-line px-3 py-2">{s.definition}</td>
                  <td className="num border-b border-line px-3 py-2">{s.unit}</td>
                  <td className="border-b border-line px-3 py-2">{s.updates.split(",")[0]}</td>
                  <td className="border-b border-line px-3 py-2">{s.licence === "delayed30" ? <Badge tone="delayed" size="sm">30 min</Badge> : s.licence === "nextday" ? <Badge tone="current" size="sm">Next day</Badge> : s.licence === "own" ? <Badge tone="current" size="sm">Own data</Badge> : <Badge tone="review" size="sm">As published</Badge>}</td>
                  <td className="border-b border-line px-3 py-2">{s.source === "Provider" ? "[Provider]" : s.source}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <h2 id="s3">3 · Timing and delays</h2>
        <ul>
          <li>Exchange prices are delayed by at least 30 minutes, as required by our licence. The delay is stated next to every figure.</li>
          <li>Assessed benchmark prices appear on the site after the provider publishes them, normally within one business day.</li>
          <li>Every figure shows an <b>as of</b> time in UTC. If a series has not updated within its expected window it is marked <b>STALE</b> rather than shown as current. If a source cannot be reached, the last good value is shown with a <b>LAST GOOD VALUE</b> label and its original timestamp.</li>
          <li>Charts show the look-back period our licence permits, currently [12] months. Older history is not available on the site.</li>
        </ul>

        <h2 id="s4">4 · Our own survey price</h2>
        <p>The galvanized mesh panel series is produced by Wire Mesh News. Each quarter we request indicative ex-works prices for a fixed reference specification ([mesh size, wire diameter, panel size, coating class]) from [N] manufacturers and [N] distributors in [REGION]. Responses are anonymised; the highest and lowest [10]% are excluded and the remainder is averaged. We publish the number of responses with every release. Participants are not named and no individual quotation is published.</p>

        <h2 id="s5">5 · Attribution and copyright</h2>
        <div className="my-4 flex flex-wrap items-center gap-4 rounded-card border border-line p-4">
          <span className="inline-flex h-9 w-[110px] items-center justify-center rounded border border-dashed border-line-2 text-[10px] font-extrabold tracking-[0.1em] text-grey">LME LOGO</span>
          <span className="inline-flex h-9 w-[110px] items-center justify-center rounded border border-dashed border-line-2 text-[10px] font-extrabold tracking-[0.1em] text-grey">PROVIDER LOGO</span>
          <span className="meta flex-1 basis-[260px] text-[12px] leading-[1.55]">[Required attribution wording, verbatim from each licence. Example form: “LME data © The London Metal Exchange. Delayed by at least 30 minutes. Not for redistribution.”]</span>
        </div>
        <p>Third-party data is reproduced under licence and remains the property of its providers. You may quote a figure from this site with attribution to the original source and to Wire Mesh News. You may not scrape, redistribute, or republish the data series, in whole or in part.</p>

        <h2 id="s6">6 · Disclaimer</h2>
        <p>Market data on this site is provided for general information only. It is not a quotation, an offer to buy or sell, or investment, trading or procurement advice. Prices for specific products vary by specification, volume, delivery terms and counterparty, and may differ materially from the series shown here. Wire Mesh News and its data providers accept no liability for decisions made on the basis of this information.</p>

        <h2 id="s7">7 · Corrections</h2>
        <p>If you believe a figure is wrong, write to <a href={`mailto:${SITE.email}`} className="font-extrabold text-red-text">{SITE.email}</a> with the series, date and the value you expected. Errors originating with a provider are passed to that provider; errors in our own survey are corrected on the site with a dated note. Our general <Link href="/policies/corrections/" className="std-link">Corrections</Link> policy applies.</p>
      </PolicyLayout>
    </Shell>
  );
}
