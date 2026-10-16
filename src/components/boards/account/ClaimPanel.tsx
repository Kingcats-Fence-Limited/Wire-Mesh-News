"use client";

/* Live accounts without a company: claim a directory profile. The member picks the company,
   proves a work email at its domain with a code, and the claim goes to the directory editor.
   Approval (in Directus) links the profile to the account. Also hosts the live company panel
   once a claim is approved. */
import Link from "next/link";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useDemo } from "./store";
import { CompanyPanel, liveCode, type HistItem } from "./CompanyPanel";
import { CompanyPlanPanel } from "./CompanyPlanPanel";
import { Head } from "./ui";
import { CodeVerify } from "@/components/ui/CodeVerify";
import { COUNTRY_BY_CODE } from "@/data/vocab/country";
import type { Company } from "@/lib/content/types";
import type { SubOpt } from "@/lib/vocab-geo";

type Open = { slug: string; name: string; city: string; country: string; website: string | null };
type Claim = { id: string; slug: string; name: string; email: string | null; status: string; note: string | null; date: string };
const FREE = ["gmail.com", "googlemail.com", "outlook.com", "hotmail.com", "live.com", "yahoo.com", "icloud.com", "me.com", "aol.com", "proton.me", "protonmail.com", "qq.com", "163.com", "126.com", "sina.com", "foxmail.com", "yandex.ru", "mail.ru", "gmx.com"];
const dom = (u?: string | null) => (u ?? "").replace(/^https?:\/\/(www\.)?/i, "").split(/[/?#:]/)[0].toLowerCase();
const dmy = (iso: string) => new Intl.DateTimeFormat("en-GB", { day: "numeric", month: "short", year: "numeric" }).format(new Date(iso));

export function LiveCompany() {
  const [data, setData] = useState<{ co: Company; related: { title: string; href: string }[]; subs0: SubOpt[]; history: HistItem[] } | null | "err">(null);
  useEffect(() => {
    fetch("/api/me/company/").then((r) => (r.ok ? r.json() : Promise.reject())).then(setData).catch(() => setData("err"));
  }, []);
  if (data === "err") return <div className="panel" role="alert" style={{ padding: "20px" }}>Your company profile could not be loaded. Reload the page to try again.</div>;
  if (!data) return <div className="panel" role="status" style={{ padding: "20px" }}>Loading your company…</div>;
  return (
    <>
      <Head title="My company" sub="The directory profile you manage. Edits are reviewed before they go live; the public page keeps its current content until then." actions={<Link href={`/directory/${data.co.slug}/`} className="btn">View public profile</Link>} />
      <CompanyPanel co={data.co} related={data.related} subs0={data.subs0} history={data.history} />
      <CompanyPlanPanel />
    </>
  );
}

export function ClaimPanel() {
  const { toast } = useDemo();
  const [list, setList] = useState<Open[] | null>(null);
  const [claims, setClaims] = useState<Claim[]>([]);
  const [failed, setFailed] = useState(false);
  const [q, setQ] = useState("");
  const [slug, setSlug] = useState("");
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("");
  const [note, setNote] = useState("");
  const [verifying, setVerifying] = useState(false);
  const [verified, setVerified] = useState("");
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  const load = useCallback(async () => {
    const r = await fetch("/api/me/claims/").catch(() => null);
    if (!r || !r.ok) { setFailed(true); return; }
    const j = (await r.json()) as { open: Open[]; claims: Claim[] };
    setList(j.open); setClaims(j.claims);
  }, []);
  useEffect(() => {
    void load();
    try { const s = sessionStorage.getItem("wmn-claim"); if (s) { setSlug(s); sessionStorage.removeItem("wmn-claim"); } } catch { /* ignore */ }
  }, [load]);

  const co = list?.find((c) => c.slug === slug);
  const matches = useMemo(() => {
    const t = q.trim().toLowerCase();
    if (!list || t.length < 2) return [];
    return list.filter((c) => c.name.toLowerCase().includes(t) || c.city.toLowerCase().includes(t)).slice(0, 8);
  }, [list, q]);
  const d = dom(co?.website), md = email.split("@")[1]?.toLowerCase() ?? "";
  const valid = /^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email);
  const domainOk = valid && !FREE.includes(md) && (!d || md === d || md.endsWith(`.${d}`));
  const isVerified = !!verified && verified === email.toLowerCase();
  const pending = claims.find((c) => c.status === "pending");

  const send = async () => {
    if (!co) return;
    setBusy(true); setErr(null);
    const r = await fetch("/api/me/claims/", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ slug: co.slug, email: email.toLowerCase(), role, note }) }).catch(() => null);
    setBusy(false);
    if (!r || !r.ok) { setErr(((await r?.json().catch(() => ({}))) as { error?: string } | undefined)?.error ?? "Could not send. Try again."); return; }
    toast("Claim sent. The directory editor replies by email, usually within five working days.");
    setSlug(""); setEmail(""); setRole(""); setNote(""); setVerified("");
    void load();
  };
  const withdraw = async (id: string) => {
    const r = await fetch(`/api/me/claims/?id=${encodeURIComponent(id)}`, { method: "DELETE" }).catch(() => null);
    if (r?.ok) { toast("Claim withdrawn."); void load(); } else toast("Could not withdraw. Try again.");
  };

  if (failed) return <div className="panel" role="alert" style={{ padding: "20px" }}>This section could not be loaded. Reload the page to try again.</div>;
  if (!list) return <div className="panel" role="status" style={{ padding: "20px" }}>Loading…</div>;

  return (
    <div className="mini" style={{ gridColumn: "1 / -1", display: "flex", flexDirection: "column", gap: "16px" }}>
      {claims.length > 0 && (
        <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
          <span className="lbl">YOUR CLAIMS</span>
          {claims.map((c) => (
            <div key={c.id} style={{ display: "flex", gap: "10px", alignItems: "center", flexWrap: "wrap", padding: "10px 0", borderTop: "1px solid var(--line)" }}>
              <b style={{ fontSize: "14px" }}>{c.name}</b>
              <span className="st" style={{ background: c.status === "pending" ? "var(--st-review-bg)" : c.status === "approved" ? "var(--st-current-bg)" : "var(--line)", color: c.status === "pending" ? "var(--st-review-fg)" : c.status === "approved" ? "var(--up)" : "var(--slate)" }}>{c.status === "pending" ? "IN REVIEW" : c.status.toUpperCase()}</span>
              <span className="meta">sent {dmy(c.date)}{c.email ? ` · ${c.email}` : ""}</span>
              {c.note && <span className="meta" style={{ flexBasis: "100%" }}>Editor: {c.note}</span>}
              {c.status === "pending" && <button type="button" className="btn" style={{ minHeight: "30px", fontSize: "12px", marginLeft: "auto" }} onClick={() => void withdraw(c.id)}>Withdraw</button>}
            </div>
          ))}
        </div>
      )}

      {pending ? (
        <p className="meta" style={{ margin: 0 }}>While a claim is in review you cannot start another. You will get an email and a notice here with the decision.</p>
      ) : (
        <>
          <p style={{ margin: 0, fontSize: "14px", fontWeight: 500, lineHeight: 1.6 }}>Claim your company&apos;s free directory profile to keep its description, products, photos and contact details up to date, and to receive buyer enquiries. You need an email address at the company&apos;s own domain.</p>
          {!co ? (
            <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
              <label htmlFor="cl-q" className="lbl">FIND YOUR COMPANY</label>
              <input id="cl-q" className="inp" value={q} onChange={(e) => setQ(e.target.value)} placeholder="Company name or city" autoComplete="off" />
              {matches.map((c) => (
                <button key={c.slug} type="button" className="btn" style={{ justifyContent: "flex-start" }} onClick={() => { setSlug(c.slug); setQ(""); }}>{c.name} <span className="meta" style={{ marginLeft: "6px" }}>{c.city}, {COUNTRY_BY_CODE[c.country]?.name ?? c.country}</span></button>
              ))}
              {q.trim().length >= 2 && !matches.length && <span className="meta">No unclaimed profile matches. Not listed yet? <Link href="/directory/" style={{ color: "var(--red-text)", fontWeight: 800 }}>Browse the directory</Link> or <Link href="/contact/" style={{ color: "var(--red-text)", fontWeight: 800 }}>ask the directory editor</Link> to add it.</span>}
            </div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
              <div style={{ display: "flex", gap: "10px", alignItems: "center", flexWrap: "wrap" }}>
                <b style={{ fontSize: "15px" }}>{co.name}</b><span className="meta">{co.city}, {COUNTRY_BY_CODE[co.country]?.name ?? co.country}{d ? ` · ${d}` : ""}</span>
                <button type="button" className="tbtn" onClick={() => { setSlug(""); setVerified(""); setVerifying(false); }} style={{ fontSize: "12.5px", fontWeight: 800, color: "var(--red-text)" }}>Change</button>
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: "5px" }}>
                <label htmlFor="cl-e" className="lbl">WORK EMAIL{d ? ` (@${d})` : ""}</label>
                <div style={{ display: "flex", gap: "8px" }}>
                  <input id="cl-e" type="email" className="inp" value={email} onChange={(e) => { setEmail(e.target.value.trim()); setVerifying(false); }} placeholder={d ? `you@${d}` : "you@yourcompany.com"} style={{ minWidth: 0 }} />
                  {domainOk && !isVerified && !verifying && <button type="button" className="btn dark" style={{ flexShrink: 0 }} onClick={() => setVerifying(true)}>Send code</button>}
                  {isVerified && <span className="st" style={{ background: "var(--st-current-bg)", color: "var(--up)", alignSelf: "center" }}>VERIFIED</span>}
                </div>
                {valid && !domainOk && <span className="meta" style={{ color: "var(--red-text)" }}>{FREE.includes(md) ? "Free email providers cannot be used for a claim." : `Use an address at ${d}.`}</span>}
                {verifying && !isVerified && <div className="compose"><CodeVerify compact email={email} purpose="confirm your work email for the company claim" live={liveCode(email.toLowerCase(), "claim")} onVerified={() => { setVerified(email.toLowerCase()); setVerifying(false); }} /></div>}
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: "5px" }}><label htmlFor="cl-r" className="lbl">YOUR ROLE</label><input id="cl-r" className="inp" value={role} maxLength={80} onChange={(e) => setRole(e.target.value)} placeholder="e.g. Export sales manager" /></div>
              <div style={{ display: "flex", flexDirection: "column", gap: "5px" }}><label htmlFor="cl-n" className="lbl">NOTE FOR THE EDITOR (OPTIONAL)</label><textarea id="cl-n" rows={2} className="inp" value={note} maxLength={1000} onChange={(e) => setNote(e.target.value)} /></div>
              {err && <span role="alert" className="meta" style={{ color: "var(--red-text)", fontWeight: 800 }}>{err}</span>}
              <div><button type="button" className="btn dark" disabled={!isVerified || busy} onClick={() => void send()}>{busy ? "Sending…" : "Send claim for review"}</button></div>
              <span className="meta">By claiming you confirm you may represent this company. See the <Link href="/policies/directory-listing-policy/" style={{ color: "var(--red-text)", fontWeight: 800 }}>Directory Policy</Link>.</span>
            </div>
          )}
        </>
      )}
    </div>
  );
}
