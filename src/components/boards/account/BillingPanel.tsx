"use client";

/* Account-G "Subscription & billing". Preview: every control works so the customer journey
   can be reviewed, nothing is charged or saved. Card numbers are never typed into this site —
   the payment processor's own page handles them (Privacy Policy: card numbers never reach
   our systems). Cancellation follows the Terms: it stops the next renewal and access runs to
   the end of the paid period; it can be undone until then. */
import Link from "next/link";
import { useState } from "react";
import { COUNTRY, COUNTRY_BY_CODE } from "@/data/vocab/country";

type Card = { id: string; brand: string; last4: string; exp: string };
type Open = null | "payment" | "details" | "cancel" | `inv-${string}`;

const COUNTRIES = COUNTRY.slice().sort((a, b) => a.name.localeCompare(b.name));
const REASONS = ["Too expensive", "I don't use it enough", "Missing a feature I need", "Switching to a company account", "Other"];
const INVOICES = [
  { no: "WMN-2026-0010", date: "1 Oct 2026", period: "1 Oct – 31 Oct 2026" },
  { no: "WMN-2026-0009", date: "1 Sep 2026", period: "1 Sep – 30 Sep 2026" },
];
const PERIOD_END = "31 Oct 2026";

const Box = ({ title, onClose, children }: { title: string; onClose: () => void; children: React.ReactNode }) => (
  <div style={{ border: "1px solid var(--ink)", borderRadius: "12px", padding: "14px 16px", display: "flex", flexDirection: "column", gap: "12px" }}>
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: "10px" }}><span style={{ fontSize: "15px" }} className="h">{title}</span><button type="button" className="btn" style={{ minHeight: "30px", fontSize: "12px", padding: "0 11px" }} onClick={onClose}>Close</button></div>
    {children}
  </div>
);
const Done = ({ children }: { children: React.ReactNode }) => (
  <div role="status" style={{ background: "var(--st-current-bg)", color: "var(--up)", borderRadius: "8px", padding: "9px 12px", fontSize: "12.5px", fontWeight: 700 }}>{children}</div>
);

export function BillingPanel() {
  const [open, setOpen] = useState<Open>(null);
  const [cards, setCards] = useState<Card[]>([{ id: "a", brand: "Visa", last4: "4242", exp: "08/28" }, { id: "b", brand: "Mastercard", last4: "5100", exp: "02/27" }]);
  const [def, setDef] = useState("a");
  const [handoff, setHandoff] = useState(false);
  const [details, setDetails] = useState({ name: "Jordan Dale", company: "Hengtai Mesh", email: "billing@hengtai.example", country: "CN", address: "", taxId: "" });
  const [savedDetails, setSavedDetails] = useState(details);
  const [detailsSaved, setDetailsSaved] = useState(false);
  const [cancelled, setCancelled] = useState(false);
  const [reason, setReason] = useState("");
  const [cycle, setCycle] = useState<"monthly" | "annual">("monthly");
  const [cycleNote, setCycleNote] = useState(false);

  const toggle = (k: Exclude<Open, null>) => { setOpen((o) => (o === k ? null : k)); setHandoff(false); setDetailsSaved(false); };
  const card = cards.find((c) => c.id === def) ?? cards[0];
  const dset = (k: keyof typeof details, v: string) => { setDetails((d) => ({ ...d, [k]: v })); setDetailsSaved(false); };

  return (
    <div className="mini" id="billing">
      <div className="minihd"><span style={{ fontSize: "17px" }} className="h">Your plan</span>
        <span style={cancelled ? { background: "var(--st-review-bg)", color: "var(--st-review-fg)" } : { background: "var(--st-current-bg)", color: "var(--up)" }} className="st">{cancelled ? "ENDS " + PERIOD_END.toUpperCase() : "ACTIVE"}</span>
      </div>

      <div style={{ background: "var(--surface-dark)", color: "#FFFFFF", borderRadius: "12px", padding: "16px 18px" }}>
        <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", gap: "12px", marginBottom: "7px" }}>
          <span style={{ fontSize: "19px", color: "#FFFFFF" }} className="h">Pro · {cycle === "monthly" ? "Monthly" : "Annual"}</span>
          <span style={{ fontSize: "15px", fontWeight: 800 }}>Price to be announced</span>
        </div>
        <div style={{ fontSize: "12.5px", fontWeight: 500, color: "var(--grey-3)", lineHeight: 1.55 }}>
          {cancelled ? <>Cancelled — no further charges. Access continues until {PERIOD_END}.</> : <>Renews {PERIOD_END} · {card ? `${card.brand} ···· ${card.last4}` : "no payment method"}</>}
        </div>
        {!cancelled && (
          <div role="group" aria-label="Billing period" style={{ display: "inline-flex", gap: "4px", marginTop: "12px", background: "rgba(255,255,255,.08)", borderRadius: "999px", padding: "3px" }}>
            {(["monthly", "annual"] as const).map((k) => (
              <button key={k} type="button" aria-pressed={cycle === k} onClick={() => { setCycle(k); setCycleNote(k !== "monthly"); }} style={{ border: 0, borderRadius: "999px", minHeight: "30px", padding: "0 14px", fontFamily: "inherit", fontSize: "12px", fontWeight: 800, cursor: "pointer", background: cycle === k ? "#FFFFFF" : "transparent", color: cycle === k ? "var(--ink)" : "#FFFFFF" }}>{k === "monthly" ? "Monthly" : "Annual"}</button>
            ))}
          </div>
        )}
      </div>
      {cycleNote && !cancelled && <Done>Switches to annual billing at the next renewal ({PERIOD_END}). The annual price is shown before you confirm in the live version.</Done>}

      <div style={{ display: "flex", flexDirection: "column", gap: "9px", fontSize: "13.5px", fontWeight: 500 }}>
        <div style={{ display: "flex", gap: "10px" }}><span style={{ color: "var(--red-text)", fontWeight: 800, flexShrink: 0 }}>&#183;</span><span>No display advertising anywhere on the site</span></div>
        <div style={{ display: "flex", gap: "10px" }}><span style={{ color: "var(--red-text)", fontWeight: 800, flexShrink: 0 }}>&#183;</span><span>Per-standard alerts and the full market-data look-back</span></div>
      </div>

      <div style={{ borderTop: "1px solid var(--line)", paddingTop: "13px" }}>
        <div style={{ fontSize: "11.5px", fontWeight: 800, letterSpacing: ".1em", color: "var(--slate)", marginBottom: "6px" }}>BILLING HISTORY</div>
        {INVOICES.map((inv, i) => {
          const k = `inv-${inv.no}` as const;
          return (
            <div key={inv.no} style={{ borderTop: i ? "1px solid var(--line)" : undefined }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: "10px", padding: "7px 0", fontSize: "13.5px" }}>
                <span style={{ fontWeight: 700 }}>{inv.date}</span><span style={{ color: "var(--slate)", fontWeight: 500 }}>Paid · —</span>
                <button type="button" aria-expanded={open === k} onClick={() => toggle(k)} style={{ border: 0, background: "none", padding: "6px 0", fontFamily: "inherit", fontSize: "12.5px", fontWeight: 800, color: "var(--red-text)", cursor: "pointer" }}>{open === k ? "Hide" : "Invoice"}</button>
              </div>
              {open === k && (
                <div style={{ background: "var(--paper)", borderRadius: "10px", padding: "14px 16px", marginBottom: "10px", fontSize: "13px", fontWeight: 500, lineHeight: 1.6 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", gap: "10px", marginBottom: "8px" }}><b className="h" style={{ fontSize: "15px" }}>Invoice {inv.no}</b><span className="meta">{inv.date}</span></div>
                  <div className="meta">Billed to</div>
                  <div style={{ marginBottom: "8px" }}>{savedDetails.company || savedDetails.name}<br />{savedDetails.address && <>{savedDetails.address}<br /></>}{COUNTRY_BY_CODE[savedDetails.country]?.name}{savedDetails.taxId && <> · Tax ID {savedDetails.taxId}</>}</div>
                  <div style={{ display: "flex", justifyContent: "space-between", gap: "10px", borderTop: "1px solid var(--line)", padding: "8px 0" }}><span>Wire Mesh News Pro · {inv.period}</span><b>—</b></div>
                  <div style={{ display: "flex", justifyContent: "space-between", gap: "10px", borderTop: "1px solid var(--line)", paddingTop: "8px" }}><span>Tax (where we are required to charge it)</span><b>—</b></div>
                  <p className="meta" style={{ margin: "8px 0 0" }}>Amounts appear once prices are announced. The issuing entity, its registered address and tax number are printed on the PDF, as in our <Link href="/policies/terms/" style={{ color: "var(--red-text)" }}>Terms</Link>.</p>
                  <button type="button" className="btn" style={{ marginTop: "10px", minHeight: "34px", fontSize: "12px" }} disabled title="PDF download arrives with the billing release">Download PDF</button>
                </div>
              )}
            </div>
          );
        })}
      </div>

      <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
        <button type="button" className={`btn${open === "payment" ? " dark" : ""}`} aria-expanded={open === "payment"} onClick={() => toggle("payment")}>Change payment method</button>
        <button type="button" className={`btn${open === "details" ? " dark" : ""}`} aria-expanded={open === "details"} onClick={() => toggle("details")}>Invoice details</button>
        {cancelled
          ? <button type="button" className="btn dark" onClick={() => { setCancelled(false); setOpen(null); }}>Resume subscription</button>
          : <button type="button" aria-expanded={open === "cancel"} onClick={() => toggle("cancel")} style={{ color: "var(--red-deep)", borderColor: "var(--st-red-bg)" }} className="btn">Cancel subscription</button>}
      </div>

      {open === "payment" && (
        <Box title="Payment methods" onClose={() => setOpen(null)}>
          {cards.map((c) => (
            <div key={c.id} style={{ display: "flex", alignItems: "center", gap: "10px", flexWrap: "wrap", padding: "8px 0", borderTop: "1px solid var(--line)" }}>
              <span style={{ width: "40px", height: "26px", borderRadius: "5px", background: "var(--ink)", color: "var(--on-ink)", fontSize: "9px", fontWeight: 800, display: "inline-flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>{c.brand.slice(0, 4).toUpperCase()}</span>
              <span style={{ fontSize: "13.5px", fontWeight: 700, flex: "1 1 auto" }}>{c.brand} ···· {c.last4}<span className="meta" style={{ display: "block" }}>Expires {c.exp}</span></span>
              {c.id === def
                ? <span style={{ background: "var(--st-current-bg)", color: "var(--up)" }} className="st">DEFAULT</span>
                : <><button type="button" className="btn" style={{ minHeight: "32px", fontSize: "12px" }} onClick={() => setDef(c.id)}>Make default</button><button type="button" className="btn" style={{ minHeight: "32px", fontSize: "12px", color: "var(--red-deep)" }} onClick={() => setCards((cs) => cs.filter((x) => x.id !== c.id))}>Remove</button></>}
            </div>
          ))}
          {!handoff
            ? <button type="button" className="btn dark" style={{ alignSelf: "flex-start" }} onClick={() => setHandoff(true)}>+ Add a card</button>
            : <div className="note">In the live version this opens our payment processor&apos;s secure page; card numbers are entered there and never reach Wire Mesh News. You come back here when it is done, and the new card appears in this list.</div>}
          <span className="meta">The default card is charged at the next renewal.</span>
        </Box>
      )}

      {open === "details" && (
        <Box title="Invoice details" onClose={() => setOpen(null)}>
          <p className="meta" style={{ margin: 0 }}>Printed on every future invoice. Past invoices keep the details they were issued with.</p>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px" }} className="g2f">
            {([["name", "NAME", "text"], ["company", "COMPANY (OPTIONAL)", "text"], ["email", "INVOICE EMAIL", "email"], ["taxId", "VAT / TAX ID (OPTIONAL)", "text"]] as const).map(([k, l, t]) => (
              <div key={k} style={{ display: "flex", flexDirection: "column", gap: "5px" }}><label htmlFor={`bd-${k}`} className="lbl">{l}</label><input id={`bd-${k}`} type={t} className="inp" value={details[k]} onChange={(e) => dset(k, e.target.value)} /></div>
            ))}
            <div style={{ display: "flex", flexDirection: "column", gap: "5px" }}><label htmlFor="bd-country" className="lbl">COUNTRY</label>
              <select id="bd-country" className="inp" value={details.country} onChange={(e) => dset("country", e.target.value)}>{COUNTRIES.map((c) => <option key={c.alpha2} value={c.alpha2}>{c.name}</option>)}</select>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: "5px" }}><label htmlFor="bd-addr" className="lbl">BILLING ADDRESS</label><input id="bd-addr" className="inp" value={details.address} autoComplete="street-address" onChange={(e) => dset("address", e.target.value)} /></div>
          </div>
          <div style={{ display: "flex", gap: "8px", alignItems: "center", flexWrap: "wrap" }}>
            <button type="button" className="btn dark" disabled={!details.name || !details.email} onClick={() => { setSavedDetails(details); setDetailsSaved(true); }}>Save details</button>
            {detailsSaved && <Done>Saved for this preview — open an invoice above to see them printed.</Done>}
          </div>
        </Box>
      )}

      {open === "cancel" && !cancelled && (
        <Box title="Cancel Pro?" onClose={() => setOpen(null)}>
          <div style={{ fontSize: "13.5px", fontWeight: 500, lineHeight: 1.6 }}>
            Cancelling stops the renewal on <b>{PERIOD_END}</b>. You keep Pro until then, and nothing more is charged. You can resume any time before that date.
            <span className="meta" style={{ display: "block", marginTop: "6px" }}>Consumers in the UK and EU can still withdraw within 14 days of a new subscription; see the <Link href="/policies/terms/" style={{ color: "var(--red-text)" }}>Terms</Link>.</span>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: "5px" }}><label htmlFor="bc-r" className="lbl">REASON (OPTIONAL)</label>
            <select id="bc-r" className="inp" value={reason} onChange={(e) => setReason(e.target.value)}><option value="">Prefer not to say</option>{REASONS.map((r) => <option key={r}>{r}</option>)}</select>
          </div>
          <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
            <button type="button" className="btn" style={{ background: "var(--red)", borderColor: "var(--red)", color: "#FFFFFF" }} onClick={() => { setCancelled(true); setOpen(null); setCycleNote(false); }}>Confirm cancellation</button>
            <button type="button" className="btn" onClick={() => setOpen(null)}>Keep Pro</button>
          </div>
        </Box>
      )}
    </div>
  );
}
