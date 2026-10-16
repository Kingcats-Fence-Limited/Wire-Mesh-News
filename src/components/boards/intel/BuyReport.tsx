"use client";

/* "Buy this report" → Stripe Checkout (sign in first). */
import Link from "next/link";
import { useState } from "react";
import { BILLING_LIVE } from "@/lib/live";
import { useMe } from "@/lib/me-client";

export function BuyReport({ slug, price, soon }: { slug: string; price: number; soon?: boolean }) {
  const me = useMe();
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState<string | null>(null);
  if (soon || !BILLING_LIVE) return <button type="button" className="ibtn dark" disabled>{soon ? "Coming soon" : "Opens soon"}</button>;
  const buy = async () => {
    if (!me?.signedIn) { location.assign(`/signin/?next=${encodeURIComponent(location.pathname)}`); return; }
    setBusy(true); setErr(null);
    const r = await fetch("/api/billing/report/", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ slug }) }).catch(() => null);
    const j = (await r?.json().catch(() => ({}))) as { url?: string; error?: string; owned?: boolean } | undefined;
    if (r?.ok && j?.url) { location.assign(j.url); return; }
    setBusy(false); setErr(j?.error ?? "Could not open checkout. Try again.");
  };
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "6px", alignItems: "flex-start" }}>
      <button type="button" className="ibtn red" disabled={busy} onClick={() => void buy()}>{busy ? "Opening secure checkout…" : `Buy for US$${price}`}</button>
      {err && <span role="alert" style={{ fontSize: "12.5px", fontWeight: 700, color: "var(--red-text)" }}>{err} {/already own/.test(err) && <Link href="/account/#billing" className="lnk">Download</Link>}</span>}
    </div>
  );
}
