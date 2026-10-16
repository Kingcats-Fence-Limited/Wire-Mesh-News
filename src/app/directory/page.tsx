import type { Metadata } from "next";
import { Suspense } from "react";
import { pageMeta } from "@/lib/seo";
import { Shell } from "@/components/shell/Shell";
import { DirectoryBoard, DirectoryFromUrl, type DirData } from "@/components/boards/directory/DirectoryBoard";
import { COMPANIES } from "@/lib/content/directory";
import { ARTICLES } from "@/lib/content/articles";

export const metadata: Metadata = pageMeta({ title: "Company Directory", description: "Manufacturers, fabricators, distributors, machinery makers and test labs in wire mesh, classified by editors. Listing and order are never paid for.", path: "/directory/" });

/* Static and cached: the server renders the unfiltered directory (what crawlers and the first
   paint see) and the browser applies the filters from the address bar. */
export default function DirectoryPage() {
  const data: DirData = {
    companies: COMPANIES,
    artCounts: Object.fromEntries(COMPANIES.map((c) => [c.slug, ARTICLES.filter((a) => a.companies?.includes(c.slug)).length])),
  };
  return (
    <Shell header="compact" active="directory" board="b-dir">
      <Suspense fallback={<DirectoryBoard sp={{}} data={data} />}>
        <DirectoryFromUrl data={data} />
      </Suspense>
    </Shell>
  );
}
