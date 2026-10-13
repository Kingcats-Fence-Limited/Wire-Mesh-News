/* Ported 1:1 from canvas Home-A "Applications": five dark tiles (one per application area, mesh pattern as visual key) + latest-in-applications row. */
import Link from "next/link";
import type { ReactNode } from "react";
import type { Article } from "@/lib/content/types";
import { APPLICATION_AREA } from "@/data/vocab/application_area";
import { articleHref, subsectionLabel, subsectionSlug } from "@/lib/site";
import { demoBg, demoIndex } from "@/lib/demo";

const ICON: Record<string, ReactNode> = {
  architecture: <><path d="M2 18h20" /><path d="M5.5 18V6M18.5 18V6" /><path d="M2 13c3.2-4.4 6.4-6.6 10-6.6S19 8.6 22 13" /><path d="M9 18v-3.4M12 18v-4.4M15 18v-3.4" /></>,
  industrial_security: <><path d="M12 2.8l7.2 3v5.6c0 4.3-3 7.8-7.2 8.8-4.2-1-7.2-4.5-7.2-8.8V5.8z" /><path d="M8.6 7.5v8.2M12 6.6v9.8M15.4 7.5v8.2" /><path d="M5.6 10.6h12.8" /></>,
  agriculture: <><path d="M3.5 20.5h17" /><path d="M12 20.5V9.5" /><path d="M12 12.5c0-3 2.1-5.2 5.2-5.2 0 3-2.1 5.2-5.2 5.2z" /><path d="M12 15.6c0-2.6-1.9-4.6-4.7-4.6 0 2.6 1.9 4.6 4.7 4.6z" /><path d="M16.4 20.5V11" /></>,
  energy_environment: <><path d="M4.6 15.2L6.4 7h11.2l1.8 8.2z" /><path d="M11.8 7v8.2M8.4 7l-1.1 8.2M15.2 7l1.1 8.2M5.6 11.1h12.4" /><path d="M12 19v2.2M9.4 21.2h5.2" /><path d="M19.6 3.2l1.4-1.4M12 3.4V2M4.4 3.2L3 1.8" /></>,
  sports_lifestyle: <><path d="M3 8.6h18V20H3z" /><path d="M3 8.6L6.2 5h11.6L21 8.6" /><path d="M7.5 8.6V20M12 8.6V20M16.5 8.6V20M3 14.3h18" /></>,
};
const PATTERN: Record<string, string> = { expanded: "pExp", welded: "pWeldQ", woven: "pWoven", perforated: "pPerf", chain_link: "pChain" };
const TAGLINE: Record<string, string> = {
  architecture: "Buildings, bridges and civil works",
  industrial_security: "Plants, utilities and secure sites",
  agriculture: "Farms, estates and growers",
  energy_environment: "Generation, screening and treatment",
  sports_lifestyle: "Courts, homes and public spaces",
};
const TYPE_LABEL: Record<string, string> = { case_study: "CASE STUDY", guide: "GUIDE", news: "NEWS", analysis: "ANALYSIS", sponsored: "SPONSORED", column: "COLUMN" };

export function Applications({ counts, latest }: { counts: Record<string, number>; latest: Article[] }) {
  return (
    <>
<section style={{ position: "relative", overflow: "hidden", background: "#0E0F14", color: "#FFFFFF", padding: "54px 0" }}>
<span aria-hidden="true" style={{ position: "absolute", inset: "0", background: "radial-gradient(120% 90% at 50% -10%, #1A1C24 0%, #121318 52%, #0E0F14 100%)" }}></span>
<span style={{ position: "absolute", left: "0", right: "0", top: "0", height: "1px", background: "linear-gradient(90deg, rgba(229,36,47,.35) 0%, rgba(229,36,47,0) 30%)" }}></span>
<div className="wrap" style={{ position: "relative" }}>
<div className="sec" style={{ marginBottom: "10px" }}><span className="node"></span><h2 style={{ color: "#FFFFFF" }}>Applications</h2><span className="rule" style={{ background: "var(--line-dark)" }}></span><Link href="/applications/" style={{ color: "#FF4A54" }}>ALL APPLICATIONS &#8594;</Link></div>
<p className="meta" style={{ margin: "0 0 24px", color: "var(--grey-5)", fontSize: "13.5px" }}>Five application areas, the same five used to filter the Directory. Under each are typical uses in that area, not product names.</p>
<div className="g5 apps" style={{ display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: "16px" }}>
{APPLICATION_AREA.map((area, i) => (
<Link key={area.code} href={`/applications/${subsectionSlug(area.code)}/`} className="apptile" style={{ background: "#17181F", borderColor: "var(--line-dark)", minHeight: "268px", borderRadius: "18px", padding: "18px", justifyContent: "space-between" }}>
<svg className="pat" aria-hidden="true" style={{ opacity: ".07" }}><g transform="scale(1.45)"><rect width="200%" height="200%" fill={`url(#${PATTERN[area.pattern]})`} /></g></svg>
<span style={{ position: "absolute", inset: "0", background: "linear-gradient(180deg, rgba(23,24,31,0) 0%, rgba(23,24,31,.42) 34%, rgba(23,24,31,.93) 62%, #191A22 100%)" }}></span>
<span className="lbl aphead" style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between" }}>
<span style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", width: "44px", height: "44px", borderRadius: "12px", color: "#B9BCC6", background: "rgba(255,255,255,.04)", border: "1px solid var(--line-dark)" }} className="apic" aria-hidden="true">
<svg width="23" height="23" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">{ICON[area.code]}</svg>
</span>
<span className="mono" style={{ fontSize: "11px", fontWeight: "800", letterSpacing: ".1em", color: "#7D8292" }}>{String(i + 1).padStart(2, "0")}</span>
</span>
<span className="lbl" style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
<span className="h aph" style={{ fontSize: "18.5px", color: "#FFFFFF", letterSpacing: "-.035em" }}>{area.labelEn}</span>
<span className="aptag" style={{ fontSize: "11.5px", fontWeight: "500", color: "var(--grey-5)", marginBottom: "10px" }}>{TAGLINE[area.code]}</span>
<span className="aptag" style={{ height: "1px", background: "var(--line-dark)", marginBottom: "10px" }}></span>
<span style={{ display: "flex", flexDirection: "column", gap: "5px", marginBottom: "12px" }}>
{area.scenariosEn.split(";").slice(0, 3).map((s, k) => (
<span key={s} className={k === 2 ? "apsc3" : undefined} style={{ display: "flex", alignItems: "center", gap: "7px", fontSize: "12px", fontWeight: "500", color: "#A9ADBA" }}><span style={{ width: "6px", height: "1px", background: "#5A5E70", flexShrink: "0" }}></span>{s.trim()}</span>
))}
</span>
<span className="apfoot" style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: "8px" }}>
<span className="mono" style={{ fontSize: "10.5px", fontWeight: "800", letterSpacing: ".08em", color: "#9A9FB0" }}>{counts[area.code] ?? 0} {(counts[area.code] ?? 0) === 1 ? "ARTICLE" : "ARTICLES"}</span>
<span className="apgo" style={{ width: "28px", height: "28px", borderRadius: "999px", border: "1px solid var(--line-dark)", color: "#B9BCC6", display: "inline-flex", alignItems: "center", justifyContent: "center", flexShrink: "0" }}><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6" /></svg></span>
</span>
</span>
</Link>
))}
</div>
<div style={{ display: "flex", alignItems: "center", gap: "12px", margin: "30px 0 16px" }}>
<span className="h" style={{ fontSize: "14px", letterSpacing: ".08em", color: "var(--grey-2)" }}>LATEST IN APPLICATIONS</span>
<span style={{ flex: "1 1 0", height: "1px", background: "var(--line-dark)" }}></span>
</div>
<div className="g4" style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "18px" }}>
{(() => { const seen = new Set<number>(); return latest.slice(0, 4).map((a) => { let off = 0; while (seen.has(demoIndex(a.slug, off))) off += 1; seen.add(demoIndex(a.slug, off)); return (
<Link key={a.slug} href={articleHref(a)} style={{ display: "flex", flexDirection: "column", gap: "9px" }}><span style={{ position: "relative", overflow: "hidden", borderRadius: "12px", background: "#1C1E27", display: "block", aspectRatio: "16/10" }}><span className="demo" style={{ position: "absolute", inset: "0", display: "block", ...demoBg(a.slug, off) }} aria-hidden="true"></span></span><span className="kick" style={{ color: "var(--grey-2)" }}><i></i>{subsectionLabel(a.section, a.subsection).split(" & ")[0].toUpperCase()}</span><span className="h" style={{ fontSize: "17px", lineHeight: "1.22", color: "#FFFFFF" }}>{a.title}</span><span className="mono" style={{ fontSize: "11px", fontWeight: "700", color: "#9A9FB0" }}>{TYPE_LABEL[a.type]} &#183; {a.readMin} MIN</span></Link>
); }); })()}
</div>
</div>
</section>
    </>
  );
}
