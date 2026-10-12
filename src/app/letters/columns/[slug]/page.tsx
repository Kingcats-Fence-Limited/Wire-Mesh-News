import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { Shell, Crumbs } from "@/components/site/Shell";
import { Badge } from "@/components/ui/Primitives";
import { ShareRow } from "@/components/site/ArticleExtras";
import { COLUMNS, getColumn } from "@/lib/content/people";
import { fmtDate, SITE } from "@/lib/site";

export function generateStaticParams() {
  return COLUMNS.map((c) => ({ slug: c.slug }));
}
export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const c = getColumn((await params).slug);
  return c ? { title: `${c.title} · Opinion`, description: c.summary } : {};
}

export default async function ColumnPage({ params }: { params: Promise<{ slug: string }> }) {
  const c = getColumn((await params).slug);
  if (!c) notFound();
  const url = `${SITE.url}/letters/columns/${c.slug}/`;
  return (
    <Shell>
      <article className="wrap max-w-[860px] pt-7 pb-6">
        <Crumbs items={[{ label: "Letters & Opinion", href: "/letters/" }, { label: "Columns", href: "/letters/?tab=columns" }, { label: "Column" }]} />
        <div className="mt-4 flex items-center gap-3"><Badge tone="opinion">Opinion</Badge><span className="num text-[11px] font-bold text-grey">{fmtDate(c.date).toUpperCase()}</span></div>
        <span className="font-display mt-5 block text-[64px] leading-[.5] text-red" aria-hidden="true">“</span>
        <h1 className="font-display mt-4 text-[32px] leading-[1.12] tracking-[-0.045em] md:text-[38px]">{c.title}</h1>
        <p className="mt-4 text-[17px] font-medium leading-[1.55] text-slate">{c.summary}</p>
        <div className="mt-5 flex flex-wrap items-center gap-3 border-y border-line py-3.5">
          <span className="h-10 w-10 rounded-full bg-line" aria-hidden="true" />
          <span className="min-w-0"><span className="block text-[14px] font-extrabold">{c.author.name}</span><span className="meta block text-[12px]">{c.author.title} · {c.author.org}</span></span>
          <span className="ml-auto"><ShareRow url={url} title={c.title} /></span>
        </div>
        <div className="mt-6 text-[16.5px] font-medium leading-[1.75] text-fg-2">{c.body.map((p, i) => <p key={i} className="mb-4">{p}</p>)}</div>
        <div className="mt-6 rounded-card bg-paper p-5">
          <div className="font-display text-[12px] tracking-[0.1em] text-slate">DISCLOSURE</div>
          <p className="mt-1.5 text-[13.5px] font-medium leading-[1.6] text-fg-2">{c.author.disclosure}</p>
          <p className="meta mt-2 text-[11.5px]">Columns are the author’s own view and do not represent Wire Mesh News. The newsroom does not write opinion. Columns are never paid for.</p>
        </div>
        <div className="mt-6 flex flex-wrap items-center gap-4 rounded-card bg-dark p-5 text-white">
          <div className="flex-1 basis-[300px]"><div className="font-display text-[16px]">Disagree?</div><p className="mt-1 text-[12.5px] font-medium text-grey-3">Letters replying to a column are published under the same rules as any other.</p></div>
          <Link href="/letters/#write" className="inline-flex min-h-[44px] items-center rounded-full bg-red px-5 text-[13.5px] font-extrabold hover:bg-red-deep">Write a letter</Link>
        </div>
      </article>
    </Shell>
  );
}
