/* Home — 1:1 port of canvas board Home-A, data from src/lib/content. Section order matches the board. */
import { Shell } from "@/components/shell/Shell";
import { Hero } from "@/components/boards/home/Hero";
import { Gauge } from "@/components/boards/home/Gauge";
import { MarketSnapshot } from "@/components/boards/home/MarketSnapshot";
import { AdBand } from "@/components/boards/home/AdBand";
import { Latest, InNumbers } from "@/components/boards/home/Latest";
import { LettersBlock } from "@/components/boards/home/LettersBlock";
import { Applications } from "@/components/boards/home/Applications";
import { Guides } from "@/components/boards/home/Guides";
import { TopicBand } from "@/components/boards/home/TopicBand";
import { Feeds } from "@/components/boards/home/Feeds";
import { DirectoryBlock } from "@/components/boards/home/DirectoryBlock";
import { Subscribe } from "@/components/boards/home/Subscribe";
import { Partners } from "@/components/boards/home/Partners";
import { ARTICLES, heroSet, latest, bySection, mostRead, byTopic, editorial } from "@/lib/content/articles";
import { LETTERS, COLUMNS } from "@/lib/content/people";
import { COMPANIES, recentlyUpdated } from "@/lib/content/directory";
import { STANDARDS, recentStandardChanges } from "@/lib/content/source";
import { snapshotSeries, MARKET_LICENSED, TOPICS } from "@/lib/content/market";
import { industryFigures } from "@/lib/content/figures";
import { fmtDateShort } from "@/lib/site";

const TODAY = "2026-10-12";

export default function HomePage() {
  const [top, s1, s2] = heroSet();
  const heroSlugs = [top, s1, s2].map((a) => a.slug);
  const brief = latest(8, heroSlugs).slice(0, 4);
  const used = [...heroSlugs, ...brief.map((a) => a.slug)];
  const latestList = latest(12, used).filter(editorial).slice(0, 6);
  const guides = bySection("technical_guides").filter((a) => !used.includes(a.slug));
  const appsLatest = bySection("applications", 4);
  const appCounts = Object.fromEntries(["architecture", "industrial_security", "agriculture", "energy_environment", "sports_lifestyle"].map((c) => [c, ARTICLES.filter((a) => a.section === "applications" && a.subsection === c).length]));
  const mi = bySection("market_insights").filter((a) => !heroSlugs.includes(a.slug) && editorial(a)).slice(0, 5);
  const bg = bySection("buying_guides").filter(editorial).slice(0, 5);
  const sponsoredAll = ARTICLES.filter((a) => a.type === "sponsored");
  const sponsoredNews = sponsoredAll[0];
  const sponsoredMI = sponsoredAll[1];
  const sponsoredBG = sponsoredAll[2];

  const letters = [...LETTERS].sort((a, b) => (a.date < b.date ? 1 : -1));
  const freshLetters = new Date(TODAY).getTime() - new Date(letters[0]?.date ?? "2000-01-01").getTime() < 60 * 86400000;
  const monthCount = letters.filter((l) => l.date >= "2026-10-01").length;

  const topic = TOPICS[0];
  const topicCount = byTopic(topic.slug).length;

  const countries = new Set(COMPANIES.map((c) => c.country)).size;
  const byCategory = Object.fromEntries(["fencing", "reinforcement", "filtration", "access", "materials_services"].map((c) => [c, COMPANIES.filter((x) => x.categories.includes(c)).length]));
  const articleCounts = Object.fromEntries(COMPANIES.map((c) => [c.slug, ARTICLES.filter((a) => a.companies?.includes(c.slug)).length]));
  const updatedThisWeek = COMPANIES.filter((c) => c.updated >= "2026-10-06").length;

  const figures = industryFigures(TODAY);

  return (
    <Shell header="full" board="b-home">
      <Hero top={top} side={[s1, s2]} brief={brief} date={fmtDateShort(TODAY)} />
      <Gauge />
      {MARKET_LICENSED && <MarketSnapshot series={snapshotSeries()} />}
      <AdBand />
      <InNumbers figures={figures} />
      <Latest items={latestList} sponsored={sponsoredNews} changes={recentStandardChanges(3).map((c) => ({ no: c.no, slug: c.slug, text: c.text, status: c.status }))} mostRead={mostRead(3)} standardsCount={STANDARDS.length} />
      {freshLetters && <LettersBlock letters={letters} column={COLUMNS[0]} monthCount={monthCount} />}
      <Applications counts={appCounts} latest={appsLatest} />
      <Guides cards={guides.slice(0, 3)} list={guides.slice(3, 9)} />
      <AdBand />
      <TopicBand topic={topic} count={topicCount} />
      <Feeds left={{ title: "Market Insights", href: "/market-insights/", items: mi, sponsored: sponsoredMI }} right={{ title: "Buying Guides", href: "/buying-guides/", items: bg, sponsored: sponsoredBG }} />
      <DirectoryBlock companies={COMPANIES.length} countries={countries} claimed={COMPANIES.filter((c) => c.claimed).length} byCategory={byCategory} recent={recentlyUpdated(4)} articleCounts={articleCounts} updatedThisWeek={updatedThisWeek} />
      <AdBand />
      <Subscribe />
      <Partners />
    </Shell>
  );
}
