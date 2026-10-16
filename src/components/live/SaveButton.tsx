"use client";

/* "Save" on articles and company pages. Preview: links to sign-in as before. Live: saves to
   the account's bookmarks (or asks to sign in first). */
import Link from "next/link";
import { useState } from "react";
import { AUTH_LIVE } from "@/lib/live";
import { useMe, patchMe, sendChange, signInHref } from "@/lib/me-client";

type Props = { href: string; title: string; kind: "article" | "company" | "standard" | "event"; meta?: string; className?: string; style?: React.CSSProperties; label?: string; savedLabel?: string; children?: React.ReactNode };

export function SaveButton({ href, title, kind, meta, className, style, label = "Save", savedLabel = "Saved", children }: Props) {
  const me = useMe();
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState<string | null>(null);
  if (!AUTH_LIVE || !me?.signedIn) {
    return <Link href="/signin/" className={className} style={style} onClick={(e) => { if (AUTH_LIVE) { e.preventDefault(); location.assign(signInHref()); } }}>{children}{label}</Link>;
  }
  const saved = me.bookmarks?.find((b) => b.href === href);
  const toggle = async () => {
    setBusy(true); setErr(null);
    const id = saved?.id ?? crypto.randomUUID();
    const e = await sendChange(saved ? { coll: "bookmarks", op: "delete", id } : { coll: "bookmarks", op: "create", id, data: { href, title, kind, meta: meta ?? "" } });
    setBusy(false);
    if (e) { setErr(e); return; }
    patchMe((m) => ({ ...m, bookmarks: saved ? (m.bookmarks ?? []).filter((b) => b.id !== id) : [...(m.bookmarks ?? []), { id, href }] }));
  };
  return (
    <>
      <button type="button" className={className} style={{ ...style, cursor: busy ? "wait" : "pointer", fontFamily: "inherit" }} aria-pressed={!!saved} disabled={busy} onClick={() => void toggle()} title={err ?? undefined}>{children}{saved ? savedLabel : label}</button>
      {err && <span role="alert" className="sr-only">{err}</span>}
    </>
  );
}
