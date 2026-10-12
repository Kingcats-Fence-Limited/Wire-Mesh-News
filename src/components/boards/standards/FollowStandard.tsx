"use client";

import { useEffect, useState } from "react";

/* Standards-Y "Follow this standard": device-only in Phase 1; one email per confirmed change once accounts exist. */
export function FollowStandard({ id, count }: { id: string; count: number }) {
  const key = `wmn-follow-${id}`;
  const [on, setOn] = useState(false);
  const [note, setNote] = useState(false);
  useEffect(() => { try { setOn(localStorage.getItem(key) === "1"); } catch {} }, [key]);
  const toggle = () => { const n = !on; setOn(n); setNote(n); try { localStorage.setItem(key, n ? "1" : "0"); } catch {} };
  return (
    <>
      <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
        <button type="button" aria-pressed={on} onClick={toggle} className={`follow${on ? " on" : ""}`}><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={on ? "#FFFFFF" : "var(--red)"} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M6 9a6 6 0 0 1 12 0v4.5l1.6 2.6H4.4L6 13.5z" /><path d="M10 19.5a2 2 0 0 0 4 0" /></svg>{on ? "Following" : "Follow this standard"}</button>
      </div>
      <span style={{ fontSize: "10.5px", fontWeight: "700", color: "var(--grey-5)" }} className="mono"><b style={{ color: "var(--line-2)" }}>{count + (on ? 1 : 0)} following</b> · sign in to follow · one email per confirmed change · the buy link goes to the publisher</span>
      {note && <span role="status" style={{ fontSize: "11.5px", fontWeight: 500, lineHeight: 1.5, color: "var(--line-2)", maxWidth: "320px", textAlign: "right" }}>You will get one email when an editor confirms a status change, new edition or withdrawal — never on detection. Unsubscribe in one click.</span>}
    </>
  );
}
