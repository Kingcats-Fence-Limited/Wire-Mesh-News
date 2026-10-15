/* Ported 1:1 from canvas board Standards-Y ① (index) and ② (detail). Bibliographic facts and our own summaries only — never the standard's text. */
import Link from "next/link";
import { Shell } from "@/components/shell/Shell";
import { FollowStandard } from "./FollowStandard";
import { getStandardByNo } from "@/lib/content/source";
import { byStandard } from "@/lib/content/articles";
import { COMPANIES } from "@/lib/content/directory";
import { STANDARDS_BODY } from "@/data/vocab/standards_body";
import { STANDARD_SUBJECT_BY_CODE } from "@/data/vocab/standard_subject";
import { STANDARD_STATUS } from "@/data/vocab/standard_status";
import { articleHref, fmtDate, sectionByCode } from "@/lib/site";
import type { Standard, StandardStatus } from "@/lib/content/types";
import "@/styles/board-std.css";

const BADGE: Record<string, string> = { cur: "cur", rev: "rev", dft: "dft", new: "cur", wd: "wd", sup: "wd" };
const STATUS: Record<StandardStatus, [string, string]> = Object.fromEntries(STANDARD_STATUS.map((s) => [s.code, [s.label.toUpperCase(), BADGE[s.badge] ?? "wd"]])) as Record<StandardStatus, [string, string]>;
const bodyOf = (code: string) => STANDARDS_BODY.find((b) => b.code === code);
const subjectLabel = (code: string) => STANDARD_SUBJECT_BY_CODE[code]?.labelEn ?? code;

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
