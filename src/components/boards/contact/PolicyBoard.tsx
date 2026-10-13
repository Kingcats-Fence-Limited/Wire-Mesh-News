/* Ported 1:1 from canvas board Contact-O ② — the shared policy-page template. */
import Link from "next/link";
import { Shell } from "@/components/shell/Shell";
import { POLICIES } from "@/lib/content/policies";
import { SITE } from "@/lib/site";
import type { Policy } from "@/lib/content/types";
import "@/styles/board-contact.css";

export function PolicyBoard({ p }: { p: Policy }) {
  return (
    <Shell header="compact" board="b-contact">
<section style={{ paddingTop: "30px", paddingBottom: "50px" }} className="wrap">
<div style={{ display: "grid", gridTemplateColumns: "232px minmax(0,1fr)", gap: "36px", alignItems: "start", maxWidth: "1020px" }} className="cols">
<nav aria-label="Policies" className="polnav">
<div className="polhd">Policies<span className="mono c">{POLICIES.length}</span></div>
{POLICIES.map((x, i) => <Link key={x.slug} href={`/policies/${x.slug}/`} className={x.slug === p.slug ? "on" : undefined} aria-current={x.slug === p.slug ? "page" : undefined}><span className="mono n">{String(i + 1).padStart(2, "0")}</span><span className="t">{x.title}</span></Link>)}
<div className="polft">Questions about a policy? <a href={`mailto:${SITE.email}`}>{SITE.email}</a></div>
</nav>
{/* phones / tablets: one collapsed row instead of a wall of links */}
<details className="polsheet">
<summary><span className="k">Policies</span><span className="cur">{p.title}</span><svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" aria-hidden="true"><path d="m5 8 7 7 7-7" /></svg></summary>
<div className="pollist">
{POLICIES.map((x, i) => <Link key={x.slug} href={`/policies/${x.slug}/`} className={x.slug === p.slug ? "on" : undefined} aria-current={x.slug === p.slug ? "page" : undefined}><span className="mono n">{String(i + 1).padStart(2, "0")}</span><span className="t">{x.title}</span></Link>)}
</div>
</details>
<div>
<nav aria-label="Breadcrumb" style={{ marginBottom: "12px" }} className="meta"><Link href="/" style={{ color: "var(--slate)" }}>Home</Link> / Policies / <b style={{ color: "var(--ink)" }}>{p.title}</b></nav>
<h1 style={{ margin: "0 0 10px", fontSize: "34px", letterSpacing: "-.045em" }} className="h">{p.title}</h1>
<div style={{ display: "flex", gap: "14px", flexWrap: "wrap", alignItems: "center", paddingBottom: "16px", borderBottom: "1px solid var(--line)", marginBottom: "18px" }}>
<span className="meta">Last updated 10 October 2026</span>
<span style={{ width: "1px", height: "14px", background: "var(--line)" }}></span>
<span className="meta">Version 1</span>
{p.draft && <><span style={{ width: "1px", height: "14px", background: "var(--line)" }}></span><span style={{ background: "var(--st-review-bg)", color: "var(--st-review-fg)", fontSize: "10px", fontWeight: 800, letterSpacing: ".1em", padding: "4px 8px", borderRadius: "4px" }}>DRAFT · UNDER LEGAL REVIEW</span></>}
</div>
<div style={{ background: "var(--paper)", borderLeft: "4px solid var(--ink)", borderRadius: "0 10px 10px 0", padding: "14px 18px", marginBottom: "20px" }}>
<div style={{ fontSize: "11.5px", fontWeight: "800", letterSpacing: ".1em", color: "var(--slate)", marginBottom: "5px" }}>IN SHORT</div>
<div style={{ fontSize: "14px", fontWeight: "500", lineHeight: "1.6", color: "var(--fg-3)" }}>{p.inShort}</div>
</div>
<div className="polbody">
{(() => { let n = 0; return p.paras.map((para, i) => {
  const m = para.match(/^([A-Z][A-Za-z ,&'’-]{2,48})\.\s+(.*)$/s);
  if (!m || /^(We|Our|The|This|If|You|It|Comments|Wire|Contact)\b/.test(m[1])) return <p key={i}>{para}</p>;
  n += 1;
  return <div key={i}><h2 className="h">{n} · {m[1]}</h2><p>{m[2]}</p></div>;
}); })()}
{p.sections.length > 0 && (
<div style={{ border: "1px dashed var(--line-2)", borderRadius: "12px", padding: "16px 20px", marginBottom: "18px", background: "var(--paper-2)" }}>
<div style={{ fontSize: "11.5px", fontWeight: 800, letterSpacing: ".1em", color: "var(--slate)", marginBottom: "8px" }}>SECTIONS IN THE FINAL TEXT</div>
<ol style={{ margin: 0, paddingLeft: "20px", fontSize: "14.5px", fontWeight: 500, lineHeight: 1.7 }}>{p.sections.map((s) => <li key={s}>{s}</li>)}</ol>
</div>
)}
</div>
<div style={{ display: "flex", gap: "14px", alignItems: "center", background: "var(--paper)", borderRadius: "12px", padding: "16px 20px", flexWrap: "wrap" }}>
<span style={{ fontSize: "14px", fontWeight: "700" }}>Questions about this policy?</span>
<a href={`mailto:${SITE.email}`} style={{ fontSize: "13.5px", fontWeight: "800", color: "var(--red-text)" }}>{SITE.email}</a>
</div>
</div>
</div>
</section>
    </Shell>
  );
}
