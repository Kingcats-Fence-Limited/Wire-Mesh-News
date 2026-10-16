"use client";

/* Directory Sponsors (yearly), shared by the cards, profiles and sponsor spots. One request
   per page; pages stay static. */
import { useEffect, useState } from "react";
import type { SponsorCard } from "@/lib/sponsors";

let cached: Promise<SponsorCard[]> | null = null;
const load = () => (cached ??= fetch("/api/directory/paid/").then((r) => (r.ok ? r.json() : { sponsors: [] })).then((j: { sponsors: SponsorCard[] }) => j.sponsors).catch(() => []));

export function useSponsors(): SponsorCard[] | null {
  const [list, setList] = useState<SponsorCard[] | null>(null);
  useEffect(() => { void load().then(setList); }, []);
  return list;
}
/** slug → sponsorship year */
export function useSponsorYears(): Map<string, number> {
  const list = useSponsors();
  return new Map((list ?? []).map((s) => [s.slug, s.year]));
}
