import type { MetadataRoute } from "next";
import { SITE, EDITORIAL_SECTIONS, subsectionsOf, subsectionSlug, articleHref } from "@/lib/site";
import { ARTICLES, editorial } from "@/lib/content/articles";
import { COMPANIES } from "@/lib/content/directory";
import { STANDARDS } from "@/lib/content/source";
import { TOPICS } from "@/lib/content/market";
import { AUTHORS, LETTERS, COLUMNS } from "@/lib/content/people";
import { POLICIES } from "@/lib/content/policies";
import type { SectionCode } from "@/lib/content/types";

/* Public, indexable pages only: no account, search, sign-in or submission pages. */
export default function sitemap(): MetadataRoute.Sitemap {
  const u = (path: string, lastModified?: string): MetadataRoute.Sitemap[number] => ({ url: `${SITE.url}${path}`, ...(lastModified ? { lastModified } : {}) });
  const ed = ARTICLES.filter(editorial);
  const newest = (list: typeof ed) => list.reduce<string | undefined>((m, a) => { const d = a.updated ?? a.date; return !m || d > m ? d : m; }, undefined);
  return [
    u("/", newest(ed)), u("/directory/"), u("/events/"), u("/standards/"), u("/market-data/"), u("/market-data/methodology/"),
    u("/topics/"), u("/letters/"), u("/about/"), u("/contact/"), u("/advertise/"), u("/subscribe/"), u("/pricing/"),
    ...EDITORIAL_SECTIONS.flatMap((s) => [
      u(`/${s.slug}/`, newest(ed.filter((a) => a.section === s.code))),
      ...subsectionsOf(s.code as SectionCode).filter((x) => ed.some((a) => a.section === s.code && a.subsection === x.code)).map((x) => u(`/${s.slug}/${subsectionSlug(x.code)}/`, newest(ed.filter((a) => a.section === s.code && a.subsection === x.code)))),
    ]),
    ...ed.map((a) => u(articleHref(a), a.updated ?? a.date)),
    ...COMPANIES.map((c) => u(`/directory/${c.slug}/`, c.updated)),
    ...STANDARDS.map((s) => u(`/standards/${s.slug}/`, s.checked)),
    ...TOPICS.map((t) => u(`/topics/${t.slug}/`, t.updated)),
    ...AUTHORS.map((a) => u(`/authors/${a.slug}/`)),
    ...LETTERS.map((l) => u(`/letters/${l.slug}/`, l.date)),
    ...COLUMNS.map((c) => u(`/letters/columns/${c.slug}/`)),
    ...POLICIES.map((p) => u(`/policies/${p.slug}/`)),
  ];
}
