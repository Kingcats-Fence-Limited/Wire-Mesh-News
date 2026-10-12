import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { LETTERS, getLetter } from "@/lib/content/people";
import { LetterBoard } from "@/components/boards/letters/LettersBoard";

export function generateStaticParams() {
  return LETTERS.map((l) => ({ slug: l.slug }));
}
export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const l = getLetter((await params).slug);
  return l ? { title: `“${l.title}” · Letters`, description: l.teaser } : {};
}

export default async function LetterPage({ params }: { params: Promise<{ slug: string }> }) {
  const l = getLetter((await params).slug);
  if (!l) notFound();
  return <LetterBoard l={l} />;
}
