"use client";

/* /submit/ — the same article editor the account uses. The draft is kept in this browser
   until accounts go live; submitting shows where the article goes next. */
import Link from "next/link";
import { useEffect, useState } from "react";
import { ArticleEditor, emptyDraft, type ArticleDraft } from "@/components/editor/ArticleEditor";

const KEY = "wmn-draft-v2";

export function SubmitForm() {
  const [initial, setInitial] = useState<ArticleDraft | null>(null);
  const [done, setDone] = useState<ArticleDraft | null>(null);
  useEffect(() => {
    try { const raw = localStorage.getItem(KEY); setInitial(raw ? { ...emptyDraft(), ...JSON.parse(raw) } : emptyDraft()); } catch { setInitial(emptyDraft()); }
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
  return <ArticleEditor initial={initial} onSave={save} onSubmit={(d) => { save(d); setDone(d); }} note="you need a verified account to submit" />;
}
