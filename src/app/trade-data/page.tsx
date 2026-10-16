import type { Metadata } from "next";
import { pageMeta } from "@/lib/seo";
import { Shell } from "@/components/shell/Shell";
import { IntelHero } from "@/components/boards/intel/IntelHero";
import { TradeDataBoard } from "@/components/boards/intel/TradeDataBoard";
import { AUTH_LIVE } from "@/lib/live";
import "@/styles/board-intel.css";

export const metadata: Metadata = pageMeta({ title: "Trade statistics", description: "Imports and exports of wire mesh, fencing, barbed wire and steel wire by HS code: yearly totals free, monthly detail, partner rankings and unit values for Pro readers. Official sources.", path: "/trade-data/" });

export default function TradeDataPage() {
  return (
    <Shell header="compact" board="b-intel">
      <IntelHero crumb="Trade statistics" title="Who is buying, and from whom" lede="Official import and export statistics for wire, mesh and fencing products by HS code — where the volume goes, who supplies it, and at what average unit value." />
      <TradeDataBoard live={AUTH_LIVE} />
    </Shell>
  );
}
