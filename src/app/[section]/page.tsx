import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { EDITORIAL_SECTIONS, sectionBySlug, SECTION_INTRO, subsectionsOf, subsectionSlug } from "@/lib/site";
import { CategoryBoard as CategoryPage } from "@/components/boards/category/CategoryBoard";
import type { SectionCode } from "@/lib/content/types";

export function generateStaticParams() {
  return EDITORIAL_SECTIONS.map((s) => ({ section: s.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ section: string }> }): Promise<Metadata> {
  const { section } = await params;
  const s = sectionBySlug(section);
  if (!s) return {};
  return { title: s.label, description: SECTION_INTRO[s.code as SectionCode].intro };
}

export default async function SectionPage({ params }: { params: Promise<{ section: string }> }) {
  const { section } = await params;
  const s = sectionBySlug(section);
  if (!s) notFound();
  const subs = subsectionsOf(s.code as SectionCode).map((x) => ({ code: x.code, label: x.label, slug: subsectionSlug(x.code) }));
  return <CategoryPage section={s} subs={subs} />;
}
