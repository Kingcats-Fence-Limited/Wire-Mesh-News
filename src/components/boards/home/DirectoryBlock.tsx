/* Ported 1:1 from canvas Home-A "Company Directory" block: intro + counts + browse-by-use list, four recently-updated company cards. */
import Link from "next/link";
import type { Company } from "@/lib/content/types";
import { CATEGORY } from "@/data/vocab/category";
import { ORGANISATION_TYPE_BY_CODE } from "@/data/vocab/organisation_type";
import { PRODUCT_BY_CODE } from "@/data/vocab/product";
import { CATEGORY_BY_CODE } from "@/data/vocab/category";

const CAT_PAT: Record<string, string> = { fencing: "pWeld", reinforcement: "pChainL", filtration: "pWoven", access: "pGrate", materials_services: "pPerf" };

function Card({ c, articles }: { c: Company; articles: number }) {
  const p = CAT_PAT[c.categories[0]] ?? "pWeld";
  const tags = [CATEGORY_BY_CODE[c.categories[0]]?.labelEn, PRODUCT_BY_CODE[c.products[0]]?.labelEn].filter(Boolean) as string[];
  const cert = c.certifications.find((x) => x.verified);
  return (
    <Link href={`/directory/${c.slug}/`} style={{ background: "#FFFFFF", border: "1px solid var(--line)", borderRadius: "14px", overflow: "hidden", display: "flex", flexDirection: "column" }}>
<span style={{ display: "block", height: "7px", background: "var(--ink)", position: "relative", overflow: "hidden" }}><svg style={{ position: "absolute", inset: "0", width: "100%", height: "7px", color: "#FFFFFF", opacity: ".45" }} aria-hidden="true"><rect width="100%" height="7" fill={`url(#${p})`} /></svg></span>
<span style={{ display: "flex", flexDirection: "column", gap: "10px", padding: "16px 16px 14px", flex: "1 1 auto" }}>
<span style={{ display: "flex", gap: "11px", alignItems: "flex-start" }}>
<span style={{ width: "44px", height: "44px", borderRadius: "10px", background: "#EDEEF2", flexShrink: "0", position: "relative", overflow: "hidden" }}><svg style={{ position: "absolute", inset: "0", width: "44px", height: "44px", color: "#C9CCD6" }} aria-hidden="true"><rect width="44" height="44" fill={`url(#${p})`} /></svg></span>
<span style={{ flex: "1 1 auto", minWidth: "0" }}><span className="mono" style={{ display: "block", fontSize: "9.5px", fontWeight: "800", letterSpacing: ".1em", color: "var(--grey)", marginBottom: "3px" }}>{(ORGANISATION_TYPE_BY_CODE[c.orgType]?.labelEn ?? c.orgType).toUpperCase()}</span><span className="h" style={{ display: "block", fontSize: "16.5px", lineHeight: "1.15" }}>{c.name}</span></span>
<span style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: "5px", flexShrink: "0" }}><span className="mono" style={{ border: "1.5px solid var(--line)", borderRadius: "4px", padding: "3px 6px", fontSize: "9.5px", fontWeight: "800", color: "var(--slate)" }}>{c.country}</span>{c.claimed && <span style={{ background: "var(--ink)", color: "#FFFFFF", fontSize: "8.5px", fontWeight: "800", letterSpacing: ".1em", padding: "3px 7px", borderRadius: "3px" }}>&#9679; CLAIMED</span>}</span>
</span>
<span style={{ display: "flex", gap: "5px", flexWrap: "wrap" }}>{tags.map((t) => <span key={t} className="tag" style={{ background: "#F2F3F5", border: "0", borderRadius: "6px", padding: "4px 9px", fontSize: "11px", fontWeight: "700", color: "var(--fg-3)" }}>{t}</span>)}{cert && <span className="tag" style={{ background: "#F2F3F5", border: "0", borderRadius: "6px", padding: "4px 9px", fontSize: "11px", fontWeight: "700", color: "var(--fg-3)" }}>&#10003; {cert.type.replace(/_/g, " ").toUpperCase()}</span>}</span>
<span style={{ marginTop: "auto", display: "flex", alignItems: "center", justifyContent: "space-between", borderTop: "1px solid var(--line-soft)", paddingTop: "10px" }}><span className="mono" style={{ fontSize: "10.5px", fontWeight: "800", color: "var(--grey)" }}>{articles} ARTICLES</span><span style={{ width: "26px", height: "26px", borderRadius: "999px", background: "var(--ink)", color: "#FFFFFF", display: "inline-flex", alignItems: "center", justifyContent: "center" }}><svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6" /></svg></span></span>
</span>
</Link>
  );
}

export function DirectoryBlock({ companies, countries, claimed, byCategory, recent, articleCounts, updatedThisWeek }: { companies: number; countries: number; claimed: number; byCategory: Record<string, number>; recent: Company[]; articleCounts: Record<string, number>; updatedThisWeek: number }) {
  return (
    <>
<section style={{ background: "var(--paper)", borderTop: "1px solid var(--line)", padding: "50px 0" }}>
<div className="wrap">
<div className="sec" style={{ marginBottom: "22px" }}><span className="node"></span><h2>Company Directory</h2><span className="rule"></span><Link href="/directory/">BROWSE ALL &#8594;</Link></div>
<div className="split" style={{ display: "grid", gridTemplateColumns: "300px 1fr", gap: "36px", alignItems: "start" }}>
<div>
<p style={{ margin: "0 0 16px", fontSize: "15px", fontWeight: "500", lineHeight: "1.6", color: "var(--fg-3)" }}>The manufacturers, processors, labs and standards bodies that appear in our reporting. Edited and maintained by us; listing and ranking are never paid.</p>
<div style={{ display: "flex", gap: "22px", marginBottom: "18px" }}>
<span><span className="mono h" style={{ display: "block", fontSize: "26px" }}>{companies}</span><span className="mono" style={{ fontSize: "9.5px", fontWeight: "800", letterSpacing: ".1em", color: "var(--grey)" }}>COMPANIES</span></span>
<span><span className="mono h" style={{ display: "block", fontSize: "26px" }}>{countries}</span><span className="mono" style={{ fontSize: "9.5px", fontWeight: "800", letterSpacing: ".1em", color: "var(--grey)" }}>COUNTRIES</span></span>
<span><span className="mono h" style={{ display: "block", fontSize: "26px" }}>{claimed}</span><span className="mono" style={{ fontSize: "9.5px", fontWeight: "800", letterSpacing: ".1em", color: "var(--grey)" }}>CLAIMED</span></span>
</div>
<div className="mono" style={{ fontSize: "9.5px", fontWeight: "800", letterSpacing: ".12em", color: "var(--grey)", marginBottom: "8px" }}>BROWSE BY USE</div>
<div style={{ display: "flex", flexDirection: "column", gap: "6px", marginBottom: "18px" }}>
{CATEGORY.map((cat) => (
<Link key={cat.code} href={`/directory/?category=${cat.code}`} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", background: "#FFFFFF", border: "1px solid var(--line)", borderRadius: "10px", padding: "10px 13px", fontSize: "13.5px", fontWeight: "800" }}>{cat.labelEn}<span className="mono" style={{ fontSize: "11px", color: "var(--grey)" }}>{byCategory[cat.code] ?? 0}</span></Link>
))}
</div>
<Link href="/directory/#claim" style={{ display: "inline-flex", alignItems: "center", gap: "8px", fontSize: "12.5px", fontWeight: "800", letterSpacing: ".06em", color: "var(--red)" }}>IS THIS YOUR COMPANY? CLAIM IT &#8594;</Link>
</div>
<div>
<div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: "12px", marginBottom: "12px" }}>
<span className="mono" style={{ fontSize: "10px", fontWeight: "800", letterSpacing: ".12em", color: "var(--grey)" }}>RECENTLY UPDATED &#183; EDITORIAL LISTING, NOT PAID</span>
<span className="mono" style={{ fontSize: "10px", fontWeight: "800", letterSpacing: ".12em", color: "var(--grey)" }}>{updatedThisWeek} UPDATED THIS WEEK</span>
</div>
<div className="g2" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "14px" }}>
{recent.slice(0, 4).map((c) => <Card key={c.slug} c={c} articles={articleCounts[c.slug] ?? 0} />)}
</div>
</div>
</div>
</div>
</section>
    </>
  );
}
