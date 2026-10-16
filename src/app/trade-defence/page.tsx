import type { Metadata } from "next";
import { pageMeta } from "@/lib/seo";
import { Shell } from "@/components/shell/Shell";
import { IntelHero } from "@/components/boards/intel/IntelHero";
import { TradeDefenceBoard } from "@/components/boards/intel/TradeDefenceBoard";
import { AUTH_LIVE } from "@/lib/live";
import "@/styles/board-intel.css";

export const metadata: Metadata = pageMeta({ title: "Trade defence tracker", description: "Anti-dumping, countervailing and safeguard cases on steel wire, wire mesh, fencing, nails and grating: stages, duty rates, companies and key dates.", path: "/trade-defence/" });

export default function TradeDefencePage() {
  return (
    <Shell header="compact" board="b-intel">
      <IntelHero here="/trade-defence/" crumb="Trade defence tracker" title="Trade defence tracker" lede="Every anti-dumping, countervailing and safeguard case that touches wire, mesh, fencing, nails and grating — who imposes it, on whom, at what rate, and what happens next." />
      <TradeDefenceBoard live={AUTH_LIVE} />
    </Shell>
  );
}
