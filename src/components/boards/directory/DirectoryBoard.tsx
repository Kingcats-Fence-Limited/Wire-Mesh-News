/* Ported 1:1 from canvas board Directory-D. Primary axis = application area (same vocabulary as the Applications section); secondary = product category. The sponsored block is physically separated from the editorial list and always labelled. */
import Link from "next/link";
import { Shell } from "@/components/shell/Shell";
import { FilterBar } from "./FilterBar";
import { COMPANIES, SPONSORED } from "@/lib/content/directory";
import { ARTICLES } from "@/lib/content/articles";
import { MATERIAL_GROUP, APPLICATION_AREA, CATEGORY, REGION, COUNTRY_BY_CODE, PRODUCT, PRODUCT_BY_CODE, ORGANISATION_TYPE_BY_CODE, CATEGORY_BY_CODE, APPLICATION_AREA_BY_CODE } from "@/data/vocab";
import { fmtDateShort } from "@/lib/site";
import type { Company } from "@/lib/content/types";
import "@/styles/board-dir.css";
import { demoBg, logoSrc } from "@/lib/demo";

export type DirParams = { app?: string; category?: string; product?: string; region?: string; material?: string; claimed?: string; photos?: string; covered?: string; sort?: string; page?: string; q?: string };

const APP_ICON: Record<string, string> = {
  architecture: "M3 21h18M5 21V9l7-5 7 5v12M10 21v-6h4v6",
  industrial_security: "M12 3l7 3v5c0 4.2-2.9 8-7 10-4.1-2-7-5.8-7-10V6zM9.5 12l1.8 1.8 3.5-3.6",
  agriculture: "M12 21V9M12 9c0-3 2-5 5-5 0 3-2 5-5 5M12 12c0-3-2-5-5-5 0 3 2 5 5 5M5 21h14",
  energy_environment: "M13 3L5 14h6l-1 7 8-11h-6z",
  sports_lifestyle: "M12 3a9 9 0 1 0 0 18 9 9 0 0 0 0-18M12 3c3 3 3 15 0 18M12 3c-3 3-3 15 0 18M3 12h18",
};
const APP_PAT: Record<string, string> = { architecture: "pWoven", industrial_security: "pChain", agriculture: "pWeld", energy_environment: "pPerf", sports_lifestyle: "pExp" };
const APP_SUB: Record<string, string> = { architecture: "Façade mesh, bridge screens, gabion walls", industrial_security: "Site perimeters, anti-climb, machine guarding", agriculture: "Livestock fencing, poultry netting, crop support", energy_environment: "Solar sites, screening and filtration, dust", sports_lifestyle: "Ball courts, pools, gardens" };
const CAT_PAT: Record<string, string> = { fencing: "pWeld", reinforcement: "pChainL", filtration: "pWoven", access: "pGrate", materials_services: "pPerf" };
const MATERIALS: [string, string][] = MATERIAL_GROUP.map((m) => [m.code, m.labelEn]);
const regionOf = (alpha2: string) => COUNTRY_BY_CODE[alpha2]?.region;
const PER = 12;

export function filterCompanies(sp: DirParams) {
  const q = (sp.q ?? "").toLowerCase();
  const art = (c: Company) => ARTICLES.filter((a) => a.companies?.includes(c.slug)).length;
  let list = COMPANIES.filter((c) =>
    (!sp.app || c.applications.includes(sp.app)) && (!sp.category || c.categories.includes(sp.category)) && (!sp.product || c.products.includes(sp.product)) && (!sp.region || regionOf(c.country) === sp.region) &&
    (!sp.material || c.materials?.includes(sp.material as never)) && (sp.claimed !== "1" || c.claimed) && (sp.photos !== "1" || c.productCards.some((p) => p.photos > 0)) && (sp.covered !== "1" || art(c) > 0) &&
    (!q || `${c.name} ${c.city} ${COUNTRY_BY_CODE[c.country]?.name ?? ""} ${c.products.map((p) => PRODUCT_BY_CODE[p]?.labelEn ?? p).join(" ")} ${c.summary}`.toLowerCase().includes(q)));
  list = [...list].sort((a, b) => (sp.sort === "covered" ? art(b) - art(a) || a.name.localeCompare(b.name) : sp.sort === "recent" ? (a.updated < b.updated ? 1 : -1) : a.name.localeCompare(b.name)));
  return list;
}

export function DirectoryBoard({ sp }: { sp: DirParams }) {
  const list = filterCompanies(sp);
  const page = Math.max(1, parseInt(sp.page ?? "1") || 1);
  const pages = Math.max(1, Math.ceil(list.length / PER));
  const slice = list.slice((page - 1) * PER, page * PER);
  const art = (c: Company) => ARTICLES.filter((a) => a.companies?.includes(c.slug)).length;
  const countries = new Set(COMPANIES.map((c) => c.country)).size;
  const href = (patch: Partial<DirParams>) => {
    const merged: Record<string, string | undefined> = { ...sp, page: undefined, ...patch };
    const p = new URLSearchParams();
    for (const [k, v] of Object.entries(merged)) if (v) p.set(k, v);
    const s = p.toString();
    return `/directory/${s ? `?${s}` : ""}`;
  };
  const toggle = (k: keyof DirParams, v: string) => href({ [k]: sp[k] === v ? undefined : v });
  const active: { label: string; href: string }[] = [
    sp.app && { label: APPLICATION_AREA_BY_CODE[sp.app]?.labelEn ?? sp.app, href: href({ app: undefined }) },
    sp.category && { label: CATEGORY_BY_CODE[sp.category]?.labelEn ?? sp.category, href: href({ category: undefined }) },
    sp.product && { label: PRODUCT_BY_CODE[sp.product]?.labelEn ?? sp.product, href: href({ product: undefined }) },
    sp.region && { label: REGION.find((r) => r.code === sp.region)?.labelEn ?? sp.region, href: href({ region: undefined }) },
    sp.material && { label: MATERIALS.find((m) => m[0] === sp.material)?.[1] ?? sp.material, href: href({ material: undefined }) },
    sp.claimed === "1" && { label: "Claimed", href: href({ claimed: undefined }) },
    sp.photos === "1" && { label: "Has photos", href: href({ photos: undefined }) },
    sp.covered === "1" && { label: "In our coverage", href: href({ covered: undefined }) },
    sp.q && { label: `“${sp.q}”`, href: href({ q: undefined }) },
  ].filter(Boolean) as { label: string; href: string }[];
  const countBy = (f: (c: Company) => boolean) => COMPANIES.filter(f).length;
  const sort = sp.sort ?? "az";

  return (
    <Shell header="compact" active="directory" board="b-dir">
{/* 页头 */}
<section style={{ background: "var(--surface-dark)", color: "#FFFFFF", position: "relative", overflow: "hidden" }}>
<svg style={{ position: "absolute", inset: "0", width: "100%", height: "100%", color: "var(--mesh-dark)" }} aria-hidden="true"><rect width="100%" height="100%" fill="url(#mp)" /></svg>
<svg width="520" height="520" viewBox="0 0 120 120" style={{ position: "absolute", right: "-90px", top: "-120px", color: "#1A1B23" }} aria-hidden="true"><use href="#w2" width="120" height="120" /></svg>
<div style={{ position: "relative", paddingTop: "36px", paddingBottom: "32px" }} className="wrap">
<nav aria-label="Breadcrumb" style={{ fontSize: "12.5px", fontWeight: "500", color: "var(--grey-2)", marginBottom: "16px" }}><Link href="/" style={{ color: "var(--grey-2)" }}>Home</Link> / <span style={{ color: "#FFFFFF", fontWeight: "800" }}>Directory</span></nav>
<div style={{ display: "grid", gridTemplateColumns: "1.4fr 1fr", gap: "44px", alignItems: "end" }} className="cols">
<div>
<h1 style={{ margin: "0 0 12px", fontSize: "50px", letterSpacing: "-.055em", color: "#FFFFFF", lineHeight: "1" }} className="h">Company Directory<span style={{ color: "var(--red-text)" }}>.</span></h1>
<p style={{ margin: "0", fontSize: "16.5px", fontWeight: "500", lineHeight: "1.6", color: "#B9BCC6", maxWidth: "580px" }}>The manufacturers, processors, institutions and laboratories that appear in our reporting. Compiled and maintained by editors, with each fact sourced. Listing and order are never paid for.</p>
</div>
<div style={{ display: "flex", gap: "30px", flexWrap: "wrap", justifyContent: "flex-end" }}>
<div><div style={{ fontSize: "32px", color: "#FFFFFF" }} className="mono h">{COMPANIES.length}</div><div style={{ color: "var(--grey-5)", fontSize: "11px", fontWeight: "800", letterSpacing: ".1em" }}>COMPANIES</div></div>
<div><div style={{ fontSize: "32px", color: "#FFFFFF" }} className="mono h">{countries}</div><div style={{ color: "var(--grey-5)", fontSize: "11px", fontWeight: "800", letterSpacing: ".1em" }}>COUNTRIES</div></div>
<div><div style={{ fontSize: "32px", color: "#FFFFFF" }} className="mono h">{COMPANIES.filter((c) => c.claimed).length}</div><div style={{ color: "var(--grey-5)", fontSize: "11px", fontWeight: "800", letterSpacing: ".1em" }}>CLAIMED</div></div>
</div>
</div>
<form action="/directory/" method="get" style={{ display: "flex", alignItems: "center", gap: "11px", background: "var(--card)", borderRadius: "999px", padding: "0 20px", minHeight: "54px", marginTop: "24px", maxWidth: "640px" }}>
<svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="var(--grey)" strokeWidth="2.2" strokeLinecap="round" aria-hidden="true"><circle cx="11" cy="11" r="7" /><path d="M16.5 16.5 21 21" /></svg>
<label htmlFor="ds" style={{ position: "absolute", width: "1px", height: "1px", overflow: "hidden", clip: "rect(0 0 0 0)" }}>Search companies</label>
<input id="ds" name="q" defaultValue={sp.q ?? ""} type="search" placeholder="Search by company, product or country" style={{ border: "0", outline: "0", flex: "1 1 auto", fontFamily: "inherit", fontSize: "15.5px", fontWeight: "500", minHeight: "48px", color: "var(--ink)", background: "transparent" }} />
{sp.app && <input type="hidden" name="app" value={sp.app} />}
</form>
</div>
</section>
{/* 分类导航：主轴＝应用领域 */}
<section style={{ paddingTop: "28px", paddingBottom: "26px" }} className="wrap">
<div style={{ display: "flex", alignItems: "center", gap: "14px", marginBottom: "8px" }}>
<span style={{ width: "9px", height: "9px", borderRadius: "999px", background: "var(--red)" }}></span>
<span style={{ fontSize: "15px", letterSpacing: ".06em" }} className="h">BROWSE BY APPLICATION</span>
<span style={{ flex: "1 1 0", height: "2px", background: "var(--ink)" }}></span>
<span style={{ fontSize: "12px" }} className="meta util">Same five areas as the Applications section — articles and listings cross-link</span>
</div>
<p style={{ margin: "0 0 16px", fontSize: "11.5px", lineHeight: "1.55" }} className="meta">Each company carries at most <b style={{ color: "var(--ink)" }}>two</b> primary areas, assigned by editors from the projects we have covered, not self-declared. For what a company makes, open the Product filter.</p>
<div style={{ display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: "14px" }} className="g5">
{APPLICATION_AREA.map((a) => {
  const on = sp.app === a.code;
  return (
<Link key={a.code} href={toggle("app", a.code)} scroll={false} className={`cat${on ? " on" : ""}`}>
<svg aria-hidden="true" style={{ color: on ? "#FFFFFF" : "var(--line-2)", opacity: on ? ".22" : undefined }} className="pat"><rect width="120" height="120" fill={`url(#${APP_PAT[a.code]})`} /></svg>
<svg width="25" height="25" viewBox="0 0 24 24" fill="none" stroke={on ? "#FFFFFF" : "var(--red)"} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" style={{ position: "relative" }}><path d={APP_ICON[a.code]} /></svg>
<span style={{ fontSize: "16px", position: "relative" }} className="h">{a.labelEn}</span>
<span style={{ fontSize: "12px", fontWeight: "500", lineHeight: "1.45", color: on ? "rgba(255,255,255,.72)" : "var(--slate)", position: "relative" }}>{APP_SUB[a.code]}</span>
<span style={{ marginTop: "auto", paddingTop: "10px", borderTop: on ? "1px solid rgba(255,255,255,.2)" : "1px solid var(--line-soft)", position: "relative" }}><span style={{ fontSize: "11px", fontWeight: "800", color: on ? "#FFFFFF" : "var(--grey)" }} className="mono">{countBy((c) => c.applications.includes(a.code))} companies</span></span>
</Link>
  );
})}
</div>
</section>
{/* 筛选条 + 列表 */}
<section style={{ paddingBottom: "52px" }} className="wrap">
<FilterBar
  count={list.length}
  resetHref="/directory/"
  menus={[
    { key: "app", label: "Application", wide: true, note: "Primary axis — each company carries at most two application areas, assigned by editors.", items: APPLICATION_AREA.map((a) => ({ label: a.labelEn, sub: APP_SUB[a.code], href: toggle("app", a.code), on: sp.app === a.code, count: countBy((c) => c.applications.includes(a.code)) })) },
    { key: "region", label: "Region", items: REGION.map((r) => ({ label: r.labelEn, href: toggle("region", r.code), on: sp.region === r.code, count: countBy((c) => regionOf(c.country) === r.code) })).filter((x) => x.count > 0) },
    { key: "product", label: "Product", note: "The full product vocabulary, grouped by family — the same list companies use for their product range", items: [], groups: CATEGORY.map((cat) => ({ title: cat.labelEn, items: PRODUCT.filter((pr) => pr.category === cat.code).map((pr) => ({ label: pr.labelEn, href: toggle("product", pr.code), on: sp.product === pr.code, count: countBy((c) => c.products.includes(pr.code)) })) })) },
  ]}
  rows={[
    { label: "MATERIAL", ticks: MATERIALS.map(([k, l]) => ({ label: l, href: toggle("material", k), on: sp.material === k, count: countBy((c) => !!c.materials?.includes(k as never)) })) },
    { label: "PROFILE", ticks: [
      { label: "Claimed", href: href({ claimed: sp.claimed === "1" ? undefined : "1" }), on: sp.claimed === "1", count: countBy((c) => c.claimed) },
      { label: "Has photos", href: href({ photos: sp.photos === "1" ? undefined : "1" }), on: sp.photos === "1", count: countBy((c) => c.productCards.some((p) => p.photos > 0)) },
      { label: "In our coverage", href: href({ covered: sp.covered === "1" ? undefined : "1" }), on: sp.covered === "1", count: countBy((c) => art(c) > 0) },
    ] },
  ]}
  sort={<div role="group" aria-label="Sort" className="seg">
<Link href={href({ sort: undefined })} scroll={false} className={sort === "az" ? "on" : undefined}>A&#8211;Z</Link><Link href={href({ sort: "covered" })} scroll={false} className={sort === "covered" ? "on" : undefined}>Most covered</Link><Link href={href({ sort: "recent" })} scroll={false} className={sort === "recent" ? "on" : undefined}>Recent</Link>
</div>}
>
{active.length > 0 && (
<div style={{ background: "var(--paper-2)", padding: "12px 16px", display: "flex", alignItems: "center", gap: "9px", flexWrap: "wrap" }}>
<span style={{ fontSize: "10.5px", fontWeight: "800", letterSpacing: ".14em", color: "var(--grey)", marginRight: "2px" }} className="mono">ACTIVE</span>
{active.map((a) => <Link key={a.label} href={a.href} className="onchip">{a.label} <span style={{ opacity: ".75" }}>&#10005;</span></Link>)}
<Link href="/directory/" style={{ padding: "0 4px", fontSize: "12.5px", fontWeight: "800", color: "var(--red-text)" }}>CLEAR ALL</Link>
<span style={{ marginLeft: "auto", fontSize: "12px" }} className="meta util">Filters are written to the address bar — share the link as it is</span>
</div>
)}
</FilterBar>
{/* 付费展示位：独立成块，不进自然列表，不影响排序 */}
{SPONSORED.length > 0 && (
<div style={{ marginTop: "26px", border: "2px dashed var(--line-2)", borderRadius: "16px", padding: "18px 20px", background: "var(--paper-2)" }}>
<div style={{ display: "flex", alignItems: "center", gap: "10px", flexWrap: "wrap", marginBottom: "14px" }}>
<span style={{ display: "inline-flex", alignItems: "center", gap: "6px", background: "var(--ink)", color: "var(--on-ink)", fontSize: "9.5px", fontWeight: "800", letterSpacing: ".14em", padding: "5px 10px", borderRadius: "4px" }} className="badge">SPONSORED LISTING</span>
<span style={{ fontSize: "12px" }} className="meta">Paid placement · kept apart from the editorial list and never affects its order</span>
<Link href="/policies/directory-listing-policy/" style={{ marginLeft: "auto", fontSize: "11.5px", fontWeight: "800", letterSpacing: ".08em", color: "var(--red-text)" }}>WHY AM I SEEING THIS? &#8594;</Link>
</div>
<div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "18px" }} className="g3">
{SPONSORED.map((sx) => (
<a key={sx.name} href={sx.url} rel={sx.open ? undefined : "sponsored noopener"} target={sx.open ? undefined : "_blank"} style={{ borderColor: "var(--line-2)" }} className="card">
<span style={{ background: "var(--slate)" }} className="band"><svg width="100%" height="8" style={{ display: "block", color: "#FFFFFF", opacity: ".35" }} aria-hidden="true"><rect width="100%" height="8" fill="url(#pGrate)" /></svg></span>
<div className="cbody">
<div style={{ display: "flex", gap: "12px", alignItems: "flex-start" }}>
<span style={{ position: "relative", overflow: "hidden", display: "inline-flex", alignItems: "center", justifyContent: "center" }} className="logo"><svg width="52" height="52" style={{ position: "absolute", inset: "0", color: "var(--on-dark-2)" }} aria-hidden="true"><rect width="52" height="52" fill="url(#pGrate)" /></svg><span style={{ position: "relative", fontSize: "9px", fontWeight: "800", letterSpacing: ".08em", color: "#6E7384" }} className="mono">LOGO</span></span>
<span style={{ display: "flex", flexDirection: "column", gap: "5px", minWidth: "0", flex: "1 1 auto" }}><span className="role">{sx.role.toUpperCase()}</span><span style={{ fontSize: "19px" }} className="h">{sx.name}</span></span>
<span style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: "7px", flexShrink: "0" }}><span className="cc">{sx.country}</span><span style={{ background: "var(--st-withdrawn-bg)", color: "var(--slate)" }} className="cert">SPONSOR</span></span>
</div>
<p style={{ margin: "0", fontSize: "13.5px", fontWeight: "500", lineHeight: "1.6", color: "var(--slate)" }}>{sx.blurb}</p>
<div style={{ display: "flex", gap: "6px", flexWrap: "wrap" }}>{sx.tags.map((t) => <span key={t} className="tag">{t}</span>)}</div>
<div style={{ marginTop: "auto", display: "flex", alignItems: "center", justifyContent: "space-between", gap: "12px", borderTop: "1px solid var(--line-soft)", paddingTop: "13px" }}>
<span style={{ fontSize: "11.5px", fontWeight: "800", color: "var(--grey)" }} className="mono">{sx.open ? "ENQUIRE →" : "PAID PLACEMENT"}</span>
<span className="go"><svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6" /></svg></span>
</div>
</div>
</a>
))}
<div style={{ gridColumn: `span ${Math.max(1, 3 - SPONSORED.length)}`, display: "grid", gridTemplateColumns: SPONSORED.length >= 2 ? "1fr" : "1fr 1fr", gap: "18px" }} className="g2">
<div style={{ borderLeft: "4px solid var(--up)", padding: "18px 20px", display: "block" }} className="card">
<div style={{ fontSize: "15px", marginBottom: "10px" }} className="h">Free, for every company</div>
<ul style={{ margin: "0", paddingLeft: "17px", fontSize: "12.5px", fontWeight: "500", lineHeight: "1.8", color: "var(--fg-3)" }}>
<li>Listed, and shown in the list and in search</li>
<li>After claiming: your own profile text, product photos and contact details</li>
<li>Certification badges (certificate copy submitted and checked)</li>
<li>Links to and from our reporting</li>
<li><b>Position</b>: alphabetical, by coverage or by update date — never by payment</li>
</ul>
</div>
<div style={{ borderLeft: "4px solid var(--slate)", padding: "18px 20px", display: "block" }} className="card">
<div style={{ fontSize: "15px", marginBottom: "10px" }} className="h">What a sponsorship buys</div>
<ul style={{ margin: "0", paddingLeft: "17px", fontSize: "12.5px", fontWeight: "500", lineHeight: "1.8", color: "var(--fg-3)" }}>
<li>This <b>separate placement</b>, always marked SPONSORED</li>
<li>Your own wording and one outbound button</li>
<li>Extra product-photo and video slots</li>
<li>A fixed slot on the directory page and the related section pages</li>
<li><b>Not for sale</b>: list order, editorial coverage, certification badges, removal of competitors</li>
</ul>
</div>
</div>
</div>
<div style={{ display: "flex", gap: "10px", alignItems: "flex-start", marginTop: "14px", paddingTop: "13px", borderTop: "1px solid var(--line)" }}>
<span style={{ color: "var(--red-text)", fontWeight: "800", flexShrink: "0" }}>!</span>
<p style={{ margin: "0", fontSize: "11.5px", lineHeight: "1.65" }} className="meta">Three rules: <b style={{ color: "var(--ink)" }}>paid placements sit apart from the editorial list</b>, never mixed in or queued ahead; <b style={{ color: "var(--ink)" }}>the SPONSORED mark is always shown</b> and cannot be hidden; <b style={{ color: "var(--ink)" }}>payment changes no editorial order</b> and triggers no coverage. Placements are capped per page; when they are sold, no more are added. Enquiries: <Link href="/advertise/" style={{ color: "var(--red-text)", fontWeight: 800 }}>Advertise &amp; Partner</Link>.</p>
</div>
</div>
)}
{/* 企业卡片：全部等宽 */}
<div id="apps" style={{ display: "flex", alignItems: "center", gap: "12px", margin: "26px 0 14px" }}>
<span style={{ fontSize: "10.5px", fontWeight: "800", letterSpacing: ".14em", color: "var(--grey)" }} className="mono">ALL COMPANIES &#183; {sort === "az" ? "A–Z" : sort === "covered" ? "MOST COVERED" : "RECENTLY UPDATED"}</span>
<span style={{ flex: "1 1 0", height: "1px", background: "var(--line)" }}></span>
<span style={{ fontSize: "11.5px" }} className="meta">Editorial listing; order is unrelated to payment</span>
</div>
{slice.length === 0 && <p className="meta" style={{ margin: "20px 0", fontSize: "14px" }}>No companies match these filters. <Link href="/directory/" style={{ color: "var(--red-text)", fontWeight: 800 }}>Clear all</Link></p>}
<div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "18px", alignItems: "stretch" }} className="g3">
{slice.map((c) => {
  const p = CAT_PAT[c.categories[0]] ?? "pWeld";
  const photos = c.productCards.reduce((n, x) => n + x.photos, 0);
  const cert = c.certifications.find((x) => x.verified);
  const n = art(c);
  return (
<Link key={c.slug} href={`/directory/${c.slug}/`} className="card">
<span className="band"><svg width="100%" height="8" style={{ display: "block", color: "#FFFFFF", opacity: ".45" }} aria-hidden="true"><rect width="100%" height="8" fill={`url(#${p})`} /></svg></span>
<div className="cbody">
<div style={{ display: "flex", gap: "12px", alignItems: "flex-start" }}>
<span style={{ position: "relative", overflow: "hidden", display: "inline-flex", alignItems: "center", justifyContent: "center" }} className="logo"><img src={logoSrc(c.slug)} alt="" width="52" height="52" style={{ display: "block", width: "52px", height: "52px" }} /></span>
<span style={{ display: "flex", flexDirection: "column", gap: "5px", minWidth: "0", flex: "1 1 auto" }}><span className="role">{(ORGANISATION_TYPE_BY_CODE[c.orgType]?.labelEn ?? c.orgType).toUpperCase()}</span><span style={{ fontSize: "19px" }} className="h">{c.name}</span></span>
<span style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: "7px", flexShrink: "0" }}><span className="cc">{c.country}</span>{c.claimed && <span style={{ background: "var(--ink)", color: "var(--on-ink)" }} className="cert">&#9679; CLAIMED</span>}</span>
</div>
{photos > 0 && (
<div style={{ display: "flex", gap: "6px" }}>
<span className="ph2" style={{ height: "58px", ...demoBg(c.slug) }}></span>
<span className="ph2" style={{ height: "58px", ...demoBg(c.slug, 5) }}></span>
<span style={{ background: "var(--ink)", color: "var(--on-ink)", display: "inline-flex", alignItems: "center", justifyContent: "center", fontSize: "11.5px", fontWeight: "800" }} className="ph2">{photos > 2 ? `+${photos - 2} photos` : `${photos} photos`}</span>
</div>
)}
<p style={{ margin: "0", fontSize: "13.5px", fontWeight: "500", lineHeight: "1.6", color: "var(--slate)" }}>{c.summary}</p>
<div style={{ display: "flex", gap: "6px", flexWrap: "wrap" }}>
{c.applications.slice(0, 1).map((a) => <span key={a} style={{ background: "var(--ink)", color: "var(--on-ink)" }} className="tag">{APPLICATION_AREA_BY_CODE[a]?.labelEn}</span>)}
{c.categories.slice(0, 1).map((k) => <span key={k} className="tag">{CATEGORY_BY_CODE[k]?.labelEn}</span>)}
{c.products.slice(0, 1).map((k) => <span key={k} className="tag">{PRODUCT_BY_CODE[k]?.labelEn ?? k}</span>)}
{cert && <span className="cert">&#10003; {cert.type.replace(/_/g, " ").toUpperCase()}</span>}
</div>
<div style={{ marginTop: "auto", display: "flex", alignItems: "center", justifyContent: "space-between", gap: "12px", borderTop: "1px solid var(--line-soft)", paddingTop: "13px" }}>
<span style={{ fontSize: "11.5px", fontWeight: "800", color: "var(--grey)" }} className="mono">{n} ARTICLE{n === 1 ? "" : "S"} &#183; UPDATED {fmtDateShort(c.updated)}</span>
<span className="go"><svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6" /></svg></span>
</div>
</div>
</Link>
  );
})}
</div>
{/* 翻页条 */}
<div style={{ display: "flex", alignItems: "center", gap: "20px", flexWrap: "wrap", marginTop: "30px", paddingTop: "20px", borderTop: "3px solid var(--ink)" }}>
<span style={{ fontSize: "12px", fontWeight: "800", color: "var(--grey)" }} className="mono">SHOWING <span style={{ color: "var(--ink)" }}>{list.length ? (page - 1) * PER + 1 : 0}&#8211;{Math.min(page * PER, list.length)}</span> OF <span style={{ color: "var(--ink)" }}>{list.length}</span></span>
<nav aria-label="Pagination" style={{ display: "flex", gap: "9px", alignItems: "center", margin: "0 auto" }}>
{page > 1 ? <Link href={href({ page: String(page - 1) })} aria-label="Previous" className="pgn"><svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" aria-hidden="true"><path d="M19 12H5M11 6l-6 6 6 6" /></svg></Link> : <span aria-disabled="true" className="pgn" style={{ opacity: .4 }}><svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" aria-hidden="true"><path d="M19 12H5M11 6l-6 6 6 6" /></svg></span>}
{Array.from({ length: pages }, (_, i) => i + 1).map((n) => n === page ? <span key={n} aria-current="page" className="pgn on">{n}</span> : <Link key={n} href={href({ page: String(n) })} className="pgn">{n}</Link>)}
{page < pages && <Link href={href({ page: String(page + 1) })} style={{ padding: "0 18px", gap: "7px" }} className="pgn">Next<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" aria-hidden="true" style={{ marginLeft: "6px" }}><path d="M5 12h14M13 6l6 6-6 6" /></svg></Link>}
</nav>
<span style={{ fontSize: "12px", fontWeight: "800", letterSpacing: ".06em", color: "var(--grey)" }} className="util">PAGE {page} OF {pages}</span>
</div>
{/* 认领 CTA：深色勾花网 */}
<div id="claim" style={{ marginTop: "36px", position: "relative", overflow: "hidden", background: "var(--surface-dark)", color: "#FFFFFF", borderRadius: "18px", padding: "28px 30px" }}>
<svg style={{ position: "absolute", right: "0", top: "0", width: "420px", height: "100%", color: "#FFFFFF", opacity: ".14" }} aria-hidden="true" preserveAspectRatio="none" viewBox="0 0 420 200"><rect width="420" height="200" fill="url(#pChain)" /></svg>
<div style={{ position: "relative", display: "flex", gap: "26px", alignItems: "center", flexWrap: "wrap" }}>
<div style={{ flex: "1 1 420px" }}>
<div style={{ fontSize: "24px", marginBottom: "8px" }} className="h">Is this your company?</div>
<p style={{ margin: "0", fontSize: "14px", fontWeight: "500", lineHeight: "1.65", color: "#C4C7D2" }}>Once claimed, you maintain the summary, product photos and contact details yourself; changes go live after editorial review. Claiming is free and does not affect order.<br /><span style={{ color: "var(--grey-2)" }}>Companies owned by or related to this publication&#8217;s operator carry a relationship note on their profile; see <Link href="/about/" style={{ color: "#FFFFFF", fontWeight: "800", textDecoration: "underline" }}>About</Link>.</span></p>
</div>
<Link href="/register/?claim=1" style={{ background: "var(--red)", color: "#FFFFFF", fontWeight: "800", fontSize: "14.5px", padding: "0 26px", minHeight: "50px", borderRadius: "999px", display: "inline-flex", alignItems: "center" }}>Claim your profile &#8594;</Link>
</div>
</div>
</section>
<div style={{ height: "4px", background: "var(--red)" }}></div>
    </Shell>
  );
}
