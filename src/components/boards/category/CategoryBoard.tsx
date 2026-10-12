/* Ported 1:1 from canvas board Category-B. Markup + inline styles are the board's; data from src/lib/content. */
import Link from "next/link";
import { Shell } from "@/components/shell/Shell";
import { CategoryList, type ListItem } from "./CategoryList";
import { SectionNewsletter } from "./SectionNewsletter";
import { bySection, bySubsection, featured, mostRead, sponsoredFor, seriesParts } from "@/lib/content/articles";
import { STANDARDS } from "@/lib/content/standards";
import { STANDARD_SUBJECT_BY_CODE } from "@/data/vocab/standard_subject";
import { getAuthor } from "@/lib/content/people";
import { SECTION_INTRO, articleHref, fmtDate, fmtDateShort, subsectionLabel } from "@/lib/site";
import type { Article, SectionCode } from "@/lib/content/types";
import "@/styles/board-cat.css";
import { demoBg } from "@/lib/demo";
import { initials } from "@/lib/initials";

type Sub = { code: string; label: string; slug: string };

const EDITOR_NOTE: Record<SectionCode, [string, string]> = {
  technical_guides: ["mei-lin", "This month we are working through coatings from specification to site acceptance — the three-part series is the place to start. Letters correcting us on measurement location have already improved two articles."],
  market_insights: ["daniel-obi", "Trade measures dominate the quarter. The EU definitive duty landed early; the US derivatives list is next. Market data stays on a single page with its methodology one click away."],
  news: ["mei-lin", "Project case studies get priority this quarter: the acceptance-testing detail that nearly failed an airport fence is the kind of story only a named source can tell."],
  applications: ["hanna-kraus", "Scenarios, not products: each application field is written for the person who has to specify for that site, starting with what the site does to the mesh."],
  buying_guides: ["tomas-reyes", "Editorial, never sales: these guides are written for buyers and audited against our own RFQ checklist. We publish the checklist too."],
};
const NOUN: Record<SectionCode, string> = { technical_guides: "guides", market_insights: "insights", news: "stories", applications: "articles", buying_guides: "guides" };
const EMAIL_CARD: Record<SectionCode, [string, string]> = {
  technical_guides: ["Guides by email", "Only the Technical Guides section, two emails a month."],
  market_insights: ["Markets by email", "Only Market Insights: prices, trade measures and demand, weekly."],
  news: ["News by email", "Only the News section, once a week."],
  applications: ["Applications by email", "New application articles as they publish, at most twice a month."],
  buying_guides: ["Buying guides by email", "Only Buying Guides, two emails a month."],
};

const toItem = (a: Article, views: number): ListItem => ({ slug: a.slug, href: articleHref(a), kicker: subsectionLabel(a.section, a.subsection).toUpperCase(), title: a.title, dek: a.dek, date: fmtDateShort(a.date), iso: a.date, readMin: a.readMin, author: getAuthor(a.author)?.name ?? "", views, pick: !!a.featured, sponsor: a.sponsor });

export function CategoryBoard({ section, subs, activeSub }: { section: { code: string; label: string; slug: string }; subs: Sub[]; activeSub?: Sub }) {
  const code = section.code as SectionCode;
  const sectionAll = bySection(code).filter((a) => a.type !== "sponsored");
  const all = (activeSub ? bySubsection(code, activeSub.code) : sectionAll).filter((a) => a.type !== "sponsored");
  const pick = featured().find((a) => a.section === code && (!activeSub || a.subsection === activeSub.code)) ?? all[0];
  const list = all.filter((a) => a.slug !== pick?.slug);
  const sponsored = sponsoredFor(code);
  const intro = SECTION_INTRO[code];
  const stds = STANDARDS.filter((s) => all.some((a) => a.standards?.includes(s.no))).slice(0, 5);
  const seriesSlug = list.find((a) => a.series)?.series?.slug;
  const parts = seriesSlug ? seriesParts(seriesSlug) : [];
  const [editorSlug, note] = EDITOR_NOTE[code];
  const editor = getAuthor(editorSlug)!;
  const top = mostRead(5).filter((a) => a.section === code).concat(all).filter((a, i, arr) => arr.indexOf(a) === i).slice(0, 3);
  const views = (a: Article) => Math.max(0, 5 - mostRead(5).indexOf(a)) * 1000 + a.readMin;
  const title = activeSub ? activeSub.label : section.label;
  const [cardTitle, cardText] = EMAIL_CARD[code];
  const noun = NOUN[code];

  return (
    <Shell header="compact" active={code} board="b-cat">
{/* 栏目头：深色 + 纹理 */}
<section style={{ background: "var(--surface-dark)", color: "#FFFFFF", position: "relative", overflow: "hidden" }}>
<svg style={{ position: "absolute", inset: "0", width: "100%", height: "100%", color: "var(--mesh-dark)" }} aria-hidden="true"><rect width="100%" height="100%" fill="url(#mp)" /></svg>
<svg width="560" height="560" viewBox="0 0 120 120" style={{ position: "absolute", right: "-100px", top: "-130px", color: "#1A1B23" }} aria-hidden="true"><use href="#w2" width="120" height="120" /></svg>
<div style={{ position: "relative", paddingTop: "38px", paddingBottom: "34px" }} className="wrap">
<nav aria-label="Breadcrumb" style={{ fontSize: "12.5px", fontWeight: "500", color: "var(--grey-2)", marginBottom: "18px" }}><Link href="/" style={{ color: "var(--grey-2)" }}>Home</Link> / {activeSub ? <><Link href={`/${section.slug}/`} style={{ color: "var(--grey-2)" }}>{section.label}</Link> / </> : null}<span style={{ color: "#FFFFFF", fontWeight: "800" }}>{title}</span></nav>
<div style={{ display: "grid", gridTemplateColumns: "1.5fr 1fr", gap: "48px", alignItems: "end" }} className="cols">
<div>
<h1 style={{ margin: "0 0 14px", fontSize: "56px", letterSpacing: "-.055em", color: "#FFFFFF", lineHeight: ".98" }} className="h heroh">{title}<span style={{ color: "var(--red-text)" }}>.</span></h1>
<p style={{ margin: "0", fontSize: "17px", fontWeight: "500", lineHeight: "1.6", color: "#B9BCC6", maxWidth: "620px" }}>{intro.intro}</p>
</div>
<div style={{ display: "flex", gap: "32px", flexWrap: "wrap", justifyContent: "flex-end" }}>
<div><div style={{ fontSize: "34px", color: "#FFFFFF" }} className="mono h">{all.length}</div><div style={{ color: "var(--grey-5)", fontSize: "11.5px", fontWeight: "800", letterSpacing: ".1em" }} className="meta">ARTICLES</div></div>
<div><div style={{ fontSize: "34px", color: "#FFFFFF" }} className="mono h">{subs.length}</div><div style={{ color: "var(--grey-5)", fontSize: "11.5px", fontWeight: "800", letterSpacing: ".1em" }} className="meta">SUB-SECTIONS</div></div>
<Link href={`/subscribe/?section=${section.slug}`} style={{ alignSelf: "center", display: "inline-flex", alignItems: "center", gap: "8px", border: "2px solid #FFFFFF", color: "#FFFFFF", fontWeight: "800", fontSize: "14px", padding: "0 20px", minHeight: "48px", borderRadius: "999px" }}><svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" aria-hidden="true"><path d="M4 11a9 9 0 0 1 9 9M4 4a16 16 0 0 1 16 16" /><circle cx="5" cy="19" r="1.6" fill="currentColor" stroke="none" /></svg>Follow</Link>
</div>
</div>
</div>
</section>
{/* 二级栏目瓦片 */}
<section style={{ paddingTop: "26px", paddingBottom: "30px" }} className="wrap">
<div style={{ display: "grid", gridTemplateColumns: `repeat(${subs.length + 1}, 1fr)`, gap: "12px" }} className="g6">
<Link href={`/${section.slug}/`} className={`sub${activeSub ? "" : " on"}`}><span className="n">All {noun}</span><span className="c">{sectionAll.length}</span></Link>
{subs.map((s) => (
<Link key={s.code} href={`/${section.slug}/${s.slug}/`} className={`sub${activeSub?.code === s.code ? " on" : ""}`}><span className="n">{s.label}</span><span className="c">{bySubsection(code, s.code).filter((a) => a.type !== "sponsored").length}</span></Link>
))}
</div>
</section>
{/* 编辑精选：大图左右 */}
{pick && (
<section style={{ paddingBottom: "34px" }} className="wrap">
<div style={{ display: "grid", gridTemplateColumns: "1.45fr 1fr", gap: "36px", alignItems: "center" }} className="cols lead">
<div style={{ position: "relative" }}>
<div style={{ aspectRatio: "16/9", ...demoBg(pick.slug) }} className="ph"></div>
<span style={{ position: "absolute", left: "18px", top: "18px", background: "var(--red)", color: "#FFFFFF", fontSize: "10px", fontWeight: "800", letterSpacing: ".16em", padding: "6px 13px", borderRadius: "999px" }}>EDITORS&#8217; PICK</span>
</div>
<div style={{ display: "flex", flexDirection: "column", gap: "13px" }}>
<span className="kick"><i></i>{subsectionLabel(pick.section, pick.subsection).toUpperCase()}</span>
<Link href={articleHref(pick)} style={{ fontSize: "36px", letterSpacing: "-.05em" }} className="h">{pick.title}</Link>
<p style={{ margin: "0", fontSize: "15.5px", fontWeight: "500", lineHeight: "1.6", color: "var(--slate)" }}>{pick.dek}</p>
<span className="meta">By {getAuthor(pick.author)?.name} &#183; {fmtDate(pick.date)} &#183; {pick.readMin} min read</span>
</div>
</div>
</section>
)}
{/* 编辑的话 */}
<section style={{ paddingBottom: "36px" }} className="wrap">
<div style={{ background: "var(--paper)", borderLeft: "5px solid var(--red)", borderRadius: "0 14px 14px 0", padding: "22px 26px", display: "flex", gap: "20px", alignItems: "flex-start", flexWrap: "wrap" }}>
<span style={{ width: "46px", height: "46px", borderRadius: "999px", background: "var(--ink)", color: "var(--on-ink)", flexShrink: "0", display: "inline-flex", alignItems: "center", justifyContent: "center", fontSize: "14px", fontWeight: 800, letterSpacing: "-.02em" }}>{initials(editor.name)}</span>
<div style={{ flex: "1 1 420px" }}>
<div style={{ fontSize: "10.5px", fontWeight: "800", letterSpacing: ".14em", color: "var(--slate)", marginBottom: "7px" }}>FROM THE EDITOR</div>
<p style={{ margin: "0 0 7px", fontSize: "15.5px", fontWeight: "500", lineHeight: "1.6" }}>{note}</p>
<span className="meta"><Link href={`/authors/${editor.slug}/`}>{editor.name}</Link> &#183; Updated {fmtDate("2026-10-10")}</span>
</div>
</div>
</section>
{/* 列表 + 侧栏 */}
<section style={{ paddingBottom: "50px" }} className="wrap">
<div style={{ display: "grid", gridTemplateColumns: "minmax(0,1fr) 318px", gap: "50px", alignItems: "start" }} className="cols">
<div>
<CategoryList heading={activeSub ? activeSub.label : `All ${noun}`} items={list.map((a) => toItem(a, views(a)))} sponsored={sponsored ? toItem(sponsored, 0) : undefined} series={parts.length ? { title: parts[0].series!.slug === "coatings-from-spec-to-site" ? "Coatings, from spec to site" : parts[0].title, href: articleHref(parts[0]), parts: parts.map((p) => ({ n: p.series!.part, title: p.title, href: articleHref(p) })) } : undefined} />
</div>
<aside style={{ display: "flex", flexDirection: "column", gap: "22px" }}>
<div style={{ background: "var(--red)", color: "#FFFFFF", borderRadius: "16px", padding: "24px", position: "relative", overflow: "hidden" }}>
<svg style={{ position: "absolute", inset: "0", width: "100%", height: "100%", color: "#D01F29" }} aria-hidden="true"><rect width="100%" height="100%" fill="url(#mp)" /></svg>
<div style={{ position: "relative" }}>
<div style={{ fontSize: "21px", color: "#FFFFFF", marginBottom: "8px" }} className="h">{cardTitle}</div>
<p style={{ margin: "0 0 14px", fontSize: "13.5px", fontWeight: "500", lineHeight: "1.55" }}>{cardText}</p>
<SectionNewsletter id={`nl-${section.slug}`} />
</div>
</div>
<div style={{ border: "1px solid var(--line)", borderRadius: "16px", padding: "22px" }}>
<div style={{ fontSize: "17px", marginBottom: "14px" }} className="h">MOST READ HERE</div>
{top.map((a, i) => (
<Link key={a.slug} href={articleHref(a)} style={{ display: "flex", gap: "12px", paddingBottom: i < top.length - 1 ? "12px" : undefined, borderBottom: i < top.length - 1 ? "1px solid var(--line)" : undefined, marginBottom: i < top.length - 1 ? "12px" : undefined }}><span style={{ fontSize: "13px", color: "var(--red-text)", flexShrink: "0" }} className="h">{String(i + 1).padStart(2, "0")}</span><span style={{ fontSize: "14px", fontWeight: "700", lineHeight: "1.35" }}>{a.title}</span></Link>
))}
</div>
{stds.length > 0 && (
<div style={{ border: "1px solid var(--line)", borderRadius: "16px", padding: "22px" }}>
<div style={{ fontSize: "17px", marginBottom: "12px" }} className="h">STANDARDS IN THIS SECTION</div>
{stds.map((s) => (
<Link key={s.no} href={`/standards/${s.slug}/`} style={{ display: "flex", alignItems: "center", gap: "10px", padding: "9px 0", borderTop: "1px solid var(--line)" }}><span style={{ fontSize: "12px", fontWeight: "800", flex: "0 0 84px" }} className="mono">{s.no}</span><span style={{ fontSize: "13px", fontWeight: "500", flex: "1 1 auto" }}>{STANDARD_SUBJECT_BY_CODE[s.subject]?.labelEn ?? s.subject}</span></Link>
))}
</div>
)}
<div style={{ border: "2px solid var(--ink)", borderRadius: "16px", padding: "22px" }}>
<div style={{ fontSize: "17px", marginBottom: "9px" }} className="h">Know this subject?</div>
<p style={{ margin: "0 0 13px", fontSize: "13.5px", fontWeight: "500", lineHeight: "1.6", color: "var(--slate)" }}>This section runs on first-hand experience. Articles are published after editorial review, under your real name.</p>
<Link href="/submit/" style={{ background: "var(--ink)", color: "var(--on-ink)", fontWeight: "800", fontSize: "13.5px", padding: "0 20px", minHeight: "44px", borderRadius: "999px", display: "inline-flex", alignItems: "center" }}>Submit an article</Link>
</div>
<div><div style={{ marginBottom: "7px" }} className="adtag">ADVERTISEMENT</div><div style={{ aspectRatio: "6/5" }} className="ad">[ 300 &#215; 250 ]</div></div>
<div className="sticky" style={{ marginTop: "18px" }}><div style={{ marginBottom: "7px" }} className="adtag">ADVERTISEMENT</div><div style={{ height: "600px" }} className="ad">[ 300 &#215; 600 ]</div></div>
</aside>
</div>
</section>
<div style={{ height: "4px", background: "var(--red)" }}></div>
{/* 横幅广告 ②：页脚之前 */}
<section style={{ background: "var(--paper)", borderTop: "1px solid var(--line-soft)", borderBottom: "1px solid var(--line-soft)" }}>
<div style={{ paddingTop: "22px", paddingBottom: "22px" }} className="wrap">
<div style={{ marginBottom: "8px", justifyContent: "center", display: "flex" }} className="adtag">ADVERTISEMENT</div>
<div style={{ height: "120px", maxWidth: "970px", margin: "0 auto", background: "var(--card)" }} className="ad">[ 970 &#215; 120 ]</div>
</div>
</section>
    </Shell>
  );
}
