"use client";

/* Account-G "My company" panel. Phase 1 has no backend: the editor shows every field a
   claimed company can maintain, which fields stay with the editors, and what a submitted
   change looks like. Nothing is saved — the confirmation says so. Field rules follow the
   Directory Policy: description, product range, photos and contact details are editable and
   reviewed before they go live; company type, related coverage and editorial notes stay
   with the editors; certification details lock once submitted. */
import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import { PRODUCT, PRODUCT_BY_CODE } from "@/data/vocab/product";
import { CATEGORY, CATEGORY_BY_CODE } from "@/data/vocab/category";
import { REGION } from "@/data/vocab/region";
import { EMPLOYEE_RANGE } from "@/data/vocab/employee_range";
import { CERTIFICATION_TYPE, CERTIFICATION_TYPE_BY_CODE } from "@/data/vocab/certification_type";
import { CERTIFICATION_ISSUER } from "@/data/vocab/certification_issuer";
import { ORGANISATION_TYPE, ORGANISATION_TYPE_BY_CODE } from "@/data/vocab/organisation_type";
import { APPLICATION_AREA, APPLICATION_AREA_BY_CODE } from "@/data/vocab/application_area";
import { COUNTRY, COUNTRY_BY_CODE } from "@/data/vocab/country";
import { demoBg } from "@/lib/demo";
import type { Company } from "@/lib/content/types";
import type { SubOpt } from "@/lib/vocab-geo";
import { useDemo, today } from "./store";
import { CodeVerify } from "@/components/ui/CodeVerify";

const FREE_MAIL = ["gmail.com", "googlemail.com", "outlook.com", "hotmail.com", "live.com", "yahoo.com", "icloud.com", "me.com", "aol.com", "proton.me", "protonmail.com", "qq.com", "163.com", "126.com", "sina.com", "foxmail.com", "yandex.ru", "mail.ru", "gmx.com"];

type Related = { title: string; href: string };
type Mode = "view" | "edit" | "sent";

const SUMMARY_MAX = 400;
const MAX_PHOTOS = 6;
/* Calling codes from the country vocabulary, sorted by country name; the option shows the ISO code so +1 / +44 etc. stay distinguishable. */
const DIAL_ALL = COUNTRY.slice().sort((a, b) => a.name.localeCompare(b.name));
const DIAL = COUNTRY.filter((c) => c.dialCode).slice().sort((a, b) => a.name.localeCompare(b.name));
/* The pending edit shown in review: one product added to the range. */
const PENDING_ADD = "razor_wire";

const LogoMark = ({ src, name, size = 46 }: { src: string | null; name: string; size?: number }) => (
  <span style={{ width: size, height: size, borderRadius: size > 60 ? "16px" : "11px", background: src ? "var(--card)" : "var(--ink)", border: src ? "1px solid var(--line)" : undefined, color: "var(--on-ink)", flexShrink: 0, display: "inline-flex", alignItems: "center", justifyContent: "center", fontSize: size > 60 ? "26px" : "15px", fontWeight: 800, overflow: "hidden" }}>
    {/* eslint-disable-next-line @next/next/no-img-element */}
    {src ? <img src={src} alt="Company logo" style={{ width: "100%", height: "100%", objectFit: "contain" }} /> : name.split(/\s+/).map((w) => w[0]).slice(0, 2).join("").toUpperCase()}
  </span>
);
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
type Req = { id: string; field: string; from: string; to: string; reason: string; file?: string; date: string };
type ReqKind = "orgType" | "categories" | "applications" | "coverage" | "notes" | "cert";

/* A field the editors keep. It was set when the profile was listed or claimed; after that the
   company asks for a change instead of editing it, and the editor decides. */
function Locked({ label, value, note, kind, current, pending, onRequest, onWithdraw }: { label: string; value: React.ReactNode; note: string; kind: ReqKind; current: string[]; pending?: Req; onRequest: (r: Omit<Req, "id" | "date">) => void; onWithdraw: () => void }) {
  const [open, setOpen] = useState(false);
  const [pick, setPick] = useState<string[]>(current);
  const [text, setText] = useState("");
  const [reason, setReason] = useState("");
  const [file, setFile] = useState<string>("");
  const opts = kind === "orgType" ? ORGANISATION_TYPE.map((o) => ({ code: o.code, label: o.labelEn })) : kind === "categories" ? CATEGORY.map((o) => ({ code: o.code, label: o.labelEn })) : kind === "applications" ? APPLICATION_AREA.map((o) => ({ code: o.code, label: o.labelEn })) : [];
  const max = kind === "applications" ? 2 : kind === "orgType" ? 1 : 99;
  const lbl = (codes: string[]) => codes.map((c) => opts.find((o) => o.code === c)?.label ?? c).join(" · ");
  const valueChanged = opts.length ? (pick.length > 0 && (pick.length !== current.length || pick.some((x) => !current.includes(x)))) : text.trim().length >= 10;
  const ok = valueChanged && reason.trim().length >= 10;
  return (
    <div style={{ padding: "10px 0", borderTop: "1px solid var(--line)" }}>
      <div style={{ display: "grid", gridTemplateColumns: "150px minmax(0,1fr) auto", gap: "4px 14px", alignItems: "start" }} className="lockrow">
        <span className="lbl" style={{ color: "var(--slate)", display: "flex", alignItems: "center", gap: "6px", paddingTop: "2px" }}><Lock />{label}</span>
        <span style={{ fontSize: "13.5px", fontWeight: 700, minWidth: 0 }}>{value}<span className="meta" style={{ display: "block", fontWeight: 500, marginTop: "2px" }}>{note}</span>
          {pending && <span style={{ display: "flex", gap: "8px", alignItems: "center", flexWrap: "wrap", marginTop: "6px" }}><Tag kind="review">CHANGE REQUESTED · IN REVIEW</Tag><span className="meta">→ {pending.to} · sent {pending.date}</span></span>}
        </span>
        {pending
          ? <button type="button" className="btn" style={{ minHeight: "32px", fontSize: "12px" }} onClick={onWithdraw}>Withdraw request</button>
          : <button type="button" className={`btn${open ? " dark" : ""}`} style={{ minHeight: "32px", fontSize: "12px" }} aria-expanded={open} onClick={() => setOpen((v) => !v)}>{open ? "Close" : "Request a change"}</button>}
      </div>
      {open && !pending && (
        <div className="compose" style={{ marginTop: "10px" }}>
          <span className="meta" style={{ fontWeight: 700 }}>The directory editor checks the request against your evidence and replies by email, usually within five working days. The current value stays until then.</span>
          {opts.length > 0 ? (
            <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
              <span className="lbl">PROPOSED {label}{max === 2 ? " · UP TO 2" : ""}</span>
              {kind === "orgType" ? (
                <select className="inp" value={pick[0] ?? ""} onChange={(e) => setPick([e.target.value])} aria-label={`Proposed ${label.toLowerCase()}`}>{opts.map((o) => <option key={o.code} value={o.code}>{o.label}</option>)}</select>
              ) : (
                <div style={{ display: "flex", gap: "6px", flexWrap: "wrap" }}>
                  {opts.map((o) => { const on = pick.includes(o.code); const full = !on && pick.length >= max; return <button key={o.code} type="button" aria-pressed={on} disabled={full} onClick={() => setPick(on ? pick.filter((x) => x !== o.code) : [...pick, o.code])} className={`btn${on ? " dark" : ""}`} style={{ minHeight: "32px", fontSize: "12px", padding: "0 12px" }}>{o.label}</button>; })}
                </div>
              )}
            </div>
          ) : (
            <Field id={`rq-t-${kind}`} label={kind === "coverage" ? "WHICH ARTICLE IS MISSING OR WRONGLY LINKED?" : kind === "cert" ? "WHAT SHOULD CHANGE ON THIS CERTIFICATE?" : "WHAT SHOULD THE EDITORS LOOK AT?"}>
              <textarea id={`rq-t-${kind}`} rows={2} className="inp" value={text} onChange={(e) => setText(e.target.value)} placeholder={kind === "coverage" ? "Article title or link, and what is wrong" : kind === "cert" ? "e.g. renewed on 1 Oct 2026, new number and expiry date" : "e.g. the relationship note is out of date"} />
            </Field>
          )}
          <Field id={`rq-r-${kind}`} label="REASON *" aside={<span className="meta">{reason.trim().length < 10 ? "at least 10 characters" : ""}</span>}><textarea id={`rq-r-${kind}`} rows={2} className="inp" value={reason} onChange={(e) => setReason(e.target.value)} placeholder="Why the current value is wrong, and where the editor can check" /></Field>
          <div style={{ display: "flex", gap: "8px", alignItems: "center", flexWrap: "wrap" }}>
            <label className="btn" style={{ position: "relative", minHeight: "34px", fontSize: "12px", cursor: "pointer" }}>{file ? "Replace document" : "Attach evidence (PDF / image)"}<input type="file" accept="application/pdf,image/*" onChange={(e) => { setFile(e.target.files?.[0]?.name ?? ""); e.target.value = ""; }} style={{ position: "absolute", inset: 0, opacity: 0, cursor: "pointer" }} /></label>
            {file && <span className="meta">{file}</span>}
          </div>
          <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
            <button type="button" className="btn dark" disabled={!ok} onClick={() => { onRequest({ field: label.charAt(0) + label.slice(1).toLowerCase(), from: typeof value === "string" ? value : current.join(" · ") || "—", to: opts.length ? lbl(pick) : text.trim(), reason: reason.trim(), file: file || undefined }); setOpen(false); setText(""); setReason(""); setFile(""); }}>Send request</button>
            <button type="button" className="btn" onClick={() => { setOpen(false); setPick(current); }}>Cancel</button>
          </div>
        </div>
      )}
    </div>
  );
}

const HISTORY: { date: string; field: string; change: string; status: "review" | "approved" | "declined"; note?: string }[] = [
  { date: "11 Oct 2026", field: "Product range", change: `Added “${PRODUCT_BY_CODE[PENDING_ADD]?.labelEn}”`, status: "review", note: "With the directory editor. The public page keeps the previous range until this is approved." },
  { date: "3 Oct 2026", field: "Description", change: "Rewrote the summary; removed “leading supplier” wording", status: "approved", note: "Approved 4 Oct · live" },
  { date: "1 Oct 2026", field: "Description", change: "“The leading 358 mesh supplier in northern China”", status: "declined", note: "Not accepted: an unsourced market-position claim. Directory Policy — what we will not publish." },
  { date: "30 Sep 2026", field: "Claim", change: "Profile claimed with a company-domain email", status: "approved", note: "Verified by the directory editor" },
];

export function CompanyPanel({ co, related, subs0 }: { co: Company; related: Related[]; subs0: SubOpt[] }) {
  const [mode, setMode] = useState<Mode>("view");
  const { d, set: setDemo, toast } = useDemo();
  const reqs: Record<string, Req> = d.companyReqs ?? {};
  const request = (key: string) => (r: Omit<Req, "id" | "date">) => { setDemo((x) => ({ ...x, companyReqs: { ...(x.companyReqs ?? {}), [key]: { ...r, id: key, date: today() } } })); toast("Request sent to the directory editor. You will get an email with the decision."); };
  const withdraw = (key: string) => () => { setDemo((x) => { const y = { ...(x.companyReqs ?? {}) }; delete y[key]; return { ...x, companyReqs: y }; }); toast("Request withdrawn."); };
  const [showHistory, setShowHistory] = useState(false);

  const initial = useMemo(() => ({
    name: co.name,
    legalName: co.legalName ?? "",
    summary: co.summary,
    products: co.products,
    website: co.website ?? "",
    email: co.website ? `sales@${co.website.replace(/^https?:\/\/(www\.)?/, "").split("/")[0]}` : "",
    dial: co.country,
    phone: "",
    country: co.country,
    subdivision: co.subdivision ?? "",
    city: co.city,
    street: "",
    postcode: "",
    showStreet: false,
    employees: co.employees ?? "",
    markets: co.exportMarkets ?? [],
  }), [co]);
  const [f, setF] = useState(initial);
  /* The enquiry email receives "Contact this company" messages, so it must be proven: a code goes to it, and it must be at the company's own domain. */
  const [verifiedEmail, setVerifiedEmail] = useState(initial.email);
  const [verifying, setVerifying] = useState(false);
  /* Compare against the website being entered, not only the one on file. */
  const siteDomain = (f.website || co.website || "").replace(/^https?:\/\/(www\.)?/, "").split(/[/?#]/)[0].toLowerCase();
  const mailDomain = f.email.split("@")[1]?.toLowerCase() ?? "";
  const mailValid = /^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(f.email);
  const mailFree = FREE_MAIL.includes(mailDomain);
  const mailOffDomain = !!siteDomain && mailValid && !mailFree && mailDomain !== siteDomain && !mailDomain.endsWith(`.${siteDomain}`);
  const mailVerified = mailValid && f.email.toLowerCase() === verifiedEmail.toLowerCase();
  const initialCards = useMemo<Card[]>(() => co.productCards.map((p, i) => ({ id: `c${i}`, product: p.product ?? "", name: p.name, spec: p.spec, live: p.photos, added: [], existing: true })), [co]);
  const [cards, setCards] = useState<Card[]>(initialCards);
  const [newCert, setNewCert] = useState({ type: "", issuer: "", no: "", expires: "" });
  const [subs, setSubs] = useState<{ country: string; list: SubOpt[] | null }>({ country: co.country, list: subs0 });
  const subsFor = useRef<string>(co.country);
  useEffect(() => {
    if (subsFor.current === f.country) return;
    subsFor.current = f.country;
    const want = f.country;
    setSubs({ country: want, list: null });
    fetch(`/api/vocab/subdivisions/${want}/`).then((r) => (r.ok ? r.json() : [])).then((list: SubOpt[]) => { if (subsFor.current === want) setSubs({ country: want, list }); }).catch(() => { if (subsFor.current === want) setSubs({ country: want, list: [] }); });
  }, [f.country]);
  const setCountry = (c: string) => setF((x) => ({ ...x, country: c, subdivision: "", dial: x.dial === x.country ? c : x.dial }));
  const [catOpen, setCatOpen] = useState<string>(co.categories[0] ?? "fencing");
  const set = <K extends keyof typeof f>(k: K, v: (typeof f)[K]) => setF((x) => ({ ...x, [k]: v }));
  const toggle = (k: "products" | "markets", code: string) => set(k, f[k].includes(code) ? f[k].filter((c) => c !== code) : [...f[k], code]);

  const [logo, setLogo] = useState<string | null>(null);
  const [logoErr, setLogoErr] = useState<string | null>(null);
  const onLogo = (file?: File) => {
    if (!file) return;
    if (!/^image\/(png|jpeg|webp|svg\+xml)$/.test(file.type) || file.size > 2 * 1024 * 1024) { setLogoErr("PNG, JPG, WebP or SVG, up to 2 MB."); return; }
    setLogoErr(null);
    if (logo) URL.revokeObjectURL(logo);
    setLogo(URL.createObjectURL(file));
  };
  const changed = [
    (f.name !== initial.name || f.legalName !== initial.legalName) && "Company name",
    logo && "Logo",
    f.summary !== initial.summary && "Description",
    (f.products.length !== initial.products.length || f.products.some((p) => !initial.products.includes(p))) && "Product range",
    (f.website !== initial.website || f.email !== initial.email || f.phone !== initial.phone || f.dial !== initial.dial) && "Contact details",
    (f.country !== initial.country || f.subdivision !== initial.subdivision || f.city !== initial.city || f.street !== initial.street || f.postcode !== initial.postcode || f.showStreet !== initial.showStreet) && "Registered address",
    (f.employees !== initial.employees || f.markets.length !== initial.markets.length || f.markets.some((m) => !initial.markets.includes(m))) && "Company facts",
    (cards.length !== initialCards.length || cards.some((c, i) => { const o = initialCards[i]; return !o || c.added.length > 0 || c.live !== o.live || c.name !== o.name || c.spec !== o.spec || c.product !== o.product; })) && "Products & photos",
    newCert.type && "New certificate",
  ].filter(Boolean) as string[];
  /* A new certificate needs every field, and an expiry date in the future. */
  const todayStr = new Date().toISOString().slice(0, 10);
  const certProblem = newCert.type ? (!newCert.issuer || !newCert.no.trim() || !newCert.expires ? "Complete the issuer, number and expiry date of the new certificate (or clear its type)." : newCert.expires <= todayStr ? "The new certificate has already expired." : null) : null;
  const webBad = !!f.website && !/^https?:\/\/[^\s/]+\.[^\s]{2,}/.test(f.website);
  const phoneBad = !!f.phone && !/^[\d\s()+-]{5,20}$/.test(f.phone);
  /* Closing or reloading the tab with unsent edits asks first. */
  const editingNow = mode === "edit" && changed.length > 0;
  useEffect(() => {
    if (!editingNow) return;
    const warn = (e: BeforeUnloadEvent) => { e.preventDefault(); e.returnValue = ""; };
    window.addEventListener("beforeunload", warn);
    return () => window.removeEventListener("beforeunload", warn);
  }, [editingNow]);

  const country = COUNTRY_BY_CODE[co.country]?.name ?? co.country;

  /* ---------- compact view ---------- */
  const head = (
    <div className="minihd"><span style={{ fontSize: "17px" }} className="h">Profile status</span><span style={{ background: "var(--st-current-bg)", color: "var(--up)" }} className="st">CLAIMED</span></div>
  );
  const summaryBlock = (
    <div style={{ display: "flex", gap: "13px", alignItems: "flex-start" }}>
      <LogoMark src={logo} name={f.name || co.name} />
      <div style={{ minWidth: 0 }}><div style={{ fontSize: "15px", fontWeight: 800 }}>{f.name || co.name}</div><div className="meta">{ORGANISATION_TYPE_BY_CODE[co.orgType]?.labelEn ?? co.orgType} · {co.city}, {country}</div><Link href={`/directory/${co.slug}/`} style={{ fontSize: "12px", fontWeight: 800, color: "var(--red-text)" }}>View public profile &#8594;</Link></div>
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
          <button type="button" className="btn" onClick={() => { setF(initial); setVerifiedEmail(initial.email); setVerifying(false); setLogo(null); setCards(initialCards); setNewCert({ type: "", issuer: "", no: "", expires: "" }); setMode("view"); }}>Done</button>
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
              <div style={{ display: "flex", justifyContent: "space-between", gap: "12px" }}><span style={{ color: "var(--slate)" }}>Edits and requests in review</span><b style={{ color: "var(--st-review-fg)" }}>{1 + Object.keys(reqs).length}</b></div>
            </div>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
            <div className="note">Your change to <b>Product range</b> (adding “{PRODUCT_BY_CODE[PENDING_ADD]?.labelEn}”) is in review. The public page keeps the previous content until it is approved.</div>
            <div style={{ fontSize: "13px", fontWeight: 500, lineHeight: 1.6 }}>
              <div style={{ fontSize: "11px", fontWeight: 800, letterSpacing: ".1em", color: "var(--slate)", marginBottom: "4px" }}>YOU CAN EDIT</div>
              Name and logo · Description · Product range · Product cards and photos · Contact details · Registered address (a country change is re-verified) · Employees and export markets (shown as self-reported) · New certificates
              <div style={{ fontSize: "11px", fontWeight: 800, letterSpacing: ".1em", color: "var(--slate)", margin: "10px 0 4px" }}>KEPT BY THE EDITORS</div>
              Company type · Directory categories · Application areas · Related coverage · Editorial notes · Certificates already submitted. Set at listing or claim; change them with “Request a change” in the editor.
            </div>
          </div>
        </div>
        <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
          <button type="button" className="btn dark" onClick={() => setMode("edit")}>Edit company profile</button>
          <button type="button" className="btn" aria-expanded={showHistory} aria-controls="co-history" onClick={() => setShowHistory((v) => !v)}>{showHistory ? "Hide change history" : "Change history"}</button>
        </div>
        {showHistory && <History extra={Object.values(reqs)} />}
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

      <Group title="Name & logo" tag={<Tag kind="review">NAME CHANGES ARE RE-VERIFIED</Tag>} hint="The display name is what readers see. The legal name must match your registration documents; changing either is checked by the directory editor before it goes live.">
        <div style={{ display: "grid", gridTemplateColumns: "auto minmax(0,1fr)", gap: "16px", alignItems: "start" }} className="identity">
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "8px" }}>
            <LogoMark src={logo} name={f.name || co.name} size={88} />
            <label className="btn" style={{ position: "relative", minHeight: "32px", fontSize: "12px", cursor: "pointer" }}>{logo ? "Replace logo" : "Upload logo"}<input type="file" accept="image/png,image/jpeg,image/webp,image/svg+xml" onChange={(e) => { onLogo(e.target.files?.[0]); e.target.value = ""; }} style={{ position: "absolute", inset: 0, opacity: 0, cursor: "pointer" }} /></label>
            {logo && <button type="button" className="btn" style={{ minHeight: "28px", fontSize: "11.5px" }} onClick={() => { URL.revokeObjectURL(logo); setLogo(null); }}>Remove</button>}
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: "10px", minWidth: 0 }}>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px" }} className="g2f">
              <Field id="co-nm" label="DISPLAY NAME"><input id="co-nm" className="inp" value={f.name} maxLength={80} onChange={(e) => set("name", e.target.value)} /></Field>
              <Field id="co-ln" label="LEGAL NAME"><input id="co-ln" className="inp" value={f.legalName} maxLength={140} placeholder="As on the business licence" onChange={(e) => set("legalName", e.target.value)} /></Field>
            </div>
            <span className="meta">Logo: square, at least 400 × 400 px, PNG / JPG / WebP / SVG up to 2 MB. Shown on your profile and directory card; not used in articles.</span>
            {logoErr && <span role="alert" className="meta" style={{ color: "var(--red-text)" }}>{logoErr}</span>}
            {(f.name !== initial.name || f.legalName !== initial.legalName) && <div className="note">A name change needs a registration document (business licence or certificate of incorporation) showing the new name. The public profile keeps <b>{initial.name}</b> until it is confirmed; by-lines on published articles do not change.</div>}
          </div>
        </div>
      </Group>

      <div style={{ display: "grid", gridTemplateColumns: "minmax(0,1fr) minmax(0,1fr)", gap: "16px" }} className="cols">
        <Group title="Description" tag={<Tag kind="self">SELF-REPORTED</Tag>} hint="Plain facts about what you make and for whom. Not published: capacity, market share or performance figures without a third-party source, claims about competitors, promotional copy.">
          <Field id="co-sum" label="SUMMARY" aside={<span className="meta" style={{ color: f.summary.length > SUMMARY_MAX ? "var(--red-text)" : undefined }}>{f.summary.length} / {SUMMARY_MAX}</span>}>
            <textarea id="co-sum" rows={5} className="inp" value={f.summary} maxLength={SUMMARY_MAX} onChange={(e) => set("summary", e.target.value)} />
          </Field>
        </Group>

        <Group title="Contact details" hint="Enquiries from “Contact this company” go to the enquiry email only; it is never shown on the page. The enquiry email must be verified and at your own domain; without it the contact button is hidden.">
          <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: "10px" }}>
            <Field id="co-web" label="WEBSITE"><input id="co-web" type="url" className="inp" value={f.website} placeholder="https://" onChange={(e) => set("website", e.target.value)} /></Field>
            <div style={{ gridColumn: "1 / -1" }}><Field id="co-mail" label="ENQUIRY EMAIL" aside={f.email ? (mailVerified ? <Tag kind="ver">VERIFIED</Tag> : <Tag kind="review">NOT VERIFIED</Tag>) : undefined}>
              <div style={{ display: "flex", gap: "6px" }}>
                <input id="co-mail" type="email" className="inp" value={f.email} placeholder={siteDomain ? `sales@${siteDomain}` : "sales@yourcompany.com"} onChange={(e) => { set("email", e.target.value.trim()); setVerifying(false); }} style={{ minWidth: 0 }} />
                {!mailVerified && mailValid && !mailFree && !verifying && <button type="button" className="btn dark" style={{ flexShrink: 0 }} onClick={() => setVerifying(true)}>Send code</button>}
              </div>
            </Field>
            {mailFree && <span className="meta" style={{ color: "var(--red-text)", display: "block", marginTop: "5px" }}>Free mailboxes ({mailDomain}) are not accepted for a company. Use an address at your company&apos;s own domain{siteDomain ? ` (${siteDomain})` : ""}.</span>}
            {mailOffDomain && <span className="meta" style={{ display: "block", marginTop: "5px" }}>This is not at {siteDomain}, the domain of your website. The editor will ask how the two are related before it goes live.</span>}
            {verifying && !mailVerified && <div className="compose" style={{ marginTop: "8px" }}><CodeVerify compact email={f.email} purpose="that this inbox belongs to the company" onVerified={() => { setVerifiedEmail(f.email); setVerifying(false); toast("Enquiry email verified."); }} /></div>}
            {f.email && !mailVerified && !verifying && !mailFree && <span className="meta" style={{ display: "block", marginTop: "5px" }}>Until this address is verified, the “Contact this company” button stays hidden on your profile.</span>}
            {!f.email && <span className="meta" style={{ display: "block", marginTop: "5px" }}>No enquiry email: the “Contact this company” button is hidden.</span>}
            </div>
            <div style={{ gridColumn: "1 / -1" }}><Field id="co-tel" label="PHONE">
              <div style={{ display: "flex", gap: "6px" }}>
                <select aria-label="Country calling code" className="inp" value={f.dial} onChange={(e) => set("dial", e.target.value)} style={{ flex: "0 0 112px", padding: "0 8px" }}>
                  {DIAL.map((c) => <option key={c.alpha2} value={c.alpha2}>{c.alpha2} {c.dialCode}</option>)}
                </select>
                <input id="co-tel" type="tel" inputMode="tel" className="inp" value={f.phone} placeholder="Number" onChange={(e) => set("phone", e.target.value.replace(/[^\d\s-]/g, ""))} style={{ minWidth: 0 }} />
              </div>
            </Field></div>
          </div>
        </Group>
      </div>

      <Group title="Registered address" tag={<Tag kind="review">COUNTRY CHANGES ARE RE-VERIFIED</Tag>} hint="Where the company is registered. Country and state / province are drop-downs from the ISO 3166 lists; city is free text. Street and postal code are used for verification and stay private unless you choose to show them.">
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "10px" }} className="g4f">
          <Field id="co-ctry" label="COUNTRY / TERRITORY">
            <select id="co-ctry" className="inp" value={f.country} onChange={(e) => setCountry(e.target.value)}>
              {DIAL_ALL.map((c) => <option key={c.alpha2} value={c.alpha2}>{c.name}</option>)}
            </select>
          </Field>
          <Field id="co-sub" label={`${subs.list?.[0]?.type ? subs.list[0].type.toUpperCase() : "STATE / PROVINCE"}${COUNTRY_BY_CODE[f.country]?.subdivisionRequired === "yes" ? " *" : ""}`}>
            <select id="co-sub" className="inp" value={f.subdivision} disabled={!subs.list || subs.list.length === 0} onChange={(e) => set("subdivision", e.target.value)}>
              <option value="">{subs.list === null ? "Loading…" : subs.list.length === 0 ? "Not applicable" : "Choose…"}</option>
              {subs.list?.map((s) => <option key={s.code} value={s.code}>{s.name}</option>)}
            </select>
          </Field>
          <Field id="co-city" label="CITY"><input id="co-city" type="text" className="inp" value={f.city} onChange={(e) => set("city", e.target.value)} /></Field>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: "10px" }} className="g2f">
          <Field id="co-str" label="STREET ADDRESS"><input id="co-str" type="text" className="inp" value={f.street} autoComplete="street-address" placeholder="Building, street, district" onChange={(e) => set("street", e.target.value)} /></Field>
          <Field id="co-pc" label="POSTAL CODE"><input id="co-pc" type="text" className="inp" value={f.postcode} autoComplete="postal-code" onChange={(e) => set("postcode", e.target.value)} /></Field>
        </div>
        <label style={{ display: "flex", alignItems: "center", gap: "9px", fontSize: "13.5px", fontWeight: 500, cursor: "pointer" }}><input type="checkbox" checked={f.showStreet} onChange={(e) => set("showStreet", e.target.checked)} style={{ width: "17px", height: "17px", accentColor: "var(--red)" }} /> Show the street address on the public profile</label>
        {f.country !== initial.country && <div className="note">Changing the country sends the claim back to the directory editor for verification. The public profile keeps <b>{COUNTRY_BY_CODE[initial.country]?.name}</b> until it is confirmed.</div>}
      </Group>

      <Group title="Product range" tag={<Tag kind="self">SELF-REPORTED</Tag>} hint={`Tick what you actually supply (${f.products.length} selected). Ticked products show as tags on your profile and in directory filters; to show one with photos and a specification, give it a product card below.`}>
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

      <ProductCards ranged={f.products} cards={cards} setCards={setCards} />

      <div>
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
        <div style={{ marginTop: "-4px" }}><Locked kind="cert" current={[]} pending={reqs.cert} onRequest={request("cert")} onWithdraw={withdraw("cert")} label="SUBMITTED CERTIFICATES" value="Renewed, re-numbered or withdrawn?" note="Submitted certificates are locked; ask the editor to update one." /></div>
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
          <Field id="ce-e" label="EXPIRES"><input id="ce-e" type="date" className="inp" min={new Date().toISOString().slice(0, 10)} value={newCert.expires} disabled={!newCert.type} onChange={(e) => setNewCert({ ...newCert, expires: e.target.value })} /></Field>
        </div>
        {newCert.type && <span className="meta">A copy of the certificate (PDF) is required before it is shown; upload arrives with the account release. {CERTIFICATION_TYPE_BY_CODE[newCert.type]?.kind === "test_report" ? "Note: a test report is listed as a test report, not as a certification." : ""}</span>}
      </Group>

      <Group title="Kept by the editors" tag={<Tag kind="lock">CHANGE BY REQUEST</Tag>} hint="Set when the profile was listed and confirmed when you claimed it. After that they are not edited directly: use “Request a change”, add your reason and evidence, and the directory editor decides.">
        <div>
          <Locked kind="orgType" current={[co.orgType]} pending={reqs.orgType} onRequest={request("orgType")} onWithdraw={withdraw("orgType")} label="COMPANY TYPE" value={ORGANISATION_TYPE_BY_CODE[co.orgType]?.labelEn ?? co.orgType} note="Set when the profile was listed and confirmed at claim. Changes by request." />
          <Locked kind="categories" current={co.categories} pending={reqs.categories} onRequest={request("categories")} onWithdraw={withdraw("categories")} label="CATEGORIES" value={co.categories.map((c) => CATEGORY_BY_CODE[c]?.labelEn ?? c).join(" · ")} note="Directory sections the profile is filed under. Changes by request." />
          <Locked kind="applications" current={co.applications} pending={reqs.applications} onRequest={request("applications")} onWithdraw={withdraw("applications")} label="APPLICATION AREAS" value={co.applications.map((a) => APPLICATION_AREA_BY_CODE[a]?.labelEn ?? a).join(" · ") || "—"} note="Judged from projects we have covered, up to two." />
          <Locked kind="coverage" current={[]} pending={reqs.coverage} onRequest={request("coverage")} onWithdraw={withdraw("coverage")} label="RELATED COVERAGE" value={related.length ? related.map((r, i) => <span key={r.href}>{i > 0 && " · "}<Link href={r.href} style={{ color: "var(--red-text)" }}>{r.title}</Link></span>) : "None yet"} note="Linked automatically from our articles." />
          <Locked kind="notes" current={[]} pending={reqs.notes} onRequest={request("notes")} onWithdraw={withdraw("notes")} label="EDITORIAL NOTES" value="None" note="Relationship labels and editor's notes are written by the newsroom." />
        </div>
      </Group>

      <div style={{ display: "flex", alignItems: "center", gap: "10px", flexWrap: "wrap", borderTop: "2px solid var(--ink)", paddingTop: "14px" }}>
        <button type="button" className="btn dark" disabled={changed.length === 0 || (!!f.email && !mailVerified) || !!certProblem || webBad || phoneBad} onClick={() => setMode("sent")}>Submit for review</button>
        <button type="button" className="btn" onClick={() => { setF(initial); setVerifiedEmail(initial.email); setVerifying(false); setLogo(null); setCards(initialCards); setNewCert({ type: "", issuer: "", no: "", expires: "" }); setMode("view"); }}>Cancel</button>
        <span className="meta">{f.email && !mailVerified ? <b style={{ color: "var(--red-text)" }}>Verify the enquiry email (or clear it) before submitting.</b> : certProblem ? <b style={{ color: "var(--red-text)" }}>{certProblem}</b> : webBad ? <b style={{ color: "var(--red-text)" }}>The website must be a full address starting with https://</b> : phoneBad ? <b style={{ color: "var(--red-text)" }}>Check the phone number: digits, spaces and brackets only.</b> : changed.length ? <>Changed: <b style={{ color: "var(--ink)" }}>{changed.join(", ")}</b></> : "No changes yet."}</span>
      </div>
    </div>
  );
}

type Photo = { id: string; url: string; name: string };
type Card = { id: string; product: string; name: string; spec: string; live: number; added: Photo[]; existing: boolean };

/* Product cards: one per product line, each with up to six photos. Photos picked here are
   previewed from the device only (object URLs); in the live version they upload and wait
   for an editor's check. */
function ProductCards({ ranged, cards, setCards }: { ranged: string[]; cards: Card[]; setCards: React.Dispatch<React.SetStateAction<Card[]>> }) {
  const [err, setErr] = useState<string | null>(null);
  const urls = useRef(new Set<string>());
  useEffect(() => { const u = urls.current; return () => u.forEach((x) => URL.revokeObjectURL(x)); }, []);
  const upd = (id: string, patch: Partial<Card>) => setCards((cs) => cs.map((c) => (c.id === id ? { ...c, ...patch } : c)));
  const uncovered = ranged.filter((code) => !cards.some((c) => c.product === code));
  const add = (product = "") => setCards((cs) => [...cs, { id: `n${Date.now()}`, product, name: product ? PRODUCT_BY_CODE[product]?.labelEn ?? "" : "", spec: "", live: 0, added: [], existing: false }]);
  const pick = (c: Card, files: FileList | null) => {
    if (!files) return;
    const room = MAX_PHOTOS - c.live - c.added.length;
    const ok = Array.from(files).filter((x) => /^image\/(jpeg|png|webp)$/.test(x.type) && x.size <= 10 * 1024 * 1024);
    const rejected = files.length - ok.length;
    const take = ok.slice(0, Math.max(0, room));
    const msgs = [rejected > 0 && `${rejected} file${rejected > 1 ? "s" : ""} skipped: JPG, PNG or WebP up to 10 MB.`, ok.length > take.length && `Up to ${MAX_PHOTOS} photos per product.`].filter(Boolean);
    setErr(msgs.length ? msgs.join(" ") : null);
    const added = take.map((x, i) => { const url = URL.createObjectURL(x); urls.current.add(url); return { id: `${Date.now()}-${i}`, url, name: x.name }; });
    upd(c.id, { added: [...c.added, ...added] });
  };
  const unpick = (c: Card, ph: Photo) => { URL.revokeObjectURL(ph.url); urls.current.delete(ph.url); upd(c.id, { added: c.added.filter((x) => x.id !== ph.id) }); };
  const thumb: React.CSSProperties = { position: "relative", width: "84px", height: "64px", borderRadius: "8px", overflow: "hidden", flexShrink: 0, background: "var(--line)" };
  const pill: React.CSSProperties = { position: "absolute", left: "4px", bottom: "4px", fontSize: "8.5px", fontWeight: 800, letterSpacing: ".08em", padding: "2px 5px", borderRadius: "3px" };

  return (
    <Group title="Product cards & photos" hint={`One card per product line: product, name, short specification and up to ${MAX_PHOTOS} of your own photos. New photos are checked by an editor before they appear.`}>
      {uncovered.length > 0 && (
        <div style={{ display: "flex", alignItems: "center", gap: "6px", flexWrap: "wrap", background: "var(--paper)", borderRadius: "10px", padding: "10px 12px" }}>
          <span className="meta" style={{ fontWeight: 700 }}>In your range without a card:</span>
          {uncovered.map((code) => <button key={code} type="button" className="btn" style={{ minHeight: "30px", fontSize: "12px", padding: "0 11px" }} onClick={() => add(code)}>+ {PRODUCT_BY_CODE[code]?.labelEn ?? code}</button>)}
        </div>
      )}
      {cards.map((c) => {
        const total = c.live + c.added.length;
        const notInRange = c.product && !ranged.includes(c.product);
        return (
          <div key={c.id} style={{ border: "1px solid var(--line)", borderRadius: "12px", padding: "14px", display: "flex", flexDirection: "column", gap: "12px", background: c.existing ? undefined : "var(--paper-2)" }}>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1.4fr", gap: "10px" }} className="g4f">
              <Field id={`pc-p-${c.id}`} label="PRODUCT">
                <select id={`pc-p-${c.id}`} className="inp" value={c.product} onChange={(e) => upd(c.id, { product: e.target.value, name: c.name || PRODUCT_BY_CODE[e.target.value]?.labelEn || "" })}>
                  <option value="">Choose from your range…</option>
                  {ranged.map((code) => <option key={code} value={code}>{PRODUCT_BY_CODE[code]?.labelEn ?? code}</option>)}
                  {notInRange && <option value={c.product}>{PRODUCT_BY_CODE[c.product]?.labelEn ?? c.product} (not in range)</option>}
                </select>
              </Field>
              <Field id={`pc-n-${c.id}`} label="CARD NAME"><input id={`pc-n-${c.id}`} className="inp" value={c.name} maxLength={60} onChange={(e) => upd(c.id, { name: e.target.value })} /></Field>
              <Field id={`pc-s-${c.id}`} label="SPECIFICATION"><input id={`pc-s-${c.id}`} className="inp" value={c.spec} maxLength={90} placeholder="Wire Ø · opening · coating · size" onChange={(e) => upd(c.id, { spec: e.target.value })} /></Field>
            </div>
            {notInRange && <span className="meta" style={{ color: "var(--red-text)" }}>This product is no longer ticked in your range; tick it again or remove the card.</span>}
            <div style={{ display: "flex", gap: "8px", flexWrap: "wrap", alignItems: "center" }}>
              {Array.from({ length: c.live }, (_, i) => (
                <span key={`l${i}`} style={{ ...thumb, ...demoBg(`${c.name}-${i}`) }} title="Published photo">
                  <span style={{ ...pill, background: "var(--st-current-bg)", color: "var(--up)" }}>LIVE</span>
                  <button type="button" aria-label="Remove this published photo" onClick={() => upd(c.id, { live: c.live - 1 })} className="phx">×</button>
                </span>
              ))}
              {c.added.map((ph) => (
                <span key={ph.id} style={thumb} title={ph.name}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={ph.url} alt={ph.name} style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
                  <span style={{ ...pill, background: "var(--st-review-bg)", color: "var(--st-review-fg)" }}>TO CHECK</span>
                  <button type="button" aria-label={`Remove ${ph.name}`} onClick={() => unpick(c, ph)} className="phx">×</button>
                </span>
              ))}
              {total < MAX_PHOTOS && (
                <label style={{ ...thumb, background: "transparent", border: "1.5px dashed var(--grey-2, #B9BCC6)", display: "inline-flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: "2px", cursor: "pointer", fontSize: "11.5px", fontWeight: 800, color: "var(--slate)" }} className="phadd">
                  <span style={{ fontSize: "20px", lineHeight: 1 }}>+</span>Add photos
                  <input type="file" accept="image/jpeg,image/png,image/webp" multiple onChange={(e) => { pick(c, e.target.files); e.target.value = ""; }} style={{ position: "absolute", width: 1, height: 1, opacity: 0 }} />
                </label>
              )}
              <span className="meta">{total} / {MAX_PHOTOS}</span>
            </div>
            <div style={{ display: "flex", justifyContent: "flex-end" }}>
              <button type="button" className="btn" style={{ minHeight: "32px", fontSize: "12px", color: "var(--red-deep)" }} onClick={() => { c.added.forEach((ph) => URL.revokeObjectURL(ph.url)); setCards((cs) => cs.filter((x) => x.id !== c.id)); }}>Remove card</button>
            </div>
          </div>
        );
      })}
      {err && <span role="alert" className="meta" style={{ color: "var(--red-text)" }}>{err}</span>}
      <div style={{ display: "flex", alignItems: "center", gap: "10px", flexWrap: "wrap" }}>
        <button type="button" className="btn dark" onClick={() => add(uncovered[0] ?? "")}>+ Add a product card</button>
        <span className="meta">Photos picked here stay on this device in the preview; nothing is uploaded.</span>
      </div>
    </Group>
  );
}

function History({ extra = [] }: { extra?: Req[] }) {
  const m = { review: ["IN REVIEW", "var(--st-review-bg)", "var(--st-review-fg)"], approved: ["APPROVED", "var(--st-current-bg)", "var(--up)"], declined: ["NOT ACCEPTED", "var(--line)", "var(--slate)"] } as const;
  return (
    <ol id="co-history" style={{ listStyle: "none", margin: 0, padding: 0, borderTop: "1px solid var(--line)" }}>
      {[...extra.map((r) => ({ date: r.date, field: r.field, change: `Change requested: ${r.from} → ${r.to}`, status: "review" as const, note: `Reason: ${r.reason}${r.file ? ` · evidence: ${r.file}` : ""}` })), ...HISTORY].map((h, i) => (
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

