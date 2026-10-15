import type { Metadata } from "next";
import { pageMeta } from "@/lib/seo";
import { notFound } from "next/navigation";
import { STANDARDS, getStandard } from "@/lib/content/source";
import { StandardBoard } from "@/components/boards/standards/StandardsBoard";

/* Unknown slugs get the prerendered 404 (rendered on the server, with the theme script) instead of an on-demand render. */
export const dynamicParams = false;

export function generateStaticParams() {
  return STANDARDS.map((s) => ({ slug: s.slug }));
}
export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const s = getStandard((await params).slug);
  return s ? pageMeta({ title: `${s.no} · Standards Index`, description: `${s.no}: ${s.covers}`, path: `/standards/${s.slug}/` }) : {};
}

export default async function StandardPage({ params }: { params: Promise<{ slug: string }> }) {
  const s = getStandard((await params).slug);
  if (!s) notFound();
  return <StandardBoard s={s} />;
}
