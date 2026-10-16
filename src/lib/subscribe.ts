"use client";

/* Shared by every newsletter box. Preview: shows the confirmation message only. Live: sends
   the double opt-in email through /api/newsletter. */
import { useState } from "react";
import { AUTH_LIVE } from "@/lib/live";
import { postJson } from "@/lib/me-client";

const EMAIL = /^[^@\s]+@[^@\s]+\.[^@\s]+$/;

export function useSubscribe(source: string, lists: string[] = ["brief"]) {
  const [sent, setSent] = useState(false);
  const [err, setErr] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const submit = async (email: string) => {
    setErr(null);
    if (!EMAIL.test(email.trim())) { setErr("Enter a valid email address."); return; }
    if (!AUTH_LIVE) { setSent(true); return; }
    setBusy(true);
    const e = await postJson("/api/newsletter/", { email: email.trim(), source, lists });
    setBusy(false);
    if (e) setErr(e); else setSent(true);
  };
  return { sent, err, busy, submit };
}
