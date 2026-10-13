import { SUBDIVISION } from "@/data/vocab/subdivision";

export type SubOpt = { code: string; name: string; type: string };

/** Top-level subdivisions (no parent) for a country, sorted by name. Server-side only: the table is large. */
export function subdivisionsOf(alpha2: string): SubOpt[] {
  return SUBDIVISION.filter((s) => s.country === alpha2 && !s.parentCode)
    .map((s) => ({ code: s.code, name: s.name, type: s.type }))
    .sort((a, b) => a.name.localeCompare(b.name));
}
