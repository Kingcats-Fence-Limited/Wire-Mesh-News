/* Ported 1:1 from canvas board Article-C. Header/footer come from the shared shell; everything between is the board's markup with article data. */
import Link from "next/link";
import { facetsOf } from "@/lib/facets";
import { ShareMenu } from "./ShareMenu";
import { Shell } from "@/components/shell/Shell";
import { ArticleBody } from "./ArticleBody";
import { ReadBar } from "./ReadBar";
import { SubscribeModal } from "@/components/boards/subscribe/SubscribeModal";
import { SideNewsletter } from "./SideNewsletter";
import { CopyLink } from "./CopyLink";
import { SocialGlyph } from "@/components/ui/SocialButton";
import { bySection, readNext } from "@/lib/content/articles";
import { getAuthor, lettersFor } from "@/lib/content/people";
import { getStandardByNo } from "@/lib/content/source";
import { getCompany } from "@/lib/content/directory";
import { COUNTRY_BY_CODE } from "@/data/vocab/country";
import { ARTICLE_TYPE } from "@/data/vocab/article_type";
import { sectionByCode, subsectionLabel, subsectionSlug, fmtDate, articleHref, SITE, daysAgo } from "@/lib/site";
import type { Article } from "@/lib/content/types";
import "@/styles/board-art.css";
import { demoBg, demoSrc } from "@/lib/demo";

const PAT: Record<string, string> = { chain: "pChain", chainL: "pChainL", weld: "pWeld", weldQ: "pWeldQ", woven: "pWoven", grate: "pGrate", perf: "pPerf", exp: "pExp" };
const TYPE_LABEL: Record<string, string> = { ...Object.fromEntries(ARTICLE_TYPE.map((t) => [t.code, t.label.toUpperCase()])), column: "OPINION" };
const initials = (n: string) => n.split(/\s+/).map((x) => x[0]).join("").slice(0, 2).toUpperCase();

export function ArticleBoard({ a }: { a: Article }) {
  const sec = sectionByCode(a.section)!;
  const author = getAuthor(a.author)!;
  const toc = a.body.filter((b) => b.type === "h2").map((b) => (b.type === "h2" ? { id: b.id, text: b.text.replace(/^\d+\s*[·.\-–]\s*/, "") } : { id: "", text: "" }));
  const stds = (a.standards ?? []).map((n) => getStandardByNo(n)).filter(Boolean);
  const cos = (a.companies ?? []).map((c) => getCompany(c)).filter(Boolean);
  const letters = lettersFor(a.slug);
  const url = `${SITE.url}${articleHref(a)}`;
  const idx = bySection(a.section).findIndex((x) => x.slug === a.slug);
  const total = bySection(a.section).length;
  const next = readNext(a, 3);
  const heroPat = PAT[a.mesh ?? "chainL"] ?? "pChainL";
  const sponsored = a.type === "sponsored";
  const enc = encodeURIComponent;

  return (
    <Shell header="compact" active={a.section} board="b-art">
{/* ① 深色文章头：网型图案 + 大标题 + 作者条 */}
<div className="hero" style={{ position: "relative", background: "var(--surface-dark)", color: "#FFFFFF", paddingBottom: 0 }}>
{/* pattern clipped in its own box so the share menu can drop below the header */}
<span aria-hidden="true" style={{ position: "absolute", inset: 0, overflow: "hidden", pointerEvents: "none" }}>
<svg style={{ position: "absolute", right: "0", top: "0", height: "100%", width: "760px" }} aria-hidden="true" preserveAspectRatio="none" viewBox="0 0 760 560">
<g color="#FFFFFF" opacity=".2"><rect width="760" height="560" fill={`url(#${heroPat})`} /></g>
<rect width="760" height="560" fill="url(#fadeR)" />
</svg>
</span>
<div style={{ position: "relative", paddingTop: "34px", paddingBottom: "150px" }} className="wrap hero">
<div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: "20px", marginBottom: "26px" }}>
<nav aria-label="Breadcrumb" style={{ display: "flex", alignItems: "center", gap: "9px", fontSize: "12.5px", fontWeight: "700", color: "var(--grey-2)", flexWrap: "wrap" }}>
<Link href="/" style={{ color: "var(--grey-2)" }}>Home</Link><span>/</span>
<Link href={`/${sec.slug}/`} style={{ color: "var(--grey-2)" }}>{sec.label}</Link><span>/</span>
<Link href={`/${sec.slug}/${subsectionSlug(a.subsection)}/`} style={{ color: "var(--grey-2)" }}>{subsectionLabel(a.section, a.subsection)}</Link><span>/</span>
<span style={{ color: "#FFFFFF" }}>This article</span>
</nav>
<div style={{ fontSize: "11px", fontWeight: "700", letterSpacing: ".1em", color: "#9A9FB0" }} className="mono util">{TYPE_LABEL[a.type]?.split(" ")[0]}&nbsp;&nbsp;{String(idx + 1).padStart(2, "0")} / {String(total).padStart(2, "0")}</div>
</div>
<div style={{ display: "flex", alignItems: "center", gap: "10px", flexWrap: "wrap", marginBottom: "22px" }}>
<span style={{ background: sponsored ? "#FFFFFF" : "var(--red)", color: sponsored ? "var(--ink)" : "#FFFFFF", fontSize: "11px", fontWeight: "800", letterSpacing: ".12em", padding: "7px 12px", borderRadius: "4px" }}>{sponsored ? "SPONSORED CONTENT" : sec.label.toUpperCase()}</span>
{!sponsored && <span style={{ border: "1.5px solid rgba(255,255,255,.3)", fontSize: "11px", fontWeight: "800", letterSpacing: ".12em", padding: "6px 12px", borderRadius: "4px", color: "#E3E4EA" }}>{TYPE_LABEL[a.type]}</span>}
<span style={{ fontSize: "12.5px", fontWeight: "600", color: "var(--grey-2)" }}>Published {fmtDate(a.date, { day: "numeric", month: "long", year: "numeric" })}{a.updated && <> &#183; Updated {fmtDate(a.updated, { day: "numeric", month: "long", year: "numeric" })}</>}</span>
</div>
<h1 style={{ margin: "0", fontSize: "60px", maxWidth: "900px", letterSpacing: "-.045em" }} className="h title">{a.title}</h1>
<p className="dek" style={{ margin: "22px 0 0", maxWidth: "760px", fontSize: "20.5px", lineHeight: "1.58", fontWeight: "500", color: "#C4C7D2" }}>{a.dek}</p>
<div style={{ height: "1px", background: "rgba(255,255,255,.14)", margin: "30px 0 22px" }}></div>
<div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: "24px", flexWrap: "wrap" }}>
<div style={{ display: "flex", alignItems: "center", gap: "14px", flexWrap: "wrap" }}>
<span style={{ width: "50px", height: "50px", borderRadius: "999px", background: "var(--line-dark)", boxShadow: "0 0 0 2px var(--red)", display: "inline-flex", alignItems: "center", justifyContent: "center", fontSize: "15px", fontWeight: "800", color: "#FFFFFF" }}>{initials(sponsored ? a.sponsor ?? author.name : author.name)}</span>
<div>
<div style={{ fontSize: "15.5px", fontWeight: "800" }}>{sponsored ? <span style={{ color: "#FFFFFF" }}>{a.sponsor}</span> : <Link href={`/authors/${author.slug}/`} style={{ color: "#FFFFFF" }}>{author.name}</Link>}</div>
<div style={{ fontSize: "12.5px", fontWeight: "500", color: "var(--grey-2)" }}>{sponsored ? "Content supplied by the sponsor · reviewed for compliance only" : `${author.role} · Wire Mesh News`}</div>
</div>
<div style={{ width: "1px", height: "38px", background: "rgba(255,255,255,.14)", margin: "0 6px" }}></div>
<div style={{ display: "flex", alignItems: "center", gap: "7px" }}>
<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--grey-2)" strokeWidth="2" strokeLinecap="round" aria-hidden="true"><circle cx="12" cy="12" r="9" /><path d="M12 7.5V12l3.2 2" /></svg>
<span style={{ fontSize: "13px", fontWeight: "700", color: "#E3E4EA" }} className="mono">{a.readMin} min read</span>
</div>
</div>
<div style={{ display: "flex", alignItems: "center", gap: "9px" }}>
<Link href="/signin/" className="icobtn gh"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" aria-hidden="true"><path d="M6 3h12v18l-6-5-6 5z" /></svg>Save</Link>
<ShareMenu url={url} title={a.title} />
<CopyLink url={url} variant="print" />
</div>
</div>
</div>
</div>
{/* ② 主图：压在深色头上，带 FIG 标 */}
<div style={{ marginTop: "-110px", position: "relative" }} className="wrap lead">
<figure style={{ margin: "0" }}>
<div style={{ position: "relative", borderRadius: "16px", overflow: "hidden", background: "var(--line-2)", aspectRatio: "21/9", boxShadow: "0 24px 60px rgba(21,22,28,.3)" }}>
<svg width="100%" height="100%" style={{ display: "block" }} aria-hidden="true" preserveAspectRatio="none" viewBox="0 0 1156 496">
<image href={demoSrc(a.slug)} width="1156" height="496" preserveAspectRatio="xMidYMid slice" />
<rect width="1156" height="496" fill="url(#fadeD)" opacity=".3" />
</svg>
<span style={{ position: "absolute", left: "0", bottom: "0", background: "var(--red)", color: "#FFFFFF", fontSize: "11px", fontWeight: "800", letterSpacing: ".14em", padding: "8px 14px", borderRadius: "0 10px 0 0" }}>FIG. 1</span>
</div>
<figcaption style={{ display: "flex", gap: "14px", marginTop: "14px", fontSize: "13px", fontWeight: "500", color: "var(--slate)", lineHeight: "1.6" }}>
<span style={{ width: "3px", background: "var(--red)", flexShrink: "0", borderRadius: "2px" }}></span>
<span>{a.title}. <b style={{ color: "var(--ink)" }}>Credit:</b> Wire Mesh News illustration</span>
</figcaption>
</figure>
</div>
{/* ③ 要点卡 */}
{a.takeaways && a.takeaways.length > 0 && (
<div style={{ marginTop: "38px" }} className="wrap">
<div style={{ display: "flex", alignItems: "baseline", gap: "12px", marginBottom: "16px" }}>
<span style={{ fontSize: "15px", letterSpacing: ".06em" }} className="h">KEY TAKEAWAYS</span>
<span style={{ flex: "1 1 0", height: "2px", background: "var(--ink)" }}></span>
<span style={{ fontSize: "12px", fontWeight: "600", color: "var(--grey)" }}>The whole article in 30 seconds</span>
</div>
<div className="g3" style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: "16px" }}>
{a.takeaways.slice(0, 3).map((t, i) => {
  const [head, ...rest] = t.split(/[;:—] /);
  return (
<div key={t} className="cell"><span style={{ left: "-4px", top: "-4px" }} className="nd"></span><span style={{ right: "-4px", top: "-4px" }} className="nd"></span><span style={{ left: "-4px", bottom: "-4px" }} className="nd"></span><span style={{ right: "-4px", bottom: "-4px" }} className="nd"></span>
<div style={{ fontSize: "12px", fontWeight: "700", color: "var(--red-text)", marginBottom: "8px" }} className="mono">{String(i + 1).padStart(2, "0")}</div>
<div style={{ fontSize: "18px", marginBottom: "7px" }} className="h">{rest.length ? head : t}</div>
{rest.length > 0 && <p style={{ margin: "0", fontSize: "13.5px", fontWeight: "500", lineHeight: "1.62", color: "var(--slate)" }}>{rest.join(" ").replace(/^./, (c) => c.toUpperCase())}</p>}
</div>
  );
})}
</div>
</div>
)}
{/* ④ 目录 + 正文 + 侧栏 */}
<div style={{ marginTop: "48px" }} className="wrap">
<div style={{ display: "grid", gridTemplateColumns: "196px 1fr 318px", gap: "44px", alignItems: "start" }} className="cols">
<aside style={{ position: "sticky", top: "24px" }} className="toc">
<div style={{ fontSize: "12.5px", letterSpacing: ".1em", color: "var(--grey)", marginBottom: "10px" }} className="h">ON THIS PAGE</div>
<div style={{ position: "relative", paddingLeft: "0", borderLeft: "2px solid var(--line-soft)", marginLeft: "3px" }}>
<div style={{ paddingLeft: "0" }}>
{toc.map((t, i) => <a key={t.id} href={`#${t.id}`} style={{ marginLeft: "-4px" }} className={`tocl${i === 0 ? " on" : ""}`}>{t.text}</a>)}
{a.sources && a.sources.length > 0 && <a href="#sources" style={{ marginLeft: "-4px" }} className="tocl">Sources</a>}
</div>
</div>
<ReadBar readMin={a.readMin} />
<SubscribeModal />
</aside>
<article data-article="" style={{ minWidth: "0" }} className="body">
<details className="mobtoc noprint"><summary><span>ON THIS PAGE · {toc.length + (a.sources?.length ? 1 : 0)}</span><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" aria-hidden="true"><path d="m5 9 7 7 7-7" /></svg></summary>
<div>{toc.map((t) => <a key={t.id} href={`#${t.id}`} className="tocl">{t.text}</a>)}{a.sources && a.sources.length > 0 && <a href="#sources" className="tocl">Sources</a>}</div>
</details>
{(a.appliesTo || stds.length > 0) && (
<div style={{ display: "flex", gap: "16px", background: "var(--paper)", borderLeft: "4px solid var(--red)", borderRadius: "0 12px 12px 0", padding: "18px 22px", marginBottom: "32px", flexWrap: "wrap" }}>
<div style={{ flex: "1 1 200px" }}>
<div style={{ fontSize: "12px", letterSpacing: ".1em", color: "var(--slate)", marginBottom: "9px" }} className="h">APPLIES TO</div>
<div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
{(a.appliesTo ?? a.tags).map((t) => <span key={t} style={{ background: "var(--card)" }} className="tag">{t}</span>)}
</div>
</div>
{stds.length > 0 && (<>
<div style={{ width: "1px", background: "var(--line-2)" }}></div>
<div style={{ width: "150px", flexShrink: "0" }}>
<div style={{ fontSize: "12px", letterSpacing: ".1em", color: "var(--slate)", marginBottom: "9px" }} className="h">STANDARDS</div>
<div style={{ fontSize: "13px", fontWeight: "700", lineHeight: "1.9", color: "var(--ink)" }} className="mono">{stds.map((s) => <span key={s!.no}><Link href={`/standards/${s!.slug}/`} className="std">{s!.no}</Link><br /></span>)}</div>
<Link href="/standards/" style={{ fontSize: "9.5px", fontWeight: "800", letterSpacing: ".08em", color: "var(--grey)", marginTop: "8px", display: "block" }} className="mono">IN STANDARDS INDEX &#8594;</Link>
</div>
</>)}
</div>
)}
<ArticleBody blocks={a.body} showAd={!sponsored && toc.length >= 3} />
{a.sources && a.sources.length > 0 && (
<div id="sources" style={{ border: "2px solid var(--ink)", borderRadius: "14px", padding: "22px 24px", marginBottom: "22px" }}>
<div style={{ display: "flex", alignItems: "center", gap: "9px", marginBottom: "14px" }}>
<span style={{ width: "15px", height: "3px", background: "var(--red)" }}></span>
<span style={{ fontSize: "12.5px", letterSpacing: ".1em" }} className="h">SOURCES &amp; FURTHER READING</span>
</div>
<ol style={{ margin: "0", padding: "0", listStyle: "none", display: "flex", flexDirection: "column", gap: "11px" }}>
{a.sources.map((s, i) => (
<li key={s.url} style={{ display: "flex", gap: "12px", alignItems: "flex-start" }}><span style={{ width: "22px", height: "22px", background: "var(--ink)", color: "var(--on-ink)", borderRadius: "4px", display: "inline-flex", alignItems: "center", justifyContent: "center", fontSize: "11px", fontWeight: "700", flexShrink: "0", marginTop: "1px" }} className="mono">{i + 1}</span><span style={{ fontSize: "14px", fontWeight: "500", lineHeight: "1.6" }}>{s.title} — <a href={s.url} style={{ color: "var(--red-text)", textDecoration: "underline" }} target={s.url.startsWith("http") ? "_blank" : undefined} rel={s.url.startsWith("http") ? "noopener noreferrer" : undefined}>link</a>, accessed {fmtDate(s.accessed)}</span></li>
))}
</ol>
</div>
)}
{a.correction && (
<div style={{ background: "var(--st-red-bg)", border: "1px solid #F5C2C6", borderRadius: "12px", padding: "16px 20px", marginBottom: "26px" }}>
<div style={{ fontSize: "11.5px", fontWeight: "800", letterSpacing: ".12em", color: "var(--red-deep)", marginBottom: "6px" }}>CORRECTION &#183; {fmtDate(a.correction.date, { day: "numeric", month: "long", year: "numeric" }).toUpperCase()}</div>
<p style={{ margin: "0", fontSize: "13.5px", fontWeight: "500", lineHeight: "1.65", color: "var(--fg-3)" }}>{a.correction.text} <Link href="/policies/corrections/" style={{ color: "var(--red-deep)", textDecoration: "underline" }}>Corrections policy</Link></p>
</div>
)}
<div style={{ display: "flex", alignItems: "center", gap: "10px", flexWrap: "wrap", paddingTop: "22px", borderTop: "1px solid var(--line)" }}>
<span style={{ fontSize: "11px", fontWeight: "800", letterSpacing: ".12em", color: "var(--grey)", marginRight: "2px" }}>KEYWORDS</span>
{a.tags.map((t) => <Link key={t} href={`/search/?q=${enc(t)}`} className="tag">{t}</Link>)}
</div>
{facetsOf(a.facets).length > 0 && (
<div className="covers" style={{ display: "flex", alignItems: "center", gap: "10px", flexWrap: "wrap", paddingTop: "14px", marginTop: "14px", borderTop: "1px solid var(--line)" }}>
<span style={{ fontSize: "11px", fontWeight: "800", letterSpacing: ".12em", color: "var(--grey)", marginRight: "2px" }}>COVERS</span>
{facetsOf(a.facets).map((f) => <Link key={f.key} href={f.href} title={f.title} className="tag"><span style={{ fontSize: "9.5px", fontWeight: 800, letterSpacing: ".08em", color: "var(--grey)", marginRight: "6px" }}>{f.kind.toUpperCase()}</span>{f.label}</Link>)}
</div>
)}
<div id="share" style={{ display: "flex", alignItems: "center", gap: "10px", flexWrap: "wrap", paddingTop: "18px", marginTop: "18px", borderTop: "1px solid var(--line)" }}>
<span style={{ fontSize: "11px", fontWeight: "800", letterSpacing: ".12em", color: "var(--grey)", marginRight: "2px" }}>SHARE</span>
<a href={`https://www.linkedin.com/sharing/share-offsite/?url=${enc(url)}`} target="_blank" rel="noopener noreferrer" aria-label="Share on LinkedIn" className="socl"><SocialGlyph id="linkedin" size={15} /></a>
<a href={`https://x.com/intent/tweet?url=${enc(url)}&text=${enc(a.title)}`} target="_blank" rel="noopener noreferrer" aria-label="Share on X" className="socl"><SocialGlyph id="x" size={15} /></a>
<a href={`https://wa.me/?text=${enc(a.title + " " + url)}`} target="_blank" rel="noopener noreferrer" aria-label="Share on WhatsApp" className="socl"><SocialGlyph id="whatsapp" size={17} /></a>
<a href={`mailto:?subject=${enc(a.title)}&body=${enc(url)}`} aria-label="Share by email" className="socl"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true"><rect x="2.5" y="4.5" width="19" height="15" rx="2" /><path d="m3 6 9 6 9-6" /></svg></a>
<CopyLink url={url} />
<span style={{ marginLeft: "auto", fontSize: "11.5px" }} className="meta util">Plain links only — no social SDKs, no tracking parameters</span>
</div>
{letters.length > 0 && (
<div style={{ marginTop: "30px", border: "2px solid var(--ink)", borderRadius: "14px", padding: "20px 22px" }}>
<div style={{ display: "flex", alignItems: "center", gap: "9px", marginBottom: "12px" }}><span style={{ width: "15px", height: "3px", background: "var(--red)" }}></span><span style={{ fontSize: "12.5px", letterSpacing: ".1em" }} className="h">LETTERS ON THIS ARTICLE</span><Link href="/letters/" style={{ marginLeft: "auto", fontSize: "11px", fontWeight: 800, letterSpacing: ".1em", color: "var(--red-text)" }}>ALL LETTERS &#8594;</Link></div>
{letters.map((l) => (
<Link key={l.slug} href={`/letters/${l.slug}/`} style={{ display: "block", padding: "12px 0", borderTop: "1px solid var(--line)" }}><span className="h" style={{ display: "block", fontSize: "16px", lineHeight: "1.3", marginBottom: "5px" }}>&#8220;{l.title}&#8221;</span><span className="meta" style={{ fontSize: "12px" }}>{l.writer.role} &#183; {l.writer.org} &#183; {daysAgo(l.date)}</span></Link>
))}
</div>
)}
</article>
{/* 侧栏 */}
<aside style={{ display: "flex", flexDirection: "column", gap: "20px", position: "sticky", top: "24px" }} className="side">
<SideNewsletter />
{next.length > 0 && (
<div style={{ border: "1px solid var(--line)", borderRadius: "14px", padding: "20px" }}>
<div style={{ fontSize: "13px", letterSpacing: ".08em", color: "var(--grey)", marginBottom: "14px" }} className="h">RELATED {a.section === "technical_guides" || a.section === "buying_guides" ? "GUIDES" : "ARTICLES"}</div>
<div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
{next.map((n, i) => (<span key={n.slug} style={{ display: "contents" }}>
{i > 0 && <div style={{ height: "1px", background: "var(--line-soft)" }}></div>}
<Link href={articleHref(n)} style={{ display: "flex", gap: "11px", alignItems: "flex-start" }}><span style={{ fontSize: "12px", fontWeight: "700", color: "var(--red-text)", marginTop: "2px" }} className="mono">{String(i + 1).padStart(2, "0")}</span><span style={{ fontSize: "15px", letterSpacing: "-.02em" }} className="h">{n.title}</span></Link>
</span>))}
</div>
</div>
)}
{cos.length > 0 && (
<div style={{ border: "1px solid var(--line)", borderRadius: "14px", padding: "20px" }}>
<div style={{ fontSize: "13px", letterSpacing: ".08em", color: "var(--grey)", marginBottom: "6px" }} className="h">COMPANIES MENTIONED</div>
<p style={{ margin: "0 0 13px", fontSize: "11.5px", fontWeight: "500", lineHeight: "1.55", color: "var(--grey)" }}>Editorial listing, not an advertising slot; order is unrelated to payment.</p>
<div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
{cos.map((c) => (
<Link key={c!.slug} href={`/directory/${c!.slug}/`} style={{ display: "flex", alignItems: "center", gap: "11px" }}><span style={{ width: "36px", height: "36px", borderRadius: "8px", background: "var(--paper)", border: "1px solid var(--line)", flexShrink: "0" }}></span><span><span style={{ display: "block", fontSize: "14px", fontWeight: "800" }}>{c!.name}</span><span style={{ display: "block", fontSize: "11.5px", fontWeight: "500", color: "var(--grey)" }}>{COUNTRY_BY_CODE[c!.country]?.name ?? c!.country} &#183; Directory profile</span></span></Link>
))}
</div>
</div>
)}
<div style={{ height: "250px" }} className="ad"><span className="adlbl">ADVERTISEMENT</span><span style={{ fontSize: "13px", fontWeight: "700" }}>300 × 250 MPU</span></div>
<div style={{ height: "600px" }} className="ad"><span className="adlbl">ADVERTISEMENT</span><span style={{ fontSize: "13px", fontWeight: "700" }}>300 × 600 HALF PAGE</span></div>
</aside>
</div>
</div>
{/* ⑤ 作者卡 */}
{!sponsored && (
<div style={{ marginTop: "52px" }} className="wrap">
<div style={{ position: "relative", overflow: "hidden", background: "var(--surface-dark)", color: "#FFFFFF", borderRadius: "16px", padding: "28px 30px" }}>
<svg style={{ position: "absolute", right: "0", top: "0", height: "100%", width: "420px" }} aria-hidden="true" preserveAspectRatio="none" viewBox="0 0 420 220"><g color="#FFFFFF" opacity=".16"><rect width="420" height="220" fill="url(#pChain)" /></g><rect width="420" height="220" fill="url(#fadeR)" /></svg>
<div style={{ position: "relative", display: "flex", gap: "22px", alignItems: "flex-start", flexWrap: "wrap" }}>
<span style={{ width: "72px", height: "72px", borderRadius: "999px", background: "var(--line-dark)", boxShadow: "0 0 0 2px var(--red)", display: "inline-flex", alignItems: "center", justifyContent: "center", fontSize: "21px", fontWeight: "800", flexShrink: "0" }}>{initials(author.name)}</span>
<div style={{ flex: "1 1 320px" }}>
<div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "7px" }}>
<span style={{ fontSize: "22px" }} className="h">{author.name}</span>
<span style={{ border: "1.5px solid rgba(255,255,255,.3)", fontSize: "10.5px", fontWeight: "800", letterSpacing: ".1em", padding: "4px 9px", borderRadius: "4px", color: "#E3E4EA" }}>AUTHOR</span>
</div>
<p style={{ margin: "0 0 14px", maxWidth: "640px", fontSize: "14px", fontWeight: "500", lineHeight: "1.66", color: "#C4C7D2" }}>{author.bio}</p>
<div style={{ display: "flex", alignItems: "center", gap: "9px", flexWrap: "wrap" }}>
{author.email && <a href={`mailto:${author.email}`} className="icobtn gh">{author.email}</a>}
{author.linkedin && <a href={author.linkedin} target="_blank" rel="noopener noreferrer" aria-label="LinkedIn" style={{ width: "42px", padding: "0" }} className="icobtn gh"><SocialGlyph id="linkedin" size={16} /></a>}
<div style={{ width: "1px", height: "34px", background: "rgba(255,255,255,.16)", margin: "0 4px" }}></div>
<Link href={`/authors/${author.slug}/`} style={{ display: "inline-flex", alignItems: "center", minHeight: "42px", padding: "0 20px", borderRadius: "999px", background: "var(--card)", color: "var(--ink)", fontSize: "13.5px", fontWeight: "800" }}>All articles by this author &#8594;</Link>
</div>
</div>
</div>
</div>
</div>
)}
{/* ⑥ 评论 */}
<div id="comments" style={{ marginTop: "48px", scrollMarginTop: "24px" }} className="wrap">
<div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", gap: "20px", paddingBottom: "14px", borderBottom: "3px solid var(--ink)" }}>
<div>
<h2 style={{ margin: "0", fontSize: "28px" }} className="h">Comments <span style={{ color: "var(--red-text)", fontSize: "19px" }} className="mono">0</span></h2>
<p style={{ margin: "6px 0 0", fontSize: "12.5px", fontWeight: "500", color: "var(--slate)" }}>Sign in to comment. Every comment is reviewed before it appears, under the <Link href="/policies/comment-policy/" style={{ color: "var(--red-text)", textDecoration: "underline" }}>Comment Policy</Link>.</p>
</div>
<div style={{ display: "flex", gap: "8px" }}>
<span style={{ fontSize: "12px", fontWeight: "700", color: "var(--grey)" }}>SORT</span>
<span style={{ fontSize: "12px", fontWeight: "700" }} className="mono">NEWEST ▾</span>
</div>
</div>
<div className="cmt" style={{ display: "grid", gridTemplateColumns: "1fr 318px", gap: "44px", marginTop: "24px", alignItems: "start" }}>
<div>
<div style={{ border: "2px solid var(--ink)", borderRadius: "14px", padding: "18px 20px", marginBottom: "26px" }}>
<div style={{ display: "flex", alignItems: "center", gap: "11px", marginBottom: "12px" }}>
<span style={{ width: "34px", height: "34px", borderRadius: "999px", background: "var(--ink)", color: "var(--on-ink)", display: "inline-flex", alignItems: "center", justifyContent: "center", fontSize: "12.5px", fontWeight: "800" }}>?</span>
<span style={{ fontSize: "14px", fontWeight: "800" }}>Your name</span>
<span style={{ background: "var(--paper)", fontSize: "10.5px", fontWeight: "800", letterSpacing: ".1em", padding: "4px 8px", borderRadius: "4px", color: "var(--slate)" }}>READER</span>
</div>
<div style={{ minHeight: "70px", border: "1px solid var(--line)", borderRadius: "10px", padding: "12px 14px", fontSize: "14px", fontWeight: "500", color: "var(--grey)" }}>Add to the record — a correction, a site experience, a standard we missed…</div>
<div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: "16px", marginTop: "12px", flexWrap: "wrap" }}>
<span style={{ fontSize: "12px", fontWeight: "500", color: "var(--grey)" }}>Comments enter a review queue and are usually handled within one working day.</span>
<Link href="/signin/" style={{ minHeight: "42px", padding: "0 22px", border: "0", borderRadius: "999px", background: "var(--ink)", color: "var(--on-ink)", fontFamily: "inherit", fontSize: "14px", fontWeight: "800", display: "inline-flex", alignItems: "center" }}>Sign in to comment</Link>
</div>
</div>
<p className="meta" style={{ margin: 0 }}>No comments yet. Be the first to add to the record.</p>
</div>
<div style={{ borderLeft: "3px solid var(--red)", paddingLeft: "18px" }}>
<div style={{ fontSize: "15px", marginBottom: "10px" }} className="h">How comments work</div>
<ul style={{ margin: "0", paddingLeft: "18px", fontSize: "13px", fontWeight: "500", lineHeight: "1.8", color: "var(--slate)" }}>
<li>Registration with a verified email is required</li>
<li>Reviewed before publication, not removed afterwards</li>
<li>Sales pitches, contact details and copied text are declined</li>
<li>Comments that point out a factual error are handled first and can trigger a correction</li>
<li>Company accounts carry a COMPANY label</li>
</ul>
</div>
</div>
</div>
{/* ⑦ 继续阅读 */}
<div style={{ marginTop: "52px", marginBottom: "56px" }} className="wrap noprint">
<div style={{ display: "flex", alignItems: "baseline", gap: "12px", marginBottom: "18px" }}>
<span style={{ fontSize: "26px" }} className="h">Read next</span>
<span style={{ flex: "1 1 0", height: "2px", background: "var(--ink)" }}></span>
<Link href={`/${sec.slug}/`} style={{ fontSize: "12.5px", fontWeight: "800", letterSpacing: ".06em", color: "var(--red-text)" }}>ALL {sec.label.toUpperCase()} &#8594;</Link>
</div>
<div className="g3" style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: "22px" }}>
{next.map((n) => (
<article key={n.slug} style={{ display: "flex", flexDirection: "column", gap: "11px" }}>
<Link href={articleHref(n)} style={{ borderRadius: "12px", overflow: "hidden", aspectRatio: "16/10", display: "block", ...demoBg(n.slug, 0, "md") }} aria-hidden="true" tabIndex={-1}></Link>
<span className="kicker"><i></i>{subsectionLabel(n.section, n.subsection).toUpperCase()}</span>
<Link href={articleHref(n)} style={{ fontSize: "19px" }} className="h">{n.title}</Link>
<span style={{ fontSize: "12.5px", fontWeight: "500", color: "var(--grey)" }}>{n.readMin} min read</span>
</article>
))}
</div>
</div>
    </Shell>
  );
}
