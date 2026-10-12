import Link from "next/link";
import type { Metadata } from "next";
import { Shell, PageHead } from "@/components/site/Shell";
import { Badge, Card } from "@/components/ui/Primitives";
import { MarketCell, Attribution, Change, LicenceBadge } from "@/components/site/Market";
import { MarketChart } from "@/components/site/MarketChart";
import { ArticleCard } from "@/components/site/ArticleCards";
import { MARKET_SERIES, MARKET_LICENSED } from "@/lib/content/market";
import { byMarketSeries } from "@/lib/content/articles";
import { fmtNum } from "@/lib/site";

export const metadata: Metadata = { title: "Market data", description: "Licensed exchange and benchmark prices for the inputs behind every mesh quotation — zinc, wire rod, hot-rolled coil, freight — with a published methodology." };

const asOf = (iso: string) => new Intl.DateTimeFormat("en-GB", { day: "2-digit", month: "short", hour: "2-digit", minute: "2-digit", hour12: false, timeZone: "UTC" }).format(new Date(iso)).replace(",", "") + " UTC";

export default async function MarketDataPage({ searchParams }: { searchParams: Promise<{ series?: string }> }) {
  const sp = await searchParams;
  const sel = MARKET_SERIES.find((s) => s.code === sp.series) ?? MARKET_SERIES[0];
  const moved = byMarketSeries(sel.code, 3);
  if (!MARKET_LICENSED) {
    return (
      <Shell>
        <PageHead crumbs={[{ label: "Market Insights", href: "/market-insights/" }, { label: "Market data" }]} title="Market data" intro="Licensed market data goes live once the data agreements are signed. Until then this page shows no figures — not placeholders, not estimates." />
      </Shell>
    );
  }
  return (
    <Shell>
      <PageHead
        crumbs={[{ label: "Market Insights", href: "/market-insights/" }, { label: "Market data" }]}
        title="Market data"
        intro="The inputs behind every mesh quotation: exchange zinc, assessed wire rod and coil, container freight, and our own quarterly panel survey. Delayed, licensed, and explained — nothing here is a live quote."
        aside={<div className="flex flex-col items-start gap-2 md:items-end"><div className="flex gap-2"><Badge tone="delayed">Delayed 30 min</Badge><Badge tone="review">Licensed</Badge></div><Link href="/market-data/methodology/" className="text-[12.5px] font-extrabold tracking-[0.06em] text-red-text">HOW WE SOURCE AND DISPLAY THIS →</Link></div>}
      />

      <div className="wrap pt-6">
        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-[13.5px]">
            <thead><tr>{["Series", "Unit", "Latest", "Δ", "Δ %", "As of", "Source", "Licence"].map((h) => <th key={h} className="bg-ink px-3 py-2.5 text-left text-[10.5px] font-extrabold tracking-[0.1em] text-white first:rounded-tl-lg last:rounded-tr-lg dark:bg-dark-3">{h.toUpperCase()}</th>)}</tr></thead>
            <tbody>
              {MARKET_SERIES.map((s) => (
                <tr key={s.code} className={`even:bg-paper-2 ${s.code === sel.code ? "outline outline-2 -outline-offset-2 outline-red" : ""}`}>
                  <td className="border-b border-line px-3 py-2.5"><Link href={`/market-data/?series=${s.code}#chart`} className="font-extrabold hover:text-red-text">{s.name}</Link><span className="meta block text-[11px]">{s.definition}</span></td>
                  <td className="num border-b border-line px-3 py-2.5 text-slate">{s.unit}</td>
                  <td className="num border-b border-line px-3 py-2.5 font-extrabold">{s.state === "unavailable" ? <span className="text-[10.5px] font-extrabold tracking-[0.08em] text-grey">UNAVAILABLE</span> : <span className={s.state === "stale" ? "text-grey" : ""}>{fmtNum(s.latest!, s.latest! % 1 ? 2 : 0)}</span>}</td>
                  <td className="num border-b border-line px-3 py-2.5">{s.state === "live" ? <span className={s.change! > 0 ? "text-up" : s.change! < 0 ? "text-down" : "text-flat"}>{s.change! > 0 ? "+" : ""}{fmtNum(s.change!, Math.abs(s.change!) < 10 ? 2 : 0)}</span> : "—"}</td>
                  <td className="border-b border-line px-3 py-2.5">{s.state === "live" ? <Change pct={s.changePct} /> : s.state === "stale" ? <Badge tone="review" size="sm">Stale</Badge> : <Badge tone="withdrawn" size="sm">Unavailable</Badge>}</td>
                  <td className="num border-b border-line px-3 py-2.5 text-[12px] text-slate">{s.state === "unavailable" ? `Last good ${asOf(s.lastGood!.asOf)}` : asOf(s.asOf)}</td>
                  <td className="border-b border-line px-3 py-2.5 text-[12.5px] font-bold">{s.source}</td>
                  <td className="border-b border-line px-3 py-2.5"><LicenceBadge s={s} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="meta mt-3 text-[12px]">Six series in this first release. History is shown for the look-back period our licences permit (currently 12 months). No export, no API. Figures are indicative and not a quotation.</p>

        {/* Chart + states */}
        <div id="chart" className="mt-8 grid scroll-mt-20 gap-5 lg:grid-cols-[1.3fr_1fr]">
          <Card>
            <div className="flex flex-wrap items-baseline justify-between gap-2">
              <div><span className="font-display text-[16px]">{sel.name}</span><span className="meta ml-2">{sel.unit} · {sel.updates}</span></div>
              <LicenceBadge s={sel} />
            </div>
            <MarketChart series={sel} />
            <div className="mt-3 flex flex-wrap gap-2">
              {MARKET_SERIES.map((s) => <Link key={s.code} href={`/market-data/?series=${s.code}#chart`} className={`inline-flex min-h-[32px] items-center rounded-full border px-3 text-[12px] font-bold ${s.code === sel.code ? "border-ink bg-ink text-white dark:border-white dark:bg-white dark:text-ink" : "border-line hover:border-ink"}`}>{s.name.split(",")[0]}</Link>)}
            </div>
          </Card>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-1">
            {MARKET_SERIES.filter((s) => s.state !== "live").map((s) => <MarketCell key={s.code} s={s} href={`/market-data/?series=${s.code}#chart`} />)}
            <Card tone="paper" padding="sm">
              <div className="kicker text-[10px]">Three states, never a zero</div>
              <ul className="mt-2 flex flex-col gap-1.5 text-[12.5px] font-medium leading-[1.5] text-fg-3">
                <li><b>Live</b> — within the expected update window.</li>
                <li><b>Stale</b> — overdue: last good value greyed, change hidden, timestamp shown.</li>
                <li><b>Unavailable</b> — source unreachable: text explanation and a link to the methodology.</li>
              </ul>
            </Card>
          </div>
        </div>

        <Attribution className="mt-5" />

        {/* What moved the market */}
        <section className="mt-10 rounded-card border border-line p-6">
          <div className="flex flex-wrap items-baseline justify-between gap-3">
            <div className="flex items-center gap-2.5"><span className="h-[3px] w-[15px] bg-red" /><span className="font-display text-[13px] tracking-[0.1em]">WHAT MOVED THE MARKET</span><span className="meta">· {sel.name}</span></div>
            <Link href="/market-insights/" className="text-[11.5px] font-extrabold tracking-[0.06em] text-red-text">ALL MARKET INSIGHTS →</Link>
          </div>
          <div className="mt-4 grid gap-6 md:grid-cols-3">{moved.map((a) => <ArticleCard key={a.slug} a={a} showDek={false} />)}</div>
          <p className="meta mt-4 border-t border-line-soft pt-3 text-[12px] leading-[1.6]">Editors tag Market Insights articles with the series they explain; the three most recent for the selected series appear here. The numbers say what happened; the articles say why.</p>
        </section>
      </div>
    </Shell>
  );
}
