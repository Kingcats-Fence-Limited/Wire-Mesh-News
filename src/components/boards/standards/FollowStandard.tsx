"use client";

import { useEffect, useState, type ReactNode } from "react";
import { AUTH_LIVE } from "@/lib/live";
import { useMe, patchMe, sendChange, signInHref } from "@/lib/me-client";

/* Standards-Y "Follow this standard". Preview: kept on this device. Live: saved to the
   account (sign-in first), one email per editor-confirmed change. Layout stays fixed when
   toggled — the note appears below the row. */
export function FollowStandard({ id, count, buy }: { id: string; count: number; buy: ReactNode }) {
  const key = `wmn-follow-${id}`;
  const me = useMe();
  const [local, setLocal] = useState(false);
  const [note, setNote] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  useEffect(() => { if (!AUTH_LIVE) try { setLocal(localStorage.getItem(key) === "1"); } catch {} }, [key]);
  const row = me?.follows?.find((f) => f.slug === id);
  const on = AUTH_LIVE ? !!row : local;
  const base = count - (AUTH_LIVE && row ? 1 : 0);

  const toggle = async () => {
    if (!AUTH_LIVE) {
      const n = !local; setLocal(n);
      setNote(n ? "Saved on this device. Once accounts open you will get one email when an editor confirms a status change, new edition or withdrawal — never on detection." : "No longer following this standard.");
      try { localStorage.setItem(key, n ? "1" : "0"); } catch {}
      return;
    }
    if (!me?.signedIn) { location.assign(signInHref()); return; }
    setBusy(true);
    const fid = row?.id ?? crypto.randomUUID();
    const e = await sendChange(row ? { coll: "follows", op: "delete", id: fid } : { coll: "follows", op: "create", id: fid, data: { slug: id } });
    setBusy(false);
    if (e) { setNote(e); return; }
    patchMe((m) => ({ ...m, follows: row ? (m.follows ?? []).filter((f) => f.id !== fid) : [...(m.follows ?? []), { id: fid, slug: id }] }));
    setNote(row ? "No longer following this standard." : "Following. You get one email when an editor confirms a status change, new edition or withdrawal. Manage it under Account settings.");
  };
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: "8px", maxWidth: "100%" }}>
      <div style={{ display: "flex", gap: "10px", flexWrap: "wrap", justifyContent: "flex-end" }}>
        <button type="button" aria-pressed={on} disabled={busy} onClick={() => void toggle()} className={`follow${on ? " on" : ""}`} style={{ minWidth: "214px", justifyContent: "center" }}><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={on ? "#FFFFFF" : "var(--red)"} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M6 9a6 6 0 0 1 12 0v4.5l1.6 2.6H4.4L6 13.5z" /><path d="M10 19.5a2 2 0 0 0 4 0" /></svg>{on ? "Following" : AUTH_LIVE && me && !me.signedIn ? "Sign in to follow" : "Follow this standard"}</button>
        {buy}
      </div>
      <span style={{ fontSize: "10.5px", fontWeight: "700", color: "var(--grey-5)", textAlign: "right" }} className="mono"><b style={{ color: "var(--on-dark-2)" }}>{base + (on ? 1 : 0)} following</b> · one email per confirmed change · the buy link goes to the publisher</span>
      <span role="status" aria-live="polite" style={{ fontSize: "11.5px", fontWeight: 500, lineHeight: 1.5, color: "var(--on-dark-2)", maxWidth: "340px", textAlign: "right", minHeight: "0" }}>{note}</span>
    </div>
  );
}
