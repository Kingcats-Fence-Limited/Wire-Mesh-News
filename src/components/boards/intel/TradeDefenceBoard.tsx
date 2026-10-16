"use client";

/* Trade defence tracker: anti-dumping, countervailing, safeguard and circumvention cases on
   wire, mesh, fencing and grating. Everyone sees the cases; Pro sees rates, companies, dates,
   notices, and can follow a case for email alerts. */
import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { COUNTRY, COUNTRY_BY_CODE } from "@/data/vocab/country";
import { Upsell } from "./IntelHero";
import type { CaseItem } from "@/lib/content/intel-sample";

type Res = { items: Partial<CaseItem>[]; full: boolean; sample: boolean; signedIn: boolean; follows: string[] };
const MEASURE: Record<string, string> = { anti_dumping: "Anti-dumping", countervailing: "Countervailing", safeguard: "Safeguard", anti_circumvention: "Anti-circumvention" };
const STAGE: Record<string, [string, string, string]> = {
  initiation: ["INVESTIGATION", "var(--st-review-bg)", "var(--st-review-fg)"], provisional: ["PROVISIONAL DUTIES", "var(--st-red-bg)", "var(--red-deep)"], definitive: ["DUTIES IN FORCE", "var(--st-red-bg)", "var(--red-deep)"],
  expiry_review: ["EXPIRY REVIEW", "var(--st-review-bg)", "var(--st-review-fg)"], interim_review: ["INTERIM REVIEW", "var(--st-review-bg)", "var(--st-review-fg)"], terminated: ["TERMINATED", "var(--line)", "var(--slate)"], expired: ["EXPIRED", "var(--line)", "var(--slate)"],
};
const cname = (c?: string | null) => (c === "EU" ? "European Union" : COUNTRY_BY_CODE[c ?? ""]?.name ?? c ?? "—");
const day = (iso?: string | null) => (iso ? new Intl.DateTimeFormat("en-GB", { day: "numeric", month: "short", year: "numeric" }).format(new Date(iso)) : "—");
const COUNTRIES = [{ alpha2: "EU", name: "European Union" }, ...COUNTRY.slice().sort((a, b) => a.name.localeCompare(b.name))];

export function TradeDefenceBoard({ live }: { live: boolean }) {
  const [f, setF] = useState({ importing: "", origin: "", measure: "" });
  const [res, setRes] = useState<Res | null>(null);
  const [failed, setFailed] = useState(false);
  const [note, setNote] = useState<Record<string, string>>({});

  const load = useCallback(async () => {
    const q = new URLSearchParams();
    for (const [k, v] of Object.entries(f)) if (v) q.set(k, v);
    const r = await fetch(`/api/intel/cases/?${q}`).catch(() => null);
    if (!r?.ok) { setFailed(true); return; }
    setFailed(false); setRes((await r.json()) as Res);
  }, [f]);
  useEffect(() => { void load(); }, [load]);

  const follow = async (id: string, on: boolean) => {
    if (!live) { setNote((n) => ({ ...n, [id]: "Preview: on the live site you get an email when this case has a new notice." })); return; }
    const r = await fetch(on ? `/api/intel/case-follows/?case=${encodeURIComponent(id)}` : "/api/intel/case-follows/", { method: on ? "DELETE" : "POST", headers: { "Content-Type": "application/json" }, body: on ? undefined : JSON.stringify({ case: id }) }).catch(() => null);
    if (!r?.ok) { const j = (r ? await r.json().catch(() => ({})) : {}) as { error?: string }; setNote((n) => ({ ...n, [id]: j.error ?? "Could not update. Try again." })); return; }
    setRes((x) => (x ? { ...x, follows: on ? x.follows.filter((c) => c !== id) : [...x.follows, id] } : x));
    setNote((n) => ({ ...n, [id]: on ? "No longer following." : "Following: you get an email when there is a new notice." }));
  };

  return (
    <section style={{ paddingTop: "28px", paddingBottom: "56px" }} className="wrap">
      <div className="bar" role="search">
        <span className="lbl">FILTER</span>
        <label className="sr-only" htmlFor="cf-i">Imposed by</label>
        <select id="cf-i" className="sel" value={f.importing} onChange={(e) => setF({ ...f, importing: e.target.value })}><option value="">Imposed by: any</option>{COUNTRIES.map((c) => <option key={c.alpha2} value={c.alpha2}>{c.name}</option>)}</select>
        <label className="sr-only" htmlFor="cf-o">Exports from</label>
        <select id="cf-o" className="sel" value={f.origin} onChange={(e) => setF({ ...f, origin: e.target.value })}><option value="">Exports from: any</option>{COUNTRIES.slice(1).map((c) => <option key={c.alpha2} value={c.alpha2}>{c.name}</option>)}</select>
        <label className="sr-only" htmlFor="cf-m">Measure</label>
        <select id="cf-m" className="sel" value={f.measure} onChange={(e) => setF({ ...f, measure: e.target.value })}><option value="">All measures</option>{Object.entries(MEASURE).map(([k, l]) => <option key={k} value={k}>{l}</option>)}</select>
      </div>
      {res?.sample && <p style={{ margin: "0 0 14px" }}><span className="sample">SAMPLE DATA · PREVIEW</span> <span className="meta">Live cases are kept by our editors from official journals and notices.</span></p>}
      {failed && <p role="alert" className="meta">The cases could not be loaded. Reload the page to try again.</p>}
      {!res && !failed && <p className="meta" role="status">Loading cases…</p>}
      {res && res.items.length === 0 && <p className="meta">No cases match these filters.</p>}
      <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
        {res?.items.map((c) => {
          const st = STAGE[c.stage ?? "initiation"] ?? STAGE.initiation;
          const on = res.follows.includes(c.id!);
          return (
            <article key={c.id} id={c.slug} className="row" style={{ scrollMarginTop: "20px" }}>
              <div style={{ display: "flex", gap: "8px", alignItems: "center", flexWrap: "wrap" }}>
                <span className="st" style={{ background: st[1], color: st[2] }}>{st[0]}</span>
                <span className="meta" style={{ fontWeight: 700 }}>{MEASURE[c.measure ?? ""] ?? c.measure} · imposed by {cname(c.importing_country)} · on exports from {(c.origins ?? []).map(cname).join(", ")}</span>
              </div>
              <h2 style={{ margin: 0, fontSize: "18px" }} className="h">{c.product}</h2>
              <div className="tags">{(c.hs_codes ?? []).map((h) => <span key={h} className="tag">HS {h}</span>)}</div>
              {res.full ? (
                <>
                  {c.summary && <p style={{ margin: 0, fontSize: "14px", fontWeight: 500, lineHeight: 1.6, color: "var(--fg-3)" }}>{c.summary}</p>}
                  <dl className="dl">
                    <div><dt>AUTHORITY</dt><dd>{c.authority ?? "—"}</dd></div>
                    <div><dt>CASE NO.</dt><dd>{c.case_no ?? "—"}</dd></div>
                    <div><dt>NEXT KEY DATE</dt><dd>{day(c.next_date)}</dd></div>
                    <div><dt>OFFICIAL PAGE</dt><dd>{c.url ? <a href={c.url} target="_blank" rel="noopener noreferrer nofollow" className="lnk">Open ↗</a> : "—"}</dd></div>
                  </dl>
                  {(c.rates?.length ?? 0) > 0 && (
                    <div className="tablewrap"><table className="itable"><thead><tr><th>COMPANY</th><th>COUNTRY</th><th>DUTY RATE</th></tr></thead><tbody>{c.rates!.map((r, i) => <tr key={i}><td>{r.company}</td><td>{cname(r.country)}</td><td style={{ fontWeight: 800 }}>{r.rate}</td></tr>)}</tbody></table></div>
                  )}
                  {(c.updates?.length ?? 0) > 0 && <ul style={{ margin: 0, paddingLeft: "18px", fontSize: "13.5px", lineHeight: 1.7 }}>{c.updates!.map((u, i) => <li key={i}>{day(u.date)} — {u.url ? <a href={u.url} target="_blank" rel="noopener noreferrer nofollow" className="lnk">{u.title}</a> : u.title}</li>)}</ul>}
                  <div style={{ display: "flex", gap: "10px", alignItems: "center", flexWrap: "wrap" }}>
                    <button type="button" className={`ibtn${on ? " dark" : ""}`} aria-pressed={on} onClick={() => void follow(c.id!, on)}>{on ? "Following" : "Follow this case"}</button>
                    {note[c.id!] && <span role="status" className="meta">{note[c.id!]}</span>}
                  </div>
                </>
              ) : <span className="lock">🔒 Duty rates, named companies, key dates, official notices and alerts are part of Pro</span>}
            </article>
          );
        })}
      </div>
      {res && !res.full && <Upsell signedIn={res.signedIn} live={live} what="See duty rates and companies, and get alerts" />}
      <p style={{ marginTop: "26px", fontSize: "12.5px" }} className="meta">Compiled by our editors from official journals and notices (US Federal Register, Official Journal of the EU and national authorities). Rates are as published; check the official notice before relying on them. This is not legal advice. Related coverage: <Link href="/topics/anti-dumping-tracker/" className="lnk">anti-dumping tracker topic</Link>.</p>
    </section>
  );
}
