import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { pageMeta } from "@/lib/seo";
import { POLICIES, getPolicy } from "@/lib/content/policies";
import { PolicyBoard } from "@/components/boards/contact/PolicyBoard";

/* Unknown slugs get the prerendered 404 (rendered on the server, with the theme script) instead of an on-demand render. */
export const dynamicParams = false;

export function generateStaticParams() {
  return POLICIES.map((p) => ({ slug: p.slug }));
}
export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const p = getPolicy((await params).slug);
  return p ? pageMeta({ title: p.title, description: p.inShort, path: `/policies/${p.slug}/` }) : {};
}

export default async function PolicyPage({ params }: { params: Promise<{ slug: string }> }) {
  const p = getPolicy((await params).slug);
  if (!p) notFound();
  return <PolicyBoard p={p} />;
}
