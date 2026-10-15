import type { Metadata } from "next";
import { flat } from "@/lib/params";
import { pageMeta } from "@/lib/seo";
import { MarketBoard } from "@/components/boards/market/MarketBoard";

export const metadata: Metadata = pageMeta({ title: "Market data", description: "Licensed price series for zinc, wire rod, hot-rolled coil, galvanized mesh panels and container freight, with the articles that explain the moves.", path: "/market-data/" });

export default async function MarketDataPage({ searchParams }: { searchParams: Promise<{ series?: string }> }) {
  return <MarketBoard selected={flat<Awaited<typeof searchParams>>(await searchParams as Record<string, string | string[] | undefined>).series} />;
}
