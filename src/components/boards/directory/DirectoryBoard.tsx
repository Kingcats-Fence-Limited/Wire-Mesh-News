"use client";

/* Ported 1:1 from canvas board Directory-D. Primary axis = application area (same vocabulary as the Applications section); secondary = product category. Paying companies are not pinned or placed apart: same list, same order, marked PAID MEMBER on the card. */
import Link from "next/link";
import { FilterBar } from "./FilterBar";
import { usePaidMembers } from "@/lib/paid-members";
import { useFlatParams } from "@/lib/use-flat-params";
import { MATERIAL_GROUP } from "@/data/vocab/material_group";
import { APPLICATION_AREA, APPLICATION_AREA_BY_CODE } from "@/data/vocab/application_area";
import { CATEGORY, CATEGORY_BY_CODE } from "@/data/vocab/category";
import { REGION } from "@/data/vocab/region";
import { COUNTRY_BY_CODE } from "@/data/vocab/country";
import { PRODUCT, PRODUCT_BY_CODE } from "@/data/vocab/product";
import { ORGANISATION_TYPE_BY_CODE } from "@/data/vocab/organisation_type";
import { fmtDateShort } from "@/lib/site";
import type { Company } from "@/lib/content/types";
import "@/styles/board-dir.css";
import { demoBg, logoSrc } from "@/lib/demo";
import { PageHeadArt, HEAD_ART } from "@/components/shell/PageHeadArt";

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
const MATERIALS: [string, string][] = MATERIAL_GROUP.map((m) => [m.code, m.labelEn]);
const regionOf = (alpha2: string) => COUNTRY_BY_CODE[alpha2]?.region;
const PER = 12;

/* Multi-select: a facet's values are comma-separated in the URL (product=a,b). Values within one
   facet are OR'd, facets are AND'd. `skip` leaves one facet out, for that facet's own counts. */
export const vals = (v?: string) => (v ? v.split(",").filter(Boolean) : []);
type Facet = "app" | "category" | "product" | "region" | "material";
/** Everything the directory needs, prepared on the server so article bodies never reach the browser. */
export type DirData = { companies: Company[]; artCounts: Record<string, number> };
export function matches(c: Company, sp: DirParams, skip: Facet | undefined, artCount: (c: Company) => number) {
  const q = (sp.q ?? "").toLowerCase();
  const any = (f: Facet, test: (v: string) => boolean) => skip === f || vals(sp[f]).length === 0 || vals(sp[f]).some(test);
  return any("app", (v) => c.applications.includes(v)) && any("category", (v) => c.categories.includes(v)) && any("product", (v) => c.products.includes(v)) &&
    any("region", (v) => regionOf(c.country) === v) && any("material", (v) => !!c.materials?.includes(v as never)) &&
    (sp.claimed !== "1" || c.claimed) && (sp.photos !== "1" || c.productCards.some((p) => p.photos > 0)) && (sp.covered !== "1" || artCount(c) > 0) &&
    (!q || `${c.name} ${c.city} ${COUNTRY_BY_CODE[c.country]?.name ?? ""} ${c.products.map((p) => PRODUCT_BY_CODE[p]?.labelEn ?? p).join(" ")} ${c.summary}`.toLowerCase().includes(q));
}

export function filterCompanies(sp: DirParams, data: DirData) {
  const art = (c: Company) => data.artCounts[c.slug] ?? 0;
  let list = data.companies.filter((c) => matches(c, sp, undefined, art));
  list = [...list].sort((a, b) => (sp.sort === "covered" ? art(b) - art(a) || a.name.localeCompare(b.name) : sp.sort === "recent" ? (a.updated < b.updated ? 1 : -1) : a.name.localeCompare(b.name)));
  return list;
}

/* The page is static: the server renders the unfiltered directory, and this reads the
   filters from the address bar in the browser. */
export function DirectoryFromUrl({ data }: { data: DirData }) {
  return <DirectoryBoard sp={useFlatParams<DirParams>()} data={data} />;
}

export function DirectoryBoard({ sp, data }: { sp: DirParams; data: DirData }) {
  const COMPANIES = data.companies;
  const paid = usePaidMembers(COMPANIES);
  const list = filterCompanies(sp, data);
  const page = Math.max(1, parseInt(sp.page ?? "1") || 1);
  const pages = Math.max(1, Math.ceil(list.length / PER));
  const slice = list.slice((page - 1) * PER, page * PER);
  const art = (c: Company) => data.artCounts[c.slug] ?? 0;
  const countries = new Set(COMPANIES.map((c) => c.country)).size;
  const href = (patch: Partial<DirParams>) => {
    const merged: Record<string, string | undefined> = { ...sp, page: undefined, ...patch };
    const p = new URLSearchParams();
    for (const [k, v] of Object.entries(merged)) if (v) p.set(k, v);
    const s = p.toString();
    return `/directory/${s ? `?${s}` : ""}`;
  };
  const toggle = (k: keyof DirParams, v: string) => { const cur = vals(sp[k]); const next = cur.includes(v) ? cur.filter((x) => x !== v) : [...cur, v]; return href({ [k]: next.length ? next.join(",") : undefined }); };
  const has = (k: Facet, v: string) => vals(sp[k]).includes(v);
  /* Faceted count: companies that match every other active filter and have this value. */
  const fc = (k: Facet, f: (c: Company) => boolean) => COMPANIES.filter((c) => matches(c, sp, k, art) && f(c)).length;
  const chips = (k: Facet, label: (v: string) => string) => vals(sp[k]).map((v) => ({ label: label(v), href: toggle(k, v) }));
  const active: { label: string; href: string }[] = [
    ...chips("app", (v) => APPLICATION_AREA_BY_CODE[v]?.labelEn ?? v),
    ...chips("category", (v) => CATEGORY_BY_CODE[v]?.labelEn ?? v),
    ...chips("product", (v) => PRODUCT_BY_CODE[v]?.labelEn ?? v),
    ...chips("region", (v) => REGION.find((r) => r.code === v)?.labelEn ?? v),
    ...chips("material", (v) => MATERIALS.find((m) => m[0] === v)?.[1] ?? v),
    sp.claimed === "1" && { label: "Claimed", href: href({ claimed: undefined }) },
    sp.photos === "1" && { label: "Has photos", href: href({ photos: undefined }) },
    sp.covered === "1" && { label: "In our coverage", href: href({ covered: undefined }) },
    sp.q && { label: `“${sp.q}”`, href: href({ q: undefined }) },
  ].filter(Boolean) as { label: string; href: string }[];
  const countBy = (f: (c: Company) => boolean) => COMPANIES.filter(f).length;
  const sort = sp.sort ?? "az";

  return (
    <>
{/* 页头 */}
<section style={{ background: "var(--surface-dark)", color: "#FFFFFF", position: "relative", overflow: "hidden" }}>
<PageHeadArt src={HEAD_ART.panels} />
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
<input key={sp.q ?? ""} id="ds" name="q" defaultValue={sp.q ?? ""} type="search" placeholder="Search by company, product or country" style={{ border: "0", outline: "0", flex: "1 1 auto", fontFamily: "inherit", fontSize: "15.5px", fontWeight: "500", minHeight: "48px", color: "var(--ink)", background: "transparent" }} />
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
  const on = has("app", a.code);
  return (
<Link key={a.code} href={toggle("app", a.code)} scroll={false} className={`cat${on ? " on" : ""}`}>
<svg aria-hidden="true" style={{ color: on ? "#FFFFFF" : "var(--line-2)", opacity: on ? ".22" : undefined }} className="pat"><rect width="120" height="120" fill={`url(#${APP_PAT[a.code]})`} /></svg>
<svg width="25" height="25" viewBox="0 0 24 24" fill="none" stroke={on ? "#FFFFFF" : "var(--red)"} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" style={{ position: "relative" }}><path d={APP_ICON[a.code]} /></svg>
<span style={{ fontSize: "16px", position: "relative" }} className="h">{a.labelEn}</span>
<span style={{ fontSize: "12px", fontWeight: "500", lineHeight: "1.45", color: on ? "rgba(255,255,255,.72)" : "var(--slate)", position: "relative" }}>{APP_SUB[a.code]}</span>
<span style={{ marginTop: "auto", paddingTop: "10px", borderTop: on ? "1px solid rgba(255,255,255,.2)" : "1px solid var(--line-soft)", position: "relative" }}><span style={{ fontSize: "11px", fontWeight: "800", color: on ? "#FFFFFF" : "var(--grey)" }} className="mono">{((n) => `${n} ${n === 1 ? "company" : "companies"}`)(countBy((c) => c.applications.includes(a.code)))}</span></span>
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
    { key: "app", label: "Application", wide: true, note: "Primary axis — each company carries at most two application areas, assigned by editors.", items: APPLICATION_AREA.map((a) => ({ label: a.labelEn, sub: APP_SUB[a.code], href: toggle("app", a.code), on: has("app", a.code), count: fc("app", (c) => c.applications.includes(a.code)) })) },
    { key: "region", label: "Region", items: REGION.map((r) => ({ label: r.labelEn, href: toggle("region", r.code), on: has("region", r.code), count: fc("region", (c) => regionOf(c.country) === r.code) })).filter((x) => x.count > 0 || x.on) },
    { key: "product", label: "Product", note: "The full product vocabulary, grouped by family — the same list companies use for their product range", items: [], groups: CATEGORY.map((cat) => ({ title: cat.labelEn, items: PRODUCT.filter((pr) => pr.category === cat.code).map((pr) => ({ label: pr.labelEn, href: toggle("product", pr.code), on: has("product", pr.code), count: fc("product", (c) => c.products.includes(pr.code)) })) })) },
  ]}
  rows={[
    { label: "MATERIAL", ticks: MATERIALS.map(([k, l]) => ({ label: l, href: toggle("material", k), on: has("material", k), count: fc("material", (c) => !!c.materials?.includes(k as never)) })) },
    { label: "PROFILE", ticks: [
      { label: "Claimed", href: href({ claimed: sp.claimed === "1" ? undefined : "1" }), on: sp.claimed === "1", count: COMPANIES.filter((c) => matches(c, { ...sp, claimed: undefined }, undefined, art) && c.claimed).length },
      { label: "Has photos", href: href({ photos: sp.photos === "1" ? undefined : "1" }), on: sp.photos === "1", count: COMPANIES.filter((c) => matches(c, { ...sp, photos: undefined }, undefined, art) && c.productCards.some((p) => p.photos > 0)).length },
      { label: "In our coverage", href: href({ covered: sp.covered === "1" ? undefined : "1" }), on: sp.covered === "1", count: COMPANIES.filter((c) => matches(c, { ...sp, covered: undefined }, undefined, art) && art(c) > 0).length },
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
{/* Paying companies are not pinned or placed apart: they sit in the same list, in the same order, with a PAID MEMBER mark on their card. */}
<div style={{ display: "flex", gap: "10px", alignItems: "flex-start", marginTop: "18px", padding: "12px 16px", border: "1px solid var(--line)", borderRadius: "12px", background: "var(--paper-2)" }}>
<span style={{ background: "var(--st-review-bg)", color: "var(--st-review-fg)", flexShrink: 0 }} className="cert">PAID MEMBER</span>
<p style={{ margin: "0", fontSize: "12px", lineHeight: "1.6" }} className="meta">Every company is listed free, in the same order for everyone: alphabetical, by coverage or by update date. Companies that pay for the Company plan carry a <b style={{ color: "var(--ink)" }}>PAID MEMBER</b> mark; paying never moves a company up, pins it or hides others. <Link href="/policies/directory-listing-policy/" style={{ color: "var(--red-text)", fontWeight: 800 }}>Listing policy</Link></p>
</div>
{/* 企业卡片：全部等宽 */}
<div id="apps" style={{ display: "flex", alignItems: "center", gap: "12px", margin: "26px 0 14px" }}>
<span style={{ fontSize: "10.5px", fontWeight: "800", letterSpacing: ".14em", color: "var(--grey)" }} className="mono">ALL COMPANIES &#183; {sort === "az" ? "A–Z" : sort === "covered" ? "MOST COVERED" : "RECENTLY UPDATED"}</span>
<span style={{ flex: "1 1 0", height: "1px", background: "var(--line)" }}></span>
<span style={{ fontSize: "11.5px" }} className="meta">Editorial listing; order is unrelated to payment</span>
</div>
{slice.length === 0 && <p className="meta" style={{ margin: "20px 0", fontSize: "14px" }}>No companies match these filters. <Link href="/directory/" style={{ color: "var(--red-text)", fontWeight: 800 }}>Clear all</Link></p>}
<div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "18px", alignItems: "stretch" }} className="g3">
{slice.map((c) => {
  const photos = c.productCards.reduce((n, x) => n + x.photos, 0);
  const cert = c.certifications.find((x) => x.verified);
  const n = art(c);
  return (
<Link key={c.slug} href={`/directory/${c.slug}/`} className="card">
<span className="band" aria-hidden="true" />
<div className="cbody">
<div style={{ display: "flex", gap: "12px", alignItems: "flex-start" }}>
<span style={{ position: "relative", overflow: "hidden", display: "inline-flex", alignItems: "center", justifyContent: "center" }} className="logo"><img src={logoSrc(c.slug)} alt="" width="52" height="52" style={{ display: "block", width: "52px", height: "52px" }} /></span>
<span style={{ display: "flex", flexDirection: "column", gap: "5px", minWidth: "0", flex: "1 1 auto" }}><span className="role">{(ORGANISATION_TYPE_BY_CODE[c.orgType]?.labelEn ?? c.orgType).toUpperCase()}</span><span style={{ fontSize: "19px" }} className="h">{c.name}</span></span>
<span style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: "7px", flexShrink: "0" }}><span className="cc">{c.country}</span>{c.claimed && <span style={{ background: "var(--ink)", color: "var(--on-ink)" }} className="cert">&#9679; CLAIMED</span>}{paid.has(c.slug) && <span style={{ background: "var(--st-review-bg)", color: "var(--st-review-fg)" }} className="cert" title="Pays for the Company plan. Payment does not change its place in the list.">PAID MEMBER</span>}</span>
</div>
{photos > 0 && (
<div style={{ display: "flex", gap: "6px" }}>
<span className="ph2" style={{ height: "58px", ...demoBg(c.products[0] ?? c.slug) }}></span>
<span className="ph2" style={{ height: "58px", ...demoBg(c.products[1] ?? c.slug, c.products[1] ? 0 : 5) }}></span>
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
    </>
  );
}
