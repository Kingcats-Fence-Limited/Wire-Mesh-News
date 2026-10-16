"use client";

import { useState } from "react";
import { useSubscribe } from "@/lib/subscribe";

/* Canvas Home-A subscribe row (label + input + red button) with double-opt-in confirmation. */
export function SubscribeForm() {
  const [email, setEmail] = useState("");
  const { sent, err, busy, submit } = useSubscribe("home");
  if (sent) return <div style={{ fontSize: "14px", fontWeight: 700, color: "#FFFFFF", minHeight: "50px", display: "flex", alignItems: "center" }}>Check your inbox and confirm the link — nothing is sent until you do.</div>;
  return (
    <form onSubmit={(e) => { e.preventDefault(); void submit(email); }} noValidate style={{ display: "flex", gap: "10px", flexWrap: "wrap", alignItems: "flex-end", maxWidth: "560px" }}>
<div style={{ flex: "1 1 250px" }}>
<label htmlFor="nl" style={{ display: "block", fontSize: "11px", fontWeight: "800", letterSpacing: ".12em", marginBottom: "7px", color: "var(--grey-2)" }}>EMAIL ADDRESS</label>
<input id="nl" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@company.com" style={{ width: "100%", boxSizing: "border-box", minHeight: "50px", borderRadius: "999px", border: "0", padding: "0 20px", fontSize: "15px", fontFamily: "inherit", fontWeight: "500" }} />
</div>
<button type="submit" className="subbtn" style={{ minHeight: "50px", border: "0", borderRadius: "999px", background: "var(--red)", color: "#FFFFFF", fontWeight: "800", fontSize: "15px", fontFamily: "inherit", padding: "0 28px", cursor: "pointer" }} disabled={busy}>Subscribe</button>
    {err && <p role="alert" style={{ margin: "8px 0 0", fontSize: "12.5px", fontWeight: 800, color: "var(--red-text)", flexBasis: "100%" }}>{err}</p>}
</form>
  );
}
