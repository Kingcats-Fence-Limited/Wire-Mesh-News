import type { Metadata } from "next";
import { pageMeta } from "@/lib/seo";
import { PricingBoard } from "@/components/boards/pricing/PricingBoard";

export const metadata: Metadata = pageMeta({ title: "Plans & pricing", description: "Wire Mesh News Pro, Team and Company plans: tenders and project leads, trade-defence tracker, trade statistics, analysis and templates for the wire, mesh, fencing and grating trade. 14-day free trial.", path: "/pricing/" });

export default function PricingPage() {
  return <PricingBoard />;
}
