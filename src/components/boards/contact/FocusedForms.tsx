"use client";

/* Two focused forms reached from the menu: "Suggest a listing" (Directory) and "Submit an event"
   (Events). They ask for exactly what the editors need, and go to the same inbox as the
   contact form, labelled so they are routed straight to the right desk. */
import Link from "next/link";
import { SimpleForm } from "@/components/boards/shared/SimpleForm";
import { COUNTRY } from "@/data/vocab/country";

const COUNTRIES = COUNTRY.slice().sort((a, b) => a.name.localeCompare(b.name));
const F = ({ id, label, children }: { id: string; label: string; children: React.ReactNode }) => <div className="fld"><label htmlFor={id}>{label}</label>{children}</div>;
const grid: React.CSSProperties = { display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px", marginBottom: "16px" };
const consent = <label style={{ display: "flex", gap: "10px", alignItems: "flex-start", fontSize: "13.5px", fontWeight: 500, lineHeight: 1.55, cursor: "pointer", margin: "4px 0 18px" }}><input type="checkbox" required style={{ width: "18px", height: "18px", accentColor: "var(--red)", flexShrink: 0, marginTop: "1px" }} /><span>I have read the <Link href="/policies/privacy/" style={{ color: "var(--red-text)", fontWeight: 800, textDecoration: "underline" }}>Privacy Policy</Link> and agree to my contact details being used for this purpose.</span></label>;
const submit = (t: string) => <button type="submit" style={{ width: "100%", minHeight: "50px", border: 0, borderRadius: "999px", background: "var(--ink)", color: "var(--on-ink)", fontFamily: "inherit", fontSize: "15px", fontWeight: 800, cursor: "pointer" }}>{t}</button>;
const countrySelect = (id: string, name: string) => <select id={id} name={name} required className="inp" defaultValue=""><option value="" disabled>Select a country</option>{COUNTRIES.map((c) => <option key={c.alpha2} value={c.alpha2}>{c.name}</option>)}</select>;

export function ListingForm() {
  return (
    <>
      <div style={{ fontSize: "22px", marginBottom: "6px" }} className="h">Suggest a company for the Directory</div>
      <p style={{ margin: "0 0 18px", lineHeight: "1.55" }} className="meta">Listing is free and decided by the editors; it cannot be bought. Your own company? You can also <Link href="/directory/" className="lnk">claim an existing profile</Link>.</p>
      <SimpleForm send="contact" extra={{ form: "listing", reason: "directory" }} success={<><div className="h" style={{ fontSize: "22px", marginBottom: "8px" }}>Suggestion received.</div><p className="meta" style={{ fontSize: "14px", margin: 0 }}>The directory editor checks the company against public sources, usually within five working days, and writes back if anything is missing.</p></>}>
        <div className="g2" style={grid}>
          <F id="l1" label="COMPANY NAME *"><input id="l1" name="company_name" required maxLength={160} className="inp" /></F>
          <F id="l2" label="WEBSITE *"><input id="l2" name="website" type="url" required placeholder="https://" className="inp" /></F>
        </div>
        <div className="g2" style={grid}>
          <F id="l3" label="COUNTRY *">{countrySelect("l3", "country")}</F>
          <F id="l4" label="YOUR CONNECTION *"><select id="l4" name="relation" required className="inp" defaultValue=""><option value="" disabled>Choose…</option><option value="employee">I work there</option><option value="customer">Customer or supplier of theirs</option><option value="other">Other / no connection</option></select></F>
        </div>
        <div style={{ marginBottom: "16px" }} className="fld"><label htmlFor="l5">WHAT DO THEY MAKE OR DO? *</label><textarea id="l5" name="what" rows={3} required minLength={10} maxLength={1500} placeholder="Products, processes, markets — and any article of ours they relate to" className="inp" /></div>
        <div className="g2" style={grid}>
          <F id="l6" label="YOUR NAME *"><input id="l6" name="name" required className="inp" autoComplete="name" /></F>
          <F id="l7" label="YOUR EMAIL *"><input id="l7" name="email" type="email" required className="inp" autoComplete="email" /></F>
        </div>
        {consent}
        {submit("Send suggestion")}
      </SimpleForm>
    </>
  );
}

export function EventForm() {
  return (
    <>
      <div style={{ fontSize: "22px", marginBottom: "6px" }} className="h">Submit an event</div>
      <p style={{ margin: "0 0 18px", lineHeight: "1.55" }} className="meta">Trade shows, conferences and webinars for the wire, mesh, fencing and grating trade. Editors check the official website before adding it to the <Link href="/events/" className="lnk">calendar</Link>; listing is free.</p>
      <SimpleForm send="contact" extra={{ form: "event", reason: "other" }} success={<><div className="h" style={{ fontSize: "22px", marginBottom: "8px" }}>Event received.</div><p className="meta" style={{ fontSize: "14px", margin: 0 }}>Thank you. Editors check the details and add it to the calendar, usually within five working days.</p></>}>
        <div style={{ marginBottom: "16px" }} className="fld"><label htmlFor="e1">EVENT NAME *</label><input id="e1" name="event_name" required maxLength={200} className="inp" /></div>
        <div className="g2" style={grid}>
          <F id="e2" label="STARTS *"><input id="e2" name="start" type="date" required className="inp" /></F>
          <F id="e3" label="ENDS"><input id="e3" name="end" type="date" className="inp" /></F>
        </div>
        <div className="g2" style={grid}>
          <F id="e4" label="FORMAT *"><select id="e4" name="format" required className="inp" defaultValue="in_person"><option value="in_person">In person</option><option value="online">Online</option><option value="hybrid">Hybrid</option></select></F>
          <F id="e5" label="CITY (IF IN PERSON)"><input id="e5" name="city" maxLength={120} className="inp" /></F>
        </div>
        <div className="g2" style={grid}>
          <F id="e6" label="COUNTRY">{<select id="e6" name="country" className="inp" defaultValue=""><option value="">—</option>{COUNTRIES.map((c) => <option key={c.alpha2} value={c.alpha2}>{c.name}</option>)}</select>}</F>
          <F id="e7" label="OFFICIAL WEBSITE *"><input id="e7" name="website" type="url" required placeholder="https://" className="inp" /></F>
        </div>
        <div className="g2" style={grid}>
          <F id="e8" label="ORGANISER *"><input id="e8" name="organiser" required maxLength={160} className="inp" /></F>
          <F id="e9" label="VENUE"><input id="e9" name="venue" maxLength={160} className="inp" /></F>
        </div>
        <div className="g2" style={grid}>
          <F id="e10" label="YOUR NAME *"><input id="e10" name="name" required className="inp" autoComplete="name" /></F>
          <F id="e11" label="YOUR EMAIL *"><input id="e11" name="email" type="email" required className="inp" autoComplete="email" /></F>
        </div>
        {consent}
        {submit("Submit event")}
      </SimpleForm>
    </>
  );
}
