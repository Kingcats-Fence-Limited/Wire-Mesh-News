"use client";

/* Account panels that hold the user's own content: submissions, comments, author profile,
   bookmarks and messages. All actions change the demo store. */
import Link from "next/link";
import { useState } from "react";
import { useDemo, download, today, uid, type SubStatus, type Submission, type CommentStatus, type Bookmark, type MsgStatus, type Message } from "./store";
import { Head, Card, Field, Pill, Chips, ConfirmBtn, Empty, type Tone } from "./ui";
import { ENQUIRY_SUBJECT } from "@/data/vocab/enquiry_subject";

/* ------------------------------- Submissions ------------------------------- */
const SUB: Record<SubStatus, [string, Tone]> = {
  draft: ["DRAFT", "grey"], pending: ["PENDING REVIEW", "amber"], changes_requested: ["CHANGES REQUESTED", "red"],
  rejected: ["NOT ACCEPTED", "grey"], published: ["PUBLISHED", "green"], withdrawn: ["WITHDRAWN", "grey"],
};
type SubFilter = "all" | SubStatus;

export function Submissions() {
  const { d, set, toast } = useDemo();
  const [f, setF] = useState<SubFilter>("all");
  const [open, setOpen] = useState<string | null>(null);
  const [editing, setEditing] = useState<string | null>(null);
  const [draft, setDraft] = useState({ title: "", excerpt: "" });
  const n = (s: SubStatus) => d.submissions.filter((x) => x.status === s).length;
  const list = d.submissions.filter((x) => f === "all" || x.status === f);
  const upd = (id: string, patch: Partial<Submission>) => set((x) => ({ ...x, submissions: x.submissions.map((s) => (s.id === id ? { ...s, ...patch } : s)) }));
  const remove = (s: Submission) => {
    const before = d.submissions;
    set((x) => ({ ...x, submissions: x.submissions.filter((y) => y.id !== s.id) }));
    toast(`Draft “${s.title}” deleted.`, () => set((x) => ({ ...x, submissions: before })));
  };
  const startEdit = (s: Submission) => { setEditing(s.id); setOpen(s.id); setDraft({ title: s.title, excerpt: s.excerpt }); };
  const newDraft = () => {
    const s: Submission = { id: uid(), title: "Untitled draft", status: "draft", section: "Technical Guides", updated: today(), excerpt: "", words: 0 };
    set((x) => ({ ...x, submissions: [s, ...x.submissions] }));
    setF("all"); startEdit(s);
  };

  return (
    <>
      <Head title="My submissions" sub="Everything you have sent to the editors, with where it stands. Drafts are visible to you only." actions={<><button type="button" className="btn dark" onClick={newDraft}>+ New draft here</button><Link href="/submit/" className="btn">Open the full editor</Link></>} />
      <Chips label="Filter by status" value={f} onChange={setF} items={[
        { k: "all", label: "All", n: d.submissions.length }, { k: "draft", label: "Draft", n: n("draft") }, { k: "pending", label: "Pending", n: n("pending") },
        { k: "changes_requested", label: "Changes requested", n: n("changes_requested") }, { k: "published", label: "Published", n: n("published") }, { k: "rejected", label: "Not accepted", n: n("rejected") },
        ...(n("withdrawn") ? [{ k: "withdrawn" as const, label: "Withdrawn", n: n("withdrawn") }] : []),
      ]} />
      <div className="panel">
        {list.length === 0 && <div style={{ padding: "20px" }}><Empty>Nothing with this status.</Empty></div>}
        {list.map((s) => {
          const isOpen = open === s.id, isEdit = editing === s.id;
          return (
            <div key={s.id} className="row">
              <div style={{ flex: "1 1 auto", display: "flex", flexDirection: "column", gap: "7px", minWidth: 0 }}>
                <div style={{ display: "flex", gap: "10px", alignItems: "center", flexWrap: "wrap" }}>
                  <Pill tone={SUB[s.status][1]}>{SUB[s.status][0]}</Pill>
                  {s.editPending && <Pill tone="amber">EDIT IN REVIEW</Pill>}
                  <span className="meta">{s.section} · {s.submitted ? `Submitted ${s.submitted}` : `Saved ${s.updated}`}{s.reviewed ? ` · Reviewed ${s.reviewed}` : ""} · {s.words.toLocaleString("en-US")} words</span>
                </div>
                {isEdit ? (
                  <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                    <Field id={`st-${s.id}`} label="TITLE"><input id={`st-${s.id}`} className="inp" value={draft.title} maxLength={120} onChange={(e) => setDraft({ ...draft, title: e.target.value })} /></Field>
                    <Field id={`sx-${s.id}`} label="TEXT" aside={<span className="meta">{draft.excerpt.trim() ? draft.excerpt.trim().split(/\s+/).length : 0} words</span>}><textarea id={`sx-${s.id}`} rows={6} className="inp" value={draft.excerpt} onChange={(e) => setDraft({ ...draft, excerpt: e.target.value })} placeholder="Start writing. The full editor adds images, sources and the disclosure form." /></Field>
                    <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
                      <button type="button" className="btn dark" onClick={() => { upd(s.id, { title: draft.title || "Untitled draft", excerpt: draft.excerpt, words: draft.excerpt.trim() ? draft.excerpt.trim().split(/\s+/).length : 0, updated: today() }); setEditing(null); toast("Draft saved."); }}>Save draft</button>
                      <button type="button" className="btn" disabled={!draft.title.trim() || draft.excerpt.trim().split(/\s+/).length < 30} title="At least 30 words to submit" onClick={() => { upd(s.id, { title: draft.title, excerpt: draft.excerpt, words: draft.excerpt.trim().split(/\s+/).length, status: "pending", submitted: today(), note: undefined, updated: today() }); setEditing(null); toast("Submitted for review. Editors usually reply within five working days."); }}>{s.status === "changes_requested" ? "Resubmit" : "Submit for review"}</button>
                      <button type="button" className="btn" onClick={() => setEditing(null)}>Cancel</button>
                    </div>
                    <span className="meta">Submitting needs at least 30 words here; the full editor checks sources and rights.</span>
                  </div>
                ) : (
                  <>
                    <button type="button" onClick={() => setOpen(isOpen ? null : s.id)} aria-expanded={isOpen} className="tbtn h" style={{ fontSize: "19px", color: s.status === "rejected" ? "var(--slate)" : undefined }}>{s.title}</button>
                    {s.note && (
                      <div style={{ background: s.status === "rejected" ? "var(--paper)" : "var(--st-red-bg)", borderLeft: `4px solid ${s.status === "rejected" ? "var(--line-2)" : "var(--red)"}`, borderRadius: "0 8px 8px 0", padding: "11px 15px" }}>
                        <div style={{ fontSize: "11px", fontWeight: 800, letterSpacing: ".1em", color: s.status === "rejected" ? "var(--slate)" : "var(--red-deep)", marginBottom: "4px" }}>{s.status === "rejected" ? "REASON" : "EDITOR'S NOTE"}</div>
                        <div style={{ fontSize: "13.5px", fontWeight: 500, lineHeight: 1.6, color: "var(--fg-3)" }}>{s.note}</div>
                      </div>
                    )}
                    {isOpen && <div style={{ background: "var(--paper)", borderRadius: "10px", padding: "12px 15px", fontSize: "13.5px", fontWeight: 500, lineHeight: 1.65, whiteSpace: "pre-wrap" }}>{s.excerpt || <span className="meta">No text yet.</span>}</div>}
                    {s.status === "pending" && <p style={{ margin: 0, lineHeight: 1.5 }} className="meta">With the editors; the text is locked while in review. Withdraw it to draft to change it.</p>}
                    {s.status === "published" && <p style={{ margin: 0, lineHeight: 1.5 }} className="meta">While an edit is in review the live article stays as it is; the new version replaces it once approved.</p>}
                  </>
                )}
              </div>
              {!isEdit && (
                <div className="acts">
                  <button type="button" className="btn" onClick={() => setOpen(isOpen ? null : s.id)}>{isOpen ? "Hide text" : "View"}</button>
                  {(s.status === "draft" || s.status === "changes_requested" || s.status === "withdrawn") && <button type="button" className="btn dark" onClick={() => startEdit(s)}>{s.status === "changes_requested" ? "Edit & resubmit" : "Continue editing"}</button>}
                  {s.status === "pending" && <ConfirmBtn label="Withdraw to draft" confirm="Withdraw" onConfirm={() => { upd(s.id, { status: "draft", submitted: undefined, updated: today() }); toast("Withdrawn to draft. You can edit and resubmit."); }} />}
                  {s.status === "published" && <>{s.href && <Link href={s.href} className="btn">View live</Link>}<button type="button" className="btn" disabled={s.editPending} onClick={() => { upd(s.id, { editPending: true }); toast("Edit sent for review. The live article is unchanged until it is approved."); }}>{s.editPending ? "Edit in review" : "Submit an edit"}</button></>}
                  {s.status === "draft" && <ConfirmBtn label="Delete" confirm="Delete draft" danger onConfirm={() => remove(s)} />}
                  {s.status === "rejected" && <Link href="/policies/submission-guidelines/" className="btn">Guidelines</Link>}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </>
  );
}

/* -------------------------------- Comments -------------------------------- */
const COM: Record<CommentStatus, [string, Tone]> = { pending: ["PENDING", "amber"], approved: ["APPROVED", "green"], rejected: ["NOT APPROVED", "grey"], removed: ["REMOVED", "grey"] };

export function Comments() {
  const { d, set, toast } = useDemo();
  const [f, setF] = useState<"all" | CommentStatus>("all");
  const [edit, setEdit] = useState<{ id: string; text: string } | null>(null);
  const n = (s: CommentStatus) => d.comments.filter((c) => c.status === s).length;
  const list = d.comments.filter((c) => f === "all" || c.status === f);
  return (
    <>
      <Head title="My comments" sub="Comments appear to other readers once approved. Editing an approved comment sends it back to review." />
      <Chips label="Filter comments" value={f} onChange={setF} items={[{ k: "all", label: "All", n: d.comments.length }, { k: "approved", label: "Approved", n: n("approved") }, { k: "pending", label: "Pending", n: n("pending") }, { k: "rejected", label: "Not approved", n: n("rejected") }]} />
      <div className="panel">
        {list.length === 0 && <div style={{ padding: "20px" }}><Empty>No comments here.</Empty></div>}
        {list.map((c) => (
          <div key={c.id} className="row">
            <div style={{ flex: "1 1 auto", display: "flex", flexDirection: "column", gap: "7px", minWidth: 0 }}>
              <div style={{ display: "flex", gap: "9px", alignItems: "center", flexWrap: "wrap" }}><Pill tone={COM[c.status][1]}>{COM[c.status][0]}</Pill><span className="meta">{c.date}</span></div>
              <Link href={c.on.href} style={{ fontSize: "12.5px", fontWeight: 800, color: "var(--red-text)" }}>On: {c.on.title}</Link>
              {edit?.id === c.id ? (
                <>
                  <textarea className="inp" rows={3} value={edit.text} maxLength={1500} onChange={(e) => setEdit({ id: c.id, text: e.target.value })} aria-label="Edit comment" />
                  <div style={{ display: "flex", gap: "8px" }}>
                    <button type="button" className="btn dark" disabled={!edit.text.trim()} onClick={() => { set((x) => ({ ...x, comments: x.comments.map((y) => (y.id === c.id ? { ...y, text: edit.text, status: "pending", date: today() } : y)) })); setEdit(null); toast(c.status === "approved" ? "Saved. The comment is back in review and hidden until approved." : "Saved."); }}>Save</button>
                    <button type="button" className="btn" onClick={() => setEdit(null)}>Cancel</button>
                  </div>
                </>
              ) : <span style={{ fontSize: "14px", fontWeight: 500, lineHeight: 1.6 }}>{c.text}</span>}
              {c.reason && <span className="meta">Reason: {c.reason}</span>}
            </div>
            {edit?.id !== c.id && (
              <div className="acts">
                {c.status !== "removed" && <button type="button" className="btn" onClick={() => setEdit({ id: c.id, text: c.text })}>Edit</button>}
                <ConfirmBtn label="Delete" confirm="Delete" danger onConfirm={() => { const before = d.comments; set((x) => ({ ...x, comments: x.comments.filter((y) => y.id !== c.id) })); toast("Comment deleted.", () => set((x) => ({ ...x, comments: before }))); }} />
              </div>
            )}
          </div>
        ))}
      </div>
    </>
  );
}

/* ------------------------------ Author profile ----------------------------- */
export function AuthorProfile() {
  const { d, set, toast } = useDemo();
  const [a, setA] = useState(d.author);
  const [tag, setTag] = useState("");
  const dirty = JSON.stringify(a) !== JSON.stringify(d.author);
  const urlBad = (v: string) => v !== "" && !/^https?:\/\/\S+\.\S+/.test(v);
  const addTag = () => { const t = tag.trim(); if (t && a.expertise.length < 5 && !a.expertise.includes(t)) setA({ ...a, expertise: [...a.expertise, t] }); setTag(""); };
  return (
    <>
      <Head title="Author profile" sub="Shown on your author page and on the author card of every article you publish. Only accounts with a published article have one." actions={<Link href="/authors/mei-lin/" className="btn">See an author page</Link>} />
      <Card>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: "10px", flexWrap: "wrap" }}>
          <span style={{ fontSize: "16px" }} className="h">By-line: {d.profile.name}</span>
          <label style={{ display: "flex", alignItems: "center", gap: "9px", fontSize: "13.5px", fontWeight: 700, cursor: "pointer" }}><input type="checkbox" className="sw" checked={a.visible} onChange={(e) => setA({ ...a, visible: e.target.checked })} /> Public author page</label>
        </div>
        <Field id="ab" label="BIO" aside={<span className="meta">{a.bio.length} / 300</span>}><textarea id="ab" rows={3} className="inp" maxLength={300} value={a.bio} onChange={(e) => setA({ ...a, bio: e.target.value })} /></Field>
        <div className="g2f" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
          <Field id="ae" label="PUBLIC EMAIL" hint="Gets scraped; use a forwarding address."><input id="ae" type="email" className="inp" value={a.publicEmail} placeholder="author@yourdomain.com" onChange={(e) => setA({ ...a, publicEmail: e.target.value })} /></Field>
          <Field id="al" label="LINKEDIN" hint={urlBad(a.linkedin) ? <span style={{ color: "var(--red-text)" }}>Start with https://</span> : undefined}><input id="al" type="url" className="inp" value={a.linkedin} placeholder="https://linkedin.com/in/…" onChange={(e) => setA({ ...a, linkedin: e.target.value })} /></Field>
          <Field id="ax" label="X / TWITTER"><input id="ax" className="inp" value={a.x} placeholder="@handle" onChange={(e) => setA({ ...a, x: e.target.value.replace(/\s/g, "") })} /></Field>
          <Field id="aw" label="WEBSITE" hint={urlBad(a.website) ? <span style={{ color: "var(--red-text)" }}>Start with https://</span> : undefined}><input id="aw" type="url" className="inp" value={a.website} placeholder="https://" onChange={(e) => setA({ ...a, website: e.target.value })} /></Field>
        </div>
        <Field id="af" label={`FIELDS OF EXPERTISE · ${a.expertise.length} / 5`}>
          <div style={{ display: "flex", gap: "6px", flexWrap: "wrap", alignItems: "center" }}>
            {a.expertise.map((t) => <span key={t} className="tagx">{t}<button type="button" aria-label={`Remove ${t}`} onClick={() => setA({ ...a, expertise: a.expertise.filter((x) => x !== t) })}>×</button></span>)}
            {a.expertise.length < 5 && <input id="af" className="inp" style={{ flex: "1 1 180px", width: "auto" }} value={tag} placeholder="Type and press Enter" onChange={(e) => setTag(e.target.value)} onKeyDown={(e) => { if (e.key === "Enter" || e.key === ",") { e.preventDefault(); addTag(); } }} onBlur={addTag} />}
          </div>
        </Field>
        <div className="note">Your registration email is never shown. Changing the by-line name needs an editor&apos;s confirmation, and by-lines on published articles do not change with the account name.</div>
        <div style={{ display: "flex", gap: "8px", alignItems: "center", flexWrap: "wrap" }}>
          <button type="button" className="btn dark" disabled={!dirty || urlBad(a.linkedin) || urlBad(a.website)} onClick={() => { set((x) => ({ ...x, author: a })); toast("Author profile saved."); }}>Save</button>
          <button type="button" className="btn" disabled={!dirty} onClick={() => setA(d.author)}>Discard changes</button>
          {dirty && <span className="meta">Unsaved changes</span>}
        </div>
      </Card>
      <Card>
        <span className="lbl" style={{ color: "var(--slate)" }}>PREVIEW · AUTHOR CARD</span>
        <div style={{ display: "flex", gap: "14px", alignItems: "flex-start", opacity: a.visible ? 1 : .5 }}>
          <Avatar size={56} />
          <div style={{ minWidth: 0 }}>
            <div style={{ fontSize: "17px" }} className="h">{d.profile.name}</div>
            <div className="meta" style={{ marginBottom: "6px" }}>{d.profile.jobTitle}{d.profile.company ? ` · ${d.profile.company}` : ""}</div>
            <div style={{ fontSize: "13.5px", fontWeight: 500, lineHeight: 1.6 }}>{a.bio || <span className="meta">No bio yet.</span>}</div>
            <div style={{ display: "flex", gap: "6px", flexWrap: "wrap", marginTop: "8px" }}>{a.expertise.map((t) => <span key={t} className="st" style={{ background: "var(--paper)", color: "var(--fg-3)" }}>{t}</span>)}</div>
            <div className="meta" style={{ marginTop: "8px" }}>{[a.publicEmail, a.linkedin && "LinkedIn", a.x, a.website && a.website.replace(/^https?:\/\//, "")].filter(Boolean).join(" · ") || "No public links"}</div>
          </div>
        </div>
        {!a.visible && <span className="meta">Hidden: your by-line still appears on published articles, without a link to an author page.</span>}
      </Card>
    </>
  );
}

export function Avatar({ size = 46 }: { size?: number }) {
  const { d } = useDemo();
  return (
    <span style={{ width: size, height: size, borderRadius: "999px", background: "var(--ink)", color: "var(--on-ink)", display: "inline-flex", alignItems: "center", justifyContent: "center", fontSize: size * .34, fontWeight: 800, flexShrink: 0, overflow: "hidden" }}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      {d.profile.avatar ? <img src={d.profile.avatar} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} /> : d.profile.initials}
    </span>
  );
}

/* -------------------------------- Bookmarks -------------------------------- */
const BK: Record<Bookmark["kind"], string> = { article: "Articles", company: "Companies", standard: "Standards", event: "Events" };
export function Bookmarks() {
  const { d, set, toast } = useDemo();
  const [f, setF] = useState<"all" | Bookmark["kind"]>("all");
  const [q, setQ] = useState("");
  const [sort, setSort] = useState<"new" | "az">("new");
  const list = d.bookmarks.filter((b) => (f === "all" || b.kind === f) && b.title.toLowerCase().includes(q.toLowerCase())).sort((a, b) => (sort === "az" ? a.title.localeCompare(b.title) : 0));
  const n = (k: Bookmark["kind"]) => d.bookmarks.filter((b) => b.kind === k).length;
  return (
    <>
      <Head title="Bookmarks" sub="Saved from articles, the directory, the standards index and the events calendar." />
      <div style={{ display: "flex", gap: "10px", flexWrap: "wrap", alignItems: "center", justifyContent: "space-between" }}>
        <Chips label="Filter bookmarks" value={f} onChange={setF} items={[{ k: "all", label: "All", n: d.bookmarks.length }, ...(Object.keys(BK) as Bookmark["kind"][]).filter((k) => n(k)).map((k) => ({ k, label: BK[k], n: n(k) }))]} />
        <div style={{ display: "flex", gap: "8px" }}>
          <input className="inp" style={{ width: "200px" }} placeholder="Search bookmarks" value={q} onChange={(e) => setQ(e.target.value)} aria-label="Search bookmarks" />
          <select className="inp" style={{ width: "auto" }} value={sort} onChange={(e) => setSort(e.target.value as "new" | "az")} aria-label="Sort"><option value="new">Newest</option><option value="az">A – Z</option></select>
        </div>
      </div>
      <div className="panel">
        {list.length === 0 && <div style={{ padding: "20px" }}><Empty>{d.bookmarks.length ? "No bookmarks match." : "No bookmarks yet. Use the bookmark icon on any article, company or standard."}</Empty></div>}
        {list.map((b) => (
          <div key={b.id} className="row" style={{ alignItems: "center" }}>
            <span className="bkic">{b.kind === "article" ? "ART" : b.kind === "company" ? "CO" : b.kind === "standard" ? "STD" : "EVT"}</span>
            <Link href={b.href} style={{ flex: "1 1 auto", minWidth: 0, display: "flex", flexDirection: "column", gap: "3px" }}><span style={{ fontSize: "15px", fontWeight: 800, lineHeight: 1.3 }}>{b.title}</span><span className="meta">{b.meta} · saved {b.saved}</span></Link>
            <button type="button" className="btn sm" onClick={() => { const before = d.bookmarks; set((x) => ({ ...x, bookmarks: x.bookmarks.filter((y) => y.id !== b.id) })); toast("Bookmark removed.", () => set((x) => ({ ...x, bookmarks: before }))); }}>Remove</button>
          </div>
        ))}
      </div>
    </>
  );
}

/* --------------------------------- Messages -------------------------------- */
const MS: Record<MsgStatus, [string, Tone]> = { replied: ["REPLIED", "green"], awaiting_reply: ["AWAITING REPLY", "amber"], no_reply: ["NO REPLY", "grey"], sent: ["SENT", "grey"] };
export function Messages() {
  const { d, set, toast } = useDemo();
  const [f, setF] = useState<"all" | MsgStatus>("all");
  const [open, setOpen] = useState<string | null>(null);
  const list = d.messages.filter((m) => f === "all" || m.status === f);
  const n = (s: MsgStatus) => d.messages.filter((m) => m.status === s).length;
  const exportCsv = () => {
    const rows = [["Sent", "To", "Subject", "Status", "Replied", "Message"], ...d.messages.map((m) => [m.sent, m.to.name, m.subject, MS[m.status][0], m.replied ?? "", m.body.replace(/\s+/g, " ")])];
    download("wire-mesh-news-messages.csv", rows.map((r) => r.map((c) => `"${c.replace(/"/g, '""')}"`).join(",")).join("\n"), "text/csv");
    toast("Your message record was downloaded as CSV.");
  };
  return (
    <>
      <Head title="My messages" sub="Messages you sent through “Contact this company”. Companies reply to your email directly; there is no on-site chat." actions={<><button type="button" className="btn" onClick={exportCsv}>Export record (CSV)</button><Link href="/directory/" className="btn dark">Browse the directory</Link></>} />
      <Chips label="Filter messages" value={f} onChange={setF} items={[{ k: "all", label: "All", n: d.messages.length }, { k: "replied", label: "Replied", n: n("replied") }, { k: "awaiting_reply", label: "Awaiting reply", n: n("awaiting_reply") }, { k: "no_reply", label: "No reply", n: n("no_reply") }]} />
      <div className="panel">
        {list.length === 0 && <div style={{ padding: "20px" }}><Empty>No messages here.</Empty></div>}
        {list.map((m: Message) => (
          <div key={m.id} className="row">
            <div style={{ flex: "1 1 auto", display: "flex", flexDirection: "column", gap: "6px", minWidth: 0 }}>
              <div style={{ display: "flex", alignItems: "center", gap: "9px", flexWrap: "wrap" }}><Pill tone={MS[m.status][1]}>{MS[m.status][0]}</Pill><span className="meta">Sent {m.sent}{m.replied ? ` · replied ${m.replied}` : m.status === "no_reply" ? " · no reply after 14 days" : ""}</span></div>
              <button type="button" onClick={() => setOpen(open === m.id ? null : m.id)} aria-expanded={open === m.id} className="tbtn" style={{ fontSize: "15px", fontWeight: 800 }}>{m.subject}</button>
              <span className="meta">To <Link href={m.to.href} style={{ color: "var(--red-text)", fontWeight: 800 }}>{m.to.name}</Link></span>
              {open === m.id && (
                <div style={{ background: "var(--paper)", borderRadius: "10px", padding: "12px 15px", fontSize: "13.5px", fontWeight: 500, lineHeight: 1.65 }}>
                  <div className="meta" style={{ marginBottom: "6px" }}>{ENQUIRY_SUBJECT.find((e) => m.subject.startsWith(e.label))?.label ?? "Enquiry"}{m.product ? ` · ${m.product}` : ""}{m.quantity ? ` · ${m.quantity}` : ""}</div>
                  <div style={{ whiteSpace: "pre-wrap" }}>{m.body}</div>
                </div>
              )}
            </div>
            <div className="acts">
              <button type="button" className="btn" onClick={() => setOpen(open === m.id ? null : m.id)}>{open === m.id ? "Hide" : "Read"}</button>
              {m.status === "awaiting_reply" && <button type="button" className="btn" onClick={() => { set((x) => ({ ...x, messages: x.messages.map((y) => (y.id === m.id ? { ...y, status: "replied", replied: today() } : y)) })); toast("Marked as replied."); }}>Mark replied</button>}
              {m.status !== "awaiting_reply" && <Link href={`${m.to.href}contact/`} className="btn">Write again</Link>}
            </div>
          </div>
        ))}
      </div>
      <div style={{ background: "var(--paper)", borderRadius: "10px", padding: "12px 15px", fontSize: "12.5px", fontWeight: 500, lineHeight: 1.6, color: "var(--fg-3)" }}>We <b>do not guarantee a reply</b> and we do not chase on your behalf. Reply rates are not published: statistics from samples this small mislead.</div>
    </>
  );
}
