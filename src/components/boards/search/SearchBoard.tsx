/* Ported 1:1 from canvas board Search-K: /search?q= with the same result types, badges and highlighting as the overlay (SearchOv-W). */
import Link from "next/link";
import { Shell } from "@/components/shell/Shell";
import { search, snippet, highlight, type SearchDoc, type SearchType } from "@/lib/search";
import { EDITORIAL_SECTIONS } from "@/lib/site";
import "@/styles/board-srch.css";
import { demoBg } from "@/lib/demo";

export type SearchParamsT = { q?: string; type?: string; section?: string; time?: string; sort?: string; page?: string };
const TYPES: { k: SearchType | "all"; label: string; badge: string; tp: string }[] = [
  { k: "all", label: "All", badge: "", tp: "" },
  { k: "article", label: "Articles", badge: "ARTICLE", tp: "art" },
  { k: "letter", label: "Letters & Opinion", badge: "LETTER", tp: "let" },
  { k: "company", label: "Companies", badge: "COMPANY", tp: "co" },
  { k: "standard", label: "Standards", badge: "STANDARD", tp: "std" },
  { k: "topic", label: "Topics", badge: "TOPIC", tp: "top" },
  { k: "event", label: "Events", badge: "EVENT", tp: "ev" },
];
const BADGE: Record<SearchType, [string, string]> = { article: ["ARTICLE", "art"], letter: ["LETTER", "let"], opinion: ["OPINION", "op"], company: ["COMPANY", "co"], standard: ["STANDARD", "std"], topic: ["TOPIC", "top"], event: ["EVENT", "ev"] };
const TIME: [string, string, number][] = [["any", "Any time", 0], ["month", "Past month", 31], ["quarter", "Past 3 months", 92], ["year", "Past year", 366]];
const RELATED: Record<string, string[]> = { default: ["coating weight", "zinc g/m²", "EN 10244", "PVC coated", "358 mesh", "anti-dumping"] };
const PER = 20;
const TODAY = new Date("2026-10-12");

function Thumb({ d }: { d: SearchDoc }) {
  const base = { width: "150px", aspectRatio: "4/3", borderRadius: "8px", display: "inline-flex", alignItems: "center", justifyContent: "center", flexShrink: "0" } as const;
  switch (d.type) {
    case "standard": return <span style={{ ...base, background: "var(--st-red-bg)", color: "var(--red-deep)" }}><svg width="34" height="34" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" aria-hidden="true"><path d="M12 3.2 4.8 6v5.4c0 4.3 3 7.8 7.2 9 4.2-1.2 7.2-4.7 7.2-9V6z" /><path d="m8.9 12 2.1 2.1 4-4.2" /></svg></span>;
    case "letter": case "opinion": return <span style={{ ...base, background: "var(--st-review-bg)", color: "var(--st-review-fg)" }}><svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" aria-hidden="true"><path d="M3 6.5h18v11H3z" /><path d="m3 7 9 6 9-6" /></svg></span>;
    case "company": return <span style={{ ...base, background: "var(--surface-dark)", color: "#FFFFFF" }}><svg width="42" height="42" viewBox="0 0 120 120" aria-hidden="true"><use href="#w1" width="120" height="120" /></svg></span>;
    case "topic": return <span style={{ ...base, background: "var(--red)", color: "#FFFFFF" }} className="h"><span style={{ fontSize: "34px" }} className="h">T</span></span>;
    case "event": return <span style={{ ...base, background: "var(--st-current-bg)", color: "var(--up)" }}><svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" aria-hidden="true"><rect x="3" y="5" width="18" height="16" rx="2.5" /><path d="M3 10h18M8 3v4M16 3v4" /></svg></span>;
    default: return <span style={{ width: "150px", aspectRatio: "4/3", ...demoBg(d.href) }} className="thumb"></span>;
  }
}

export function SearchBoard({ sp }: { sp: SearchParamsT }) {
  const q = (sp.q ?? "").trim();
  const type = (TYPES.some((t) => t.k === sp.type) ? sp.type : "all") as SearchType | "all";
  const section = sp.section && EDITORIAL_SECTIONS.some((s) => s.code === sp.section) ? sp.section : undefined;
  const time = TIME.find((t) => t[0] === sp.time) ?? TIME[0];
  const sort = sp.sort === "date" ? "date" : "relevance";
  const page = Math.max(1, parseInt(sp.page ?? "1") || 1);
  const within = (d: SearchDoc) => !time[2] || (d.date ? (TODAY.getTime() - new Date(d.date).getTime()) / 86400000 <= time[2] : d.type !== "article");
  const raw = q ? search(q, { type: "all" }) : [];
  const filtered = raw.filter((d) => (type === "all" || d.type === type || (type === "letter" && d.type === "opinion")) && (!section || d.section === section) && within(d));
  const list = sort === "date" ? [...filtered].sort((a, b) => (b.date ?? "").localeCompare(a.date ?? "")) : filtered;
  const pages = Math.max(1, Math.ceil(list.length / PER));
  const slice = list.slice((page - 1) * PER, page * PER);
  const countType = (k: SearchType | "all") => raw.filter((d) => (k === "all" || d.type === k || (k === "letter" && d.type === "opinion")) && (!section || d.section === section) && within(d)).length;
  const href = (patch: Partial<SearchParamsT>) => { const m: Record<string, string | undefined> = { ...sp, page: undefined, ...patch }; const p = new URLSearchParams(); for (const [k, v] of Object.entries(m)) if (v && v !== "all" && v !== "any" && v !== "relevance") p.set(k, v); const s = p.toString(); return `/search/${s ? `?${s}` : ""}`; };
  const active = [type !== "all" && TYPES.find((t) => t.k === type)?.label, section && EDITORIAL_SECTIONS.find((s) => s.code === section)?.label, time[2] ? time[1] : null].filter(Boolean) as string[];
  const filtersOn = active.length > 0;
  const suggestions = RELATED.default.filter((s) => s.toLowerCase() !== q.toLowerCase()).slice(0, 4);

  return (
    <Shell header="compact" board="b-srch">
<section style={{ paddingTop: "28px", paddingBottom: "0" }} className="wrap">
<nav aria-label="Breadcrumb" className="meta" style={{ marginBottom: "16px" }}><Link href="/" style={{ color: "var(--slate)" }}>Home</Link> / <b style={{ color: "var(--ink)" }}>Search</b></nav>
<div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", gap: "20px", marginBottom: "16px" }}>
<h1 style={{ margin: "0", fontSize: "34px", letterSpacing: "-.045em" }} className="h">Search<span style={{ color: "var(--red-text)" }}>.</span></h1>
<span style={{ display: "flex", alignItems: "center", gap: "7px", fontSize: "12px" }} className="meta util">Press <span className="kbd">/</span> anywhere for quick search</span>
</div>
<form action="/search/" method="get" style={{ display: "flex", alignItems: "center", gap: "12px", border: "2px solid var(--ink)", borderRadius: "999px", padding: "0 20px", minHeight: "56px", marginBottom: "18px" }}>
<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--ink)" strokeWidth="2.3" strokeLinecap="round" aria-hidden="true"><circle cx="11" cy="11" r="7" /><path d="M16.5 16.5 21 21" /></svg>
<label htmlFor="sq" style={{ position: "absolute", width: "1px", height: "1px", overflow: "hidden", clip: "rect(0 0 0 0)" }}>Search</label>
<input id="sq" name="q" type="search" defaultValue={q} placeholder="Articles, standards, companies, topics…" style={{ border: "0", outline: "0", flex: "1 1 auto", fontFamily: "inherit", fontSize: "17px", fontWeight: "500", minHeight: "50px", background: "transparent", minWidth: 0 }} />
{type !== "all" && <input type="hidden" name="type" value={type} />}
{section && <input type="hidden" name="section" value={section} />}
{q && <Link href="/search/" aria-label="Clear search" style={{ width: "34px", height: "34px", border: "0", borderRadius: "999px", background: "var(--paper)", color: "var(--slate)", fontSize: "15px", flexShrink: "0", display: "inline-flex", alignItems: "center", justifyContent: "center" }}>&#10005;</Link>}
<button type="submit" style={{ minHeight: "42px", border: "0", borderRadius: "999px", background: "var(--ink)", color: "var(--on-ink)", fontFamily: "inherit", fontSize: "14px", fontWeight: "800", padding: "0 22px", cursor: "pointer", flexShrink: "0" }}>Search</button>
</form>
{q && (<>
<div className="chips" style={{ display: "flex", gap: "9px", flexWrap: "wrap", alignItems: "center", marginBottom: "12px" }}>
<span style={{ fontSize: "12.5px", fontWeight: "800", letterSpacing: ".06em", color: "var(--grey)", marginRight: "3px", minWidth: "62px" }} className="meta">TYPE</span>
{TYPES.map((t) => <Link key={t.k} href={href({ type: t.k })} className={`chip${type === t.k ? " on" : ""}`}>{t.label} <span className="n">{countType(t.k)}</span></Link>)}
</div>
<div className="chips" style={{ display: "flex", gap: "9px", flexWrap: "wrap", alignItems: "center", paddingBottom: "22px", borderBottom: "1px solid var(--line)" }}>
<span style={{ fontSize: "12.5px", fontWeight: "800", letterSpacing: ".06em", color: "var(--grey)", marginRight: "3px", minWidth: "62px" }} className="meta">SECTION</span>
<Link href={href({ section: undefined })} className={`chip${section ? "" : " on"}`}>All</Link>
{EDITORIAL_SECTIONS.map((s) => <Link key={s.code} href={href({ section: s.code })} className={`chip${section === s.code ? " on" : ""}`}>{s.label}</Link>)}
<span style={{ width: "1px", height: "24px", background: "var(--line)", margin: "0 4px" }}></span>
<details style={{ position: "relative" }}><summary className="chip" style={{ listStyle: "none", cursor: "pointer" }}>{time[1]}<svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" aria-hidden="true"><path d="m5 8 7 7 7-7" /></svg></summary>
<div style={{ position: "absolute", left: 0, top: "calc(100% + 6px)", zIndex: 20, background: "var(--card)", border: "1px solid var(--line)", borderRadius: "12px", padding: "8px", display: "flex", flexDirection: "column", gap: "2px", minWidth: "180px", boxShadow: "0 20px 40px -26px rgba(21,22,28,.4)" }}>{TIME.map((t) => <Link key={t[0]} href={href({ time: t[0] })} style={{ padding: "8px 10px", borderRadius: "8px", fontSize: "13.5px", fontWeight: time[0] === t[0] ? 800 : 600, background: time[0] === t[0] ? "var(--paper)" : undefined }}>{t[1]}</Link>)}</div></details>
<span style={{ marginLeft: "auto", display: "flex", alignItems: "center", gap: "9px" }}><span style={{ fontSize: "12.5px", fontWeight: "800", letterSpacing: ".06em", color: "var(--grey)" }} className="meta">SORT</span><Link href={href({ sort: sort === "date" ? undefined : "date" })} className="chip">{sort === "date" ? "Newest" : "Relevance"}<svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" aria-hidden="true"><path d="m5 8 7 7 7-7" /></svg></Link></span>
</div>
</>)}
</section>
<section style={{ paddingTop: "28px", paddingBottom: "50px" }} className="wrap">
{!q ? (
<div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px", maxWidth: "760px" }} className="g2">
<div style={{ background: "var(--paper)", borderRadius: "14px", padding: "18px 20px" }}><div style={{ fontSize: "11.5px", fontWeight: "800", letterSpacing: ".1em", color: "var(--slate)", marginBottom: "10px" }}>TRY</div><div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>{RELATED.default.map((s) => <Link key={s} href={`/search/?q=${encodeURIComponent(s)}`} style={{ minHeight: "34px", fontSize: "12.5px", fontWeight: "800" }} className="chip">{s}</Link>)}</div></div>
<div style={{ background: "var(--paper)", borderRadius: "14px", padding: "18px 20px" }}><div style={{ fontSize: "11.5px", fontWeight: "800", letterSpacing: ".1em", color: "var(--slate)", marginBottom: "10px" }}>WHAT IS SEARCHED</div><p className="meta" style={{ margin: 0, lineHeight: 1.6 }}>Articles, letters and columns, companies, standards, topics and events. Prices are not in search — licensed market series live on the <Link href="/market-data/" style={{ color: "var(--red-text)", fontWeight: 800 }}>Market data</Link> page.</p></div>
</div>
) : list.length === 0 ? (
<div>
<div style={{ display: "flex", gap: "18px", alignItems: "flex-start", marginBottom: "20px" }}>
<span style={{ width: "54px", height: "54px", borderRadius: "14px", background: "var(--paper)", display: "inline-flex", alignItems: "center", justifyContent: "center", flexShrink: "0" }}>
<svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="var(--grey)" strokeWidth="2.2" strokeLinecap="round" aria-hidden="true"><circle cx="11" cy="11" r="7" /><path d="M16.5 16.5 21 21" /><path d="M8.6 8.6l4.8 4.8M13.4 8.6l-4.8 4.8" /></svg>
</span>
<div>
<h2 style={{ margin: "0 0 8px", fontSize: "26px" }} className="h">No results for &#8220;{q}&#8221;</h2>
<p style={{ margin: "0", fontSize: "15px", fontWeight: "500", lineHeight: "1.6", color: "var(--slate)", maxWidth: "560px" }}>{filtersOn ? "Nothing matches with the current filters." : "Nothing matches."} Our content is in English, so non-English keywords usually return nothing.</p>
</div>
</div>
<div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px", marginBottom: "18px", maxWidth: "760px" }} className="g2">
<div style={{ background: "var(--paper)", borderRadius: "14px", padding: "18px 20px" }}>
<div style={{ fontSize: "11.5px", fontWeight: "800", letterSpacing: ".1em", color: "var(--slate)", marginBottom: "10px" }}>TRY INSTEAD</div>
<div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>{suggestions.map((s) => <Link key={s} href={`/search/?q=${encodeURIComponent(s)}`} style={{ minHeight: "34px", fontSize: "12.5px", fontWeight: "800" }} className="chip">{s}</Link>)}</div>
</div>
<div style={{ background: "var(--paper)", borderRadius: "14px", padding: "18px 20px" }}>
<div style={{ fontSize: "11.5px", fontWeight: "800", letterSpacing: ".1em", color: "var(--slate)", marginBottom: "10px" }}>WIDEN THE SEARCH</div>
<div style={{ display: "flex", flexDirection: "column", gap: "8px", fontSize: "13.5px", fontWeight: "700" }}>
<Link href={href({ type: "all" })} style={{ display: "flex", justifyContent: "space-between" }}><span>All types</span><span className="meta">{raw.filter((d) => (!section || d.section === section) && within(d)).length} results &#8594;</span></Link>
<Link href={href({ time: undefined })} style={{ display: "flex", justifyContent: "space-between" }}><span>Any time</span><span className="meta">{raw.filter((d) => (type === "all" || d.type === type) && (!section || d.section === section)).length} results &#8594;</span></Link>
<Link href={href({ section: undefined })} style={{ display: "flex", justifyContent: "space-between" }}><span>All sections</span><span className="meta">{raw.filter((d) => (type === "all" || d.type === type) && within(d)).length} results &#8594;</span></Link>
</div>
</div>
</div>
{filtersOn && <Link href={`/search/?q=${encodeURIComponent(q)}`} style={{ fontSize: "12.5px", fontWeight: "800", letterSpacing: ".06em", color: "var(--red-text)" }}>CLEAR ALL FILTERS</Link>}
</div>
) : (
<div style={{ display: "grid", gridTemplateColumns: "minmax(0,1fr) 290px", gap: "40px", alignItems: "start" }} className="cols">
<div>
<div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", marginBottom: "4px", paddingBottom: "10px", borderBottom: "3px solid var(--ink)" }}>
<span style={{ fontSize: "14.5px", fontWeight: "700", color: "var(--slate)" }}><b style={{ color: "var(--ink)" }}>{list.length} result{list.length === 1 ? "" : "s"}</b> for &#8220;{q}&#8221;</span>
{filtersOn && <Link href={`/search/?q=${encodeURIComponent(q)}`} style={{ fontSize: "12.5px", fontWeight: "800", letterSpacing: ".06em", color: "var(--red-text)" }}>CLEAR FILTERS</Link>}
</div>
{slice.map((d) => {
  const [badge, tp] = BADGE[d.type];
  return (
<Link key={d.id} href={d.href} className="res" style={d.type !== "article" ? { alignItems: "center" } : undefined}><Thumb d={d} /><span className="t"><span style={{ display: "flex", alignItems: "center", gap: "8px", flexWrap: "wrap" }}><span className={`tp ${tp}`}>{badge}</span>{d.type === "article" ? <span className="kick"><i></i>{d.kicker.toUpperCase()}</span> : <span style={{ fontSize: "11.5px" }} className="meta">{d.kicker}</span>}</span><span style={{ fontSize: "20px" }} className="h" dangerouslySetInnerHTML={{ __html: highlight(d.title, q) }} /><span style={{ fontSize: "14px", fontWeight: "500", lineHeight: "1.55", color: "var(--slate)" }} dangerouslySetInnerHTML={{ __html: snippet(d, q) }} /><span className="meta">{d.meta}</span></span></Link>
  );
})}
{pages > 1 && (
<nav aria-label="Pagination" style={{ display: "flex", gap: "8px", alignItems: "center", paddingTop: "22px", flexWrap: "wrap" }}>
{Array.from({ length: pages }, (_, i) => i + 1).map((n) => n === page ? <span key={n} style={{ minWidth: "42px", justifyContent: "center" }} className="chip on">{n}</span> : <Link key={n} href={href({ page: String(n) })} style={{ minWidth: "42px", justifyContent: "center" }} className="chip">{n}</Link>)}
{page < pages && <Link href={href({ page: String(page + 1) })} className="chip">Next &#8594;</Link>}
<span style={{ marginLeft: "auto", fontSize: "12px" }} className="meta util">{PER} per page · the URL carries q, type, section, time and page</span>
</nav>
)}
</div>
<aside style={{ display: "flex", flexDirection: "column", gap: "18px" }}>
<div style={{ border: "1px solid var(--line)", borderRadius: "14px", padding: "20px" }}>
<div style={{ fontSize: "17px", marginBottom: "11px" }} className="h">Results by type</div>
<div style={{ display: "flex", flexDirection: "column", gap: "10px", fontSize: "14px", fontWeight: "700" }}>
{TYPES.slice(1).map((t) => <span key={t.k} style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}><span style={{ display: "flex", alignItems: "center", gap: "8px" }}><span className={`tp ${t.tp}`}>{t.badge}</span><Link href={href({ type: t.k })}>{t.label}</Link></span><span className="meta">{countType(t.k)}</span></span>)}
</div>
</div>
<div style={{ border: "1px solid var(--line)", borderRadius: "14px", padding: "20px" }}>
<div style={{ fontSize: "17px", marginBottom: "11px" }} className="h">Related searches</div>
<div style={{ display: "flex", gap: "7px", flexWrap: "wrap" }}>
{suggestions.map((s) => <Link key={s} href={`/search/?q=${encodeURIComponent(s)}`} style={{ minHeight: "34px", fontSize: "12.5px" }} className="chip">{s}</Link>)}
</div>
</div>
<div style={{ background: "var(--paper)", borderRadius: "14px", padding: "18px 20px" }}>
<div style={{ fontSize: "14px", marginBottom: "8px" }} className="h">Looking for a price?</div>
<p style={{ margin: "0 0 10px", lineHeight: "1.55" }} className="meta">Prices are not in search. Licensed market series live on one page.</p>
<Link href="/market-data/" style={{ fontSize: "12.5px", fontWeight: "800", letterSpacing: ".06em", color: "var(--red-text)" }}>MARKET DATA &#8594;</Link>
</div>
</aside>
</div>
)}
</section>
    </Shell>
  );
}
