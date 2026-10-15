import type { Metadata } from "next";
import { pageMeta } from "@/lib/seo";
import { MethodologyBoard } from "@/components/boards/market/MethodologyBoard";

export const metadata: Metadata = pageMeta({ title: "Market data methodology", description: "Where each price series comes from, how often it updates, how long it is delayed, and what it can and cannot be used for.", path: "/market-data/methodology/" });

export default function MethodologyPage() {
  return <MethodologyBoard />;
}
