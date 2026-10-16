"use client";

/* Sign in = create account. There are no passwords: Google or Microsoft in one click, or a
   6-digit code sent to the email address. The first sign-in creates the account; new
   accounts land on their profile to add a name. Preview mode (accounts not live) runs the
   same steps with stand-ins and continues into the sample account. */
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { safeNext } from "@/lib/safe-redirect";
import { SocialSignIn } from "./SocialSignIn";
import { CodeVerify } from "@/components/ui/CodeVerify";
import { Turnstile } from "@/components/ui/Turnstile";
import { AUTH_LIVE, ONE_TAP_ID } from "@/lib/live";
import { authClient } from "@/lib/auth-client";
import { useMe } from "@/lib/me-client";

const DISPOSABLE = ["mailinator.com", "10minutemail.com", "guerrillamail.com", "tempmail.com", "yopmail.com", "trashmail.com"];
const EMAIL = /^[^@\s]+@[^@\s]+\.[^@\s]+$/;
const Err = ({ children }: { children: React.ReactNode }) => (
  <div style={{ marginBottom: "16px" }} className="err" role="alert"><svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="var(--red-text)" strokeWidth="2.3" strokeLinecap="round" aria-hidden="true" style={{ flexShrink: "0", marginTop: "2px" }}><circle cx="12" cy="12" r="9" /><path d="M12 7.5v5M12 16.2v.01" /></svg><span>{children}</span></div>
);

const ERRORS: Record<string, string> = {
  social: "That sign-in did not finish. Try again, or use an email code.",
  account_not_linked: "This email already has an account with another sign-in method. Sign in with an email code once; Google and Microsoft are linked automatically after that.",
};

function errText(e: { message?: string; status?: number } | null | undefined) {
  if (!e) return "Something went wrong. Try again.";
  if (e.status === 429) return "Too many tries. Wait a minute, then try again.";
  if (/invalid otp|invalid code/i.test(e.message ?? "")) return "That code is not right. Check the latest email we sent.";
  if (/expired/i.test(e.message ?? "")) return "That code has expired. Send a new one.";
  if (/too many attempts/i.test(e.message ?? "")) return "Too many wrong codes. Send a new one.";
  if (/captcha/i.test(e.message ?? "")) return "Please complete the check above and try again.";
  return e.message || "Something went wrong. Try again.";
}

function GoogleOneTap({ dest }: { dest: string }) {
  const started = useRef(false);
  useEffect(() => {
    if (!AUTH_LIVE || !ONE_TAP_ID || started.current) return;
    started.current = true;
    /* Shows Google's "Continue as …" card for people already signed in to Google. */
    void (authClient as unknown as { oneTap?: (o: { callbackURL: string }) => Promise<unknown> }).oneTap?.({ callbackURL: dest }).catch(() => {});
  }, [dest]);
  return null;
}

export function SignInForm({ next, claim, error }: { next?: string; claim?: string; error?: string }) {
  const router = useRouter();
  const dest = claim ? `/account/?claim=${encodeURIComponent(claim)}#company` : safeNext(next);
  const [email, setEmail] = useState("");
  const [step, setStep] = useState<"email" | "code">("email");
  const [err, setErr] = useState<string | null>(error ? ERRORS[error] ?? ERRORS.social : null);
  const [busy, setBusy] = useState(false);
  const [captcha, setCaptcha] = useState<string | null>(null);
  const domain = email.split("@")[1]?.toLowerCase();
  const valid = EMAIL.test(email.trim());
  const disposable = !!domain && DISPOSABLE.includes(domain);
  /* Already signed in (live): go straight on. */
  const me = useMe();
  useEffect(() => { if (AUTH_LIVE && me?.signedIn) window.location.replace(dest); }, [me, dest]);

  const send = async (): Promise<string | void> => {
    const res = await authClient.emailOtp.sendVerificationOtp({ email: email.trim().toLowerCase(), type: "sign-in" }, captcha ? { headers: { "x-captcha-response": captcha } } : undefined).catch(() => null);
    if (!res || res.error) return errText(res?.error);
  };
  const start = async () => {
    if (!valid) { setErr("Enter a valid email address."); return; }
    if (disposable) { setErr("Disposable addresses cannot be used. Use an email you will keep: review results and notices go there."); return; }
    setErr(null);
    if (!AUTH_LIVE) { setStep("code"); return; }
    setBusy(true);
    const e = await send();
    setBusy(false);
    if (e) setErr(e); else setStep("code");
  };
  const finish = () => {
    /* A full load, so every part of the page picks up the new session. */
    if (AUTH_LIVE) window.location.assign(dest); else router.push(dest);
  };

  if (step === "code") {
    return (
      <div>
        <div style={{ fontSize: "11px", fontWeight: 800, letterSpacing: ".1em", color: "var(--grey)", marginBottom: "10px" }}>CHECK YOUR EMAIL</div>
        <CodeVerify email={email.trim()} purpose="sign in" onVerified={finish}
          live={AUTH_LIVE ? {
            alreadySent: true,
            send,
            verify: async (otp) => {
              const res = await authClient.signIn.emailOtp({ email: email.trim().toLowerCase(), otp }).catch(() => null);
              if (!res || res.error) return errText(res?.error);
            },
          } : undefined} />
        <p style={{ margin: "16px 0 0" }} className="hint"><button type="button" onClick={() => { setStep("email"); setErr(null); }} style={{ border: 0, background: "none", padding: 0, fontFamily: "inherit", fontSize: "12.5px", fontWeight: 800, color: "var(--red-text)", cursor: "pointer" }}>Use a different email</button></p>
      </div>
    );
  }

  return (
    <>
      <GoogleOneTap dest={dest} />
      <SocialSignIn mode={claim ? "register" : "signin"} next={dest} />
      <form onSubmit={(e) => { e.preventDefault(); void start(); }} noValidate>
        {err && <Err>{err}</Err>}
        <div className="fld"><label htmlFor="l1">EMAIL</label><input id="l1" type="email" value={email} onChange={(e) => { setEmail(e.target.value); setErr(null); }} placeholder="you@company.com" className="inp" autoComplete="email" inputMode="email" /></div>
        {AUTH_LIVE && <Turnstile onToken={setCaptcha} />}
        <button type="submit" disabled={busy} style={{ marginBottom: "14px" }} className="btn">{busy ? "Sending…" : "Email me a sign-in code"}</button>
        <p style={{ margin: "0 0 10px", textAlign: "center" }} className="hint">No password needed. New here? The same code creates your free account.</p>
        <p style={{ margin: 0, textAlign: "center", fontSize: "12px" }} className="hint">By continuing you agree to the <Link href="/policies/terms/" style={{ color: "var(--red-text)", fontWeight: 800 }}>Terms</Link> and the <Link href="/policies/privacy/" style={{ color: "var(--red-text)", fontWeight: 800 }}>Privacy Policy</Link>.</p>
        {!AUTH_LIVE && <p style={{ margin: "10px 0 0", textAlign: "center" }} className="hint"><Link href="/account/" style={{ color: "var(--slate)", textDecoration: "underline" }}>Preview the account area</Link> — sample data, no sign-in needed yet</p>}
      </form>
    </>
  );
}

/* Kept for the /register/ route (claim links point there): the same form, with a claim heading. */
export function RegisterForm({ claim }: { claim?: string }) {
  return (
    <>
      <h1 style={{ margin: "0 0 6px", fontSize: "28px" }} className="h">{claim ? "Sign in to claim your profile" : "Create your free account"}</h1>
      <p style={{ margin: "0 0 20px" }} className="hint">{claim ? "After signing in you confirm a work email at the company's domain; the directory editor approves the claim." : "One click with Google or Microsoft, or a code by email. Your email is never shown publicly."}</p>
      <SignInForm claim={claim} />
    </>
  );
}

/* Passwords no longer exist; old reset links land here. */
export function ResetForm() {
  return (
    <>
      <h1 style={{ margin: "0 0 6px", fontSize: "26px" }} className="h">No password needed</h1>
      <p style={{ margin: "0 0 20px" }} className="hint">Wire Mesh News signs you in with Google, Microsoft or a one-time code sent to your email.</p>
      <SignInForm />
    </>
  );
}
