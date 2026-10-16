import { me, json } from "@/lib/server/guard";
import { BILLING_LIVE, ENV } from "@/lib/server/env";
import { dx } from "@/lib/server/directus";
import { stripe, customerFor } from "@/lib/server/billing";

/* POST {slug} → Stripe Checkout for one report (one-off payment). */
export const dynamic = "force-dynamic";
export const runtime = "nodejs";

type Report = { id: string; slug: string; title: string; price_usd: number; stripe_price: string | null; status: string };

export async function POST(req: Request) {
  if (!BILLING_LIVE) return json({ error: "The report shop opens soon." }, 404);
  const ctx = await me(req);
  if (ctx instanceof Response) return ctx;
  const slug = String(((await req.json().catch(() => ({}))) as { slug?: string }).slug ?? "");
  const r = (await dx.list<Report>("reports", { filter: { slug: { _eq: slug }, status: { _eq: "published" } }, limit: 1 }))[0];
  if (!r) return json({ error: "Report not found." }, 404);
  const owned = await dx.list("purchases", { filter: { member: { _eq: ctx.m.id }, product: { _eq: r.slug } }, limit: 1 });
  if (owned.length) return json({ error: "You already own this report. Download it under Subscription & billing.", owned: true }, 409);
  const origin = new URL(req.url).origin;
  const s = await stripe().checkout.sessions.create({
    mode: "payment",
    customer: await customerFor(ctx.m),
    client_reference_id: ctx.m.id,
    line_items: [r.stripe_price ? { price: r.stripe_price, quantity: 1 } : { price_data: { currency: "usd", unit_amount: r.price_usd * 100, product_data: { name: r.title } }, quantity: 1 }],
    automatic_tax: { enabled: ENV.stripeTax },
    billing_address_collection: ENV.stripeTax ? "required" : "auto",
    tax_id_collection: { enabled: true },
    customer_update: { address: "auto", name: "auto" },
    invoice_creation: { enabled: true },
    metadata: { member: ctx.m.id, product: r.slug },
    success_url: `${origin}/account/?billing=report#billing`,
    cancel_url: `${origin}/reports/${r.slug}/`,
  });
  return json({ url: s.url });
}
