import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { COMPANIES, getCompany } from "@/lib/content/directory";
import { CompanyBoard } from "@/components/boards/directory/CompanyBoard";

export function generateStaticParams() {
  return COMPANIES.map((c) => ({ company: c.slug }));
}
export async function generateMetadata({ params }: { params: Promise<{ company: string }> }): Promise<Metadata> {
  const c = getCompany((await params).company);
  return c ? { title: `${c.name} · Company Directory`, description: c.summary } : {};
}

export default async function CompanyPage({ params }: { params: Promise<{ company: string }> }) {
  const c = getCompany((await params).company);
  if (!c) notFound();
  return <CompanyBoard c={c} />;
}
