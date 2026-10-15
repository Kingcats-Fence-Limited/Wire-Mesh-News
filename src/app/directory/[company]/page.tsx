import type { Metadata } from "next";
import { pageMeta } from "@/lib/seo";
import { JsonLd } from "@/components/seo/JsonLd";
import { breadcrumbs, companyLd } from "@/lib/schema";
import { notFound } from "next/navigation";
import { COMPANIES, getCompany } from "@/lib/content/directory";
import { CompanyBoard } from "@/components/boards/directory/CompanyBoard";

/* Unknown slugs get the prerendered 404 (rendered on the server, with the theme script) instead of an on-demand render. */
export const dynamicParams = false;

export function generateStaticParams() {
  return COMPANIES.map((c) => ({ company: c.slug }));
}
export async function generateMetadata({ params }: { params: Promise<{ company: string }> }): Promise<Metadata> {
  const c = getCompany((await params).company);
  return c ? pageMeta({ title: `${c.name} · Company Directory`, description: c.summary, path: `/directory/${c.slug}/` }) : {};
}

export default async function CompanyPage({ params }: { params: Promise<{ company: string }> }) {
  const c = getCompany((await params).company);
  if (!c) notFound();
  return <><JsonLd data={[companyLd(c), breadcrumbs([{ name: "Home", path: "/" }, { name: "Company Directory", path: "/directory/" }, { name: c.name, path: `/directory/${c.slug}/` }])]} /><CompanyBoard c={c} /></>;
}
