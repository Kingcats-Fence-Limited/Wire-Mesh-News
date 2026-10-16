import { me, json } from "@/lib/server/guard";
import { BILLING_LIVE, ENV } from "@/lib/server/env";
import { stripe, customerFor, entitlement, priceId } from "@/lib/server/billing";
import { PLAN, TRIAL_DAYS, type Cycle, type PaidPlan } from "@/lib/plans";
import { limit } from "@/lib/server/rate-limit";

/* POST {plan, cycle, seats?} → a Stripe Checkout page (card collected; 14-day trial on the
   first subscription of an account; tax and company tax id collected by Stripe). */
export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function POST(req: Request) {
  if (!BILLING_LIVE) return json({ error: "Paid plans open soon." }, 404);
  const ctx = await me(req);
  if (ctx instanceof Response) return ctx;
  const rl = await limit(`checkout:${ctx.m.id}`, 20, 3600);
  if (!rl.ok) return json({ error: "Too many attempts. Try again later." }, 429);
  const b = (await req.json().catch(() => ({}))) as { plan?: string; cycle?: string; seats?: number };
  const plan = b.plan as PaidPlan, cycle = (b.cycle === "yearly" ? "yearly" : "monthly") as Cycle;
  if (!["pro", "team", "company"].includes(plan)) return json({ error: "Choose a plan." }, 400);
  if (plan === "company" && !ctx.m.company_slug) return json({ error: "The Company plan is for claimed Directory profiles. Claim your company first under My company.", claim: true }, 400);
  const price = priceId(plan, cycle);
  if (!price) return json({ error: "This plan is not available yet." }, 400);
  const ent = await entitlement(ctx.m);
  if (ent.own) return json({ error: "You already have a subscription. Change it from Subscription & billing.", manage: true }, 409);

  const included = PLAN.team.seats?.included ?? 5;
  const seats = plan === "team" ? Math.min(200, Math.max(included, Math.floor(Number(b.seats) || included))) : 1;
  const items: { price: string; quantity: number }[] = [{ price, quantity: 1 }];
  if (seats > included) {
    const seatPrice = ENV.stripePrices.teamSeat[cycle];
    if (!seatPrice) return json({ error: "Extra seats are not available yet." }, 400);
    items.push({ price: seatPrice, quantity: seats - included });
  }
  const origin = new URL(req.url).origin;
  const customer = await customerFor(ctx.m);
  const trial = !ctx.m.trial_used;
  const session = await stripe().checkout.sessions.create({
    mode: "subscription",
    customer,
    client_reference_id: ctx.m.id,
    line_items: items,
    payment_method_collection: "always",
    allow_promotion_codes: true,
    billing_address_collection: ENV.stripeTax ? "required" : "auto",
    automatic_tax: { enabled: ENV.stripeTax },
    tax_id_collection: { enabled: true },
    customer_update: { address: "auto", name: "auto" },
    subscription_data: {
      metadata: { member: ctx.m.id, plan, cycle },
      ...(trial ? { trial_period_days: TRIAL_DAYS, trial_settings: { end_behavior: { missing_payment_method: "cancel" } } } : {}),
    },
    metadata: { member: ctx.m.id, plan, cycle },
    success_url: `${origin}/account/?billing=success#billing`,
    cancel_url: `${origin}/pricing/?checkout=cancelled`,
  });
  return json({ url: session.url });
}
