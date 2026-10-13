"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { SocialSignIn } from "./SocialSignIn";
import { CodeVerify } from "@/components/ui/CodeVerify";

/* Preview only: remembers an email that registered but has not verified yet, so signing in with it asks for the code first. */
const PENDING = "wmn-demo-pending";
const getPending = () => { try { return localStorage.getItem(PENDING); } catch { return null; } };
const setPending = (v: string | null) => { try { if (v) localStorage.setItem(PENDING, v); else localStorage.removeItem(PENDING); } catch { /* ignore */ } };

const DISPOSABLE = ["mailinator.com", "10minutemail.com", "guerrillamail.com", "tempmail.com", "yopmail.com", "trashmail.com"];
const Err = ({ children }: { children: React.ReactNode }) => (
  <div style={{ marginBottom: "16px" }} className="err"><svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="var(--red-text)" strokeWidth="2.3" strokeLinecap="round" aria-hidden="true" style={{ flexShrink: "0", marginTop: "2px" }}><circle cx="12" cy="12" r="9" /><path d="M12 7.5v5M12 16.2v.01" /></svg><span>{children}</span></div>
);

/* Auth-Q ① Sign in. Phase 1 has no account backend: the form validates and explains that accounts open in Phase 2. */
export function SignInForm({ next }: { next?: string }) {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [pw, setPw] = useState("");
  const [show, setShow] = useState(false);
  const [err, setErr] = useState<string | null>(null);
  const [verify, setVerify] = useState(false);
  const dest = next && next.startsWith("/") ? next : "/account/";
  if (verify) {
    return (
      <div>
        <Err><b>Verify your email to finish signing in.</b> An account can be used only after its email address is confirmed.</Err>
        <CodeVerify email={email} onVerified={() => { setPending(null); router.push(dest); }} />
        <p style={{ margin: "16px 0 0" }} className="hint"><button type="button" onClick={() => setVerify(false)} style={{ border: 0, background: "none", padding: 0, fontFamily: "inherit", fontSize: "12.5px", fontWeight: 800, color: "var(--red-text)", cursor: "pointer" }}>Back to sign in</button></p>
      </div>
    );
  }
  return (
    <>
    <SocialSignIn mode="signin" next={next} />
    <form onSubmit={(e) => { e.preventDefault(); if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email) || pw.length < 8) setErr("Email or password is incorrect. After several failed attempts you will need to wait before trying again."); else if (getPending() === email.trim().toLowerCase()) setVerify(true); else router.push(dest); }} noValidate>
      {err && <Err>{err}</Err>}
      <div className="fld"><label htmlFor="l1">EMAIL</label><input id="l1" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@company.com" className="inp" autoComplete="email" /></div>
      <div style={{ marginBottom: "10px" }} className="fld">
        <label htmlFor="l2">PASSWORD</label>
        <div style={{ position: "relative" }}><input id="l2" type={show ? "text" : "password"} value={pw} onChange={(e) => setPw(e.target.value)} style={{ paddingRight: "58px" }} className="inp" autoComplete="current-password" /><button type="button" onClick={() => setShow((s) => !s)} style={{ position: "absolute", right: "6px", top: "5px", minHeight: "38px", padding: "0 12px", border: "0", background: "transparent", fontFamily: "inherit", fontSize: "12.5px", fontWeight: "800", color: "var(--slate)", cursor: "pointer" }}>{show ? "Hide" : "Show"}</button></div>
      </div>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: "12px", marginBottom: "20px", flexWrap: "wrap" }}>
        <label style={{ display: "flex", alignItems: "center", gap: "9px", fontSize: "13.5px", fontWeight: "500", cursor: "pointer" }}><input type="checkbox" defaultChecked style={{ width: "18px", height: "18px", accentColor: "var(--red)" }} />Keep me signed in</label>
        <Link href="/signin/?mode=reset" style={{ fontSize: "13.5px", fontWeight: "800", color: "var(--red-text)" }}>Forgot password?</Link>
      </div>
      <button type="submit" style={{ marginBottom: "14px" }} className="btn">{next ? "Sign in and continue" : "Sign in"}</button>
      <p style={{ margin: "0", textAlign: "center" }} className="hint">No account yet? <Link href="/register/" style={{ color: "var(--red-text)", fontWeight: "800" }}>Register free</Link></p>
      <p style={{ margin: "10px 0 0", textAlign: "center" }} className="hint"><Link href="/account/" style={{ color: "var(--slate)", textDecoration: "underline" }}>Preview the account area</Link> — sample data, no sign-in needed yet</p>
    </form>
    </>
  );
}

/* Auth-Q ② Register → ③ Check your email. */
export function RegisterForm({ claim }: { claim?: string }) {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [pw, setPw] = useState("");
  const [terms, setTerms] = useState(false);
  const [brief, setBrief] = useState(false);
  const [sent, setSent] = useState(false);
  const [tried, setTried] = useState(false);
  const domain = email.split("@")[1]?.toLowerCase();
  const valid = /^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email);
  const disposable = !!domain && DISPOSABLE.includes(domain);
  const strength = [pw.length >= 8, /[a-zA-Z]/.test(pw) && /\d/.test(pw), pw.length >= 12, /[^a-zA-Z0-9]/.test(pw)].filter(Boolean).length;
  const router = useRouter();
  if (sent) {
    return (
      <div style={{ display: "flex", flexDirection: "column", minHeight: "330px" }}>
        <div style={{ fontSize: "11px", fontWeight: 800, letterSpacing: ".1em", color: "var(--grey)", marginBottom: "10px" }}>STEP 2 OF 2 · VERIFY YOUR EMAIL</div>
        <h2 style={{ margin: "0 0 8px", fontSize: "25px" }} className="h">Check your email</h2>
        <CodeVerify email={email} onVerified={() => { setPending(null); router.push(claim ? `/directory/${claim}/` : "/account/"); }} />
        <div style={{ marginTop: "16px" }}><Err><b>Until verified:</b> you cannot sign in, submit, comment, save items, contact companies or claim a profile. Reading is unaffected. Unverified accounts are removed after five days.</Err></div>
        <div style={{ marginTop: "auto", display: "flex", gap: "10px", flexWrap: "wrap", alignItems: "center" }}>
          <button type="button" onClick={() => { setPending(null); setSent(false); }} style={{ fontSize: "13.5px", fontWeight: "800", color: "var(--red-text)", border: 0, background: "transparent", cursor: "pointer", fontFamily: "inherit", padding: 0 }}>Use a different email</button>
          <Link href="/signin/" className="hint" style={{ marginLeft: "auto", textDecoration: "underline" }}>Verify later — sign in asks for the code</Link>
        </div>
      </div>
    );
  }
  return (
    <form onSubmit={(e) => { e.preventDefault(); setTried(true); if (valid && !disposable && name.trim() && strength >= 2 && terms) { setPending(email.trim().toLowerCase()); setSent(true); } }} noValidate>
      <h2 style={{ margin: "0 0 6px", fontSize: "28px" }} className="h">{claim ? "Create an account to claim your profile" : "Create an account"}</h2>
      <p style={{ margin: "0 0 20px" }} className="hint">Use Google or Microsoft, or an email and password. Your email is never shown publicly.</p>
      <SocialSignIn mode="register" next={claim ? `/directory/${claim}/` : undefined} />
      <div style={{ marginBottom: "10px" }} className="fld"><label htmlFor="r1">EMAIL *</label><input id="r1" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@company.com" style={valid && !disposable ? { borderColor: "var(--up)" } : undefined} className="inp" autoComplete="email" />
        {valid && !disposable && <div style={{ display: "flex", alignItems: "center", gap: "7px", fontSize: "12px", fontWeight: "700", color: "var(--up)" }}><svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="m5 12.5 4.5 4.5L19 7.5" /></svg>This domain can receive mail; a 6-digit verification code goes here</div>}
      </div>
      {disposable && <Err><b>Disposable addresses cannot register.</b> Use an email you will keep: review outcomes, password resets and submission notices all go there and cannot be redirected later.</Err>}
      {tried && !valid && !disposable && <Err>Enter a valid email address.</Err>}
      <div className="fld"><label htmlFor="r2">DISPLAY NAME *</label><input id="r2" type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="Shown on comments and bylines" className="inp" autoComplete="nickname" /></div>
      <div style={{ marginBottom: "8px" }} className="fld"><label htmlFor="r3">PASSWORD *</label><input id="r3" type="password" value={pw} onChange={(e) => setPw(e.target.value)} className="inp" autoComplete="new-password" /></div>
      <div style={{ display: "flex", gap: "5px", marginBottom: "7px" }}>
        {[0, 1, 2, 3].map((i) => <span key={i} style={{ flex: "1 1 0", height: "4px", borderRadius: "2px", background: i < strength ? (strength >= 3 ? "var(--up)" : "var(--red)") : "var(--line)" }}></span>)}
      </div>
      <p style={{ margin: "0 0 20px" }} className="hint">At least 8 characters, with letters and numbers.</p>
      <div style={{ borderTop: "1px solid var(--line)", paddingTop: "18px", marginBottom: "18px" }}>
        <label style={{ display: "flex", gap: "10px", alignItems: "flex-start", fontSize: "13.5px", fontWeight: "500", lineHeight: "1.55", cursor: "pointer", marginBottom: "12px" }}><input type="checkbox" checked={terms} onChange={(e) => setTerms(e.target.checked)} style={{ width: "18px", height: "18px", accentColor: "var(--red)", flexShrink: "0", marginTop: "1px" }} /><span>I have read and agree to the <Link href="/policies/terms/" style={{ color: "var(--red-text)", fontWeight: "800", textDecoration: "underline" }}>Terms</Link> and the <Link href="/policies/privacy/" style={{ color: "var(--red-text)", fontWeight: "800", textDecoration: "underline" }}>Privacy Policy</Link>. *</span></label>
        <label style={{ display: "flex", gap: "10px", alignItems: "flex-start", fontSize: "13.5px", fontWeight: "500", lineHeight: "1.55", cursor: "pointer" }}><input type="checkbox" checked={brief} onChange={(e) => setBrief(e.target.checked)} style={{ width: "18px", height: "18px", accentColor: "var(--red)", flexShrink: "0", marginTop: "1px" }} /><span>Subscribe to the Weekly Brief. <b>Off by default</b> — registering is not subscribing, and you can unsubscribe at any time.</span></label>
      </div>
      {tried && !terms && <Err>You need to accept the Terms and Privacy Policy to create an account.</Err>}
      <button type="submit" style={{ marginBottom: "14px" }} className="btn">Create account</button>
      <p style={{ margin: "0", textAlign: "center" }} className="hint">Already have an account? <Link href="/signin/" style={{ color: "var(--red-text)", fontWeight: "800" }}>Sign in</Link></p>
    </form>
  );
}

/* Auth-Q ④ Reset password, step 1 (step 2 is reached from the email link). */
export function ResetForm() {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  return (
    <div>
      <div style={{ fontSize: "11px", fontWeight: "800", letterSpacing: ".1em", color: "var(--grey)", marginBottom: "12px" }}>STEP 1 OF 2</div>
      <h2 style={{ margin: "0 0 7px", fontSize: "24px" }} className="h">Reset your password</h2>
      <p style={{ margin: "0 0 16px" }} className="hint">Enter the email you registered with and we will send a reset link. Step 2 opens from that email.</p>
      {sent ? <div className="ok"><svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="var(--up)" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" style={{ flexShrink: 0, marginTop: "2px" }}><path d="m5 12.5 4.5 4.5L19 7.5" /></svg><span>If an account exists for <b>{email}</b>, a reset link is on its way. It is valid for one hour.</span></div> : (
        <form onSubmit={(e) => { e.preventDefault(); if (/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) setSent(true); }} noValidate>
          <div className="fld"><label htmlFor="p1">EMAIL</label><input id="p1" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@company.com" className="inp" /></div>
          <button type="submit" style={{ minHeight: "46px", fontSize: "14px" }} className="btn">Send reset link</button>
        </form>
      )}
      <p style={{ margin: "14px 0 0", textAlign: "center" }} className="hint"><Link href="/signin/" style={{ color: "var(--red-text)", fontWeight: "800" }}>Back to sign in</Link></p>
    </div>
  );
}
