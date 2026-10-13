/* Ported 1:1 from canvas board RFQ-V: a direct message to ONE claimed company. Not a quote platform — nothing is forwarded, matched or charged for. */
import Link from "next/link";
import { Shell } from "@/components/shell/Shell";
import { SimpleForm } from "@/components/boards/shared/SimpleForm";
import { ENQUIRY_SUBJECT, SURFACE_TREATMENT, PRODUCT_BY_CODE, COUNTRY, COUNTRY_BY_CODE, ORGANISATION_TYPE_BY_CODE } from "@/data/vocab";
import type { Company } from "@/lib/content/types";
import "@/styles/board-rfq.css";
import { PageHeadArt, HEAD_ART } from "@/components/shell/PageHeadArt";

export function ContactCompanyBoard({ c }: { c: Company }) {
  const place = `${c.city}, ${COUNTRY_BY_CODE[c.country]?.name ?? c.country}`;
  const orgType = ORGANISATION_TYPE_BY_CODE[c.orgType]?.labelEn ?? c.orgType;
  return (
    <Shell header="compact" active="directory" board="b-rfq">
<section style={{ paddingTop: "30px", paddingBottom: "50px" }} className="wrap">
<nav aria-label="Breadcrumb" className="meta" style={{ marginBottom: "18px" }}><Link href="/" style={{ color: "var(--slate)" }}>Home</Link> / <Link href="/directory/" style={{ color: "var(--slate)" }}>Directory</Link> / <Link href={`/directory/${c.slug}/`} style={{ color: "var(--slate)" }}>{c.name}</Link> / <b style={{ color: "var(--ink)" }}>Contact</b></nav>
{/* 定位说明 */}
<div style={{ borderColor: "var(--ink)", borderWidth: "2px", padding: "20px 26px", display: "flex", gap: "18px", alignItems: "flex-start", flexWrap: "wrap", marginBottom: "20px" }} className="frame">
<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="var(--ink)" strokeWidth="2" strokeLinejoin="round" aria-hidden="true" style={{ flexShrink: "0", marginTop: "2px" }}><rect x="2.5" y="4.5" width="19" height="15" rx="2" /><path d="m3 6 9 6 9-6" /></svg>
<div style={{ flex: "1 1 520px" }}>
<div style={{ fontSize: "17px", marginBottom: "6px" }} className="h">This is a contact form, not a quote platform</div>
<p style={{ margin: "0", lineHeight: "1.65" }} className="meta">You read an article and want to reach the company that makes the thing. This form sends your message to that one company. We <b style={{ color: "var(--ink)" }}>do not forward it to anyone else</b>, do not run comparisons, charge no lead fees, and take no part in negotiation or delivery. Wire Mesh News is not a party to any transaction.</p>
</div>
<div style={{ background: "var(--paper)", borderRadius: "10px", padding: "13px 16px", flex: "0 1 300px" }}>
<div style={{ fontSize: "11px", fontWeight: "800", letterSpacing: ".1em", color: "var(--slate)", marginBottom: "7px" }}>WHEN THIS FORM APPEARS</div>
<div style={{ fontSize: "12.5px", fontWeight: "500", lineHeight: "1.7", color: "var(--fg-3)" }}>&#183; The company has claimed its profile<br />&#183; It has set a receiving email<br />&#183; You are signed in</div>
</div>
</div>
{!c.claimed ? (
<div className="frame" style={{ padding: "28px" }}>
<div className="h" style={{ fontSize: "22px", marginBottom: "8px" }}>{c.name} has not claimed its profile yet</div>
<p className="meta" style={{ margin: "0 0 16px", fontSize: "14px" }}>Nobody receives messages for an unclaimed profile, so the form is hidden. {c.website ? "Use the company's own website instead." : "Try the company directly."}</p>
<div style={{ display: "flex", gap: "9px", flexWrap: "wrap" }}>
{c.website && <a href={c.website} rel="nofollow noopener noreferrer" target="_blank" className="btn">Company website</a>}
<Link href={`/directory/${c.slug}/`} className="btn ghost">Back to the profile</Link>
</div>
</div>
) : (
<div style={{ display: "grid", gridTemplateColumns: "0.8fr 1.2fr", gap: "20px" }} className="cols">
<div>
<div style={{ padding: "22px 24px", marginBottom: "18px" }} className="frame">
<div style={{ display: "flex", gap: "13px", alignItems: "flex-start", marginBottom: "16px" }}>
<span style={{ width: "50px", height: "50px", borderRadius: "12px", background: "var(--line)", flexShrink: "0" }}></span>
<div><div style={{ fontSize: "19px", marginBottom: "3px" }} className="h">{c.name}</div><div className="meta">{orgType} &#183; {place}</div><span style={{ background: "var(--st-current-bg)", color: "var(--up)", display: "inline-block", marginTop: "6px" }} className="st">CLAIMED</span></div>
</div>
<div style={{ display: "flex", flexDirection: "column", gap: "11px", fontSize: "14px", fontWeight: "700", padding: "14px 0", borderTop: "1px solid var(--line)", borderBottom: "1px solid var(--line)", marginBottom: "14px" }}>
<span style={{ display: "flex", alignItems: "center", gap: "10px", color: "var(--grey)" }}><svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="var(--red-text)" strokeWidth="2" aria-hidden="true"><rect x="2.5" y="4.5" width="19" height="15" rx="2" /><path d="m3 6 9 6 9-6" /></svg>Email shown after sign-in</span>
<span style={{ display: "flex", alignItems: "center", gap: "10px", color: "var(--grey)" }}><svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="var(--red-text)" strokeWidth="2" strokeLinejoin="round" aria-hidden="true"><path d="M5 3.5h3.5l1.8 4.3-2.2 1.4a12 12 0 0 0 5.7 5.7l1.4-2.2 4.3 1.8V18a2.5 2.5 0 0 1-2.8 2.5C9.3 19.6 4.4 14.7 3.5 6.3A2.5 2.5 0 0 1 5 3.5z" /></svg>Phone shown after sign-in</span>
</div>
<div style={{ display: "flex", flexDirection: "column", gap: "9px" }}>
<a href="#message" style={{ width: "100%", boxSizing: "border-box" }} className="btn red">Contact this company</a>
{c.website && <a href={c.website} rel="nofollow noopener noreferrer" target="_blank" style={{ width: "100%", boxSizing: "border-box" }} className="btn ghost">Company website</a>}
</div>
</div>
<div style={{ padding: "20px 24px", background: "var(--surface-dark)", color: "#FFFFFF", border: "0", position: "relative", overflow: "hidden" }} className="frame">
<PageHeadArt src={HEAD_ART.hall} />
<div style={{ position: "relative" }}>
<div style={{ fontSize: "16px", color: "#FFFFFF", marginBottom: "10px" }} className="h">The rules, in the open</div>
<div style={{ fontSize: "12.5px", fontWeight: "500", lineHeight: "1.75", color: "var(--on-dark-2)" }}>
&#183; This message goes <b style={{ color: "#FFFFFF" }}>only to {c.name}</b><br />
&#183; We <b style={{ color: "#FFFFFF" }}>never forward it</b> to other companies or broker introductions<br />
&#183; We <b style={{ color: "#FFFFFF" }}>charge nothing</b> and cannot guarantee a reply<br />
&#183; Your contact details go to this company only, never into an advertising system<br />
&#183; Companies related to this publication&#8217;s operator carry a relationship note
</div>
</div>
</div>
</div>
<div>
<div id="message" style={{ padding: "24px 28px" }} className="frame">
<div style={{ display: "flex", alignItems: "center", gap: "12px", paddingBottom: "15px", borderBottom: "2px solid var(--ink)", marginBottom: "18px" }}>
<span style={{ width: "38px", height: "38px", borderRadius: "9px", background: "var(--line)", flexShrink: "0" }}></span>
<div style={{ flex: "1 1 auto" }}><div style={{ fontSize: "11px", fontWeight: "800", letterSpacing: ".08em", color: "var(--grey)" }}>MESSAGE TO</div><div style={{ fontSize: "17px" }} className="h">{c.name}</div></div>
<span style={{ background: "var(--st-withdrawn-bg)", color: "var(--slate)" }} className="st">1 recipient only</span>
</div>
<SimpleForm success={<>
<div style={{ width: "44px", height: "44px", borderRadius: "11px", background: "var(--st-current-bg)", display: "inline-flex", alignItems: "center", justifyContent: "center", marginBottom: "13px" }}><svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="var(--up)" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="m5 12.5 4.5 4.5L19 7.5" /></svg></div>
<div style={{ fontSize: "19px", marginBottom: "7px" }} className="h">Message sent</div>
<p style={{ margin: "0 0 14px", lineHeight: "1.6" }} className="meta">Sent to <b style={{ color: "var(--ink)" }}>{c.name}</b>, with a copy to your email. They reply to you directly, not through us.</p>
<div style={{ background: "var(--paper)", borderRadius: "9px", padding: "12px 14px", fontSize: "12.5px", fontWeight: "500", lineHeight: "1.6", color: "var(--fg-3)" }}><b>We cannot guarantee a reply.</b> If you hear nothing within a week, the record is in your account and you are free to contact other companies in the Directory yourself.</div>
</>}>
<div style={{ fontSize: "11px", fontWeight: "800", letterSpacing: ".1em", color: "var(--grey)", marginBottom: "12px" }}>YOUR MESSAGE</div>
<div className="fld"><label htmlFor="m1">SUBJECT *</label><select id="m1" name="subject" className="inp" defaultValue="product_enquiry">{ENQUIRY_SUBJECT.map((s) => <option key={s.code} value={s.code}>{s.label}</option>)}</select></div>
<div className="fld"><label htmlFor="m2">MESSAGE *</label><textarea id="m2" name="message" rows={3} required placeholder="Say what you want to know. Describing the application makes the reply far more useful." className="inp"></textarea></div>
<details>
<summary style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: "12px", padding: "12px 15px", background: "var(--paper)", borderRadius: "9px", marginBottom: "16px", cursor: "pointer" }}>
<span style={{ fontSize: "13.5px", fontWeight: "800" }}>Add a specification (optional)</span>
<span style={{ fontSize: "12px", fontWeight: "500", color: "var(--slate)" }}>Saves a round of questions <span style={{ color: "var(--red-text)", fontWeight: "800" }}>&#9660;</span></span>
</summary>
<div style={{ border: "1px solid var(--line)", borderRadius: "11px", padding: "18px 20px", marginBottom: "18px" }}>
<div className="g2" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "14px" }}>
<div style={{ marginBottom: "0" }} className="fld"><label htmlFor="s1">PRODUCT TYPE</label><select id="s1" name="product" className="inp" defaultValue=""><option value="">&#8212;</option>{c.products.map((p) => <option key={p} value={p}>{PRODUCT_BY_CODE[p]?.labelEn ?? p}</option>)}</select></div>
<div style={{ marginBottom: "0" }} className="fld"><label htmlFor="s2">WIRE DIAMETER</label><input id="s2" name="wire" type="text" placeholder="e.g. 4.0 mm" className="inp" /></div>
<div style={{ marginBottom: "0" }} className="fld"><label htmlFor="s3">MESH OPENING</label><input id="s3" name="opening" type="text" placeholder="e.g. 50 × 200 mm" className="inp" /></div>
<div style={{ marginBottom: "0" }} className="fld"><label htmlFor="s4">SURFACE TREATMENT</label><select id="s4" name="surface" className="inp" defaultValue=""><option value="">&#8212;</option>{SURFACE_TREATMENT.slice(0, 8).map((s) => <option key={s.code} value={s.code}>{s.labelEn}</option>)}</select></div>
<div style={{ marginBottom: "0" }} className="fld"><label htmlFor="s5">STANDARD</label><input id="s5" name="standard" type="text" placeholder="e.g. ASTM A392" className="inp" /></div>
<div style={{ marginBottom: "0" }} className="fld"><label htmlFor="s6">APPROX. QUANTITY</label><input id="s6" name="qty" type="text" placeholder="e.g. 5,000 panels" className="inp" /></div>
</div>
<div style={{ margin: "14px 0 0" }} className="fld"><label htmlFor="s7">DRAWING OR SPEC SHEET</label>
<label htmlFor="s7" style={{ border: "2px dashed var(--line-2)", borderRadius: "9px", padding: "13px", textAlign: "center", background: "var(--paper-2)", cursor: "pointer", display: "block" }}>
<div style={{ fontSize: "13px", fontWeight: "800", marginBottom: "2px" }}>Upload a drawing or specification</div><div style={{ fontSize: "11.5px" }} className="meta">PDF, DWG or images &#183; up to 20 MB each &#183; visible to this company only</div>
</label><input id="s7" name="file" type="file" accept=".pdf,.dwg,.dxf,image/*" style={{ display: "none" }} />
</div>
</div>
</details>
<div style={{ fontSize: "11px", fontWeight: "800", letterSpacing: ".1em", color: "var(--grey)", marginBottom: "12px" }}>YOUR DETAILS</div>
<div className="g2" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "14px" }}>
<div className="fld"><label htmlFor="d1">NAME *</label><input id="d1" name="name" type="text" required className="inp" autoComplete="name" /></div>
<div className="fld"><label htmlFor="d2">WORK EMAIL *</label><input id="d2" name="email" type="email" required className="inp" autoComplete="email" /></div>
<div className="fld"><label htmlFor="d3">COMPANY</label><input id="d3" name="company" type="text" className="inp" autoComplete="organization" /></div>
<div className="fld"><label htmlFor="d4">COUNTRY *</label><div style={{ position: "relative" }}><select id="d4" name="country" required style={{ appearance: "none", paddingRight: "32px" }} className="inp" defaultValue=""><option value="" disabled>Select a country</option>{COUNTRY.filter((x) => x.dialCode).map((x) => <option key={x.alpha2} value={x.alpha2}>{x.name}</option>)}</select><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="var(--ink)" strokeWidth="3" strokeLinecap="round" aria-hidden="true" style={{ position: "absolute", right: "12px", top: "16px", pointerEvents: "none" }}><path d="m5 9 7 7 7-7" /></svg></div></div>
</div>
<label style={{ display: "flex", gap: "10px", alignItems: "flex-start", fontSize: "13px", fontWeight: "500", lineHeight: "1.55", cursor: "pointer", marginBottom: "16px" }}><input type="checkbox" required style={{ width: "18px", height: "18px", accentColor: "var(--red)", flexShrink: "0", marginTop: "1px" }} /><span>I agree to the above being sent to <b>{c.name}</b> and have read the <Link href="/policies/privacy/" style={{ color: "var(--red-text)", fontWeight: "800", textDecoration: "underline" }}>Privacy Policy</Link>.</span></label>
<div style={{ display: "flex", gap: "12px", alignItems: "center", flexWrap: "wrap" }}>
<button type="submit" className="btn red">Send message</button>
<span className="meta">Sign-in required &#183; at most 5 messages per account per day</span>
</div>
</SimpleForm>
</div>
</div>
</div>
)}
</section>
    </Shell>
  );
}
