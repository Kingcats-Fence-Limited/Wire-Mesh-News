import { AUTH_LIVE } from "@/lib/server/env";
import { dx } from "@/lib/server/directus";
import { ACTIVE } from "@/lib/server/billing";

/* Which Directory companies currently pay for the Company plan (for the PAID MEMBER mark).
   Public and cached for five minutes; it carries nothing but company slugs. */
export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function GET() {
  if (!AUTH_LIVE) return Response.json({ slugs: [] });
  const subs = await dx.list<{ member: { company_slug: string | null } | null }>("subscriptions", { filter: { plan: { _eq: "company" }, status: { _in: ACTIVE } }, fields: ["member.company_slug"], limit: 2000 }).catch(() => []);
  const slugs = [...new Set(subs.map((s) => s.member?.company_slug).filter((x): x is string => !!x))];
  return Response.json({ slugs }, { headers: { "Cache-Control": "public, s-maxage=300, stale-while-revalidate=3600" } });
}
