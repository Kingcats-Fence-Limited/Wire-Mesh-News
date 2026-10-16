import { viewer, priv } from "@/lib/server/viewer";
import { dx } from "@/lib/server/directus";
import { SAMPLE_TENDERS, type TenderItem } from "@/lib/content/intel-sample";

/* Published tenders. Everyone: title, country, products, kind, publication date. Pro: buyer,
   summary, quantity, value, deadline and the original notice. */
export const dynamic = "force-dynamic";
export const runtime = "nodejs";
const PER = 20;
const FIELDS = ["id", "title", "summary", "buyer", "country", "city", "products", "kind", "quantity", "value", "currency", "published_on", "deadline", "source", "url"];

export async function GET(req: Request) {
  const v = await viewer(req);
  const q = new URL(req.url).searchParams;
  const product = q.get("product"), country = q.get("country"), kind = q.get("kind"), text = (q.get("q") ?? "").trim().slice(0, 80);
  const open = q.get("open") === "1";
  const page = Math.max(1, Number(q.get("page")) || 1);
  let items: TenderItem[], total: number;
  if (!v.live) {
    let list = SAMPLE_TENDERS.filter((t) => (!product || t.products.includes(product)) && (!country || t.country === country) && (!kind || t.kind === kind) && (!text || `${t.title} ${t.summary}`.toLowerCase().includes(text.toLowerCase())) && (!open || !t.deadline || t.deadline >= new Date().toISOString().slice(0, 10)));
    total = list.length; list = list.slice((page - 1) * PER, page * PER); items = list;
  } else {
    const filter: Record<string, unknown> = { status: { _eq: "published" } };
    if (product) filter.products = { _contains: `"${product}"` }; // JSON array stored as text: match the quoted code
    if (country) filter.country = { _eq: country };
    if (kind) filter.kind = { _eq: kind };
    if (open) filter._or = [{ deadline: { _null: true } }, { deadline: { _gte: new Date().toISOString() } }];
    items = await dx.list<TenderItem>("tenders", { filter, fields: FIELDS, sort: ["-published_on", "-date_created"], limit: PER + 1, offset: (page - 1) * PER, search: text || undefined });
    total = (page - 1) * PER + items.length;
    items = items.slice(0, PER);
  }
  const full = v.pro;
  const shown = items.map((t) => (full ? t : { id: t.id, title: t.title, country: t.country, products: t.products ?? [], kind: t.kind, published_on: t.published_on }));
  return priv({ items: shown, page, more: total > page * PER, full, sample: !v.live, signedIn: !!v.user });
}
