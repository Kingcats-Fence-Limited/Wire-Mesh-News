"use client";

/* Account panels about the person and the account: overview, profile, notifications,
   settings. */
import Link from "next/link";
import { useState } from "react";
import { useDemo, download, today, type Notice } from "./store";
import { Head, Card, Field, Pill, Chips, ConfirmBtn, Empty, Toggle } from "./ui";
import { Avatar, openSubmissions } from "./PanelsContent";
import { CodeVerify } from "@/components/ui/CodeVerify";
import { COUNTRY, COUNTRY_BY_CODE } from "@/data/vocab/country";

const COUNTRIES = COUNTRY.slice().sort((a, b) => a.name.localeCompare(b.name));

/* --------------------------------- Overview -------------------------------- */
export function Overview({ companyName }: { companyName: string }) {
  const { d, go } = useDemo();
  const unread = d.notices.filter((n) => !n.read && !n.archived);
  const action = d.submissions.filter((s) => s.status === "changes_requested");
  const pending = d.submissions.filter((s) => s.status === "pending").length;
  const published = d.submissions.filter((s) => s.status === "published").length;
  const profileDone = [d.profile.name, d.profile.jobTitle, d.profile.company, d.profile.city, d.profile.avatar, d.author.bio, d.author.expertise.length > 0].filter(Boolean).length;
  const pct = Math.round((profileDone / 7) * 100);
  const Stat = ({ n, label, to, f }: { n: number | string; label: string; to: string; f?: "pending" | "published" }) => (
    <button type="button" onClick={() => (f ? openSubmissions(go, { f }) : go(to))} className="stat"><span className="h" style={{ fontSize: "30px" }}>{n}</span><span className="meta" style={{ fontWeight: 700 }}>{label}</span></button>
  );
  return (
    <>
      <Head title={`Welcome back, ${d.profile.name.split(" ")[0]}`} sub={`Member since ${d.profile.since}. Here is what needs you, and what changed since your last visit.`} />
      <div className="stats">
        <Stat n={pending} label="In review" to="submissions" f="pending" />
        <Stat n={published} label="Published" to="submissions" f="published" />
        <Stat n={unread.length} label="Unread notifications" to="notifications" />
        <Stat n={d.bookmarks.length} label="Bookmarks" to="bookmarks" />
      </div>
      <div className="g2f" style={{ display: "grid", gridTemplateColumns: "1.3fr 1fr", gap: "16px", alignItems: "start" }}>
        <Card>
          <span style={{ fontSize: "17px" }} className="h">Needs your attention</span>
          {action.length === 0 && unread.length === 0 && <Empty>Nothing waiting on you.</Empty>}
          {action.map((s) => (
            <button key={s.id} type="button" onClick={() => openSubmissions(go, { f: "changes_requested" })} className="todo"><Pill tone="red">CHANGES REQUESTED</Pill><span style={{ fontWeight: 800 }}>{s.title}</span><span className="meta">{s.note}</span></button>
          ))}
          {unread.slice(0, 3).map((n) => (
            <button key={n.id} type="button" onClick={() => go("notifications")} className="todo"><span style={{ display: "flex", gap: "8px", alignItems: "center" }}><span className="dot" />{n.date}</span><span style={{ fontWeight: 700 }}>{n.text}</span></button>
          ))}
        </Card>
        <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          <Card>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}><span style={{ fontSize: "17px" }} className="h">Profile completeness</span><b>{pct}%</b></div>
            <div style={{ height: "8px", borderRadius: "999px", background: "var(--line)", overflow: "hidden" }}><div style={{ width: `${pct}%`, height: "100%", background: "var(--red)" }} /></div>
            <span className="meta">A photo, job title and a short bio make your by-line credible to readers.</span>
            <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}><button type="button" className="btn sm dark" onClick={() => go("profile")}>Edit profile</button><button type="button" className="btn sm" onClick={() => go("author")}>Author profile</button></div>
          </Card>
          <Card>
            <span style={{ fontSize: "17px" }} className="h">Quick actions</span>
            <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
              <button type="button" className="btn dark" style={{ justifyContent: "flex-start" }} onClick={() => openSubmissions(go, { fresh: true })}>Write a new submission</button>
              <button type="button" className="btn" style={{ justifyContent: "flex-start" }} onClick={() => go("company")}>Update {companyName}</button>
              <button type="button" className="btn" style={{ justifyContent: "flex-start" }} onClick={() => go("billing")}>Subscription &amp; invoices</button>
            </div>
          </Card>
        </div>
      </div>
    </>
  );
}

/* --------------------------------- Profile --------------------------------- */
export function Profile() {
  const { d, set, toast } = useDemo();
  const [p, setP] = useState(d.profile);
  const [err, setErr] = useState<string | null>(null);
  const dirty = JSON.stringify(p) !== JSON.stringify(d.profile);
  const onAvatar = (file?: File) => {
    if (!file) return;
    if (!/^image\/(png|jpeg|webp)$/.test(file.type) || file.size > 3 * 1024 * 1024) { setErr("PNG, JPG or WebP up to 3 MB."); return; }
    setErr(null);
    const r = new FileReader();
    r.onload = () => setP((x) => ({ ...x, avatar: String(r.result) }));
    r.readAsDataURL(file);
  };
  const initials = (n: string) => n.trim().split(/\s+/).map((w) => w[0]).slice(0, 2).join("").toUpperCase() || "?";
  return (
    <>
      <Head title="Profile" sub="How you appear next to your comments and submissions. Your email address is never shown publicly." />
      <Card>
        <div style={{ display: "flex", gap: "18px", alignItems: "center", flexWrap: "wrap" }}>
          <span style={{ width: 84, height: 84, borderRadius: "999px", background: "var(--ink)", color: "var(--on-ink)", display: "inline-flex", alignItems: "center", justifyContent: "center", fontSize: "28px", fontWeight: 800, overflow: "hidden", flexShrink: 0 }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            {p.avatar ? <img src={p.avatar} alt="Your photo" style={{ width: "100%", height: "100%", objectFit: "cover" }} /> : initials(p.name)}
          </span>
          <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
            <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
              <label className="btn" style={{ position: "relative", cursor: "pointer" }}>{p.avatar ? "Change photo" : "Upload photo"}<input type="file" accept="image/png,image/jpeg,image/webp" onChange={(e) => { onAvatar(e.target.files?.[0]); e.target.value = ""; }} style={{ position: "absolute", inset: 0, opacity: 0, cursor: "pointer" }} /></label>
              {p.avatar && <button type="button" className="btn" onClick={() => setP({ ...p, avatar: null })}>Remove</button>}
            </div>
            <span className="meta">Square, PNG / JPG / WebP, up to 3 MB. Initials are used when there is no photo.</span>
            {err && <span role="alert" className="meta" style={{ color: "var(--red-text)" }}>{err}</span>}
          </div>
        </div>
        <div className="g2f" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
          <Field id="pf-n" label="DISPLAY NAME" hint="Use your real name; the by-line policy requires it. It is used on new submissions; published by-lines stay as printed."><input id="pf-n" className="inp" value={p.name} maxLength={60} onChange={(e) => setP({ ...p, name: e.target.value, initials: initials(e.target.value) })} /></Field>
          <Field id="pf-j" label="JOB TITLE"><input id="pf-j" className="inp" value={p.jobTitle} maxLength={80} onChange={(e) => setP({ ...p, jobTitle: e.target.value })} /></Field>
          <Field id="pf-c" label="COMPANY"><input id="pf-c" className="inp" value={p.company} maxLength={80} onChange={(e) => setP({ ...p, company: e.target.value })} /></Field>
          <Field id="pf-k" label="COUNTRY / TERRITORY"><select id="pf-k" className="inp" value={p.country} onChange={(e) => setP({ ...p, country: e.target.value })}>{COUNTRIES.map((c) => <option key={c.alpha2} value={c.alpha2}>{c.name}</option>)}</select></Field>
          <Field id="pf-t" label="CITY"><input id="pf-t" className="inp" value={p.city} maxLength={60} onChange={(e) => setP({ ...p, city: e.target.value })} /></Field>
        </div>
        <div style={{ display: "flex", gap: "8px", alignItems: "center", flexWrap: "wrap" }}>
          <button type="button" className="btn dark" disabled={!dirty || !p.name.trim()} onClick={() => { set((x) => ({ ...x, profile: p })); toast("Profile saved."); }}>Save profile</button>
          <button type="button" className="btn" disabled={!dirty} onClick={() => setP(d.profile)}>Discard</button>
          {dirty && <span className="meta">Unsaved changes</span>}
        </div>
      </Card>
      <Card>
        <span className="lbl" style={{ color: "var(--slate)" }}>HOW OTHERS SEE YOU · NEXT TO A COMMENT</span>
        <div style={{ display: "flex", gap: "12px", alignItems: "flex-start" }}>
          <Avatar size={40} />
          <div><div style={{ fontSize: "14px", fontWeight: 800 }}>{d.profile.name} <span className="meta" style={{ fontWeight: 500 }}>· {d.profile.jobTitle}{d.profile.company ? `, ${d.profile.company}` : ""} · {d.profile.city}{d.profile.country ? `, ${COUNTRY_BY_CODE[d.profile.country]?.name}` : ""}</span></div><div style={{ fontSize: "13.5px", fontWeight: 500, color: "var(--fg-3)", marginTop: "3px" }}>Which edition of EN 10244-2 is the table based on?</div></div>
        </div>
        <span className="meta">The preview updates after you save.</span>
      </Card>
    </>
  );
}

/* ------------------------------ Notifications ------------------------------ */
const KIND: Record<Notice["kind"], string> = { submission: "Submissions", comment: "Comments", company: "Company", billing: "Billing", standard: "Standards" };
export function Notifications() {
  const { d, set, toast, go } = useDemo();
  const [f, setF] = useState<"all" | "unread" | "archived" | Notice["kind"]>("all");
  const live = d.notices.filter((n) => !n.archived);
  const archived = d.notices.filter((n) => n.archived);
  const list = f === "archived" ? archived : live.filter((n) => f === "all" || (f === "unread" ? !n.read : n.kind === f));
  const unread = live.filter((n) => !n.read).length;
  const arch = (id: string, v: boolean) => set((x) => ({ ...x, notices: x.notices.map((n) => (n.id === id ? { ...n, archived: v, read: v ? true : n.read } : n)) }));
  const mark = (id: string, read: boolean) => set((x) => ({ ...x, notices: x.notices.map((n) => (n.id === id ? { ...n, read } : n)) }));
  return (
    <>
      <Head title="Notifications" sub="Only about your own content, company and account. Whether they are also emailed is set under Account settings." actions={<><button type="button" className="btn" disabled={!unread} onClick={() => { const ids = d.notices.filter((n) => !n.read && !n.archived).map((n) => n.id); set((x) => ({ ...x, notices: x.notices.map((n) => ({ ...n, read: true })) })); toast(`${ids.length} marked as read.`, () => set((x) => ({ ...x, notices: x.notices.map((n) => (ids.includes(n.id) ? { ...n, read: false } : n)) }))); }}>Mark all read</button><button type="button" className="btn" onClick={() => go("settings")}>Email settings</button></>} />
      <Chips label="Filter notifications" value={f} onChange={setF} items={[{ k: "all", label: "All", n: live.length }, { k: "unread", label: "Unread", n: unread }, ...(Object.keys(KIND) as Notice["kind"][]).filter((k) => live.some((n) => n.kind === k)).map((k) => ({ k, label: KIND[k] })), { k: "archived", label: "Archived", n: archived.length }]} />
      <div className="panel">
        {list.length === 0 && <div style={{ padding: "20px" }}><Empty>{f === "archived" ? "Nothing archived. Archived notifications are kept here and can be restored." : "You are all caught up."}</Empty></div>}
        {list.map((n) => (
          <div key={n.id} className="row" style={{ alignItems: "center", opacity: n.read ? .72 : 1 }}>
            <span className={n.read ? "dot off" : "dot"} aria-hidden="true" /><span className="sr-only">{n.read ? "Read:" : "Unread:"}</span>
            <div style={{ flex: "1 1 auto", minWidth: 0 }}>
              {n.href ? <Link href={n.href} onClick={() => mark(n.id, true)} style={{ fontSize: "14px", fontWeight: n.read ? 600 : 800, lineHeight: 1.45 }}>{n.text}</Link> : <button type="button" onClick={() => { mark(n.id, true); if (n.kind === "submission") go("submissions"); else if (n.kind === "comment") go("comments"); else if (n.kind === "company") go("company"); else if (n.kind === "billing") go("billing"); }} className="tbtn" style={{ fontSize: "14px", fontWeight: n.read ? 600 : 800, lineHeight: 1.45 }}>{n.text}</button>}
              <div className="meta">{KIND[n.kind]} · {n.date}</div>
            </div>
            <div className="acts" style={{ flexDirection: "row" }}>
              {!n.archived && <button type="button" className="btn sm" onClick={() => mark(n.id, !n.read)}>{n.read ? "Mark unread" : "Mark read"}</button>}
              {n.archived
                ? <button type="button" className="btn sm dark" onClick={() => { arch(n.id, false); toast("Restored to your notifications."); }}>Restore</button>
                : <button type="button" className="btn sm" onClick={() => { arch(n.id, true); toast("Archived. Find it under the Archived filter.", () => arch(n.id, false)); }}>Archive</button>}
            </div>
          </div>
        ))}
      </div>
    </>
  );
}

/* --------------------------------- Settings -------------------------------- */
const strength = (p: string) => [p.length >= 10, /[A-Z]/.test(p) && /[a-z]/.test(p), /\d/.test(p), /[^A-Za-z0-9]/.test(p)].filter(Boolean).length;

export function Settings() {
  const { d, set, toast, reset } = useDemo();
  const [email, setEmail] = useState("");
  const [pw, setPw] = useState({ cur: "", next: "", again: "" });
  const [pwOpen, setPwOpen] = useState(false);
  const [del, setDel] = useState("");
  const s = strength(pw.next);
  const pref = (k: keyof typeof d.prefs, v: boolean) => { set((x) => ({ ...x, prefs: { ...x.prefs, [k]: v } })); toast(v ? "Turned on." : "Turned off."); };
  const emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  return (
    <>
      <Head title="Account settings" sub="Sign-in, email, privacy and the account itself." />
      <Card>
        <span style={{ fontSize: "17px" }} className="h">Sign-in email</span>
        <div style={{ display: "flex", alignItems: "center", gap: "10px", flexWrap: "wrap" }}><b style={{ fontSize: "14px" }}>{d.profile.email}</b><Pill tone="green">VERIFIED</Pill></div>
        {d.profile.pendingEmail ? (
          <div className="compose">
            <CodeVerify compact email={d.profile.pendingEmail} purpose="the new sign-in address" onVerified={() => { set((x) => ({ ...x, profile: { ...x.profile, email: x.profile.pendingEmail!, pendingEmail: null } })); toast("Email verified and changed. Use it next time you sign in."); }} />
            <span className="meta">Until you enter the code you keep signing in with the address above.</span>
            <div><button type="button" className="btn sm" onClick={() => set((x) => ({ ...x, profile: { ...x.profile, pendingEmail: null } }))}>Cancel change</button></div>
          </div>
        ) : (
          <div style={{ display: "flex", gap: "8px", flexWrap: "wrap", alignItems: "flex-end" }}>
            <div style={{ flex: "1 1 240px" }}><Field id="se-new" label="NEW EMAIL"><input id="se-new" type="email" className="inp" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@company.com" /></Field></div>
            <button type="button" className="btn dark" disabled={!emailOk || email.trim().toLowerCase() === d.profile.email.toLowerCase()} onClick={() => { set((x) => ({ ...x, profile: { ...x.profile, pendingEmail: email.trim().toLowerCase() } })); setEmail(""); toast("Code sent to the new address. Your current address gets a notice too, so a change you didn’t make can be stopped."); }}>Change email</button>
          </div>
        )}
      </Card>

      <Card>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: "10px", flexWrap: "wrap" }}><span style={{ fontSize: "17px" }} className="h">Password</span>{!pwOpen && <button type="button" className="btn" onClick={() => setPwOpen(true)}>Change password</button>}</div>
        {!pwOpen ? <span className="meta">Last changed 14 Mar 2026.</span> : (
          <>
            <div className="g2f" style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "12px" }}>
              <Field id="pw-c" label="CURRENT"><input id="pw-c" type="password" autoComplete="current-password" className="inp" value={pw.cur} onChange={(e) => setPw({ ...pw, cur: e.target.value })} /></Field>
              <Field id="pw-n" label="NEW" hint={pw.next ? ["Too weak", "Weak", "Fair", "Good", "Strong"][s] : "10+ characters, mixed case, a number and a symbol"}><input id="pw-n" type="password" autoComplete="new-password" className="inp" value={pw.next} onChange={(e) => setPw({ ...pw, next: e.target.value })} /></Field>
              <Field id="pw-a" label="REPEAT NEW" hint={pw.again && pw.again !== pw.next ? <span style={{ color: "var(--red-text)" }}>Does not match</span> : undefined}><input id="pw-a" type="password" autoComplete="new-password" className="inp" value={pw.again} onChange={(e) => setPw({ ...pw, again: e.target.value })} /></Field>
            </div>
            <div style={{ display: "flex", gap: "4px" }}>{[0, 1, 2, 3].map((i) => <span key={i} style={{ flex: 1, height: "5px", borderRadius: "999px", background: i < s ? (s >= 3 ? "var(--up)" : "var(--st-review-fg)") : "var(--line)" }} />)}</div>
            <div style={{ display: "flex", gap: "8px" }}>
              <button type="button" className="btn dark" disabled={!pw.cur || s < 3 || pw.next !== pw.again || pw.next === pw.cur} onClick={() => { setPw({ cur: "", next: "", again: "" }); setPwOpen(false); toast("Password changed. Other devices were signed out."); set((x) => ({ ...x, sessions: x.sessions.filter((y) => y.current) })); }}>Update password</button>
              <button type="button" className="btn" onClick={() => { setPw({ cur: "", next: "", again: "" }); setPwOpen(false); }}>Cancel</button>
            </div>
          </>
        )}
      </Card>

      <Card>
        <span style={{ fontSize: "17px" }} className="h">Email preferences</span>
        <span className="meta" style={{ marginTop: "-8px" }}>All opt-in; registering does not switch any of them on.</span>
        <div>
          <Toggle id="pr-1" checked={d.prefs.brief} onChange={(v) => pref("brief", v)} label="The weekly brief" hint="One email a week: news, prices and standards." />
          <Toggle id="pr-2" checked={d.prefs.reviewResults} onChange={(v) => pref("reviewResults", v)} label="Review results" hint="When the editors accept, return or decline your submission." />
          <Toggle id="pr-3" checked={d.prefs.commentReplies} onChange={(v) => pref("commentReplies", v)} label="Comment moderation" hint="When a comment of yours is approved or not." />
          <Toggle id="pr-4" checked={d.prefs.standardAlerts} onChange={(v) => pref("standardAlerts", v)} label="Standards you follow" hint="Only for editor-confirmed status changes, new editions and withdrawals." />
          <Toggle id="pr-5" checked={d.prefs.companyEnquiries} onChange={(v) => pref("companyEnquiries", v)} label="Company profile reviews" hint="When an edit to your company profile is approved or returned." />
          <Toggle id="pr-6" checked={d.prefs.productNews} onChange={(v) => pref("productNews", v)} label="Product news from Wire Mesh News" hint="New features and subscriber offers, a few times a year." />
        </div>
      </Card>

      <Card>
        <span style={{ fontSize: "17px" }} className="h">Signed-in devices</span>
        {d.sessions.map((x) => (
          <div key={x.id} style={{ display: "flex", alignItems: "center", gap: "10px", padding: "8px 0", borderTop: "1px solid var(--line)", flexWrap: "wrap" }}>
            <span style={{ flex: "1 1 auto", minWidth: 0 }}><span style={{ fontSize: "14px", fontWeight: 800, display: "block" }}>{x.device}</span><span className="meta">{x.place} · {x.last}</span></span>
            {x.current ? <Pill tone="green">THIS DEVICE</Pill> : <button type="button" className="btn sm" onClick={() => { set((y) => ({ ...y, sessions: y.sessions.filter((z) => z.id !== x.id) })); toast(`Signed out of ${x.device}.`); }}>Sign out</button>}
          </div>
        ))}
        {d.sessions.length > 1 && <button type="button" className="btn" style={{ alignSelf: "flex-start" }} onClick={() => { set((y) => ({ ...y, sessions: y.sessions.filter((z) => z.current) })); toast("Signed out of all other devices."); }}>Sign out everywhere else</button>}
      </Card>

      <Card>
        <span style={{ fontSize: "17px" }} className="h">Your data</span>
        <span className="meta" style={{ marginTop: "-8px" }}>A copy of everything in your account, as JSON. Published articles stay part of the publication; see the Privacy Policy.</span>
        <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
          <button type="button" className="btn" onClick={() => { download(`wire-mesh-news-account-${today().replace(/\s/g, "-")}.json`, JSON.stringify({ exported: new Date().toISOString(), ...d, profile: { ...d.profile, avatar: d.profile.avatar ? "(image)" : null } }, null, 2)); toast("Your data was downloaded."); }}>Download my data</button>
          <Link href="/policies/privacy/" className="btn">Privacy Policy</Link>
        </div>
      </Card>

      <Card style={{ borderColor: "var(--st-red-bg)" }}>
        <span style={{ fontSize: "17px", color: "var(--red-deep)" }} className="h">Delete account</span>
        {d.deactivated ? (
          <><div className="note">Deletion scheduled. The account is closed now and its private data is removed after 30 days unless you sign in again before then.</div><button type="button" className="btn dark" style={{ alignSelf: "flex-start" }} onClick={() => { set((x) => ({ ...x, deactivated: false })); toast("Deletion cancelled. Welcome back."); }}>Cancel deletion</button></>
        ) : (
          <>
            <span className="meta">Closes the account, ends any subscription at the end of its period and removes your private data after 30 days. Published work keeps its by-line.</span>
            <div style={{ display: "flex", gap: "8px", flexWrap: "wrap", alignItems: "flex-end" }}>
              <div style={{ flex: "1 1 220px" }}><Field id="del" label='TYPE "DELETE" TO CONFIRM'><input id="del" className="inp" value={del} onChange={(e) => setDel(e.target.value)} autoComplete="off" /></Field></div>
              <button type="button" className="btn danger-solid" disabled={del !== "DELETE"} onClick={() => { set((x) => ({ ...x, deactivated: true, billing: { ...x.billing, cancelled: true, nextCycle: null } })); setDel(""); toast("Account deletion scheduled (demo). The subscription will not renew."); }}>Delete my account</button>
            </div>
          </>
        )}
      </Card>

      <Card style={{ background: "var(--paper)" }}>
        <span style={{ fontSize: "15px" }} className="h">Preview tools</span>
        <span className="meta">Your edits to this sample account are kept in this browser so you can review them. Reset to start from the original sample data.</span>
        <div><ConfirmBtn label="Reset demo data" confirm="Reset everything" danger onConfirm={reset} /></div>
      </Card>
    </>
  );
}
