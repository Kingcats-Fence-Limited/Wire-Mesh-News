import { cronAllowed } from "@/lib/server/cron-auth";
import { dx } from "@/lib/server/directus";
import { pool } from "@/lib/server/db";

/* Daily clean-up (Vercel Cron, Authorization: Bearer CRON_SECRET):
   - accounts whose deletion was requested 30+ days ago: private data removed, sign-in deleted.
     Published articles stay with their by-line (the member row keeps the name only).
   - expired codes, rate-limit rows and sessions; unconfirmed newsletter sign-ups after 7 days. */
export const dynamic = "force-dynamic";
export const runtime = "nodejs";
export const maxDuration = 60;

export async function GET(req: Request) {
  if (!cronAllowed(req)) return new Response("Not found", { status: 404 });
  const cutoff = new Date(Date.now() - 30 * 86400_000).toISOString();
  const gone = await dx.list<{ id: string; auth_user_id: string; avatar: string | null }>("members", { filter: { deletion_requested_at: { _lte: cutoff }, auth_user_id: { _nstarts_with: "deleted:" } }, fields: ["id", "auth_user_id", "avatar"], limit: 100 });
  for (const m of gone) {
    const by = { member: { _eq: m.id } };
    for (const coll of ["bookmarks", "standard_follows", "notifications", "enquiries", "company_claims", "company_change_requests"]) {
      const rows = await dx.list<{ id: string }>(coll, { filter: by, fields: ["id"], limit: -1 });
      if (rows.length) await dx.removeMany(coll, rows.map((r) => r.id));
    }
    const drafts = await dx.list<{ id: string }>("submissions", { filter: { ...by, status: { _neq: "published" } }, fields: ["id"], limit: -1 });
    if (drafts.length) await dx.removeMany("submissions", drafts.map((r) => r.id));
    const coms = await dx.list<{ id: string }>("comments", { filter: { ...by, status: { _neq: "approved" } }, fields: ["id"], limit: -1 });
    if (coms.length) await dx.removeMany("comments", coms.map((r) => r.id));
    const files = await dx.files<{ id: string }>({ filter: { owner_member: { _eq: m.id }, visibility: { _eq: "private" } }, fields: ["id"], limit: -1 }).catch(() => []);
    for (const f of files) await dx.removeFile(f.id).catch(() => {});
    if (m.avatar) await dx.removeFile(m.avatar).catch(() => {});
    await dx.update("members", m.id, { auth_user_id: `deleted:${m.id}`, deletion_requested_at: null, email: null, job_title: null, company_name: null, country: null, city: null, avatar: null, author_public_email: null, author_linkedin: null, author_x: null, author_website: null, prefs: null, company_slug: null, roles: [] });
    await pool().query(`delete from "user" where id = $1`, [m.auth_user_id]);
  }
  const db = pool();
  await db.query(`delete from wmn_email_code where expires_at < now() - interval '1 day'`);
  await db.query(`delete from wmn_rate_limit where window_start < now() - interval '2 days'`);
  await db.query(`delete from "session" where "expiresAt" < now()`);
  await db.query(`delete from verification where "expiresAt" < now()`);
  const stale = await dx.list<{ id: string }>("newsletter_subscribers", { filter: { status: { _eq: "pending" }, date_created: { _lte: new Date(Date.now() - 7 * 86400_000).toISOString() } }, fields: ["id"], limit: 500 });
  if (stale.length) await dx.removeMany("newsletter_subscribers", stale.map((r) => r.id));
  return Response.json({ ok: true, accountsRemoved: gone.length, staleSignups: stale.length });
}
