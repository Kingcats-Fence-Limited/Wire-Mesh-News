import { me } from "@/lib/server/guard";
import { dx } from "@/lib/server/directus";

/* GET ?slug= → the report PDF, for buyers only (streamed through the site; Directus stays hidden). */
export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function GET(req: Request) {
  const ctx = await me(req);
  if (ctx instanceof Response) return ctx;
  const slug = new URL(req.url).searchParams.get("slug") ?? "";
  const owned = await dx.list("purchases", { filter: { member: { _eq: ctx.m.id }, product: { _eq: slug } }, limit: 1 });
  if (!owned.length) return new Response("Not found", { status: 404 });
  const r = (await dx.list<{ file: string | null; title: string }>("reports", { filter: { slug: { _eq: slug } }, fields: ["file", "title"], limit: 1 }))[0];
  if (!r?.file) return new Response("Not found", { status: 404 });
  const res = await dx.asset(r.file);
  if (!res.ok || !res.body) return new Response("Not found", { status: 404 });
  return new Response(res.body, { headers: { "Content-Type": "application/pdf", "Content-Disposition": `attachment; filename="${slug.replace(/[^\w-]/g, "_")}.pdf"`, "Cache-Control": "private, no-store", "X-Content-Type-Options": "nosniff" } });
}
