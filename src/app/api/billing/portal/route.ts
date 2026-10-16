import { me, json } from "@/lib/server/guard";
import { BILLING_LIVE } from "@/lib/server/env";
import { stripe } from "@/lib/server/billing";

/* POST → Stripe's customer portal: change card or plan, download invoices, cancel. */
export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function POST(req: Request) {
  if (!BILLING_LIVE) return json({ error: "Paid plans open soon." }, 404);
  const ctx = await me(req);
  if (ctx instanceof Response) return ctx;
  if (!ctx.m.stripe_customer_id) return json({ error: "No billing account yet." }, 404);
  const s = await stripe().billingPortal.sessions.create({ customer: ctx.m.stripe_customer_id, return_url: `${new URL(req.url).origin}/account/#billing` });
  return json({ url: s.url });
}
