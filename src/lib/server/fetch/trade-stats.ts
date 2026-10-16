import "server-only";
import { pool } from "../db";
import { ENV } from "../env";
import { NAME_TO_A2 } from "./common";

/* Monthly trade statistics from official, freely reusable sources:
   - Eurostat Comext (dataset ds-045409, EU27 extra-EU trade by HS) — reuse allowed with attribution
   - US Census Bureau international trade API — public domain (needs a free CENSUS_API_KEY)
   Stored in our Postgres (wmn_trade), not Directus: it is data, not editorial content. */

export { HS_CODES } from "@/lib/trade-codes";
import { HS_CODES } from "@/lib/trade-codes";

type Row = { source: string; reporter: string; partner: string; flow: "import" | "export"; hs: string; period: string; value: number; currency: string; qty_kg: number | null };

async function save(rows: Row[]) {
  for (let i = 0; i < rows.length; i += 500) {
    const chunk = rows.slice(i, i + 500);
    const vals: unknown[] = [];
    const ph = chunk.map((r, k) => { vals.push(r.source, r.reporter, r.partner, r.flow, r.hs, r.period, r.value, r.currency, r.qty_kg); const b = k * 9; return `($${b + 1},$${b + 2},$${b + 3},$${b + 4},$${b + 5},$${b + 6},$${b + 7},$${b + 8},$${b + 9})`; }).join(",");
    await pool().query(`insert into wmn_trade (source, reporter, partner, flow, hs, period, value, currency, qty_kg) values ${ph}
      on conflict (source, reporter, partner, flow, hs, period) do update set value = excluded.value, currency = excluded.currency, qty_kg = excluded.qty_kg, fetched_at = now()`, vals);
  }
}

/* JSON-stat 2.0 → rows of {dimension: code} + value. */
type JsonStat = { id: string[]; size: number[]; dimension: Record<string, { category: { index: Record<string, number> | string[] } }>; value: Record<string, number> | number[] };
export function decodeJsonStat(j: JsonStat): { dims: Record<string, string>; value: number }[] {
  const codes = j.id.map((d) => {
    const idx = j.dimension[d].category.index;
    const arr: string[] = [];
    if (Array.isArray(idx)) idx.forEach((c, i) => (arr[i] = c)); else for (const [c, i] of Object.entries(idx)) arr[i] = c;
    return arr;
  });
  const out: { dims: Record<string, string>; value: number }[] = [];
  const entries: [number, number][] = Array.isArray(j.value) ? j.value.map((v, i) => [i, v]) : Object.entries(j.value).map(([k, v]) => [Number(k), v]);
  for (const [flat, v] of entries) {
    if (v === null || v === undefined) continue;
    let rest = flat;
    const dims: Record<string, string> = {};
    for (let d = j.id.length - 1; d >= 0; d--) { const n = j.size[d]; dims[j.id[d]] = codes[d][rest % n]; rest = Math.floor(rest / n); }
    out.push({ dims, value: v });
  }
  return out;
}
const period = (t: string) => t.replace(/^(\d{4})M(\d{2})$/, "$1-$2");

async function eurostat(months: number) {
  const rows: Row[] = [];
  const since = new Date(Date.now() - months * 31 * 86400_000);
  const sinceP = `${since.getUTCFullYear()}M${String(since.getUTCMonth() + 1).padStart(2, "0")}`;
  for (const { hs } of HS_CODES) for (const [flowCode, flow] of [["1", "import"], ["2", "export"]] as const) {
    const res: Record<string, Row> = {};
    for (const ind of ["VALUE_IN_EUROS", "QUANTITY_IN_100KG"]) {
      const url = `https://ec.europa.eu/eurostat/api/comext/dissemination/statistics/1.0/data/ds-045409?format=JSON&lang=EN&freq=M&reporter=EU&product=${hs}&flow=${flowCode}&indicators=${ind}&sinceTimePeriod=${sinceP}`;
      const r = await fetch(url, { signal: AbortSignal.timeout(40_000) });
      if (!r.ok) throw new Error(`Eurostat ${r.status}`);
      for (const { dims, value } of decodeJsonStat((await r.json()) as JsonStat)) {
        const partner = dims.partner;
        if (!partner || partner.length !== 2 || /^(EU|EA|EX)/.test(partner)) continue; // country partners only
        const key = `${partner}|${dims.time}`;
        res[key] ??= { source: "eurostat", reporter: "EU", partner, flow, hs, period: period(dims.time), value: 0, currency: "EUR", qty_kg: null };
        if (ind === "VALUE_IN_EUROS") res[key].value = value; else res[key].qty_kg = value * 100;
      }
    }
    rows.push(...Object.values(res).filter((r) => r.value > 0));
  }
  await save(rows);
  return rows.length;
}

async function census(months: number) {
  if (!ENV.censusApiKey) return 0;
  const rows: Row[] = [];
  for (let m = 1; m <= months; m++) {
    const d = new Date(Date.UTC(new Date().getUTCFullYear(), new Date().getUTCMonth() - m, 1));
    const time = `${d.getUTCFullYear()}-${String(d.getUTCMonth() + 1).padStart(2, "0")}`;
    for (const { hs } of HS_CODES) for (const [kind, flow, val, qty, comm] of [["imports", "import", "GEN_VAL_MO", "GEN_QY1_MO", "I_COMMODITY"], ["exports", "export", "ALL_VAL_MO", "QTY_1_MO", "E_COMMODITY"]] as const) {
      const url = `https://api.census.gov/data/timeseries/intltrade/${kind}/hs?get=CTY_CODE,CTY_NAME,${val},${comm}&time=${time}&${comm}=${hs}&COMM_LVL=HS4&key=${encodeURIComponent(ENV.censusApiKey)}`;
      const r = await fetch(url, { signal: AbortSignal.timeout(30_000) });
      if (r.status === 204) continue; // month not released yet
      if (!r.ok) throw new Error(`US Census ${r.status}`);
      const [head, ...data] = (await r.json()) as string[][];
      const iName = head.indexOf("CTY_NAME"), iVal = head.indexOf(val), iCode = head.indexOf("CTY_CODE");
      for (const row of data) {
        if (!/^\d{4}$/.test(row[iCode]) || row[iCode].startsWith("0") || row[iCode] === "1000") continue; // country codes only, not totals/regions
        const a2 = NAME_TO_A2[row[iName].toLowerCase()] ?? NAME_TO_A2[row[iName].toLowerCase().replace(/,.*$/, "")];
        if (!a2) continue;
        rows.push({ source: "us_census", reporter: "US", partner: a2, flow, hs, period: time, value: Number(row[iVal]) || 0, currency: "USD", qty_kg: null });
      }
      void qty;
    }
  }
  await save(rows.filter((r) => r.value > 0));
  return rows.length;
}

export async function fetchTradeStats(months = 14) {
  const report: Record<string, { rows?: number; error?: string }> = {};
  for (const [name, fn] of Object.entries({ eurostat, us_census: census })) {
    try { report[name] = { rows: await fn(months) }; } catch (e) { report[name] = { error: (e as Error).message }; }
  }
  return report;
}
