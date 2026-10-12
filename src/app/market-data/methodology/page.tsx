import type { Metadata } from "next";
import { MethodologyBoard } from "@/components/boards/market/MethodologyBoard";

export const metadata: Metadata = { title: "Market data methodology", description: "Where each price series comes from, how often it updates, how long it is delayed, and what it can and cannot be used for." };

export default function MethodologyPage() {
  return <MethodologyBoard />;
}
