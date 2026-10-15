"use client";
/* Read the query string in the browser, with the same rules as the server helper (first value
   only, length-capped). Used by pages that are static and filter on the client. */
import { useSearchParams } from "next/navigation";
import { flat } from "@/lib/params";

export function useFlatParams<T extends object>(): T {
  const p = useSearchParams();
  const raw: Record<string, string> = {};
  p.forEach((v, k) => { if (!(k in raw)) raw[k] = v; });
  return flat<T>(raw);
}
