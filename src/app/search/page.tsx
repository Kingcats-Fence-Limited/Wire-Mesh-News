import type { Metadata } from "next";
import { SearchBoard, type SearchParamsT } from "@/components/boards/search/SearchBoard";

export const metadata: Metadata = { title: "Search", robots: { index: false, follow: true } };

export default async function SearchPage({ searchParams }: { searchParams: Promise<SearchParamsT> }) {
  return <SearchBoard sp={await searchParams} />;
}
