/* Ported 1:1 from canvas board Submit-H. */
import Link from "next/link";
import { Shell } from "@/components/shell/Shell";
import { SubmitForm } from "./SubmitForm";
import { SITE } from "@/lib/site";
import "@/styles/board-sub.css";

export function SubmitBoard() {
  return (
    <Shell header="compact" board="b-sub">
<section style={{ paddingTop: "30px", paddingBottom: "46px" }} className="wrap">
<nav aria-label="Breadcrumb" style={{ fontSize: "12.5px", fontWeight: "500", color: "var(--slate)", marginBottom: "12px" }}><Link href="/" style={{ color: "var(--slate)" }}>Home</Link> / <span style={{ color: "var(--ink)", fontWeight: "800" }}>Submit an article</span></nav>
<div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", gap: "28px", flexWrap: "wrap", marginBottom: "26px" }}>
<div>
<h1 style={{ margin: "0 0 8px", fontSize: "40px", letterSpacing: "-.045em" }} className="h">Submit an article<span style={{ color: "var(--red-text)" }}>.</span></h1>
<p style={{ margin: "0", fontSize: "15.5px", fontWeight: "500", lineHeight: "1.55", color: "var(--slate)", maxWidth: "620px" }}>Submissions go to editorial review. The final section, SEO details, front-page placement and publication time are the editors&#8217; decision.</p>
</div>
</div>
<div style={{ display: "grid", gridTemplateColumns: "minmax(0,1fr) 316px", gap: "32px", alignItems: "start" }} className="cols">
<div>
<SubmitForm />
</div>
<aside style={{ display: "flex", flexDirection: "column", gap: "18px" }}>
<div style={{ border: "2px solid var(--ink)", borderRadius: "16px", padding: "22px", background: "var(--card)" }}>
<div style={{ fontSize: "18px", marginBottom: "12px" }} className="h">What happens next</div>
<div style={{ display: "flex", flexDirection: "column", gap: "13px", fontSize: "13.5px", fontWeight: "500", lineHeight: "1.5" }}>
<div style={{ display: "flex", gap: "11px" }}><span style={{ fontWeight: "800", color: "var(--red-text)", flexShrink: "0" }}>1</span><span>Editors check facts, sources and image rights</span></div>
<div style={{ display: "flex", gap: "11px" }}><span style={{ fontWeight: "800", color: "var(--red-text)", flexShrink: "0" }}>2</span><span>Approved → section and publication date set; changes needed → returned with notes</span></div>
<div style={{ display: "flex", gap: "11px" }}><span style={{ fontWeight: "800", color: "var(--red-text)", flexShrink: "0" }}>3</span><span>The outcome appears under &#8220;My submissions&#8221; and in your notifications</span></div>
</div>
</div>
<div style={{ border: "1px solid var(--line)", borderRadius: "16px", padding: "22px", background: "var(--card)" }}>
<div style={{ fontSize: "18px", marginBottom: "10px" }} className="h">What we publish</div>
<ul style={{ margin: "0", paddingLeft: "18px", display: "flex", flexDirection: "column", gap: "9px", fontSize: "13.5px", fontWeight: "500", lineHeight: "1.5", color: "var(--fg-3)" }}>
<li>Verifiable industry news and technical reference material</li>
<li>Real specification comparisons and first-hand site experience</li>
<li>English only; long-form pieces of 1,200 words or more preferred</li>
</ul>
<div style={{ height: "1px", background: "var(--line)", margin: "14px 0" }}></div>
<div style={{ fontSize: "18px", marginBottom: "10px" }} className="h">What we don&#8217;t</div>
<ul style={{ margin: "0", paddingLeft: "18px", display: "flex", flexDirection: "column", gap: "9px", fontSize: "13.5px", fontWeight: "500", lineHeight: "1.5", color: "var(--fg-3)" }}>
<li>Market-size, price-trend or capability claims without evidence</li>
<li>Pure product promotion (see <Link href="/advertise/" style={{ color: "var(--red-text)", fontWeight: "800" }}>commercial options</Link>)</li>
<li>AI-generated images presented as evidence of a real project</li>
</ul>
</div>
<div style={{ background: "var(--paper)", borderRadius: "16px", padding: "20px" }}>
<div style={{ fontSize: "16px", marginBottom: "7px" }} className="h">Questions?</div>
<p style={{ margin: "0", fontSize: "13.5px", fontWeight: "500", lineHeight: "1.6", color: "var(--slate)" }}>Write to <a href={`mailto:${SITE.email}`} style={{ color: "var(--red-text)", fontWeight: "800" }}>{SITE.email}</a> with a one-line outline of the topic.</p>
</div>
</aside>
</div>
</section>
    </Shell>
  );
}
