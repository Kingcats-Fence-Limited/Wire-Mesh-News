import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { CategoryBoard as CategoryPage } from "@/components/boards/category/CategoryBoard";
import { ArticleBoard } from "@/components/boards/article/ArticleBoard";
import { ARTICLES, getArticle } from "@/lib/content/articles";
import { EDITORIAL_SECTIONS, SECTION_INTRO, SITE, articleHref, sectionBySlug, subsectionsOf, subsectionSlug } from "@/lib/site";
import { getAuthor } from "@/lib/content/people";
import { abs, pageMeta } from "@/lib/seo";
import { JsonLd } from "@/components/seo/JsonLd";
import { articleLd, breadcrumbs } from "@/lib/schema";
import type { SectionCode } from "@/lib/content/types";

/* Unknown slugs get the prerendered 404 (rendered on the server, with the theme script) instead of an on-demand render. */
export const dynamicParams = false;

export function generateStaticParams() {
  const params: { section: string; slug: string }[] = [];
  for (const s of EDITORIAL_SECTIONS) {
    for (const x of subsectionsOf(s.code as SectionCode)) params.push({ section: s.slug, slug: subsectionSlug(x.code) });
  }
  for (const a of ARTICLES) params.push({ section: EDITORIAL_SECTIONS.find((s) => s.code === a.section)!.slug, slug: a.slug });
  return params;
}

export async function generateMetadata({ params }: { params: Promise<{ section: string; slug: string }> }): Promise<Metadata> {
  const { section, slug } = await params;
  const s = sectionBySlug(section);
  if (!s) return {};
  const sub = subsectionsOf(s.code as SectionCode).find((x) => subsectionSlug(x.code) === slug);
  if (sub) return pageMeta({ title: `${sub.label} · ${s.label}`, description: `${sub.label}: the latest ${s.label.toLowerCase()} coverage from ${SITE.name}. ${SECTION_INTRO[s.code as SectionCode].intro}`, path: `/${s.slug}/${slug}/`, noindex: !ARTICLES.some((x) => x.section === s.code && x.subsection === sub.code) });
  const a = getArticle(slug);
  if (!a || a.section !== s.code) return {};
  const au = getAuthor(a.author);
  return pageMeta({ title: a.title, description: a.dek, path: articleHref(a), type: "article", image: `/og/${a.slug}/`, og: { publishedTime: a.date, modifiedTime: a.updated ?? a.date, section: s.label, tags: a.tags, authors: au ? [abs(`/authors/${au.slug}/`)] : undefined } });
}

export default async function Page({ params }: { params: Promise<{ section: string; slug: string }> }) {
  const { section, slug } = await params;
  const s = sectionBySlug(section);
  if (!s) notFound();
  const code = s.code as SectionCode;
  const subs = subsectionsOf(code).map((x) => ({ code: x.code, label: x.label, slug: subsectionSlug(x.code) }));
  const sub = subs.find((x) => x.slug === slug);
  if (sub) return <><JsonLd data={breadcrumbs([{ name: "Home", path: "/" }, { name: s.label, path: `/${s.slug}/` }, { name: sub.label, path: `/${s.slug}/${sub.slug}/` }])} /><CategoryPage section={s} subs={subs} activeSub={sub} /></>;

  const a = getArticle(slug);
  if (!a || a.section !== code) notFound();
  const subLabel = subs.find((x) => x.code === a.subsection);
  const crumbs = [{ name: "Home", path: "/" }, { name: s.label, path: `/${s.slug}/` }, ...(subLabel ? [{ name: subLabel.label, path: `/${s.slug}/${subLabel.slug}/` }] : []), { name: a.title, path: articleHref(a) }];
  return <><JsonLd data={[articleLd(a), breadcrumbs(crumbs)]} /><ArticleBoard a={a} /></>;
}
