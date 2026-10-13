"use client";

/* Account-G "My company" panel. Phase 1 has no backend: the editor shows every field a
   claimed company can maintain, which fields stay with the editors, and what a submitted
   change looks like. Nothing is saved — the confirmation says so. Field rules follow the
   Directory Policy: description, product range, photos and contact details are editable and
   reviewed before they go live; company type, related coverage and editorial notes stay
   with the editors; certification details lock once submitted. */
import Link from "next/link";
import { useMemo, useState } from "react";
import { PRODUCT, PRODUCT_BY_CODE } from "@/data/vocab/product";
import { CATEGORY, CATEGORY_BY_CODE } from "@/data/vocab/category";
import { REGION } from "@/data/vocab/region";
import { EMPLOYEE_RANGE } from "@/data/vocab/employee_range";
import { CERTIFICATION_TYPE, CERTIFICATION_TYPE_BY_CODE } from "@/data/vocab/certification_type";
import { CERTIFICATION_ISSUER } from "@/data/vocab/certification_issuer";
import { ORGANISATION_TYPE_BY_CODE } from "@/data/vocab/organisation_type";
import { APPLICATION_AREA_BY_CODE } from "@/data/vocab/application_area";
import { COUNTRY_BY_CODE } from "@/data/vocab/country";
import type { Company } from "@/lib/content/types";

type Related = { title: string; href: string };
type Mode = "view" | "edit" | "sent";

const SUMMARY_MAX = 400;
/* The pending edit shown in review: one product added to the range. */
const PENDING_ADD = "twin_wire_panel";

const Lock = () => (
  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" aria-hidden="true" style={{ flexShrink: 0 }}><rect x="4" y="11" width="16" height="10" rx="2" /><path d="M8 11V7a4 4 0 0 1 8 0v4" /></svg>
);
const Tag = ({ kind, children }: { kind: "self" | "ver" | "lock" | "review" | "new"; children: React.ReactNode }) => {
  const m = { self: ["var(--line)", "var(--slate)"], ver: ["var(--st-current-bg)", "var(--up)"], lock: ["var(--paper)", "var(--slate)"], review: ["var(--st-review-bg)", "var(--st-review-fg)"], new: ["var(--st-red-bg)", "var(--red-deep)"] }[kind];
  return <span style={{ background: m[0], color: m[1], fontSize: "9.5px", padding: "3px 7px", borderRadius: "4px", display: "inline-flex", alignItems: "center", gap: "4px" }} className="st">{kind === "lock" && <Lock />}{children}</span>;
};
const Group = ({ title, tag, hint, children }: { title: string; tag?: React.ReactNode; hint?: string; children: React.ReactNode }) => (
  <fieldset style={{ border: "1px solid var(--line)", borderRadius: "12px", padding: "16px 18px", margin: 0, display: "flex", flexDirection: "column", gap: "12px", minWidth: 0 }}>
    <legend style={{ padding: "0 6px", marginLeft: "-6px", display: "flex", alignItems: "center", gap: "8px" }}><span style={{ fontSize: "15px" }} className="h">{title}</span>{tag}</legend>
    {hint && <p style={{ margin: "-4px 0 0", lineHeight: "1.55" }} className="meta">{hint}</p>}
    {children}
  </fieldset>
);
const Field = ({ id, label, children, aside }: { id: string; label: string; children: React.ReactNode; aside?: React.ReactNode }) => (
  <div style={{ display: "flex", flexDirection: "column", gap: "5px", minWidth: 0 }}>
    <div style={{ display: "flex", justifyContent: "space-between", gap: "8px" }}><label htmlFor={id} className="lbl">{label}</label>{aside}</div>
    {children}
  </div>
);
const Locked = ({ label, value, note }: { label: string; value: React.ReactNode; note: string }) => (
  <div style={{ display: "grid", gridTemplateColumns: "150px minmax(0,1fr)", gap: "4px 14px", padding: "10px 0", borderTop: "1px solid var(--line)" }} className="lockrow">
    <span className="lbl" style={{ color: "var(--slate)", display: "flex", alignItems: "center", gap: "6px" }}><Lock />{label}</span>
    <span style={{ fontSize: "13.5px", fontWeight: 700 }}>{value}<span className="meta" style={{ display: "block", fontWeight: 500, marginTop: "2px" }}>{note}</span></span>
  </div>
);

const HISTORY: { date: string; field: string; change: string; status: "review" | "approved" | "declined"; note?: string }[] = [
  { date: "11 Oct 2026", field: "Product range", change: `Added “${PRODUCT_BY_CODE[PENDING_ADD]?.labelEn}”`, status: "review", note: "With the directory editor. The public page keeps the previous range until this is approved." },
  { date: "3 Oct 2026", field: "Description", change: "Rewrote the summary; removed “leading supplier” wording", status: "approved", note: "Approved 4 Oct · live" },
  { date: "1 Oct 2026", field: "Description", change: "“The leading 358 mesh supplier in northern China”", status: "declined", note: "Not accepted: an unsourced market-position claim. Directory Policy — what we will not publish." },
  { date: "30 Sep 2026", field: "Claim", change: "Profile claimed with a company-domain email", status: "approved", note: "Verified by the directory editor" },
];

export function CompanyPanel({ co, related }: { co: Company; related: Related[] }) {
  const [mode, setMode] = useState<Mode>("view");
  const [showHistory, setShowHistory] = useState(false);

  const initial = useMemo(() => ({
    summary: co.summary,
    products: co.products,
    website: co.website ?? "",
    email: "",
    phone: "",
    city: co.city,
    employees: co.employees ?? "",
    markets: co.exportMarkets ?? [],
  }), [co]);
  const [f, setF] = useState(initial);
  const [newCert, setNewCert] = useState({ type: "", issuer: "", no: "", expires: "" });
  const [catOpen, setCatOpen] = useState<string>(co.categories[0] ?? "fencing");
  const set = <K extends keyof typeof f>(k: K, v: (typeof f)[K]) => setF((x) => ({ ...x, [k]: v }));
  const toggle = (k: "products" | "markets", code: string) => set(k, f[k].includes(code) ? f[k].filter((c) => c !== code) : [...f[k], code]);

  const changed = [
    f.summary !== initial.summary && "Description",
    (f.products.length !== initial.products.length || f.products.some((p) => !initial.products.includes(p))) && "Product range",
    (f.website !== initial.website || f.email !== initial.email || f.phone !== initial.phone || f.city !== initial.city) && "Contact details",
    (f.employees !== initial.employees || f.markets.length !== initial.markets.length || f.markets.some((m) => !initial.markets.includes(m))) && "Company facts",
    newCert.type && "New certificate",
  ].filter(Boolean) as string[];

  const country = COUNTRY_BY_CODE[co.country]?.name ?? co.country;

  /* ---------- compact view ---------- */
  const head = (
    <div className="minihd"><span style={{ fontSize: "17px" }} className="h">My company</span><span style={{ background: "var(--st-current-bg)", color: "var(--up)" }} className="st">CLAIMED</span></div>
  );
  const summaryBlock = (
    <div style={{ display: "flex", gap: "13px", alignItems: "flex-start" }}>
      <span style={{ width: "46px", height: "46px", borderRadius: "11px", background: "var(--ink)", color: "var(--on-ink)", flexShrink: 0, display: "inline-flex", alignItems: "center", justifyContent: "center", fontSize: "15px", fontWeight: 800 }}>{co.name.split(" ").map((w) => w[0]).slice(0, 2).join("")}</span>
      <div style={{ minWidth: 0 }}><div style={{ fontSize: "15px", fontWeight: 800 }}>{co.name}</div><div className="meta">{ORGANISATION_TYPE_BY_CODE[co.orgType]?.labelEn ?? co.orgType} · {co.city}, {country}</div><Link href={`/directory/${co.slug}/`} style={{ fontSize: "12px", fontWeight: 800, color: "var(--red-text)" }}>View public profile &#8594;</Link></div>
    </div>
  );

  if (mode === "sent") {
    return (
      <div className="mini" id="company" style={{ gridColumn: "1 / -1" }}>
        {head}
        <div role="status" style={{ background: "var(--st-current-bg)", borderLeft: "4px solid var(--up)", borderRadius: "0 10px 10px 0", padding: "14px 16px", display: "flex", flexDirection: "column", gap: "6px" }}>
          <span style={{ fontSize: "15px", color: "var(--up)" }} className="h">Sent for review (preview)</span>
          <span style={{ fontSize: "13.5px", fontWeight: 500, lineHeight: 1.6 }}>In the live version this goes to the directory editor. Changed: <b>{changed.join(", ") || "nothing"}</b>. The public profile keeps its current content until each change is approved, and you get an email with the result.</span>
          <span className="meta">This is the preview account — nothing was saved.</span>
        </div>
        <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
          <button type="button" className="btn dark" onClick={() => setMode("edit")}>Back to the editor</button>
          <button type="button" className="btn" onClick={() => { setF(initial); setNewCert({ type: "", issuer: "", no: "", expires: "" }); setMode("view"); }}>Done</button>
        </div>
      </div>
    );
  }

  if (mode === "view") {
    return (
      <div className="mini" id="company" style={{ gridColumn: "1 / -1" }}>
        {head}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px 28px" }} className="cols">
          <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
            {summaryBlock}
            <div style={{ display: "flex", flexDirection: "column", gap: "10px", fontSize: "13.5px", fontWeight: 500, paddingTop: "12px", borderTop: "1px solid var(--line)" }}>
              <div style={{ display: "flex", justifyContent: "space-between", gap: "12px" }}><span style={{ color: "var(--slate)" }}>Claim approved</span><b>{co.verifiedAt ?? "—"}</b></div>
              <div style={{ display: "flex", justifyContent: "space-between", gap: "12px" }}><span style={{ color: "var(--slate)" }}>Verified by</span><b>Company-domain email</b></div>
              <div style={{ display: "flex", justifyContent: "space-between", gap: "12px" }}><span style={{ color: "var(--slate)" }}>Edits in review</span><b style={{ color: "var(--st-review-fg)" }}>1</b></div>
            </div>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
            <div className="note">Your change to <b>Product range</b> (adding “{PRODUCT_BY_CODE[PENDING_ADD]?.labelEn}”) is in review. The public page keeps the previous content until it is approved.</div>
            <div style={{ fontSize: "13px", fontWeight: 500, lineHeight: 1.6 }}>
              <div style={{ fontSize: "11px", fontWeight: 800, letterSpacing: ".1em", color: "var(--slate)", marginBottom: "4px" }}>YOU CAN EDIT</div>
              Description · Product range · Product photos · Contact details · Employees and export markets (shown as self-reported) · New certificates
              <div style={{ fontSize: "11px", fontWeight: 800, letterSpacing: ".1em", color: "var(--slate)", margin: "10px 0 4px" }}>KEPT BY THE EDITORS</div>
              Company type · Directory categories · Application areas · Country · Related coverage · Editorial notes · Certificates already submitted
            </div>
          </div>
        </div>
        <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
          <button type="button" className="btn dark" onClick={() => setMode("edit")}>Edit company profile</button>
          <button type="button" className="btn" aria-expanded={showHistory} aria-controls="co-history" onClick={() => setShowHistory((v) => !v)}>{showHistory ? "Hide change history" : "Change history"}</button>
        </div>
        {showHistory && <History />}
      </div>
    );
  }

  /* ---------- editor ---------- */
  const productsByCat = CATEGORY.map((c) => ({ ...c, items: PRODUCT.filter((p) => p.category === c.code) }));
  return (
    <div className="mini" id="company" style={{ gridColumn: "1 / -1" }}>
      <div className="minihd"><span style={{ fontSize: "17px" }} className="h">Edit company profile</span><span style={{ background: "var(--st-review-bg)", color: "var(--st-review-fg)" }} className="st">CHANGES ARE REVIEWED</span></div>
      <div style={{ display: "flex", alignItems: "center", gap: "10px", flexWrap: "wrap", background: "var(--paper)", borderRadius: "10px", padding: "10px 14px", fontSize: "12.5px", fontWeight: 600 }}>
        <span style={{ background: "var(--red)", color: "#FFFFFF", fontSize: "9.5px", fontWeight: 800, letterSpacing: ".14em", padding: "3px 7px", borderRadius: "3px" }}>PREVIEW</span>
        Every field below works so you can check the editor; nothing is saved. Controlled fields are drop-downs from the site vocabularies; city is the only free-text place field.
      </div>
      {summaryBlock}

      <div style={{ display: "grid", gridTemplateColumns: "minmax(0,1fr) minmax(0,1fr)", gap: "16px" }} className="cols">
        <Group title="Description" tag={<Tag kind="self">SELF-REPORTED</Tag>} hint="Plain facts about what you make and for whom. Not published: capacity, market share or performance figures without a third-party source, claims about competitors, promotional copy.">
          <Field id="co-sum" label="SUMMARY" aside={<span className="meta" style={{ color: f.summary.length > SUMMARY_MAX ? "var(--red-text)" : undefined }}>{f.summary.length} / {SUMMARY_MAX}</span>}>
            <textarea id="co-sum" rows={5} className="inp" value={f.summary} maxLength={SUMMARY_MAX} onChange={(e) => set("summary", e.target.value)} />
          </Field>
        </Group>

        <Group title="Contact details" hint="Enquiries from “Contact this company” go to the enquiry email only; it is never shown on the page. Without it the contact button is hidden.">
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px" }} className="g2f">
            <Field id="co-web" label="WEBSITE"><input id="co-web" type="url" className="inp" value={f.website} placeholder="https://" onChange={(e) => set("website", e.target.value)} /></Field>
            <Field id="co-mail" label="ENQUIRY EMAIL"><input id="co-mail" type="email" className="inp" value={f.email} placeholder={`sales@${co.slug.split("-")[0]}.com`} onChange={(e) => set("email", e.target.value)} /></Field>
            <Field id="co-tel" label="PHONE"><input id="co-tel" type="tel" className="inp" value={f.phone} placeholder={`${COUNTRY_BY_CODE[co.country]?.dialCode ?? "+"} …`} onChange={(e) => set("phone", e.target.value)} /></Field>
            <Field id="co-city" label="CITY"><input id="co-city" type="text" className="inp" value={f.city} onChange={(e) => set("city", e.target.value)} /></Field>
          </div>
        </Group>
      </div>

      <Group title="Product range" tag={<Tag kind="self">SELF-REPORTED</Tag>} hint={`Tick what you actually supply. ${f.products.length} selected. Products appear as tags on your profile and in directory filters.`}>
        <div role="tablist" aria-label="Product categories" style={{ display: "flex", gap: "6px", flexWrap: "wrap" }}>
          {productsByCat.map((c) => {
            const n = c.items.filter((p) => f.products.includes(p.code)).length;
            return <button key={c.code} type="button" role="tab" aria-selected={catOpen === c.code} onClick={() => setCatOpen(c.code)} className={`btn${catOpen === c.code ? " dark" : ""}`} style={{ minHeight: "34px", fontSize: "12px" }}>{c.labelEn}{n > 0 && <span style={{ marginLeft: "6px", opacity: .75 }}>{n}</span>}</button>;
          })}
        </div>
        <div role="tabpanel" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))", gap: "6px 16px" }}>
          {productsByCat.find((c) => c.code === catOpen)?.items.map((p) => {
            const on = f.products.includes(p.code);
            return (
              <label key={p.code} style={{ display: "flex", alignItems: "center", gap: "9px", minHeight: "36px", fontSize: "13.5px", fontWeight: on ? 700 : 500, cursor: "pointer" }}>
                <input type="checkbox" checked={on} onChange={() => toggle("products", p.code)} style={{ width: "17px", height: "17px", accentColor: "var(--red)", flexShrink: 0 }} />
                {p.labelEn}
                {p.code === PENDING_ADD && !initial.products.includes(p.code) && <Tag kind="review">IN REVIEW</Tag>}
              </label>
            );
          })}
        </div>
      </Group>

      <div style={{ display: "grid", gridTemplateColumns: "minmax(0,1fr) minmax(0,1fr)", gap: "16px" }} className="cols">
        <Group title="Product photos" hint="Your own photos only, up to 6 per product. Each one is checked before it appears.">
          {co.productCards.map((p) => (
            <div key={p.name} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: "10px", padding: "8px 0", borderTop: "1px solid var(--line)" }}>
              <span style={{ minWidth: 0 }}><span style={{ fontSize: "13.5px", fontWeight: 800, display: "block" }}>{p.name}</span><span className="meta">{p.spec} · {p.photos} photo{p.photos === 1 ? "" : "s"}</span></span>
              <button type="button" className="btn" style={{ minHeight: "34px", fontSize: "12px" }} disabled title="Photo upload arrives with the account release">Add photos</button>
            </div>
          ))}
          <span className="meta">Uploading arrives with the account release.</span>
        </Group>

        <Group title="Company facts" tag={<Tag kind="self">SELF-REPORTED</Tag>}>
          <Field id="co-emp" label="EMPLOYEES">
            <select id="co-emp" className="inp" value={f.employees} onChange={(e) => set("employees", e.target.value)}>
              <option value="">Not stated</option>
              {EMPLOYEE_RANGE.map((r) => <option key={r.code} value={r.code}>{r.label}</option>)}
            </select>
          </Field>
          <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
            <span className="lbl">EXPORT MARKETS</span>
            <div style={{ display: "flex", gap: "6px", flexWrap: "wrap" }}>
              {REGION.map((r) => {
                const on = f.markets.includes(r.code);
                return <button key={r.code} type="button" aria-pressed={on} onClick={() => toggle("markets", r.code)} className={`btn${on ? " dark" : ""}`} style={{ minHeight: "32px", fontSize: "12px", padding: "0 12px" }}>{r.labelEn}</button>;
              })}
            </div>
          </div>
        </Group>
      </div>

      <Group title="Certifications" tag={<Tag kind="lock">LOCKED AFTER SUBMISSION</Tag>} hint="Shown only after we have checked a copy of the certificate, and removed automatically on expiry. To change one already submitted, write to the directory editor.">
        {co.certifications.map((c) => (
          <div key={c.type} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: "10px", padding: "8px 0", borderTop: "1px solid var(--line)", color: "var(--slate)" }}>
            <span style={{ display: "flex", alignItems: "center", gap: "8px", minWidth: 0, fontSize: "13.5px", fontWeight: 700 }}><Lock />{CERTIFICATION_TYPE_BY_CODE[c.type]?.label ?? c.type}{c.issuer ? ` · ${c.issuer}` : ""}{c.expires ? ` · expires ${c.expires}` : ""}</span>
            {c.verified ? <Tag kind="ver">VERIFIED</Tag> : <Tag kind="review">AWAITING CERTIFICATE COPY</Tag>}
          </div>
        ))}
        <div style={{ borderTop: "1px solid var(--line)", paddingTop: "12px", display: "grid", gridTemplateColumns: "1.3fr 1fr 1fr .8fr", gap: "10px" }} className="g4f">
          <Field id="ce-t" label="ADD · TYPE">
            <select id="ce-t" className="inp" value={newCert.type} onChange={(e) => setNewCert({ ...newCert, type: e.target.value })}>
              <option value="">Choose…</option>
              {CERTIFICATION_TYPE.filter((t) => !co.certifications.some((c) => c.type === t.code)).map((t) => <option key={t.code} value={t.code}>{t.label}</option>)}
            </select>
          </Field>
          <Field id="ce-i" label="ISSUER">
            <select id="ce-i" className="inp" value={newCert.issuer} onChange={(e) => setNewCert({ ...newCert, issuer: e.target.value })} disabled={!newCert.type}>
              <option value="">Choose…</option>
              {CERTIFICATION_ISSUER.map((i) => <option key={i.code} value={i.code}>{i.name}</option>)}
            </select>
          </Field>
          <Field id="ce-n" label="CERTIFICATE NO."><input id="ce-n" className="inp" value={newCert.no} disabled={!newCert.type} onChange={(e) => setNewCert({ ...newCert, no: e.target.value })} /></Field>
          <Field id="ce-e" label="EXPIRES"><input id="ce-e" type="date" className="inp" value={newCert.expires} disabled={!newCert.type} onChange={(e) => setNewCert({ ...newCert, expires: e.target.value })} /></Field>
        </div>
        {newCert.type && <span className="meta">A copy of the certificate (PDF) is required before it is shown; upload arrives with the account release. {CERTIFICATION_TYPE_BY_CODE[newCert.type]?.kind === "test_report" ? "Note: a test report is listed as a test report, not as a certification." : ""}</span>}
      </Group>

      <Group title="Kept by the editors" tag={<Tag kind="lock">NOT EDITABLE</Tag>} hint="Decided by the directory editor from public sources and our own reporting. To dispute one, write to the directory editor.">
        <div>
          <Locked label="COMPANY TYPE" value={ORGANISATION_TYPE_BY_CODE[co.orgType]?.labelEn ?? co.orgType} note="Set when the company is listed." />
          <Locked label="CATEGORIES" value={co.categories.map((c) => CATEGORY_BY_CODE[c]?.labelEn ?? c).join(" · ")} note="Directory sections the profile is filed under." />
          <Locked label="APPLICATION AREAS" value={co.applications.map((a) => APPLICATION_AREA_BY_CODE[a]?.labelEn ?? a).join(" · ") || "—"} note="Judged from projects we have covered, up to two." />
          <Locked label="COUNTRY" value={country} note="Verified with the claim." />
          <Locked label="RELATED COVERAGE" value={related.length ? related.map((r, i) => <span key={r.href}>{i > 0 && " · "}<Link href={r.href} style={{ color: "var(--red-text)" }}>{r.title}</Link></span>) : "None yet"} note="Linked automatically from our articles." />
          <Locked label="EDITORIAL NOTES" value="None" note="Relationship labels and editor's notes are written by the newsroom." />
        </div>
      </Group>

      <div style={{ display: "flex", alignItems: "center", gap: "10px", flexWrap: "wrap", borderTop: "2px solid var(--ink)", paddingTop: "14px" }}>
        <button type="button" className="btn dark" disabled={changed.length === 0} onClick={() => setMode("sent")} style={changed.length === 0 ? { opacity: .45, cursor: "not-allowed" } : undefined}>Submit for review</button>
        <button type="button" className="btn" onClick={() => { setF(initial); setNewCert({ type: "", issuer: "", no: "", expires: "" }); setMode("view"); }}>Cancel</button>
        <span className="meta">{changed.length ? <>Changed: <b style={{ color: "var(--ink)" }}>{changed.join(", ")}</b></> : "No changes yet."}</span>
      </div>
    </div>
  );
}

function History() {
  const m = { review: ["IN REVIEW", "var(--st-review-bg)", "var(--st-review-fg)"], approved: ["APPROVED", "var(--st-current-bg)", "var(--up)"], declined: ["NOT ACCEPTED", "var(--line)", "var(--slate)"] } as const;
  return (
    <ol id="co-history" style={{ listStyle: "none", margin: 0, padding: 0, borderTop: "1px solid var(--line)" }}>
      {HISTORY.map((h, i) => (
        <li key={i} style={{ display: "grid", gridTemplateColumns: "104px minmax(0,1fr)", gap: "4px 14px", padding: "12px 0", borderBottom: "1px solid var(--line)" }} className="lockrow">
          <span className="meta" style={{ fontWeight: 700 }}>{h.date}</span>
          <span style={{ display: "flex", flexDirection: "column", gap: "4px", minWidth: 0 }}>
            <span style={{ display: "flex", alignItems: "center", gap: "8px", flexWrap: "wrap" }}><span style={{ background: m[h.status][1], color: m[h.status][2] }} className="st">{m[h.status][0]}</span><b style={{ fontSize: "13.5px" }}>{h.field}</b></span>
            <span style={{ fontSize: "13.5px", fontWeight: 500 }}>{h.change}</span>
            {h.note && <span className="meta">{h.note}</span>}
          </span>
        </li>
      ))}
    </ol>
  );
}

