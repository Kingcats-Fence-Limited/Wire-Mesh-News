"use client";

/* Ported 1:1 from canvas board Contact-O ①. */
import Link from "next/link";
import { useFlatParams } from "@/lib/use-flat-params";
import { CONTACT_SUBJECT } from "@/data/vocab/contact_subject";
import { SimpleForm } from "@/components/boards/shared/SimpleForm";
import { ListingForm, EventForm } from "./FocusedForms";
import { SITE } from "@/lib/site";
import "@/styles/board-contact.css";

const REASONS: [string, string][] = CONTACT_SUBJECT.map((c) => [c.code, c.label]);

/* Static page; ?subject= preselects the reason in the browser. */
export function ContactFromUrl() {
  const p = useFlatParams<{ subject?: string; form?: string }>();
  return <ContactBoard subject={p.subject} form={p.form === "listing" || p.form === "event" ? p.form : undefined} />;
}

export function ContactBoard({ subject, form }: { subject?: string; form?: "listing" | "event" }) {
  const def = REASONS.some(([k]) => k === subject) ? subject : "editorial_tip";
  return (
    <>
<section style={{ paddingTop: "30px", paddingBottom: "50px" }} className="wrap">
<nav aria-label="Breadcrumb" className="meta" style={{ marginBottom: "18px" }}><Link href="/" style={{ color: "var(--slate)" }}>Home</Link> / <b style={{ color: "var(--ink)" }}>Contact</b></nav>
<div style={{ display: "grid", gridTemplateColumns: "1.05fr 1fr", gap: "44px", alignItems: "start" }} className="cols">
<div>
<h1 style={{ margin: "0 0 10px", fontSize: "40px", letterSpacing: "-.045em" }} className="h">Contact<span style={{ color: "var(--red-text)" }}>.</span></h1>
<p style={{ margin: "0 0 22px", fontSize: "15.5px", fontWeight: "500", lineHeight: "1.6", color: "var(--slate)" }}>Pick the reason first and it reaches the right person faster. We reply on US Eastern working days, usually within two working days.</p>
<div className="route">
<span className="ico"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--red-text)" strokeWidth="2.1" strokeLinejoin="round" aria-hidden="true"><path d="M4 19.5V5a1.5 1.5 0 0 1 1.5-1.5H16L20 7.5V19.5a1.5 1.5 0 0 1-1.5 1.5h-13A1.5 1.5 0 0 1 4 19.5z" /><path d="M8 9h6M8 13h8M8 17h5" /></svg></span>
<div><b style={{ fontSize: "15px", display: "block", marginBottom: "3px" }}>Editorial &amp; news tips</b><span style={{ lineHeight: "1.55" }} className="meta">Something worth reporting, data or documents, or a factual point about a published story.<br /><a href={`mailto:${SITE.email}`} style={{ color: "var(--red-text)", fontWeight: "800" }}>{SITE.email}</a></span></div>
</div>
<div className="route">
<span className="ico"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--red-text)" strokeWidth="2.1" strokeLinecap="round" aria-hidden="true"><path d="M12 8v5M12 16.5v.01" /><circle cx="12" cy="12" r="9" /></svg></span>
<div><b style={{ fontSize: "15px", display: "block", marginBottom: "3px" }}>Corrections</b><span style={{ lineHeight: "1.55" }} className="meta">Found an error? Send a verifiable source. Once checked, we correct the article and note what changed and when.<br /><a href="#form" style={{ color: "var(--red-text)", fontWeight: "800" }}>Submit a correction →</a></span></div>
</div>
<div className="route">
<span className="ico"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--red-text)" strokeWidth="2.1" strokeLinecap="round" aria-hidden="true"><path d="M12 16V4m0 0L7.5 8.5M12 4l4.5 4.5" /><path d="M4 16v2.5A1.5 1.5 0 0 0 5.5 20h13a1.5 1.5 0 0 0 1.5-1.5V16" /></svg></span>
<div><b style={{ fontSize: "15px", display: "block", marginBottom: "3px" }}>Submissions</b><span style={{ lineHeight: "1.55" }} className="meta">Use the submission flow rather than emailing a full article.<br /><Link href="/submit/" style={{ color: "var(--red-text)", fontWeight: "800" }}>Submit an Article →</Link></span></div>
</div>
<div className="route">
<span className="ico"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--red-text)" strokeWidth="2.1" strokeLinejoin="round" aria-hidden="true"><rect x="3" y="5" width="18" height="14" rx="2" /><path d="M3 10h18" /></svg></span>
<div><b style={{ fontSize: "15px", display: "block", marginBottom: "3px" }}>Advertising &amp; partnerships</b><span style={{ lineHeight: "1.55" }} className="meta">Sponsored content, display advertising and event partnerships.<br /><Link href="/advertise/" style={{ color: "var(--red-text)", fontWeight: "800" }}>Advertise &amp; Partner →</Link></span></div>
</div>
<div style={{ borderBottom: "0" }} className="route">
<span className="ico"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--red-text)" strokeWidth="2.1" strokeLinejoin="round" aria-hidden="true"><circle cx="12" cy="8" r="3.4" /><path d="M4.5 20a7.5 7.5 0 0 1 15 0" /></svg></span>
<div><b style={{ fontSize: "15px", display: "block", marginBottom: "3px" }}>Account &amp; privacy</b><span style={{ lineHeight: "1.55" }} className="meta">Sign-in problems, closing an account, and personal-data access or deletion requests.<br /><a href={`mailto:${SITE.email}`} style={{ color: "var(--red-text)", fontWeight: "800" }}>{SITE.email}</a></span></div>
</div>
<div style={{ background: "var(--surface-dark)", color: "#FFFFFF", borderRadius: "14px", padding: "22px", marginTop: "24px" }}>
<div style={{ fontSize: "11.5px", fontWeight: "800", letterSpacing: ".12em", color: "var(--grey-2)", marginBottom: "13px" }}>PUBLICATION DETAILS</div>
<div style={{ display: "flex", flexDirection: "column", gap: "10px", fontSize: "14px", fontWeight: "500" }}>
<div style={{ display: "flex", justifyContent: "space-between", gap: "14px" }}><span style={{ color: "var(--grey-3)" }}>Publication</span><b>{SITE.name}</b></div>
<div style={{ display: "flex", justifyContent: "space-between", gap: "14px" }}><span style={{ color: "var(--grey-3)" }}>Region</span><b>{SITE.operator.region}</b></div>
<div style={{ display: "flex", justifyContent: "space-between", gap: "14px" }}><span style={{ color: "var(--grey-3)" }}>Email</span><b>{SITE.email}</b></div>
{SITE.phone && <div style={{ display: "flex", justifyContent: "space-between", gap: "14px" }}><span style={{ color: "var(--grey-3)" }}>Phone</span><b>{SITE.phone}</b></div>}
</div>
<p style={{ margin: "13px 0 0", fontSize: "12.5px", fontWeight: "500", lineHeight: "1.6", color: "var(--grey-5)" }}>The operating company, its ownership and the data controller are stated on <Link href="/about/" style={{ color: "var(--grey-3)", textDecoration: "underline" }}>About</Link>, <Link href="/policies/privacy/" style={{ color: "var(--grey-3)", textDecoration: "underline" }}>Privacy</Link> and <Link href="/policies/terms/" style={{ color: "var(--grey-3)", textDecoration: "underline" }}>Terms</Link>; the footer does not repeat them.</p>
</div>
</div>
<div id="form" style={{ border: "1px solid var(--line)", borderRadius: "16px", padding: "26px", scrollMarginTop: "20px" }}>
{form === "listing" ? <ListingForm /> : form === "event" ? <EventForm /> : <>
<div style={{ fontSize: "22px", marginBottom: "6px" }} className="h">Send a message</div>
<p style={{ margin: "0 0 18px", lineHeight: "1.55" }} className="meta">Not sure who to write to? Use this form.</p>
<SimpleForm send="contact" success={<><div className="h" style={{ fontSize: "22px", marginBottom: "8px" }}>Message sent.</div><p className="meta" style={{ fontSize: "14px", margin: 0 }}>Thank you. We reply by email, usually within two working days.</p></>}>
<div className="g2" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px", marginBottom: "16px" }}>
<div className="fld"><label htmlFor="c1">NAME *</label><input id="c1" name="name" type="text" required className="inp" /></div>
<div className="fld"><label htmlFor="c2">EMAIL *</label><input id="c2" name="email" type="email" required placeholder="you@company.com" className="inp" /></div>
</div>
<div className="g2" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px", marginBottom: "16px" }}>
<div className="fld"><label htmlFor="c3">COMPANY</label><input id="c3" name="company" type="text" className="inp" /></div>
<div className="fld"><label htmlFor="c4">REASON *</label><select id="c4" name="reason" className="inp" defaultValue={def}>{REASONS.map(([k, l]) => <option key={k} value={k}>{l}</option>)}</select></div>
</div>
<div style={{ marginBottom: "16px" }} className="fld"><label htmlFor="c5">MESSAGE *</label><textarea id="c5" name="message" rows={5} required className="inp"></textarea></div>
<label style={{ display: "flex", gap: "10px", alignItems: "flex-start", fontSize: "13.5px", fontWeight: "500", lineHeight: "1.55", cursor: "pointer", marginBottom: "18px" }}><input type="checkbox" required style={{ width: "18px", height: "18px", accentColor: "var(--red)", flexShrink: "0", marginTop: "1px" }} /><span>I have read the <Link href="/policies/privacy/" style={{ color: "var(--red-text)", fontWeight: "800", textDecoration: "underline" }}>Privacy Policy</Link> and agree to my contact details being used for this purpose.</span></label>
<button type="submit" style={{ width: "100%", minHeight: "50px", border: "0", borderRadius: "999px", background: "var(--ink)", color: "var(--on-ink)", fontFamily: "inherit", fontSize: "15px", fontWeight: "800", cursor: "pointer" }}>Send message</button>
<p style={{ margin: "12px 0 0", lineHeight: "1.55" }} className="meta">You will see a confirmation, an error, or a duplicate-submission notice. The form is rate-limited.</p>
</SimpleForm>
</>}
</div>
</div>
</section>
    </>
  );
}
