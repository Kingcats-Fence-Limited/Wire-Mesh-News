import { me, json } from "@/lib/server/guard";
import { pool } from "@/lib/server/db";
import { dx } from "@/lib/server/directus";
import { entitlement } from "@/lib/server/billing";
import { PRODUCT_BY_CODE } from "@/data/vocab/product";
import { COMPANIES } from "@/lib/content/directory";

/* Company plan: profile views, enquiries and saves for the last 90 days, plus open tenders for
   the company's products. */
export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function GET(req: Request) {
  const ctx = await me(req);
  if (ctx instanceof Response) return ctx;
  const slug = ctx.m.company_slug;
  if (!slug) return json({ error: "No company on this account." }, 404);
  if (!(await entitlement(ctx.m)).company) return json({ locked: true });
  const [daily, countries] = await Promise.all([
    pool().query<{ day: string; views: number }>(`select to_char(day, 'YYYY-MM-DD') as day, sum(views)::int as views from wmn_company_views where company_slug = $1 and day > current_date - 90 group by day order by day`, [slug]),
    pool().query<{ country: string; views: number }>(`select country, sum(views)::int as views from wmn_company_views where company_slug = $1 and day > current_date - 90 group by country order by views desc limit 10`, [slug]),
  ]);
  const since = new Date(Date.now() - 90 * 86400_000).toISOString();
  const [enq, saves] = await Promise.all([
    dx.list<{ date_created: string }>("enquiries", { filter: { company_slug: { _eq: slug }, date_created: { _gte: since } }, fields: ["date_created"], limit: 2000 }),
    dx.list<{ id: string }>("bookmarks", { filter: { href: { _eq: `/directory/${slug}/` }, date_created: { _gte: since } }, fields: ["id"], limit: 2000 }),
  ]);
  const products = COMPANIES.find((c) => c.slug === slug)?.products ?? [];
  const open = products.length ? await dx.list<{ id: string; title: string; country: string | null; deadline: string | null; url: string | null; products: string[] | null }>("tenders", { filter: { status: { _eq: "published" }, _or: [{ deadline: { _null: true } }, { deadline: { _gte: new Date().toISOString() } }] }, fields: ["id", "title", "country", "deadline", "url", "products"], sort: ["-published_on"], limit: 300 }).catch(() => []) : [];
  const tenders = open.filter((t) => (t.products ?? []).some((p) => products.includes(p))).slice(0, 20);
  return json({
    views: daily.rows, countries: countries.rows, enquiries: enq.length, saves: saves.length,
    totalViews: daily.rows.reduce((s, r) => s + r.views, 0),
    tenders, products: products.map((p) => PRODUCT_BY_CODE[p]?.labelEn ?? p),
  });
}
