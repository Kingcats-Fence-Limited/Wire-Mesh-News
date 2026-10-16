"use client";

import { useEffect, useState } from "react";
import { useSubscribe } from "@/lib/subscribe";
import Link from "next/link";
import "@/styles/board-ads.css";
import { PageHeadArt, HEAD_ART } from "@/components/shell/PageHeadArt";

/* Ads-S subscribe card: left = pitch + form, right = dark "in every issue" column. Used as the /subscribe page and as the one permitted pop-up. */

const ISSUE: [string, string][] = [
  ["This week's news, summarised", "Five items, two lines each"],
  ["Price and freight moves", "With direction and source"],
  ["Standards tracker", "New releases and open consultations"],
  ["One technical long read", "The editors' pick"],
];

export function SubscribeCard({ modal, onClose, pill }: { modal?: boolean; onClose?: () => void; pill?: string }) {
  /* On /subscribe/ this is the page heading; inside the modal it sits under the page's own h1. */
  const H = modal ? "h2" : "h1";
  const [email, setEmail] = useState("");
  const { sent, err, busy, submit, suggestion } = useSubscribe(modal ? "subscribe-modal" : "subscribe-page");
  /* Result of the confirmation / unsubscribe links (the page itself stays static). */
  const [back, setBack] = useState<string | null>(null);
  /* Token from the confirmation email: the reader confirms with a click (see /api/newsletter/confirm). */
  const [token, setToken] = useState<string | null>(null);
  const [confirming, setConfirming] = useState(false);
  const confirm = async () => {
    setConfirming(true);
    const r = await fetch("/api/newsletter/confirm/", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ t: token }) }).catch(() => null);
    setConfirming(false); setToken(null);
    setBack(r?.ok ? "You are subscribed. The first brief arrives on Monday." : r ? (((await r.json().catch(() => ({}))) as { error?: string }).error ?? "Something went wrong. Try again.") : "Check your connection and try again.");
  };
  useEffect(() => {
    if (modal) return;
    const q = new URLSearchParams(location.search);
    const t = q.get("confirm");
    if (t) { setToken(t); history.replaceState(null, "", location.pathname); return; }
    const msg = q.get("confirmed") === "1" ? "You are subscribed. The first brief arrives on Monday." : q.get("confirmed") === "0" ? "That confirmation link has expired or was already used. Sign up again below." : q.get("unsubscribed") === "1" ? "You are unsubscribed. No more emails will be sent." : q.get("unsubscribed") === "0" ? "That unsubscribe link is not valid. Use the link in the latest email, or write to us." : null;
    if (msg) { setBack(msg); history.replaceState(null, "", location.pathname); }
  }, [modal]);
  return (
    <div className="subcard">
      <div style={{ padding: "30px 32px 28px", position: "relative" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "9px", marginBottom: "20px" }}>
          <svg width="30" height="30" viewBox="0 0 120 120" aria-hidden="true"><use href="#w1" width="120" height="120" /></svg>
          <span className="h" style={{ fontSize: "19px", letterSpacing: "-.05em" }}>wire mesh</span>
          <span className="h" style={{ background: "var(--red)", color: "#FFFFFF", fontSize: "19px", letterSpacing: "-.05em", padding: "2px 6px 4px", borderRadius: "5px" }}>news</span>
        </div>
        {pill && (
          <div style={{ display: "inline-flex", alignItems: "center", gap: "7px", background: "var(--paper)", borderRadius: "999px", padding: "6px 13px", marginBottom: "14px" }}>
            <span style={{ width: "6px", height: "6px", borderRadius: "999px", background: "var(--red)" }} />
            <span style={{ fontSize: "11px", fontWeight: 800, letterSpacing: ".1em", color: "var(--slate)" }}>{pill}</span>
          </div>
        )}
        <H className="h" id="sub-title" style={{ margin: "0 0 12px", fontSize: "34px", letterSpacing: "-.05em", lineHeight: 1.04, maxWidth: "390px" }}>Mondays, one email,<br />the whole week’s <span style={{ color: "var(--red-text)" }}>mesh</span>.</H>
        <p style={{ margin: "0 0 20px", fontSize: "15px", fontWeight: 500, lineHeight: 1.6, color: "var(--slate)", maxWidth: "400px" }}>News, price moves and standards updates on one page. Written for people who make decisions, not for the algorithm.</p>
        {token && (
          <div style={{ border: "1.5px solid var(--ink)", borderRadius: "14px", padding: "16px 18px", marginBottom: "16px" }}>
            <p style={{ margin: "0 0 12px", fontSize: "14px", fontWeight: 700, lineHeight: 1.5 }}>One more click: confirm that you want the weekly brief at this address.</p>
            <button type="button" className="btn" onClick={() => void confirm()} disabled={confirming} style={{ border: 0, background: "var(--red)", color: "#FFFFFF", fontFamily: "inherit", fontWeight: 800, fontSize: "14px", padding: "0 20px", minHeight: "44px", borderRadius: "999px", cursor: "pointer" }}>{confirming ? "Confirming…" : "Confirm my subscription"}</button>
          </div>
        )}
        {back && <div role="status" style={{ background: "var(--paper)", borderRadius: "12px", padding: "12px 16px", marginBottom: "16px", fontSize: "14px", fontWeight: 700 }}>{back}</div>}
        {token ? null : sent ? (
          <div style={{ border: "1.5px solid var(--ink)", borderRadius: "14px", padding: "16px 18px", marginBottom: "16px", fontSize: "14px", fontWeight: 700, lineHeight: 1.5 }}>
            Check your inbox for a confirmation link. Nothing is sent until you click it.
          </div>
        ) : (
          <form noValidate onSubmit={(e) => { e.preventDefault(); void submit(email); }} style={{ display: "flex", gap: "10px", flexWrap: "wrap", marginBottom: "16px" }}>
            <label htmlFor="mnl" style={{ position: "absolute", width: "1px", height: "1px", overflow: "hidden", clip: "rect(0 0 0 0)" }}>Email address</label>
            <input id="mnl" type="email" placeholder="you@company.com" value={email} onChange={(e) => setEmail(e.target.value)} autoComplete="email" />
            <button type="submit" disabled={busy}>Subscribe<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6" /></svg></button>
          {err && <p role="alert" style={{ margin: "8px 0 0", fontSize: "12.5px", fontWeight: 800, color: "var(--red-text)", flexBasis: "100%" }}>{err}{suggestion && <> <button type="button" onClick={() => { setEmail(suggestion); void submit(suggestion); }} style={{ border: 0, background: "transparent", padding: 0, font: "inherit", color: "var(--ink)", textDecoration: "underline", cursor: "pointer" }}>Use {suggestion}</button></>}</p>}
</form>
        )}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: "14px", flexWrap: "wrap", paddingTop: "16px", borderTop: "1px solid var(--line)" }}>
          {modal ? (
            <button type="button" onClick={onClose} style={{ border: 0, background: "transparent", padding: 0, fontFamily: "inherit", fontSize: "13.5px", fontWeight: 700, color: "var(--slate)", cursor: "pointer", textDecoration: "underline" }}>No thanks, keep reading</button>
          ) : (
            <span className="meta">Free · double opt-in · section lists and event alerts available once you have an account</span>
          )}
          <span className="meta" style={{ fontSize: "12px" }}>No sharing of your address · one-click unsubscribe · <Link href="/policies/privacy/" style={{ color: "var(--slate)", textDecoration: "underline" }}>Privacy</Link></span>
        </div>
      </div>
      <div style={{ background: "var(--surface-dark)", position: "relative", overflow: "hidden", padding: "30px 24px", display: "flex", flexDirection: "column" }}>
        <PageHeadArt src={HEAD_ART.coils} opacity={0.4} />
        <svg width="230" height="230" viewBox="0 0 120 120" style={{ position: "absolute", right: "-78px", bottom: "-92px", color: "#1C1D26" }} aria-hidden="true"><use href="#w1" width="120" height="120" /></svg>
        {modal && (
          <button type="button" aria-label="Close" onClick={onClose} style={{ position: "absolute", right: "12px", top: "12px", width: "40px", height: "40px", border: 0, background: "rgba(255,255,255,.1)", borderRadius: "999px", color: "#FFFFFF", fontSize: "15px", cursor: "pointer", display: "inline-flex", alignItems: "center", justifyContent: "center" }}>✕</button>
        )}
        <div style={{ position: "relative", marginTop: modal ? "26px" : 0 }}>
          <div style={{ fontSize: "10.5px", fontWeight: 800, letterSpacing: ".14em", color: "var(--grey-5)", marginBottom: "16px" }}>IN EVERY ISSUE</div>
          <div style={{ display: "flex", flexDirection: "column", gap: "15px" }}>
            {ISSUE.map(([t, s], i) => (
              <div key={t} style={{ display: "flex", gap: "11px", alignItems: "flex-start" }}>
                <span style={{ color: "var(--red-text)", fontWeight: 800, fontSize: "13px", flexShrink: 0, paddingTop: "1px" }}>{String(i + 1).padStart(2, "0")}</span>
                <span style={{ fontSize: "13.5px", fontWeight: 700, lineHeight: 1.4, color: "#FFFFFF" }}>{t}<span style={{ display: "block", fontWeight: 500, fontSize: "12px", color: "var(--grey-2)", marginTop: "2px" }}>{s}</span></span>
              </div>
            ))}
          </div>
        </div>
        <div style={{ position: "relative", marginTop: "auto", paddingTop: "20px", borderTop: "1px solid var(--line-dark)" }}>
          <div className="mono" style={{ fontSize: "11px", fontWeight: 800, color: "var(--grey-5)", letterSpacing: ".06em" }}>EVERY MONDAY · 07:00 UTC</div>
        </div>
      </div>
    </div>
  );
}
