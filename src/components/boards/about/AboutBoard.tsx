/* Ported 1:1 from canvas board About-N. Operator disclosure lives here, on Privacy and on Terms only (V2.4 §5.1). */
import Link from "next/link";
import { Shell } from "@/components/shell/Shell";
import { AUTHORS } from "@/lib/content/people";
import { POLICIES } from "@/lib/content/policies";
import { SITE } from "@/lib/site";
import "@/styles/board-about.css";

const initials = (n: string) => n.split(/\s+/).map((x) => x[0]).join("").slice(0, 2).toUpperCase();

export function AboutBoard() {
  return (
    <Shell header="compact" board="b-about">
{/* 页头 */}
<section style={{ paddingTop: "40px", paddingBottom: "34px", borderBottom: "1px solid var(--line)" }} className="wrap">
<nav aria-label="Breadcrumb" style={{ fontSize: "12.5px", fontWeight: "500", color: "var(--slate)", marginBottom: "16px" }}><Link href="/" style={{ color: "var(--slate)" }}>Home</Link> / <span style={{ color: "var(--ink)", fontWeight: "800" }}>About</span></nav>
<div style={{ display: "grid", gridTemplateColumns: "1.4fr 1fr", gap: "48px", alignItems: "start" }} className="cols">
<div>
<h1 style={{ margin: "0 0 18px", fontSize: "54px", letterSpacing: "-.05em", lineHeight: "1.02" }} className="h">Industry media for people who specify, make and buy mesh<span style={{ color: "var(--red-text)" }}>.</span></h1>
<p style={{ margin: "0", fontSize: "19px", fontWeight: "500", lineHeight: "1.6", color: "var(--slate)" }}>Wire Mesh News reports on the wire mesh and metal mesh industry — news, markets, technology, applications and buying knowledge — for international buyers, engineers, contractors, distributors and the people who work in it.</p>
</div>
<div style={{ background: "var(--surface-dark)", color: "#FFFFFF", borderRadius: "16px", padding: "26px" }}>
<div style={{ fontSize: "11.5px", fontWeight: "800", letterSpacing: ".12em", color: "var(--grey-2)", marginBottom: "14px" }}>AT A GLANCE</div>
<div style={{ display: "flex", flexDirection: "column", gap: "13px", fontSize: "14.5px", fontWeight: "500" }}>
<div style={{ display: "flex", justifyContent: "space-between", gap: "14px" }}><span style={{ color: "var(--grey-3)" }}>Launched</span><b>{SITE.launched}</b></div>
<div style={{ display: "flex", justifyContent: "space-between", gap: "14px" }}><span style={{ color: "var(--grey-3)" }}>Language</span><b>English only</b></div>
<div style={{ display: "flex", justifyContent: "space-between", gap: "14px" }}><span style={{ color: "var(--grey-3)" }}>Region</span><b>{SITE.operator.region}</b></div>
<div style={{ display: "flex", justifyContent: "space-between", gap: "14px" }}><span style={{ color: "var(--grey-3)" }}>Operated by</span><b>{SITE.operator.legalName}</b></div>
<div style={{ display: "flex", justifyContent: "space-between", gap: "14px" }}><span style={{ color: "var(--grey-3)" }}>Contact</span><b>{SITE.email}</b></div>
</div>
</div>
</div>
</section>
{/* 正文 + 侧栏 */}
<section style={{ paddingTop: "40px", paddingBottom: "46px" }} className="wrap">
<div style={{ display: "grid", gridTemplateColumns: "minmax(0,1fr) 330px", gap: "52px", alignItems: "start" }} className="cols">
<div>
{/* 运营主体披露 */}
<div id="ownership" style={{ border: "2px solid var(--red)", borderRadius: "16px", padding: "26px 30px", marginBottom: "38px" }}>
<div style={{ display: "flex", alignItems: "center", gap: "11px", marginBottom: "14px", flexWrap: "wrap" }}>
<span style={{ background: "var(--red)", color: "#FFFFFF", fontSize: "10.5px", fontWeight: "800", letterSpacing: ".14em", padding: "5px 11px", borderRadius: "5px" }}>OWNERSHIP DISCLOSURE</span>
<span style={{ fontSize: "20px" }} className="h">Who runs this site</span>
</div>
<div style={{ fontSize: "16px" }} className="body">
<p style={{ fontSize: "16px", marginBottom: "14px" }}>Wire Mesh News is published and operated by <b>{SITE.operator.legalName}</b>, a manufacturer in the wire mesh and fencing industry. We think readers have a right to know that, so it is written here rather than buried in the terms.</p>
<p style={{ fontSize: "16px", marginBottom: "14px" }}>That raises an obvious question: can a publication run by a manufacturer cover the industry fairly? Our answer is to fix the rules in writing rather than rely on promises:</p>
<div style={{ display: "flex", flexDirection: "column", gap: "10px", fontSize: "15px", fontWeight: "500", lineHeight: "1.6" }}>
<div style={{ display: "flex", gap: "11px" }}><span style={{ color: "var(--red-text)", fontWeight: "800", flexShrink: "0" }}>·</span><span>Content involving Kingcats is published under <b>exactly the same</b> review standard as any other company&#8217;s, with no automatic right to publication.</span></div>
<div style={{ display: "flex", gap: "11px" }}><span style={{ color: "var(--red-text)", fontWeight: "800", flexShrink: "0" }}>·</span><span>When the operator is mentioned in a story, the relationship is stated in the text.</span></div>
<div style={{ display: "flex", gap: "11px" }}><span style={{ color: "var(--red-text)", fontWeight: "800", flexShrink: "0" }}>·</span><span>Directory listing and order are <b>never paid for</b>; the operator is treated like every other company in the Directory.</span></div>
<div style={{ display: "flex", gap: "11px" }}><span style={{ color: "var(--red-text)", fontWeight: "800", flexShrink: "0" }}>·</span><span>Commercial content is always labelled Sponsored Content or Advertisement.</span></div>
</div>
<p style={{ fontSize: "15px", margin: "16px 0 0", color: "var(--slate)" }}>If you believe a story breaks any of these rules, tell us through <Link href="/policies/corrections/" style={{ color: "var(--red-text)", fontWeight: "800", textDecoration: "underline" }}>Corrections</Link>.</p>
</div>
</div>
{/* 我们写什么 */}
<h2 style={{ margin: "0", fontSize: "28px" }} id="what" className="h">What we cover</h2>
<div className="sechd"></div>
<div className="body">
<p>Coverage spans the five product families of the wire mesh industry: Perimeter &amp; Security, Infrastructure &amp; Geotechnical, Filtration &amp; Process, Architectural &amp; Structural, and Materials &amp; Services. Content is organised in five sections — News, Market Insights, Applications, Technical Guides and Buying Guides.</p>
<p>Technical content states the conditions it applies under; news records when something happened and when it was published. We do not publish market-size, price-trend, certification or capability claims without evidence. AI tools help with research, but every piece is checked by an editor before publication and nothing is published automatically.</p>
</div>
<div style={{ display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: "14px", margin: "6px 0 38px" }} className="cols g5">
<div style={{ background: "var(--paper)", borderRadius: "12px", padding: "18px" }}><div style={{ fontSize: "15px", marginBottom: "5px" }} className="h">Perimeter &amp; Security</div><div style={{ lineHeight: "1.5" }} className="meta">Fencing systems, anti-climb mesh, gates, posts and barriers</div></div>
<div style={{ background: "var(--paper)", borderRadius: "12px", padding: "18px" }}><div style={{ fontSize: "15px", marginBottom: "5px" }} className="h">Infrastructure &amp; Geotechnical</div><div style={{ lineHeight: "1.5" }} className="meta">Reinforcing mesh, gabions, slope protection and mining mesh</div></div>
<div style={{ background: "var(--paper)", borderRadius: "12px", padding: "18px" }}><div style={{ fontSize: "15px", marginBottom: "5px" }} className="h">Filtration &amp; Process</div><div style={{ lineHeight: "1.5" }} className="meta">Woven cloth, filters, screens, perforated and expanded metal</div></div>
<div style={{ background: "var(--paper)", borderRadius: "12px", padding: "18px" }}><div style={{ fontSize: "15px", marginBottom: "5px" }} className="h">Architectural &amp; Structural</div><div style={{ lineHeight: "1.5" }} className="meta">Grating, treads, trench covers, handrail and architectural mesh</div></div>
<div style={{ background: "var(--paper)", borderRadius: "12px", padding: "18px" }}><div style={{ fontSize: "15px", marginBottom: "5px" }} className="h">Materials &amp; Services</div><div style={{ lineHeight: "1.5" }} className="meta">Wire rod and drawn wire, coating, machinery, testing and consulting</div></div>
</div>
{/* 编辑原则 */}
<h2 style={{ margin: "0", fontSize: "28px" }} id="principles" className="h">How we work</h2>
<div className="sechd"></div>
{[["Real bylines", "Every article is signed by the person actually responsible for it; outside contributions keep the real author or company name. Each piece keeps its author details, copyright line, sources and dates."], ["Checkable sources", "Internal and external links point only to pages that exist and can be opened, checked by a person before publication. We prefer sources readers can actually reach."], ["Honest images", "Images carry their source and licence; real products and real sites come first. AI-generated images are labelled as illustrations and are never evidence of a real project or of technical performance."], ["Fix what we get wrong", "Substantive errors are corrected with a note in the article saying what changed and when; formatting changes do not refresh the publication date."]].map(([t, d], i) => (
<div key={t} className="prin" style={i === 3 ? { borderBottom: "0" } : undefined}><span className="n">{String(i + 1).padStart(2, "0")}</span><div><div style={{ fontSize: "16px", fontWeight: "800", marginBottom: "4px" }}>{t}</div><div style={{ fontSize: "14.5px", fontWeight: "500", lineHeight: "1.6", color: "var(--slate)" }}>{d}</div></div></div>
))}
<div style={{ margin: "18px 0 38px" }}><Link href="/policies/editorial-policy/" style={{ fontSize: "12.5px", fontWeight: "800", letterSpacing: ".06em", color: "var(--red-text)" }}>FULL EDITORIAL POLICY →</Link></div>
{/* 团队 */}
<h2 style={{ margin: "0", fontSize: "28px" }} id="team" className="h">Who writes it</h2>
<div className="sechd"></div>
<div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "22px", marginBottom: "20px" }} className="cols">
{AUTHORS.map((a) => (
<Link key={a.slug} href={`/authors/${a.slug}/`} style={{ display: "flex", gap: "16px", alignItems: "flex-start", border: "1px solid var(--line)", borderRadius: "14px", padding: "20px" }}>
<div style={{ width: "62px", height: "62px", borderRadius: "999px", background: "var(--line)", flexShrink: "0", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 800, fontSize: "18px", color: "var(--slate)" }}>{initials(a.name)}</div>
<div><div style={{ fontSize: "18px", marginBottom: "3px" }} className="h">{a.name}</div><div style={{ fontSize: "12.5px", fontWeight: "800", letterSpacing: ".06em", color: "var(--red-text)", marginBottom: "7px" }}>{a.role.toUpperCase()}</div><p style={{ margin: "0", fontSize: "13.5px", fontWeight: "500", lineHeight: "1.6", color: "var(--slate)" }}>{a.bio}</p></div>
</Link>
))}
</div>
<p style={{ margin: "0", fontSize: "13.5px", lineHeight: "1.6" }} className="meta">We also publish outside contributors. If you have experience from a plant, a laboratory or a site that is worth writing down, <Link href="/submit/" style={{ color: "var(--red-text)", fontWeight: "800" }}>submit an article</Link>.</p>
</div>
{/* 侧栏 */}
<aside style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
<nav style={{ border: "1px solid var(--line)", borderRadius: "16px", padding: "22px" }} aria-label="On this page">
<div style={{ fontSize: "11.5px", fontWeight: "800", letterSpacing: ".12em", color: "var(--slate)", marginBottom: "12px" }}>ON THIS PAGE</div>
<div style={{ display: "flex", flexDirection: "column", gap: "10px", fontSize: "14.5px", fontWeight: "700" }}>
<a href="#ownership" style={{ color: "var(--red-text)" }}>Ownership disclosure</a><a href="#what">What we cover</a><a href="#principles">How we work</a><a href="#team">Who writes it</a>
</div>
</nav>
<div style={{ border: "2px solid var(--ink)", borderRadius: "16px", padding: "22px" }}>
<div style={{ fontSize: "18px", marginBottom: "13px" }} className="h">Contact</div>
<div style={{ display: "flex", flexDirection: "column", gap: "10px", fontSize: "14px", fontWeight: "500" }}>
<a href={`mailto:${SITE.email}`} style={{ display: "flex", alignItems: "center", gap: "10px", fontWeight: "800" }}><svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="var(--red-text)" strokeWidth="2" aria-hidden="true"><rect x="2.5" y="4.5" width="19" height="15" rx="2" /><path d="m3 6 9 6 9-6" /></svg>{SITE.email}</a>
{SITE.phone && <span style={{ display: "flex", alignItems: "center", gap: "10px" }}><svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="var(--red-text)" strokeWidth="2" strokeLinejoin="round" aria-hidden="true"><path d="M5 3.5h3.5l1.8 4.3-2.2 1.4a12 12 0 0 0 5.7 5.7l1.4-2.2 4.3 1.8V18a2.5 2.5 0 0 1-2.8 2.5C9.3 19.6 4.4 14.7 3.5 6.3A2.5 2.5 0 0 1 5 3.5z" /></svg>{SITE.phone}</span>}
<span style={{ display: "flex", alignItems: "center", gap: "10px" }}><svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="var(--red-text)" strokeWidth="2" strokeLinejoin="round" aria-hidden="true"><path d="M12 21s7-6.3 7-11a7 7 0 1 0-14 0c0 4.7 7 11 7 11z" /><circle cx="12" cy="10" r="2.4" /></svg>{SITE.operator.region}</span>
</div>
<Link href="/contact/" style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", width: "100%", boxSizing: "border-box", minHeight: "46px", borderRadius: "999px", background: "var(--ink)", color: "var(--on-ink)", fontSize: "14px", fontWeight: "800", marginTop: "16px" }}>Contact page</Link>
</div>
<div style={{ background: "var(--paper)", borderRadius: "16px", padding: "22px" }}>
<div style={{ fontSize: "17px", marginBottom: "11px" }} className="h">Policies</div>
<div style={{ display: "flex", flexDirection: "column", gap: "9px", fontSize: "14px", fontWeight: "700" }}>
{POLICIES.slice(0, 7).map((p) => <Link key={p.slug} href={`/policies/${p.slug}/`}>{p.title}</Link>)}
</div>
</div>
<div style={{ background: "var(--surface-dark)", color: "#FFFFFF", borderRadius: "16px", padding: "22px" }}>
<div style={{ fontSize: "18px", marginBottom: "7px" }} className="h">Work with us</div>
<p style={{ margin: "0 0 13px", fontSize: "13.5px", fontWeight: "500", lineHeight: "1.55", color: "var(--on-dark-2)" }}>Sponsored content, display advertising and event media partnerships — all clearly labelled.</p>
<Link href="/advertise/" style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", width: "100%", boxSizing: "border-box", minHeight: "44px", borderRadius: "10px", background: "var(--red)", color: "#FFFFFF", fontSize: "14px", fontWeight: "800" }}>Advertise &amp; Partner</Link>
</div>
</aside>
</div>
</section>
<div style={{ height: "4px", background: "var(--red)" }}></div>
    </Shell>
  );
}
