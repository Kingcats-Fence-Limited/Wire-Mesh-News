import type { Metadata } from "next";
import { pageMeta } from "@/lib/seo";
import { SearchBoard, type SearchParamsT } from "@/components/boards/search/SearchBoard";

export const metadata: Metadata = pageMeta({ title: "Search", description: "Search news, guides, standards, companies and events.", path: "/search/", noindex: true });

export default async function SearchPage({ searchParams }: { searchParams: Promise<SearchParamsT> }) {
  return <SearchBoard sp={await searchParams} />;
}
