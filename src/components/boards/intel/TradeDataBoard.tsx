"use client";

/* Trade statistics by HS code from official sources. Free: yearly totals. Pro: monthly
   totals, top partners with unit values, CSV download. */
import { useEffect, useState } from "react";
import { HS_CODES } from "@/lib/trade-codes";
import { COUNTRY_BY_CODE } from "@/data/vocab/country";
import { Upsell } from "./IntelHero";

type Res = {
  hs: string; reporter: string; flow: string; currency: string; source: string; latest: string | null; sample: boolean; full: boolean; signedIn: boolean;
  years: { year: string; value: number; months: number }[];
  monthly?: { period: string; value: number }[];
  top?: { partner: string; value: number; share: number; unit: number | null; change: number | null }[];
  window?: string | null;
};
const big = (v: number, c: string) => `${c === "EUR" ? "€" : c === "USD" ? "$" : ""}${v >= 1e9 ? `${(v / 1e9).toFixed(2)} bn` : v >= 1e6 ? `${(v / 1e6).toFixed(1)} m` : v >= 1e3 ? `${(v / 1e3).toFixed(0)} k` : v.toFixed(0)}`;
const mlabel = (p: string) => new Intl.DateTimeFormat("en-GB", { month: "short", year: "2-digit" }).format(new Date(`${p}-01T00:00:00Z`));

export function TradeDataBoard({ live }: { live: boolean }) {
  const [sel, setSel] = useState({ hs: "7314", reporter: "EU", flow: "import" });
  const [res, setRes] = useState<Res | null>(null);
  const [failed, setFailed] = useState(false);
  const q = new URLSearchParams(sel).toString();
  useEffect(() => {
    let off = false;
    setRes(null);
    fetch(`/api/intel/trade/?${q}`).then((r) => (r.ok ? r.json() : Promise.reject())).then((j: Res) => { if (!off) { setRes(j); setFailed(false); } }).catch(() => { if (!off) setFailed(true); });
    return () => { off = true; };
  }, [q]);

  const max = Math.max(1, ...(res?.monthly ?? []).map((m) => m.value));
  return (
    <section style={{ paddingTop: "28px", paddingBottom: "56px" }} className="wrap">
      <div className="bar">
        <span className="lbl">SHOW</span>
        <label className="sr-only" htmlFor="td-h">Product (HS code)</label>
        <select id="td-h" className="sel" value={sel.hs} onChange={(e) => setSel({ ...sel, hs: e.target.value })} style={{ maxWidth: "100%" }}>{HS_CODES.map((h) => <option key={h.hs} value={h.hs}>HS {h.hs} · {h.label}</option>)}</select>
        <label className="sr-only" htmlFor="td-r">Reporter</label>
        <select id="td-r" className="sel" value={sel.reporter} onChange={(e) => setSel({ ...sel, reporter: e.target.value })}><option value="EU">European Union (27)</option><option value="US">United States</option></select>
        <label className="sr-only" htmlFor="td-f">Flow</label>
        <select id="td-f" className="sel" value={sel.flow} onChange={(e) => setSel({ ...sel, flow: e.target.value })}><option value="import">Imports</option><option value="export">Exports</option></select>
        {res?.full && <a href={`/api/intel/trade/?${q}&format=csv`} className="ibtn" style={{ marginLeft: "auto" }}>Download CSV</a>}
      </div>
      {res?.sample && <p style={{ margin: "0 0 14px" }}><span className="sample">SAMPLE DATA · PREVIEW</span> <span className="meta">Figures are made up for the preview. Live figures come from the official sources named below.</span></p>}
      {failed && <p role="alert" className="meta">The figures could not be loaded. Reload the page to try again.</p>}
      {!res && !failed && <p className="meta" role="status">Loading figures…</p>}
      {res && (
        <>
          <div style={{ display: "grid", gridTemplateColumns: `repeat(${Math.max(1, res.years.length)}, minmax(0, 1fr))`, gap: "12px", marginBottom: "22px" }} className="cols">
            {res.years.map((y) => (
              <div key={y.year} className="row">
                <span className="meta" style={{ fontWeight: 800, letterSpacing: ".08em" }}>{y.year}{y.months < 12 ? ` · ${y.months} MONTHS` : ""}</span>
                <span className="h" style={{ fontSize: "28px" }}>{big(y.value, res.currency)}</span>
                <span className="meta">{res.flow === "import" ? "Imports" : "Exports"} of HS {res.hs}, {res.reporter === "EU" ? "EU27 with non-EU countries" : "United States"}</span>
              </div>
            ))}
            {res.years.length === 0 && <p className="meta">No figures yet for this selection.</p>}
          </div>
          {res.full ? (
            <>
              {(res.monthly?.length ?? 0) > 0 && (
                <figure style={{ margin: "0 0 26px" }}>
                  <figcaption className="h" style={{ fontSize: "18px", marginBottom: "10px" }}>Monthly {res.flow === "import" ? "imports" : "exports"}, {res.currency}</figcaption>
                  <div role="img" aria-label={`Monthly values from ${res.monthly![0].period} to ${res.monthly!.at(-1)!.period}`} style={{ display: "flex", alignItems: "flex-end", gap: "4px", height: "180px", borderBottom: "1.5px solid var(--ink)", paddingTop: "8px" }}>
                    {res.monthly!.map((m) => <div key={m.period} title={`${mlabel(m.period)}: ${big(m.value, res.currency)}`} style={{ flex: "1 1 0", height: `${Math.max(2, (m.value / max) * 100)}%`, background: m.period === res.latest ? "var(--red)" : "var(--ink)", borderRadius: "3px 3px 0 0", opacity: m.period === res.latest ? 1 : 0.82 }} />)}
                  </div>
                  <div style={{ display: "flex", justifyContent: "space-between", marginTop: "6px" }} className="meta"><span>{mlabel(res.monthly![0].period)}</span><span>{mlabel(res.monthly!.at(-1)!.period)}</span></div>
                  <details style={{ marginTop: "8px" }}><summary className="meta" style={{ cursor: "pointer", fontWeight: 700 }}>Show the values</summary>
                    <div className="tablewrap"><table className="itable" style={{ marginTop: "8px" }}><thead><tr><th>MONTH</th><th>VALUE ({res.currency})</th></tr></thead><tbody>{res.monthly!.map((m) => <tr key={m.period}><td>{mlabel(m.period)}</td><td>{Math.round(m.value).toLocaleString("en-GB")}</td></tr>)}</tbody></table></div>
                  </details>
                </figure>
              )}
              {(res.top?.length ?? 0) > 0 && (
                <>
                  <h2 className="h" style={{ fontSize: "18px", margin: "0 0 8px" }}>Top partners, last 12 months{res.window ? ` (${res.window})` : ""}</h2>
                  <div className="tablewrap"><table className="itable">
                    <thead><tr><th>{res.flow === "import" ? "FROM" : "TO"}</th><th>VALUE</th><th>SHARE</th><th>UNIT VALUE / KG</th><th>VS PREVIOUS 12 M</th></tr></thead>
                    <tbody>{res.top!.map((t) => <tr key={t.partner}><td>{COUNTRY_BY_CODE[t.partner]?.name ?? t.partner}</td><td>{big(t.value, res.currency)}</td><td>{(t.share * 100).toFixed(1)}%</td><td>{t.unit ? `${t.unit.toFixed(2)} ${res.currency}` : "—"}</td><td style={{ color: t.change === null ? undefined : t.change >= 0 ? "var(--up)" : "var(--red-text)", fontWeight: 700 }}>{t.change === null ? "—" : `${t.change >= 0 ? "+" : ""}${(t.change * 100).toFixed(1)}%`}</td></tr>)}</tbody>
                  </table></div>
                </>
              )}
            </>
          ) : <Upsell signedIn={res.signedIn} live={live} what="Monthly figures, partner rankings, unit values and CSV" />}
          <p style={{ marginTop: "22px", fontSize: "12.5px" }} className="meta">Source: {res.source}{res.latest ? `, latest month ${mlabel(res.latest)}` : ""}. Official statistics are revised; the latest months change most. Unit value is value divided by net mass and is an average across very different products — not a price.</p>
        </>
      )}
    </section>
  );
}
