import "server-only";
import { randomUUID } from "node:crypto";
import { dx } from "../directus";
import { COUNTRY } from "@/data/vocab/country";

/* Shared helpers for the fetchers. Everything they find is saved as a DRAFT for an editor;
   nothing fetched is published automatically. */

export const A3 = Object.fromEntries(COUNTRY.map((c) => [c.alpha3, c.alpha2]));
export const NAME_TO_A2 = Object.fromEntries(COUNTRY.map((c) => [c.name.toLowerCase(), c.alpha2]));

/** Product codes (vocabulary: product) guessed from a title or description. The editor checks them. */
const RULES: [RegExp, string][] = [
  [/\b358\b|anti[- ]?climb/i, "anti_climb_358"],
  [/twin[- ]?wire|double[- ]?wire|868|656/i, "twin_wire_panel"],
  [/welded (wire )?mesh|mesh panel|weld mesh/i, "welded_mesh_panel"],
  [/chain[- ]?link|diamond mesh/i, "chain_link"],
  [/palisade/i, "palisade"],
  [/barbed wire/i, "barbed_wire"],
  [/razor (wire|tape)|concertina/i, "razor_wire"],
  [/gabion|reno mattress/i, "gabion"],
  [/rock ?fall|slope protection|drapery/i, "rockfall_netting"],
  [/hexagonal (wire )?netting|chicken wire|poultry netting/i, "hexagonal_netting"],
  [/field fence|farm fenc|livestock fenc|deer fenc|stock fenc/i, "field_fence"],
  [/temporary fenc|hoarding/i, "temporary_fence"],
  [/noise barrier|acoustic (fence|barrier)/i, "noise_barrier"],
  [/\bgates?\b|turnstile|barrier arm/i, "gate"],
  [/reinforc\w* mesh|rebar mesh|steel fabric/i, "reinforcing_mesh"],
  [/frp grating|grp grating|fibreglass grating|fiberglass grating/i, "frp_grating"],
  [/stair tread/i, "stair_tread"],
  [/grating|grid ?floor|walkway grating|bar grating/i, "steel_grating"],
  [/trench (cover|grate)|drain(age)? (cover|grate)/i, "trench_cover"],
  [/handrail|guard ?rail/i, "handrail"],
  [/expanded metal/i, "expanded_metal"],
  [/perforated (metal|sheet|plate)/i, "perforated_metal"],
  [/wire cloth|woven (wire )?mesh|screen(ing)? mesh|sieve/i, "woven_wire_cloth"],
  [/ornamental fenc|tubular fenc|railings?/i, "ornamental"],
];
export function guessProducts(text: string): string[] {
  return [...new Set(RULES.filter(([re]) => re.test(text)).map(([, code]) => code))];
}
/** Is this about fencing / mesh / grating at all? (for sources searched by keyword) */
export const RELEVANT = /fenc|wire mesh|welded mesh|mesh panel|chain[- ]?link|gabion|barbed|razor wire|palisade|grating|expanded metal|perforated metal|wire netting|security barrier|perimeter (security|protection)|boundary wall/i;

export type Found = {
  collection: "tenders" | "trade_case_updates";
  source: string;
  source_id: string;
  data: Record<string, unknown>;
};

/** Save new finds as drafts; skip ones already saved (by source + source_id). Returns how many were new. */
export async function saveDrafts(items: Found[]): Promise<number> {
  let n = 0;
  for (const it of items) {
    const have = await dx.list<{ id: string }>(it.collection, { filter: { source: { _eq: it.source }, source_id: { _eq: it.source_id } }, fields: ["id"], limit: 1 });
    if (have.length) continue;
    await dx.create(it.collection, { id: randomUUID(), status: "draft", source: it.source, source_id: it.source_id, ...it.data });
    n++;
  }
  return n;
}

export const ymd = (d: Date) => d.toISOString().slice(0, 10).replace(/-/g, "");
export const daysAgo = (n: number) => new Date(Date.now() - n * 86400_000);
export const clip = (s: unknown, n: number) => (typeof s === "string" ? s.replace(/\s+/g, " ").trim().slice(0, n) : null);
/** First value of a TED multilingual field, English first. */
export function lang(v: unknown): string | null {
  if (!v) return null;
  if (typeof v === "string") return v;
  if (Array.isArray(v)) return lang(v[0]);
  if (typeof v === "object") {
    const o = v as Record<string, unknown>;
    return lang(o.eng ?? o.ENG ?? o.en ?? Object.values(o)[0]);
  }
  return String(v);
}
