import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { AUTHORS, getAuthor } from "@/lib/content/people";
import { AuthorBoard } from "@/components/boards/author/AuthorBoard";

export function generateStaticParams() {
  return AUTHORS.map((a) => ({ slug: a.slug }));
}
export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const a = getAuthor((await params).slug);
  return a ? { title: `${a.name} · Authors`, description: a.bio } : {};
}

export default async function AuthorPage({ params, searchParams }: { params: Promise<{ slug: string }>; searchParams: Promise<{ section?: string }> }) {
  const a = getAuthor((await params).slug);
  if (!a) notFound();
  return <AuthorBoard a={a} section={(await searchParams).section} />;
}
