"use client";

/* Shared by every newsletter box. Preview: shows the confirmation message only. Live: sends
   the double opt-in email through /api/newsletter. */
import { useState } from "react";
import { AUTH_LIVE } from "@/lib/live";

const EMAIL = /^[^@\s]+@[^@\s]+\.[^@\s]+$/;

export function useSubscribe(source: string, lists: string[] = ["brief"]) {
  const [sent, setSent] = useState(false);
  const [err, setErr] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  /* Server-side check found a likely typo ("gmial.com"): offer the corrected address. */
  const [suggestion, setSuggestion] = useState<string | null>(null);
  const submit = async (email: string) => {
    setErr(null); setSuggestion(null);
    if (!EMAIL.test(email.trim())) { setErr("Enter a valid email address."); return; }
    if (!AUTH_LIVE) { setSent(true); return; }
    setBusy(true);
    const r = await fetch("/api/newsletter/", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ email: email.trim(), source, lists }) }).catch(() => null);
    setBusy(false);
    if (!r) { setErr("Check your connection and try again."); return; }
    if (r.ok) { setSent(true); return; }
    const j = (await r.json().catch(() => ({}))) as { error?: string; suggestion?: string };
    setErr(j.error ?? "Something went wrong. Try again.");
    setSuggestion(j.suggestion ?? null);
  };
  return { sent, err, busy, submit, suggestion };
}
