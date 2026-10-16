import "server-only";
import { clip, daysAgo, saveDrafts, type Found } from "./common";
import { htmlToText } from "@/lib/plain-text";

/* Trade-defence notices: anti-dumping, countervailing, safeguard and circumvention notices on
   wire, mesh, fencing, nails, rod and grating. Saved as drafts; the editor links each to a case.
   Sources: the US Federal Register API, plus any RSS/Atom feeds listed in TRADE_RSS_FEEDS
   (one URL per line or comma-separated: EU Official Journal search feeds, national authorities). */

const TERMS = ['"wire mesh"', '"welded wire"', '"steel wire"', '"wire rod"', '"steel grating"', '"barbed wire"', '"steel nails"', '"fence posts"', '"woven wire"', '"galvanized wire"'];
const TD = /anti-?dumping|countervailing|safeguard|circumvention|sunset review|dumping/i;
const PRODUCT = /wire|mesh|grating|fenc|nail|rod|netting|gabion|strand/i;

type FR = { title: string; type: string; abstract?: string; document_number: string; html_url: string; publication_date: string; agencies?: { name: string }[] };

async function federalRegister(days: number): Promise<Found[]> {
  const out: Found[] = [];
  const since = daysAgo(days).toISOString().slice(0, 10);
  for (const term of TERMS) {
    const q = new URLSearchParams({ "conditions[term]": term, "conditions[publication_date][gte]": since, per_page: "100", order: "newest" });
    for (const a of ["international-trade-administration", "international-trade-commission"]) q.append("conditions[agencies][]", a);
    for (const f of ["title", "type", "abstract", "document_number", "html_url", "publication_date", "agencies"]) q.append("fields[]", f);
    const res = await fetch(`https://www.federalregister.gov/api/v1/documents.json?${q}`, { signal: AbortSignal.timeout(25_000) });
    if (!res.ok) throw new Error(`Federal Register ${res.status}`);
    const j = (await res.json()) as { results?: FR[] };
    for (const d of j.results ?? []) {
      const text = `${d.title} ${d.abstract ?? ""}`;
      if (!TD.test(text) || !PRODUCT.test(d.title)) continue;
      out.push({ collection: "trade_case_updates", source: "federal_register", source_id: d.document_number, data: { title: clip(d.title, 400), summary: clip(d.abstract, 3000), date: d.publication_date, url: d.html_url, raw: { type: d.type, agencies: d.agencies?.map((x) => x.name), importing: "US" } } });
    }
  }
  return out;
}

const tag = (x: string, t: string) => htmlToText(x.match(new RegExp(`<${t}[^>]*>([\\s\\S]*?)</${t}>`, "i"))?.[1] ?? "");

async function rss(days: number): Promise<Found[]> {
  const feeds = (process.env.TRADE_RSS_FEEDS ?? "").split(/[\n,]/).map((s) => s.trim()).filter((s) => /^https:\/\//.test(s));
  const since = daysAgo(days).getTime();
  const out: Found[] = [];
  for (const url of feeds) {
    const res = await fetch(url, { signal: AbortSignal.timeout(20_000), headers: { Accept: "application/rss+xml, application/atom+xml, text/xml" } });
    if (!res.ok) throw new Error(`${new URL(url).host} ${res.status}`);
    const xml = await res.text();
    const items = xml.match(/<item[\s>][\s\S]*?<\/item>|<entry[\s>][\s\S]*?<\/entry>/gi) ?? [];
    for (const it of items) {
      const title = tag(it, "title");
      const link = tag(it, "link") || it.match(/<link[^>]*href="([^"]+)"/i)?.[1] || "";
      const date = tag(it, "pubDate") || tag(it, "updated") || tag(it, "published") || tag(it, "dc:date");
      const desc = tag(it, "description") || tag(it, "summary");
      const when = date ? new Date(date) : null;
      if (when && !isNaN(when.getTime()) && when.getTime() < since) continue;
      if (!TD.test(`${title} ${desc}`) || !PRODUCT.test(`${title} ${desc}`)) continue;
      const id = (tag(it, "guid") || tag(it, "id") || link || title).slice(0, 160);
      out.push({ collection: "trade_case_updates", source: "rss", source_id: id, data: { title: clip(title, 400), summary: clip(desc, 3000), date: when && !isNaN(when.getTime()) ? when.toISOString() : null, url: clip(link, 500), raw: { feed: url } } });
    }
  }
  return out;
}

export async function fetchTradeDefence(days = 3) {
  const report: Record<string, { found?: number; added?: number; error?: string }> = {};
  for (const [name, fn] of Object.entries({ federal_register: federalRegister, rss })) {
    try { const found = await fn(days); report[name] = { found: found.length, added: await saveDrafts(found) }; }
    catch (e) { report[name] = { error: (e as Error).message }; }
  }
  return report;
}
