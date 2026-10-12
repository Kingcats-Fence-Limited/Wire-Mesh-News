import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { Shell, Crumbs } from "@/components/site/Shell";
import { PolicyLayout } from "@/components/site/PolicyLayout";
import { POLICIES, getPolicy } from "@/lib/content/policies";

export function generateStaticParams() {
  return POLICIES.map((p) => ({ slug: p.slug }));
}
export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const p = getPolicy((await params).slug);
  return p ? { title: p.title, description: p.inShort } : {};
}

/** "Label. Sentence…" → <b>Label.</b> Sentence… */
function Para({ text }: { text: string }) {
  const m = text.match(/^([A-Z][A-Za-z &,'’-]{2,40})\.\s(.*)$/s);
  if (m && !/^(We|Our|The|This|If|You|It|Comments|Wire)\b/.test(m[1])) return <p><b>{m[1]}.</b> {m[2]}</p>;
  return <p>{text}</p>;
}

export default async function PolicyPage({ params }: { params: Promise<{ slug: string }> }) {
  const p = getPolicy((await params).slug);
  if (!p) notFound();
  const nav = POLICIES.map((x) => ({ label: x.title, href: `/policies/${x.slug}/`, active: x.slug === p.slug }));
  return (
    <Shell>
      <div className="wrap pt-7"><Crumbs items={[{ label: "Policies" }, { label: p.title }]} /></div>
      <PolicyLayout navTitle="Policies" nav={nav} title={p.title} updated="2026-10-12" version="1" inShort={p.inShort} draft={p.draft}>
        {p.draft ? (
          <>
            <p>This policy is published in outline. The final wording must be settled by counsel for the operating entity, server location and target markets before launch; nothing below is legal text yet.</p>
            <h2>Sections</h2>
            <ul>{p.sections.map((s, i) => <li key={i}>{s}</li>)}</ul>
          </>
        ) : (
          p.paras.map((t, i) => <Para key={i} text={t} />)
        )}
      </PolicyLayout>
    </Shell>
  );
}
