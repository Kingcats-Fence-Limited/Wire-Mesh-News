import { AUTH_LIVE } from "@/lib/server/env";
import { dx } from "@/lib/server/directus";
import { ACTIVE } from "@/lib/server/billing";
import { COMPANIES } from "@/lib/content/directory";
import { sponsorCard } from "@/lib/sponsors";

/* Current Directory Sponsors (yearly sponsorship), for the SPONSOR mark and the labelled
   sponsor spots. Public, cached for five minutes. Preview: the content's own sample flag. */
export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function GET() {
  let slugs: { slug: string; year: number }[];
  if (!AUTH_LIVE) slugs = COMPANIES.filter((c) => c.sponsor).map((c) => ({ slug: c.slug, year: c.sponsor! }));
  else {
    const subs = await dx.list<{ date_created: string; member: { company_slug: string | null } | null }>("subscriptions", { filter: { plan: { _eq: "sponsor" }, status: { _in: ACTIVE } }, fields: ["date_created", "member.company_slug"], limit: 2000 }).catch(() => []);
    const year = new Date().getUTCFullYear();
    slugs = [...new Set(subs.map((s) => s.member?.company_slug).filter((x): x is string => !!x))].map((slug) => ({ slug, year }));
  }
  const sponsors = slugs.map(({ slug, year }) => { const c = COMPANIES.find((x) => x.slug === slug); return c ? sponsorCard(c, year) : null; }).filter(Boolean);
  return Response.json({ sponsors }, { headers: { "Cache-Control": "public, s-maxage=300, stale-while-revalidate=3600" } });
}
