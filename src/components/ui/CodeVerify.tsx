"use client";

/* Six-digit email code step, shared by sign-in, the email change in Settings and the company
   enquiry email. With `live` handlers the code is sent and checked by the server; without
   them (preview mode) the code is made here and shown on screen so the flow can be tried. */
import { useEffect, useRef, useState } from "react";

const make = () => String(Math.floor(100000 + Math.random() * 900000));

export type LiveCode = {
  /** Send (or resend) a code. Resolve with an error message to show, or nothing. */
  send: () => Promise<string | void>;
  /** Check a code. Resolve with an error message, or nothing when it was right. */
  verify: (code: string) => Promise<string | void>;
  /** True when the first code has already been sent by the step before. */
  alreadySent?: boolean;
};

export function CodeVerify({ email, onVerified, compact = false, purpose = "your email address", live }: { email: string; onVerified: () => void; compact?: boolean; purpose?: string; live?: LiveCode }) {
  const [code, setCode] = useState(make);
  const [val, setVal] = useState("");
  const [left, setLeft] = useState(60);
  const [err, setErr] = useState<string | null>(null);
  const [tries, setTries] = useState(0);
  const [busy, setBusy] = useState(false);
  const ref = useRef<HTMLInputElement>(null);
  const sentOnce = useRef(false);
  useEffect(() => { ref.current?.focus(); }, []);
  useEffect(() => { if (left <= 0) return; const t = setTimeout(() => setLeft((x) => x - 1), 1000); return () => clearTimeout(t); }, [left]);
  /* Live: send the first code on mount unless the previous step already did. */
  useEffect(() => {
    if (!live || live.alreadySent || sentOnce.current) return;
    sentOnce.current = true;
    live.send().then((e) => { if (e) setErr(e); });
  }, [live]);

  const check = async (v: string) => {
    if (v.length < 6) return;
    if (live) {
      setBusy(true);
      const e = await live.verify(v).catch(() => "Something went wrong. Try again.");
      setBusy(false);
      if (!e) { setErr(null); onVerified(); return; }
      setErr(e); setVal(""); setTries((n) => n + 1);
      return;
    }
    if (v === code) { setErr(null); onVerified(); return; }
    const n = tries + 1; setTries(n);
    setErr(n >= 5 ? "Too many attempts. Request a new code." : "That code is not right. Check the latest email we sent.");
    setVal("");
  };
  const resend = async () => {
    setLeft(60); setTries(0); setVal(""); setErr(null);
    if (live) { const e = await live.send(); if (e) setErr(e); }
    else setCode(make());
  };
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: compact ? "8px" : "12px" }}>
      <p style={{ margin: 0, fontSize: compact ? "13px" : "14.5px", fontWeight: 500, lineHeight: 1.6, color: "var(--fg-3)" }}>We sent a 6-digit code to <b>{email}</b> to {purpose}. It is valid for 5 minutes.</p>
      <div style={{ display: "flex", gap: "8px", alignItems: "center", flexWrap: "wrap" }}>
        <input ref={ref} inputMode="numeric" autoComplete="one-time-code" aria-label="Verification code" maxLength={6} value={val} disabled={busy || (!live && tries >= 5)}
          onChange={(e) => { const v = e.target.value.replace(/\D/g, "").slice(0, 6); setVal(v); setErr(null); void check(v); }}
          placeholder="••••••" style={{ width: "168px", minHeight: compact ? "40px" : "50px", border: `1px solid ${err ? "var(--red)" : "var(--line)"}`, borderRadius: "10px", padding: "0 14px", fontFamily: "inherit", fontSize: compact ? "18px" : "22px", fontWeight: 800, letterSpacing: ".3em", background: "var(--card)", color: "var(--ink)" }} />
        <button type="button" disabled={left > 0 || busy} onClick={() => void resend()}
          style={{ minHeight: compact ? "36px" : "44px", padding: "0 16px", border: "1px solid var(--line)", borderRadius: "999px", background: "var(--card)", fontFamily: "inherit", fontSize: "13px", fontWeight: 800, color: left > 0 ? "var(--grey)" : "var(--ink)", cursor: left > 0 ? "not-allowed" : "pointer" }}>
          {left > 0 ? `Resend in ${left}s` : "Resend code"}
        </button>
        {busy && <span className="meta" role="status">Checking…</span>}
      </div>
      {err && <span role="alert" style={{ fontSize: "12.5px", fontWeight: 700, color: "var(--red-text)" }}>{err}</span>}
      {!live && (
        <div style={{ display: "flex", alignItems: "center", gap: "8px", flexWrap: "wrap", background: "var(--paper)", borderRadius: "8px", padding: "8px 11px", fontSize: "12px", fontWeight: 600, color: "var(--slate)" }}>
          <span style={{ background: "var(--red)", color: "#FFFFFF", fontSize: "9px", fontWeight: 800, letterSpacing: ".14em", padding: "2px 6px", borderRadius: "3px" }}>PREVIEW</span>
          No email is sent yet. The code in the email would be <b style={{ color: "var(--ink)", letterSpacing: ".12em" }}>{code}</b>
        </div>
      )}
    </div>
  );
}
