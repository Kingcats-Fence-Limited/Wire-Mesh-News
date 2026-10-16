"use client";

/* Companies on the paid Company plan, for the PAID MEMBER mark on Directory cards and
   profiles. Preview: the content's own flag. Live: the server's list (pages stay static). */
import { useEffect, useState } from "react";
import { AUTH_LIVE } from "@/lib/live";
import type { Company } from "@/lib/content/types";

let cached: Promise<string[]> | null = null;
const load = () => (cached ??= fetch("/api/directory/paid/").then((r) => (r.ok ? r.json() : { slugs: [] })).then((j: { slugs: string[] }) => j.slugs).catch(() => []));

export function usePaidMembers(companies: Pick<Company, "slug" | "paidMember">[]): Set<string> {
  const [live, setLive] = useState<string[] | null>(null);
  useEffect(() => { if (AUTH_LIVE) void load().then(setLive); }, []);
  return new Set(AUTH_LIVE ? live ?? [] : companies.filter((c) => c.paidMember).map((c) => c.slug));
}
