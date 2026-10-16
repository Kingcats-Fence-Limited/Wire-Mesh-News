import { AUTH_LIVE } from "@/lib/server/env";
import { dx } from "@/lib/server/directus";
import { ACTIVE } from "@/lib/server/billing";

/* Approved Company-plan extras for a public profile (only while the plan is active). */
export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function GET(_req: Request, { params }: { params: Promise<{ slug: string }> }) {
  const slug = (await params).slug;
  const none = Response.json({ extras: null }, { headers: { "Cache-Control": "public, s-maxage=300, stale-while-revalidate=3600" } });
  if (!AUTH_LIVE) return none;
  const paying = await dx.list<{ id: string }>("subscriptions", { filter: { plan: { _in: ["company", "sponsor"] }, status: { _in: ACTIVE }, member: { company_slug: { _eq: slug } } }, fields: ["id"], limit: 1 }).catch(() => []);
  if (!paying.length) return none;
  const row = (await dx.list<{ catalogue: string | null; video_url: string | null; contacts: { name: string; role: string; email: string; phone: string }[] | null }>("company_extras", { filter: { company_slug: { _eq: slug }, status: { _eq: "approved" } }, fields: ["catalogue", "video_url", "contacts"], sort: ["-date_updated"], limit: 1 }))[0];
  if (!row) return none;
  return Response.json({ extras: { catalogue: !!row.catalogue, video: row.video_url, contacts: row.contacts ?? [] } }, { headers: { "Cache-Control": "public, s-maxage=300, stale-while-revalidate=3600" } });
}
