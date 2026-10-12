"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { SECTION } from "@/data/vocab";

/* Submit-H form: three numbered cards (article, images, declarations), toolbar, word count, local draft. Submission itself needs the Phase 2 account backend; here it validates and shows the result. */
export function SubmitForm() {
  const [title, setTitle] = useState("");
  const [dek, setDek] = useState("");
  const [body, setBody] = useState("");
  const [savedAt, setSavedAt] = useState<string | null>(null);
  const [checks, setChecks] = useState([false, false, false]);
  const [state, setState] = useState<"edit" | "preview" | "done">("edit");
  const words = body.trim() ? body.trim().split(/\s+/).length : 0;
  useEffect(() => {
    try { const d = JSON.parse(localStorage.getItem("wmn-draft") ?? "null"); if (d) { setTitle(d.title ?? ""); setDek(d.dek ?? ""); setBody(d.body ?? ""); setSavedAt(d.at ?? null); } } catch {}
  }, []);
  const save = () => { const at = new Date().toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" }); try { localStorage.setItem("wmn-draft", JSON.stringify({ title, dek, body, at })); } catch {} setSavedAt(at); };
  const canSubmit = title.trim().length > 8 && body.trim().length > 50 && checks.every(Boolean);
  const steps = ["Write", "Preview", "Declare", "Submit"];
  const cur = state === "done" ? 3 : state === "preview" ? 1 : checks.every(Boolean) ? 2 : 0;
  const wrap = (tag: string) => setBody((b) => `${b}${b && !b.endsWith("\n") ? "\n" : ""}${tag}`);
  if (state === "done") {
    return (
      <div className="sec" style={{ textAlign: "center", padding: "48px 26px" }}>
        <div className="h" style={{ fontSize: "28px", marginBottom: "10px" }}>Thank you — your article is in the queue.</div>
        <p className="meta" style={{ fontSize: "14.5px", maxWidth: "520px", margin: "0 auto 18px" }}>Editors check facts, sources and image rights first. Expect a reply within five working days; the body is locked while in review, but you can withdraw it to a draft from your account.</p>
        <Link href="/" style={{ background: "var(--ink)", color: "#FFFFFF", fontWeight: 800, fontSize: "14px", padding: "0 22px", minHeight: "46px", borderRadius: "999px", display: "inline-flex", alignItems: "center" }}>Back to the front page</Link>
      </div>
    );
  }
  return (
    <>
<div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: "18px", flexWrap: "wrap", marginBottom: "26px" }}>
<div style={{ display: "flex", gap: "18px", flexWrap: "wrap", alignItems: "center" }}>
{steps.map((s, i) => (<span key={s} style={{ display: "contents" }}>{i > 0 && <span style={{ width: "22px", height: "2px", background: "var(--line)" }}></span>}<span className={`step${i <= cur ? " on" : ""}`}><span className="dot">{i + 1}</span>{s}</span></span>))}
</div>
<span style={{ fontSize: "13px" }} className="meta">{savedAt ? `Draft saved ${savedAt}` : "Not saved yet"}</span>
</div>
<form onSubmit={(e) => { e.preventDefault(); if (canSubmit) setState("done"); }} noValidate>
<div className="sec">
<div className="sechd"><span className="num">1</span><span style={{ fontSize: "20px" }} className="h">Article</span></div>
<div className="fld"><label htmlFor="f1">TITLE</label><input id="f1" type="text" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Specific and accurate; no marketing language" className="inp" /><span className="hint">News headlines must reflect the facts; technical articles state the conditions they apply under in the body.</span></div>
<div className="fld"><label htmlFor="f2">STANDFIRST</label><textarea id="f2" rows={2} value={dek} onChange={(e) => setDek(e.target.value)} placeholder="Two or three sentences: what question does the article answer?" className="inp"></textarea></div>
<div className="fld"><label htmlFor="f3">BODY</label>
<div style={{ border: "1px solid var(--line)", borderRadius: "10px", background: "#FFFFFF", overflow: "hidden" }}>
<div style={{ display: "flex", gap: "4px", padding: "8px 10px", borderBottom: "1px solid var(--line)", background: "var(--paper-2)", flexWrap: "wrap" }}>
<button type="button" aria-label="Heading" className="tb" onClick={() => wrap("## ")}>H2</button>
<button type="button" aria-label="Bold" className="tb" style={{ fontSize: "14px" }} onClick={() => wrap("**bold**")}>B</button>
<button type="button" aria-label="Italic" className="tb" style={{ fontSize: "14px", fontStyle: "italic", fontWeight: 700 }} onClick={() => wrap("_italic_")}>I</button>
<span style={{ width: "1px", background: "var(--line)", margin: "6px 5px" }}></span>
<button type="button" aria-label="Bulleted list" className="tb" onClick={() => wrap("- ")}><svg width="16" height="16" viewBox="0 0 24 24" stroke="var(--ink)" strokeWidth="2.2" strokeLinecap="round" fill="none" aria-hidden="true"><path d="M9 6h11M9 12h11M9 18h11" /><circle cx="4.5" cy="6" r="1.3" fill="var(--ink)" stroke="none" /><circle cx="4.5" cy="12" r="1.3" fill="var(--ink)" stroke="none" /><circle cx="4.5" cy="18" r="1.3" fill="var(--ink)" stroke="none" /></svg></button>
<button type="button" aria-label="Table" className="tb" onClick={() => wrap("| Column | Column |\n| --- | --- |\n| | |")}><svg width="16" height="16" viewBox="0 0 24 24" stroke="var(--ink)" strokeWidth="2" fill="none" aria-hidden="true"><rect x="3" y="4" width="18" height="16" rx="2" /><path d="M3 10h18M9 10v10" /></svg></button>
<button type="button" aria-label="Link" className="tb" onClick={() => wrap("[text](https://)")}><svg width="16" height="16" viewBox="0 0 24 24" stroke="var(--ink)" strokeWidth="2.2" strokeLinecap="round" fill="none" aria-hidden="true"><path d="M10 13.5a4 4 0 0 0 5.7 0l3-3a4 4 0 1 0-5.7-5.7L11.5 6" /><path d="M14 10.5a4 4 0 0 0-5.7 0l-3 3a4 4 0 1 0 5.7 5.7L12.5 18" /></svg></button>
<button type="button" aria-label="Insert image" className="tb" onClick={() => wrap("![caption](image)")}><svg width="16" height="16" viewBox="0 0 24 24" stroke="var(--ink)" strokeWidth="2" fill="none" aria-hidden="true"><rect x="3" y="5" width="18" height="14" rx="2" /><circle cx="8.5" cy="10" r="1.6" /><path d="m4 17 5-4.5 4 3.5 3-2.5 4 3.5" /></svg></button>
<span style={{ marginLeft: "auto", alignSelf: "center", fontSize: "12px", fontWeight: "700", color: "var(--grey)" }}>{words} words · ≥ 1,200 recommended</span>
</div>
<textarea id="f3" rows={7} value={body} onChange={(e) => setBody(e.target.value)} style={{ border: "0", borderRadius: "0" }} placeholder="Conclusion first, clear hierarchy; use tables or steps where they help." className="inp"></textarea>
</div>
</div>
<div className="g2" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "18px" }}>
<div style={{ marginBottom: "0" }} className="fld"><label htmlFor="f4">SUGGESTED SECTION</label><select id="f4" className="inp" defaultValue="technical_guides">{SECTION.filter((s) => s.code !== "letters_opinion").map((s) => <option key={s.code} value={s.code}>{s.label}</option>)}</select><span className="hint">The final section is the editors&#8217; decision.</span></div>
<div style={{ marginBottom: "0" }} className="fld"><label htmlFor="f5">SUGGESTED TAGS</label><input id="f5" type="text" placeholder="Product / application / material / process / region" className="inp" /><span className="hint">Comma-separated, up to six.</span></div>
</div>
</div>
<div className="sec">
<div className="sechd"><span className="num">2</span><span style={{ fontSize: "20px" }} className="h">Images &amp; files</span></div>
<div style={{ border: "2px dashed #C9CCD6", borderRadius: "12px", padding: "28px", textAlign: "center", background: "var(--paper-2)", marginBottom: "18px" }}>
<svg width="30" height="30" viewBox="0 0 24 24" stroke="var(--grey)" strokeWidth="2" fill="none" strokeLinecap="round" aria-hidden="true" style={{ marginBottom: "8px" }}><path d="M12 16V4m0 0L7.5 8.5M12 4l4.5 4.5" /><path d="M4 16v2.5A1.5 1.5 0 0 0 5.5 20h13a1.5 1.5 0 0 0 1.5-1.5V16" /></svg>
<div style={{ fontSize: "15px", fontWeight: "800", marginBottom: "5px" }}>Drag files here, or <label htmlFor="files" style={{ color: "var(--red)", fontWeight: "800", cursor: "pointer", textDecoration: "underline" }}>choose files</label><input id="files" type="file" multiple accept="image/*,.pdf" style={{ display: "none" }} /></div>
<div className="meta">JPG, PNG or PDF, up to 10 MB each, up to 8 files. Files stay private until the article is approved.</div>
</div>
<p className="meta" style={{ margin: 0, fontSize: "12.5px" }}>Each image needs a caption and a source &amp; licence line before submission; both are required fields once a file is added.</p>
</div>
<div className="sec">
<div className="sechd"><span className="num">3</span><span style={{ fontSize: "20px" }} className="h">Sources &amp; declarations</span></div>
<div className="fld"><label htmlFor="f6">SOURCES</label><textarea id="f6" rows={3} placeholder="One per line: standard number, publication, institutional report, or interviewee and date." className="inp"></textarea><span className="hint">External links must be publicly accessible; editors check every one before publication.</span></div>
<div className="fld"><label htmlFor="f7">BYLINE</label><input id="f7" type="text" placeholder="Real name or company name · title · organisation" className="inp" /><span className="hint">Outside contributions carry the real author or company name. Email addresses are never published.</span></div>
<div className="fld"><label htmlFor="f8">COMMERCIAL RELATIONSHIP</label><textarea id="f8" rows={2} placeholder="If the article concerns your company, product, client or a related business, say so here." className="inp"></textarea><span className="hint">Content with a commercial relationship is labelled Sponsored Content or carries the appropriate disclosure.</span></div>
<div style={{ borderTop: "1px solid var(--line)", paddingTop: "18px" }}>
{["I confirm this article is original, or that I hold publication rights, and that every image and figure has a lawful source.", "I agree that editors may edit the title, structure and wording as needed, and will check facts and sources before publication."].map((t, i) => (
<label key={i} className="chk"><input type="checkbox" checked={checks[i]} onChange={(e) => setChecks((c) => c.map((x, j) => (j === i ? e.target.checked : x)))} /><span>{t}</span></label>
))}
<label style={{ marginBottom: "0" }} className="chk"><input type="checkbox" checked={checks[2]} onChange={(e) => setChecks((c) => [c[0], c[1], e.target.checked])} /><span>I have read the <Link href="/policies/submission-guidelines/" style={{ color: "var(--red)", fontWeight: "800", textDecoration: "underline" }}>Submission Guidelines</Link> and the <Link href="/policies/editorial-policy/" style={{ color: "var(--red)", fontWeight: "800", textDecoration: "underline" }}>Editorial Policy</Link>.</span></label>
</div>
</div>
{state === "preview" && (
<div className="sec" style={{ borderColor: "var(--ink)", borderWidth: "2px" }}>
<div className="sechd"><span className="num">P</span><span style={{ fontSize: "20px" }} className="h">Preview</span></div>
<h2 className="h" style={{ fontSize: "30px", margin: "0 0 10px" }}>{title || "Untitled"}</h2>
<p style={{ fontSize: "16px", color: "var(--slate)", fontWeight: 500, lineHeight: 1.6, margin: "0 0 16px" }}>{dek}</p>
<div style={{ whiteSpace: "pre-wrap", fontSize: "16px", lineHeight: 1.75, fontWeight: 500, color: "var(--fg-2)" }}>{body}</div>
</div>
)}
<div style={{ display: "flex", gap: "12px", flexWrap: "wrap", alignItems: "center" }}>
<button type="submit" disabled={!canSubmit} style={{ minHeight: "52px", padding: "0 28px", borderRadius: "999px", border: "0", background: "var(--ink)", color: "#FFFFFF", fontFamily: "inherit", fontSize: "15px", fontWeight: "800", cursor: canSubmit ? "pointer" : "not-allowed", opacity: canSubmit ? 1 : 0.5 }}>Submit for review</button>
<button type="button" onClick={() => setState(state === "preview" ? "edit" : "preview")} style={{ minHeight: "52px", padding: "0 24px", borderRadius: "999px", border: "2px solid var(--ink)", background: "#FFFFFF", fontFamily: "inherit", fontSize: "15px", fontWeight: "800", cursor: "pointer", color: "var(--ink)" }}>{state === "preview" ? "Back to editing" : "Preview"}</button>
<button type="button" onClick={save} style={{ minHeight: "52px", padding: "0 24px", borderRadius: "999px", border: "1px solid var(--line)", background: "#FFFFFF", fontFamily: "inherit", fontSize: "15px", fontWeight: "800", cursor: "pointer", color: "var(--ink)" }}>Save draft</button>
<span style={{ marginLeft: "4px" }} className="meta">The body is locked once submitted; you can withdraw it to a draft.</span>
</div>
</form>
    </>
  );
}
