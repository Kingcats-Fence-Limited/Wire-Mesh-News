import type { Metadata } from "next";
import { StandardsBoard, type StdParams } from "@/components/boards/standards/StandardsBoard";

export const metadata: Metadata = { title: "Standards Index", description: "Number, publishing body, status, scope summary and our coverage for the standards that govern wire mesh — bibliographic facts and our own summaries only, never the standard's text." };

export default async function StandardsPage({ searchParams }: { searchParams: Promise<StdParams> }) {
  return <StandardsBoard sp={await searchParams} />;
}
