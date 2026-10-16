import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { pageMeta } from "@/lib/seo";
import { Shell } from "@/components/shell/Shell";
import { TemplateView } from "@/components/boards/intel/TemplateView";
import { TEMPLATES, getTemplate } from "@/lib/content/templates";
import { getStandardByNo } from "@/lib/content/source";
import "@/styles/board-intel.css";

export const dynamicParams = false;
export const generateStaticParams = () => TEMPLATES.map((t) => ({ slug: t.slug }));

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const t = getTemplate((await params).slug);
  return t ? pageMeta({ title: t.title, description: t.summary, path: `/tools/templates/${t.slug}/` }) : {};
}

export default async function TemplatePage({ params }: { params: Promise<{ slug: string }> }) {
  const t = getTemplate((await params).slug);
  if (!t) notFound();
  return (
    <Shell header="compact" board="b-intel">
      <section style={{ paddingTop: "28px", paddingBottom: "56px", maxWidth: "860px" }} className="wrap">
        <nav aria-label="Breadcrumb" className="noprint" style={{ fontSize: "12.5px", fontWeight: 500, color: "var(--slate)", marginBottom: "14px" }}><Link href="/" style={{ color: "var(--slate)" }}>Home</Link> / <Link href="/tools/#templates" style={{ color: "var(--slate)" }}>Templates &amp; tools</Link> / <span style={{ color: "var(--ink)", fontWeight: 800 }}>{t.free ? "Free" : "Pro"} template</span></nav>
        <h1 style={{ margin: "0 0 10px", fontSize: "36px", letterSpacing: "-.04em", lineHeight: 1.08 }} className="h">{t.title}</h1>
        <p style={{ margin: "0 0 14px", fontSize: "16px", fontWeight: 500, lineHeight: 1.6, color: "var(--fg-3)" }}>{t.summary}</p>
        <p style={{ margin: "0 0 22px", fontSize: "13px" }} className="meta">Standards to cite: {t.standards.map((s, i) => { const std = getStandardByNo(s); return <span key={s}>{i > 0 && ", "}{std ? <Link href={`/standards/${std.slug}/`} className="lnk">{s}</Link> : s}</span>; })}. Buy the current official text from the issuing body.</p>
        <TemplateView slug={t.slug} title={t.title} initial={t.free ? t.sections : null} />
      </section>
    </Shell>
  );
}
