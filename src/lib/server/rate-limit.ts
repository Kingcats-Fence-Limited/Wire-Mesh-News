import "server-only";
import { pool } from "./db";

/* Fixed-window counter in Postgres, so it holds across serverless instances.
   limit("enquiry:<member>", 5, 86400) → at most 5 per day. */
export async function limit(key: string, max: number, windowSeconds: number): Promise<{ ok: boolean; retryAfter: number }> {
  const { rows } = await pool().query<{ count: number; window_start: Date }>(
    `insert into wmn_rate_limit (key, window_start, count) values ($1, now(), 1)
     on conflict (key) do update set
       count = case when wmn_rate_limit.window_start < now() - make_interval(secs => $2) then 1 else wmn_rate_limit.count + 1 end,
       window_start = case when wmn_rate_limit.window_start < now() - make_interval(secs => $2) then now() else wmn_rate_limit.window_start end
     returning count, window_start`,
    [key.slice(0, 200), windowSeconds],
  );
  const r = rows[0];
  const retryAfter = Math.max(0, Math.ceil((r.window_start.getTime() + windowSeconds * 1000 - Date.now()) / 1000));
  return { ok: r.count <= max, retryAfter };
}

/** The visitor's IP as Vercel reports it (first hop), for anonymous limits. */
export function clientIp(req: Request): string {
  const f = req.headers.get("x-forwarded-for") ?? "";
  return (f.split(",")[0] || req.headers.get("x-real-ip") || "unknown").trim();
}
