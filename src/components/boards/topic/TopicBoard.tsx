/* Ported 1:1 from canvas board Topic-L. */
import Link from "next/link";
import { Shell } from "@/components/shell/Shell";
import { SectionNewsletter } from "@/components/boards/category/SectionNewsletter";
import { TOPICS } from "@/lib/content/market";
import { getArticle, byTopic } from "@/lib/content/articles";
import { getAuthor } from "@/lib/content/people";
import { getCompany } from "@/lib/content/directory";
import { sectionByCode, subsectionLabel, articleHref, fmtDate } from "@/lib/site";
import type { Topic } from "@/lib/content/types";
import "@/styles/board-top.css";
import { demoBg } from "@/lib/demo";

export function TopicBoard({ t }: { t: Topic }) {
  const start = t.startHere.map((s) => getArticle(s)).filter(Boolean);
  const all = byTopic(t.slug);
  const news = all.filter((a) => a.section === "news" || a.section === "market_insights").filter((a) => !t.startHere.includes(a.slug)).slice(0, 3);
  const further = all.filter((a) => !t.startHere.includes(a.slug) && !news.includes(a)).slice(0, 3);
  const otherTopics = TOPICS.filter((x) => x.slug !== t.slug).slice(0, 1);
  const curator = getAuthor(t.curator);
  const cos = t.companies.map((c) => getCompany(c)).filter(Boolean);
  const sponsor = t.sponsor ? getCompany(t.sponsor) : undefined;
  return (
    <Shell header="compact" board="b-top">
{/* 专题头 */}
<section style={{ background: "var(--surface-dark)", color: "#FFFFFF", position: "relative", overflow: "hidden" }}>
<svg width="560" height="560" viewBox="0 0 120 120" style={{ position: "absolute", right: "-70px", top: "-110px", color: "var(--mesh-dark)" }} aria-hidden="true"><use href="#w2" width="120" height="120" /></svg>
<div style={{ position: "relative", paddingTop: "44px", paddingBottom: "44px" }} className="wrap">
<nav aria-label="Breadcrumb" style={{ fontSize: "12.5px", fontWeight: "500", color: "var(--grey-2)", marginBottom: "16px" }}><Link href="/" style={{ color: "var(--grey-2)" }}>Home</Link> / <Link href="/topics/" style={{ color: "var(--grey-2)" }}>Topics</Link> / <span style={{ color: "#FFFFFF", fontWeight: "800" }}>{t.name}</span></nav>
<div style={{ display: "grid", gridTemplateColumns: "1.5fr 1fr", gap: "44px", alignItems: "end" }} className="cols">
<div>
<span style={{ background: "var(--red)", color: "#FFFFFF", fontSize: "11px", fontWeight: "800", letterSpacing: ".14em", padding: "6px 13px", borderRadius: "999px", display: "inline-block", marginBottom: "16px" }}>TOPIC</span>
<h1 style={{ margin: "0 0 16px", fontSize: "54px", letterSpacing: "-.05em", lineHeight: "1.02", color: "#FFFFFF" }} className="h heroh">{t.title}</h1>
<p style={{ margin: "0 0 20px", fontSize: "17.5px", fontWeight: "500", lineHeight: "1.6", color: "var(--on-dark-2)", maxWidth: "620px" }}>{t.intro}</p>
<div style={{ display: "flex", gap: "22px", flexWrap: "wrap", fontSize: "13.5px", fontWeight: "700", color: "var(--grey-3)" }}>
<span>{all.length} articles</span><span>·</span><span>Updated {fmtDate(t.updated)}</span><span>·</span><span>Curated by {curator ? <Link href={`/authors/${curator.slug}/`} style={{ color: "#FFFFFF", textDecoration: "underline", textUnderlineOffset: "3px" }}>{curator.name}</Link> : "the editors"}</span>
</div>
</div>
<div style={{ background: "var(--surface-dark-2)", borderRadius: "16px", padding: "24px" }}>
<div style={{ fontSize: "11.5px", fontWeight: "800", letterSpacing: ".12em", color: "var(--grey-2)", marginBottom: "13px" }}>IN THIS TOPIC</div>
<div style={{ display: "flex", flexDirection: "column", gap: "10px", fontSize: "14.5px", fontWeight: "700" }}>
{t.outline.map((o, i) => <a key={o} href={`#step-${i + 1}`} style={{ color: "#FFFFFF" }}>{i + 1} · {o}</a>)}
</div>
</div>
</div>
</div>
</section>
{/* 赞助标识带 */}
{sponsor && (
<div style={{ background: "var(--paper)", borderBottom: "1px solid var(--line)" }}>
<div style={{ paddingTop: "14px", paddingBottom: "14px", display: "flex", alignItems: "center", gap: "14px", flexWrap: "wrap" }} className="wrap">
<span style={{ background: "var(--ink)", color: "var(--on-ink)", fontSize: "10px", fontWeight: "800", letterSpacing: ".14em", padding: "5px 10px", borderRadius: "4px" }}>TOPIC SPONSOR</span>
<span style={{ width: "32px", height: "32px", borderRadius: "7px", background: "var(--line)" }}></span>
<span style={{ fontSize: "14px", fontWeight: "800" }}>{sponsor.name}</span>
<span style={{ fontSize: "13px" }} className="meta">Sponsors this topic&#8217;s display slot. The editorial content inside the topic is reported independently and is not decided by the sponsor.</span>
<Link href="/policies/advertising-disclosure/" style={{ marginLeft: "auto" }} className="more">ABOUT SPONSORSHIP →</Link>
</div>
</div>
)}
{/* 重点指南：按顺序 */}
<section style={{ paddingTop: "44px", paddingBottom: "40px" }} className="wrap">
<div style={{ display: "grid", gridTemplateColumns: "minmax(0,1fr) 320px", gap: "48px", alignItems: "start" }} className="cols">
<div>
<div className="sechd"><h2 style={{ margin: "0", fontSize: "26px" }} className="h">Start here</h2><span className="meta">In decision order</span></div>
{start.map((a, i) => (
<div key={a!.slug} id={`step-${i + 1}`} className="step" style={i === start.length - 1 ? { borderBottom: "0" } : undefined}>
<span className="stepn">{i + 1}</span>
<div style={{ flex: "1 1 auto", display: "flex", gap: "18px", minWidth: "0" }}>
<div style={{ display: "flex", flexDirection: "column", gap: "7px", minWidth: "0", flex: "1 1 auto" }}>
<span className="kicker"><i></i>{sectionByCode(a!.section)?.label.toUpperCase()} · {subsectionLabel(a!.section, a!.subsection).split(" & ")[0].toUpperCase()}</span>
<Link href={articleHref(a!)} style={{ fontSize: "21px" }} className="h">{a!.title}</Link>
<span style={{ fontSize: "14px", fontWeight: "500", lineHeight: "1.55", color: "var(--slate)" }}>{a!.dek}</span>
<span className="meta">{a!.readMin} min read</span>
</div>
<Link href={articleHref(a!)} style={{ width: "160px", flexShrink: "0", aspectRatio: "4/3", ...demoBg(a!.slug) }} className="thumb" aria-hidden="true" tabIndex={-1}></Link>
</div>
</div>
))}
</div>
<aside style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
<div style={{ background: "var(--surface-dark)", color: "#FFFFFF", borderRadius: "16px", padding: "24px" }}>
<div style={{ fontSize: "20px", marginBottom: "8px" }} className="h">Follow this topic</div>
<p style={{ margin: "0 0 14px", fontSize: "13.5px", fontWeight: "500", lineHeight: "1.55", color: "var(--on-dark-2)" }}>An email when the topic is updated, at most once a month.</p>
<SectionNewsletter id={`tp-${t.slug}`} button="red" />
</div>
{t.terms.length > 0 && (
<div style={{ border: "1px solid var(--line)", borderRadius: "16px", padding: "22px" }}>
<div style={{ fontSize: "18px", marginBottom: "12px" }} className="h">Key terms</div>
<div style={{ display: "flex", flexDirection: "column", gap: "13px", fontSize: "13.5px", fontWeight: "500", lineHeight: "1.5" }}>
{t.terms.map((x) => <div key={x.term}><b style={{ fontSize: "14.5px", display: "block", marginBottom: "2px" }}>{x.term}</b>{x.def}</div>)}
</div>
</div>
)}
{cos.length > 0 && (
<div style={{ border: "1px solid var(--line)", borderRadius: "16px", padding: "22px" }}>
<div style={{ fontSize: "18px", marginBottom: "12px" }} className="h">Companies in this topic</div>
<div style={{ display: "flex", flexDirection: "column", gap: "11px", fontSize: "14px", fontWeight: "700" }}>
{cos.map((c) => <Link key={c!.slug} href={`/directory/${c!.slug}/`} style={{ display: "flex", alignItems: "center", gap: "10px" }}><span style={{ width: "30px", height: "30px", borderRadius: "7px", background: "var(--line)", flexShrink: "0" }}></span>{c!.name}</Link>)}
</div>
<Link href="/directory/" style={{ display: "inline-block", marginTop: "12px" }} className="more">DIRECTORY →</Link>
</div>
)}
</aside>
</div>
</section>
{/* 相关新闻 */}
{news.length > 0 && (
<section style={{ background: "var(--paper)", padding: "44px 0" }}>
<div className="wrap">
<div style={{ borderColor: "var(--ink)" }} className="sechd"><h2 style={{ margin: "0", fontSize: "26px" }} className="h">Related news</h2><Link href={`/search/?q=${encodeURIComponent(t.name)}`} className="more">ALL NEWS IN THIS TOPIC →</Link></div>
<div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "24px" }} className="cols">
{news.map((a) => <article key={a.slug} style={{ background: "var(--card)", borderRadius: "14px", padding: "20px", display: "flex", flexDirection: "column", gap: "9px" }}><span className="kicker"><i></i>{subsectionLabel(a.section, a.subsection).toUpperCase()}</span><Link href={articleHref(a)} style={{ fontSize: "19px" }} className="h">{a.title}</Link><span className="meta">{fmtDate(a.date)}</span></article>)}
</div>
</div>
</section>
)}
{/* 延伸阅读 */}
<section style={{ paddingTop: "44px", paddingBottom: "48px" }} className="wrap">
<div className="sechd"><h2 style={{ margin: "0", fontSize: "26px" }} className="h">Further reading</h2></div>
<div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: "20px 40px" }} className="cols">
{further.map((a) => <Link key={a.slug} href={articleHref(a)} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: "16px", padding: "16px 0", borderBottom: "1px solid var(--line)" }}><span style={{ display: "flex", flexDirection: "column", gap: "4px" }}><span className="kicker"><i></i>{sectionByCode(a.section)?.label.toUpperCase()}</span><span style={{ fontSize: "17px" }} className="h">{a.title}</span></span><span style={{ color: "var(--red-text)", fontWeight: "800", flexShrink: "0" }}>→</span></Link>)}
{otherTopics.map((x) => <Link key={x.slug} href={`/topics/${x.slug}/`} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: "16px", padding: "16px 0", borderBottom: "1px solid var(--line)" }}><span style={{ display: "flex", flexDirection: "column", gap: "4px" }}><span className="kicker"><i></i>TOPIC</span><span style={{ fontSize: "17px" }} className="h">{x.title}</span></span><span style={{ color: "var(--red-text)", fontWeight: "800", flexShrink: "0" }}>→</span></Link>)}
</div>
</section>
<div style={{ height: "4px", background: "var(--red)" }}></div>
    </Shell>
  );
}

/* Topics index: no dedicated board; uses the Topic-L head style with one card per topic. */
export function TopicsIndexBoard() {
  return (
    <Shell header="compact" board="b-top">
<section style={{ background: "var(--surface-dark)", color: "#FFFFFF", position: "relative", overflow: "hidden" }}>
<svg width="560" height="560" viewBox="0 0 120 120" style={{ position: "absolute", right: "-70px", top: "-110px", color: "var(--mesh-dark)" }} aria-hidden="true"><use href="#w2" width="120" height="120" /></svg>
<div style={{ position: "relative", paddingTop: "44px", paddingBottom: "44px" }} className="wrap">
<nav aria-label="Breadcrumb" style={{ fontSize: "12.5px", fontWeight: "500", color: "var(--grey-2)", marginBottom: "16px" }}><Link href="/" style={{ color: "var(--grey-2)" }}>Home</Link> / <span style={{ color: "#FFFFFF", fontWeight: "800" }}>Topics</span></nav>
<h1 style={{ margin: "0 0 16px", fontSize: "54px", letterSpacing: "-.05em", lineHeight: "1.02", color: "#FFFFFF", maxWidth: "720px" }} className="h heroh">Topics<span style={{ color: "var(--red-text)" }}>.</span></h1>
<p style={{ margin: "0", fontSize: "17.5px", fontWeight: "500", lineHeight: "1.6", color: "var(--on-dark-2)", maxWidth: "620px" }}>Curated reading paths that string articles from across the sections into the order a real decision is made.</p>
</div>
</section>
<section style={{ paddingTop: "44px", paddingBottom: "48px" }} className="wrap">
<div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: "20px" }} className="cols">
{TOPICS.map((t) => (
<Link key={t.slug} href={`/topics/${t.slug}/`} style={{ border: "1px solid var(--line)", borderRadius: "16px", padding: "24px", display: "flex", flexDirection: "column", gap: "10px" }}>
<span style={{ background: "var(--red)", color: "#FFFFFF", fontSize: "10px", fontWeight: "800", letterSpacing: ".14em", padding: "5px 10px", borderRadius: "999px", alignSelf: "flex-start" }}>TOPIC</span>
<span style={{ fontSize: "24px" }} className="h">{t.title}</span>
<span style={{ fontSize: "14px", fontWeight: 500, lineHeight: 1.6, color: "var(--slate)" }}>{t.intro.split(". ")[0]}.</span>
<span className="meta" style={{ marginTop: "auto" }}>{byTopic(t.slug).length} articles · Updated {fmtDate(t.updated)}</span>
</Link>
))}
</div>
</section>
    </Shell>
  );
}
