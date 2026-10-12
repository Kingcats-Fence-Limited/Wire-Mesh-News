import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { POLICIES, getPolicy } from "@/lib/content/policies";
import { PolicyBoard } from "@/components/boards/contact/PolicyBoard";

export function generateStaticParams() {
  return POLICIES.map((p) => ({ slug: p.slug }));
}
export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const p = getPolicy((await params).slug);
  return p ? { title: p.title, description: p.inShort } : {};
}

export default async function PolicyPage({ params }: { params: Promise<{ slug: string }> }) {
  const p = getPolicy((await params).slug);
  if (!p) notFound();
  return <PolicyBoard p={p} />;
}
