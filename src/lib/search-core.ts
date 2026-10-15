/* Search matching and highlighting with no content imports, so the browser can use it with
   an index fetched on demand (/search-index.json) instead of bundling every article. */
/** One record shape for the overlay and the results page (same index, same renderer). */
export type SearchType = "article" | "letter" | "opinion" | "company" | "standard" | "topic" | "event";

export type SearchDoc = {
  id: string;
  type: SearchType;
  title: string;
  href: string;
  kicker: string; // section · subsection, or role, or status
  meta: string; // date · read time, etc.
  text: string; // searchable body / snippet source
  section?: string; // section code for filtering
  date?: string;
  status?: string;
};


const STOP = new Set(["the", "a", "an", "and", "or", "of", "to", "in", "on", "for", "vs", "with", "what", "how", "is", "it"]);
export const tokenize = (q: string) => q.toLowerCase().split(/[^a-z0-9.\-]+/).filter((t) => t.length > 1 && !STOP.has(t));

/** Stem-ish match: 'galvaniz' matches galvanizing / galvanised. */
export function matches(doc: SearchDoc, tokens: string[]) {
  const hay = `${doc.title} ${doc.kicker} ${doc.text}`.toLowerCase();
  let score = 0;
  for (const t of tokens) {
    const stem = t.replace(/(ing|ed|es|s|ised|ized|isation|ization)$/i, "");
    if (!hay.includes(stem.length >= 4 ? stem : t)) return 0;
    score += doc.title.toLowerCase().includes(stem) ? 3 : 1;
  }
  return score;
}

export function searchIn(index: SearchDoc[], q: string, opts: { type?: SearchType | "all"; section?: string } = {}) {
  const tokens = tokenize(q);
  if (!tokens.length) return [];
  return index.map((d) => ({ d, s: matches(d, tokens) }))
    .filter((x) => x.s > 0)
    .filter((x) => !opts.type || opts.type === "all" || x.d.type === opts.type)
    .filter((x) => !opts.section || opts.section === "all" || x.d.section === opts.section)
    .sort((a, b) => b.s - a.s || (b.d.date ?? "").localeCompare(a.d.date ?? ""))
    .map((x) => x.d);
}

/** Snippet with <mark> around stem matches. */
/* Results are shown with dangerouslySetInnerHTML to render <mark>: escape the text first so
   only our own <mark> tags are HTML, and escape tokens before building the RegExp. */
const escHtml = (x: string) => x.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
const escRe = (x: string) => x.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

export function snippet(doc: SearchDoc, q: string, len = 150) {
  const tokens = tokenize(q).map((t) => t.replace(/(ing|ed|es|s|ised|ized)$/i, "")).filter((t) => t.length >= 3);
  const text = doc.text.replace(/\s+/g, " ");
  const lower = text.toLowerCase();
  let at = -1;
  for (const t of tokens) {
    at = lower.indexOf(t);
    if (at >= 0) break;
  }
  const start = Math.max(0, at - 50);
  return markAll((start > 0 ? "…" : "") + text.slice(start, start + len) + (start + len < text.length ? "…" : ""), tokens);
}
/* One pass over the raw text: matched words become <mark>, everything else is escaped. Doing
   one token at a time would let a later token match inside an earlier <mark> or an entity. */
function markAll(raw: string, tokens: string[]) {
  if (!tokens.length) return escHtml(raw);
  const re = new RegExp(`(${tokens.map(escRe).join("|")})[a-z]*`, "gi");
  let out = "", last = 0;
  for (const m of raw.matchAll(re)) { out += escHtml(raw.slice(last, m.index)) + `<mark>${escHtml(m[0])}</mark>`; last = m.index! + m[0].length; }
  return out + escHtml(raw.slice(last));
}
export function highlight(str: string, q: string) {
  const tokens = tokenize(q).map((t) => t.replace(/(ing|ed|es|s|ised|ized)$/i, "")).filter((t) => t.length >= 3);
  return markAll(str, tokens);
}
