import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { Shell, Crumbs } from "@/components/site/Shell";
import { Kicker, Badge } from "@/components/ui/Primitives";
import { EnvelopeIcon } from "@/components/site/Letters";
import { ShareRow } from "@/components/site/ArticleExtras";
import { LETTERS, getLetter, lettersFor } from "@/lib/content/people";
import { getArticle } from "@/lib/content/articles";
import { ArtKicker } from "@/components/site/ArticleCards";
import { MeshBg } from "@/components/ui/Mesh";
import { articleHref, fmtDate, fmtDateShort, SITE } from "@/lib/site";

export function generateStaticParams() {
  return LETTERS.map((l) => ({ slug: l.slug }));
}
export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const l = getLetter((await params).slug);
  return l ? { title: `“${l.title}” · Letter`, description: l.teaser } : {};
}

export default async function LetterPage({ params }: { params: Promise<{ slug: string }> }) {
  const l = getLetter((await params).slug);
  if (!l) notFound();
  const target = getArticle(l.replyTo.slug);
  const others = lettersFor(l.replyTo.slug).filter((x) => x.slug !== l.slug);
  const url = `${SITE.url}/letters/${l.slug}/`;
  return (
    <Shell>
      <article className="wrap max-w-[860px] pt-7 pb-6">
        <Crumbs items={[{ label: "Letters & Opinion", href: "/letters/" }, { label: "Letter" }]} />
        <div className="mt-4 flex flex-wrap items-center gap-2.5">
          <Kicker>Letter to the editor</Kicker>
          <span className="num text-[11px] font-bold text-grey">{fmtDate(l.date).toUpperCase()}</span>
          {l.ledToCorrection && <Badge tone="current" size="sm">Led to a correction</Badge>}
        </div>
        <h1 className="font-display mt-3 text-[30px] leading-[1.14] tracking-[-0.045em] md:text-[34px]">“{l.title}”</h1>
        <div className="mt-5 flex flex-wrap items-center gap-3 border-y border-line py-3.5">
          <span className="flex h-10 w-10 items-center justify-center rounded-full border border-line bg-paper text-grey"><EnvelopeIcon size={18} /></span>
          <span className="min-w-0"><span className="block text-[14px] font-extrabold">{l.writer.name ?? "Name withheld"}</span><span className="meta block text-[12px]">{l.writer.role} · {l.writer.org}, {l.writer.country} · Identity and organisation verified by the editor</span></span>
          <span className="ml-auto"><ShareRow url={url} title={l.title} /></span>
        </div>

        <div className="mt-6 text-[16.5px] font-medium leading-[1.75] text-fg-2">
          {l.body.map((p, i) => <p key={i} className="mb-4">{p}</p>)}
        </div>

        {target && (
          <Link href={articleHref(target)} className="group mt-6 flex items-center gap-4 rounded-card border border-line p-4 hover:border-ink">
            <span className="relative h-[62px] w-[84px] shrink-0 overflow-hidden rounded-lg bg-dark-2"><MeshBg id={target.mesh ?? "weldQ"} color="#FFFFFF" opacity={0.16} /></span>
            <span className="min-w-0"><span className="mb-1 block"><ArtKicker a={target} /></span><span className="font-display block text-[16px] leading-[1.25] group-hover:text-red-text">Replying to: {target.title}</span><span className="meta block text-[11.5px]">{fmtDate(target.date)} · {target.readMin} min</span></span>
          </Link>
        )}

        {l.editorReply && (
          <div className="mt-6 rounded-r-card border-l-4 border-red bg-paper p-5">
            <div className="mb-2 flex items-center gap-2.5"><Badge tone="standard" size="sm">Editor’s reply</Badge><span className="meta text-[11.5px]">{l.editorReply.by}, {fmtDate(l.editorReply.date)}</span></div>
            <p className="text-[14.5px] font-medium leading-[1.65] text-fg-2">{l.editorReply.text}</p>
          </div>
        )}

        <div className="mt-6 flex flex-wrap items-center gap-4 rounded-card bg-dark p-5 text-white">
          <div className="flex-1 basis-[300px]"><div className="font-display text-[16px]">Have a different view?</div><p className="mt-1 text-[12.5px] font-medium leading-[1.55] text-grey-3">Reply with a letter of your own. Letters answering this one are linked below it.</p></div>
          <Link href="/letters/#write" className="inline-flex min-h-[44px] items-center rounded-full bg-red px-5 text-[13.5px] font-extrabold hover:bg-red-deep">Reply with a letter</Link>
        </div>

        <section className="mt-7 border-t border-line pt-4">
          <div className="font-display mb-2 text-[12px] tracking-[0.1em] text-grey">FURTHER LETTERS ON THIS ARTICLE · {others.length}</div>
          {others.length ? others.map((o) => (
            <Link key={o.slug} href={`/letters/${o.slug}/`} className="flex items-baseline justify-between gap-4 border-b border-line-soft py-2.5 last:border-0 hover:text-red-text"><span className="font-display text-[15px]">“{o.title}”</span><span className="num shrink-0 text-[11px] font-bold text-grey">{fmtDateShort(o.date)}</span></Link>
          )) : <p className="meta">None yet.</p>}
        </section>
        <p className="meta mt-6 text-[11.5px] leading-[1.6] text-grey">Letters express the views of their writers, not of Wire Mesh News. Letters are edited for length and clarity; the writer’s point is not altered. Writers may be contacted by the editor before publication.</p>
      </article>
    </Shell>
  );
}
