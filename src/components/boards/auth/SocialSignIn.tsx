"use client";

/* Sign in / sign up with Google, Apple, Microsoft or LinkedIn. Each provider confirms the
   email address itself, so accounts created this way start verified. Phase 1 has no auth
   backend: the button opens a clearly marked preview step instead of the provider's own
   window, and continues into the sample account. No provider SDK is loaded. */
import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";

type P = "google" | "apple" | "microsoft" | "linkedin";
const NAME: Record<P, string> = { google: "Google", apple: "Apple", microsoft: "Microsoft", linkedin: "LinkedIn" };
const SAMPLE: Record<P, string> = { google: "jordan.dale@gmail.com", apple: "jordan.dale@icloud.com", microsoft: "jordan.dale@outlook.com", linkedin: "jordan.dale@example.com" };

const Logo = ({ p }: { p: P }) => {
  if (p === "google") return (
    <svg width="18" height="18" viewBox="0 0 48 48" aria-hidden="true"><path fill="#FFC107" d="M43.6 20.1H42V20H24v8h11.3c-1.6 4.7-6.1 8-11.3 8-6.6 0-12-5.4-12-12s5.4-12 12-12c3.1 0 5.8 1.2 8 3l5.7-5.7C34 6.1 29.3 4 24 4 13 4 4 13 4 24s9 20 20 20 20-9 20-20c0-1.3-.1-2.6-.4-3.9z" /><path fill="#FF3D00" d="m6.3 14.7 6.6 4.8C14.7 15.1 19 12 24 12c3.1 0 5.8 1.2 8 3l5.7-5.7C34 6.1 29.3 4 24 4 16.3 4 9.7 8.3 6.3 14.7z" /><path fill="#4CAF50" d="M24 44c5.2 0 9.9-2 13.4-5.2l-6.2-5.2c-2 1.5-4.5 2.4-7.2 2.4-5.2 0-9.6-3.3-11.3-7.9l-6.5 5C9.5 39.6 16.2 44 24 44z" /><path fill="#1976D2" d="M43.6 20.1H42V20H24v8h11.3c-.8 2.2-2.2 4.2-4.1 5.6l6.2 5.2C37 39.2 44 34 44 24c0-1.3-.1-2.6-.4-3.9z" /></svg>
  );
  if (p === "apple") return <svg width="17" height="17" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M12.15 6.9c-.95 0-2.42-1.08-3.96-1.04-2.04.03-3.91 1.18-4.96 3.01-2.12 3.68-.55 9.1 1.52 12.09 1.01 1.45 2.2 3.09 3.79 3.04 1.52-.07 2.09-.99 3.94-.99 1.83 0 2.35.99 3.96.95 1.64-.03 2.68-1.48 3.68-2.95 1.16-1.69 1.64-3.33 1.66-3.42-.04-.01-3.18-1.22-3.22-4.86-.03-3.04 2.48-4.49 2.6-4.56-1.43-2.09-3.62-2.32-4.39-2.38-2-.16-3.68 1.09-4.61 1.09zm3.38-3.07c.84-1.01 1.4-2.43 1.25-3.83-1.21.05-2.66.8-3.53 1.82-.78.9-1.46 2.34-1.27 3.71 1.34.1 2.72-.69 3.56-1.7" /></svg>;
  if (p === "microsoft") return <svg width="16" height="16" viewBox="0 0 23 23" aria-hidden="true"><path fill="#F25022" d="M1 1h10v10H1z" /><path fill="#7FBA00" d="M12 1h10v10H12z" /><path fill="#00A4EF" d="M1 12h10v10H1z" /><path fill="#FFB900" d="M12 12h10v10H12z" /></svg>;
  return <svg width="16" height="16" viewBox="0 0 24 24" fill="#0A66C2" aria-hidden="true"><path d="M20.45 20.45h-3.55v-5.57c0-1.33-.03-3.04-1.85-3.04-1.85 0-2.14 1.45-2.14 2.94v5.67H9.35V9h3.41v1.56h.05c.48-.9 1.64-1.85 3.37-1.85 3.6 0 4.27 2.37 4.27 5.46v6.28zM5.34 7.43a2.06 2.06 0 1 1 0-4.13 2.06 2.06 0 0 1 0 4.13zM7.12 20.45H3.56V9h3.56v11.45zM22.22 0H1.77C.79 0 0 .77 0 1.73v20.54C0 23.23.79 24 1.77 24h20.45c.98 0 1.78-.77 1.78-1.73V1.73C24 .77 23.2 0 22.22 0z" /></svg>;
};

export function SocialSignIn({ mode, next }: { mode: "signin" | "register"; next?: string }) {
  const router = useRouter();
  const [p, setP] = useState<P | null>(null);
  const [email, setEmail] = useState("");
  const [terms, setTerms] = useState(false);
  const [hide, setHide] = useState(false);
  const verb = mode === "register" ? "Sign up" : "Continue";
  const go = () => router.push(next && next.startsWith("/") ? next : "/account/");
  return (
    <div style={{ marginBottom: "18px" }}>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px" }} className="sso">
        {(["google", "apple", "microsoft", "linkedin"] as P[]).map((k) => (
          <button key={k} type="button" aria-pressed={p === k} onClick={() => { setP(p === k ? null : k); setEmail(SAMPLE[k]); setHide(false); }} className={`ssob${p === k ? " on" : ""}${k === "google" ? " wide" : ""}`}>
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
            <input id="sso-e" type="email" className="inp" value={hide ? "x7k2m9p4qd@privaterelay.appleid.com" : email} disabled={hide} onChange={(e) => setEmail(e.target.value)} />
          </div>
          {p === "apple" && <label style={{ display: "flex", gap: "9px", alignItems: "center", fontSize: "13px", fontWeight: 500, cursor: "pointer" }}><input type="checkbox" checked={hide} onChange={(e) => setHide(e.target.checked)} style={{ width: "17px", height: "17px", accentColor: "var(--red)" }} />Use Apple&apos;s “Hide My Email” relay address</label>}
          <div className="ok" style={{ margin: 0 }}><svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="var(--up)" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" style={{ flexShrink: 0, marginTop: "2px" }}><path d="m5 12.5 4.5 4.5L19 7.5" /></svg><span>{NAME[p]} has already confirmed this address, so no verification email is needed. We receive only your name and email — never your {NAME[p]} password or contacts.</span></div>
          {mode === "register" && <label style={{ display: "flex", gap: "10px", alignItems: "flex-start", fontSize: "13px", fontWeight: 500, lineHeight: 1.55, cursor: "pointer" }}><input type="checkbox" checked={terms} onChange={(e) => setTerms(e.target.checked)} style={{ width: "17px", height: "17px", accentColor: "var(--red)", flexShrink: 0, marginTop: "1px" }} /><span>I agree to the <Link href="/policies/terms/" style={{ color: "var(--red-text)", fontWeight: 800 }}>Terms</Link> and the <Link href="/policies/privacy/" style={{ color: "var(--red-text)", fontWeight: 800 }}>Privacy Policy</Link>.</span></label>}
          <div style={{ display: "flex", gap: "8px" }}>
            <button type="button" className="btn" style={{ minHeight: "44px", fontSize: "14px" }} disabled={!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(hide ? "a@b.co" : email) || (mode === "register" && !terms)} onClick={go}>{mode === "register" ? "Create account" : "Continue"} as {hide ? "relay address" : email.split("@")[0] || "…"}</button>
            <button type="button" onClick={() => setP(null)} style={{ minHeight: "44px", padding: "0 16px", border: "1px solid var(--line)", borderRadius: "999px", background: "var(--card)", fontFamily: "inherit", fontSize: "13.5px", fontWeight: 800, cursor: "pointer", color: "var(--ink)", flexShrink: 0 }}>Cancel</button>
          </div>
        </div>
      )}
      <div className="or"><span>or with email</span></div>
    </div>
  );
}
