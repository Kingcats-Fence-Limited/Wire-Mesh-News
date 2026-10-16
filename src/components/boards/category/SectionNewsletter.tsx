"use client";

import { useState } from "react";
import { useSubscribe } from "@/lib/subscribe";

/* Category-B sidebar "Guides by email" red card form (section-only subscription). */
export function SectionNewsletter({ id, button = "ink", label = "EMAIL" }: { id: string; button?: "ink" | "red"; label?: string }) {
  const [email, setEmail] = useState("");
  const { sent, err, busy, submit } = useSubscribe(`section-${id}`);
  if (sent) return <p style={{ margin: 0, fontSize: "13.5px", fontWeight: 700 }}>Check your inbox and confirm the link.</p>;
  return (
    <form onSubmit={(e) => { e.preventDefault(); void submit(email); }} noValidate>
<label htmlFor={id} style={{ display: "block", fontSize: "11px", fontWeight: "800", letterSpacing: ".1em", marginBottom: "6px" }}>{label}</label>
<input id={id} type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@company.com" style={{ width: "100%", boxSizing: "border-box", minHeight: "46px", borderRadius: "10px", border: "0", padding: "0 14px", fontSize: "15px", fontFamily: "inherit", marginBottom: "10px" }} />
<button type="submit" style={{ width: "100%", minHeight: "46px", border: "0", borderRadius: "10px", background: button === "red" ? "var(--red)" : "var(--ink)", color: button === "red" ? "#FFFFFF" : "var(--on-ink)", fontWeight: "800", fontSize: "15px", fontFamily: "inherit", cursor: "pointer" }} disabled={busy}>Subscribe</button>
    {err && <p role="alert" style={{ margin: "8px 0 0", fontSize: "12.5px", fontWeight: 800, color: "inherit", flexBasis: "100%" }}>{err}</p>}
</form>
  );
}
