"use client";

/* Six-digit email verification step, shared by registration, sign-in and the company
   enquiry email. Phase 1 has no mail server: the preview shows the code it "sent" so the
   flow can be tested end to end. The resend timer really counts down. */
import { useEffect, useRef, useState } from "react";

const make = () => String(Math.floor(100000 + Math.random() * 900000));

export function CodeVerify({ email, onVerified, compact = false, purpose = "your email address" }: { email: string; onVerified: () => void; compact?: boolean; purpose?: string }) {
  const [code, setCode] = useState(make);
  const [val, setVal] = useState("");
  const [left, setLeft] = useState(60);
  const [err, setErr] = useState<string | null>(null);
  const [tries, setTries] = useState(0);
  const ref = useRef<HTMLInputElement>(null);
  useEffect(() => { ref.current?.focus(); }, []);
  useEffect(() => { if (left <= 0) return; const t = setTimeout(() => setLeft((x) => x - 1), 1000); return () => clearTimeout(t); }, [left]);
  const check = (v: string) => {
    if (v.length < 6) return;
    if (v === code) { setErr(null); onVerified(); return; }
    const n = tries + 1; setTries(n);
    setErr(n >= 5 ? "Too many attempts. Request a new code." : "That code is not right. Check the latest email we sent.");
    setVal("");
  };
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: compact ? "8px" : "12px" }}>
      <p style={{ margin: 0, fontSize: compact ? "13px" : "14.5px", fontWeight: 500, lineHeight: 1.6, color: "var(--fg-3)" }}>We sent a 6-digit code to <b>{email}</b> to confirm {purpose}. It is valid for 30 minutes.</p>
      <div style={{ display: "flex", gap: "8px", alignItems: "center", flexWrap: "wrap" }}>
        <input ref={ref} inputMode="numeric" autoComplete="one-time-code" aria-label="Verification code" maxLength={6} value={val} disabled={tries >= 5}
          onChange={(e) => { const v = e.target.value.replace(/\D/g, "").slice(0, 6); setVal(v); setErr(null); check(v); }}
          placeholder="••••••" style={{ width: "168px", minHeight: compact ? "40px" : "50px", border: `1px solid ${err ? "var(--red)" : "var(--line)"}`, borderRadius: "10px", padding: "0 14px", fontFamily: "inherit", fontSize: compact ? "18px" : "22px", fontWeight: 800, letterSpacing: ".4em", background: "var(--card)", color: "var(--ink)" }} />
        <button type="button" disabled={left > 0} onClick={() => { setCode(make()); setLeft(60); setTries(0); setVal(""); setErr(null); }}
          style={{ minHeight: compact ? "36px" : "44px", padding: "0 16px", border: "1px solid var(--line)", borderRadius: "999px", background: "var(--card)", fontFamily: "inherit", fontSize: "13px", fontWeight: 800, color: left > 0 ? "var(--grey)" : "var(--ink)", cursor: left > 0 ? "not-allowed" : "pointer" }}>
          {left > 0 ? `Resend in ${left}s` : "Resend code"}
        </button>
      </div>
      {err && <span role="alert" style={{ fontSize: "12.5px", fontWeight: 700, color: "var(--red-text)" }}>{err}</span>}
      <div style={{ display: "flex", alignItems: "center", gap: "8px", flexWrap: "wrap", background: "var(--paper)", borderRadius: "8px", padding: "8px 11px", fontSize: "12px", fontWeight: 600, color: "var(--slate)" }}>
        <span style={{ background: "var(--red)", color: "#FFFFFF", fontSize: "9px", fontWeight: 800, letterSpacing: ".14em", padding: "2px 6px", borderRadius: "3px" }}>PREVIEW</span>
        No email is sent yet. The code in the email would be <b style={{ color: "var(--ink)", letterSpacing: ".12em" }}>{code}</b>
      </div>
    </div>
  );
}
