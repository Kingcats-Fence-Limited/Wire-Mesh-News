/* Ported 1:1 from canvas board Company-E. */
import Link from "next/link";
import { Shell } from "@/components/shell/Shell";
import { COMPANIES } from "@/lib/content/directory";
import { upcomingEvents } from "@/lib/content/source";
import { byCompany } from "@/lib/content/articles";
import { EMPLOYEE_RANGE_BY_CODE, VERIFICATION_LABEL_BY_CODE, CERTIFICATION_ISSUER, CATEGORY_BY_CODE, PRODUCT_BY_CODE, ORGANISATION_TYPE_BY_CODE, COUNTRY_BY_CODE, SUBDIVISION_BY_CODE, PROCESS_BY_CODE, REGION_BY_CODE, CERTIFICATION_TYPE_BY_CODE, APPLICATION_AREA_BY_CODE } from "@/data/vocab";
import { fmtDate, fmtDateShort, articleHref, subsectionLabel } from "@/lib/site";
import type { Company } from "@/lib/content/types";
import "@/styles/board-co.css";
import { demoBg, logoSrc } from "@/lib/demo";
import { PageHeadArt, HEAD_ART } from "@/components/shell/PageHeadArt";

const issuerName = (v?: string) => !v ? "" : CERTIFICATION_ISSUER.find((i) => i.code === v || i.name.toLowerCase() === v.toLowerCase())?.name ?? v;

export function CompanyBoard({ c }: { c: Company }) {
  const country = COUNTRY_BY_CODE[c.country]?.name ?? c.country;
  const sub = c.subdivision ? SUBDIVISION_BY_CODE[c.subdivision]?.name?.replace(/ Sheng$/, "") : undefined;
  const place = [c.city, sub, country].filter(Boolean).join(", ");
  const orgType = ORGANISATION_TYPE_BY_CODE[c.orgType]?.labelEn ?? c.orgType;
  const articles = byCompany(c.slug);
  const verified = c.certifications.filter((x) => x.verified);
  const similar = COMPANIES.filter((x) => x.slug !== c.slug && x.categories.some((k) => c.categories.includes(k))).slice(0, 3);
  const events = upcomingEvents().slice(0, 2);
  const cats = c.categories.map((k) => CATEGORY_BY_CODE[k]?.labelEn ?? k);
  const chips = [...cats, ...c.applications.map((a) => APPLICATION_AREA_BY_CODE[a]?.labelEn ?? a), ...(c.processes ?? []).slice(0, 2).map((p) => PROCESS_BY_CODE[p]?.labelEn ?? p)].filter((v, i, arr) => arr.indexOf(v) === i).slice(0, 5);
  const certLabel = (t: string) => CERTIFICATION_TYPE_BY_CODE[t]?.label.replace(/\s*\(.*\)$/, "") ?? t.toUpperCase().replace(/_/g, " ");

  return (
    <Shell header="compact" active="directory" board="b-co">
{/* 企业头部 */}
<section style={{ background: "var(--surface-dark)", color: "#FFFFFF", position: "relative", overflow: "hidden" }}>
<PageHeadArt src={HEAD_ART.hall} />
<div style={{ position: "relative", paddingTop: "32px", paddingBottom: "32px" }} className="wrap">
<nav aria-label="Breadcrumb" style={{ fontSize: "12.5px", fontWeight: "500", color: "var(--grey-2)", marginBottom: "20px" }}><Link href="/" style={{ color: "var(--grey-2)" }}>Home</Link> / <Link href="/directory/" style={{ color: "var(--grey-2)" }}>Directory</Link> / <Link href={`/directory/?category=${c.categories[0]}`} style={{ color: "var(--grey-2)" }}>{cats[0]}</Link> / <span style={{ color: "#FFFFFF", fontWeight: "800" }}>{c.name}</span></nav>
<div style={{ display: "flex", gap: "24px", alignItems: "flex-start", flexWrap: "wrap" }}>
<div style={{ width: "96px", height: "96px", borderRadius: "18px", background: "var(--card)", flexShrink: "0", overflow: "hidden" }}><img src={logoSrc(c.slug)} alt={`${c.name} logo`} width="96" height="96" style={{ display: "block", width: "100%", height: "100%", objectFit: "cover" }} /></div>
<div style={{ flex: "1 1 440px", display: "flex", flexDirection: "column", gap: "11px" }}>
<div style={{ display: "flex", alignItems: "center", gap: "11px", flexWrap: "wrap" }}>
<h1 style={{ margin: "0", fontSize: "42px", letterSpacing: "-.05em", color: "#FFFFFF", lineHeight: "1.02" }} className="h">{c.name}</h1>
{c.claimed ? <span style={{ background: "var(--up)", color: "#FFFFFF", fontSize: "9.5px", fontWeight: "800", letterSpacing: ".1em", padding: "5px 10px", borderRadius: "4px" }}>CLAIMED</span> : <span style={{ border: "1px solid var(--line-dark)", color: "var(--grey-3)", fontSize: "9.5px", fontWeight: "800", letterSpacing: ".1em", padding: "4px 10px", borderRadius: "4px" }}>UNCLAIMED</span>}
</div>
<div style={{ display: "flex", gap: "10px", flexWrap: "wrap", alignItems: "center" }}>
<span style={{ background: "var(--red)", color: "#FFFFFF", fontSize: "10.5px", fontWeight: "800", letterSpacing: ".1em", padding: "5px 11px", borderRadius: "5px" }}>{orgType.toUpperCase()}</span>
<span style={{ fontSize: "14px", fontWeight: "500", color: "#B9BCC6" }}>{place}</span>
{c.founded && <><span style={{ width: "1px", height: "14px", background: "var(--line-dark)" }}></span><span style={{ fontSize: "12.5px", fontWeight: "700", color: "var(--grey-5)" }} className="mono">Founded {c.founded}</span></>}
</div>
<p style={{ margin: "3px 0 0", fontSize: "16px", fontWeight: "500", lineHeight: "1.6", color: "#B9BCC6", maxWidth: "680px" }}>{c.summary}</p>
<div style={{ display: "flex", gap: "7px", flexWrap: "wrap", marginTop: "4px" }}>
{chips.map((t) => <span key={t} style={{ border: "1px solid var(--line-dark)", borderRadius: "6px", padding: "5px 10px", fontSize: "12px", fontWeight: "700", color: "var(--on-dark-2)" }}>{t}</span>)}
</div>
</div>
<div style={{ display: "flex", flexDirection: "column", gap: "10px", flexShrink: "0", minWidth: "216px" }}>
{c.website && <a href={c.website} rel="nofollow noopener noreferrer" target="_blank" style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", gap: "8px", background: "var(--card)", color: "var(--ink)", fontWeight: "800", fontSize: "14px", padding: "0 20px", minHeight: "48px", borderRadius: "999px" }}><svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" aria-hidden="true"><path d="M14 10.5a4 4 0 0 0-5.7 0l-3 3a4 4 0 1 0 5.7 5.7L12.5 18" /><path d="M10 13.5a4 4 0 0 0 5.7 0l3-3a4 4 0 1 0-5.7-5.7L11.5 6" /></svg>Company website</a>}
<Link href="/signin/" style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", gap: "8px", border: "1px solid var(--line-dark)", background: "transparent", color: "#FFFFFF", fontWeight: "800", fontSize: "14px", padding: "0 20px", minHeight: "48px", borderRadius: "999px" }}><svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinejoin="round" aria-hidden="true"><path d="M6 3.5h12v17l-6-4.2-6 4.2z" /></svg>Save to my list</Link>
<span style={{ textAlign: "center", color: "var(--grey-5)" }} className="meta">{c.claimed ? "Maintained by the company" : "Compiled by editors"} &#183; {c.verifiedAt ? `verified ${fmtDate(c.verifiedAt)}` : `updated ${fmtDate(c.updated)}`}</span>
</div>
</div>
</div>
</section>
{/* 产品图册 */}
<section style={{ paddingTop: "34px", paddingBottom: "34px" }} className="wrap">
<div className="sec"><h2>Products</h2><span className="rule"></span><span style={{ fontSize: "11.5px", fontWeight: "800", letterSpacing: ".08em", color: "var(--grey)" }} className="meta">SUPPLIED BY THE COMPANY &#183; REVIEWED BY EDITORS</span></div>
<div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "18px" }} className="g4">
{c.productCards.slice(0, 3).map((p) => (
<div key={p.name} style={{ border: "1px solid var(--line)", borderRadius: "14px", overflow: "hidden", display: "flex", flexDirection: "column" }}>
<div style={{ borderRadius: "0", aspectRatio: "4/3", ...demoBg(p.name) }} className="ph"></div>
<div style={{ padding: "16px 17px", display: "flex", flexDirection: "column", gap: "7px", flex: "1 1 auto" }}>
<span style={{ fontSize: "16.5px" }} className="h">{p.name}</span>
<span style={{ lineHeight: "1.5" }} className="meta">{p.spec}</span>
<span style={{ marginTop: "auto", fontSize: "11px", fontWeight: "700", color: "var(--grey)", paddingTop: "7px" }} className="mono meta">{p.photos} photo{p.photos === 1 ? "" : "s"}</span>
</div>
</div>
))}
<div style={{ border: "1px dashed var(--line-2)", borderRadius: "14px", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: "8px", background: "var(--paper-2)", minHeight: "240px", color: "var(--grey)" }}>
<span style={{ fontSize: "26px", color: "var(--on-dark-2)" }} className="h">{c.productCards.length > 3 ? `+${c.productCards.length - 3}` : `${c.products.length}`}</span>
<span style={{ fontSize: "13px", fontWeight: "800" }}>{c.productCards.length > 3 ? "More products" : "Product lines"}</span>
{c.productCards.length <= 3 && <span className="meta" style={{ textAlign: "center", padding: "0 16px", fontSize: "11.5px" }}>{c.products.slice(0, 4).map((p) => PRODUCT_BY_CODE[p]?.labelEn ?? p).join(" · ")}</span>}
</div>
</div>
<div style={{ background: "var(--paper)", borderLeft: "4px solid var(--ink)", borderRadius: "0 10px 10px 0", padding: "14px 18px", marginTop: "18px" }}>
<div style={{ fontSize: "13px", fontWeight: "500", lineHeight: "1.65", color: "var(--fg-3)" }}><b>About the photos:</b> product images are supplied by the company, which declares it holds the rights, and are shown after editorial review. They illustrate appearance only and are not a specification or proof of performance; the agreed technical documents govern. Wire Mesh News does not endorse product quality.</div>
</div>
</section>
{/* 主体 */}
<section style={{ paddingBottom: "50px" }} className="wrap">
<div style={{ display: "grid", gridTemplateColumns: "minmax(0,1fr) 336px", gap: "48px", alignItems: "start" }} className="cols">
<div>
{/* 认证 */}
<div className="sec"><h2>Certifications</h2><span className="rule"></span></div>
{c.certifications.length ? (
<div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "14px", marginBottom: "14px" }} className="g2">
{c.certifications.map((x) => x.verified ? (
<div key={x.type} className="certcard">
<span className="certmark"><svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M12 3.2 4.8 6v5.4c0 4.3 3 7.8 7.2 9 4.2-1.2 7.2-4.7 7.2-9V6z" /><path d="m8.9 12 2.1 2.1 4.1-4.3" /></svg></span>
<div style={{ minWidth: "0" }}><div style={{ fontSize: "15px", fontWeight: "800", marginBottom: "3px" }}>{certLabel(x.type)}</div><div style={{ lineHeight: "1.5" }} className="meta">{x.no && <>Certificate {x.no} &#183; </>}{issuerName(x.issuer)}{x.expires && <><br />Valid to {fmtDate(x.expires)}</>}</div><div className="src">Verified against the certifier&#8217;s database{c.verifiedAt && `, ${fmtDate(c.verifiedAt)}`}</div></div>
</div>
) : (
<div key={x.type} style={{ opacity: ".72" }} className="certcard">
<span style={{ background: "var(--st-review-bg)", color: "var(--st-review-fg)" }} className="certmark"><svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.3" strokeLinecap="round" aria-hidden="true"><circle cx="12" cy="12" r="9" /><path d="M12 7v5.3l3.3 2" /></svg></span>
<div style={{ minWidth: "0" }}><div style={{ fontSize: "15px", fontWeight: "800", marginBottom: "3px" }}>{certLabel(x.type)}</div><div style={{ lineHeight: "1.5" }} className="meta">Submitted by the company; verification pending</div><div className="src">Not displayed as verified until confirmed</div></div>
</div>
))}
</div>
) : <p className="meta" style={{ margin: "0 0 14px" }}>No certifications on file.</p>}
<p style={{ margin: "0 0 34px", lineHeight: "1.6" }} className="meta">Only certifications with a certificate copy on file and a matching record in the issuer&#8217;s database are marked verified; the rest are not shown. Once submitted, certification details cannot be edited by the company; changes go through the editors.</p>
{/* 关键资料 */}
<div className="sec"><h2>Key facts</h2><span className="rule"></span></div>
<dl style={{ margin: "0 0 12px" }}>
<div className="fact"><dt>Legal name</dt><dd>{c.legalName ?? c.name}<span className="src">Source: public company register</span></dd></div>
{c.founded && <div className="fact"><dt>Founded</dt><dd>{c.founded}<span className="src">Source: company website</span></dd></div>}
<div className="fact"><dt>Organisation type</dt><dd>{orgType}<span className="src">Classified by Wire Mesh News editors</span></dd></div>
<div className="fact"><dt>Headquarters</dt><dd>{place}<span className="src">Source: company website</span></dd></div>
<div className="fact"><dt>Product categories</dt><dd>{cats.join("; ")}<span className="src">Classified by editors from the product list</span></dd></div>
{c.processes && <div className="fact"><dt>Process capability</dt><dd>{c.processes.map((p) => PROCESS_BY_CODE[p]?.labelEn ?? p).join("; ")}<span className="src">Source: product catalogue and interview</span></dd></div>}
{c.employees && <div className="fact"><dt>Employees</dt><dd>{EMPLOYEE_RANGE_BY_CODE[c.employees]?.label ?? c.employees}<span className="selfr">{VERIFICATION_LABEL_BY_CODE.self_reported?.label.toUpperCase() ?? "SELF-REPORTED"}</span><span className="src">Stated by the company, not independently verified</span></dd></div>}
<div style={{ borderBottom: "0" }} className="fact"><dt>Export markets</dt><dd>{c.exportMarkets?.length ? c.exportMarkets.map((r) => REGION_BY_CODE[r]?.labelEn ?? r).join("; ") : "—"}{c.exportMarkets?.length ? <span className="selfr">SELF-REPORTED</span> : null}<span className="src">{c.exportMarkets?.length ? "Stated by the company, not independently verified" : "No verifiable information"}</span></dd></div>
</dl>
<div style={{ background: "var(--paper)", borderLeft: "4px solid var(--ink)", borderRadius: "0 10px 10px 0", padding: "15px 20px", marginBottom: "36px" }}>
<div style={{ fontSize: "11px", fontWeight: "800", letterSpacing: ".1em", color: "var(--slate)", marginBottom: "5px" }}>ABOUT THIS PROFILE</div>
<div style={{ fontSize: "13.5px", fontWeight: "500", lineHeight: "1.65", color: "var(--fg-3)" }}>{c.claimed ? "This page is maintained by the company after claiming its profile; every fact carries its source and all changes are reviewed by editors." : "This page was compiled by editors from public information; every fact carries its source."} Listing is not a recommendation or endorsement, and order is never paid for. Self-reported figures are labelled; unverified capacity, market-share and revenue figures are not published.</div>
</div>
{/* 相关报道 */}
<div className="sec"><h2>Coverage</h2><span className="rule"></span><Link href={`/search/?q=${encodeURIComponent(c.name)}`} style={{ fontSize: "11.5px", fontWeight: "800", letterSpacing: ".1em", color: "var(--red-text)" }}>ALL {articles.length} &#8594;</Link></div>
{articles.length === 0 && <p className="meta">No coverage yet.</p>}
{articles.map((a, i) => (
<Link key={a.slug} href={articleHref(a)} style={{ display: "flex", gap: "18px", padding: i === 0 ? "0 0 20px" : "20px 0", borderBottom: "1px solid var(--line)" }}><span style={{ width: "164px", flexShrink: "0", aspectRatio: "4/3", ...demoBg(a.slug) }} className="ph"></span><span style={{ display: "flex", flexDirection: "column", gap: "7px", minWidth: "0" }}>{a.type === "sponsored" ? <span style={{ background: "var(--ink)", color: "var(--on-ink)", fontSize: "9.5px", fontWeight: "800", letterSpacing: ".14em", padding: "4px 9px", borderRadius: "4px", alignSelf: "flex-start" }}>SPONSORED CONTENT</span> : <span className="kick"><i></i>{subsectionLabel(a.section, a.subsection).toUpperCase()}</span>}<span style={{ fontSize: "19px" }} className="h">{a.title}</span>{a.type !== "sponsored" && <span style={{ fontSize: "13.5px", fontWeight: "500", lineHeight: "1.5", color: "var(--slate)" }}>{a.dek}</span>}<span style={{ fontSize: "11.5px", fontWeight: "700" }} className="mono meta">{fmtDateShort(a.date)} 2026 &#183; {a.type === "sponsored" ? `PAID FOR BY ${(a.sponsor ?? c.name).toUpperCase()}` : `${a.readMin} MIN`}</span></span></Link>
))}
</div>
{/* 侧栏 */}
<aside style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
<div style={{ border: "2px solid var(--ink)", borderRadius: "16px", overflow: "hidden" }}>
<div style={{ background: "var(--surface-dark)", color: "#FFFFFF", padding: "14px 20px", display: "flex", alignItems: "center", gap: "9px" }}>
<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#FFFFFF" strokeWidth="2.1" strokeLinejoin="round" aria-hidden="true"><rect x="4" y="10.5" width="16" height="10" rx="2" /><path d="M8 10.5V7.8a4 4 0 0 1 8 0v2.7" /></svg>
<span style={{ fontSize: "16px", color: "#FFFFFF" }} className="h">Contact details</span>
</div>
<div style={{ padding: "20px", position: "relative" }}>
<div aria-hidden="true" style={{ position: "absolute", inset: "20px", filter: "blur(5px)", userSelect: "none", opacity: ".5", overflow: "hidden" }}>
<div style={{ display: "flex", flexDirection: "column", gap: "11px", fontSize: "14px", fontWeight: "700" }}>
<span>sales@example.com</span>
<span>+00 000 0000 0000</span>
<span style={{ lineHeight: "1.5" }}>Street address<br />{c.city}, {country}</span>
<span>Contact: Name, Title</span>
</div>
</div>
<div style={{ position: "relative", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: "11px", padding: "8px 0 4px", textAlign: "center" }}>
<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="var(--ink)" strokeWidth="2" strokeLinejoin="round" aria-hidden="true"><rect x="4" y="10.5" width="16" height="10" rx="2" /><path d="M8 10.5V7.8a4 4 0 0 1 8 0v2.7" /></svg>
<div style={{ fontSize: "14.5px", fontWeight: "800", lineHeight: "1.4" }}>Sign in to see contact details</div>
<p style={{ margin: "0", lineHeight: "1.55", maxWidth: "230px" }} className="meta">Contact details are behind sign-in to stop them being scraped for bulk marketing. Registration is free.</p>
<Link href={`/signin/?next=${encodeURIComponent(`/directory/${c.slug}/`)}`} style={{ background: "var(--ink)", color: "var(--on-ink)", fontWeight: "800", fontSize: "13.5px", padding: "0 22px", minHeight: "44px", borderRadius: "999px", display: "inline-flex", alignItems: "center", marginTop: "2px" }}>Sign in to view</Link>
<Link href="/register/" style={{ fontSize: "12.5px", fontWeight: "800", color: "var(--red-text)" }}>Register free</Link>
</div>
</div>
</div>
<div style={{ border: "1px solid var(--line)", borderRadius: "16px", padding: "22px" }}>
<div style={{ fontSize: "17px", marginBottom: "14px" }} className="h">At a glance</div>
<div style={{ display: "flex", flexDirection: "column", gap: "12px", fontSize: "14px", fontWeight: "500" }}>
<div style={{ display: "flex", justifyContent: "space-between", gap: "12px" }}><span style={{ color: "var(--slate)" }}>Founded</span><b>{c.founded ?? "—"}</b></div>
<div style={{ display: "flex", justifyContent: "space-between", gap: "12px" }}><span style={{ color: "var(--slate)" }}>Type</span><b>{orgType}</b></div>
<div style={{ display: "flex", justifyContent: "space-between", gap: "12px" }}><span style={{ color: "var(--slate)" }}>Country</span><b>{country}</b></div>
<div style={{ display: "flex", justifyContent: "space-between", gap: "12px" }}><span style={{ color: "var(--slate)" }}>Products listed</span><b>{c.products.length}</b></div>
<div style={{ display: "flex", justifyContent: "space-between", gap: "12px" }}><span style={{ color: "var(--slate)" }}>Certifications</span><b>{verified.length} verified</b></div>
<div style={{ display: "flex", justifyContent: "space-between", gap: "12px" }}><span style={{ color: "var(--slate)" }}>Articles</span><b>{articles.length}</b></div>
</div>
</div>
<div style={{ border: "1px solid var(--line)", borderRadius: "16px", padding: "22px" }}>
<div style={{ fontSize: "17px", marginBottom: "12px" }} className="h">Categories</div>
<div style={{ display: "flex", gap: "7px", flexWrap: "wrap", marginBottom: "16px" }}>{c.categories.map((k) => <Link key={k} href={`/directory/?category=${k}`} className="tag">{CATEGORY_BY_CODE[k]?.labelEn}</Link>)}</div>
<div style={{ height: "1px", background: "var(--line)", marginBottom: "14px" }}></div>
<div style={{ fontSize: "17px", marginBottom: "12px" }} className="h">Similar companies</div>
<div style={{ display: "flex", flexDirection: "column", gap: "12px", fontSize: "14px", fontWeight: "700" }}>
{similar.map((x) => <Link key={x.slug} href={`/directory/${x.slug}/`} style={{ display: "flex", alignItems: "center", gap: "10px" }}><span style={{ width: "32px", height: "32px", borderRadius: "7px", background: "var(--line)", flexShrink: "0" }}></span>{x.name}<span className="mono" style={{ marginLeft: "auto", fontSize: "11px", color: "var(--grey)" }}>{x.country}</span></Link>)}
</div>
</div>
<div style={{ border: "1px solid var(--line)", borderRadius: "16px", padding: "22px" }}>
<div style={{ fontSize: "17px", marginBottom: "12px" }} className="h">At upcoming events</div>
{events.map((e, i) => {
  const [d, m] = fmtDateShort(e.start).split(" ");
  return (
<Link key={e.slug} href={`/events/#${e.slug}`} style={{ display: "flex", gap: "14px", alignItems: "center", paddingBottom: i < events.length - 1 ? "12px" : undefined, borderBottom: i < events.length - 1 ? "1px solid var(--line)" : undefined, marginBottom: i < events.length - 1 ? "12px" : undefined }}><span style={{ flex: "0 0 46px", textAlign: "center" }}><span style={{ display: "block", fontSize: "10.5px", letterSpacing: ".08em", color: "var(--red-text)" }} className="h">{m}</span><span style={{ display: "block", fontSize: "22px" }} className="h">{d.padStart(2, "0")}</span></span><span style={{ fontSize: "14px", fontWeight: "700", lineHeight: "1.35" }}>{e.name}<span style={{ display: "block", fontWeight: "500", marginTop: "2px" }} className="meta">{e.online ? "Online" : e.city}{i === 0 && c.claimed && <span className="selfr">SELF-REPORTED</span>}</span></span></Link>
  );
})}
</div>
<div style={{ background: "var(--paper)", borderRadius: "16px", padding: "22px" }}>
<div style={{ fontSize: "16px", marginBottom: "8px" }} className="h">Something wrong here?</div>
<p style={{ margin: "0 0 13px", fontSize: "13.5px", fontWeight: "500", lineHeight: "1.6", color: "var(--slate)" }}>Corrections need a verifiable source. Editors check, update the entry and record the change date.</p>
<Link href={`/contact/?subject=correction&about=${c.slug}`} style={{ background: "var(--ink)", color: "var(--on-ink)", fontWeight: "800", fontSize: "13.5px", padding: "0 20px", minHeight: "44px", borderRadius: "999px", display: "inline-flex", alignItems: "center" }}>Suggest a correction</Link>
</div>
{!c.claimed && (
<div style={{ border: "2px solid var(--ink)", borderRadius: "16px", padding: "22px" }}>
<div style={{ fontSize: "16px", marginBottom: "8px" }} className="h">Is this your company?</div>
<p style={{ margin: "0 0 13px", fontSize: "13.5px", fontWeight: "500", lineHeight: "1.6", color: "var(--slate)" }}>Claim the profile to maintain the summary, photos and contact details. Free; does not affect order.</p>
<Link href={`/register/?claim=${c.slug}`} style={{ background: "var(--red)", color: "#FFFFFF", fontWeight: "800", fontSize: "13.5px", padding: "0 20px", minHeight: "44px", borderRadius: "999px", display: "inline-flex", alignItems: "center" }}>Claim this profile</Link>
</div>
)}
</aside>
</div>
</section>
<div style={{ height: "4px", background: "var(--red)" }}></div>
    </Shell>
  );
}
