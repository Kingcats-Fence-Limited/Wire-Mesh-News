"use client";

import { useState } from "react";

/* Account-G settings panel: email preferences are opt-in and stored per account (local state in the preview). */
export function AccountSettings() {
  const [brief, setBrief] = useState(true);
  const [review, setReview] = useState(true);
  return (
    <div className="mini" id="settings">
      <div className="minihd"><span style={{ fontSize: "17px" }} className="h">Account settings</span></div>
      <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
        <div><div style={{ fontSize: "11.5px", fontWeight: "800", letterSpacing: ".1em", color: "var(--slate)", marginBottom: "7px" }}>PROFILE</div><div style={{ fontSize: "13.5px", fontWeight: "500", lineHeight: "1.7" }}>Display name · Avatar · Bio · Company · Job title<br /><span className="meta">Your email address is never shown publicly.</span></div></div>
        <div style={{ borderTop: "1px solid var(--line)", paddingTop: "13px" }}>
          <div style={{ fontSize: "11.5px", fontWeight: "800", letterSpacing: ".1em", color: "var(--slate)", marginBottom: "9px" }}>EMAIL PREFERENCES</div>
          <label style={{ display: "flex", alignItems: "center", gap: "10px", fontSize: "13.5px", fontWeight: "500", marginBottom: "8px", cursor: "pointer" }}><input type="checkbox" checked={brief} onChange={(e) => setBrief(e.target.checked)} style={{ width: "18px", height: "18px", accentColor: "var(--red)" }} /> Weekly brief</label>
          <label style={{ display: "flex", alignItems: "center", gap: "10px", fontSize: "13.5px", fontWeight: "500", cursor: "pointer" }}><input type="checkbox" checked={review} onChange={(e) => setReview(e.target.checked)} style={{ width: "18px", height: "18px", accentColor: "var(--red)" }} /> Email me review results</label>
          <p style={{ margin: "8px 0 0", lineHeight: "1.55" }} className="meta">Subscriptions are chosen separately; registering does not switch them on.</p>
        </div>
        <div style={{ borderTop: "1px solid var(--line)", paddingTop: "13px", display: "flex", gap: "9px", flexWrap: "wrap" }}><button type="button" className="btn">Change password</button><button type="button" style={{ color: "var(--red-deep)", borderColor: "var(--st-red-bg)" }} className="btn">Deactivate account</button></div>
      </div>
    </div>
  );
}
