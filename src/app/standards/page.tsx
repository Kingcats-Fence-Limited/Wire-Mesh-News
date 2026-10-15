import type { Metadata } from "next";
import { pageMeta } from "@/lib/seo";
import { StandardsBoard, type StdParams } from "@/components/boards/standards/StandardsBoard";

export const metadata: Metadata = pageMeta({ title: "Standards Index", description: "Number, publishing body, status, scope summary and our coverage for the standards that govern wire mesh — bibliographic facts and our own summaries only, never the standard's text.", path: "/standards/" });

export default async function StandardsPage({ searchParams }: { searchParams: Promise<StdParams> }) {
  return <StandardsBoard sp={await searchParams} />;
}
