import "server-only";
import { pool } from "./db";

/* Premium-article meter for signed-in Free readers: which premium articles they opened this
   calendar month (UTC). Re-opening the same article does not count twice. */
const month = () => new Date().toISOString().slice(0, 7);

export async function meterUsed(userId: string): Promise<number> {
  const { rows } = await pool().query<{ n: string }>(`select count(*) as n from wmn_meter where user_id = $1 and month = $2`, [userId, month()]);
  return Number(rows[0]?.n ?? 0);
}

/** Records the article if there is room; returns whether this reader may open it. */
export async function meterTake(userId: string, slug: string, max: number): Promise<{ ok: boolean; used: number }> {
  const m = month();
  const seen = await pool().query(`select 1 from wmn_meter where user_id = $1 and month = $2 and slug = $3`, [userId, m, slug]);
  const used = await meterUsed(userId);
  if (seen.rowCount) return { ok: true, used };
  if (used >= max) return { ok: false, used };
  await pool().query(`insert into wmn_meter (user_id, month, slug) values ($1, $2, $3) on conflict do nothing`, [userId, m, slug]);
  return { ok: true, used: used + 1 };
}
