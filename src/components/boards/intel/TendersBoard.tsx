"use client";

/* Tenders & project leads. The list comes from /api/intel/tenders (editor-checked notices);
   Free readers see titles and countries, Pro readers everything plus saved alerts. */
import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { PRODUCT, PRODUCT_BY_CODE } from "@/data/vocab/product";
import { COUNTRY, COUNTRY_BY_CODE } from "@/data/vocab/country";
import { Upsell } from "./IntelHero";
import type { TenderItem } from "@/lib/content/intel-sample";

type Res = { items: Partial<TenderItem>[]; page: number; more: boolean; full: boolean; sample: boolean; signedIn: boolean };
const KIND: Record<string, [string, string, string]> = { tender: ["TENDER", "var(--st-current-bg)", "var(--up)"], prequalification: ["PREQUALIFICATION", "var(--st-review-bg)", "var(--st-review-fg)"], project: ["PROJECT", "var(--paper)", "var(--slate)"], award: ["AWARD", "var(--line)", "var(--slate)"] };
const PRODUCTS = PRODUCT.filter((p) => !["wire_rod", "drawn_wire", "stainless_wire", "coating_service", "mesh_machinery", "testing_service", "software_consulting", "filter_disc", "filter_element"].includes(p.code));
const COUNTRIES = COUNTRY.slice().sort((a, b) => a.name.localeCompare(b.name));
const day = (iso?: string | null) => (iso ? new Intl.DateTimeFormat("en-GB", { day: "numeric", month: "short", year: "numeric" }).format(new Date(iso)) : "—");
const money = (v?: number | null, c?: string | null) => (v ? `${new Intl.NumberFormat("en-GB", { maximumFractionDigits: 0 }).format(v)} ${c ?? ""}`.trim() : "—");
const daysTo = (iso?: string | null) => (iso ? Math.ceil((new Date(iso).getTime() - Date.now()) / 86400000) : null);

export function TendersBoard({ live }: { live: boolean }) {
  const [f, setF] = useState({ product: "", country: "", kind: "", q: "", open: true });
  const [page, setPage] = useState(1);
  const [res, setRes] = useState<Res | null>(null);
  const [items, setItems] = useState<Partial<TenderItem>[]>([]);
  const [failed, setFailed] = useState(false);

  const load = useCallback(async (p: number) => {
    const q = new URLSearchParams({ page: String(p) });
    if (f.product) q.set("product", f.product);
    if (f.country) q.set("country", f.country);
    if (f.kind) q.set("kind", f.kind);
    if (f.q.trim()) q.set("q", f.q.trim());
    if (f.open) q.set("open", "1");
    const r = await fetch(`/api/intel/tenders/?${q}`).catch(() => null);
    if (!r?.ok) { setFailed(true); return; }
    const j = (await r.json()) as Res;
    setFailed(false); setRes(j); setItems((x) => (p === 1 ? j.items : [...x, ...j.items])); setPage(p);
  }, [f]);
  useEffect(() => { const t = setTimeout(() => void load(1), f.q ? 300 : 0); return () => clearTimeout(t); }, [load, f.q]);

  return (
    <section style={{ paddingTop: "28px", paddingBottom: "56px" }} className="wrap">
      <div className="bar" role="search">
        <span className="lbl">FILTER</span>
        <label className="sr-only" htmlFor="tf-p">Product</label>
        <select id="tf-p" className="sel" value={f.product} onChange={(e) => setF({ ...f, product: e.target.value })}><option value="">All products</option>{PRODUCTS.map((p) => <option key={p.code} value={p.code}>{p.labelEn}</option>)}</select>
        <label className="sr-only" htmlFor="tf-c">Country</label>
        <select id="tf-c" className="sel" value={f.country} onChange={(e) => setF({ ...f, country: e.target.value })}><option value="">All countries</option>{COUNTRIES.map((c) => <option key={c.alpha2} value={c.alpha2}>{c.name}</option>)}</select>
        <label className="sr-only" htmlFor="tf-k">Type</label>
        <select id="tf-k" className="sel" value={f.kind} onChange={(e) => setF({ ...f, kind: e.target.value })}><option value="">All types</option><option value="tender">Tenders</option><option value="prequalification">Prequalification</option><option value="project">Projects (early stage)</option><option value="award">Awards</option></select>
        <label style={{ display: "inline-flex", alignItems: "center", gap: "7px", color: "#FFFFFF", fontSize: "13px", fontWeight: 700 }}><input type="checkbox" checked={f.open} onChange={(e) => setF({ ...f, open: e.target.checked })} style={{ width: "17px", height: "17px", accentColor: "var(--red)" }} />Open only</label>
        <label className="sr-only" htmlFor="tf-q">Search</label>
        <input id="tf-q" className="inp" style={{ flex: "1 1 200px" }} placeholder="Search titles…" value={f.q} onChange={(e) => setF({ ...f, q: e.target.value })} />
      </div>

      {res?.sample && <p style={{ margin: "0 0 14px" }}><span className="sample">SAMPLE DATA · PREVIEW</span> <span className="meta">The live list is filled daily from public procurement portals and checked by an editor.</span></p>}
      {failed && <p role="alert" className="meta">The list could not be loaded. Reload the page to try again.</p>}
      {!res && !failed && <p className="meta" role="status">Loading tenders…</p>}
      {res && items.length === 0 && <p className="meta">No tenders match these filters.</p>}

      <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
        {items.map((t) => {
          const k = KIND[t.kind ?? "tender"];
          const left = daysTo(t.deadline);
          return (
            <article key={t.id} className="row">
              <div style={{ display: "flex", gap: "8px", alignItems: "center", flexWrap: "wrap" }}>
                <span className="st" style={{ background: k[1], color: k[2] }}>{k[0]}</span>
                <span className="meta" style={{ fontWeight: 700 }}>{COUNTRY_BY_CODE[t.country ?? ""]?.name ?? t.country ?? "—"}{t.city ? ` · ${t.city}` : ""}</span>
                <span className="meta">· published {day(t.published_on)}</span>
                {res?.full && t.deadline && <span className="st" style={{ marginLeft: "auto", background: left !== null && left <= 7 ? "var(--st-red-bg)" : "var(--paper)", color: left !== null && left <= 7 ? "var(--red-deep)" : "var(--ink)" }}>DEADLINE {day(t.deadline).toUpperCase()}{left !== null && left >= 0 ? ` · ${left} DAYS` : ""}</span>}
              </div>
              <h2 style={{ margin: 0, fontSize: "18px" }} className="h">{t.title}</h2>
              <div className="tags">{(t.products ?? []).map((p) => <span key={p} className="tag">{PRODUCT_BY_CODE[p]?.labelEn ?? p}</span>)}</div>
              {res?.full ? (
                <>
                  {t.summary && <p style={{ margin: 0, fontSize: "14px", fontWeight: 500, lineHeight: 1.6, color: "var(--fg-3)" }}>{t.summary}</p>}
                  <dl className="dl">
                    <div><dt>BUYER</dt><dd>{t.buyer ?? "—"}</dd></div>
                    <div><dt>QUANTITY</dt><dd>{t.quantity ?? "—"}</dd></div>
                    <div><dt>ESTIMATED VALUE</dt><dd>{money(t.value, t.currency)}</dd></div>
                    <div><dt>SOURCE</dt><dd>{t.url ? <a href={t.url} target="_blank" rel="noopener noreferrer nofollow" className="lnk">Original notice ↗</a> : t.source === "sample" ? "Sample" : "—"}</dd></div>
                  </dl>
                </>
              ) : <span className="lock">🔒 Buyer, quantity, value, deadline and the original notice are part of Pro</span>}
            </article>
          );
        })}
      </div>
      {res?.more && <div style={{ marginTop: "16px" }}><button type="button" className="ibtn" onClick={() => void load(page + 1)}>Show more</button></div>}
      {res && !res.full && <Upsell signedIn={res.signedIn} live={live} what="See every buyer, quantity, value and deadline" />}
      <TenderAlerts live={live} full={!!res?.full} signedIn={!!res?.signedIn} />
      <p style={{ marginTop: "26px", fontSize: "12.5px" }} className="meta">Sources: EU Tenders Electronic Daily (TED), World Bank procurement notices, US SAM.gov and other public portals. We summarise and link to each notice; always bid from the original documents. Listing a tender is not an endorsement of the buyer.</p>
    </section>
  );
}

type Alert = { id: string; name: string | null; products: string[] | null; countries: string[] | null };
function TenderAlerts({ live, full, signedIn }: { live: boolean; full: boolean; signedIn: boolean }) {
  const [alerts, setAlerts] = useState<Alert[] | null>(null);
  const [p, setP] = useState<string[]>([]);
  const [c, setC] = useState<string[]>([]);
  const [name, setName] = useState("");
  const [msg, setMsg] = useState<string | null>(null);
  const load = useCallback(async () => {
    if (!live || !signedIn) return;
    const r = await fetch("/api/intel/tender-alerts/").catch(() => null);
    if (r?.ok) setAlerts(((await r.json()) as { alerts: Alert[] }).alerts);
  }, [live, signedIn]);
  useEffect(() => { void load(); }, [load]);
  const add = async () => {
    setMsg(null);
    if (!live) { setMsg("Preview: on the live site this saves an alert and emails new matches every morning."); return; }
    const r = await fetch("/api/intel/tender-alerts/", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ name, products: p, countries: c }) }).catch(() => null);
    if (!r?.ok) { setMsg(((await r?.json().catch(() => ({}))) as { error?: string } | undefined)?.error ?? "Could not save. Try again."); return; }
    setP([]); setC([]); setName(""); setMsg("Saved. New matches arrive by email each morning."); void load();
  };
  const del = async (id: string) => { await fetch(`/api/intel/tender-alerts/?id=${encodeURIComponent(id)}`, { method: "DELETE" }).catch(() => null); void load(); };
  return (
    <div id="alerts" style={{ marginTop: "34px", borderTop: "2px solid var(--ink)", paddingTop: "20px", scrollMarginTop: "20px" }}>
      <h2 style={{ margin: "0 0 6px", fontSize: "24px" }} className="h">Tender alerts</h2>
      <p style={{ margin: "0 0 14px" }} className="meta">One email each morning with new tenders for the products and countries you choose.</p>
      {live && !full ? <span className="lock">🔒 Alerts are part of Pro — <Link href="/pricing/" className="lnk">start a free trial</Link></span> : (
        <div style={{ display: "flex", flexDirection: "column", gap: "10px", maxWidth: "760px" }}>
          {(alerts ?? []).map((a) => (
            <div key={a.id} className="row" style={{ flexDirection: "row", alignItems: "center", gap: "10px" }}>
              <span style={{ flex: "1 1 auto", fontSize: "14px", fontWeight: 700 }}>{a.name || "Alert"} <span className="meta" style={{ fontWeight: 500 }}>· {[...(a.products ?? []).map((x) => PRODUCT_BY_CODE[x]?.labelEn ?? x), ...(a.countries ?? []).map((x) => COUNTRY_BY_CODE[x]?.name ?? x)].join(", ")}</span></span>
              <button type="button" className="ibtn" onClick={() => void del(a.id)}>Delete</button>
            </div>
          ))}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px" }} className="cols">
            <label style={{ display: "flex", flexDirection: "column", gap: "5px", fontSize: "12px", fontWeight: 800, letterSpacing: ".08em" }}>PRODUCTS
              <select multiple size={6} value={p} onChange={(e) => setP([...e.target.selectedOptions].map((o) => o.value))} style={{ border: "1px solid var(--line-2)", borderRadius: "10px", padding: "6px", fontFamily: "inherit", fontSize: "13px", background: "var(--card)", color: "var(--ink)" }}>{PRODUCTS.map((x) => <option key={x.code} value={x.code}>{x.labelEn}</option>)}</select>
            </label>
            <label style={{ display: "flex", flexDirection: "column", gap: "5px", fontSize: "12px", fontWeight: 800, letterSpacing: ".08em" }}>COUNTRIES
              <select multiple size={6} value={c} onChange={(e) => setC([...e.target.selectedOptions].map((o) => o.value))} style={{ border: "1px solid var(--line-2)", borderRadius: "10px", padding: "6px", fontFamily: "inherit", fontSize: "13px", background: "var(--card)", color: "var(--ink)" }}>{COUNTRIES.map((x) => <option key={x.alpha2} value={x.alpha2}>{x.name}</option>)}</select>
            </label>
          </div>
          <span className="meta">Hold Ctrl (⌘ on Mac) to choose several. Leave one list empty for "any".</span>
          <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
            <label className="sr-only" htmlFor="ta-n">Alert name</label>
            <input id="ta-n" className="inp" style={{ flex: "1 1 220px" }} placeholder="Name (optional), e.g. UK security fencing" value={name} maxLength={80} onChange={(e) => setName(e.target.value)} />
            <button type="button" className="ibtn dark" disabled={!p.length && !c.length} onClick={() => void add()}>Save alert</button>
          </div>
          {live && !signedIn && <span className="meta"><Link href="/signin/?next=/tenders/%23alerts" className="lnk">Sign in</Link> to save alerts.</span>}
          {msg && <p role="status" style={{ margin: 0, fontSize: "13px", fontWeight: 700 }}>{msg}</p>}
        </div>
      )}
    </div>
  );
}
