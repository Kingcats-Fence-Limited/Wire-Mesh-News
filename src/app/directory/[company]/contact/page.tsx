import type { Metadata } from "next";
import { privateMeta } from "@/lib/seo";
import { notFound } from "next/navigation";
import { COMPANIES, getCompany } from "@/lib/content/directory";
import { ContactCompanyBoard } from "@/components/boards/rfq/ContactCompanyBoard";

export function generateStaticParams() {
  return COMPANIES.map((c) => ({ company: c.slug }));
}
export async function generateMetadata({ params }: { params: Promise<{ company: string }> }): Promise<Metadata> {
  const c = getCompany((await params).company);
  return c ? privateMeta(`Contact ${c.name}`, `/directory/${c.slug}/contact/`) : {};
}

export default async function ContactCompanyPage({ params }: { params: Promise<{ company: string }> }) {
  const c = getCompany((await params).company);
  if (!c) notFound();
  return <ContactCompanyBoard c={c} />;
}
