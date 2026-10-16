import { viewer, priv } from "@/lib/server/viewer";
import { pool } from "@/lib/server/db";
import { HS_CODES } from "@/lib/trade-codes";
import { sampleTrade } from "@/lib/content/intel-sample";

/* Trade statistics. Everyone: yearly totals. Pro: monthly totals, top partners with unit
   values, and CSV download (?format=csv). Sources and periods are always named. */
export const dynamic = "force-dynamic";
export const runtime = "nodejs";

type R = { reporter: string; partner: string; flow: string; hs: string; period: string; value: number; currency: string; qty_kg: number | null };
const SOURCE: Record<string, string> = { EU: "Eurostat Comext (EU27, trade with non-EU countries)", US: "US Census Bureau" };

export async function GET(req: Request) {
  const v = await viewer(req);
  const q = new URL(req.url).searchParams;
  const hs = HS_CODES.some((h) => h.hs === q.get("hs")) ? q.get("hs")! : "7314";
  const reporter = q.get("reporter") === "US" ? "US" : "EU";
  const flow = q.get("flow") === "export" ? "export" : "import";
  const csv = q.get("format") === "csv";
  if (csv && !v.pro) return priv({ error: "CSV download is part of Pro." }, 402);

  let rows: R[];
  if (!v.live) rows = sampleTrade(hs, flow).map((r) => ({ ...r, reporter }));
  else rows = (await pool().query<R>(`select reporter, partner, flow, hs, period, value::float8 as value, currency, qty_kg::float8 as qty_kg from wmn_trade where hs = $1 and reporter = $2 and flow = $3 and period >= to_char(now() - interval '25 months', 'YYYY-MM') order by period`, [hs, reporter, flow])).rows;

  const currency = rows[0]?.currency ?? (reporter === "US" ? "USD" : "EUR");
  const months = [...new Set(rows.map((r) => r.period))].sort();
  const latest = months.at(-1) ?? null;
  const byYear: Record<string, number> = {};
  for (const r of rows) byYear[r.period.slice(0, 4)] = (byYear[r.period.slice(0, 4)] ?? 0) + r.value;
  const base = { hs, reporter, flow, currency, source: SOURCE[reporter], latest, sample: !v.live, full: v.pro, signedIn: !!v.user, years: Object.entries(byYear).map(([year, value]) => ({ year, value, months: months.filter((m) => m.startsWith(year)).length })) };

  if (csv) {
    const lines = ["reporter,partner,flow,hs,period,value,currency,net_mass_kg", ...rows.map((r) => [r.reporter, r.partner, r.flow, r.hs, r.period, r.value, r.currency, r.qty_kg ?? ""].join(","))];
    return new Response(`# Source: ${SOURCE[reporter]}. ${v.live ? "" : "SAMPLE DATA. "}Downloaded from Wire Mesh News.\n${lines.join("\n")}\n`, { headers: { "Content-Type": "text/csv; charset=utf-8", "Content-Disposition": `attachment; filename="trade-${reporter}-${flow}-${hs}.csv"`, "Cache-Control": "private, no-store" } });
  }
  if (!v.pro) return priv(base);

  const monthly = months.map((m) => ({ period: m, value: rows.filter((r) => r.period === m).reduce((s, r) => s + r.value, 0) }));
  const last12 = months.slice(-12);
  const prev12 = months.slice(-24, -12);
  const partners = new Map<string, { value: number; kg: number; prev: number }>();
  for (const r of rows) {
    const p = partners.get(r.partner) ?? { value: 0, kg: 0, prev: 0 };
    if (last12.includes(r.period)) { p.value += r.value; p.kg += r.qty_kg ?? 0; }
    if (prev12.includes(r.period)) p.prev += r.value;
    partners.set(r.partner, p);
  }
  const total = [...partners.values()].reduce((s, p) => s + p.value, 0);
  const top = [...partners.entries()].sort((a, b) => b[1].value - a[1].value).slice(0, 15).map(([partner, p]) => ({ partner, value: p.value, share: total ? p.value / total : 0, unit: p.kg ? p.value / p.kg : null, change: p.prev ? (p.value - p.prev) / p.prev : null }));
  return priv({ ...base, monthly, top, window: last12.length ? `${last12[0]} – ${last12.at(-1)}` : null });
}
