import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { STANDARDS, getStandard } from "@/lib/content/source";
import { StandardBoard } from "@/components/boards/standards/StandardsBoard";

export function generateStaticParams() {
  return STANDARDS.map((s) => ({ slug: s.slug }));
}
export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const s = getStandard((await params).slug);
  return s ? { title: `${s.no} · Standards Index`, description: s.covers } : {};
}

export default async function StandardPage({ params }: { params: Promise<{ slug: string }> }) {
  const s = getStandard((await params).slug);
  if (!s) notFound();
  return <StandardBoard s={s} />;
}
