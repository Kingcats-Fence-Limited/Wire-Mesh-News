import type { Metadata } from "next";
import { Suspense } from "react";
import { pageMeta } from "@/lib/seo";
import { Shell } from "@/components/shell/Shell";
import { STANDARDS } from "@/lib/content/source";
import { byStandard } from "@/lib/content/articles";
import { StandardsBoard, StandardsFromUrl, type StdData } from "@/components/boards/standards/StandardsIndex";
import "@/styles/board-std.css";

export const metadata: Metadata = pageMeta({ title: "Standards Index", description: "Number, publishing body, status, scope summary and our coverage for the standards that govern wire mesh — bibliographic facts and our own summaries only, never the standard's text.", path: "/standards/" });

/* Static; filters and sorting run in the browser. */
export default function StandardsPage() {
  const data: StdData = { standards: STANDARDS, articleCounts: Object.fromEntries(STANDARDS.map((s) => [s.no, byStandard(s.no).length])) };
  return (
    <Shell header="compact" active="standards" board="b-std">
      <Suspense fallback={<StandardsBoard sp={{}} data={data} />}>
        <StandardsFromUrl data={data} />
      </Suspense>
    </Shell>
  );
}
