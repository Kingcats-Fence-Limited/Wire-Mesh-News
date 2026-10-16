import { me, json } from "@/lib/server/guard";
import { BILLING_LIVE } from "@/lib/server/env";
import { dx } from "@/lib/server/directus";
import { stripe, entitlement } from "@/lib/server/billing";
import { FREE_PREMIUM_PER_MONTH } from "@/lib/plans";
import { meterUsed } from "@/lib/server/meter";

/* The billing panel's data: plan and status, card, invoices, team seats. */
export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function GET(req: Request) {
  const ctx = await me(req);
  if (ctx instanceof Response) return ctx;
  const ent = await entitlement(ctx.m);
  const used = ent.pro ? 0 : await meterUsed(ctx.user.id);
  const bought = await dx.list<{ product: string; date_created: string }>("purchases", { filter: { member: { _eq: ctx.m.id } }, fields: ["product", "date_created"], sort: ["-date_created"], limit: 100 });
  const titles = bought.length ? await dx.list<{ slug: string; title: string }>("reports", { filter: { slug: { _in: bought.map((b) => b.product) } }, fields: ["slug", "title"], limit: 100 }) : [];
  const reports = bought.map((b) => ({ slug: b.product, title: titles.find((t) => t.slug === b.product)?.title ?? b.product, date: b.date_created }));
  const base = { reports, live: BILLING_LIVE, plan: ent.plan, pro: ent.pro, company: ent.company, seatOf: !!ent.seatOf, hasCompany: !!ctx.m.company_slug, trialUsed: !!ctx.m.trial_used, meter: { used, limit: FREE_PREMIUM_PER_MONTH } };
  if (!ent.own || !BILLING_LIVE) return json({ ...base, sub: null });
  const s = ent.own;
  let card: { brand: string; last4: string; exp: string } | null = null;
  let invoices: { no: string; date: string; amount: string; status: string; url: string | null; pdf: string | null }[] = [];
  try {
    const st = stripe();
    const sub = await st.subscriptions.retrieve(s.stripe_subscription, { expand: ["default_payment_method"] });
    const pm = sub.default_payment_method;
    if (pm && typeof pm !== "string" && pm.card) card = { brand: pm.card.brand, last4: pm.card.last4, exp: `${String(pm.card.exp_month).padStart(2, "0")}/${String(pm.card.exp_year).slice(-2)}` };
    const inv = await st.invoices.list({ customer: s.stripe_customer ?? undefined, limit: 12 });
    invoices = inv.data.filter((i) => i.status !== "draft").map((i) => ({ no: i.number ?? i.id ?? "", date: new Date(i.created * 1000).toISOString(), amount: `${(i.total / 100).toFixed(2)} ${i.currency.toUpperCase()}`, status: i.status ?? "", url: i.hosted_invoice_url ?? null, pdf: i.invoice_pdf ?? null }));
  } catch { /* Stripe unreachable: show what we have */ }
  const seats = s.plan === "team" ? await dx.list<{ id: string; email: string }>("team_seats", { filter: { subscription: { _eq: s.id } }, fields: ["id", "email"], limit: 500 }) : [];
  return json({ ...base, sub: { plan: s.plan, cycle: s.cycle, status: s.status, trialEnd: s.trial_end, periodEnd: s.period_end, cancelAtPeriodEnd: s.cancel_at_period_end, seats: s.seats ?? 1 }, card, invoices, team: seats });
}
