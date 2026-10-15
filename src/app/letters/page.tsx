import type { Metadata } from "next";
import { Suspense } from "react";
import { pageMeta } from "@/lib/seo";
import { Shell } from "@/components/shell/Shell";
import { LettersBoard, LettersFromUrl } from "@/components/boards/letters/LettersIndex";
import "@/styles/board-let.css";

export const metadata: Metadata = pageMeta({ title: "Letters & Opinion", description: "Short, signed letters from people who specify, buy, test and make wire mesh — and regular columns from outside the newsroom.", path: "/letters/" });

/* Static; tab, filters, sort and paging run in the browser. */
export default function LettersPage() {
  return (
    <Shell header="compact" board="b-let">
      <Suspense fallback={<LettersBoard sp={{}} />}>
        <LettersFromUrl />
      </Suspense>
    </Shell>
  );
}
