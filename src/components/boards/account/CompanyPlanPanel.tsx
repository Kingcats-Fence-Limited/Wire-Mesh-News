"use client";

/* My company → Company plan: profile analytics, tenders for the company's products, and the
   extras shown on the public profile (catalogue, video, contacts; reviewed by the editor). */
import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { uploadFile, useDemo } from "./store";
import { COUNTRY_BY_CODE } from "@/data/vocab/country";

type A = { locked?: boolean; views?: { day: string; views: number }[]; countries?: { country: string; views: number }[]; enquiries?: number; saves?: number; totalViews?: number; tenders?: { id: string; title: string; country: string | null; deadline: string | null; url: string | null }[]; products?: string[] };
type Contact = { name: string; role: string; email: string; phone: string };
type Ex = { catalogue: string | null; video_url: string | null; contacts: Contact[] | null; status: string; editor_note: string | null };
const day = (iso: string | null) => (iso ? new Intl.DateTimeFormat("en-GB", { day: "numeric", month: "short" }).format(new Date(iso)) : "—");

export function CompanyPlanPanel() {
  const { toast } = useDemo();
  const [a, setA] = useState<A | null>(null);
  const [ex, setEx] = useState<{ current: Ex | null; pending: Ex | null } | null>(null);
  const [form, setForm] = useState<{ catalogue: string | null; catalogueName: string; video: string; contacts: Contact[] }>({ catalogue: null, catalogueName: "", video: "", contacts: [] });
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  const load = useCallback(async () => {
    const r = await fetch("/api/me/company/analytics/").catch(() => null);
    const j = (await r?.json().catch(() => null)) as A | null;
    setA(j ?? { locked: true });
    if (j && !j.locked) {
      const e = await fetch("/api/me/company/extras/").then((x) => x.json()).catch(() => null) as { current: Ex | null; pending: Ex | null } | null;
      setEx(e);
      const base = e?.pending ?? e?.current;
      if (base) setForm({ catalogue: base.catalogue, catalogueName: base.catalogue ? "Current catalogue" : "", video: base.video_url ?? "", contacts: base.contacts ?? [] });
    }
  }, []);
  useEffect(() => { void load(); }, [load]);

  if (!a) return <div className="mini" role="status" style={{ gridColumn: "1 / -1" }}>Loading company plan…</div>;
  if (a.locked) {
    return (
      <div className="mini" style={{ gridColumn: "1 / -1", display: "flex", flexDirection: "column", gap: "10px" }}>
        <div className="minihd"><span style={{ fontSize: "17px" }} className="h">Company plan</span><span className="st" style={{ background: "var(--line)", color: "var(--slate)" }}>NOT ACTIVE</span></div>
        <span style={{ fontSize: "14px", fontWeight: 500, lineHeight: 1.6 }}>See who views your profile and where they come from, get tenders matched to your products, and add a catalogue, video and extra contacts to your public profile.</span>
        <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}><Link href="/account/#billing" className="btn dark">Start 14-day free trial</Link><Link href="/pricing/#sponsor" className="btn">Directory Sponsor</Link></div>
      </div>
    );
  }
  const max = Math.max(1, ...(a.views ?? []).map((v) => v.views));
  const save = async () => {
    setBusy(true); setErr(null);
    const r = await fetch("/api/me/company/extras/", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ catalogue: form.catalogue, video_url: form.video, contacts: form.contacts }) }).catch(() => null);
    setBusy(false);
    if (!r?.ok) { setErr(((await r?.json().catch(() => ({}))) as { error?: string } | undefined)?.error ?? "Could not send. Try again."); return; }
    toast("Sent to the directory editor. It shows on your profile once approved."); void load();
  };
  const setC = (i: number, k: keyof Contact, v: string) => setForm((f) => ({ ...f, contacts: f.contacts.map((c, j) => (j === i ? { ...c, [k]: v } : c)) }));
  return (
    <div className="mini" style={{ gridColumn: "1 / -1", display: "flex", flexDirection: "column", gap: "18px" }}>
      <div className="minihd"><span style={{ fontSize: "17px" }} className="h">Company plan · last 90 days</span><span className="st" style={{ background: "var(--st-current-bg)", color: "var(--up)" }}>ACTIVE</span></div>
      <div className="g3f" style={{ display: "grid", gridTemplateColumns: "repeat(3, minmax(0,1fr))", gap: "10px" }}>
        {[["Profile views", a.totalViews ?? 0], ["Enquiries", a.enquiries ?? 0], ["Saved by readers", a.saves ?? 0]].map(([l, n]) => <div key={l as string} style={{ border: "1px solid var(--line)", borderRadius: "12px", padding: "12px 14px" }}><div className="meta" style={{ fontWeight: 800 }}>{String(l).toUpperCase()}</div><div style={{ fontSize: "26px", fontWeight: 800 }}>{n as number}</div></div>)}
      </div>
      {(a.views?.length ?? 0) > 0 && (
        <div role="img" aria-label="Profile views per day" style={{ display: "flex", alignItems: "flex-end", gap: "2px", height: "70px", borderBottom: "1px solid var(--ink)" }}>
          {a.views!.map((v) => <div key={v.day} title={`${day(v.day)}: ${v.views}`} style={{ flex: "1 1 0", height: `${Math.max(3, (v.views / max) * 100)}%`, background: "var(--ink)", borderRadius: "2px 2px 0 0" }} />)}
        </div>
      )}
      {(a.countries?.length ?? 0) > 0 && <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>{a.countries!.map((c) => <span key={c.country} className="st" style={{ background: "var(--paper)", color: "var(--ink)" }}>{(COUNTRY_BY_CODE[c.country]?.name ?? (c.country || "Unknown")).toUpperCase()} · {c.views}</span>)}</div>}

      <div style={{ borderTop: "1px solid var(--line)", paddingTop: "14px" }}>
        <span style={{ fontSize: "15px" }} className="h">Open tenders for your products</span>
        <span className="meta" style={{ display: "block", margin: "2px 0 8px" }}>{a.products?.join(" · ")}</span>
        {(a.tenders?.length ?? 0) === 0 ? <span className="meta">None right now. New ones appear here as editors publish them; <Link href="/tenders/#alerts" style={{ color: "var(--red-text)", fontWeight: 800 }}>set an email alert</Link>.</span> : a.tenders!.map((t) => (
          <div key={t.id} style={{ display: "flex", gap: "10px", alignItems: "center", padding: "7px 0", borderBottom: "1px solid var(--line)", flexWrap: "wrap" }}>
            <span style={{ flex: "1 1 240px", fontSize: "13.5px", fontWeight: 700 }}>{t.url ? <a href={t.url} target="_blank" rel="noopener noreferrer nofollow">{t.title}</a> : t.title}</span>
            <span className="meta">{COUNTRY_BY_CODE[t.country ?? ""]?.name ?? t.country} · deadline {day(t.deadline)}</span>
          </div>
        ))}
      </div>

      <div style={{ borderTop: "1px solid var(--line)", paddingTop: "14px", display: "flex", flexDirection: "column", gap: "10px" }}>
        <span style={{ fontSize: "15px" }} className="h">On your public profile</span>
        {ex?.pending && <div className="note">An update is with the directory editor. The profile shows the approved version until then.</div>}
        {ex?.current?.editor_note && <span className="meta">Editor: {ex.current.editor_note}</span>}
        <div style={{ display: "flex", gap: "8px", alignItems: "center", flexWrap: "wrap" }}>
          <label className="btn" style={{ position: "relative", cursor: "pointer" }}>{form.catalogue ? "Replace catalogue (PDF)" : "Upload catalogue (PDF)"}<input type="file" accept="application/pdf" style={{ position: "absolute", inset: 0, opacity: 0, cursor: "pointer" }} onChange={async (e) => { const f = e.target.files?.[0]; e.target.value = ""; if (!f) return; setErr(null); try { const r = await uploadFile(f, "company"); if (r.kind !== "pdf") throw new Error("Use a PDF."); setForm((x) => ({ ...x, catalogue: r.id, catalogueName: f.name })); } catch (er) { setErr((er as Error).message); } }} /></label>
          {form.catalogue && <span className="meta">{form.catalogueName} <button type="button" className="tbtn" onClick={() => setForm((x) => ({ ...x, catalogue: null, catalogueName: "" }))}>Remove</button></span>}
        </div>
        <label style={{ display: "flex", flexDirection: "column", gap: "4px" }}><span className="lbl">VIDEO (YOUTUBE OR VIMEO LINK)</span><input className="inp" value={form.video} onChange={(e) => setForm({ ...form, video: e.target.value.trim() })} placeholder="https://www.youtube.com/watch?v=…" /></label>
        <span className="lbl">CONTACTS (UP TO 5)</span>
        {form.contacts.map((c, i) => (
          <div key={i} className="g4f" style={{ display: "grid", gridTemplateColumns: "repeat(4, minmax(0,1fr)) auto", gap: "6px" }}>
            <input className="inp" aria-label="Name" placeholder="Name" value={c.name} onChange={(e) => setC(i, "name", e.target.value)} />
            <input className="inp" aria-label="Role" placeholder="Role" value={c.role} onChange={(e) => setC(i, "role", e.target.value)} />
            <input className="inp" aria-label="Email" placeholder="Email" value={c.email} onChange={(e) => setC(i, "email", e.target.value)} />
            <input className="inp" aria-label="Phone" placeholder="Phone" value={c.phone} onChange={(e) => setC(i, "phone", e.target.value)} />
            <button type="button" className="btn sm" onClick={() => setForm((f) => ({ ...f, contacts: f.contacts.filter((_, j) => j !== i) }))}>Remove</button>
          </div>
        ))}
        {form.contacts.length < 5 && <div><button type="button" className="btn sm" onClick={() => setForm((f) => ({ ...f, contacts: [...f.contacts, { name: "", role: "", email: "", phone: "" }] }))}>+ Add a contact</button></div>}
        {err && <span role="alert" style={{ fontSize: "13px", fontWeight: 800, color: "var(--red-text)" }}>{err}</span>}
        <div><button type="button" className="btn dark" disabled={busy} onClick={() => void save()}>{busy ? "Sending…" : "Send for review"}</button></div>
      </div>
    </div>
  );
}
