"use client";

/* Ported 1:1 from canvas board Auth-Q: sign in (①), register (②/③), reset (④). The sign-in-required interstitial (⑤) reuses the same card with a "next" target. */
import Link from "next/link";
import { useFlatParams } from "@/lib/use-flat-params";
import { SignInForm, RegisterForm, ResetForm } from "./AuthForms";
import "@/styles/board-login.css";

/* Sign-in and register pages are static; ?mode=, ?next= and ?claim= are read in the browser.
   next is checked by safeNext where it is used; claim must be a known directory slug. */
export function AuthFromUrl({ page, companySlugs }: { page: "signin" | "register"; companySlugs?: string[] }) {
  const sp = useFlatParams<{ mode?: string; next?: string; claim?: string; error?: string }>();
  if (page === "register") return <AuthBoard mode="register" claim={sp.claim && companySlugs?.includes(sp.claim) ? sp.claim : undefined} />;
  return <AuthBoard mode={sp.mode === "reset" ? "reset" : "signin"} next={sp.next} error={sp.error} />;
}

export function AuthBoard({ mode, next, claim, error }: { mode: "signin" | "register" | "reset"; next?: string; claim?: string; error?: string }) {
  return (
    <>
<section style={{ paddingTop: "40px", paddingBottom: "56px" }} className="wrap">
<div style={{ maxWidth: "860px", margin: "0 auto" }}>
{next && (
<div style={{ marginBottom: "16px" }}><span style={{ background: "var(--ink)", color: "var(--on-ink)", fontSize: "10.5px", fontWeight: "800", letterSpacing: ".14em", padding: "5px 11px", borderRadius: "5px", display: "inline-block" }}>SIGN IN REQUIRED</span><p className="hint" style={{ margin: "10px 0 0", fontSize: "14px" }}>Submissions, comments and saved items are tied to an account so you can keep drafts and see review outcomes. You will return to the page you came from.</p></div>
)}
<div style={{ display: "grid", gridTemplateColumns: "1fr 230px", minHeight: "560px" }} className="frame">
<div style={{ padding: "30px 32px" }}>
<div style={{ display: "flex", alignItems: "center", gap: "9px", marginBottom: "22px" }}>
<svg width="32" height="32" viewBox="0 0 120 120" aria-hidden="true"><use href="#w1" width="120" height="120" /></svg>
<span style={{ fontSize: "20px", letterSpacing: "-.05em" }} className="h">wire mesh</span>
<span style={{ background: "var(--red)", color: "#FFFFFF", fontSize: "20px", letterSpacing: "-.05em", padding: "2px 7px 4px", borderRadius: "6px" }} className="h">news</span>
</div>
{mode === "signin" && (<>
<h1 style={{ margin: "0 0 6px", fontSize: "28px" }} className="h">Sign in or create an account</h1>
<p style={{ margin: "0 0 20px" }} className="hint">One click with Google or Microsoft, or a code by email. No password to remember.</p>
<SignInForm next={next} error={error} />
</>)}
{mode === "register" && <RegisterForm claim={claim} />}
{mode === "reset" && <ResetForm />}
</div>
<div className="sidepanel" style={{ background: "var(--surface-dark)", color: "#FFFFFF", padding: "30px 24px", display: "flex", flexDirection: "column", justifyContent: "center", gap: "16px", position: "relative", overflow: "hidden" }}>
<svg width="260" height="260" viewBox="0 0 120 120" style={{ position: "absolute", right: "-90px", bottom: "-80px", color: "var(--mesh-dark)" }} aria-hidden="true"><use href="#w2" width="120" height="120" /></svg>
<div style={{ position: "relative" }}>
<div style={{ fontSize: "11.5px", fontWeight: "800", letterSpacing: ".12em", color: "var(--grey-2)", marginBottom: "14px" }}>{next ? "HOW SUBMISSION WORKS" : "WITH AN ACCOUNT"}</div>
{next ? (
<div style={{ display: "flex", flexDirection: "column" }}>
{[["Sign in", "Google, Microsoft or an email code; the first sign-in creates your account."], ["Write and save drafts", "Drafts are private to you and can be previewed any time."], ["Submit for review", "The body is locked once submitted; you can withdraw it to a draft."], ["Editorial feedback", "Approved, returned or declined — see it in your account and notifications."]].map(([b, s], i) => (
<div key={b} className="step" style={{ borderColor: "var(--line-dark)", ...(i === 3 ? { borderBottom: 0 } : {}) }}><span className="sn" style={{ background: "var(--red)" }}>{i + 1}</span><div><b style={{ color: "#FFFFFF" }}>{b}</b><span style={{ fontSize: "12px", color: "var(--grey-3)", fontWeight: 500 }}>{s}</span></div></div>
))}
</div>
) : (
<div style={{ display: "flex", flexDirection: "column", gap: "13px", fontSize: "13.5px", fontWeight: "500", lineHeight: "1.5" }}>
{["Submit articles and track review status", "Comment under articles", "Save articles and companies", "Manage subscription preferences"].map((t) => <div key={t} style={{ display: "flex", gap: "10px" }}><span style={{ color: "var(--red-text)", fontWeight: "800" }}>&#183;</span><span>{t}</span></div>)}
</div>
)}
<p style={{ margin: "18px 0 0", fontSize: "12.5px", fontWeight: "500", lineHeight: "1.6", color: "var(--grey-5)" }}>Reading articles does not need an account.</p>
{next && <Link href="/policies/submission-guidelines/" style={{ display: "inline-block", marginTop: "12px", fontSize: "12.5px", fontWeight: "800", letterSpacing: ".06em", color: "#FF4A54" }}>SUBMISSION GUIDELINES &#8594;</Link>}
</div>
</div>
</div>
</div>
</section>
    </>
  );
}
