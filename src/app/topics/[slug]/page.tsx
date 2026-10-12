import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { Shell, Crumbs } from "@/components/site/Shell";
import { Badge, Card } from "@/components/ui/Primitives";
import { AdSlot } from "@/components/ui/AdSlot";
import { ArticleRow, ArtKicker } from "@/components/site/ArticleCards";
import { NewsletterForm } from "@/components/site/NewsletterForm";
import { TOPICS, getTopic } from "@/lib/content/market";
import { getArticle, byTopic } from "@/lib/content/articles";
import { getAuthor } from "@/lib/content/people";
import { getCompany } from "@/lib/content/directory";
import { articleHref, fmtDate } from "@/lib/site";

export function generateStaticParams() {
  return TOPICS.map((t) => ({ slug: t.slug }));
}
export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const t = getTopic((await params).slug);
  return t ? { title: `${t.title} · Topic`, description: t.intro } : {};
}

export default async function TopicPage({ params }: { params: Promise<{ slug: string }> }) {
  const t = getTopic((await params).slug);
  if (!t) notFound();
  const start = t.startHere.map((s) => getArticle(s)).filter(Boolean);
  const related = byTopic(t.slug).filter((a) => !t.startHere.includes(a.slug));
  const curator = getAuthor(t.curator);
  return (
    <Shell>
      <div className="wrap pt-7">
        <Crumbs items={[{ label: "Topics", href: "/topics/" }, { label: t.name }]} />
        <div className="mt-4 grid gap-8 border-b border-line pb-8 lg:grid-cols-[1fr_300px]">
          <div>
            <Badge tone="topic">Topic</Badge>
            <h1 className="font-display mt-3 text-[40px] tracking-[-0.045em]">{t.title}</h1>
            <p className="mt-3 max-w-[720px] text-[15.5px] font-medium leading-[1.6] text-slate">{t.intro}</p>
            <div className="num meta mt-3 flex flex-wrap gap-x-3">{byTopic(t.slug).length} articles · Updated {fmtDate(t.updated)} · Curated by <Link href={`/authors/${curator?.slug}/`} className="font-extrabold text-fg hover:text-red-text">{curator?.name}</Link></div>
            <div className="mt-5">
              <div className="kicker mb-2 text-[10px]">In this topic</div>
              <ol className="flex flex-wrap gap-2">{t.outline.map((o, i) => <li key={o} className="num rounded-full border border-line px-3 py-1.5 text-[12.5px] font-bold">{i + 1} · {o}</li>)}</ol>
            </div>
          </div>
          <Card tone="paper" className="self-start">
            <div className="kicker text-[10px]">Topic sponsor</div>
            {t.sponsor ? <div className="font-display mt-2 text-[18px]">{t.sponsor}</div> : <div className="mt-2 inline-flex h-12 w-full items-center justify-center rounded border border-dashed border-line-2 text-[10px] font-extrabold tracking-[0.1em] text-grey">AVAILABLE</div>}
            <p className="meta mt-2 text-[11.5px] leading-[1.55]">A sponsor’s display placement on this topic. Editorial content inside the topic is reported independently and is not chosen by the sponsor.</p>
            <Link href="/advertise/" className="mt-2 inline-block text-[11px] font-extrabold tracking-[0.06em] text-red-text">ABOUT SPONSORSHIP →</Link>
          </Card>
        </div>
      </div>

      <div className="wrap grid gap-10 pt-8 lg:grid-cols-[minmax(0,1fr)_300px]">
        <div>
          <div className="flex items-baseline justify-between"><h2 className="font-display text-[22px]">Start here</h2><span className="meta">In decision order</span></div>
          <ol className="mt-4 flex flex-col">
            {start.map((a, i) => (
              <li key={a!.slug}>
                <Link href={articleHref(a!)} className="group flex gap-5 border-b border-line py-5">
                  <span className="num font-display w-10 shrink-0 text-[34px] leading-none text-red tracking-[-0.03em]">{i + 1}</span>
                  <span className="min-w-0"><ArtKicker a={a!} /><span className="font-display mt-1.5 block text-[21px] leading-[1.2] group-hover:text-red-text">{a!.title}</span><span className="mt-1.5 block text-[14px] font-medium leading-[1.55] text-slate">{a!.dek}</span><span className="num mt-1.5 block text-[11px] font-bold tracking-[0.06em] text-grey">{a!.readMin} MIN READ</span></span>
                </Link>
              </li>
            ))}
          </ol>
          {related.length > 0 && (
            <>
              <div className="mt-10 flex items-baseline justify-between"><h2 className="font-display text-[22px]">Related news and analysis</h2></div>
              {related.map((a) => <ArticleRow key={a.slug} a={a} />)}
            </>
          )}
        </div>
        <aside className="flex flex-col gap-5">
          <Card tone="dark">
            <div className="font-display text-[16px]">Follow this topic</div>
            <p className="mt-1 mb-3 text-[12.5px] font-medium text-grey-3">An email when the topic is updated — at most one a month.</p>
            <NewsletterForm tone="dark" compact listName="this topic" />
          </Card>
          {t.terms.length > 0 && (
            <Card>
              <div className="kicker mb-2 text-[10px]">Key terms</div>
              <dl>{t.terms.map((x) => <div key={x.term} className="border-t border-line-soft py-2"><dt className="text-[13.5px] font-extrabold">{x.term}</dt><dd className="meta m-0 mt-0.5 leading-[1.5]">{x.def}</dd></div>)}</dl>
            </Card>
          )}
          {t.companies.length > 0 && (
            <Card>
              <div className="kicker mb-2 text-[10px]">Companies in this topic</div>
              <ul>{t.companies.map((c) => getCompany(c)).filter(Boolean).map((c) => <li key={c!.slug}><Link href={`/directory/${c!.slug}/`} className="flex items-center justify-between border-t border-line-soft py-2 text-[13.5px] font-extrabold hover:text-red-text"><span>{c!.name}</span><span className="num text-[11px] text-grey">{c!.country}</span></Link></li>)}</ul>
              <Link href="/directory/" className="mt-3 inline-block text-[11.5px] font-extrabold tracking-[0.06em] text-red-text">DIRECTORY →</Link>
            </Card>
          )}
          <AdSlot kind="mpu" />
        </aside>
      </div>
    </Shell>
  );
}
