import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { Shell, Crumbs } from "@/components/site/Shell";
import { CategoryPage } from "@/components/site/CategoryPage";
import { Badge, Kicker, Card } from "@/components/ui/Primitives";
import { MeshBg } from "@/components/ui/Mesh";
import { AdSlot } from "@/components/ui/AdSlot";
import { ArticleBody } from "@/components/site/ArticleBody";
import { ReadingProgress, ShareRow, Toc, TocCollapsed } from "@/components/site/ArticleExtras";
import { ArticleCard } from "@/components/site/ArticleCards";
import { LetterItem } from "@/components/site/Letters";
import { SocialGlyph } from "@/components/ui/SocialButton";
import { ARTICLES, getArticle, readNext } from "@/lib/content/articles";
import { getAuthor, lettersFor } from "@/lib/content/people";
import { getStandardByNo } from "@/lib/content/standards";
import { getCompany } from "@/lib/content/directory";
import { EDITORIAL_SECTIONS, sectionBySlug, subsectionsOf, subsectionSlug, subsectionLabel, fmtDate, articleHref, SITE } from "@/lib/site";
import type { SectionCode } from "@/lib/content/types";

export function generateStaticParams() {
  const params: { section: string; slug: string }[] = [];
  for (const s of EDITORIAL_SECTIONS) {
    for (const x of subsectionsOf(s.code as SectionCode)) params.push({ section: s.slug, slug: subsectionSlug(x.code) });
  }
  for (const a of ARTICLES) params.push({ section: EDITORIAL_SECTIONS.find((s) => s.code === a.section)!.slug, slug: a.slug });
  return params;
}

export async function generateMetadata({ params }: { params: Promise<{ section: string; slug: string }> }): Promise<Metadata> {
  const { section, slug } = await params;
  const s = sectionBySlug(section);
  if (!s) return {};
  const sub = subsectionsOf(s.code as SectionCode).find((x) => subsectionSlug(x.code) === slug);
  if (sub) return { title: `${sub.label} · ${s.label}` };
  const a = getArticle(slug);
  if (!a || a.section !== s.code) return {};
  return { title: a.title, description: a.dek, openGraph: { title: a.title, description: a.dek, type: "article", publishedTime: a.date, modifiedTime: a.updated } };
}

export default async function Page({ params }: { params: Promise<{ section: string; slug: string }> }) {
  const { section, slug } = await params;
  const s = sectionBySlug(section);
  if (!s) notFound();
  const code = s.code as SectionCode;
  const subs = subsectionsOf(code).map((x) => ({ code: x.code, label: x.label, slug: subsectionSlug(x.code) }));
  const sub = subs.find((x) => x.slug === slug);
  if (sub) return <CategoryPage section={s} subs={subs} activeSub={sub} />;

  const a = getArticle(slug);
  if (!a || a.section !== code) notFound();
  const author = getAuthor(a.author)!;
  const toc = a.body.filter((b) => b.type === "h2").map((b) => (b.type === "h2" ? { id: b.id, text: b.text } : null)!).filter(Boolean);
  const longForm = toc.length >= 3;
  const stds = (a.standards ?? []).map((n) => getStandardByNo(n)).filter(Boolean);
  const cos = (a.companies ?? []).map((c) => getCompany(c)).filter(Boolean);
  const letters = lettersFor(a.slug);
  const url = `${SITE.url}${articleHref(a)}`;
  const isSponsored = a.type === "sponsored";

  return (
    <Shell>
      <ReadingProgress title={a.title} />
      <article>
        {/* Dark header */}
        <header className="relative overflow-hidden bg-dark text-white">
          <MeshBg id={a.mesh ?? "chain"} color="#2A2D3A" opacity={1} />
          <div className="wrap relative pt-7 pb-9">
            <div className="text-grey-3 [&_a:hover]:text-white [&_b]:text-white">
              <Crumbs items={[{ label: s.label, href: `/${s.slug}/` }, { label: subsectionLabel(code, a.subsection), href: `/${s.slug}/${subsectionSlug(a.subsection)}/` }]} />
            </div>
            <div className="mt-5 flex flex-wrap items-center gap-3">
              {isSponsored ? <Badge tone="sponsored">Sponsored content</Badge> : <Badge tone="topic">{s.label}</Badge>}
              {a.type === "analysis" && <Badge tone="opinion" className="!border-line-dark !text-grey-3">Analysis</Badge>}
              <span className="num text-[11px] font-bold tracking-[0.08em] text-grey-2">{fmtDate(a.date).toUpperCase()}{a.updated && ` · UPDATED ${fmtDate(a.updated).toUpperCase()}`} · {a.readMin} MIN</span>
            </div>
            <h1 className="font-display mt-4 max-w-[900px] text-[34px] leading-[1.06] tracking-[-0.045em] md:text-[46px]">{a.title}</h1>
            <p className="mt-4 max-w-[760px] text-[17px] font-medium leading-[1.55] text-on-dark-2">{a.dek}</p>
            <div className="mt-6 flex flex-wrap items-center gap-4 border-t border-white/10 pt-5">
              <Link href={`/authors/${author.slug}/`} className="flex items-center gap-3 hover:text-red-text">
                <span className="h-10 w-10 rounded-full bg-dark-3" aria-hidden="true" />
                <span><span className="block text-[14px] font-extrabold">{author.name}</span><span className="block text-[11.5px] font-medium text-grey-3">{author.role}</span></span>
              </Link>
              {isSponsored && <span className="text-[12px] font-bold text-grey-3">Paid for by {a.sponsor} · produced with the sponsor, not by our editors</span>}
              <div className="ml-auto"><ShareRow url={url} title={a.title} tone="dark" /></div>
            </div>
          </div>
        </header>

        {/* Figure */}
        <div className="wrap -mt-0">
          <figure className="relative aspect-[3/1] max-h-[420px] overflow-hidden rounded-b-card bg-[#D2D4DD] dark:bg-dark-2">
            <MeshBg id={a.mesh ?? "weldQ"} color="#8A8F9E" opacity={0.8} />
            <span className="absolute left-0 bottom-0 rounded-tr-lg bg-red px-2.5 py-1.5 text-[10px] font-extrabold tracking-[0.12em] text-white">FIG. 1</span>
          </figure>
          <p className="meta mt-2">Illustration: Wire Mesh News. Pattern shown is indicative of the product family discussed, not a specific product.</p>
        </div>

        {/* Key takeaways */}
        {a.takeaways && (
          <div className="wrap mt-8">
            <div className="font-display mb-3 text-[12px] tracking-[0.1em]">KEY TAKEAWAYS</div>
            <div className="grid gap-4 md:grid-cols-3">
              {a.takeaways.map((t, i) => (
                <div key={i} className="relative border-[1.5px] border-ink p-4 dark:border-line-2">
                  <span className="absolute -left-1 -top-1 h-2 w-2 rounded-full bg-red" aria-hidden="true" />
                  <span className="num block text-[11px] font-extrabold text-red-text">{String(i + 1).padStart(2, "0")}</span>
                  <span className="font-display mt-1 block text-[16px] leading-[1.25]">{t}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {longForm && <div className="mt-6"><TocCollapsed items={toc} /></div>}

        {/* Three columns */}
        <div className="wrap mt-8 grid gap-10 lg:grid-cols-[200px_minmax(0,1fr)_300px]">
          <div className="max-lg:hidden">
            <div className="sticky top-16">{longForm && <Toc items={toc} />}</div>
          </div>
          <div className="min-w-0 max-w-[720px]">
            {a.appliesTo && (
              <div className="mb-5 flex flex-wrap items-center gap-2 rounded-xl bg-paper p-3.5">
                <span className="font-display mr-1 text-[11px] tracking-[0.1em] text-slate">APPLIES TO</span>
                {a.appliesTo.map((t) => <span key={t} className="rounded-full border border-line bg-bg px-3 py-1 text-[12.5px] font-bold">{t}</span>)}
              </div>
            )}
            <ArticleBody blocks={a.body} showAd={longForm && !isSponsored} />

            {a.sources && (
              <section className="mt-10 border-t border-line pt-6">
                <div className="font-display mb-3 text-[12px] tracking-[0.1em]">SOURCES &amp; FURTHER READING</div>
                <ol className="num flex flex-col gap-2 text-[13.5px]">
                  {a.sources.map((src, i) => (
                    <li key={i} className="flex gap-3"><span className="w-5 shrink-0 font-extrabold text-red-text">{i + 1}</span><span><a href={src.url} className="font-bold underline decoration-line underline-offset-2 hover:text-red-text" target={src.url.startsWith("http") ? "_blank" : undefined} rel="noopener noreferrer">{src.title}</a><span className="meta"> · accessed {fmtDate(src.accessed)}</span></span></li>
                  ))}
                </ol>
              </section>
            )}
            {a.correction && (
              <div className="mt-8 border-l-4 border-red bg-paper p-4">
                <div className="font-display text-[12px] tracking-[0.1em] text-red-text">CORRECTION · {fmtDate(a.correction.date).toUpperCase()}</div>
                <p className="mt-1 text-[14px] font-medium leading-[1.6]">{a.correction.text}</p>
              </div>
            )}

            <div className="mt-8 flex flex-wrap gap-2">
              <span className="font-display mr-1 self-center text-[11px] tracking-[0.1em] text-slate">TOPICS</span>
              {a.tags.map((t) => <Link key={t} href={`/search/?q=${encodeURIComponent(t)}`} className="inline-flex min-h-[34px] items-center rounded-full border-[1.5px] border-line px-3.5 text-[13px] font-bold hover:border-ink">{t}</Link>)}
            </div>

            {/* Author card */}
            <div className="mt-8 rounded-card bg-dark p-6 text-white">
              <div className="flex flex-wrap items-start gap-4">
                <span className="h-14 w-14 shrink-0 rounded-full bg-dark-3" aria-hidden="true" />
                <div className="min-w-0 flex-1">
                  <Link href={`/authors/${author.slug}/`} className="font-display text-[20px] hover:text-red-text">{author.name}</Link>
                  <div className="text-[12px] font-bold text-grey-3">{author.role} · {author.basedIn}</div>
                  <p className="mt-2 text-[13.5px] font-medium leading-[1.6] text-on-dark-2">{author.bio}</p>
                  <div className="mt-3 flex items-center gap-2">
                    {author.email && <a href={`mailto:${author.email}`} className="inline-flex min-h-[36px] items-center rounded-full border border-line-dark px-3.5 text-[12px] font-extrabold hover:border-red">Email</a>}
                    {author.linkedin && <a href={author.linkedin} target="_blank" rel="noopener noreferrer" aria-label="LinkedIn" className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-line-dark hover:border-red hover:bg-red"><SocialGlyph id="linkedin" size={14} /></a>}
                    <Link href={`/authors/${author.slug}/`} className="ml-auto text-[11.5px] font-extrabold tracking-[0.06em] text-red-text">ALL ARTICLES →</Link>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-6"><ShareRow url={url} title={a.title} /></div>

            {/* Letters on this article */}
            <section className="mt-10 border-t border-line pt-6">
              <div className="flex items-baseline justify-between"><div className="font-display text-[12px] tracking-[0.1em]">LETTERS ON THIS ARTICLE · {letters.length}</div><Link href="/letters/#write" className="text-[11.5px] font-extrabold tracking-[0.06em] text-red-text">WRITE A LETTER →</Link></div>
              {letters.length ? letters.map((l) => <LetterItem key={l.slug} l={l} dateMode="absolute" />) : <p className="meta mt-3">No letters yet. Letters are reviewed before publication and the writer’s identity is verified by the editor.</p>}
            </section>
          </div>

          <aside className="flex flex-col gap-6">
            {!isSponsored && <AdSlot kind="mpu" />}
            {stds.length > 0 && (
              <Card>
                <div className="font-display mb-3 text-[12px] tracking-[0.1em]">STANDARDS CITED</div>
                <ul className="flex flex-col divide-y divide-line-soft">
                  {stds.map((st) => (
                    <li key={st!.no} className="py-2 first:pt-0 last:pb-0">
                      <Link href={`/standards/${st!.slug}/`} className="group block"><span className="num block text-[14px] font-extrabold group-hover:text-red-text">{st!.no}</span><span className="meta block text-[11.5px] leading-[1.45]">{st!.title.split("—")[0]}</span></Link>
                    </li>
                  ))}
                </ul>
              </Card>
            )}
            {cos.length > 0 && (
              <Card>
                <div className="font-display mb-3 text-[12px] tracking-[0.1em]">COMPANIES MENTIONED</div>
                <ul className="flex flex-col gap-2">
                  {cos.map((c) => <li key={c!.slug}><Link href={`/directory/${c!.slug}/`} className="flex items-center justify-between text-[14px] font-extrabold hover:text-red-text"><span>{c!.name}</span>{c!.claimed && <Badge tone="current" size="sm">Claimed</Badge>}</Link></li>)}
                </ul>
                <p className="meta mt-3 text-[11px] leading-[1.5]">Mentions are editorial; listing is never paid for.</p>
              </Card>
            )}
            {!isSponsored && longForm && <AdSlot kind="half" />}
          </aside>
        </div>

        {/* Read next */}
        <section className="wrap mt-14 border-t border-line pt-8">
          <div className="mb-5 flex items-center gap-3"><span className="font-display text-[13px] tracking-[0.1em]">READ NEXT</span><span className="h-px flex-1 bg-line" /></div>
          <div className="grid gap-6 md:grid-cols-3">
            {readNext(a).map((n) => <ArticleCard key={n.slug} a={n} showDek={false} />)}
          </div>
        </section>
      </article>
      <Kicker className="sr-only">End of article</Kicker>
    </Shell>
  );
}
