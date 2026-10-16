import { AUTH_LIVE } from "@/lib/server/env";
import { dx } from "@/lib/server/directus";

/* The approved catalogue PDF of a company profile. */
export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function GET(_req: Request, { params }: { params: Promise<{ slug: string }> }) {
  const slug = (await params).slug;
  if (!AUTH_LIVE) return new Response("Not found", { status: 404 });
  const row = (await dx.list<{ catalogue: string | null }>("company_extras", { filter: { company_slug: { _eq: slug }, status: { _eq: "approved" } }, fields: ["catalogue"], sort: ["-date_updated"], limit: 1 }))[0];
  if (!row?.catalogue) return new Response("Not found", { status: 404 });
  const res = await dx.asset(row.catalogue);
  if (!res.ok || !res.body) return new Response("Not found", { status: 404 });
  return new Response(res.body, { headers: { "Content-Type": "application/pdf", "Content-Disposition": `inline; filename="${slug.replace(/[^\w-]/g, "_")}-catalogue.pdf"`, "Cache-Control": "public, max-age=3600", "X-Content-Type-Options": "nosniff", "Content-Security-Policy": "sandbox" } });
}
