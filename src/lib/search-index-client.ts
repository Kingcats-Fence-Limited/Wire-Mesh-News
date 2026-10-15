"use client";
/* The site-search index, fetched once per visit the first time any search UI needs it. */
import type { SearchDoc } from "@/lib/search-core";

let indexPromise: Promise<SearchDoc[]> | null = null;
export const loadSearchIndex = () =>
  (indexPromise ??= fetch("/search-index.json")
    .then((r) => (r.ok ? r.json() : []))
    .catch(() => { indexPromise = null; return []; }));
