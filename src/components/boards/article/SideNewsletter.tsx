"use client";

import { useState } from "react";
import { useSubscribe } from "@/lib/subscribe";

/* Article-C sidebar "The Monday brief" dark card. */
export function SideNewsletter() {
  const [email, setEmail] = useState("");
  const { sent, err, busy, submit } = useSubscribe("article-side");
  return (
    <div style={{ position: "relative", overflow: "hidden", background: "var(--surface-dark)", color: "#FFFFFF", borderRadius: "14px", padding: "22px" }}>
<svg style={{ position: "absolute", right: "-20px", bottom: "-20px", width: "180px", height: "160px" }} aria-hidden="true"><g color="#FFFFFF" opacity=".16"><rect width="180" height="160" fill="url(#pWoven)" /></g></svg>
<div style={{ position: "relative" }}>
<div style={{ fontSize: "20px", marginBottom: "8px" }} className="h">The Monday brief</div>
<p style={{ margin: "0 0 14px", fontSize: "13px", fontWeight: "500", lineHeight: "1.6", color: "#C4C7D2" }}>One email a week: prices, standards, projects. No supplier pitches.</p>
{sent ? <p style={{ margin: 0, fontSize: "13px", fontWeight: 700 }}>Check your inbox and confirm the link.</p> : (
<form onSubmit={(e) => { e.preventDefault(); void submit(email); }} noValidate>
<input type="email" value={email} onChange={(e) => setEmail(e.target.value)} aria-label="Email address" placeholder="you@company.com" style={{ width: "100%", boxSizing: "border-box", minHeight: "42px", border: "1px solid rgba(255,255,255,.22)", background: "rgba(255,255,255,.07)", borderRadius: "8px", padding: "0 13px", fontFamily: "inherit", fontSize: "13.5px", fontWeight: "600", color: "#FFFFFF", marginBottom: "9px" }} />
<button type="submit" style={{ width: "100%", minHeight: "42px", border: "0", borderRadius: "8px", background: "var(--red)", color: "#FFFFFF", fontFamily: "inherit", fontSize: "14px", fontWeight: "800", cursor: "pointer" }} disabled={busy}>Subscribe free</button>
{err && <p role="alert" style={{ margin: "8px 0 0", fontSize: "12.5px", fontWeight: 800, color: "#FFFFFF", flexBasis: "100%" }}>{err}</p>}
</form>
)}
</div>
    </div>
  );
}
