import type { Metadata } from "next";
import { MarketBoard } from "@/components/boards/market/MarketBoard";

export const metadata: Metadata = { title: "Market data", description: "Licensed price series for zinc, wire rod, hot-rolled coil, galvanized mesh panels and container freight, with the articles that explain the moves." };

export default async function MarketDataPage({ searchParams }: { searchParams: Promise<{ series?: string }> }) {
  return <MarketBoard selected={(await searchParams).series} />;
}
