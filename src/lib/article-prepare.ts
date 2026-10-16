import "server-only";
import type { Block } from "@/lib/content/types";
import { getStandardByNo } from "@/lib/content/source";
import { autoLinkStandards } from "@/lib/autolink";
import { cleanHtml } from "@/lib/sanitize";

/* Body blocks ready to draw anywhere: HTML sanitised and standards linked here on the server,
   so the browser never needs the sanitiser or the standards list. */
export type PreparedBlock = Block & { stdSlugs?: (string | null)[] };

export function prepareBlocks(blocks: Block[]): PreparedBlock[] {
  return blocks.map((b) => {
    switch (b.type) {
      case "p": return { ...b, html: autoLinkStandards(cleanHtml(b.html)) };
      case "ul": return { ...b, items: b.items.map((it) => autoLinkStandards(cleanHtml(it))) };
      case "spec": return { ...b, stdSlugs: b.standards?.map((s) => getStandardByNo(s)?.slug ?? null) };
      default: return b;
    }
  });
}
