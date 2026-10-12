import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { COLUMNS, getColumn } from "@/lib/content/people";
import { ColumnBoard } from "@/components/boards/letters/LettersBoard";

export function generateStaticParams() {
  return COLUMNS.map((c) => ({ slug: c.slug }));
}
export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const c = getColumn((await params).slug);
  return c ? { title: `${c.title} · Opinion`, description: c.summary } : {};
}

export default async function ColumnPage({ params }: { params: Promise<{ slug: string }> }) {
  const c = getColumn((await params).slug);
  if (!c) notFound();
  return <ColumnBoard c={c} />;
}
