import Link from "next/link";
import { Shell } from "@/components/site/Shell";
import { SectionHead, Kicker, Badge, Card } from "@/components/ui/Primitives";
import { MeshBg, APPLICATION_MESH } from "@/components/ui/Mesh";
import { AdBand, AdSlot } from "@/components/ui/AdSlot";
import { ButtonLink } from "@/components/ui/Button";
import { HeroTile, ArticleRow, ArticleCard, NumberedRow, SponsoredCard } from "@/components/site/ArticleCards";
import { MarketCell, Attribution } from "@/components/site/Market";
import { LetterItem, ColumnCard, WriteToEditor } from "@/components/site/Letters";
import { NewsletterForm } from "@/components/site/NewsletterForm";
import { ARTICLES, featured, latest, bySection, mostRead, sponsoredFor, byTopic } from "@/lib/content/articles";
import { LETTERS, COLUMNS } from "@/lib/content/people";
import { COMPANIES, recentlyUpdated } from "@/lib/content/directory";
import { STANDARDS, recentStandardChanges } from "@/lib/content/standards";
import { snapshotSeries, MARKET_LICENSED, TOPICS } from "@/lib/content/market";
import { APPLICATION_AREA, CATEGORY, COUNTRY_BY_CODE } from "@/data/vocab";
import { articleHref, fmtDateShort, subsectionLabel } from "@/lib/site";

export default function HomePage() {
  const feats = featured();
  const hero = feats[0];
  const heroSmall = feats.slice(1, 3);
  const heroSlugs = [hero, ...heroSmall].map((a) => a.slug);
  const brief = latest(6, heroSlugs).slice(0, 4);
  const latestList = latest(10, [...heroSlugs, ...brief.map((a) => a.slug)]);
  const guides = bySection("technical_guides").filter((a) => !heroSlugs.includes(a.slug));
  const apps = bySection("applications", 4);
  const mi = bySection("market_insights").filter((a) => !heroSlugs.includes(a.slug)).slice(0, 5);
  const bg = bySection("buying_guides").slice(0, 5);
  const letters = LETTERS.slice(0, 3);
  const showLetters = letters.length >= 3 && new Date("2026-10-12").getTime() - new Date(letters[0].date).getTime() < 60 * 86400000;
  const column = COLUMNS[0];
  const sponsored = sponsoredFor();
  const changes = recentStandardChanges(3);
  const dir = recentlyUpdated(4);

  return (
    <Shell header="full">
      {/* ================= HERO ================= */}
      <section className="wrap pt-6">
        <div className="grid gap-4 lg:grid-cols-[1.6fr_1fr]">
          <HeroTile a={hero} className="min-h-[420px] lg:min-h-[560px]" />
          <div className="grid gap-4 max-lg:grid-cols-2 max-md:grid-cols-1">
            {heroSmall.map((a) => (
              <HeroTile key={a.slug} a={a} size="sm" className="min-h-[220px] lg:min-h-[272px]" />
            ))}
          </div>
        </div>
        {/* The brief */}
        <div className="mt-5 grid border-y border-ink dark:border-line-2 md:grid-cols-4">
          <div className="col-span-full flex items-center gap-3 border-b border-line py-2.5">
            <span className="font-display text-[13px] tracking-[0.1em]">THE BRIEF</span>
            <span className="meta text-[12px]">What else moved this week</span>
          </div>
          {brief.map((a, i) => (
            <Link key={a.slug} href={articleHref(a)} className="group flex flex-col gap-2 border-line py-4 pr-5 md:border-r md:last:border-r-0 md:[&:not(:first-child)]:pl-5">
              <span className="flex items-center gap-2"><span className="num text-[11px] font-extrabold text-red-text">{String(i + 1).padStart(2, "0")}</span><Kicker>{subsectionLabel(a.section, a.subsection)}</Kicker></span>
              <span className="font-display text-[16px] leading-[1.25] group-hover:text-red-text">{a.title}</span>
              <span className="num text-[10.5px] font-bold tracking-[0.06em] text-grey">{fmtDateShort(a.date)} · {a.readMin} MIN</span>
            </Link>
          ))}
        </div>
      </section>

      {/* ================= GAUGE RAMP ================= */}
      <div className="wrap mt-6" aria-hidden="true">
        <div className="grid h-8 grid-cols-5 overflow-hidden rounded-lg border border-line text-ink dark:text-grey-3">
          {(["g1", "g2", "g3", "g4", "g5"] as const).map((g) => (
            <span key={g} className="relative"><MeshBg id={g} opacity={0.5} /></span>
          ))}
        </div>
      </div>

      {/* ================= MARKET SNAPSHOT ================= */}
      {MARKET_LICENSED && (
        <section className="wrap mt-10" aria-labelledby="mk">
          <div className="mb-5 flex flex-wrap items-center gap-3.5">
            <span className="h-2.5 w-2.5 rounded-full bg-red" aria-hidden="true" />
            <h2 id="mk" className="font-display text-[23px] leading-none">Market snapshot</h2>
            <Badge tone="delayed">Delayed 30 min</Badge>
            <span className="h-[2px] flex-1 bg-ink dark:bg-line-2" aria-hidden="true" />
            <Link href="/market-data/methodology/" className="text-[12.5px] font-extrabold tracking-[0.06em] text-red-text max-md:hidden">METHODOLOGY →</Link>
            <Link href="/market-data/" className="text-[12.5px] font-extrabold tracking-[0.06em] text-red-text">ALL SERIES →</Link>
          </div>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {snapshotSeries().map((s) => (
              <MarketCell key={s.code} s={s} />
            ))}
          </div>
          <Attribution className="mt-4" />
        </section>
      )}

      <AdBand className="mt-10" />

      {/* ================= IN NUMBERS ================= */}
      <section className="wrap mt-10" aria-label="In numbers">
        <div className="grid grid-cols-2 gap-px overflow-hidden rounded-card border border-line bg-line md:grid-cols-4">
          {[
            [String(ARTICLES.length), "articles published", "/news/"],
            [String(STANDARDS.length), "standards indexed", "/standards/"],
            [String(COMPANIES.length), "companies listed", "/directory/"],
            [String(new Set(COMPANIES.map((c) => c.country)).size), "countries in the directory", "/directory/"],
          ].map(([n, l, h]) => (
            <Link key={l} href={h} className="group bg-bg p-5 hover:bg-paper">
              <span className="num font-display block text-[34px] tracking-[-0.03em] group-hover:text-red-text">{n}</span>
              <span className="kicker mt-1 block text-[10px]">{l}</span>
            </Link>
          ))}
        </div>
      </section>

      {/* ================= LATEST ================= */}
      <section className="wrap mt-12">
        <SectionHead title="Latest" more="All news" moreHref="/news/" />
        <div className="mt-6 grid gap-10 lg:grid-cols-[1fr_1fr_300px]">
          <div className="flex flex-col">
            {latestList.slice(0, 5).map((a) => (
              <ArticleRow key={a.slug} a={a} />
            ))}
          </div>
          <div className="flex flex-col">
            {latestList.slice(5, 9).map((a) => (
              <ArticleRow key={a.slug} a={a} />
            ))}
            {sponsored && <SponsoredCard a={sponsored} className="mt-4" />}
          </div>
          <aside className="flex flex-col gap-6">
            <Card>
              <div className="mb-3 flex items-center justify-between">
                <span className="font-display text-[13px] tracking-[0.08em]">STANDARDS WATCH</span>
                <Link href="/standards/" className="text-[11px] font-extrabold tracking-[0.06em] text-red-text">INDEX →</Link>
              </div>
              <ul className="flex flex-col divide-y divide-line-soft">
                {changes.map((c) => (
                  <li key={c.no + c.date} className="py-2.5 first:pt-0 last:pb-0">
                    <Link href={`/standards/${c.slug}/`} className="group block">
                      <span className="flex items-center gap-2"><span className="num text-[14px] font-extrabold group-hover:text-red-text">{c.no}</span><Badge tone={c.status === "current" ? "current" : c.status === "withdrawn" ? "withdrawn" : c.status === "draft" ? "draft" : "review"} size="sm">{c.status.replace("_", " ")}</Badge></span>
                      <span className="meta mt-1 block text-[12px] leading-[1.5]">{c.text}</span>
                      <span className="num text-[10px] font-bold tracking-[0.06em] text-grey">{fmtDateShort(c.date)}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            </Card>
            <Card>
              <div className="font-display mb-2 text-[13px] tracking-[0.08em]">MOST READ</div>
              {mostRead(5).map((a, i) => (
                <NumberedRow key={a.slug} a={a} n={i + 1} thumb />
              ))}
            </Card>
            <AdSlot kind="mpu" />
          </aside>
        </div>
      </section>

      {/* ================= LETTERS & OPINION ================= */}
      {showLetters && (
        <section className="mt-12 border-t border-line">
          <div className="wrap py-11">
            <SectionHead title="Letters & Opinion" more="All letters" moreHref="/letters/" />
            <p className="meta mt-2 mb-5">Letters from people who specify, buy, test and make mesh. Columns are written by outside authors; the newsroom does not write opinion.</p>
            <div className="grid gap-11 lg:grid-cols-[1.55fr_1fr]">
              <div>
                <div className="mb-1 flex items-center gap-2.5"><span className="font-display text-[14px] tracking-[0.08em] text-grey">FROM OUR READERS</span><span className="num text-[11px] font-extrabold text-grey-4">{LETTERS.filter((l) => l.date >= "2026-10-01").length} THIS MONTH</span></div>
                {letters.map((l) => (
                  <LetterItem key={l.slug} l={l} />
                ))}
                <WriteToEditor className="mt-5" />
              </div>
              <div>{column && <ColumnCard c={column} />}</div>
            </div>
          </div>
        </section>
      )}

      {/* ================= APPLICATIONS ================= */}
      <section className="relative overflow-hidden bg-[#0E0F14] py-14 text-white">
        <MeshBg id="chainL" color="#1C1E27" opacity={1} />
        <span className="absolute inset-x-0 top-0 h-px bg-[linear-gradient(90deg,rgba(229,36,47,.6)_0%,rgba(229,36,47,0)_46%)]" aria-hidden="true" />
        <div className="wrap relative">
          <SectionHead title="Applications" more="All applications" moreHref="/applications/" onDark />
          <p className="mt-2 mb-6 text-[13.5px] font-medium text-grey-5">Five fields, each with its typical scenarios. The pattern behind each tile is the mesh most often used there.</p>
          <div className="grid gap-4 md:grid-cols-3 lg:grid-cols-5">
            {APPLICATION_AREA.map((a) => (
              <Link key={a.code} href={`/applications/${a.code.replace(/_/g, "-")}/`} className="group relative flex min-h-[268px] flex-col justify-between overflow-hidden rounded-[18px] border border-line-dark bg-[#17181F] p-[18px] transition-colors hover:border-red">
                <MeshBg id={APPLICATION_MESH[a.code]} color="#5A5F78" opacity={0.62} scale={1.45} />
                <span className="pointer-events-none absolute inset-0" style={{ background: "radial-gradient(135% 85% at 86% -12%, rgba(229,36,47,.26) 0%, rgba(229,36,47,.05) 46%, rgba(229,36,47,0) 64%)" }} />
                <span className="pointer-events-none absolute inset-0" style={{ background: "linear-gradient(180deg, rgba(23,24,31,0) 0%, rgba(23,24,31,.42) 34%, rgba(23,24,31,.93) 62%, #191A22 100%)" }} />
                <span className="pointer-events-none absolute inset-x-0 bottom-0 h-[3px] opacity-55" style={{ background: "linear-gradient(90deg, #E5242F 0%, rgba(229,36,47,0) 72%)" }} />
                <span className="relative inline-flex h-10 w-10 items-center justify-center rounded-lg bg-white/5 text-white"><AppIcon code={a.code} /></span>
                <span className="relative">
                  <span className="font-display block text-[19px] leading-[1.1] group-hover:text-red-text">{a.labelEn}</span>
                  <span className="mt-2 flex flex-col gap-0.5">
                    {a.scenariosEn.split(";").slice(0, 3).map((s) => (
                      <span key={s} className="text-[11.5px] font-bold text-red-text">{s.trim()}</span>
                    ))}
                  </span>
                </span>
              </Link>
            ))}
          </div>
          <div className="mt-9 flex items-center gap-3"><span className="font-display text-[13px] tracking-[0.1em] text-grey-5">LATEST IN APPLICATIONS</span><span className="h-px flex-1 bg-line-dark" /></div>
          <div className="mt-4 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {apps.map((a) => (
              <Link key={a.slug} href={articleHref(a)} className="group flex flex-col gap-2">
                <span className="relative block aspect-[16/9] overflow-hidden rounded-lg bg-[#1C1E27]"><MeshBg id={a.mesh ?? "chain"} color="#FFFFFF" opacity={0.14} /></span>
                <Kicker tone="on-dark">{subsectionLabel(a.section, a.subsection)}</Kicker>
                <span className="font-display text-[16px] leading-[1.22] group-hover:text-red-text">{a.title}</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ================= TECHNICAL GUIDES ================= */}
      <section className="wrap mt-12">
        <SectionHead title="Technical Guides" more="All guides" moreHref="/technical-guides/" />
        <div className="mt-6 grid gap-8 lg:grid-cols-[2fr_1fr]">
          <div className="grid gap-6 md:grid-cols-3">
            {guides.slice(0, 3).map((a) => (
              <ArticleCard key={a.slug} a={a} />
            ))}
          </div>
          <div>
            <div className="font-display mb-1 text-[13px] tracking-[0.08em] text-grey">MORE GUIDES</div>
            {guides.slice(3, 9).map((a) => (
              <Link key={a.slug} href={articleHref(a)} className="group flex items-start justify-between gap-4 border-b border-line-soft py-2.5">
                <span className="font-display text-[14.5px] leading-[1.25] group-hover:text-red-text">{a.title}</span>
                <span className="num shrink-0 text-[10.5px] font-bold text-grey">{a.readMin} MIN</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <AdBand className="mt-12" />

      {/* ================= TOPIC BAND ================= */}
      <section className="wrap mt-10" aria-label="Topics">
        <div className="flex flex-wrap items-center gap-3 rounded-card border border-line p-4">
          <span className="font-display text-[13px] tracking-[0.1em]">TOPICS</span>
          {TOPICS.map((t) => (
            <Link key={t.slug} href={`/topics/${t.slug}/`} className="inline-flex min-h-[36px] items-center rounded-full border border-line px-4 text-[13px] font-bold hover:border-ink">{t.name} <span className="num ml-1.5 text-grey">{byTopic(t.slug).length}</span></Link>
          ))}
          <Link href="/topics/" className="ml-auto text-[12px] font-extrabold tracking-[0.06em] text-red-text">ALL TOPICS →</Link>
        </div>
      </section>

      {/* ================= MARKET INSIGHTS | BUYING GUIDES ================= */}
      <section className="wrap mt-12">
        <div className="grid gap-12 lg:grid-cols-2">
          <div>
            <SectionHead title="Market Insights" more="All" moreHref="/market-insights/" />
            <div className="mt-5">
              <ArticleCard a={mi[0]} showDek />
              <div className="mt-4">
                {mi.slice(1, 5).map((a) => (
                  <ArticleRow key={a.slug} a={a} size="sm" thumb={false} />
                ))}
              </div>
              {sponsoredFor("technical_guides") && <SponsoredCard a={sponsoredFor("technical_guides")!} className="mt-4" />}
            </div>
          </div>
          <div>
            <SectionHead title="Buying Guides" more="All" moreHref="/buying-guides/" />
            <div className="mt-5">
              <ArticleCard a={bg[0]} showDek />
              <div className="mt-4">
                {bg.slice(1, 5).map((a) => (
                  <ArticleRow key={a.slug} a={a} size="sm" thumb={false} />
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ================= DIRECTORY ================= */}
      <section className="mt-12 border-t border-line bg-paper">
        <div className="wrap grid gap-10 py-11 lg:grid-cols-[1fr_1.4fr]">
          <div>
            <SectionHead title="Company Directory" more="Browse" moreHref="/directory/" />
            <p className="mt-3 text-[15px] font-medium leading-[1.6] text-slate">Manufacturers, fabricators, distributors, machinery makers and test labs, classified by editors. Listing and order are never paid for.</p>
            <div className="num mt-5 flex gap-6 text-[13px] font-bold text-slate">
              <span><b className="font-display text-[26px] text-fg">{COMPANIES.length}</b> companies</span>
              <span><b className="font-display text-[26px] text-fg">{COMPANIES.filter((c) => c.claimed).length}</b> claimed</span>
              <span><b className="font-display text-[26px] text-fg">{new Set(COMPANIES.map((c) => c.country)).size}</b> countries</span>
            </div>
            <div className="mt-5 flex flex-wrap gap-2">
              {CATEGORY.map((c) => (
                <Link key={c.code} href={`/directory/?category=${c.code}`} className="inline-flex min-h-[38px] items-center rounded-full border border-line bg-bg px-4 text-[13px] font-bold hover:border-ink">{c.labelEn}</Link>
              ))}
            </div>
            <Link href="/directory/#claim" className="mt-5 inline-block text-[12.5px] font-extrabold tracking-[0.06em] text-red-text">IS YOUR COMPANY LISTED? CLAIM IT →</Link>
          </div>
          <div>
            <div className="mb-3 flex items-center gap-3"><span className="font-display text-[12px] tracking-[0.1em] text-grey">RECENTLY UPDATED</span><span className="meta text-[11.5px]">Natural listings · unrelated to any payment</span></div>
            <div className="grid gap-3 sm:grid-cols-2">
              {dir.map((c) => (
                <Link key={c.slug} href={`/directory/${c.slug}/`} className="group flex gap-3 rounded-card border border-line bg-bg p-4 hover:border-ink">
                  <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg border border-line bg-paper text-[12px] font-extrabold text-slate">{COUNTRY_BY_CODE[c.country]?.alpha2}</span>
                  <span className="min-w-0">
                    <span className="flex items-center gap-2"><span className="font-display truncate text-[15.5px] group-hover:text-red-text">{c.name}</span>{c.claimed && <Badge tone="current" size="sm">Claimed</Badge>}</span>
                    <span className="meta block truncate text-[12px]">{c.orgType.replace(/_/g, " ")} · {c.city}, {COUNTRY_BY_CODE[c.country]?.name}</span>
                    <span className="mt-1.5 flex flex-wrap gap-1">{c.categories.slice(0, 2).map((k) => <span key={k} className="rounded-md bg-paper px-2 py-0.5 text-[10.5px] font-bold text-fg-3">{CATEGORY.find((x) => x.code === k)?.labelEn}</span>)}</span>
                  </span>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>

      <AdBand />

      {/* ================= SUBSCRIBE ================= */}
      <section className="wrap mt-12">
        <div className="relative overflow-hidden rounded-card-lg bg-dark p-8 text-white md:p-10">
          <MeshBg id="weldQ" color="#FFFFFF" opacity={0.1} />
          <div className="relative grid gap-6 md:grid-cols-[1.2fr_1fr] md:items-center">
            <div>
              <Kicker tone="on-dark">The weekly brief</Kicker>
              <h2 className="font-display mt-2 text-[30px] leading-[1.08]">Everything that moved in wire mesh this week, in one email.</h2>
              <p className="mt-3 text-[14px] font-medium text-grey-3">News, prices and standards changes every Monday. Free, and you can unsubscribe in one click.</p>
            </div>
            <NewsletterForm tone="dark" />
          </div>
        </div>
      </section>

      {/* ================= PARTNER STRIP ================= */}
      <section className="wrap mt-8" aria-label="Partners">
        <div className="flex flex-wrap items-center gap-6 border-t border-line pt-5">
          <span className="text-[9.5px] font-extrabold tracking-[0.14em] text-grey">PARTNERS · PAID PLACEMENT</span>
          {[1, 2, 3, 4, 5].map((i) => (
            <span key={i} className="inline-flex h-9 w-[110px] items-center justify-center rounded border border-dashed border-line-2 text-[9.5px] font-extrabold tracking-[0.1em] text-grey">PARTNER {i}</span>
          ))}
          <ButtonLink href="/advertise/" variant="ghost" size="sm" className="ml-auto text-[12px] tracking-[0.06em] text-red-text">BECOME A PARTNER →</ButtonLink>
        </div>
      </section>
    </Shell>
  );
}

function AppIcon({ code }: { code: string }) {
  const p: Record<string, React.ReactNode> = {
    architecture: <path d="M3 21h18M5 21V8l7-4 7 4v13M9 21v-6h6v6M9 11h.01M15 11h.01" />,
    industrial_security: <path d="M12 3 4.5 6v5.5c0 4.4 3.1 8 7.5 9 4.4-1 7.5-4.6 7.5-9V6zM9 12l2 2 4-4" />,
    agriculture: <path d="M3 20h18M6 20V9l6-5 6 5v11M4 13h16M9 20v-5h6v5" />,
    energy_environment: <path d="M4 18h16M6 18l2-8h8l2 8M8 10l-1-4h10l-1 4M12 2v2" />,
    sports_lifestyle: <path d="M4 20V6h16v14M4 13h16M12 6v14M8 6v14M16 6v14" />,
  };
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      {p[code] ?? <circle cx="12" cy="12" r="8" />}
    </svg>
  );
}

export const metadata = { title: { absolute: "Wire Mesh News — Independent news, markets and standards for the global wire mesh industry" } };
