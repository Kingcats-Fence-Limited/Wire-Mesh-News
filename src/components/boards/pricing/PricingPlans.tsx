"use client";

/* Plan cards with the monthly / yearly switch and the buttons. Preview or payments not yet
   configured: buttons say "Opens soon". Live: sign in first if needed, then Stripe Checkout. */
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { PLANS, yearlySaving, usd, TRIAL_DAYS, type Cycle, type PlanId } from "@/lib/plans";
import { AUTH_LIVE, BILLING_LIVE } from "@/lib/live";
import { useMe } from "@/lib/me-client";

const POINTS: Record<Exclude<PlanId, "sponsor">, string[]> = {
  free: ["All news, guides, standards and the Directory", "2 Pro analysis articles a month", "Tender titles and trade-defence case list", "Claim and edit your company profile"],
  pro: ["Every Pro analysis article", "Tenders & project leads with full details and daily alerts", "Trade-defence tracker: duty rates, companies, alerts", "Monthly trade statistics with CSV download", "Specification templates and checklists", "No advertising"],
  team: ["Everything in Pro for 5 people", "Shared tender alerts", "One invoice with your company and tax details", "Add people any time (US$15/month each)"],
  company: ["Profile analytics: views, enquiries, countries", "Catalogue PDF, video and extra contacts on your profile", "Tenders matched to your products", "Pro for one person"],
};

export function PricingPlans() {
  const [cycle, setCycle] = useState<Cycle>("yearly");
  const [busy, setBusy] = useState<PlanId | null>(null);
  const [err, setErr] = useState<{ plan: PlanId; text: string; link?: [string, string] } | null>(null);
  const me = useMe();
  const auto = useRef(false);

  const start = async (plan: PlanId, c: Cycle = cycle) => {
    setErr(null);
    if (!me?.signedIn) { location.assign(`/signin/?next=${encodeURIComponent(`/pricing/?plan=${plan}&cycle=${c}`)}`); return; }
    setBusy(plan);
    const r = await fetch("/api/billing/checkout/", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ plan, cycle: c }) }).catch(() => null);
    const j = (await r?.json().catch(() => ({}))) as { url?: string; error?: string; manage?: boolean; claim?: boolean } | undefined;
    if (r?.ok && j?.url) { location.assign(j.url); return; }
    setBusy(null);
    setErr({ plan, text: j?.error ?? "Could not open the payment page. Try again.", link: j?.manage ? ["/account/#billing", "Go to Subscription & billing"] : j?.claim ? ["/account/#company", "Claim your company"] : undefined });
  };

  /* Back from sign-in with ?plan=…: continue straight to payment. */
  useEffect(() => {
    if (auto.current || !BILLING_LIVE || !me?.signedIn) return;
    const q = new URLSearchParams(location.search);
    const plan = q.get("plan") as PlanId | null, c = q.get("cycle") === "monthly" ? "monthly" : "yearly";
    if (!plan || !["pro", "team", "company"].includes(plan)) return;
    auto.current = true;
    history.replaceState(null, "", location.pathname);
    setCycle(c);
    void start(plan, c);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [me]);

  const current = me?.plan ?? "free";
  return (
    <>
      <div style={{ display: "flex", alignItems: "center", gap: "14px", flexWrap: "wrap", marginBottom: "30px" }}>
        <div className="cyc" role="group" aria-label="Billing period">
          <button type="button" aria-pressed={cycle === "monthly"} onClick={() => setCycle("monthly")}>Monthly</button>
          <button type="button" aria-pressed={cycle === "yearly"} onClick={() => setCycle("yearly")}>Yearly <span className="save">2 MONTHS FREE</span></button>
        </div>
        <span style={{ fontSize: "13px", color: "var(--grey-3)", fontWeight: 600 }}>{TRIAL_DAYS}-day free trial on every paid plan · cancel any time · prices exclude tax</span>
      </div>
      <div className="plans">
        {PLANS.map((p) => {
          const paid = !!p.price;
          const amount = p.price ? (cycle === "yearly" ? p.price.yearly : p.price.monthly) : 0;
          const mine = AUTH_LIVE && me?.signedIn && current === p.id;
          return (
            <div key={p.id} className={`plan${p.highlight ? " hi" : ""}`}>
              {p.highlight && <span className="flag">MOST POPULAR</span>}
              <div>
                <div style={{ fontSize: "22px", marginBottom: "6px" }} className="h">{p.name}</div>
                <p style={{ margin: 0, fontSize: "13.5px", fontWeight: 500, lineHeight: 1.5, color: "var(--slate)", minHeight: "40px" }}>{p.tagline}</p>
              </div>
              <div>
                <div style={{ display: "flex", alignItems: "baseline", gap: "6px" }}><span className="amt">{paid ? usd(amount) : "US$0"}</span>{paid && <span className="per">/ {cycle === "yearly" ? "year" : "month"}</span>}</div>
                <div className="per" style={{ marginTop: "6px", minHeight: "18px" }}>
                  {paid && cycle === "yearly" ? `${usd(Math.round((amount / 12) * 100) / 100)} a month · save ${usd(yearlySaving(p))}` : paid ? `or ${usd(p.price!.yearly)} a year` : "Free for ever"}
                  {p.seats ? ` · ${p.seats.included} people` : ""}
                </div>
              </div>
              {mine ? (
                <Link href="/account/#billing" className="cta line">Your plan · manage</Link>
              ) : !paid ? (
                <Link href={me?.signedIn ? "/account/" : "/signin/"} className="cta line">{me?.signedIn ? "Go to your account" : p.cta}</Link>
              ) : BILLING_LIVE ? (
                <button type="button" className={`cta ${p.highlight ? "red" : "dark"}`} disabled={busy !== null} onClick={() => void start(p.id)}>{busy === p.id ? "Opening secure checkout…" : current !== "free" && AUTH_LIVE ? `Switch to ${p.name}` : p.cta}</button>
              ) : (
                <button type="button" className="cta dark" disabled title="Paid plans open soon">Opens soon</button>
              )}
              {err?.plan === p.id && <p role="alert" style={{ margin: "-4px 0 0", fontSize: "12.5px", fontWeight: 700, color: "var(--red-text)" }}>{err.text} {err.link && <Link href={err.link[0]} style={{ textDecoration: "underline" }}>{err.link[1]}</Link>}</p>}
              <ul className="incl">{POINTS[p.id as Exclude<PlanId, "sponsor">].map((t) => <li key={t}>{t}</li>)}</ul>
            </div>
          );
        })}
      </div>
      {!BILLING_LIVE && <p style={{ margin: "18px 0 0", fontSize: "13px", fontWeight: 600, color: "var(--grey-3)" }}>Paid plans open soon. <Link href="/subscribe/" style={{ color: "#FFFFFF", textDecoration: "underline" }}>Get the weekly brief</Link> and we will tell you when they do.</p>}
    </>
  );
}

/* Directory Sponsor checkout (yearly; needs a claimed company). */
export function SponsorButton() {
  const me = useMe();
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState<{ text: string; link?: [string, string] } | null>(null);
  if (!BILLING_LIVE) return <button type="button" className="cta dark" style={{ width: "auto", alignSelf: "flex-start" }} disabled>Opens soon</button>;
  const go = async () => {
    if (!me?.signedIn) { location.assign(`/signin/?next=${encodeURIComponent("/pricing/#sponsor")}`); return; }
    setBusy(true); setErr(null);
    const r = await fetch("/api/billing/checkout/", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ plan: "sponsor", cycle: "yearly" }) }).catch(() => null);
    const j = (await r?.json().catch(() => ({}))) as { url?: string; error?: string; claim?: boolean; manage?: boolean } | undefined;
    if (r?.ok && j?.url) { location.assign(j.url); return; }
    setBusy(false); setErr({ text: j?.error ?? "Could not open checkout. Try again.", link: j?.claim ? ["/account/#company", "Claim your company"] : j?.manage ? ["/account/#billing", "Subscription & billing"] : undefined });
  };
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "6px", alignItems: "flex-start" }}>
      <button type="button" className="cta red" style={{ width: "auto" }} disabled={busy} onClick={() => void go()}>{busy ? "Opening secure checkout…" : SPONSOR_CTA}</button>
      {err && <span role="alert" style={{ fontSize: "12.5px", fontWeight: 700, color: "var(--red-text)" }}>{err.text} {err.link && <Link href={err.link[0]} className="lnk">{err.link[1]}</Link>}</span>}
      <span className="meta">Needs a claimed Directory profile. Invoice with your company and tax details.</span>
    </div>
  );
}
const SPONSOR_CTA = "Become a sponsor";
