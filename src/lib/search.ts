import { ARTICLES, editorial } from "./content/articles";
import { LETTERS, COLUMNS } from "./content/people";
import { COMPANIES, EVENTS } from "./content/directory";
import { STANDARDS } from "./content/standards";
import { TOPICS } from "./content/market";
import { articleHref, sectionByCode, subsectionLabel, fmtDate } from "./site";
import { COUNTRY_BY_CODE } from "@/data/vocab";

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

const cap = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);

export function buildSearchIndex(): SearchDoc[] {
  const docs: SearchDoc[] = [];
  for (const a of ARTICLES) {
    if (!editorial(a)) continue;
    const plain = a.body.map((b) => ("html" in b ? b.html.replace(/<[^>]+>/g, "").replace(/&nbsp;/g, " ").replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/&quot;/g, "\"").replace(/&#39;/g, "'").replace(/&amp;/g, "&") : "text" in b ? String(b.text) : "")).join(" ");
    docs.push({
      id: `a:${a.slug}`,
      type: "article",
      title: a.title,
      href: articleHref(a),
      kicker: `${sectionByCode(a.section)!.label} · ${subsectionLabel(a.section, a.subsection)}`,
      meta: `${fmtDate(a.date)} · ${a.readMin} min`,
      text: `${a.dek} ${a.tags.join(" ")} ${plain}`,
      section: a.section,
      date: a.date,
    });
  }
  for (const l of LETTERS) {
    docs.push({ id: `l:${l.slug}`, type: "letter", title: `“${l.title}”`, href: `/letters/${l.slug}/`, kicker: `${l.writer.role} · ${l.writer.org}`, meta: `${fmtDate(l.date)} · Letters & Opinion`, text: `${l.teaser} ${l.body.join(" ")} ${l.replyTo.title}`, section: l.replyTo.section, date: l.date });
  }
  for (const c of COLUMNS) {
    docs.push({ id: `o:${c.slug}`, type: "opinion", title: c.title, href: `/letters/columns/${c.slug}/`, kicker: `${c.author.name} · ${c.author.org}`, meta: `${fmtDate(c.date)} · Opinion`, text: `${c.summary} ${c.body.join(" ")}`, date: c.date });
  }
  for (const c of COMPANIES) {
    docs.push({ id: `c:${c.slug}`, type: "company", title: c.name, href: `/directory/${c.slug}/`, kicker: `${cap(c.orgType.replace(/_/g, " "))} · ${c.city}, ${COUNTRY_BY_CODE[c.country]?.name ?? c.country}${c.claimed ? " · Claimed" : ""}`, meta: `Company Directory`, text: `${c.summary} ${c.products.join(" ")} ${(c.processes ?? []).join(" ")}` });
  }
  for (const s of STANDARDS) {
    docs.push({ id: `s:${s.slug}`, type: "standard", title: s.no, href: `/standards/${s.slug}/`, kicker: s.title, meta: `Standards Index · status checked ${fmtDate(s.checked)}`, text: `${s.title} ${s.covers} ${s.whyItMatters.join(" ")} ${(s.adoptedAs ?? []).join(" ")}`, status: s.status });
  }
  for (const t of TOPICS) {
    docs.push({ id: `t:${t.slug}`, type: "topic", title: t.title, href: `/topics/${t.slug}/`, kicker: `${t.startHere.length} articles · updated ${fmtDate(t.updated)}`, meta: "Topics", text: `${t.intro} ${t.outline.join(" ")} ${t.terms.map((x) => x.term).join(" ")}` });
  }
  for (const e of EVENTS) {
    docs.push({ id: `e:${e.slug}`, type: "event", title: e.name, href: `/events/#${e.slug}`, kicker: `${cap(e.type.replace("_", " "))} · ${e.online ? "Online" : `${e.city}, ${COUNTRY_BY_CODE[e.country ?? ""]?.name ?? ""}`}`, meta: fmtDate(e.start), text: `${e.summary} ${e.focus}`, date: e.start });
  }
  return docs;
}

export const SEARCH_INDEX = buildSearchIndex();

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

export function search(q: string, opts: { type?: SearchType | "all"; section?: string } = {}) {
  const tokens = tokenize(q);
  if (!tokens.length) return [];
  return SEARCH_INDEX.map((d) => ({ d, s: matches(d, tokens) }))
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
  let s = escHtml((start > 0 ? "…" : "") + text.slice(start, start + len) + (start + len < text.length ? "…" : ""));
  for (const t of tokens) s = s.replace(new RegExp(`(${escRe(t)}[a-z]*)`, "gi"), "<mark>$1</mark>");
  return s;
}
export function highlight(str: string, q: string) {
  const tokens = tokenize(q).map((t) => t.replace(/(ing|ed|es|s|ised|ized)$/i, "")).filter((t) => t.length >= 3);
  let s = escHtml(str);
  for (const t of tokens) s = s.replace(new RegExp(`(${escRe(t)}[a-z]*)`, "gi"), "<mark>$1</mark>");
  return s;
}
