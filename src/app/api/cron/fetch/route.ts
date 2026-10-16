import { cronAllowed } from "@/lib/server/cron-auth";
import { pool } from "@/lib/server/db";
import { fetchTenders } from "@/lib/server/fetch/tenders";
import { fetchTradeDefence } from "@/lib/server/fetch/trade-defence";
import { fetchTradeStats } from "@/lib/server/fetch/trade-stats";

/* Daily: new tenders and trade-defence notices → drafts in Directus for the editors.
   Mondays (or ?only=stats): trade statistics. ?only=tenders|defence|stats runs one job;
   ?days=N looks further back (max 60). Each run is logged in wmn_fetch_log. */
export const dynamic = "force-dynamic";
export const runtime = "nodejs";
export const maxDuration = 300;

export async function GET(req: Request) {
  if (!cronAllowed(req)) return new Response("Not found", { status: 404 });
  const q = new URL(req.url).searchParams;
  const only = q.get("only");
  const days = Math.min(60, Math.max(1, Number(q.get("days")) || 3));
  const report: Record<string, unknown> = {};
  if (!only || only === "tenders") report.tenders = await fetchTenders(days);
  if (!only || only === "defence") report.defence = await fetchTradeDefence(days);
  if (only === "stats" || (!only && new Date().getUTCDay() === 1)) report.stats = await fetchTradeStats();
  for (const [job, r] of Object.entries(report)) for (const [src, v] of Object.entries(r as Record<string, { found?: number; added?: number; rows?: number; error?: string }>)) {
    await pool().query(`insert into wmn_fetch_log (source, ran_at, found, added, error) values ($1, now(), $2, $3, $4)
      on conflict (source) do update set ran_at = now(), found = excluded.found, added = excluded.added, error = excluded.error`, [`${job}:${src}`, v.found ?? v.rows ?? 0, v.added ?? v.rows ?? 0, v.error ?? null]);
  }
  return Response.json({ ok: true, report });
}
