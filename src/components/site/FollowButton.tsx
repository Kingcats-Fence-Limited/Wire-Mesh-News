"use client";

import { useEffect, useState } from "react";
import { clsx } from "clsx";

/**
 * "Follow this standard" (Standards-Y). Phase 1: remembers the choice on
 * this device only and explains the real behaviour (sign-in, one email per
 * confirmed change, one-click unsubscribe).
 */
export function FollowButton({ id, count, label = "Follow this standard" }: { id: string; count: number; label?: string }) {
  const key = `wmn-follow-${id}`;
  const [on, setOn] = useState(false);
  const [note, setNote] = useState(false);
  useEffect(() => {
    try {
      setOn(localStorage.getItem(key) === "1");
    } catch {
      /* ignore */
    }
  }, [key]);
  function toggle() {
    const next = !on;
    setOn(next);
    setNote(next);
    try {
      localStorage.setItem(key, next ? "1" : "0");
    } catch {
      /* ignore */
    }
  }
  return (
    <span className="relative inline-flex flex-col">
      <button type="button" aria-pressed={on} onClick={toggle} className={clsx("inline-flex min-h-[46px] items-center gap-2 rounded-full px-5 text-[14px] font-extrabold transition-colors", on ? "bg-red text-white" : "bg-white text-ink hover:bg-paper")}>
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={on ? "#fff" : "#E5242F"} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M6 9a6 6 0 0 1 12 0v4.5l1.6 2.6H4.4L6 13.5z" /><path d="M10 19.5a2 2 0 0 0 4 0" /></svg>
        {on ? "Following" : label}
        <span className="num text-[11px] font-bold opacity-70">{count + (on ? 1 : 0)}</span>
      </button>
      {note && <span role="status" className="absolute top-full mt-2 w-64 rounded-lg border border-line bg-bg p-2.5 text-[11.5px] font-medium leading-[1.5] text-fg shadow-lg">You’ll get one email when an editor confirms a status change, new edition or withdrawal — never on detection. Unsubscribe in one click.</span>}
    </span>
  );
}
