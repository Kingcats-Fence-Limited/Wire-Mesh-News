import { AUTH_LIVE } from "@/lib/server/env";
import { pool } from "@/lib/server/db";
import { limit, clientIp } from "@/lib/server/rate-limit";
import { COMPANIES } from "@/lib/content/directory";

/* Counts a company profile view (for the Company plan's analytics). Stores only the day and
   the visitor's country (from Vercel's edge); no IP, cookie or user id is kept. */
export const dynamic = "force-dynamic";
export const runtime = "nodejs";
const BOT = /bot|crawl|spider|slurp|preview|headless|lighthouse|facebookexternalhit|embedly/i;

export async function POST(req: Request) {
  if (!AUTH_LIVE) return new Response(null, { status: 204 });
  const slug = String(((await req.json().catch(() => ({}))) as { slug?: string }).slug ?? "");
  if (!COMPANIES.some((c) => c.slug === slug) || BOT.test(req.headers.get("user-agent") ?? "")) return new Response(null, { status: 204 });
  const once = await limit(`view:${clientIp(req)}:${slug}`, 1, 21600); // one view per visitor per 6 hours
  if (!once.ok) return new Response(null, { status: 204 });
  const country = (req.headers.get("x-vercel-ip-country") ?? "").slice(0, 2).toUpperCase();
  await pool().query(`insert into wmn_company_views (company_slug, day, country, views) values ($1, current_date, $2, 1)
    on conflict (company_slug, day, country) do update set views = wmn_company_views.views + 1`, [slug, country]);
  return new Response(null, { status: 204 });
}
