/* Ported 1:1 from canvas board Standards-Y ① (index) and ② (detail). Bibliographic facts and our own summaries only — never the standard's text. */
import Link from "next/link";
import { Shell } from "@/components/shell/Shell";
import { FollowStandard } from "./FollowStandard";
import { DropMenu } from "@/components/boards/shared/DropMenu";
import { STANDARDS, getStandardByNo } from "@/lib/content/standards";
import { byStandard } from "@/lib/content/articles";
import { COMPANIES } from "@/lib/content/directory";
import { STANDARDS_BODY, STANDARD_SUBJECT_BY_CODE } from "@/data/vocab";
import { articleHref, fmtDate, fmtDateShort, sectionByCode } from "@/lib/site";
import type { Standard, StandardStatus } from "@/lib/content/types";
import "@/styles/board-std.css";

export type StdParams = { body?: string; subject?: string; status?: string; sort?: string; q?: string };
const STATUS: Record<StandardStatus, [string, string]> = { current: ["CURRENT", "cur"], under_review: ["UNDER REVIEW", "rev"], withdrawn: ["WITHDRAWN", "wd"], draft: ["DRAFT", "dft"] };
const bodyOf = (code: string) => STANDARDS_BODY.find((b) => b.code === code);
const subjectLabel = (code: string) => STANDARD_SUBJECT_BY_CODE[code]?.labelEn ?? code;
const lastChecked = STANDARDS.map((s) => s.checked).sort().at(-1)!;

export function StandardsBoard({ sp }: { sp: StdParams }) {
  const q = (sp.q ?? "").toLowerCase().trim();
  const sort = sp.sort === "subject" ? "subject" : sp.sort === "changed" ? "changed" : "number";
  const list = STANDARDS.filter((s) => (!sp.body || s.body === sp.body) && (!sp.subject || s.subject === sp.subject) && (!sp.status || s.status === sp.status) && (!q || `${s.no} ${s.title} ${s.covers} ${subjectLabel(s.subject)}`.toLowerCase().includes(q)))
    .sort((a, b) => sort === "subject" ? subjectLabel(a.subject).localeCompare(subjectLabel(b.subject)) || a.no.localeCompare(b.no, undefined, { numeric: true }) : sort === "changed" ? (b.changelog[0]?.date ?? "").localeCompare(a.changelog[0]?.date ?? "") : a.no.localeCompare(b.no, undefined, { numeric: true }));
  const bodies = [...new Set(STANDARDS.map((s) => s.body))];
  const subjects = [...new Set(STANDARDS.map((s) => s.subject))];
  const href = (patch: Partial<StdParams>) => { const m: Record<string, string | undefined> = { ...sp, ...patch }; const p = new URLSearchParams(); for (const [k, v] of Object.entries(m)) if (v) p.set(k, v); const s = p.toString(); return `/standards/${s ? `?${s}` : ""}`; };
  const toggle = (k: keyof StdParams, v: string) => href({ [k]: sp[k] === v ? undefined : v });
  const latest = [...STANDARDS].sort((a, b) => (b.changelog[0]?.date ?? "").localeCompare(a.changelog[0]?.date ?? ""))[0];

  return (
    <Shell header="compact" active="standards" board="b-std">
{/* 页头 */}
<section style={{ position: "relative", overflow: "hidden", background: "var(--surface-dark)", color: "#FFFFFF" }}>
<svg style={{ position: "absolute", right: "0", top: "0", width: "520px", height: "100%", color: "#FFFFFF", opacity: ".16" }} aria-hidden="true" preserveAspectRatio="none" viewBox="0 0 520 280"><rect width="520" height="280" fill="url(#pWeld)" /></svg>
<div style={{ position: "relative", paddingTop: "32px", paddingBottom: "30px" }} className="wrap">
<nav aria-label="Breadcrumb" style={{ fontSize: "12.5px", fontWeight: "500", color: "var(--grey-2)", marginBottom: "16px" }}><Link href="/" style={{ color: "var(--grey-2)" }}>Home</Link> / <span style={{ color: "#FFFFFF", fontWeight: "800" }}>Standards Index</span></nav>
<div style={{ display: "grid", gridTemplateColumns: "1.5fr 1fr", gap: "40px", alignItems: "end" }} className="cols">
<div>
<h1 style={{ margin: "0 0 12px", fontSize: "48px", letterSpacing: "-.055em" }} className="h">Standards Index<span style={{ color: "var(--red-text)" }}>.</span></h1>
<p style={{ margin: "0", fontSize: "16px", fontWeight: "500", lineHeight: "1.6", color: "#B9BCC6", maxWidth: "600px" }}>An index of the standards that govern wire mesh and metal mesh: number, publishing body, current status, what it covers and our related reporting. <b style={{ color: "#FFFFFF" }}>Index and our own summaries only — never the standard&#8217;s text.</b></p>
</div>
<div style={{ display: "flex", gap: "28px", flexWrap: "wrap", justifyContent: "flex-end" }}>
<div><div style={{ fontSize: "30px", color: "#FFFFFF" }} className="mono h">{STANDARDS.length}</div><div style={{ color: "var(--grey-5)", fontSize: "10.5px", fontWeight: "800", letterSpacing: ".1em" }}>STANDARDS</div></div>
<div><div style={{ fontSize: "30px", color: "#FFFFFF" }} className="mono h">{bodies.length}</div><div style={{ color: "var(--grey-5)", fontSize: "10.5px", fontWeight: "800", letterSpacing: ".1em" }}>BODIES</div></div>
<div><div style={{ fontSize: "30px", color: "#FFFFFF" }} className="mono h">{fmtDateShort(lastChecked)}</div><div style={{ color: "var(--grey-5)", fontSize: "10.5px", fontWeight: "800", letterSpacing: ".1em" }}>LAST CHECKED</div></div>
</div>
</div>
<form action="/standards/" method="get" style={{ display: "flex", alignItems: "center", gap: "11px", background: "var(--card)", borderRadius: "999px", padding: "0 20px", minHeight: "54px", marginTop: "24px", maxWidth: "660px" }}>
<svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="var(--grey)" strokeWidth="2.2" strokeLinecap="round" aria-hidden="true"><circle cx="11" cy="11" r="7" /><path d="M16.5 16.5 21 21" /></svg>
<label htmlFor="sq" style={{ position: "absolute", width: "1px", height: "1px", overflow: "hidden", clip: "rect(0 0 0 0)" }}>Search standards</label>
<input id="sq" name="q" defaultValue={sp.q ?? ""} type="search" placeholder="EN 10223-4, zinc coating, gabion, weld shear…" style={{ border: "0", outline: "0", flex: "1 1 auto", fontFamily: "inherit", fontSize: "15.5px", fontWeight: "500", minHeight: "48px", color: "var(--ink)", background: "transparent", minWidth: 0 }} />
<span style={{ fontSize: "10.5px", fontWeight: "800", letterSpacing: ".1em", color: "var(--grey-4)" }} className="mono util">NUMBERS AND KEYWORDS</span>
</form>
</div>
</section>
<div style={{ paddingTop: "28px", paddingBottom: "40px" }} className="wrap">
{/* 版权红线（读者版） */}
<div style={{ display: "flex", gap: "18px", border: "2px solid var(--red)", borderRadius: "14px", padding: "20px 24px", marginBottom: "26px", flexWrap: "wrap" }}>
<div style={{ flex: "1 1 420px" }}>
<div style={{ fontSize: "17px", marginBottom: "9px", color: "var(--red-deep)" }} className="h">What this index is, and is not</div>
<p style={{ margin: "0 0 10px", fontSize: "13.5px", fontWeight: "500", lineHeight: "1.7", color: "var(--fg-3)" }}>Standards bodies earn their living from the text of their standards, and clauses, tables and values are copyright. This page does three things only: <b>records the number and bibliographic details, states the current status, and summarises the scope in our own words</b>. Number, title and year are facts and can be listed.</p>
<p style={{ margin: "0", fontSize: "13.5px", fontWeight: "500", lineHeight: "1.7", color: "var(--fg-3)" }}>By design there is <b>no download, no PDF, no quoted clauses and no copied parameter tables</b>; every entry links to the publisher&#8217;s official purchase page.</p>
</div>
<div style={{ width: "230px", flexShrink: "0", background: "var(--st-red-bg)", borderRadius: "10px", padding: "16px" }}>
<div style={{ fontSize: "10px", fontWeight: "800", letterSpacing: ".12em", color: "var(--red-deep)", marginBottom: "9px" }} className="mono">NEVER ON THIS SITE</div>
<ul style={{ paddingLeft: "16px" }}>
{["Standard PDFs or scans", "Verbatim clauses", "Copied parameter tables", "Links to pirated copies"].map((t) => <li key={t} style={{ fontSize: "12.5px", lineHeight: "1.65", color: "#8A1620" }}>{t}</li>)}
</ul>
</div>
</div>
{/* 筛选 */}
<div style={{ border: "2px solid var(--ink)", borderRadius: "16px", overflow: "hidden", marginBottom: "22px" }}>
<div style={{ background: "var(--surface-dark)", color: "#FFFFFF", padding: "13px 16px", display: "flex", alignItems: "center", gap: "10px", flexWrap: "wrap" }}>
<span style={{ fontSize: "10.5px", fontWeight: "800", letterSpacing: ".14em", color: "var(--grey-2)", marginRight: "2px" }} className="mono">FILTER</span>
<DropMenu label="Body" items={bodies.map((b) => ({ label: bodyOf(b)?.prefix ?? b.toUpperCase(), href: toggle("body", b), on: sp.body === b, count: STANDARDS.filter((x) => x.body === b).length }))} />
<DropMenu label="Subject" items={subjects.map((x) => ({ label: subjectLabel(x), href: toggle("subject", x), on: sp.subject === x, count: STANDARDS.filter((y) => y.subject === x).length }))} />
<Link href={toggle("status", "current")} scroll={false} className="fchip ghost">{sp.status ? `Status: ${STATUS[sp.status as StandardStatus]?.[0] ?? sp.status} ✕` : "Status: Any"}</Link>
<div style={{ marginLeft: "auto", display: "flex", alignItems: "center", gap: "14px" }}>
<span style={{ fontSize: "12.5px", fontWeight: "800" }} className="mono">{list.length}<span style={{ color: "var(--grey-2)", fontWeight: "700" }}> STANDARDS</span></span>
<div role="group" aria-label="Sort" className="seg"><Link href={href({ sort: undefined })} scroll={false} className={sort === "number" ? "on" : undefined}>By number</Link><Link href={href({ sort: "subject" })} scroll={false} className={sort === "subject" ? "on" : undefined}>By subject</Link><Link href={href({ sort: "changed" })} scroll={false} className={sort === "changed" ? "on" : undefined}>Recently changed</Link></div>
</div>
</div>
<div id="bodies" style={{ background: "var(--paper-2)", padding: "11px 16px", display: "flex", alignItems: "center", gap: "8px", flexWrap: "wrap" }}>
<span style={{ fontSize: "10.5px", fontWeight: "800", letterSpacing: ".14em", color: "var(--grey)", marginRight: "2px" }} className="mono">BODIES</span>
{bodies.map((b) => <Link key={b} href={toggle("body", b)} scroll={false} className={`badge ${sp.body === b ? "on" : "wd"}`}>{bodyOf(b)?.prefix ?? b.toUpperCase()}</Link>)}
<span style={{ width: "1px", height: "18px", background: "var(--line)", margin: "0 6px" }}></span>
<span style={{ fontSize: "10.5px", fontWeight: "800", letterSpacing: ".14em", color: "var(--grey)" }} className="mono">SUBJECTS</span>
{subjects.map((s) => <Link key={s} href={toggle("subject", s)} scroll={false} className={`badge ${sp.subject === s ? "on" : "wd"}`}>{subjectLabel(s)}</Link>)}
{(sp.body || sp.subject || sp.status || sp.q) && <Link href="/standards/" style={{ marginLeft: "auto", fontSize: "11.5px", fontWeight: 800, color: "var(--red-text)", letterSpacing: ".06em" }}>CLEAR</Link>}
</div>
</div>
{/* 列表 */}
<div style={{ border: "1px solid var(--line)", borderRadius: "14px", overflow: "hidden", marginBottom: "34px" }}>
<div style={{ background: "var(--paper)", borderBottom: "2px solid var(--ink)", paddingTop: "12px", paddingBottom: "12px" }} className="row head">
{["NUMBER", "TITLE & WHAT IT COVERS", "SUBJECT", "STATUS", "COVERAGE", ""].map((h, i) => <span key={i} style={{ fontSize: "10px", fontWeight: "800", letterSpacing: ".12em", color: "var(--slate)" }} className="mono">{h}</span>)}
</div>
{list.length === 0 && <p className="meta" style={{ padding: "20px 18px", margin: 0 }}>No standards match. <Link href="/standards/" style={{ color: "var(--red-text)", fontWeight: 800 }}>Clear filters</Link></p>}
{list.map((s) => {
  const [lab, cls] = STATUS[s.status];
  const n = byStandard(s.no).length;
  const wd = s.status === "withdrawn";
  return (
<Link key={s.slug} href={`/standards/${s.slug}/`} style={{ ...(s.slug === latest.slug ? { borderLeft: "3px solid var(--red)" } : {}), ...(wd ? { opacity: ".72" } : {}) }} className="row">
<span><span style={{ fontSize: "17px", display: "block", ...(wd ? { textDecoration: "line-through", textDecorationColor: "var(--line-2)" } : {}) }} className="mono h">{s.no}</span><span style={{ fontSize: "10.5px", fontWeight: "700", color: "var(--grey)" }} className="mono">{bodyOf(s.body)?.prefix === "EN" ? "CEN" : bodyOf(s.body)?.prefix ?? s.body.toUpperCase()} · {s.edition ?? "—"}</span></span>
<span><span style={{ display: "block", fontSize: "14.5px", fontWeight: "800", marginBottom: "4px" }}>{s.title}</span><span style={{ fontSize: "12.5px", lineHeight: "1.5" }} className="meta">{wd && s.replacedBy ? <>Replaced by <b style={{ color: "var(--ink)" }}>{s.replacedBy}</b>. Withdrawn standards stay in the index: old drawings still cite them and readers need to know what to replace them with.</> : s.covers.split(". ")[0] + "."}</span></span>
<span className="badge wd">{subjectLabel(s.subject)}</span>
<span className={`badge ${cls}`}>{lab}</span>
<span style={{ fontSize: "12px", fontWeight: "800", color: "var(--grey)" }} className="mono">{n} article{n === 1 ? "" : "s"}</span>
<span style={{ color: "var(--red-text)", fontWeight: "800" }}>→</span>
</Link>
  );
})}
</div>
<div style={{ background: "var(--paper)", borderRadius: "12px", padding: "16px 18px", display: "flex", alignItems: "center", gap: "14px", flexWrap: "wrap" }}>
<div style={{ flex: "1 1 320px" }}>
<div style={{ fontSize: "13.5px", fontWeight: "800", marginBottom: "4px" }}>Has a status changed? Tell us</div>
<p style={{ margin: "0", fontSize: "12px", lineHeight: "1.55" }} className="meta">Standards change, and we cannot check every entry every day. Reader reports are verified, the entry is updated, and the change appears in Standards Watch on the front page.</p>
</div>
<Link href="/contact/?subject=correction" style={{ minHeight: "40px", padding: "0 18px", border: "1.5px solid var(--ink)", borderRadius: "999px", background: "var(--card)", fontSize: "13px", fontWeight: "800", display: "inline-flex", alignItems: "center" }}>Report a change</Link>
</div>
</div>
    </Shell>
  );
}

const KIND_LABEL: Record<string, [string, string]> = { status: ["STATUS CHANGE", "rev"], equivalents: ["EQUIVALENTS ADDED", "wd"], added: ["ADDED TO INDEX", "cur"], edition: ["NEW EDITION", "cur"], withdrawn: ["WITHDRAWN", "wd"] };

export function StandardBoard({ s }: { s: Standard }) {
  const [lab, cls] = STATUS[s.status];
  const body = bodyOf(s.body);
  const articles = byStandard(s.no);
  const related = s.related.map((no) => getStandardByNo(no)).filter(Boolean);
  const certified = COMPANIES.filter((c) => s.certifiedCompanies?.includes(c.slug) || c.certifications.some((x) => x.verified && x.type.replace(/_/g, " ").toUpperCase() === s.no.toUpperCase()));
  return (
    <Shell header="compact" active="standards" board="b-std">
<div style={{ paddingTop: "28px", paddingBottom: "40px" }} className="wrap">
<nav aria-label="Breadcrumb" className="meta" style={{ marginBottom: "16px" }}><Link href="/" style={{ color: "var(--slate)" }}>Home</Link> / <Link href="/standards/" style={{ color: "var(--slate)" }}>Standards Index</Link> / <b style={{ color: "var(--ink)" }}>{s.no}</b></nav>
<div style={{ border: "2px solid var(--ink)", borderRadius: "16px", overflow: "hidden", marginBottom: "32px" }}>
<div style={{ background: "var(--surface-dark)", color: "#FFFFFF", padding: "24px 26px", position: "relative", overflow: "hidden" }}>
<svg style={{ position: "absolute", right: "0", top: "0", width: "300px", height: "100%", color: "#FFFFFF", opacity: ".14" }} aria-hidden="true" preserveAspectRatio="none" viewBox="0 0 300 160"><rect width="300" height="160" fill="url(#pChain)" /></svg>
<div style={{ position: "relative", display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: "24px", flexWrap: "wrap" }}>
<div>
<div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "10px", flexWrap: "wrap" }}>
<span className={`badge ${cls}`}>{lab}</span>
<span style={{ fontSize: "11px", fontWeight: "700", color: "var(--grey-2)" }} className="mono">STATUS CHECKED {fmtDate(s.checked).toUpperCase()} · SOURCE: {(body?.prefix ?? s.body).toUpperCase()} WEBSITE</span>
</div>
<h1 style={{ fontSize: "38px", letterSpacing: "-.02em", margin: 0, color: "#FFFFFF" }} className="mono h">{s.no}</h1>
<div style={{ fontSize: "17px", fontWeight: "700", color: "var(--on-dark-2)", marginTop: "6px", maxWidth: "620px" }}>{s.title}</div>
</div>
<div style={{ display: "flex", flexDirection: "column", gap: "8px", alignItems: "flex-end" }}>
<FollowStandard id={s.slug} count={s.followers} buy={<a href={s.sourceUrl} target="_blank" rel="noopener noreferrer nofollow" style={{ display: "inline-flex", alignItems: "center", gap: "8px", background: "var(--red)", color: "#FFFFFF", minHeight: "46px", padding: "0 20px", borderRadius: "999px", fontSize: "14px", fontWeight: "800" }}>Buy the official text ↗</a>} />
</div>
</div>
</div>
<div className="detail" style={{ display: "grid", gridTemplateColumns: "1fr 320px", gap: "0" }}>
<div style={{ padding: "24px 26px", borderRight: "1px solid var(--line)" }}>
<div style={{ fontSize: "16px", marginBottom: "9px" }} className="h">What it covers</div>
<p style={{ margin: "0 0 20px", fontSize: "14.5px", fontWeight: "500", lineHeight: "1.72", color: "var(--fg-2)" }}>{s.covers}</p>
<div style={{ fontSize: "16px", marginBottom: "9px" }} className="h">Why it matters in practice</div>
<ul style={{ marginBottom: "20px" }}>{s.whyItMatters.map((w) => <li key={w}>{w}</li>)}</ul>
<div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", marginBottom: "11px" }}>
<div style={{ fontSize: "16px" }} className="h">Change log</div>
<span style={{ fontSize: "10.5px", fontWeight: "800", letterSpacing: ".08em" }} className="mono meta">EVERY ENTRY HAS A SOURCE</span>
</div>
<div style={{ position: "relative", paddingLeft: "22px", marginBottom: "22px" }}>
<span style={{ position: "absolute", left: "5px", top: "6px", bottom: "6px", width: "2px", background: "var(--line)" }}></span>
{s.changelog.map((c, i) => {
  const [kl, kc] = KIND_LABEL[c.kind] ?? ["CHANGE", "wd"];
  return (
<div key={c.date + c.kind} style={{ position: "relative", paddingBottom: i < s.changelog.length - 1 ? "14px" : 0 }}>
<span style={{ position: "absolute", left: "-22px", top: "4px", width: "12px", height: "12px", borderRadius: "999px", ...(i === 0 ? { background: "var(--red)", border: "2px solid #FFFFFF", boxShadow: "0 0 0 1.5px var(--red)" } : { background: "var(--card)", border: "2px solid var(--ink)" }) }}></span>
<div style={{ display: "flex", alignItems: "center", gap: "9px", flexWrap: "wrap", marginBottom: "3px" }}><span style={{ fontSize: "11.5px", fontWeight: "800" }} className="mono">{fmtDate(c.date).toUpperCase()}</span><span style={{ fontSize: "9px" }} className={`badge ${kc}`}>{c.kind === "status" ? `STATUS → ${lab}` : kl}</span></div>
<div style={{ fontSize: "13.5px", fontWeight: "500", lineHeight: "1.55", color: "var(--fg-2)" }}>{c.text}&#160;{c.source && <a href={c.source.startsWith("http") ? c.source : s.sourceUrl} target="_blank" rel="noopener noreferrer" style={{ fontSize: "11.5px", fontWeight: "800", color: "var(--red-text)" }} className="mono">Source: {c.source.startsWith("http") ? body?.prefix ?? "publisher" : c.source} ↗</a>}</div>
</div>
  );
})}
</div>
<p style={{ margin: "-10px 0 22px", fontSize: "11.5px", lineHeight: "1.55" }} className="meta">Changes detected by monitoring go to a verification queue first; they appear here only after an editor confirms them and adds the source. Followers are emailed on confirmation, not on detection.</p>
<div style={{ fontSize: "16px", marginBottom: "11px" }} className="h">Our coverage</div>
{articles.length === 0 ? <p className="meta" style={{ margin: "0 0 20px" }}>No article references this standard yet.</p> : (
<div style={{ display: "flex", flexDirection: "column", gap: "11px", marginBottom: "20px" }}>
{articles.map((a, i) => <Link key={a.slug} href={articleHref(a)} style={{ display: "flex", gap: "11px", alignItems: "flex-start", paddingBottom: i < articles.length - 1 ? "11px" : 0, borderBottom: i < articles.length - 1 ? "1px solid var(--line-soft)" : undefined }}><span style={{ fontSize: "11.5px", fontWeight: "800", color: "var(--red-text)", marginTop: "2px" }} className="mono">{String(i + 1).padStart(2, "0")}</span><span><span style={{ display: "block", fontSize: "16px" }} className="h">{a.title}</span><span style={{ fontSize: "11px", fontWeight: "700" }} className="mono meta">{sectionByCode(a.section)?.label.toUpperCase()} · {fmtDate(a.date).toUpperCase()}</span></span></Link>)}
</div>
)}
<div style={{ background: "var(--paper)", borderRadius: "12px", padding: "16px 18px", display: "flex", alignItems: "center", gap: "14px", flexWrap: "wrap" }}>
<div style={{ flex: "1 1 320px" }}>
<div style={{ fontSize: "13.5px", fontWeight: "800", marginBottom: "4px" }}>Has the status changed? Tell us</div>
<p style={{ margin: "0", fontSize: "12px", lineHeight: "1.55" }} className="meta">Standards change, and we cannot check every entry every day. Reader reports are verified, the entry is updated, and the change appears in Standards Watch on the front page.</p>
</div>
<Link href={`/contact/?subject=correction&about=${s.slug}`} style={{ minHeight: "40px", padding: "0 18px", border: "1.5px solid var(--ink)", borderRadius: "999px", background: "var(--card)", fontSize: "13px", fontWeight: "800", display: "inline-flex", alignItems: "center" }}>Report a change</Link>
</div>
</div>
<div style={{ padding: "24px 22px", display: "flex", flexDirection: "column", gap: "20px" }}>
<div>
<div style={{ fontSize: "10px", fontWeight: "800", letterSpacing: ".12em", color: "var(--grey)", marginBottom: "10px" }} className="mono">BIBLIOGRAPHIC</div>
<dl style={{ margin: "0", fontSize: "13px" }}>
{([["Body", body?.prefix === "EN" ? "CEN" : body?.prefix ?? s.body.toUpperCase()], ["Edition", s.edition ?? "—"], ["Replaces", s.replaces ?? "—"], ["Replaced by", s.replacedBy], ["Subject", subjectLabel(s.subject)], ["Adopted as", s.adoptedAs?.join(" / ")]] as [string, string | undefined][]).filter(([, v]) => v).map(([k, v]) => (
<div key={k} style={{ display: "flex", justifyContent: "space-between", gap: "10px", padding: "7px 0", borderTop: "1px solid var(--line-soft)" }}><dt style={{ fontSize: "12.5px" }} className="meta">{k}</dt><dd style={{ margin: "0", fontWeight: "700", textAlign: "right" }} className={k === "Subject" ? undefined : "mono"}>{v}</dd></div>
))}
</dl>
</div>
{related.length > 0 && (
<div>
<div style={{ fontSize: "10px", fontWeight: "800", letterSpacing: ".12em", color: "var(--grey)", marginBottom: "10px" }} className="mono">RELATED STANDARDS</div>
<div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
{related.map((r) => <Link key={r!.slug} href={`/standards/${r!.slug}/`} style={{ fontSize: "13px", fontWeight: "800", padding: "9px 12px", border: "1px solid var(--line)", borderRadius: "8px" }} className="mono">{r!.no} →</Link>)}
</div>
</div>
)}
{s.equivalents && s.equivalents.length > 0 && (
<div>
<div style={{ fontSize: "10px", fontWeight: "800", letterSpacing: ".12em", color: "var(--grey)", marginBottom: "10px" }} className="mono">EQUIVALENTS</div>
<div style={{ display: "flex", flexDirection: "column" }}>
{s.equivalents.map((e) => <div key={e.no} style={{ display: "flex", justifyContent: "space-between", gap: "10px", padding: "7px 0", borderTop: "1px solid var(--line-soft)", fontSize: "12.5px" }}><span className="mono" style={{ fontWeight: 800 }}>{e.no}</span><span className={`badge ${e.relation === "equivalent" ? "cur" : e.relation === "partial" ? "rev" : "wd"}`} style={{ fontSize: "9px" }}>{e.relation.toUpperCase()}</span></div>)}
</div>
</div>
)}
<div>
<div style={{ fontSize: "10px", fontWeight: "800", letterSpacing: ".12em", color: "var(--grey)", marginBottom: "6px" }} className="mono">CERTIFIED TO THIS STANDARD</div>
<p style={{ margin: "0 0 10px", fontSize: "11.5px", lineHeight: "1.5" }} className="meta">Claimed Directory companies whose certificate an editor has checked. Unverified ones do not appear.</p>
{certified.length === 0 ? <p className="meta" style={{ margin: 0, fontSize: "12.5px" }}>None verified yet.</p> : certified.map((c) => <Link key={c.slug} href={`/directory/${c.slug}/`} style={{ display: "flex", alignItems: "center", gap: "10px", padding: "9px 0", borderTop: "1px solid var(--line-soft)" }}><span style={{ width: "30px", height: "30px", borderRadius: "7px", background: "#F2F3F5", border: "1px solid var(--line)", flexShrink: "0" }}></span><span style={{ fontSize: "13.5px", fontWeight: "800" }}>{c.name}</span></Link>)}
</div>
</div>
</div>
</div>
</div>
    </Shell>
  );
}
