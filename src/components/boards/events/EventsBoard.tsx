/* Ported 1:1 from canvas board Events-F. */
import Link from "next/link";
import { Shell } from "@/components/shell/Shell";
import { EVENT_TYPE } from "@/data/vocab";
import { SectionNewsletter } from "@/components/boards/category/SectionNewsletter";
import { COMPANIES } from "@/lib/content/directory";
import { EVENTS, upcomingEvents } from "@/lib/content/source";
import { bySubsection, getArticle } from "@/lib/content/articles";
import { COUNTRY_BY_CODE, REGION } from "@/data/vocab";
import { fmtDate, articleHref } from "@/lib/site";
import type { EventItem } from "@/lib/content/types";
import "@/styles/board-ev.css";
import "@/styles/board-dir.css";
import { FilterBar } from "@/components/boards/directory/FilterBar";
import { demoBg } from "@/lib/demo";

export type EvParams = { when?: string; region?: string; type?: string; month?: string };
const TYPE_LABEL: Record<string, string> = Object.fromEntries(EVENT_TYPE.map((t) => [t.code, t.label]));
/* Region filter uses the site's fixed region table (the same one as the Directory and export
   markets), not a coarse "Asia" bucket; online events have their own chip. */
const regionOf = (e: EventItem) => (e.online ? "online" : COUNTRY_BY_CODE[e.country ?? ""]?.region ?? "");
/* "Upcoming" is relative to the build date; the site rebuilds daily. */
const TODAY = new Date().toISOString().slice(0, 10);

const range = (e: EventItem) => {
  const s = new Date(e.start), en = e.end ? new Date(e.end) : null;
  const d = (x: Date) => x.getUTCDate(), mon = (x: Date) => new Intl.DateTimeFormat("en-GB", { month: "short", timeZone: "UTC" }).format(x), yr = (x: Date) => x.getUTCFullYear();
  if (!en) return `${d(s)} ${mon(s)} ${yr(s)}`;
  return s.getUTCMonth() === en.getUTCMonth() ? `${d(s)} – ${d(en)} ${mon(s)} ${yr(s)}` : `${d(s)} ${mon(s)} – ${d(en)} ${mon(en)} ${yr(s)}`;
};
const where = (e: EventItem) => e.online ? `Online${e.organiser ? ` · ${e.organiser}` : ""}` : [e.city, COUNTRY_BY_CODE[e.country ?? ""]?.name ?? e.country, e.venue].filter(Boolean).join(" · ");

const reportHref = (slug: string) => { const a = getArticle(slug); return a ? articleHref(a) : "/news/events-exhibitions/"; };

export function EventsBoard({ sp }: { sp: EvParams }) {
  const past = sp.when === "past";
  const pool = past ? EVENTS.filter((e) => (e.end ?? e.start) < TODAY).sort((a, b) => (a.start < b.start ? 1 : -1)) : upcomingEvents(TODAY);
  const monthOf = (e: EventItem) => e.start.slice(0, 7);
  const match = (e: EventItem, skip?: keyof EvParams) => (skip === "type" || !sp.type || e.type === sp.type) && (skip === "region" || !sp.region || regionOf(e) === sp.region) && (skip === "month" || !sp.month || monthOf(e) === sp.month);
  const list = pool.filter((e) => match(e));
  const nPast = EVENTS.filter((e) => (e.end ?? e.start) < TODAY).length, nUp = upcomingEvents(TODAY).length;
  const months = [...new Set(pool.map(monthOf))].sort(past ? (a, b) => (a < b ? 1 : -1) : undefined);
  const monthLabel = (m: string) => new Intl.DateTimeFormat("en-GB", { month: "long", year: "numeric", timeZone: "UTC" }).format(new Date(`${m}-01`));
  const next = upcomingEvents(TODAY).find((e) => e.weAttend) ?? upcomingEvents(TODAY)[0];
  const reports = bySubsection("news", "events_exhibitions").slice(0, 2);
  const exhibitors = COMPANIES.filter((c) => c.claimed).slice(0, 2);
  const href = (patch: Partial<EvParams>) => { const m: Record<string, string | undefined> = { ...sp, ...patch }; const p = new URLSearchParams(); for (const [k, v] of Object.entries(m)) if (v) p.set(k, v); const s = p.toString(); return `/events/${s ? `?${s}` : ""}`; };
  const toggle = (k: keyof EvParams, v: string) => href({ [k]: sp[k] === v ? undefined : v });
  const groups: { label: string; items: EventItem[] }[] = [];
  for (const e of list) { const label = new Intl.DateTimeFormat("en-GB", { month: "long", year: "numeric", timeZone: "UTC" }).format(new Date(e.start)).toUpperCase(); const g = groups.find((x) => x.label === label); if (g) g.items.push(e); else groups.push({ label, items: [e] }); }

  return (
    <Shell header="compact" active="events" board="b-ev">
{/* 页头 */}
<section style={{ paddingTop: "34px", paddingBottom: "24px", borderBottom: "1px solid var(--line)" }} className="wrap">
<nav aria-label="Breadcrumb" style={{ fontSize: "12.5px", fontWeight: "500", color: "var(--slate)", marginBottom: "14px" }}><Link href="/" style={{ color: "var(--slate)" }}>Home</Link> / <span style={{ color: "var(--ink)", fontWeight: "800" }}>Events</span></nav>
<div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", gap: "32px", flexWrap: "wrap" }}>
<div style={{ maxWidth: "640px" }}>
<h1 style={{ margin: "0 0 10px", fontSize: "50px", letterSpacing: "-.05em", lineHeight: "1" }} className="h">Events Calendar<span style={{ color: "var(--red-text)" }}>.</span></h1>
<p style={{ margin: "0", fontSize: "16.5px", fontWeight: "500", lineHeight: "1.55", color: "var(--slate)" }}>Trade shows, conferences and webinars across wire, mesh, fencing and grating — with our reporting from the ones we attend.</p>
</div>
<div style={{ display: "flex", gap: "10px", flexShrink: "0" }}>
<a href="/events.ics" style={{ display: "inline-flex", alignItems: "center", gap: "8px", border: "2px solid var(--ink)", fontWeight: "800", fontSize: "14px", padding: "0 20px", minHeight: "48px", borderRadius: "999px" }}>
<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinejoin="round" aria-hidden="true"><rect x="3" y="5" width="18" height="16" rx="2.5" /><path d="M3 10h18M8 3v4M16 3v4" /></svg>
Subscribe to calendar
</a>
</div>
</div>
<div className="b-dir" style={{ marginTop: "22px" }}>
<FilterBar
  count={list.length}
  noun={["event", "events"]}
  resetHref={href({ region: undefined, type: undefined, month: undefined })}
  menus={[
    { key: "region", label: "Region", note: "The site's fixed regions, the same as the Directory. Online events are listed separately.", items: [...REGION.map((r) => ({ code: r.code, label: r.labelEn })), { code: "online", label: "Online" }].map((r) => ({ label: r.label, href: toggle("region", r.code), on: sp.region === r.code, count: pool.filter((e) => match(e, "region") && regionOf(e) === r.code).length })) },
    { key: "type", label: "Type", items: EVENT_TYPE.map((t) => ({ label: t.label, href: toggle("type", t.code), on: sp.type === t.code, count: pool.filter((e) => match(e, "type") && e.type === t.code).length })) },
    { key: "month", label: "Month", items: months.map((m) => ({ label: monthLabel(m), href: toggle("month", m), on: sp.month === m, count: pool.filter((e) => match(e, "month") && monthOf(e) === m).length })) },
  ]}
  rows={[]}
  sort={<div role="group" aria-label="When" className="seg">
<Link href={href({ when: undefined, month: undefined })} scroll={false} className={past ? undefined : "on"}>Upcoming {nUp}</Link><Link href={href({ when: "past", month: undefined })} scroll={false} className={past ? "on" : undefined}>Past &amp; reports {nPast}</Link>
</div>}
/>
</div>
</section>
{/* 重点展会 */}
{next && (
<section style={{ paddingTop: "30px", paddingBottom: "30px" }} className="wrap">
<div style={{ display: "grid", gridTemplateColumns: "1.45fr 1fr", gap: "32px", alignItems: "stretch" }} className="cols">
<div style={{ background: "var(--red)", color: "#FFFFFF", borderRadius: "18px", padding: "30px", position: "relative", overflow: "hidden", display: "flex", flexDirection: "column", gap: "14px" }}>
<svg width="360" height="360" viewBox="0 0 120 120" style={{ position: "absolute", right: "-80px", bottom: "-120px", color: "var(--red-deep)" }} aria-hidden="true"><use href="#w2" width="120" height="120" /></svg>
<div style={{ position: "relative", display: "flex", flexDirection: "column", gap: "13px", alignItems: "flex-start" }}>
<span style={{ background: "var(--surface-dark)", fontSize: "10.5px", fontWeight: "800", letterSpacing: ".14em", padding: "6px 12px", borderRadius: "999px" }}>{next.weAttend ? "NEXT UP · WE'LL BE THERE" : "NEXT UP"}</span>
<div style={{ fontSize: "34px", letterSpacing: "-.045em", color: "#FFFFFF" }} className="h">{next.name}</div>
<div style={{ display: "flex", gap: "22px", flexWrap: "wrap", fontSize: "14.5px", fontWeight: "700" }}>
<span style={{ display: "flex", alignItems: "center", gap: "7px" }}><svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinejoin="round" aria-hidden="true"><rect x="3" y="5" width="18" height="16" rx="2.5" /><path d="M3 10h18M8 3v4M16 3v4" /></svg>{range(next)}</span>
<span style={{ display: "flex", alignItems: "center", gap: "7px" }}><svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinejoin="round" aria-hidden="true"><path d="M12 21s7-6.3 7-11a7 7 0 1 0-14 0c0 4.7 7 11 7 11z" /><circle cx="12" cy="10" r="2.6" /></svg>{where(next)}</span>
</div>
<p style={{ margin: "0", fontSize: "15px", fontWeight: "500", lineHeight: "1.55", maxWidth: "480px" }}>{next.summary}</p>
<div style={{ display: "flex", gap: "10px", flexWrap: "wrap", marginTop: "4px" }}>
<a href={`#${next.slug}`} style={{ background: "var(--ink)", color: "var(--on-ink)", fontWeight: "800", fontSize: "14.5px", padding: "0 22px", minHeight: "48px", borderRadius: "999px", display: "inline-flex", alignItems: "center" }}>Event details</a>
{next.website && <a href={next.website} rel="nofollow noopener noreferrer" target="_blank" style={{ border: "2px solid #FFFFFF", color: "#FFFFFF", fontWeight: "800", fontSize: "14.5px", padding: "0 22px", minHeight: "48px", borderRadius: "999px", display: "inline-flex", alignItems: "center" }}>Official site</a>}
</div>
</div>
</div>
<div style={{ border: "1px solid var(--line)", borderRadius: "18px", padding: "26px", display: "flex", flexDirection: "column", gap: "16px" }}>
<div style={{ fontSize: "20px" }} className="h">Our coverage plan</div>
<div style={{ display: "flex", flexDirection: "column", gap: "13px", fontSize: "14px", fontWeight: "500", lineHeight: "1.5" }}>
<div style={{ display: "flex", gap: "11px" }}><span style={{ width: "7px", height: "7px", borderRadius: "999px", background: "var(--red)", flexShrink: "0", marginTop: "7px" }}></span><span><b>Preview</b> — what to look for, published in News › Events &amp; Exhibitions</span></div>
<div style={{ display: "flex", gap: "11px" }}><span style={{ width: "7px", height: "7px", borderRadius: "999px", background: "var(--red)", flexShrink: "0", marginTop: "7px" }}></span><span><b>On-site interviews</b> — company interviews and new-product notes</span></div>
<div style={{ display: "flex", gap: "11px" }}><span style={{ width: "7px", height: "7px", borderRadius: "999px", background: "var(--red)", flexShrink: "0", marginTop: "7px" }}></span><span><b>Show report</b> — the post-show round-up, linked to Directory profiles</span></div>
</div>
<div style={{ borderTop: "1px solid var(--line)", paddingTop: "16px", marginTop: "auto" }}>
<div style={{ fontSize: "11.5px", fontWeight: "800", letterSpacing: ".1em", color: "var(--slate)", marginBottom: "7px" }}>MEDIA PARTNERSHIP</div>
<p style={{ margin: "0 0 12px", fontSize: "13.5px", fontWeight: "500", lineHeight: "1.6", color: "var(--slate)" }}>Media partnerships with shows can include an event feature, coverage and company interviews; partner content is always labelled.</p>
<Link href="/advertise/" style={{ fontSize: "12.5px", fontWeight: "800", letterSpacing: ".06em", color: "var(--red-text)" }}>ADVERTISE &amp; PARTNER →</Link>
</div>
</div>
</div>
</section>
)}
{/* 日历列表 */}
<section style={{ paddingBottom: "50px" }} className="wrap">

<div style={{ display: "grid", gridTemplateColumns: "minmax(0,1fr) 320px", gap: "48px", alignItems: "start" }} className="cols">
<div>
<h2 style={{ margin: "0 0 2px", fontSize: "23px", borderBottom: "3px solid var(--ink)", paddingBottom: "10px" }} className="h">{past ? "Past events & reports" : "Upcoming"}{(sp.region || sp.type || sp.month) ? <span className="meta" style={{ fontSize: "13px", marginLeft: "10px", fontFamily: "inherit", letterSpacing: 0 }}>{list.length} of {pool.length}</span> : null}</h2>
{list.length === 0 && <p className="meta" style={{ padding: "20px 0" }}>No events match these filters. <Link href={href({ region: undefined, type: undefined, month: undefined })} scroll={false} style={{ color: "var(--red-text)", fontWeight: 800 }}>Clear filters</Link></p>}
{groups.map((g) => (
<div key={g.label}>
<div style={{ fontSize: "15px", color: "var(--slate)", letterSpacing: ".04em", padding: "20px 0 2px" }} className="h">{g.label}</div>
{g.items.map((e) => {
  const d = new Date(e.start);
  return (
<div key={e.slug} id={e.slug} className="ev">
<div className="date"><div className="m">{new Intl.DateTimeFormat("en-GB", { month: "short", timeZone: "UTC" }).format(d).toUpperCase()}</div><div className="d">{String(d.getUTCDate()).padStart(2, "0")}</div></div>
<div style={{ flex: "1 1 auto", display: "flex", flexDirection: "column", gap: "7px", minWidth: "0" }}>
<a href={e.website ?? `#${e.slug}`} rel={e.website ? "nofollow noopener noreferrer" : undefined} target={e.website ? "_blank" : undefined} style={{ fontSize: "19px" }} className="h">{e.name}</a>
<span style={{ fontSize: "13.5px" }} className="meta">{range(e).replace(/ \d{4}$/, "")} · {where(e)}</span>
<p style={{ margin: "0", fontSize: "13.5px", fontWeight: "500", lineHeight: "1.55", color: "var(--slate)" }}>{e.summary}</p>
<div style={{ display: "flex", gap: "6px", flexWrap: "wrap" }}><span className="tag">{TYPE_LABEL[e.type]}</span><span className="tag">{e.focus}</span>{e.weAttend && <span className="tag">{past ? "We attended" : "We\u2019ll be there"}</span>}</div>
{past && (e.report ? <Link href={reportHref(e.report)} style={{ fontSize: "13px", fontWeight: 800, color: "var(--red-text)" }}>Read our show report →</Link> : <span className="meta" style={{ fontSize: "12.5px" }}>No report: we did not attend.</span>)}
</div>
{e.website && <a href={e.website} rel="nofollow noopener noreferrer" target="_blank" style={{ fontSize: "12.5px", fontWeight: "800", color: "var(--red-text)", flexShrink: "0", paddingTop: "4px" }}>DETAILS →</a>}
</div>
  );
})}
</div>
))}
{/* 展会报道 */}
<h2 style={{ margin: "36px 0 2px", fontSize: "23px", borderBottom: "3px solid var(--ink)", paddingBottom: "10px" }} className="h">Show reports</h2>
<div className="g2" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "22px", paddingTop: "20px" }}>
{reports.map((a) => (
<article key={a.slug} style={{ display: "flex", flexDirection: "column", gap: "9px" }}><Link href={articleHref(a)} className="thumb" style={demoBg(a.slug)}></Link><span className="kicker"><i></i>NEWS · EVENTS &amp; EXHIBITIONS</span><Link href={articleHref(a)} style={{ fontSize: "18px" }} className="h">{a.title}</Link><span className="meta">{fmtDate(a.date)} · {a.readMin} min</span></article>
))}
</div>
</div>
<aside style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
<div style={{ background: "var(--surface-dark)", color: "#FFFFFF", borderRadius: "16px", padding: "24px" }}>
<div style={{ fontSize: "20px", marginBottom: "8px" }} className="h">Event alerts</div>
<p style={{ margin: "0 0 14px", fontSize: "13.5px", fontWeight: "500", lineHeight: "1.55", color: "var(--on-dark-2)" }}>One email a month: next month&#8217;s events and our coverage plan.</p>
<SectionNewsletter id="ev1" button="red" />
</div>
<div style={{ border: "1px solid var(--line)", borderRadius: "16px", padding: "22px" }}>
<div style={{ fontSize: "18px", marginBottom: "9px" }} className="h">Submit an event</div>
<p style={{ margin: "0 0 13px", fontSize: "13.5px", fontWeight: "500", lineHeight: "1.6", color: "var(--slate)" }}>Trade shows and industry events can be submitted for listing with an official website and dates. Editors verify before adding to the calendar; listing is free and order is never paid for.</p>
<Link href="/contact/?subject=event" style={{ border: "2px solid var(--ink)", fontWeight: "800", fontSize: "13.5px", padding: "0 20px", minHeight: "44px", borderRadius: "999px", display: "inline-flex", alignItems: "center" }}>Submit event details</Link>
</div>
<div style={{ border: "1px solid var(--line)", borderRadius: "16px", padding: "22px" }}>
<div style={{ fontSize: "18px", marginBottom: "12px" }} className="h">Exhibiting companies</div>
<div style={{ display: "flex", flexDirection: "column", gap: "11px", fontSize: "14px", fontWeight: "700" }}>
{exhibitors.map((c) => <Link key={c.slug} href={`/directory/${c.slug}/`} style={{ display: "flex", alignItems: "center", gap: "10px" }}><span style={{ width: "30px", height: "30px", borderRadius: "7px", background: "var(--line)", flexShrink: "0" }}></span>{c.name}</Link>)}
</div>
<Link href="/directory/" style={{ display: "inline-block", marginTop: "12px", fontSize: "12.5px", fontWeight: "800", letterSpacing: ".06em", color: "var(--red-text)" }}>DIRECTORY →</Link>
</div>
</aside>
</div>
</section>
    </Shell>
  );
}
