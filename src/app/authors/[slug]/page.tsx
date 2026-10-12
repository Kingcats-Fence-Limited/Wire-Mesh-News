import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { Shell, Crumbs } from "@/components/site/Shell";
import { Card, ChipLink } from "@/components/ui/Primitives";
import { SocialGlyph } from "@/components/ui/SocialButton";
import { ArticleRow } from "@/components/site/ArticleCards";
import { AUTHORS, getAuthor } from "@/lib/content/people";
import { byAuthor } from "@/lib/content/articles";
import { sectionByCode, fmtDate } from "@/lib/site";

export function generateStaticParams() {
  return AUTHORS.map((a) => ({ slug: a.slug }));
}
export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const a = getAuthor((await params).slug);
  return a ? { title: `${a.name} · ${a.role}`, description: a.bio } : {};
}

export default async function AuthorPage({ params, searchParams }: { params: Promise<{ slug: string }>; searchParams: Promise<{ section?: string }> }) {
  const a = getAuthor((await params).slug);
  if (!a) notFound();
  const { section } = await searchParams;
  const all = byAuthor(a.slug);
  const list = section ? all.filter((x) => x.section === section) : all;
  const counts = Object.entries(all.reduce<Record<string, number>>((m, x) => ((m[x.section] = (m[x.section] ?? 0) + 1), m), {})).sort((x, y) => y[1] - x[1]);
  return (
    <Shell>
      <div className="wrap pt-7">
        <Crumbs items={[{ label: "Authors" }, { label: a.name }]} />
        <div className="mt-4 grid gap-8 border-b border-line pb-8 lg:grid-cols-[1fr_320px]">
          <div className="flex flex-wrap gap-6">
            <span className="h-24 w-24 shrink-0 rounded-full bg-line" aria-hidden="true" />
            <div className="min-w-0 flex-1">
              <h1 className="font-display text-[36px] tracking-[-0.045em]">{a.name}</h1>
              <div className="kicker mt-1 text-[11px]">{a.role}</div>
              <p className="mt-3 max-w-[640px] text-[15px] font-medium leading-[1.65] text-fg-2">{a.bio}</p>
              <div className="mt-3 flex flex-wrap gap-1.5">{a.expertise.map((e) => <span key={e} className="rounded-full border border-line px-3 py-1 text-[12px] font-bold">{e}</span>)}</div>
            </div>
          </div>
          <Card className="self-start">
            <div className="kicker mb-2 text-[10px]">Author details</div>
            <dl className="num text-[13px]">{[["Role", a.role.split(" · ")[0]], ["Writing here since", fmtDate(a.since + "-01", { month: "short", year: "numeric" })], ["Published", `${all.length} articles`], ["Based in", a.basedIn]].map(([k, v]) => <div key={k} className="flex justify-between gap-3 border-t border-line-soft py-1.5"><dt className="text-slate">{k}</dt><dd className="m-0 font-extrabold">{v}</dd></div>)}</dl>
            <div className="kicker mb-2 mt-4 text-[10px]">Contact &amp; social</div>
            <div className="flex gap-2">
              {a.email && <a href={`mailto:${a.email}`} className="inline-flex min-h-[38px] items-center rounded-full border border-line px-4 text-[12.5px] font-extrabold hover:border-ink">Email</a>}
              {a.linkedin && <a href={a.linkedin} target="_blank" rel="noopener noreferrer" aria-label="LinkedIn" className="inline-flex h-[38px] w-[38px] items-center justify-center rounded-full border border-line hover:border-red hover:bg-red hover:text-white"><SocialGlyph id="linkedin" size={14} /></a>}
            </div>
            <p className="meta mt-3 text-[11px] leading-[1.5]">Details are maintained by the author. A public email can differ from the account email, which is never shown.</p>
          </Card>
        </div>
      </div>
      <div className="wrap grid gap-10 pt-6 lg:grid-cols-[minmax(0,1fr)_300px]">
        <div>
          <h2 className="font-display text-[22px]">Articles by {a.name}</h2>
          <div className="no-scrollbar mt-3 flex gap-2 overflow-x-auto border-b border-line pb-3">
            <ChipLink href={`/authors/${a.slug}/`} active={!section} size="sm" count={all.length}>All</ChipLink>
            {counts.map(([c, n]) => <ChipLink key={c} href={`/authors/${a.slug}/?section=${c}`} active={section === c} size="sm" count={n}>{sectionByCode(c)?.label}</ChipLink>)}
          </div>
          {list.map((x) => <ArticleRow key={x.slug} a={x} dek />)}
        </div>
        <aside className="flex flex-col gap-5">
          <Card tone="dark"><div className="font-display text-[16px]">Follow this author</div><p className="mt-1 text-[12.5px] font-medium text-grey-3">Sign in to get a notification when {a.name.split(" ")[0]} publishes.</p><Link href="/signin/" className="mt-3 inline-flex min-h-[40px] items-center rounded-full border border-line-dark px-4 text-[12.5px] font-extrabold hover:border-red">Sign in to follow</Link></Card>
          <Card><div className="kicker mb-2 text-[10px]">Writes mostly about</div><ul className="num">{counts.map(([c, n]) => <li key={c} className="flex justify-between border-t border-line-soft py-1.5 text-[13.5px] font-bold"><span>{sectionByCode(c)?.label}</span><span className="text-grey">{n}</span></li>)}</ul></Card>
          <Card><div className="kicker mb-2 text-[10px]">Other authors</div><ul>{AUTHORS.filter((x) => x.slug !== a.slug).map((x) => <li key={x.slug}><Link href={`/authors/${x.slug}/`} className="block border-t border-line-soft py-2 hover:text-red-text"><span className="block text-[13.5px] font-extrabold">{x.name}</span><span className="meta block text-[11px]">{x.role}</span></Link></li>)}</ul></Card>
          <Card tone="paper"><div className="font-display text-[14px]">Want to write here?</div><p className="meta mt-1 leading-[1.55]">Outside contributions keep the author’s real byline; accepted authors get a page like this one.</p><Link href="/submit/" className="mt-2 inline-block text-[11.5px] font-extrabold tracking-[0.06em] text-red-text">SUBMIT AN ARTICLE →</Link></Card>
        </aside>
      </div>
    </Shell>
  );
}
