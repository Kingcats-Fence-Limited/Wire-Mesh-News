import { randomUUID } from "node:crypto";
import { me, json } from "@/lib/server/guard";
import { dx } from "@/lib/server/directus";
import { entitlement } from "@/lib/server/billing";

/* Follow a trade-defence case (Pro): POST {case} · DELETE ?case= */
export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function POST(req: Request) {
  const ctx = await me(req);
  if (ctx instanceof Response) return ctx;
  if (!(await entitlement(ctx.m)).pro) return json({ error: "Case alerts are part of Pro.", upgrade: true }, 402);
  const id = String(((await req.json().catch(() => ({}))) as { case?: string }).case ?? "");
  const c = await dx.get<{ id: string; status: string }>("trade_cases", id, ["id", "status"]).catch(() => null);
  if (!c || c.status !== "published") return json({ error: "Case not found." }, 404);
  const dup = await dx.list("case_follows", { filter: { member: { _eq: ctx.m.id }, case: { _eq: id } }, limit: 1 });
  if (!dup.length) await dx.create("case_follows", { id: randomUUID(), member: ctx.m.id, case: id });
  return json({ ok: true });
}

export async function DELETE(req: Request) {
  const ctx = await me(req);
  if (ctx instanceof Response) return ctx;
  const id = new URL(req.url).searchParams.get("case") ?? "";
  const rows = await dx.list<{ id: string }>("case_follows", { filter: { member: { _eq: ctx.m.id }, case: { _eq: id } }, fields: ["id"], limit: 5 });
  if (rows.length) await dx.removeMany("case_follows", rows.map((r) => r.id));
  return json({ ok: true });
}
