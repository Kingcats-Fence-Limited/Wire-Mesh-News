import type { Metadata } from "next";
import { Suspense } from "react";
import { Shell, PageHead } from "@/components/site/Shell";
import { SearchResults } from "@/components/site/SearchResults";

export const metadata: Metadata = { title: "Search", robots: { index: false, follow: true } };

export default function SearchPage() {
  return (
    <Shell>
      <PageHead crumbs={[{ label: "Search" }]} title="Search" aside={<span className="meta flex items-center gap-2 text-[12px]">Press <kbd className="num inline-flex h-5 min-w-5 items-center justify-center rounded-[5px] border border-line-2 border-b-2 bg-bg px-1 text-[10.5px] font-extrabold text-slate">/</kbd> anywhere for quick search</span>} />
      <Suspense fallback={<div className="wrap py-10"><p className="meta">Loading…</p></div>}>
        <SearchResults />
      </Suspense>
    </Shell>
  );
}
