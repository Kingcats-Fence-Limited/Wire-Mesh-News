import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { CategoryBoard as CategoryPage } from "@/components/boards/category/CategoryBoard";
import { ArticleBoard } from "@/components/boards/article/ArticleBoard";
import { ARTICLES, getArticle } from "@/lib/content/articles";
import { EDITORIAL_SECTIONS, sectionBySlug, subsectionsOf, subsectionSlug } from "@/lib/site";
import type { SectionCode } from "@/lib/content/types";

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
  if (sub) return { title: `${sub.label} · ${s.label}` };
  const a = getArticle(slug);
  if (!a || a.section !== s.code) return {};
  return { title: a.title, description: a.dek, openGraph: { title: a.title, description: a.dek, type: "article", publishedTime: a.date, modifiedTime: a.updated } };
}

export default async function Page({ params }: { params: Promise<{ section: string; slug: string }> }) {
  const { section, slug } = await params;
  const s = sectionBySlug(section);
  if (!s) notFound();
  const code = s.code as SectionCode;
  const subs = subsectionsOf(code).map((x) => ({ code: x.code, label: x.label, slug: subsectionSlug(x.code) }));
  const sub = subs.find((x) => x.slug === slug);
  if (sub) return <CategoryPage section={s} subs={subs} activeSub={sub} />;

  const a = getArticle(slug);
  if (!a || a.section !== code) notFound();
  return <ArticleBoard a={a} />;
}
