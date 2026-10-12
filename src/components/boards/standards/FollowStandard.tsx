"use client";

import { useEffect, useState, type ReactNode } from "react";

/* Standards-Y "Follow this standard": device-only in Phase 1; one email per confirmed change once accounts exist. Layout stays fixed when toggled — the note appears below the row. */
export function FollowStandard({ id, count, buy }: { id: string; count: number; buy: ReactNode }) {
  const key = `wmn-follow-${id}`;
  const [on, setOn] = useState(false);
  const [note, setNote] = useState(false);
  useEffect(() => { try { setOn(localStorage.getItem(key) === "1"); } catch {} }, [key]);
  const toggle = () => { const n = !on; setOn(n); setNote(true); try { localStorage.setItem(key, n ? "1" : "0"); } catch {} };
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: "8px", maxWidth: "100%" }}>
      <div style={{ display: "flex", gap: "10px", flexWrap: "wrap", justifyContent: "flex-end" }}>
        <button type="button" aria-pressed={on} onClick={toggle} className={`follow${on ? " on" : ""}`} style={{ minWidth: "214px", justifyContent: "center" }}><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={on ? "#FFFFFF" : "var(--red)"} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M6 9a6 6 0 0 1 12 0v4.5l1.6 2.6H4.4L6 13.5z" /><path d="M10 19.5a2 2 0 0 0 4 0" /></svg>{on ? "Following" : "Follow this standard"}</button>
        {buy}
      </div>
      <span style={{ fontSize: "10.5px", fontWeight: "700", color: "var(--grey-5)", textAlign: "right" }} className="mono"><b style={{ color: "var(--on-dark-2)" }}>{count + (on ? 1 : 0)} following</b> · one email per confirmed change · the buy link goes to the publisher</span>
      <span role="status" aria-live="polite" style={{ fontSize: "11.5px", fontWeight: 500, lineHeight: 1.5, color: "var(--on-dark-2)", maxWidth: "340px", textAlign: "right", minHeight: "0" }}>
        {note && (on ? "Saved on this device. Once accounts open you will get one email when an editor confirms a status change, new edition or withdrawal — never on detection." : "No longer following this standard.")}
      </span>
    </div>
  );
}
