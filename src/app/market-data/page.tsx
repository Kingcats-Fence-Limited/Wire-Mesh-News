import type { Metadata } from "next";
import { Suspense } from "react";
import { pageMeta } from "@/lib/seo";
import { Shell } from "@/components/shell/Shell";
import { MARKET_SERIES } from "@/lib/content/market";
import { byMarketSeries, bySection } from "@/lib/content/articles";
import { MarketBoard, MarketFromUrl, type MarketData } from "@/components/boards/market/MarketBoard";

export const metadata: Metadata = pageMeta({ title: "Market data", description: "Licensed price series for zinc, wire rod, hot-rolled coil, galvanized mesh panels and container freight, with the articles that explain the moves.", path: "/market-data/" });

/* Static; the selected series (?series=) is applied in the browser. */
export default function MarketDataPage() {
  const fallback = bySection("market_insights", 3);
  const mini = (a: (typeof fallback)[number]) => ({ slug: a.slug, title: a.title, type: a.type, section: a.section, date: a.date });
  const data: MarketData = {
    related: Object.fromEntries(MARKET_SERIES.map((s) => { const moved = byMarketSeries(s.code, 3); return [s.code, (moved.length ? moved : fallback).map(mini)]; })),
    tagged: Object.fromEntries(MARKET_SERIES.map((s) => [s.code, byMarketSeries(s.code, 1).length > 0])),
  };
  return (
    <Shell header="compact" active="market_insights" board="b-mkt">
      <Suspense fallback={<MarketBoard data={data} />}>
        <MarketFromUrl data={data} />
      </Suspense>
    </Shell>
  );
}
