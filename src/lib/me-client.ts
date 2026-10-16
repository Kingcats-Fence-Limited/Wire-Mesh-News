"use client";

/* Public pages ask once per page load who the visitor is (live accounts only). Pages stay
   static and cached; this small request fills in Save / Following / the comment box. */
import { useEffect, useState } from "react";
import { AUTH_LIVE } from "@/lib/live";

export type MeSummary = { signedIn: boolean; name?: string; initials?: string; plan?: "free" | "pro" | "team" | "company"; pro?: boolean; company?: boolean; bookmarks?: { id: string; href: string }[]; follows?: { id: string; slug: string }[] };

let cached: Promise<MeSummary> | null = null;
const subs = new Set<(m: MeSummary) => void>();
let latest: MeSummary | null = null;

export function loadMe(force = false): Promise<MeSummary> {
  if (!AUTH_LIVE) return Promise.resolve({ signedIn: false });
  if (!cached || force) {
    cached = fetch("/api/me/summary/", { credentials: "same-origin" }).then((r) => (r.ok ? r.json() : { signedIn: false })).catch(() => ({ signedIn: false }));
    cached.then((m) => {
      latest = m; subs.forEach((f) => f(m));
      /* Paying readers: hide advertising now (the cookie covers later visits before paint). */
      document.documentElement.classList.toggle("adfree", !!m.pro);
    });
  }
  return cached;
}

/** null while loading (live), then the summary. In preview mode: always signed out. */
export function useMe(): MeSummary | null {
  const [m, setM] = useState<MeSummary | null>(AUTH_LIVE ? latest : { signedIn: false });
  useEffect(() => {
    if (!AUTH_LIVE) return;
    subs.add(setM);
    void loadMe().then(setM);
    return () => { subs.delete(setM); };
  }, []);
  return m;
}

/** Update the cached summary after a change on this page (Save, Follow). */
export function patchMe(fn: (m: MeSummary) => MeSummary) {
  if (!latest) return;
  latest = fn(latest);
  cached = Promise.resolve(latest);
  subs.forEach((f) => f(latest!));
}

/** One account change from a public page, through the same rules as the account centre. */
export async function sendChange(change: { coll: string; op: "create" | "delete"; id?: string; data?: Record<string, unknown> }): Promise<string | null> {
  const r = await fetch("/api/me/sync/", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ changes: [change] }) }).catch(() => null);
  if (!r) return "Check your connection and try again.";
  if (r.status === 401) return "Sign in again.";
  const j = (await r.json().catch(() => ({}))) as { errors?: string[]; error?: string };
  return j.error ?? j.errors?.[0] ?? (r.ok ? null : "Something went wrong. Try again.");
}

export const signInHref = () => `/signin/?next=${encodeURIComponent(location.pathname + location.search + location.hash)}`;

export async function postJson(url: string, body: unknown): Promise<string | null> {
  const r = await fetch(url, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) }).catch(() => null);
  if (!r) return "Check your connection and try again.";
  if (r.ok) return null;
  if (r.status === 401) return "Sign in to continue.";
  return ((await r.json().catch(() => ({}))) as { error?: string }).error ?? "Something went wrong. Try again.";
}
