import { randomUUID } from "node:crypto";
import { me, json } from "@/lib/server/guard";
import { dx } from "@/lib/server/directus";
import { entitlement } from "@/lib/server/billing";
import { PRODUCT_BY_CODE } from "@/data/vocab/product";
import { COUNTRY_BY_CODE } from "@/data/vocab/country";

/* Saved tender searches (Pro): GET list · POST {name, products[], countries[]} · DELETE ?id= */
export const dynamic = "force-dynamic";
export const runtime = "nodejs";
type Alert = { id: string; name: string | null; products: string[] | null; countries: string[] | null; member: string };

export async function GET(req: Request) {
  const ctx = await me(req);
  if (ctx instanceof Response) return ctx;
  const list = await dx.list<Alert>("tender_alerts", { filter: { member: { _eq: ctx.m.id } }, fields: ["id", "name", "products", "countries"], limit: 50 });
  return json({ alerts: list });
}

export async function POST(req: Request) {
  const ctx = await me(req);
  if (ctx instanceof Response) return ctx;
  if (!(await entitlement(ctx.m)).pro) return json({ error: "Tender alerts are part of Pro.", upgrade: true }, 402);
  const b = (await req.json().catch(() => ({}))) as { name?: string; products?: string[]; countries?: string[] };
  const products = (b.products ?? []).filter((p) => PRODUCT_BY_CODE[p]).slice(0, 20);
  const countries = (b.countries ?? []).filter((c) => COUNTRY_BY_CODE[c]).slice(0, 40);
  if (!products.length && !countries.length) return json({ error: "Choose at least one product or country." }, 400);
  const have = await dx.list<{ id: string }>("tender_alerts", { filter: { member: { _eq: ctx.m.id } }, fields: ["id"], limit: 50 });
  if (have.length >= 10) return json({ error: "Up to 10 alerts per account." }, 400);
  const id = randomUUID();
  await dx.create("tender_alerts", { id, member: ctx.m.id, name: String(b.name ?? "").trim().slice(0, 80) || null, products, countries, last_sent: new Date().toISOString() });
  return json({ ok: true, id });
}

export async function DELETE(req: Request) {
  const ctx = await me(req);
  if (ctx instanceof Response) return ctx;
  const id = new URL(req.url).searchParams.get("id") ?? "";
  const row = await dx.get<Alert>("tender_alerts", id, ["id", "member"]).catch(() => null);
  if (!row || row.member !== ctx.m.id) return json({ error: "Not found." }, 404);
  await dx.remove("tender_alerts", id);
  return json({ ok: true });
}
