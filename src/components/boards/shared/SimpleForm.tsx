"use client";

import { useState, type ReactNode } from "react";
import { AUTH_LIVE } from "@/lib/live";
import { postJson, useMe } from "@/lib/me-client";
import { Turnstile } from "@/components/ui/Turnstile";

/* Generic board form: native required-field validation, then a success panel.
   Preview: nothing is sent. Live: the fields go to `send` as JSON — "contact" and "advertise"
   to /api/forms/contact (with the human check), "enquiry" to /api/me/enquiries (signed in).
   Attachments are not uploaded from public forms; the reply asks for files if needed. */
type Send = "contact" | "advertise" | "enquiry";
export function SimpleForm({ children, success, className, style, send, extra }: { children: ReactNode; success: ReactNode; className?: string; style?: React.CSSProperties; send?: Send; extra?: Record<string, string> }) {
  const [done, setDone] = useState(false);
  const [err, setErr] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [captcha, setCaptcha] = useState<string | null>(null);
  const [hadFile, setHadFile] = useState(false);
  const live = AUTH_LIVE && !!send;
  const me = useMe();
  if (done) return <div style={{ border: "2px solid var(--ink)", borderRadius: "16px", padding: "28px", background: "var(--card)" }}>{success}{hadFile && <p className="meta" style={{ margin: "12px 0 0" }}>The attached file was not sent: we will ask for it in our reply.</p>}</div>;

  const submit = async (form: HTMLFormElement) => {
    if (!form.reportValidity()) return;
    if (!live) { setDone(true); return; }
    if (send === "enquiry" && !me?.signedIn) { location.assign(`/signin/?next=${encodeURIComponent(location.pathname)}`); return; }
    const data: Record<string, string> = { ...extra, source: send! };
    let file = false;
    new FormData(form).forEach((v, k) => { if (typeof v === "string") data[k] = v; else if (v.size) file = true; });
    setBusy(true); setErr(null);
    const e = await postJson(send === "enquiry" ? "/api/me/enquiries/" : "/api/forms/contact/", { ...data, captcha });
    setBusy(false);
    if (e) { setErr(e); return; }
    setHadFile(file); setDone(true);
  };
  return (
    <form className={className} style={style} aria-busy={busy} onSubmit={(e) => { e.preventDefault(); if (!busy) void submit(e.currentTarget); }}>
      {/* Left empty by people; filled by bots. */}
      {live && <input type="text" name="website_url" tabIndex={-1} autoComplete="off" aria-hidden="true" style={{ position: "absolute", left: "-9999px", width: 1, height: 1 }} />}
      {children}
      {live && send !== "enquiry" && <div style={{ marginTop: "12px" }}><Turnstile onToken={setCaptcha} /></div>}
      {live && send === "enquiry" && me && !me.signedIn && <p className="meta" style={{ margin: "12px 0 0", fontWeight: 700 }}>You will be asked to sign in before the message is sent.</p>}
      {err && <p role="alert" style={{ margin: "12px 0 0", fontSize: "13.5px", fontWeight: 800, color: "var(--red-text)" }}>{err}</p>}
    </form>
  );
}
