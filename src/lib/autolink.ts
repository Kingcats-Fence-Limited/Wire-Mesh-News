import { slugify, getStandardByNo } from "@/lib/content/source";

/** Link bare standard numbers (EN 10223-4, ASTM A392…) to the Standards Index, skipping text already inside an anchor. */
const STD_RE = /\b((?:pr)?(?:EN ISO|EN|ISO|ASTM|BS EN|DIN EN|DIN|BS|GB\/T|AASHTO|JIS)\s?[A-Z]?\d{2,5}(?:-\d{1,2})?)\b/g;

export function autoLinkStandards(html: string) {
  /* Work on text only: whole anchors and every other tag (with its attributes) pass through. */
  const parts = html.split(/(<a\b[^>]*>[\s\S]*?<\/a>|<[^>]+>)/g);
  return parts
    .map((p) => {
      if (p.startsWith("<")) return p;
      return p.replace(STD_RE, (m) => {
        const std = getStandardByNo(m.replace(/\s+/g, " "));
        return std ? `<a class="std-link" href="/standards/${slugify(std.no)}/">${m}</a>` : m;
      });
    })
    .join("");
}

