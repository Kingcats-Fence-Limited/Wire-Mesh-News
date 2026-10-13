"use client";
/* eslint-disable @next/next/no-img-element -- previews of local data: URLs; next/image does not apply */

/* The one article editor, used by /submit/ and by "My submissions" in the account.
   Everything a submission needs: article text with a formatting toolbar, section,
   sub-section and type from the vocabularies, controlled tags, images and files with
   caption / credit / licence, sources, by-line, disclosure and declarations, a preview,
   and a checklist that says what is still missing before it can be submitted.
   Phase 1: images are scaled down in the browser and kept with the draft; nothing uploads. */
import Link from "next/link";
import { useMemo, useRef, useState } from "react";
import { SECTION } from "@/data/vocab/section";
import { SUBSECTION } from "@/data/vocab/subsection";
import { ARTICLE_TYPE } from "@/data/vocab/article_type";
import { PRODUCT } from "@/data/vocab/product";
import { APPLICATION_AREA } from "@/data/vocab/application_area";
import { MATERIAL } from "@/data/vocab/material";
import { PROCESS } from "@/data/vocab/process";
import { SURFACE_TREATMENT } from "@/data/vocab/surface_treatment";
import { REGION } from "@/data/vocab/region";
import "@/styles/editor.css";

import type { ArticleDraft, EditorFile } from "./draft";
export { emptyDraft, type ArticleDraft, type EditorFile } from "./draft";

const SECTIONS = SECTION.filter((s) => s.code !== "letters_opinion");
const TYPES = ARTICLE_TYPE.filter((t) => ["news", "analysis", "guide", "case_study", "interview", "explainer"].includes(t.code));
const LICENCES = ["Own photo or own work", "Supplied by the company shown, with permission", "Licensed from an agency or stock library", "Public domain or Creative Commons (state which)"];
const TAGS = [
  ...PRODUCT.map((x) => ({ k: `product:${x.code}`, label: x.labelEn, group: "Product" })),
  ...APPLICATION_AREA.map((x) => ({ k: `application:${x.code}`, label: x.labelEn, group: "Application" })),
  ...MATERIAL.map((x) => ({ k: `material:${x.code}`, label: x.labelEn, group: "Material" })),
  ...PROCESS.map((x) => ({ k: `process:${x.code}`, label: x.labelEn, group: "Process" })),
  ...SURFACE_TREATMENT.map((x) => ({ k: `surface:${x.code}`, label: x.labelEn, group: "Surface" })),
  ...REGION.map((x) => ({ k: `region:${x.code}`, label: x.labelEn, group: "Region" })),
];
const TAG = Object.fromEntries(TAGS.map((t) => [t.k, t]));
const MIN_WORDS = 100, MAX_FILES = 8, MAX_TAGS = 6;
const words = (s: string) => (s.trim() ? s.trim().split(/\s+/).length : 0);
const uid = () => Math.random().toString(36).slice(2, 9);

/* Downscale an image in the browser so a draft stays small enough to keep. */
function shrink(file: File, max = 1400): Promise<string> {
  return new Promise((res, rej) => {
    const url = URL.createObjectURL(file);
    const img = new Image();
    img.onload = () => {
      const k = Math.min(1, max / Math.max(img.width, img.height));
      const c = document.createElement("canvas");
      c.width = Math.round(img.width * k); c.height = Math.round(img.height * k);
      c.getContext("2d")!.drawImage(img, 0, 0, c.width, c.height);
      URL.revokeObjectURL(url);
      res(c.toDataURL("image/jpeg", 0.82));
    };
    img.onerror = () => { URL.revokeObjectURL(url); rej(new Error("unreadable")); };
    img.src = url;
  });
}

/* Minimal, safe rendering of the toolbar's markup for the preview (no HTML injection). */
function inline(text: string, files: EditorFile[], key: string): React.ReactNode[] {
  const out: React.ReactNode[] = [];
  const re = /(\*\*[^*]+\*\*|_[^_]+_|\[[^\]]+\]\([^)]+\))/g;
  let last = 0, m: RegExpExecArray | null, i = 0;
  while ((m = re.exec(text))) {
    if (m.index > last) out.push(text.slice(last, m.index));
    const t = m[0];
    if (t.startsWith("**")) out.push(<b key={`${key}-${i++}`}>{t.slice(2, -2)}</b>);
    else if (t.startsWith("_")) out.push(<i key={`${key}-${i++}`}>{t.slice(1, -1)}</i>);
    else { const mm = /\[([^\]]+)\]\(([^)]+)\)/.exec(t)!; out.push(<a key={`${key}-${i++}`} href={/^https?:\/\//.test(mm[2]) ? mm[2] : undefined} target="_blank" rel="noopener noreferrer nofollow">{mm[1]}</a>); }
    last = m.index + t.length;
  }
  if (last < text.length) out.push(text.slice(last));
  void files;
  return out;
}
function Rendered({ body, files }: { body: string; files: EditorFile[] }) {
  const blocks: React.ReactNode[] = [];
  const lines = body.split("\n");
  let list: string[] = [], table: string[] = [];
  const flush = (k: number) => {
    if (list.length) { blocks.push(<ul key={`u${k}`}>{list.map((l, i) => <li key={i}>{inline(l, files, `l${k}${i}`)}</li>)}</ul>); list = []; }
    if (table.length) {
      const rows = table.filter((r) => !/^\|\s*-/.test(r)).map((r) => r.replace(/^\||\|$/g, "").split("|").map((c) => c.trim()));
      blocks.push(<table key={`t${k}`}><tbody>{rows.map((r, i) => <tr key={i}>{r.map((c, j) => (i === 0 ? <th key={j}>{c}</th> : <td key={j}>{c}</td>))}</tr>)}</tbody></table>); table = [];
    }
  };
  lines.forEach((ln, k) => {
    const img = /^!\[([^\]]*)\]\(file:([a-z0-9]+)\)\s*$/.exec(ln.trim());
    if (ln.startsWith("- ")) { if (table.length) flush(k); list.push(ln.slice(2)); return; }
    if (ln.trim().startsWith("|")) { if (list.length) flush(k); table.push(ln.trim()); return; }
    flush(k);
    if (img) { const f = files.find((x) => x.id === img[2]); blocks.push(<figure key={k}>{f?.url ? <img src={f.url} alt={f.caption || img[1]} /> : <div className="aed-miss">Image not found — it was removed from the files</div>}<figcaption>{f?.caption || img[1]}{f?.credit ? <span> · {f.credit}</span> : null}</figcaption></figure>); return; }
    if (ln.startsWith("## ")) { blocks.push(<h3 key={k}>{inline(ln.slice(3), files, `h${k}`)}</h3>); return; }
    if (ln.trim()) blocks.push(<p key={k}>{inline(ln, files, `p${k}`)}</p>);
  });
  flush(lines.length);
  return <div className="aed-prose">{blocks}</div>;
}

export function ArticleEditor({ initial, onSave, onSubmit, onClose, submitLabel = "Submit for review", note }: {
  initial: ArticleDraft; onSave: (d: ArticleDraft) => void; onSubmit: (d: ArticleDraft) => void; onClose?: () => void; submitLabel?: string; note?: React.ReactNode;
}) {
  const [d, setD] = useState<ArticleDraft>(initial);
  const [view, setView] = useState<"edit" | "preview">("edit");
  const [savedAt, setSavedAt] = useState<string | null>(null);
  const [tagQ, setTagQ] = useState("");
  const [fileErr, setFileErr] = useState<string | null>(null);
  const [drag, setDrag] = useState(false);
  const [showMissing, setShowMissing] = useState(false);
  const bodyRef = useRef<HTMLTextAreaElement>(null);
  const set = <K extends keyof ArticleDraft>(k: K, v: ArticleDraft[K]) => setD((x) => ({ ...x, [k]: v }));
  const dirty = JSON.stringify(d) !== JSON.stringify(initial);
  const subs = SUBSECTION.filter((s) => s.section === d.section);
  const wc = words(d.body);

  /* Toolbar: insert or wrap at the cursor. */
  const insert = (before: string, after = "", placeholder = "") => {
    const el = bodyRef.current; const v = d.body;
    const s = el?.selectionStart ?? v.length, e = el?.selectionEnd ?? v.length;
    const sel = v.slice(s, e) || placeholder;
    const lineStart = before.endsWith(" ") && (before.startsWith("##") || before === "- ") ;
    const pre = lineStart && s > 0 && v[s - 1] !== "\n" ? "\n" : "";
    const next = v.slice(0, s) + pre + before + sel + after + v.slice(e);
    set("body", next);
    requestAnimationFrame(() => { if (!el) return; el.focus(); const p = s + pre.length + before.length; el.setSelectionRange(p, p + sel.length); });
  };

  const addFiles = async (list: FileList | File[]) => {
    const arr = Array.from(list);
    const room = MAX_FILES - d.files.length;
    const ok = arr.filter((f) => /^image\/(jpeg|png|webp)$/.test(f.type) || f.type === "application/pdf").filter((f) => f.size <= 10 * 1024 * 1024);
    const msgs: string[] = [];
    if (ok.length < arr.length) msgs.push(`${arr.length - ok.length} skipped: JPG, PNG, WebP or PDF up to 10 MB.`);
    if (ok.length > room) msgs.push(`Up to ${MAX_FILES} files per article.`);
    const take = ok.slice(0, Math.max(0, room));
    const made: EditorFile[] = [];
    for (const f of take) {
      if (f.type === "application/pdf") made.push({ id: uid(), name: f.name, kind: "pdf", caption: "", credit: "", licence: "" });
      else { try { made.push({ id: uid(), name: f.name, kind: "image", url: await shrink(f), caption: "", credit: "", licence: "" }); } catch { msgs.push(`${f.name} could not be read.`); } }
    }
    setFileErr(msgs.length ? msgs.join(" ") : null);
    setD((x) => { const files = [...x.files, ...made]; if (!files.some((y) => y.cover)) { const first = files.find((y) => y.kind === "image"); if (first) first.cover = true; } return { ...x, files }; });
  };
  const updFile = (id: string, p: Partial<EditorFile>) => setD((x) => ({ ...x, files: x.files.map((f) => (f.id === id ? { ...f, ...p } : f)) }));
  const setCover = (id: string) => setD((x) => ({ ...x, files: x.files.map((f) => ({ ...f, cover: f.id === id })) }));
  const removeFile = (id: string) => setD((x) => { const files = x.files.filter((f) => f.id !== id); if (files.length && !files.some((f) => f.cover)) { const first = files.find((f) => f.kind === "image"); if (first) first.cover = true; } return { ...x, files, body: x.body.replace(new RegExp(`\\n?!\\[[^\\]]*\\]\\(file:${id}\\)`, "g"), "") }; });

  const tagHits = useMemo(() => { const q = tagQ.trim().toLowerCase(); if (!q) return []; return TAGS.filter((t) => !d.tags.includes(t.k) && t.label.toLowerCase().includes(q)).slice(0, 8); }, [tagQ, d.tags]);

  const missing = [
    d.title.trim().length < 10 && "Title (at least 10 characters)",
    d.dek.trim().length < 20 && "Standfirst (one or two sentences)",
    wc < MIN_WORDS && `Body: ${MIN_WORDS - wc} more words (at least ${MIN_WORDS}; 1,200+ recommended)`,
    !d.section && "Section",
    d.section && !d.subsection && "Sub-section",
    !d.type && "Article type",
    d.tags.length === 0 && "At least one tag",
    ...d.files.filter((f) => !f.caption.trim() || !f.credit.trim() || !f.licence).map((f) => `Caption, credit and licence for “${f.name}”`),
    d.sources.filter((s) => s.trim()).length === 0 && "At least one source",
    !d.byline.trim() && "By-line",
    !d.disclosure && "Commercial relationship: choose none or describe it",
    d.disclosure === "yes" && d.disclosureText.trim().length < 10 && "Describe the commercial relationship",
    !d.checks.every(Boolean) && "Tick the three declarations",
  ].filter(Boolean) as string[];
  const done = 13 - Math.min(13, missing.length);
  const pct = Math.round((done / 13) * 100);

  const save = () => { onSave(d); setSavedAt(new Date().toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" })); };
  const cover = d.files.find((f) => f.cover && f.url);

  return (
    <div className="aed">
      <div className="aed-bar">
        <div className="aed-tabs" role="tablist">
          <button type="button" role="tab" aria-selected={view === "edit"} className={view === "edit" ? "on" : ""} onClick={() => setView("edit")}>Write</button>
          <button type="button" role="tab" aria-selected={view === "preview"} className={view === "preview" ? "on" : ""} onClick={() => setView("preview")}>Preview</button>
        </div>
        <div className="aed-prog" title={`${done} of 13 requirements met`}><span style={{ width: `${pct}%` }} /></div>
        <span className="aed-meta">{savedAt ? `Draft saved ${savedAt}` : dirty ? "Unsaved changes" : "No changes yet"}</span>
      </div>

      {view === "preview" ? (
        <div className="aed-card aed-preview">
          {cover && <img className="aed-cover" src={cover.url} alt={cover.caption} />}
          <div className="aed-kick">{[SECTION.find((s) => s.code === d.section)?.label, SUBSECTION.find((s) => s.code === d.subsection)?.label, ARTICLE_TYPE.find((t) => t.code === d.type)?.label].filter(Boolean).join(" · ").toUpperCase() || "SECTION NOT CHOSEN"}</div>
          <h2>{d.title || "Untitled"}</h2>
          {d.dek && <p className="aed-dek">{d.dek}</p>}
          <div className="aed-meta" style={{ marginBottom: "18px" }}>By {d.byline || "—"} · {wc.toLocaleString("en-US")} words · about {Math.max(1, Math.round(wc / 230))} min read</div>
          {d.disclosure === "yes" && <div className="aed-disc"><b>Disclosure.</b> {d.disclosureText}</div>}
          <Rendered body={d.body} files={d.files} />
          {d.tags.length > 0 && <div className="aed-tags" style={{ marginTop: "18px" }}>{d.tags.map((t) => <span key={t} className="aed-tag ro">{TAG[t]?.label ?? t}</span>)}</div>}
          {d.sources.some((s) => s.trim()) && <div className="aed-src"><b>Sources</b><ol>{d.sources.filter((s) => s.trim()).map((s, i) => <li key={i}>{s}</li>)}</ol></div>}
        </div>
      ) : (
        <>
          <section className="aed-card">
            <div className="aed-hd"><span className="aed-n">1</span><h3>Article</h3></div>
            <div className="aed-fld"><label htmlFor="ae-t">TITLE</label><input id="ae-t" className="aed-inp" value={d.title} maxLength={140} onChange={(e) => set("title", e.target.value)} placeholder="Specific and accurate; no marketing language" /><span className="aed-hint">{d.title.length} / 140 · News headlines must reflect the facts.</span></div>
            <div className="aed-fld"><label htmlFor="ae-d">STANDFIRST</label><textarea id="ae-d" rows={2} className="aed-inp" value={d.dek} maxLength={320} onChange={(e) => set("dek", e.target.value)} placeholder="Two or three sentences: what question does the article answer?" /></div>
            <div className="aed-fld">
              <label htmlFor="ae-b">BODY</label>
              <div className="aed-ed">
                <div className="aed-tb" role="toolbar" aria-label="Formatting">
                  <button type="button" title="Heading" onClick={() => insert("## ", "", "Heading")}>H2</button>
                  <button type="button" title="Bold" onClick={() => insert("**", "**", "bold text")}><b>B</b></button>
                  <button type="button" title="Italic" onClick={() => insert("_", "_", "italic text")}><i>I</i></button>
                  <span className="sep" />
                  <button type="button" title="Bulleted list" onClick={() => insert("- ", "", "List item")}>• List</button>
                  <button type="button" title="Table" onClick={() => insert("\n| Column | Column |\n| --- | --- |\n| ", " | |\n", "Value")}>Table</button>
                  <button type="button" title="Link" onClick={() => insert("[", "](https://)", "link text")}>Link</button>
                  <span className="sep" />
                  <label className="aed-tbfile" title="Add an image and insert it here">Image +<input type="file" accept="image/jpeg,image/png,image/webp" onChange={async (e) => { const f = e.target.files?.[0]; e.target.value = ""; if (!f) return; const before = d.files.length; await addFiles([f]); setD((x) => { const nf = x.files[before]; if (!nf) return x; const el = bodyRef.current; const pos = el?.selectionStart ?? x.body.length; return { ...x, body: `${x.body.slice(0, pos)}\n![${nf.name}](file:${nf.id})\n${x.body.slice(pos)}` }; }); }} /></label>
                  <span className="aed-wc">{wc.toLocaleString("en-US")} words · ≥ {MIN_WORDS} required, 1,200+ recommended</span>
                </div>
                <textarea id="ae-b" ref={bodyRef} rows={14} className="aed-inp aed-body" value={d.body} onChange={(e) => set("body", e.target.value)} placeholder="Conclusion first, clear hierarchy; use tables or steps where they help." />
              </div>
            </div>
            <div className="aed-g3">
              <div className="aed-fld"><label htmlFor="ae-s">SECTION</label><select id="ae-s" className="aed-inp" value={d.section} onChange={(e) => setD((x) => ({ ...x, section: e.target.value, subsection: "" }))}><option value="">Choose…</option>{SECTIONS.map((s) => <option key={s.code} value={s.code}>{s.label}</option>)}</select></div>
              <div className="aed-fld"><label htmlFor="ae-ss">SUB-SECTION</label><select id="ae-ss" className="aed-inp" value={d.subsection} disabled={!d.section} onChange={(e) => set("subsection", e.target.value)}><option value="">{d.section ? "Choose…" : "Choose a section first"}</option>{subs.map((s) => <option key={s.code} value={s.code}>{s.label}</option>)}</select></div>
              <div className="aed-fld"><label htmlFor="ae-ty">ARTICLE TYPE</label><select id="ae-ty" className="aed-inp" value={d.type} onChange={(e) => set("type", e.target.value)}><option value="">Choose…</option>{TYPES.map((t) => <option key={t.code} value={t.code}>{t.label}</option>)}</select></div>
            </div>
            <span className="aed-hint" style={{ marginTop: "-8px", display: "block" }}>Your suggestion; the final section, placement and publication date are the editors&apos; decision. Sponsored content goes through <Link href="/advertise/">Advertise</Link>, not here.</span>
            <div className="aed-fld" style={{ marginTop: "16px", marginBottom: 0 }}>
              <label htmlFor="ae-tag">TAGS · {d.tags.length} / {MAX_TAGS}</label>
              <div className="aed-tags">
                {d.tags.map((t) => <span key={t} className="aed-tag"><small>{TAG[t]?.group}</small>{TAG[t]?.label ?? t}<button type="button" aria-label={`Remove ${TAG[t]?.label}`} onClick={() => set("tags", d.tags.filter((x) => x !== t))}>×</button></span>)}
              </div>
              {d.tags.length < MAX_TAGS && (
                <div style={{ position: "relative" }}>
                  <input id="ae-tag" className="aed-inp" value={tagQ} onChange={(e) => setTagQ(e.target.value)} placeholder="Type to find a product, application, material, process, coating or region" autoComplete="off" onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); if (tagHits[0]) { set("tags", [...d.tags, tagHits[0].k]); setTagQ(""); } } }} />
                  {tagHits.length > 0 && <div className="aed-menu" role="listbox">{tagHits.map((t) => <button key={t.k} type="button" role="option" aria-selected={false} onClick={() => { set("tags", [...d.tags, t.k]); setTagQ(""); }}><small>{t.group}</small>{t.label}</button>)}</div>}
                  {tagQ.trim() && tagHits.length === 0 && <span className="aed-hint">No match in the site vocabulary. Tags come from fixed lists so they work as filters; write to the editors if one is missing.</span>}
                </div>
              )}
            </div>
          </section>

          <section className="aed-card">
            <div className="aed-hd"><span className="aed-n">2</span><h3>Images &amp; files</h3><span className="aed-meta" style={{ marginLeft: "auto" }}>{d.files.length} / {MAX_FILES}</span></div>
            <label className={`aed-drop${drag ? " on" : ""}`} onDragOver={(e) => { e.preventDefault(); setDrag(true); }} onDragLeave={() => setDrag(false)} onDrop={(e) => { e.preventDefault(); setDrag(false); addFiles(e.dataTransfer.files); }}>
              <input type="file" multiple accept="image/jpeg,image/png,image/webp,application/pdf" onChange={(e) => { if (e.target.files) addFiles(e.target.files); e.target.value = ""; }} />
              <b>Drag files here, or <u>choose files</u></b>
              <span className="aed-hint">JPG, PNG, WebP or PDF, up to 10 MB each and {MAX_FILES} per article. Your own images or ones you have the right to publish; no AI-generated images presented as real projects.</span>
            </label>
            {fileErr && <span role="alert" className="aed-err">{fileErr}</span>}
            {d.files.map((f) => {
              const need = !f.caption.trim() || !f.credit.trim() || !f.licence;
              return (
                <div key={f.id} className={`aed-file${need ? " need" : ""}`}>
                  <div className="aed-thumb">{f.kind === "image" && f.url ? <img src={f.url} alt="" /> : <span>{f.kind === "pdf" ? "PDF" : "IMG"}</span>}{f.cover && <em>COVER</em>}</div>
                  <div className="aed-fmeta">
                    <div className="aed-fname">{f.name}</div>
                    <div className="aed-g2">
                      <input className="aed-inp sm" aria-label={`Caption for ${f.name}`} placeholder="Caption: what the image shows *" value={f.caption} onChange={(e) => updFile(f.id, { caption: e.target.value })} />
                      <input className="aed-inp sm" aria-label={`Credit for ${f.name}`} placeholder="Credit: photographer or owner *" value={f.credit} onChange={(e) => updFile(f.id, { credit: e.target.value })} />
                    </div>
                    <select className="aed-inp sm" aria-label={`Licence for ${f.name}`} value={f.licence} onChange={(e) => updFile(f.id, { licence: e.target.value })}><option value="">Licence / right to publish *</option>{LICENCES.map((l) => <option key={l}>{l}</option>)}</select>
                    <div className="aed-facts">
                      {f.kind === "image" && !f.cover && <button type="button" onClick={() => setCover(f.id)}>Set as cover</button>}
                      {f.kind === "image" && <button type="button" onClick={() => { const el = bodyRef.current; const pos = el?.selectionStart ?? d.body.length; set("body", `${d.body.slice(0, pos)}\n![${f.caption || f.name}](file:${f.id})\n${d.body.slice(pos)}`); }}>Insert into body</button>}
                      <button type="button" className="danger" onClick={() => removeFile(f.id)}>Remove</button>
                    </div>
                  </div>
                </div>
              );
            })}
          </section>

          <section className="aed-card">
            <div className="aed-hd"><span className="aed-n">3</span><h3>Sources &amp; declarations</h3></div>
            <div className="aed-fld">
              <label>SOURCES</label>
              {d.sources.map((s, i) => (
                <div key={i} style={{ display: "flex", gap: "6px" }}>
                  <input className="aed-inp" aria-label={`Source ${i + 1}`} value={s} placeholder="Standard number, publication, report, or interviewee and date" onChange={(e) => set("sources", d.sources.map((x, j) => (j === i ? e.target.value : x)))} />
                  {d.sources.length > 1 && <button type="button" className="aed-x" aria-label={`Remove source ${i + 1}`} onClick={() => set("sources", d.sources.filter((_, j) => j !== i))}>×</button>}
                </div>
              ))}
              <button type="button" className="aed-link" onClick={() => set("sources", [...d.sources, ""])}>+ Add a source</button>
              <span className="aed-hint">Links must be publicly accessible; editors check every one before publication.</span>
            </div>
            <div className="aed-fld"><label htmlFor="ae-by">BY-LINE</label><input id="ae-by" className="aed-inp" value={d.byline} onChange={(e) => set("byline", e.target.value)} placeholder="Real name · title · organisation" /><span className="aed-hint">Outside contributions carry the real author or company name. Email addresses are never published.</span></div>
            <div className="aed-fld">
              <label>COMMERCIAL RELATIONSHIP</label>
              <label className="aed-radio"><input type="radio" name="disc" checked={d.disclosure === "none"} onChange={() => set("disclosure", "none")} />None: the article is not about my company, product, client or a related business</label>
              <label className="aed-radio"><input type="radio" name="disc" checked={d.disclosure === "yes"} onChange={() => set("disclosure", "yes")} />Yes, there is a relationship</label>
              {d.disclosure === "yes" && <textarea className="aed-inp" rows={2} aria-label="Describe the relationship" value={d.disclosureText} onChange={(e) => set("disclosureText", e.target.value)} placeholder="e.g. I work for the supplier of the panels described in section 3." />}
              <span className="aed-hint">Declared relationships are printed with the article.</span>
            </div>
            <div className="aed-checks">
              {["I confirm this article is original, or that I hold publication rights, and that every image and figure has a lawful source.", "I agree that editors may edit the title, structure and wording, and will check facts and sources before publication."].map((t, i) => (
                <label key={i} className="aed-chk"><input type="checkbox" checked={d.checks[i]} onChange={(e) => set("checks", d.checks.map((x, j) => (j === i ? e.target.checked : x)) as ArticleDraft["checks"])} /><span>{t}</span></label>
              ))}
              <label className="aed-chk"><input type="checkbox" checked={d.checks[2]} onChange={(e) => set("checks", [d.checks[0], d.checks[1], e.target.checked])} /><span>I have read the <Link href="/policies/submission-guidelines/">Submission Guidelines</Link> and the <Link href="/policies/editorial-policy/">Editorial Policy</Link>.</span></label>
            </div>
          </section>
        </>
      )}

      <div className="aed-foot">
        {missing.length > 0 && (showMissing || view === "preview") && (
          <div className="aed-miss-list" role="status"><b>Before you can submit ({missing.length}):</b><ul>{missing.map((m) => <li key={m}>{m}</li>)}</ul></div>
        )}
        <div className="aed-actions">
          <button type="button" className="aed-btn dark" onClick={() => { if (missing.length) { setShowMissing(true); return; } onSubmit(d); }} aria-disabled={missing.length > 0}>{submitLabel}</button>
          <button type="button" className="aed-btn" onClick={save} disabled={!dirty && !!savedAt}>Save draft</button>
          <button type="button" className="aed-btn" onClick={() => setView(view === "edit" ? "preview" : "edit")}>{view === "edit" ? "Preview" : "Back to writing"}</button>
          {onClose && <button type="button" className="aed-btn ghost" onClick={() => { if (dirty) onSave(d); onClose(); }}>{dirty ? "Save and close" : "Close"}</button>}
          <span className="aed-meta">{missing.length ? `${missing.length} item${missing.length > 1 ? "s" : ""} left to complete` : "Ready to submit"}{note ? <> · {note}</> : null}</span>
        </div>
      </div>
    </div>
  );
}
