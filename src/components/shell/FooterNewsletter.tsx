"use client";

import { useState } from "react";

/** Canvas footer newsletter row (input + red button), with the double-opt-in confirmation message. */
export function FooterNewsletter() {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  if (sent) return <div style={{ flex: "1 1 380px", maxWidth: "480px", fontSize: "13.5px", fontWeight: 700, color: "#FFFFFF" }}>Check your inbox and confirm the link — nothing is sent until you do.</div>;
  return (
    <form onSubmit={(e) => { e.preventDefault(); if (/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) setSent(true); }} style={{ display: "flex", gap: "10px", alignItems: "center", flex: "1 1 380px", maxWidth: "480px" }} noValidate>
      <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@company.com" aria-label="Email address" style={{ flex: "1 1 auto", minWidth: "0", minHeight: "50px", borderRadius: "999px", border: "0", padding: "0 20px", fontSize: "15px", fontFamily: "inherit", fontWeight: "500" }} />
      <button type="submit" style={{ minHeight: "50px", border: "0", borderRadius: "999px", background: "var(--red)", color: "#FFFFFF", fontWeight: "800", fontSize: "15px", fontFamily: "inherit", padding: "0 26px", cursor: "pointer", flexShrink: "0" }}>Subscribe</button>
    </form>
  );
}
