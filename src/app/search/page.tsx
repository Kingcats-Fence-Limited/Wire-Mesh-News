import type { Metadata } from "next";
import { Suspense } from "react";
import { pageMeta } from "@/lib/seo";
import { Shell } from "@/components/shell/Shell";
import { SearchBoard, SearchFromUrl } from "@/components/boards/search/SearchBoard";

export const metadata: Metadata = pageMeta({ title: "Search", description: "Search news, guides, standards, companies and events.", path: "/search/", noindex: true });

/* Static; the query is matched in the browser against /search-index.json. */
export default function SearchPage() {
  return (
    <Shell header="compact" board="b-srch">
      <Suspense fallback={<SearchBoard sp={{}} index={[]} />}>
        <SearchFromUrl />
      </Suspense>
    </Shell>
  );
}
