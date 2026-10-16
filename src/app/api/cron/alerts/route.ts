import { cronAllowed } from "@/lib/server/cron-auth";
import { pool } from "@/lib/server/db";
import { dx } from "@/lib/server/directus";
import { entitlement } from "@/lib/server/billing";
import { sendMail, htmlFrom } from "@/lib/server/mail";
import { PRODUCT_BY_CODE } from "@/data/vocab/product";
import { COUNTRY_BY_CODE } from "@/data/vocab/country";
import { SITE } from "@/lib/site";

/* Daily emails for Pro readers: new published tenders matching each saved alert, and new
   published notices on trade-defence cases they follow. */
export const dynamic = "force-dynamic";
export const runtime = "nodejs";
export const maxDuration = 300;

type Alert = { id: string; name: string | null; products: string[] | null; countries: string[] | null; last_sent: string | null; date_created: string; member: { id: string; email: string | null; name: string | null } | null };
type Tender = { id: string; title: string; country: string | null; products: string[] | null; deadline: string | null; buyer: string | null; published_at: string };
const day = (iso: string | null) => (iso ? new Intl.DateTimeFormat("en-GB", { day: "numeric", month: "short", year: "numeric" }).format(new Date(iso)) : "—");

export async function GET(req: Request) {
  if (!cronAllowed(req)) return new Response("Not found", { status: 404 });
  const now = new Date().toISOString();
  let tenderMails = 0, caseMails = 0;

  /* Tenders */
  const alerts = await dx.list<Alert>("tender_alerts", { fields: ["id", "name", "products", "countries", "last_sent", "date_created", "member.id", "member.email", "member.name"], limit: 5000 });
  const oldest = alerts.reduce((m, a) => { const t = a.last_sent ?? a.date_created; return t < m ? t : m; }, now);
  const fresh = alerts.length ? await dx.list<Tender>("tenders", { filter: { status: { _eq: "published" }, published_at: { _gt: oldest } }, fields: ["id", "title", "country", "products", "deadline", "buyer", "published_at"], sort: ["-published_at"], limit: 1000 }) : [];
  for (const a of alerts) {
    if (!a.member?.email) continue;
    const since = a.last_sent ?? a.date_created;
    const hits = fresh.filter((t) => t.published_at > since && (!a.products?.length || (t.products ?? []).some((p) => a.products!.includes(p))) && (!a.countries?.length || (t.country && a.countries.includes(t.country))));
    if (!hits.length) continue;
    if (!(await entitlement({ id: a.member.id, email: a.member.email })).pro) continue;
    const lines = hits.slice(0, 30).map((t) => `• ${t.title} — ${COUNTRY_BY_CODE[t.country ?? ""]?.name ?? t.country ?? ""}${t.deadline ? `, deadline ${day(t.deadline)}` : ""}`);
    const what = [a.products?.map((p) => PRODUCT_BY_CODE[p]?.labelEn ?? p).join(", "), a.countries?.map((c) => COUNTRY_BY_CODE[c]?.name ?? c).join(", ")].filter(Boolean).join(" · ") || "all tenders";
    await sendMail({ to: a.member.email, subject: `${hits.length} new tender${hits.length > 1 ? "s" : ""}: ${a.name || what}`, text: [`New tenders for your alert (${what}):`, "", ...lines, "", `${SITE.url}/tenders/`, "", `Manage alerts: ${SITE.url}/tenders/#alerts`].join("\n"), html: htmlFrom([`New tenders for your alert (${what}):`, ...lines, `${SITE.url}/tenders/`, `Manage alerts: ${SITE.url}/tenders/#alerts`]) }).catch(() => {});
    await dx.update("tender_alerts", a.id, { last_sent: now });
    tenderMails++;
  }

  /* Trade-defence case updates */
  const { rows } = await pool().query<{ ran_at: Date }>(`select ran_at from wmn_fetch_log where source = 'alerts:cases'`);
  const since = rows[0]?.ran_at.toISOString() ?? new Date(Date.now() - 86400_000).toISOString();
  const updates = await dx.list<{ id: string; title: string; summary: string | null; case: { id: string; product: string | null; importing_country: string | null; slug: string | null } | null }>("trade_case_updates", { filter: { status: { _eq: "published" }, published_at: { _gt: since }, case: { _nnull: true } }, fields: ["id", "title", "summary", "case.id", "case.product", "case.importing_country", "case.slug"], limit: 500 });
  const byCase = new Map<string, typeof updates>();
  for (const u of updates) if (u.case) byCase.set(u.case.id, [...(byCase.get(u.case.id) ?? []), u]);
  for (const [caseId, list] of byCase) {
    const followers = await dx.list<{ member: { id: string; email: string | null } | null }>("case_follows", { filter: { case: { _eq: caseId } }, fields: ["member.id", "member.email"], limit: 5000 });
    const c = list[0].case!;
    for (const f of followers) {
      if (!f.member?.email || !(await entitlement({ id: f.member.id, email: f.member.email })).pro) continue;
      const lines = list.map((u) => `• ${u.title}${u.summary ? ` — ${u.summary.slice(0, 280)}` : ""}`);
      await sendMail({ to: f.member.email, subject: `Trade defence update: ${c.product ?? "a case you follow"}`, text: [`New on a case you follow (${c.importing_country ?? ""} · ${c.product ?? ""}):`, "", ...lines, "", `${SITE.url}/trade-defence/${c.slug ? `#${c.slug}` : ""}`].join("\n"), html: htmlFrom([`New on a case you follow (${c.importing_country ?? ""} · ${c.product ?? ""}):`, ...lines, `${SITE.url}/trade-defence/`]) }).catch(() => {});
      caseMails++;
    }
  }
  await pool().query(`insert into wmn_fetch_log (source, ran_at, found, added) values ('alerts:cases', now(), $1, $2) on conflict (source) do update set ran_at = now(), found = excluded.found, added = excluded.added`, [updates.length, caseMails]);
  return Response.json({ ok: true, tenderMails, caseMails });
}
