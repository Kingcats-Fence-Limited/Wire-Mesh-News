"use client";

/* /submit/ — the same article editor the account uses. The draft is kept in this browser
   until accounts go live; submitting shows where the article goes next. */
import Link from "next/link";
import { useEffect, useState } from "react";
import { ArticleEditor, emptyDraft, normalizeDraft, type ArticleDraft, type EditorRefs } from "@/components/editor/ArticleEditor";
import { AUTH_LIVE } from "@/lib/live";

/* Live accounts: articles are written in the account, where drafts are saved to the server. */
function LiveStart() {
  return (
    <div className="sec" style={{ textAlign: "center", padding: "48px 26px" }}>
      <div className="h" style={{ fontSize: "26px", marginBottom: "10px" }}>Write your article in your account</div>
      <p className="meta" style={{ fontSize: "14.5px", maxWidth: "540px", margin: "0 auto 18px" }}>Drafts save automatically and you can follow the review under My submissions. Sign-in takes one click with Google or Microsoft, or a code by email.</p>
      <Link href="/account/?new=1#submissions" style={{ background: "var(--ink)", color: "var(--on-ink)", fontWeight: 800, fontSize: "14px", padding: "0 22px", minHeight: "46px", borderRadius: "999px", display: "inline-flex", alignItems: "center" }}>Start a submission</Link>
    </div>
  );
}

const KEY = "wmn-draft-v2";

export function SubmitForm({ refs }: { refs: EditorRefs }) {
  return AUTH_LIVE ? <LiveStart /> : <LocalSubmit refs={refs} />;
}

function LocalSubmit({ refs }: { refs: EditorRefs }) {
  const [initial, setInitial] = useState<ArticleDraft | null>(null);
  const [done, setDone] = useState<ArticleDraft | null>(null);
  useEffect(() => {
    try { const raw = localStorage.getItem(KEY); setInitial(raw ? normalizeDraft(JSON.parse(raw)) : emptyDraft()); } catch { setInitial(emptyDraft()); }
  }, []);
  const save = (d: ArticleDraft) => { try { localStorage.setItem(KEY, JSON.stringify(d)); } catch { try { localStorage.setItem(KEY, JSON.stringify({ ...d, files: d.files.map((f) => ({ ...f, url: undefined })) })); } catch { /* full */ } } };
  if (done) {
    return (
      <div className="sec" style={{ textAlign: "center", padding: "48px 26px" }}>
        <div className="h" style={{ fontSize: "28px", marginBottom: "10px" }}>Thank you — “{done.title}” is in the queue.</div>
        <p className="meta" style={{ fontSize: "14.5px", maxWidth: "540px", margin: "0 auto 18px" }}>Editors check facts, sources and image rights first. Expect a reply within five working days. The text is locked while in review; you can withdraw it to a draft from My submissions.</p>
        <div style={{ display: "flex", gap: "10px", justifyContent: "center", flexWrap: "wrap" }}>
          <Link href="/account/#submissions" style={{ background: "var(--ink)", color: "var(--on-ink)", fontWeight: 800, fontSize: "14px", padding: "0 22px", minHeight: "46px", borderRadius: "999px", display: "inline-flex", alignItems: "center" }}>Go to My submissions</Link>
          <button type="button" onClick={() => { try { localStorage.removeItem(KEY); } catch { /* ignore */ } setInitial(emptyDraft()); setDone(null); }} style={{ border: "1px solid var(--line)", background: "var(--card)", fontFamily: "inherit", fontWeight: 800, fontSize: "14px", padding: "0 22px", minHeight: "46px", borderRadius: "999px", cursor: "pointer", color: "var(--ink)" }}>Write another</button>
        </div>
      </div>
    );
  }
  if (!initial) return <div className="sec" style={{ minHeight: "300px" }} aria-busy="true" />;
  return <ArticleEditor initial={initial} refs={refs} onSave={save} onSubmit={(d) => { save(d); setDone(d); }} note="you need a verified account to submit" />;
}
