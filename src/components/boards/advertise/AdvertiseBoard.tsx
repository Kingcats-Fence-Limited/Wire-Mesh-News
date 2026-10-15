/* Ported 1:1 from canvas board Advertise-I. */
import Link from "next/link";
import { Shell } from "@/components/shell/Shell";
import { SimpleForm } from "@/components/boards/shared/SimpleForm";
import { SITE } from "@/lib/site";
import "@/styles/board-adv.css";

const SERVICES: { lbl: string; bg: string; fg: string; title: string; text: string; dim?: boolean }[] = [
  { lbl: "SPONSORED CONTENT", bg: "var(--ink)", fg: "var(--on-ink)", title: "Content production and sponsored publication", text: "Company interviews, product introductions, technical and project case studies, produced with editorial help. Labelled Sponsored Content on list pages and on the article itself." },
  { lbl: "TOPIC SPONSORSHIP", bg: "var(--ink)", fg: "var(--on-ink)", title: "Topic sponsorship", text: "Sponsor presence on an existing content topic. The sponsorship label is shown separately; the topic's editorial content is never counted as sponsored." },
  { lbl: "ADVERTISEMENT", bg: "var(--line)", fg: "var(--fg-3)", title: "Display advertising", text: "A small number of slots on the front page, section pages and article pages, each labelled Advertisement. Unsold, unscheduled or expired slots hide themselves and never cover the text." },
  { lbl: "EVENT PARTNERSHIP", bg: "var(--line)", fg: "var(--fg-3)", title: "Event media partnership", text: "Event features, on-site coverage and company interviews. What is delivered, and what counts as partner content, is written down before the quote." },
  { lbl: "LATER PHASE", bg: "var(--st-review-bg)", fg: "var(--st-review-fg)", title: "Paid reports", text: "Enquiries only for now. Reports go on sale once there is original research to sell; nothing unfinished is pre-sold.", dim: true },
  { lbl: "LATER PHASE", bg: "var(--st-review-bg)", fg: "var(--st-review-fg)", title: "Newsletter advertising", text: "Opens once the weekly brief is sending reliably and the subscriber base can be verified.", dim: true },
];
const FLOW: [string, string][] = [["Enquiry", "Submit the form; an internal record is created"], ["Conversation", "A person discusses needs and feasibility"], ["Quote", "Each partnership is quoted individually"], ["Schedule", "Deliverables and dates confirmed"], ["Production", "Content produced or assets approved"], ["Editorial review", "Facts, image rights and sources checked"], ["Live", "Published or displayed as scheduled"], ["Record", "A record of what actually ran"]];

export function AdvertiseBoard() {
  return (
    <Shell header="compact" board="b-adv">
{/* Hero */}
<section style={{ background: "var(--surface-dark)", color: "#FFFFFF", position: "relative", overflow: "hidden" }}>
<svg width="520" height="520" viewBox="0 0 120 120" style={{ position: "absolute", right: "-60px", top: "-90px", color: "var(--mesh-dark)" }} aria-hidden="true"><use href="#w2" width="120" height="120" /></svg>
<div style={{ position: "relative", paddingTop: "52px", paddingBottom: "52px" }} className="wrap">
<nav aria-label="Breadcrumb" style={{ fontSize: "12.5px", fontWeight: "500", color: "var(--grey-2)", marginBottom: "16px" }}><Link href="/" style={{ color: "var(--grey-2)" }}>Home</Link> / <span style={{ color: "#FFFFFF", fontWeight: "800" }}>Advertise &amp; Partner</span></nav>
<h1 style={{ margin: "0 0 16px", fontSize: "52px", letterSpacing: "-.05em", lineHeight: "1.02", maxWidth: "740px", color: "#FFFFFF" }} className="h">Reach the people who specify and buy wire mesh<span style={{ color: "var(--red-text)" }}>.</span></h1>
<p style={{ margin: "0 0 24px", fontSize: "18px", fontWeight: "500", lineHeight: "1.55", maxWidth: "620px", color: "var(--on-dark-2)" }}>Wire Mesh News is read by international buyers, engineers, contractors and distributors. Partnerships take the form of sponsored content, topic sponsorship, display advertising and event media partnerships — all clearly labelled.</p>
<div style={{ display: "flex", gap: "12px", flexWrap: "wrap" }}>
<a href="#enquiry" style={{ background: "var(--red)", color: "#FFFFFF", fontWeight: "800", fontSize: "15px", padding: "0 26px", minHeight: "52px", borderRadius: "999px", display: "inline-flex", alignItems: "center" }}>Start an enquiry</a>
<a href={`mailto:${SITE.email}`} style={{ border: "2px solid #FFFFFF", color: "#FFFFFF", fontWeight: "800", fontSize: "15px", padding: "0 26px", minHeight: "52px", borderRadius: "999px", display: "inline-flex", alignItems: "center" }}>{SITE.email}</a>
</div>
<div style={{ marginTop: "26px", padding: "14px 18px", background: "var(--surface-dark-2)", borderRadius: "10px", maxWidth: "700px", fontSize: "13.5px", fontWeight: "500", lineHeight: "1.6", color: "var(--grey-3)" }}>
This is a newly launched publication and we do not yet publish traffic or reach figures. Audience data will appear here once it is stable and verifiable; partnership results are described with verifiable data only.
</div>
</div>
</section>
{/* 服务 */}
<section style={{ paddingTop: "48px", paddingBottom: "44px" }} className="wrap">
<h2 style={{ margin: "0 0 6px", fontSize: "30px" }} className="h">What we offer</h2>
<p style={{ margin: "0 0 24px", fontSize: "14.5px" }} className="meta">Four partnership types are available in this first phase; pricing is by conversation and individual quote.</p>
<div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "20px" }} className="cols">
{SERVICES.map((s) => (
<div key={s.title} className="svc" style={s.dim ? { background: "var(--paper-2)" } : undefined}>
<span style={{ background: s.bg, color: s.fg }} className="lbl">{s.lbl}</span>
<div style={{ fontSize: "20px" }} className="h">{s.title}</div>
<p style={{ margin: "0", fontSize: "14px", fontWeight: "500", lineHeight: "1.6", color: "var(--slate)" }}>{s.text}</p>
</div>
))}
</div>
</section>
{/* 流程 */}
<section style={{ background: "var(--paper)", padding: "44px 0" }}>
<div className="wrap">
<h2 style={{ margin: "0 0 6px", fontSize: "30px" }} className="h">How a partnership runs</h2>
<p style={{ margin: "0 0 22px", fontSize: "14.5px" }} className="meta">No online payment, self-serve ad booking or membership packages in this phase.</p>
<div className="flow">
{FLOW.map(([t, d], i) => <div key={t} className="fstep"><span className="n">{String(i + 1).padStart(2, "0")}</span><span style={{ fontSize: "14px", fontWeight: "800" }}>{t}</span><span style={{ lineHeight: "1.5" }} className="meta">{d}</span></div>)}
</div>
</div>
</section>
{/* 表单 + 边界 */}
<section id="enquiry" style={{ paddingTop: "48px", paddingBottom: "52px" }} className="wrap">
<div style={{ display: "grid", gridTemplateColumns: "minmax(0,1fr) 360px", gap: "44px", alignItems: "start" }} className="cols">
<div>
<h2 style={{ margin: "0 0 6px", fontSize: "30px" }} className="h">Enquiry form</h2>
<p style={{ margin: "0 0 22px", fontSize: "14.5px" }} className="meta">We reply by email. Contact details and attachments are never published or shared with other users.</p>
<SimpleForm success={<><div className="h" style={{ fontSize: "24px", marginBottom: "8px" }}>Enquiry received.</div><p className="meta" style={{ fontSize: "14.5px", margin: 0 }}>Thank you — we will reply by email, usually within two working days. If it is urgent, write to {SITE.email}.</p></>}>
<div className="g2" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "18px", marginBottom: "18px" }}>
<div className="fld"><label htmlFor="a1">COMPANY *</label><input id="a1" name="company" type="text" required className="inp" /></div>
<div className="fld"><label htmlFor="a2">CONTACT NAME *</label><input id="a2" name="name" type="text" required className="inp" /></div>
<div className="fld"><label htmlFor="a3">EMAIL *</label><input id="a3" name="email" type="email" required placeholder="you@company.com" className="inp" /></div>
<div className="fld"><label htmlFor="a4">PARTNERSHIP TYPE *</label><select id="a4" name="type" className="inp" defaultValue="sponsored"><option value="sponsored">Sponsored content</option><option value="topic">Topic sponsorship</option><option value="display">Display advertising</option><option value="event">Event partnership</option><option value="other">Other</option></select></div>
</div>
<div style={{ marginBottom: "18px" }} className="fld"><label htmlFor="a5">GOALS *</label><textarea id="a5" name="goals" rows={3} required placeholder="What you want to achieve, which readers you want to reach, and any specific product or project." className="inp"></textarea></div>
<div className="g2" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "18px", marginBottom: "18px" }}>
<div className="fld"><label htmlFor="a6">TIMING</label><input id="a6" name="timing" type="text" placeholder="e.g. Q4 2026 / two weeks before the show" className="inp" /></div>
<div className="fld"><label htmlFor="a7">BUDGET RANGE (OPTIONAL)</label><select id="a7" name="budget" className="inp" defaultValue="discuss"><option value="discuss">Prefer to discuss</option><option value="lt5">Under US$5,000</option><option value="5-15">US$5,000 – 15,000</option><option value="gt15">Over US$15,000</option></select></div>
</div>
<div style={{ marginBottom: "18px" }} className="fld"><label htmlFor="a8">ATTACHMENT (OPTIONAL)</label>
<div style={{ border: "2px dashed var(--line-2)", borderRadius: "12px", padding: "20px", textAlign: "center", background: "var(--paper-2)" }}>
<div style={{ fontSize: "14.5px", fontWeight: "800", marginBottom: "4px" }}>Drag a file here, or <label htmlFor="a8" style={{ color: "var(--red-text)", fontWeight: "800", cursor: "pointer", textDecoration: "underline" }}>choose a file</label><input id="a8" name="file" type="file" accept=".pdf,.doc,.docx,.ppt,.pptx,image/*" style={{ display: "none" }} /></div>
<div className="meta">PDF, Word, PowerPoint or images, up to 20 MB. Attachments are internal only.</div>
</div>
</div>
<label style={{ display: "flex", gap: "11px", alignItems: "flex-start", fontSize: "14px", fontWeight: "500", lineHeight: "1.55", cursor: "pointer", marginBottom: "20px" }}><input type="checkbox" required style={{ width: "19px", height: "19px", accentColor: "var(--red)", flexShrink: "0", marginTop: "1px" }} /><span>I have read the <Link href="/policies/privacy/" style={{ color: "var(--red-text)", fontWeight: "800", textDecoration: "underline" }}>Privacy Policy</Link> and agree to my contact details being used for this purpose.</span></label>
<div style={{ display: "flex", gap: "14px", alignItems: "center", flexWrap: "wrap" }}>
<button type="submit" style={{ minHeight: "52px", padding: "0 30px", borderRadius: "999px", border: "0", background: "var(--ink)", color: "var(--on-ink)", fontFamily: "inherit", fontSize: "15px", fontWeight: "800", cursor: "pointer" }}>Send enquiry</button>
<span className="meta">You will see a confirmation, an error, or a duplicate-submission notice.</span>
</div>
</SimpleForm>
</div>
<aside style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
<div style={{ border: "2px solid var(--ink)", borderRadius: "16px", padding: "24px" }}>
<div style={{ fontSize: "19px", marginBottom: "12px" }} className="h">Editorial boundary</div>
<div style={{ display: "flex", flexDirection: "column", gap: "12px", fontSize: "13.5px", fontWeight: "500", lineHeight: "1.6", color: "var(--fg-3)" }}>
{["Paid content is fact-checked, and its image rights and sources verified, like everything else.", "Sponsored content is clearly labelled on list pages and on the article; commercial links are marked sponsored.", "A partnership does not buy automatic publication; ordinary submissions are still judged on their merits.", "Payment never promises search rankings, directory inclusion, enquiries or orders.", "Directory listing and order are never paid for."].map((t) => <div key={t} style={{ display: "flex", gap: "10px" }}><span style={{ color: "var(--red-text)", fontWeight: "800", flexShrink: "0" }}>·</span><span>{t}</span></div>)}
</div>
</div>
<div style={{ border: "1px solid var(--line)", borderRadius: "16px", padding: "24px" }}>
<div style={{ fontSize: "19px", marginBottom: "12px" }} className="h">Contact</div>
<div style={{ display: "flex", flexDirection: "column", gap: "9px", fontSize: "14.5px", fontWeight: "500" }}>
<a href={`mailto:${SITE.email}`} style={{ fontWeight: "800" }}>{SITE.email}</a>
{SITE.phone && <span>{SITE.phone}</span>}
<span className="meta">{SITE.operator.region}</span>
</div>
<div style={{ height: "1px", background: "var(--line)", margin: "16px 0" }}></div>
<p style={{ margin: "0", fontSize: "13px", fontWeight: "500", lineHeight: "1.6", color: "var(--slate)" }}>The operating company and its ownership are disclosed on the <Link href="/about/" style={{ color: "var(--red-text)", fontWeight: "800" }}>About</Link> page. Content about the operator or its related companies is reviewed to the same standard as any other and carries a relationship note.</p>
</div>
<div style={{ background: "var(--paper)", borderRadius: "16px", padding: "22px" }}>
<div style={{ fontSize: "17px", marginBottom: "8px" }} className="h">Looking to contribute instead?</div>
<p style={{ margin: "0 0 13px", fontSize: "13.5px", fontWeight: "500", lineHeight: "1.6", color: "var(--slate)" }}>Technical content and industry experience can be submitted free of charge and is reviewed to editorial standards.</p>
<Link href="/submit/" style={{ border: "2px solid var(--ink)", fontWeight: "800", fontSize: "13.5px", padding: "0 20px", minHeight: "44px", borderRadius: "999px", display: "inline-flex", alignItems: "center" }}>Submit an article</Link>
</div>
</aside>
</div>
</section>
    </Shell>
  );
}
