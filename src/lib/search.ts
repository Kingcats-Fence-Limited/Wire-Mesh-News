import { ARTICLES, editorial, previewBlocks } from "./content/articles";
import { htmlToText } from "./plain-text";
import { LETTERS, COLUMNS } from "./content/people";
import { COMPANIES, EVENTS } from "./content/directory";
import { STANDARDS } from "./content/standards";
import { TOPICS } from "./content/market";
import { articleHref, sectionByCode, subsectionLabel, fmtDate } from "./site";
import { COUNTRY_BY_CODE } from "@/data/vocab/country";

import { searchIn, type SearchDoc, type SearchType } from "./search-core";
export * from "./search-core";

const cap = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);

export function buildSearchIndex(): SearchDoc[] {
  const docs: SearchDoc[] = [];
  for (const a of ARTICLES) {
    if (!editorial(a)) continue;
    /* Pro articles: only the free opening is searchable (and shipped in the index). */
    const plain = (a.premium ? previewBlocks(a.body) : a.body).map((b) => ("html" in b ? htmlToText(b.html) : "text" in b ? String(b.text) : "")).join(" ");
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
    docs.push({ id: `o:${c.slug}`, type: "opinion", title: c.title, href: `/letters/columns/${c.slug}/`, kicker: `${c.author.name} · ${c.author.org}`, meta: `${fmtDate(c.date)} · Column`, text: `${c.summary} ${c.body.join(" ")}`, date: c.date });
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

export const search = (q: string, opts: { type?: SearchType | "all"; section?: string } = {}) => searchIn(SEARCH_INDEX, q, opts);


