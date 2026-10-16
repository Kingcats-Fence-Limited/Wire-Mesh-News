"use client";

/* Article comments. Preview: the static "sign in to comment" box. Live: approved comments
   load from /api/comments, and a signed-in reader can post one (it waits for review). */
import Link from "next/link";
import { useEffect, useState } from "react";
import { AUTH_LIVE } from "@/lib/live";
import { useMe, postJson } from "@/lib/me-client";

type C = { id: string; text: string; date: string; name: string; initials: string; role: string };
const cache = new Map<string, Promise<C[]>>();
const load = (slug: string) => {
  if (!cache.has(slug)) cache.set(slug, fetch(`/api/comments/?slug=${encodeURIComponent(slug)}`).then((r) => (r.ok ? r.json() : { comments: [] })).then((j: { comments: C[] }) => j.comments).catch(() => []));
  return cache.get(slug)!;
};
function useComments(slug: string) {
  const [list, setList] = useState<C[] | null>(AUTH_LIVE ? null : []);
  useEffect(() => { if (AUTH_LIVE) void load(slug).then(setList); }, [slug]);
  return list;
}
const fmt = (iso: string) => new Intl.DateTimeFormat("en-GB", { day: "numeric", month: "short", year: "numeric" }).format(new Date(iso));
const avatar: React.CSSProperties = { width: "34px", height: "34px", borderRadius: "999px", background: "var(--ink)", color: "var(--on-ink)", display: "inline-flex", alignItems: "center", justifyContent: "center", fontSize: "12.5px", fontWeight: 800, flexShrink: 0 };
const btn: React.CSSProperties = { minHeight: "42px", padding: "0 22px", border: 0, borderRadius: "999px", background: "var(--ink)", color: "var(--on-ink)", fontFamily: "inherit", fontSize: "14px", fontWeight: 800, display: "inline-flex", alignItems: "center", cursor: "pointer" };

export function CommentCount({ slug }: { slug: string }) {
  const list = useComments(slug);
  return <>{list?.length ?? 0}</>;
}

export function ArticleComments({ slug }: { slug: string }) {
  const list = useComments(slug);
  const me = useMe();
  const [text, setText] = useState("");
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState<string | null>(null);
  const [sent, setSent] = useState(false);
  const signedIn = AUTH_LIVE && !!me?.signedIn;

  const send = async () => {
    setBusy(true); setErr(null);
    const e = await postJson("/api/comments/", { slug, text });
    setBusy(false);
    if (e) { setErr(e); return; }
    setSent(true); setText("");
  };

  return (
    <div>
      <div style={{ border: "2px solid var(--ink)", borderRadius: "14px", padding: "18px 20px", marginBottom: "26px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "11px", marginBottom: "12px" }}>
          <span style={avatar} aria-hidden="true">{signedIn ? me?.initials : "?"}</span>
          <span style={{ fontSize: "14px", fontWeight: 800 }}>{signedIn ? me?.name || "Add your name in your profile" : "Your name"}</span>
          <span style={{ background: "var(--paper)", fontSize: "10.5px", fontWeight: 800, letterSpacing: ".1em", padding: "4px 8px", borderRadius: "4px", color: "var(--slate)" }}>READER</span>
        </div>
        {sent ? (
          <div role="status" style={{ background: "var(--st-current-bg)", color: "var(--up)", borderRadius: "10px", padding: "12px 14px", fontSize: "13.5px", fontWeight: 700 }}>Thank you. Your comment is in the review queue and appears here once approved; you can follow it under My comments.</div>
        ) : signedIn ? (
          <>
            <label htmlFor="cm-text" className="sr-only">Your comment</label>
            <textarea id="cm-text" rows={3} maxLength={1500} value={text} onChange={(e) => { setText(e.target.value); setErr(null); }} placeholder="Add to the record — a correction, a site experience, a standard we missed…" style={{ width: "100%", boxSizing: "border-box", minHeight: "70px", border: "1px solid var(--line)", borderRadius: "10px", padding: "12px 14px", fontSize: "14px", fontWeight: 500, fontFamily: "inherit", background: "var(--card)", color: "var(--ink)", resize: "vertical" }} />
            {err && <p role="alert" style={{ margin: "8px 0 0", fontSize: "13px", fontWeight: 800, color: "var(--red-text)" }}>{err}</p>}
          </>
        ) : (
          <div style={{ minHeight: "70px", border: "1px solid var(--line)", borderRadius: "10px", padding: "12px 14px", fontSize: "14px", fontWeight: 500, color: "var(--grey)" }}>Add to the record — a correction, a site experience, a standard we missed…</div>
        )}
        {!sent && (
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: "16px", marginTop: "12px", flexWrap: "wrap" }}>
            <span style={{ fontSize: "12px", fontWeight: 500, color: "var(--grey)" }}>{signedIn ? `${text.length} / 1,500 · reviewed before it appears, usually within one working day.` : "Comments enter a review queue and are usually handled within one working day."}</span>
            {signedIn
              ? <button type="button" style={{ ...btn, opacity: busy || text.trim().length < 5 ? 0.6 : 1 }} disabled={busy || text.trim().length < 5} onClick={() => void send()}>{busy ? "Sending…" : "Post comment"}</button>
              : <Link href="/signin/" style={btn} onClick={(e) => { if (AUTH_LIVE) { e.preventDefault(); location.assign(`/signin/?next=${encodeURIComponent(location.pathname + "#comments")}`); } }}>Sign in to comment</Link>}
          </div>
        )}
      </div>
      {list === null ? <p className="meta" role="status" style={{ margin: 0 }}>Loading comments…</p> : list.length === 0 ? <p className="meta" style={{ margin: 0 }}>No comments yet. Be the first to add to the record.</p> : (
        <ol style={{ listStyle: "none", margin: 0, padding: 0, display: "flex", flexDirection: "column", gap: "18px" }}>
          {list.map((c) => (
            <li key={c.id} style={{ display: "flex", gap: "12px", borderBottom: "1px solid var(--line)", paddingBottom: "16px" }}>
              <span style={avatar} aria-hidden="true">{c.initials}</span>
              <div style={{ minWidth: 0 }}>
                <div style={{ fontSize: "14px", fontWeight: 800 }}>{c.name} {c.role && <span className="meta" style={{ fontWeight: 500 }}>· {c.role}</span>} <span className="meta" style={{ fontWeight: 500 }}>· {fmt(c.date)}</span></div>
                <p style={{ margin: "4px 0 0", fontSize: "14.5px", fontWeight: 500, lineHeight: 1.6, whiteSpace: "pre-wrap", overflowWrap: "anywhere" }}>{c.text}</p>
              </div>
            </li>
          ))}
        </ol>
      )}
    </div>
  );
}
