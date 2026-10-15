import type { Metadata } from "next";
import { pageMeta } from "@/lib/seo";
import { notFound } from "next/navigation";
import { TOPICS, getTopic } from "@/lib/content/market";
import { TopicBoard } from "@/components/boards/topic/TopicBoard";

export function generateStaticParams() {
  return TOPICS.map((t) => ({ slug: t.slug }));
}
export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const t = getTopic((await params).slug);
  return t ? pageMeta({ title: `${t.title} · Topics`, description: t.intro, path: `/topics/${t.slug}/` }) : {};
}

export default async function TopicPage({ params }: { params: Promise<{ slug: string }> }) {
  const t = getTopic((await params).slug);
  if (!t) notFound();
  return <TopicBoard t={t} />;
}
