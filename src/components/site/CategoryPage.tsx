import Link from "next/link";
import { Shell, Crumbs } from "@/components/site/Shell";
import { Badge, Card, ChipLink } from "@/components/ui/Primitives";
import { MeshBg } from "@/components/ui/Mesh";
import { AdSlot, AdBand } from "@/components/ui/AdSlot";
import { ArticleRow, ArticleCard, NumberedRow, SponsoredCard, ArtKicker } from "@/components/site/ArticleCards";
import { NewsletterForm } from "@/components/site/NewsletterForm";
import { bySection, bySubsection, featured, mostRead, sponsoredFor, seriesParts } from "@/lib/content/articles";
import { STANDARDS } from "@/lib/content/standards";
import { getAuthor } from "@/lib/content/people";
import { SECTION_INTRO, articleHref, fmtDate } from "@/lib/site";
import type { SectionCode } from "@/lib/content/types";

type Sub = { code: string; label: string; slug: string };

export function CategoryPage({ section, subs, activeSub }: { section: { code: string; label: string; slug: string }; subs: Sub[]; activeSub?: Sub }) {
  const code = section.code as SectionCode;
  const all = activeSub ? bySubsection(code, activeSub.code) : bySection(code);
  const pick = featured().find((a) => a.section === code && (!activeSub || a.subsection === activeSub.code)) ?? all[0];
  const list = all.filter((a) => a.slug !== pick?.slug);
  const sponsored = sponsoredFor(code);
  const intro = SECTION_INTRO[code];
  const stds = STANDARDS.filter((s) => all.some((a) => a.standards?.includes(s.no))).slice(0, 5);
  const series = code === "technical_guides" ? seriesParts("coatings-from-spec-to-site") : [];
  const editor = getAuthor(code === "market_insights" ? "daniel-obi" : code === "buying_guides" ? "tomas-reyes" : code === "applications" ? "hanna-kraus" : "mei-lin")!;

  return (
    <Shell>
      {/* Section header */}
      <div className="relative overflow-hidden border-b border-line">
        <MeshBg id={intro.mesh} opacity={0.06} className="!left-auto !w-[520px] text-ink dark:text-white" />
        <div className="wrap relative pt-7 pb-8">
          <Crumbs items={activeSub ? [{ label: section.label, href: `/${section.slug}/` }, { label: activeSub.label }] : [{ label: section.label }]} />
          <div className="mt-4 grid gap-6 lg:grid-cols-[1fr_auto] lg:items-end">
            <div className="max-w-[760px]">
              <h1 className="font-display text-[40px] tracking-[-0.045em]">{activeSub ? activeSub.label : section.label}<span className="text-red">.</span></h1>
              <p className="mt-3 text-[15.5px] font-medium leading-[1.6] text-slate">{intro.intro}</p>
            </div>
            <div className="num flex items-center gap-6 text-[12px] font-extrabold tracking-[0.08em] text-grey">
              <span><b className="font-display text-[24px] tracking-[-0.02em] text-fg">{all.length}</b> ARTICLES</span>
              <span><b className="font-display text-[24px] tracking-[-0.02em] text-fg">{subs.length}</b> SUB-SECTIONS</span>
              <Link href="/subscribe/" className="inline-flex min-h-[40px] items-center rounded-full border-[1.5px] border-ink px-4 text-[13px] font-extrabold tracking-normal text-fg hover:border-red hover:text-red-text dark:border-white">Follow</Link>
            </div>
          </div>
          <div className="no-scrollbar mt-6 flex gap-2 overflow-x-auto">
            <ChipLink href={`/${section.slug}/`} active={!activeSub} count={bySection(code).length}>All</ChipLink>
            {subs.map((s) => (
              <ChipLink key={s.code} href={`/${section.slug}/${s.slug}/`} active={activeSub?.code === s.code} count={bySubsection(code, s.code).length}>{s.label}</ChipLink>
            ))}
          </div>
        </div>
      </div>

      <div className="wrap grid gap-10 pt-8 lg:grid-cols-[minmax(0,1fr)_300px]">
        <div>
          {/* Editors' pick + From the editor */}
          {pick && (
            <div className="grid gap-6 border-b border-line pb-8 md:grid-cols-[1.4fr_1fr]">
              <Link href={articleHref(pick)} className="group">
                <span className="relative block aspect-[16/9] overflow-hidden rounded-card bg-dark-2"><MeshBg id={pick.mesh ?? intro.mesh} color="#FFFFFF" opacity={0.16} /><span className="absolute left-3 top-3"><Badge tone="topic" size="sm">Editors’ pick</Badge></span></span>
                <span className="mt-3 block"><ArtKicker a={pick} withSection={false} /></span>
                <span className="font-display mt-2 block text-[26px] leading-[1.14] group-hover:text-red-text">{pick.title}</span>
                <span className="mt-2 block text-[14.5px] font-medium leading-[1.6] text-slate">{pick.dek}</span>
                <span className="meta mt-2 block">By {getAuthor(pick.author)?.name} · {fmtDate(pick.date)} · {pick.readMin} min read</span>
              </Link>
              <Card tone="paper" className="self-start">
                <div className="font-display text-[12px] tracking-[0.1em] text-slate">FROM THE EDITOR</div>
                <p className="mt-3 text-[14.5px] font-medium leading-[1.65] text-fg-2">
                  {code === "technical_guides" && "This month we are working through coatings from specification to site acceptance — the three-part series is the place to start. Letters correcting us on measurement location have already improved two articles."}
                  {code === "market_insights" && "Trade measures dominate the quarter. The EU definitive duty landed early; the US derivatives list is next. Market data stays on a single page with its methodology one click away."}
                  {code === "news" && "Project case studies get priority this quarter: the acceptance-testing detail that nearly failed an airport fence is the kind of story only a named source can tell."}
                  {code === "applications" && "Scenarios, not products: each application field is written for the person who has to specify for that site, starting with what the site does to the mesh."}
                  {code === "buying_guides" && "Editorial, never sales: these guides are written for buyers and audited against our own RFQ checklist. We publish the checklist too."}
                </p>
                <div className="mt-3 flex items-center gap-3 border-t border-line pt-3">
                  <span className="h-9 w-9 rounded-full bg-line" aria-hidden="true" />
                  <span><Link href={`/authors/${editor.slug}/`} className="block text-[13.5px] font-extrabold hover:text-red-text">{editor.name}</Link><span className="meta block text-[11.5px]">Updated {fmtDate("2026-10-10")}</span></span>
                </div>
              </Card>
            </div>
          )}

          {/* List */}
          <div className="mt-6 flex items-center gap-4 border-b-[3px] border-ink pb-2 dark:border-line-2">
            <span className="font-display text-[14px]">All {activeSub ? activeSub.label.toLowerCase() : section.label.toLowerCase()}</span>
            <span className="num ml-auto flex gap-3 text-[11px] font-extrabold tracking-[0.08em] text-grey"><span className="text-fg">LATEST</span><span>MOST READ</span><span>EDITORS’ PICK</span></span>
          </div>
          {list.slice(0, 5).map((a) => (
            <ArticleRow key={a.slug} a={a} dek />
          ))}
          {sponsored && <SponsoredCard a={sponsored} className="my-5" />}
          {series.length > 0 && (
            <div className="my-6 rounded-card border-2 border-ink p-5 dark:border-line-2">
              <div className="flex items-baseline justify-between"><span className="flex items-center gap-2"><Badge tone="topic" size="sm">Series</Badge><span className="font-display text-[18px]">Coatings, from spec to site</span></span><span className="num text-[11px] font-extrabold tracking-[0.06em] text-red-text">ALL {series.length} PARTS →</span></div>
              <ol className="mt-3 grid gap-3 md:grid-cols-3">
                {series.map((p) => (
                  <li key={p.slug}><Link href={articleHref(p)} className="group block border-t border-line pt-2.5"><span className="num text-[10px] font-extrabold tracking-[0.1em] text-grey">PART {p.series!.part}</span><span className="font-display block text-[15px] leading-[1.25] group-hover:text-red-text">{p.title}</span></Link></li>
                ))}
              </ol>
            </div>
          )}
          {list.slice(5).map((a) => (
            <ArticleRow key={a.slug} a={a} />
          ))}
          <nav aria-label="Pagination" className="mt-6 flex items-center gap-2">
            <span className="inline-flex min-h-[38px] min-w-[42px] items-center justify-center rounded-full bg-ink text-[13.5px] font-bold text-white dark:bg-white dark:text-ink">1</span>
            <span className="inline-flex min-h-[38px] min-w-[42px] items-center justify-center rounded-full border border-line text-[13.5px] font-bold text-grey">2</span>
            <span className="inline-flex min-h-[38px] items-center rounded-full border border-line px-4 text-[13.5px] font-bold text-grey">Next →</span>
          </nav>
        </div>

        <aside className="flex flex-col gap-6">
          <AdSlot kind="mpu" />
          <Card tone="paper">
            <div className="font-display text-[16px]">{section.label} by email</div>
            <p className="meta mt-1 mb-3">Only this section, twice a month.</p>
            <NewsletterForm compact label="Subscribe" listName={`the ${section.label} list`} />
          </Card>
          <Card>
            <div className="font-display mb-2 text-[12px] tracking-[0.1em]">MOST READ HERE</div>
            {mostRead(5).filter((a) => a.section === code || true).slice(0, 3).map((a, i) => <NumberedRow key={a.slug} a={a} n={i + 1} />)}
          </Card>
          {stds.length > 0 && (
            <Card>
              <div className="font-display mb-3 text-[12px] tracking-[0.1em]">STANDARDS IN THIS SECTION</div>
              <ul className="num flex flex-col gap-2 text-[13.5px] font-extrabold">
                {stds.map((s) => <li key={s.no}><Link href={`/standards/${s.slug}/`} className="flex items-center justify-between hover:text-red-text"><span>{s.no}</span><span className="text-[10.5px] font-bold tracking-[0.06em] text-grey">{s.status.replace("_", " ").toUpperCase()}</span></Link></li>)}
              </ul>
              <Link href="/standards/" className="mt-3 inline-block text-[11.5px] font-extrabold tracking-[0.06em] text-red-text">STANDARDS INDEX →</Link>
            </Card>
          )}
          <AdSlot kind="half" />
        </aside>
      </div>

      {/* Related cards + pre-footer ad */}
      <section className="wrap mt-14">
        <div className="mb-5 flex items-center gap-3"><span className="font-display text-[13px] tracking-[0.1em] text-grey">ELSEWHERE ON THE SITE</span><span className="h-px flex-1 bg-line" /></div>
        <div className="grid gap-6 md:grid-cols-3">
          {featured().filter((a) => a.section !== code).slice(0, 3).map((a) => <ArticleCard key={a.slug} a={a} showDek={false} />)}
        </div>
      </section>
      <AdBand className="mt-12" />
    </Shell>
  );
}
