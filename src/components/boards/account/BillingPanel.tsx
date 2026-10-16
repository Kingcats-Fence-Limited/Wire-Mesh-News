"use client";

/* Account-G "Subscription & billing". Preview: every control works so the customer journey
   can be reviewed; nothing is charged, and changes live in the demo store like the rest of
   the account. Card numbers are never typed into this site —
   the payment processor's own page handles them (Privacy Policy: card numbers never reach
   our systems). Cancellation follows the Terms: it stops the next renewal and access runs to
   the end of the paid period; it can be undone until then. */
import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { PLAN, TRIAL_DAYS, usd, type Cycle, type PaidPlan, type PlanId } from "@/lib/plans";
import { COUNTRY, COUNTRY_BY_CODE } from "@/data/vocab/country";
import { useDemo, type Billing, type BillingDetails } from "./store";
type Open = null | "payment" | "details" | "cancel" | `inv-${string}`;

const COUNTRIES = COUNTRY.slice().sort((a, b) => a.name.localeCompare(b.name));
const REASONS = ["Too expensive", "I don't use it enough", "Missing a feature I need", "Switching to a company account", "Other"];
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

/* Live accounts: plan, trial, card and invoices from Stripe (through /api/billing/summary).
   Changes to the card, plan or cancellation happen in Stripe's own customer portal. */
type Summary = {
  live: boolean; plan: PlanId; pro: boolean; company: boolean; seatOf: boolean; hasCompany: boolean; trialUsed: boolean;
  meter: { used: number; limit: number };
  reports: { slug: string; title: string; date: string }[];
  sub: null | { plan: PaidPlan; cycle: Cycle; status: string; trialEnd: string | null; periodEnd: string | null; cancelAtPeriodEnd: boolean; seats: number };
  card?: { brand: string; last4: string; exp: string } | null;
  invoices?: { no: string; date: string; amount: string; status: string; url: string | null; pdf: string | null }[];
  team?: { id: string; email: string }[];
};
const longDate = (iso: string | null | undefined) => (iso ? new Intl.DateTimeFormat("en-GB", { day: "numeric", month: "long", year: "numeric" }).format(new Date(iso)) : "—");
const daysLeft = (iso: string | null) => (iso ? Math.max(0, Math.ceil((new Date(iso).getTime() - Date.now()) / 86400000)) : 0);

function BillingLive() {
  const { toast } = useDemo();
  const [s, setS] = useState<Summary | null>(null);
  const [failed, setFailed] = useState(false);
  const [busy, setBusy] = useState<string | null>(null);
  const [cycle, setCycle] = useState<Cycle>("yearly");
  const [email, setEmail] = useState("");
  const [err, setErr] = useState<string | null>(null);

  const load = useCallback(async () => {
    const r = await fetch("/api/billing/summary/", { cache: "no-store" }).catch(() => null);
    if (!r || !r.ok) { setFailed(true); return null; }
    const j = (await r.json()) as Summary;
    setS(j); setFailed(false);
    return j;
  }, []);
  useEffect(() => {
    void (async () => {
      const first = await load();
      /* Back from Stripe: the webhook may take a few seconds; check again until the plan shows. */
      const q = new URLSearchParams(location.search);
      const back = q.get("billing");
      if (!back) return;
      history.replaceState(null, "", location.pathname + location.hash);
      if (back === "report") { toast("Thank you. Your report will appear below in a moment."); }
      else toast("Thank you. Your plan is being set up.");
      let tries = 0, cur = first;
      while (tries++ < 8 && (back === "report" ? (cur?.reports.length ?? 0) === (first?.reports.length ?? 0) : !cur?.sub)) { await new Promise((res) => setTimeout(res, 2500)); cur = await load(); }
    })();
  }, [load, toast]);

  const go = async (key: string, url: string, body?: unknown) => {
    setBusy(key); setErr(null);
    const r = await fetch(url, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body ?? {}) }).catch(() => null);
    const j = (await r?.json().catch(() => ({}))) as { url?: string; error?: string } | undefined;
    if (r?.ok && j?.url) { location.assign(j.url); return; }
    setBusy(null); setErr(j?.error ?? "Something went wrong. Try again.");
  };
  const addSeat = async () => {
    setBusy("seat"); setErr(null);
    const r = await fetch("/api/billing/team/", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ email }) }).catch(() => null);
    setBusy(null);
    if (!r?.ok) { setErr(((await r?.json().catch(() => ({}))) as { error?: string } | undefined)?.error ?? "Could not add. Try again."); return; }
    setEmail(""); toast("Added. We emailed them how to sign in."); void load();
  };
  const removeSeat = async (id: string) => {
    const r = await fetch(`/api/billing/team/?id=${encodeURIComponent(id)}`, { method: "DELETE" }).catch(() => null);
    if (r?.ok) { toast("Removed from the team."); void load(); } else toast("Could not remove. Try again.");
  };

  if (failed) return <div className="mini" role="alert">Billing could not be loaded. Reload the page to try again.</div>;
  if (!s) return <div className="mini" role="status">Loading your plan…</div>;
  const sub = s.sub;
  const plan = PLAN[s.plan];
  const status = !sub ? null : sub.status === "trialing" ? { t: `FREE TRIAL · ${daysLeft(sub.trialEnd)} DAYS LEFT`, bg: "var(--st-review-bg)", fg: "var(--st-review-fg)" } : sub.status === "past_due" || sub.status === "unpaid" ? { t: "PAYMENT DUE", bg: "var(--st-red-bg)", fg: "var(--red-deep)" } : sub.cancelAtPeriodEnd ? { t: `ENDS ${longDate(sub.periodEnd).toUpperCase()}`, bg: "var(--st-review-bg)", fg: "var(--st-review-fg)" } : { t: "ACTIVE", bg: "var(--st-current-bg)", fg: "var(--up)" };

  return (
    <div className="mini" id="billing" style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
      <div className="minihd"><span style={{ fontSize: "17px" }} className="h">Your plan</span>{status ? <span style={{ background: status.bg, color: status.fg }} className="st">{status.t}</span> : <span style={{ background: "var(--line)", color: "var(--slate)" }} className="st">{s.seatOf ? "TEAM MEMBER" : "FREE"}</span>}</div>

      <div style={{ background: "var(--surface-dark)", color: "#FFFFFF", borderRadius: "12px", padding: "16px 18px", display: "flex", flexDirection: "column", gap: "6px" }}>
        <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", gap: "12px", flexWrap: "wrap" }}>
          <span style={{ fontSize: "19px", color: "#FFFFFF" }} className="h">{plan.name}{sub ? ` · ${sub.cycle === "yearly" ? "Yearly" : "Monthly"}` : ""}</span>
          {sub && plan.price && <span style={{ fontSize: "15px", fontWeight: 800 }}>{usd(sub.cycle === "yearly" ? plan.price.yearly : plan.price.monthly)} / {sub.cycle === "yearly" ? "year" : "month"}</span>}
        </div>
        <span style={{ fontSize: "12.5px", fontWeight: 500, color: "var(--grey-3)", lineHeight: 1.55 }}>
          {!sub && s.seatOf && "Your access comes from a Team plan. The team owner manages billing."}
          {!sub && !s.seatOf && `Free account. ${s.meter.used} of ${s.meter.limit} Pro articles read this month.`}
          {sub?.status === "trialing" && `Trial ends ${longDate(sub.trialEnd)}. ${sub.cancelAtPeriodEnd ? "It will not renew; nothing is charged." : `Then your card${s.card ? ` (${s.card.brand} ···· ${s.card.last4})` : ""} is charged unless you cancel before.`}`}
          {sub && sub.status !== "trialing" && (sub.cancelAtPeriodEnd ? `Cancelled — access continues until ${longDate(sub.periodEnd)}.` : `Renews ${longDate(sub.periodEnd)}${s.card ? ` · ${s.card.brand} ···· ${s.card.last4}` : ""}.`)}
          {sub?.plan === "team" && ` ${sub.seats} people included.`}
        </span>
      </div>

      {sub ? (
        <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
          <button type="button" className="btn dark" disabled={!!busy} onClick={() => void go("portal", "/api/billing/portal/")}>{busy === "portal" ? "Opening…" : "Manage billing"}</button>
          <span className="meta" style={{ alignSelf: "center" }}>Change card or plan, download invoices, cancel or resume — on Stripe&apos;s secure page.</span>
        </div>
      ) : !s.seatOf && (
        s.live ? (
          <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
            <div style={{ display: "flex", gap: "8px", alignItems: "center", flexWrap: "wrap" }}>
              <span className="lbl">BILLING</span>
              <button type="button" className={`btn sm${cycle === "monthly" ? " dark" : ""}`} aria-pressed={cycle === "monthly"} onClick={() => setCycle("monthly")}>Monthly</button>
              <button type="button" className={`btn sm${cycle === "yearly" ? " dark" : ""}`} aria-pressed={cycle === "yearly"} onClick={() => setCycle("yearly")}>Yearly · 2 months free</button>
            </div>
            <div className="g3f" style={{ display: "grid", gridTemplateColumns: "repeat(3, minmax(0,1fr))", gap: "10px" }}>
              {(["pro", "team", "company"] as PaidPlan[]).map((id) => {
                const p = PLAN[id];
                const off = id === "company" && !s.hasCompany;
                return (
                  <div key={id} style={{ border: id === "pro" ? "2px solid var(--ink)" : "1px solid var(--line)", borderRadius: "12px", padding: "14px", display: "flex", flexDirection: "column", gap: "8px" }}>
                    <b style={{ fontSize: "15px" }}>{p.name}</b>
                    <span style={{ fontSize: "20px", fontWeight: 800 }}>{usd(cycle === "yearly" ? p.price!.yearly : p.price!.monthly)}<span className="meta" style={{ fontWeight: 600 }}> / {cycle === "yearly" ? "year" : "month"}</span></span>
                    <span className="meta" style={{ minHeight: "36px" }}>{p.tagline}</span>
                    {off ? <Link href="/account/#company" className="btn sm">Claim your company first</Link> : <button type="button" className={`btn sm${id === "pro" ? " dark" : ""}`} disabled={!!busy} onClick={() => void go(id, "/api/billing/checkout/", { plan: id, cycle })}>{busy === id ? "Opening checkout…" : s.trialUsed ? "Subscribe" : `Start ${TRIAL_DAYS}-day free trial`}</button>}
                  </div>
                );
              })}
            </div>
            <span className="meta">{s.trialUsed ? "" : "Nothing is charged during the trial; we remind you 3 days before it ends. "}<Link href="/pricing/" style={{ color: "var(--red-text)", fontWeight: 800 }}>Compare all plans</Link></span>
          </div>
        ) : (
          <div className="note">Paid plans open soon. See what they include on <Link href="/pricing/" style={{ color: "var(--red-text)", fontWeight: 800 }}>Plans &amp; pricing</Link>; nothing is ever charged without you choosing a plan.</div>
        )
      )}
      {err && <p role="alert" style={{ margin: 0, fontSize: "13px", fontWeight: 800, color: "var(--red-text)" }}>{err}</p>}

      {sub?.plan === "team" && (
        <div style={{ borderTop: "1px solid var(--line)", paddingTop: "14px", display: "flex", flexDirection: "column", gap: "10px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", gap: "10px", flexWrap: "wrap" }}><span style={{ fontSize: "15px" }} className="h">Your team</span><span className="meta">{1 + (s.team?.length ?? 0)} of {sub.seats} seats used (you included)</span></div>
          {(s.team ?? []).map((t) => (
            <div key={t.id} style={{ display: "flex", alignItems: "center", gap: "10px", borderTop: "1px solid var(--line)", paddingTop: "8px" }}>
              <span style={{ flex: "1 1 auto", fontSize: "14px", fontWeight: 700, overflowWrap: "anywhere" }}>{t.email}</span>
              <button type="button" className="btn sm" onClick={() => void removeSeat(t.id)}>Remove</button>
            </div>
          ))}
          {1 + (s.team?.length ?? 0) < sub.seats ? (
            <form onSubmit={(e) => { e.preventDefault(); void addSeat(); }} style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
              <label htmlFor="seat-email" className="sr-only">Email of the person to add</label>
              <input id="seat-email" type="email" className="inp" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="colleague@company.com" style={{ flex: "1 1 220px" }} />
              <button type="submit" className="btn dark" disabled={busy === "seat"}>{busy === "seat" ? "Adding…" : "Add to team"}</button>
            </form>
          ) : <span className="meta">All seats are used. Add seats from Manage billing, or remove someone first.</span>}
          <span className="meta">People you add sign in with that email address (Google, Microsoft or an email code) and get Pro straight away.</span>
        </div>
      )}

      {(s.invoices?.length ?? 0) > 0 && (
        <div style={{ borderTop: "1px solid var(--line)", paddingTop: "14px" }}>
          <span style={{ fontSize: "15px" }} className="h">Invoices</span>
          {s.invoices!.map((i) => (
            <div key={i.no} style={{ display: "flex", gap: "10px", alignItems: "center", flexWrap: "wrap", padding: "8px 0", borderBottom: "1px solid var(--line)", fontSize: "13.5px" }}>
              <span style={{ fontWeight: 800 }}>{i.no}</span><span className="meta">{longDate(i.date)}</span><span style={{ marginLeft: "auto", fontWeight: 700 }}>{i.amount}</span>
              <span className="st" style={{ background: i.status === "paid" ? "var(--st-current-bg)" : "var(--st-review-bg)", color: i.status === "paid" ? "var(--up)" : "var(--st-review-fg)" }}>{i.status.toUpperCase()}</span>
              {i.pdf && <a href={i.pdf} className="btn sm" target="_blank" rel="noopener noreferrer">PDF</a>}
            </div>
          ))}
        </div>
      )}

      {s.reports.length > 0 && (
        <div style={{ borderTop: "1px solid var(--line)", paddingTop: "14px" }}>
          <span style={{ fontSize: "15px" }} className="h">Reports</span>
          {s.reports.map((r) => (
            <div key={r.slug} style={{ display: "flex", gap: "10px", alignItems: "center", flexWrap: "wrap", padding: "8px 0", borderBottom: "1px solid var(--line)" }}>
              <span style={{ fontWeight: 800, fontSize: "14px", flex: "1 1 auto" }}>{r.title}</span><span className="meta">bought {longDate(r.date)}</span>
              <a href={`/api/billing/download/?slug=${encodeURIComponent(r.slug)}`} className="btn sm dark">Download PDF</a>
            </div>
          ))}
        </div>
      )}
      <span className="meta">Card details never reach this site: payments run on Stripe&apos;s secure pages. <Link href="/policies/terms/" style={{ color: "var(--red-text)", fontWeight: 800 }}>Terms</Link></span>
    </div>
  );
}

export function BillingPanel() {
  const { live } = useDemo();
  return live ? <BillingLive /> : <BillingDemo />;
}

function BillingDemo() {
  const { d, set, toast } = useDemo();
  const b = d.billing;
  const B = (fn: (b: Billing) => Billing) => set((x) => ({ ...x, billing: fn(x.billing) }));
  const [open, setOpen] = useState<Open>(null);
  const [handoff, setHandoff] = useState(false);
  const [details, setDetails] = useState<BillingDetails>(b.details);
  const [detailsSaved, setDetailsSaved] = useState(false);
  const [reason, setReason] = useState("");
  const { cards, defaultCard: def, cancelled, cycle } = b;
  const shown = b.nextCycle ?? cycle;

  const toggle = (k: Exclude<Open, null>) => { setOpen((o) => (o === k ? null : k)); setHandoff(false); setDetailsSaved(false); if (k === "details") setDetails(b.details); };
  const card = cards.find((c) => c.id === def) ?? cards[0];
  const dset = (k: keyof BillingDetails, v: string) => { setDetails((x) => ({ ...x, [k]: v })); setDetailsSaved(false); };
  const emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(details.email.trim());

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
              <button key={k} type="button" aria-pressed={shown === k} onClick={() => { B((x) => ({ ...x, nextCycle: k === x.cycle ? null : k })); toast(k === cycle ? "Kept on " + (k === "monthly" ? "monthly" : "annual") + " billing." : `Switches to ${k} billing at the next renewal (${PERIOD_END}).`); }} style={{ border: 0, borderRadius: "999px", minHeight: "30px", padding: "0 14px", fontFamily: "inherit", fontSize: "12px", fontWeight: 800, cursor: "pointer", background: shown === k ? "#FFFFFF" : "transparent", color: shown === k ? "var(--ink)" : "#FFFFFF" }}>{k === "monthly" ? "Monthly" : "Annual"}</button>
            ))}
          </div>
        )}
      </div>
      {b.nextCycle && !cancelled && <Done>Switches to {b.nextCycle} billing at the next renewal ({PERIOD_END}); until then you stay on {cycle} billing. The new price is shown before you confirm in the live version.</Done>}

      <div style={{ display: "flex", flexDirection: "column", gap: "9px", fontSize: "13.5px", fontWeight: 500 }}>
        <div style={{ display: "flex", gap: "10px" }}><span style={{ color: "var(--red-text)", fontWeight: 800, flexShrink: 0 }}>&#183;</span><span>No display advertising anywhere on the site</span></div>
        <div style={{ display: "flex", gap: "10px" }}><span style={{ color: "var(--red-text)", fontWeight: 800, flexShrink: 0 }}>&#183;</span><span>Per-standard alerts and the full market-data look-back</span></div>
      </div>

      <div style={{ borderTop: "1px solid var(--line)", paddingTop: "13px" }}>
        <div style={{ fontSize: "11.5px", fontWeight: 800, letterSpacing: ".1em", color: "var(--slate)", marginBottom: "6px" }}>BILLING HISTORY</div>
        {b.invoices.length === 0 && <span className="meta">No invoices yet.</span>}
        {b.invoices.map((inv, i) => {
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
                  <div style={{ marginBottom: "8px" }}>{inv.billedTo.company || inv.billedTo.name}<br />{inv.billedTo.address && <>{inv.billedTo.address}<br /></>}{COUNTRY_BY_CODE[inv.billedTo.country]?.name}{inv.billedTo.taxId && <> · Tax ID {inv.billedTo.taxId}</>}</div>
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
          ? <button type="button" className="btn dark" onClick={() => { B((x) => ({ ...x, cancelled: false, cancelReason: "" })); setOpen(null); toast(`Resumed. Pro renews on ${PERIOD_END}.`); }}>Resume subscription</button>
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
                : <><button type="button" className="btn" style={{ minHeight: "32px", fontSize: "12px" }} onClick={() => { B((x) => ({ ...x, defaultCard: c.id })); toast(`${c.brand} ···· ${c.last4} is now the default card.`); }}>Make default</button><button type="button" className="btn" style={{ minHeight: "32px", fontSize: "12px", color: "var(--red-deep)" }} onClick={() => { B((x) => ({ ...x, cards: x.cards.filter((y) => y.id !== c.id) })); toast(`${c.brand} ···· ${c.last4} removed.`); }}>Remove</button></>}
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
          <p className="meta" style={{ margin: 0 }}>Printed on every future invoice. Invoices already issued keep the details they were issued with.</p>
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
            <button type="button" className="btn dark" disabled={!details.name.trim() || !emailOk || JSON.stringify(details) === JSON.stringify(b.details)} onClick={() => { B((x) => ({ ...x, details })); setDetailsSaved(true); }}>Save details</button>
            {details.email && !emailOk && <span className="meta" style={{ color: "var(--red-text)" }}>Enter a valid invoice email.</span>}
            {detailsSaved && <Done>Saved. They will be printed on the next invoice; past invoices are unchanged.</Done>}
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
            <button type="button" className="btn" style={{ background: "var(--red)", borderColor: "var(--red)", color: "#FFFFFF" }} onClick={() => { B((x) => ({ ...x, cancelled: true, cancelReason: reason, nextCycle: null })); setOpen(null); toast(`Cancelled. You keep Pro until ${PERIOD_END}.`); }}>Confirm cancellation</button>
            <button type="button" className="btn" onClick={() => setOpen(null)}>Keep Pro</button>
          </div>
        </Box>
      )}
    </div>
  );
}
