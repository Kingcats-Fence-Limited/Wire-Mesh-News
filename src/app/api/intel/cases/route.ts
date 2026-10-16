import { viewer, priv } from "@/lib/server/viewer";
import { dx } from "@/lib/server/directus";
import { SAMPLE_CASES, type CaseItem } from "@/lib/content/intel-sample";

/* Trade-defence cases. Everyone: the case list. Pro: duty rates, companies, key dates, notices. */
export const dynamic = "force-dynamic";
export const runtime = "nodejs";
const FIELDS = ["id", "slug", "importing_country", "origins", "product", "hs_codes", "products", "measure", "stage", "rates", "summary", "next_date", "authority", "case_no", "url"];

export async function GET(req: Request) {
  const v = await viewer(req);
  const q = new URL(req.url).searchParams;
  const importing = q.get("importing"), origin = q.get("origin"), measure = q.get("measure");
  let items: CaseItem[];
  let follows: string[] = [];
  if (!v.live) {
    items = SAMPLE_CASES.filter((c) => (!importing || c.importing_country === importing) && (!origin || c.origins.includes(origin)) && (!measure || c.measure === measure));
  } else {
    const filter: Record<string, unknown> = { status: { _eq: "published" } };
    if (importing) filter.importing_country = { _eq: importing };
    if (origin) filter.origins = { _contains: origin };
    if (measure) filter.measure = { _eq: measure };
    items = await dx.list<CaseItem>("trade_cases", { filter, fields: FIELDS, sort: ["-date_updated", "-date_created"], limit: 200 });
    if (v.pro && items.length) {
      const ups = await dx.list<{ title: string; date: string | null; url: string | null; case: string }>("trade_case_updates", { filter: { status: { _eq: "published" }, case: { _in: items.map((c) => c.id) } }, fields: ["title", "date", "url", "case"], sort: ["-date"], limit: 1000 });
      items = items.map((c) => ({ ...c, updates: ups.filter((u) => u.case === c.id).slice(0, 10).map(({ title, date, url }) => ({ title, date, url })) }));
    }
    if (v.m) follows = (await dx.list<{ case: string }>("case_follows", { filter: { member: { _eq: v.m.id } }, fields: ["case"], limit: 500 })).map((f) => f.case);
  }
  const shown = items.map((c) => (v.pro ? c : { id: c.id, slug: c.slug, importing_country: c.importing_country, origins: c.origins, product: c.product, hs_codes: c.hs_codes, measure: c.measure, stage: c.stage }));
  return priv({ items: shown, full: v.pro, sample: !v.live, signedIn: !!v.user, follows });
}
