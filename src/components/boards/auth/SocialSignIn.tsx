"use client";

/* Sign in / sign up with Google or Microsoft (personal or work accounts). Each provider confirms the
   email address itself, so accounts created this way start verified. Phase 1 has no auth
   backend: the button opens a clearly marked preview step instead of the provider's own
   window, and continues into the sample account. No provider SDK is loaded. */
import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";

type P = "google" | "microsoft";
const NAME: Record<P, string> = { google: "Google", microsoft: "Microsoft" };
const SAMPLE: Record<P, string> = { google: "jordan.dale@gmail.com", microsoft: "jordan.dale@company.com" };

const Logo = ({ p }: { p: P }) => {
  if (p === "google") return (
    <svg width="18" height="18" viewBox="0 0 48 48" aria-hidden="true"><path fill="#FFC107" d="M43.6 20.1H42V20H24v8h11.3c-1.6 4.7-6.1 8-11.3 8-6.6 0-12-5.4-12-12s5.4-12 12-12c3.1 0 5.8 1.2 8 3l5.7-5.7C34 6.1 29.3 4 24 4 13 4 4 13 4 24s9 20 20 20 20-9 20-20c0-1.3-.1-2.6-.4-3.9z" /><path fill="#FF3D00" d="m6.3 14.7 6.6 4.8C14.7 15.1 19 12 24 12c3.1 0 5.8 1.2 8 3l5.7-5.7C34 6.1 29.3 4 24 4 16.3 4 9.7 8.3 6.3 14.7z" /><path fill="#4CAF50" d="M24 44c5.2 0 9.9-2 13.4-5.2l-6.2-5.2c-2 1.5-4.5 2.4-7.2 2.4-5.2 0-9.6-3.3-11.3-7.9l-6.5 5C9.5 39.6 16.2 44 24 44z" /><path fill="#1976D2" d="M43.6 20.1H42V20H24v8h11.3c-.8 2.2-2.2 4.2-4.1 5.6l6.2 5.2C37 39.2 44 34 44 24c0-1.3-.1-2.6-.4-3.9z" /></svg>
  );
  return <svg width="16" height="16" viewBox="0 0 23 23" aria-hidden="true"><path fill="#F25022" d="M1 1h10v10H1z" /><path fill="#7FBA00" d="M12 1h10v10H12z" /><path fill="#00A4EF" d="M1 12h10v10H1z" /><path fill="#FFB900" d="M12 12h10v10H12z" /></svg>;
};

export function SocialSignIn({ mode, next }: { mode: "signin" | "register"; next?: string }) {
  const router = useRouter();
  const [p, setP] = useState<P | null>(null);
  const [email, setEmail] = useState("");
  const [terms, setTerms] = useState(false);
  const verb = mode === "register" ? "Sign up" : "Continue";
  const go = () => router.push(next && next.startsWith("/") ? next : "/account/");
  return (
    <div style={{ marginBottom: "18px" }}>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px" }} className="sso">
        {(["google", "microsoft"] as P[]).map((k) => (
          <button key={k} type="button" aria-pressed={p === k} onClick={() => { setP(p === k ? null : k); setEmail(SAMPLE[k]); }} className={`ssob${p === k ? " on" : ""}`}>
            <Logo p={k} /><span>{verb} with {NAME[k]}</span>
          </button>
        ))}
      </div>
      {p && (
        <div className="ssop" role="region" aria-label={`${NAME[p]} sign-in preview`}>
          <div style={{ display: "flex", alignItems: "center", gap: "8px", flexWrap: "wrap" }}>
            <span style={{ background: "var(--red)", color: "#FFFFFF", fontSize: "9px", fontWeight: 800, letterSpacing: ".14em", padding: "2px 6px", borderRadius: "3px" }}>PREVIEW</span>
            <span style={{ fontSize: "12.5px", fontWeight: 600, color: "var(--slate)" }}>On the live site this opens {NAME[p]}&apos;s own sign-in window. Here you choose the address it would return.</span>
          </div>
          <div className="fld" style={{ margin: 0 }}>
            <label htmlFor="sso-e">EMAIL FROM {NAME[p].toUpperCase()}</label>
            {p === "microsoft" && <span className="hint" style={{ marginTop: "-2px" }}>Works with Outlook and with Microsoft 365 work accounts, so the address can be your company one.</span>}
            <input id="sso-e" type="email" className="inp" value={email} onChange={(e) => setEmail(e.target.value)} />
          </div>
          <div className="ok" style={{ margin: 0 }}><svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="var(--up)" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" style={{ flexShrink: 0, marginTop: "2px" }}><path d="m5 12.5 4.5 4.5L19 7.5" /></svg><span>{NAME[p]} has already confirmed this address, so no verification email is needed. We receive only your name and email — never your {NAME[p]} password or contacts.</span></div>
          {mode === "register" && <label style={{ display: "flex", gap: "10px", alignItems: "flex-start", fontSize: "13px", fontWeight: 500, lineHeight: 1.55, cursor: "pointer" }}><input type="checkbox" checked={terms} onChange={(e) => setTerms(e.target.checked)} style={{ width: "17px", height: "17px", accentColor: "var(--red)", flexShrink: 0, marginTop: "1px" }} /><span>I agree to the <Link href="/policies/terms/" style={{ color: "var(--red-text)", fontWeight: 800 }}>Terms</Link> and the <Link href="/policies/privacy/" style={{ color: "var(--red-text)", fontWeight: 800 }}>Privacy Policy</Link>.</span></label>}
          <div style={{ display: "flex", gap: "8px" }}>
            <button type="button" className="btn" style={{ minHeight: "44px", fontSize: "14px" }} disabled={!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email) || (mode === "register" && !terms)} onClick={go}>{mode === "register" ? "Create account" : "Continue"} as {email.split("@")[0] || "…"}</button>
            <button type="button" onClick={() => setP(null)} style={{ minHeight: "44px", padding: "0 16px", border: "1px solid var(--line)", borderRadius: "999px", background: "var(--card)", fontFamily: "inherit", fontSize: "13.5px", fontWeight: 800, cursor: "pointer", color: "var(--ink)", flexShrink: 0 }}>Cancel</button>
          </div>
        </div>
      )}
      <div className="or"><span>or with email</span></div>
    </div>
  );
}
