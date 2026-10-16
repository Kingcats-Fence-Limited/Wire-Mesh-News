import type Stripe from "stripe";
import { randomUUID } from "node:crypto";
import { BILLING_LIVE, ENV } from "@/lib/server/env";
import { stripe, mirror } from "@/lib/server/billing";
import { dx } from "@/lib/server/directus";
import { notify } from "@/lib/server/member";
import { sendMail, htmlFrom } from "@/lib/server/mail";
import { PLAN } from "@/lib/plans";
import { SITE } from "@/lib/site";

/* Stripe webhook (Dashboard → Developers → Webhooks → https://wiremeshnews.com/api/hooks/stripe/).
   Events: customer.subscription.created / updated / deleted / trial_will_end,
   checkout.session.completed, invoice.payment_failed. Signed with STRIPE_WEBHOOK_SECRET. */
export const dynamic = "force-dynamic";
export const runtime = "nodejs";

const fmt = (iso?: string | null) => (iso ? new Intl.DateTimeFormat("en-GB", { day: "numeric", month: "long", year: "numeric", timeZone: "UTC" }).format(new Date(iso)) : "");

async function emailMember(memberId: string | null, subject: string, lines: string[]) {
  if (!memberId) return;
  const m = await dx.get<{ email: string | null }>("members", memberId, ["email"]).catch(() => null);
  if (m?.email) await sendMail({ to: m.email, subject, text: [...lines, "", `${SITE.url}/account/#billing`].join("\n"), html: htmlFrom([...lines, `${SITE.url}/account/#billing`]) }).catch(() => {});
}

export async function POST(req: Request) {
  if (!BILLING_LIVE) return new Response("Not found", { status: 404 });
  const sig = req.headers.get("stripe-signature") ?? "";
  const body = await req.text();
  let ev: Stripe.Event;
  try { ev = stripe().webhooks.constructEvent(body, sig, ENV.stripeWebhookSecret); } catch { return new Response("Bad signature", { status: 400 }); }

  switch (ev.type) {
    case "customer.subscription.created":
    case "customer.subscription.updated":
    case "customer.subscription.deleted": {
      const sub = ev.data.object as Stripe.Subscription;
      const r = await mirror(sub);
      if (!r) break;
      const { row, created } = r;
      const name = PLAN[row.plan].name;
      if (created && row.member) {
        if (row.status === "trialing") await dx.update("members", row.member, { trial_used: true });
        await notify(row.member, "billing", row.status === "trialing" ? `Your ${name} free trial has started. It ends on ${fmt(row.trial_end)}; cancel before then and nothing is charged.` : `Welcome to ${name}.`, "/account/#billing");
      }
      if (ev.type === "customer.subscription.deleted" && row.member) {
        await notify(row.member, "billing", `Your ${name} plan has ended. Your account stays open on the Free plan.`, "/account/#billing");
        await emailMember(row.member, `Your ${name} plan has ended`, [`Your Wire Mesh News ${name} plan has ended. Your account, bookmarks and submissions stay; Pro content is locked again.`, "You can subscribe again at any time."]);
      }
      break;
    }
    case "customer.subscription.trial_will_end": {
      const sub = ev.data.object as Stripe.Subscription;
      const r = await mirror(sub);
      if (!r?.row.member) break;
      const p = PLAN[r.row.plan];
      const price = p.price ? (r.row.cycle === "yearly" ? `US$${p.price.yearly} a year` : `US$${p.price.monthly} a month`) : "";
      await notify(r.row.member, "billing", `Your ${p.name} trial ends on ${fmt(r.row.trial_end)}. ${r.row.cancel_at_period_end ? "It will not renew." : `Then it continues at ${price} plus any tax.`}`, "/account/#billing");
      if (!r.row.cancel_at_period_end) await emailMember(r.row.member, `Your ${p.name} trial ends on ${fmt(r.row.trial_end)}`, [`Your 14-day Wire Mesh News ${p.name} trial ends on ${fmt(r.row.trial_end)}.`, `After that your card is charged ${price} plus any tax. To stop it, cancel before that date under Subscription & billing.`]);
      break;
    }
    case "checkout.session.completed": {
      const s = ev.data.object as Stripe.Checkout.Session;
      if (s.mode === "subscription" && typeof s.subscription === "string") { await mirror(await stripe().subscriptions.retrieve(s.subscription)); break; }
      if (s.mode !== "payment" || s.payment_status !== "paid" || !s.metadata?.product) break;
      const dup = await dx.list<{ id: string }>("purchases", { filter: { stripe_session: { _eq: s.id } }, limit: 1 });
      if (dup.length) break;
      await dx.create("purchases", { id: randomUUID(), member: s.metadata.member ?? null, product: s.metadata.product, stripe_session: s.id, amount: s.amount_total ?? 0, currency: s.currency ?? "usd" });
      if (s.metadata.member) await notify(s.metadata.member, "billing", `Thank you — your report is ready to download under Subscription & billing.`, "/account/#billing");
      break;
    }
    case "invoice.payment_failed": {
      const inv = ev.data.object as Stripe.Invoice;
      const cust = typeof inv.customer === "string" ? inv.customer : inv.customer?.id;
      const m = cust ? (await dx.list<{ id: string }>("members", { filter: { stripe_customer_id: { _eq: cust } }, fields: ["id"], limit: 1 }))[0] : undefined;
      if (m) await notify(m.id, "billing", "A payment did not go through. Update your card under Subscription & billing to keep your plan.", "/account/#billing");
      break;
    }
  }
  return Response.json({ received: true });
}
