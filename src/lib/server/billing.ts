import "server-only";
import Stripe from "stripe";
import { randomUUID } from "node:crypto";
import { ENV } from "./env";
import { dx } from "./directus";
import type { MemberRow } from "./member";
import type { Cycle, PaidPlan, PlanId } from "@/lib/plans";
import { PLAN } from "@/lib/plans";

/* Stripe (Hong Kong account) and what each member is entitled to. Stripe is the source of
   truth for payments; the webhook mirrors each subscription into Directus `subscriptions`,
   and every check here reads that mirror. */

let client: Stripe | null = null;
export function stripe(): Stripe {
  if (!ENV.stripeSecret) throw new Error("Payments are not configured.");
  return (client ??= new Stripe(ENV.stripeSecret, { appInfo: { name: "Wire Mesh News" } }));
}

export type SubRow = {
  id: string; member: string | null; plan: PaidPlan; cycle: Cycle; status: string; stripe_subscription: string; stripe_customer: string | null;
  seats: number | null; trial_end: string | null; period_end: string | null; cancel_at_period_end: boolean; date_created: string;
};
export const ACTIVE = ["trialing", "active", "past_due"];

export type Entitlement = {
  plan: PlanId;
  /** Pro content and tools (Pro, Team owner and seats, Company owner). */
  pro: boolean;
  /** Company plan features (needs a claimed company). */
  company: boolean;
  paid: boolean;
  own: SubRow | null;
  /** Set when access comes from someone else's Team subscription. */
  seatOf: string | null;
};

const RANK: Record<PlanId, number> = { free: 0, pro: 1, company: 2, team: 3 };

export async function entitlement(m: Pick<MemberRow, "id" | "email">): Promise<Entitlement> {
  const own = await dx.list<SubRow>("subscriptions", { filter: { member: { _eq: m.id }, status: { _in: ACTIVE } }, sort: ["-date_created"], limit: 5 });
  let seat: { subscription: SubRow } | undefined;
  if (m.email) {
    const seats = await dx.list<{ subscription: SubRow | null }>("team_seats", { filter: { email: { _eq: m.email.toLowerCase() } }, fields: ["subscription.*"], limit: 5 });
    seat = seats.find((s) => s.subscription && ACTIVE.includes(s.subscription.status)) as { subscription: SubRow } | undefined;
  }
  const best = own.slice().sort((a, b) => RANK[b.plan] - RANK[a.plan])[0] ?? null;
  const plan = (best?.plan ?? (seat ? "team" : "free")) as PlanId;
  return { plan, pro: plan !== "free", company: own.some((s) => s.plan === "company"), paid: plan !== "free", own: best, seatOf: best ? null : seat?.subscription.id ?? null };
}

export function priceId(plan: PaidPlan, cycle: Cycle) {
  return ENV.stripePrices[plan][cycle];
}
/** Which plan and cycle a Stripe price id stands for. */
export function planOfPrice(id: string): { plan: PaidPlan; cycle: Cycle } | { seat: Cycle } | null {
  for (const plan of ["pro", "team", "company"] as PaidPlan[]) for (const cycle of ["monthly", "yearly"] as Cycle[]) if (ENV.stripePrices[plan][cycle] === id) return { plan, cycle };
  for (const cycle of ["monthly", "yearly"] as Cycle[]) if (ENV.stripePrices.teamSeat[cycle] === id) return { seat: cycle };
  return null;
}

export async function customerFor(m: MemberRow): Promise<string> {
  if (m.stripe_customer_id) return m.stripe_customer_id;
  const c = await stripe().customers.create({ email: m.email ?? undefined, name: m.name ?? undefined, metadata: { member: m.id } }, { idempotencyKey: `cust-${m.id}` });
  await dx.update("members", m.id, { stripe_customer_id: c.id });
  return c.id;
}

/** Mirror a Stripe subscription into Directus. Returns the row and whether it is new. */
export async function mirror(sub: Stripe.Subscription): Promise<{ row: SubRow; created: boolean } | null> {
  let plan: PaidPlan | null = null, cycle: Cycle = "monthly", extra = 0;
  for (const it of sub.items.data) {
    const p = planOfPrice(it.price.id);
    if (p && "plan" in p) { plan = p.plan; cycle = p.cycle; }
    else if (p && "seat" in p) extra += it.quantity ?? 0;
  }
  plan ??= (sub.metadata?.plan as PaidPlan | undefined) ?? null;
  if (!plan || !PLAN[plan]) return null;
  const customer = typeof sub.customer === "string" ? sub.customer : sub.customer.id;
  let member = sub.metadata?.member ?? null;
  if (!member) member = (await dx.list<{ id: string }>("members", { filter: { stripe_customer_id: { _eq: customer } }, fields: ["id"], limit: 1 }))[0]?.id ?? null;
  const end = sub.items.data[0]?.current_period_end;
  const data = {
    member, plan, cycle, status: sub.status, stripe_customer: customer,
    seats: plan === "team" ? (PLAN.team.seats?.included ?? 5) + extra : 1,
    trial_end: sub.trial_end ? new Date(sub.trial_end * 1000).toISOString() : null,
    period_end: end ? new Date(end * 1000).toISOString() : null,
    cancel_at_period_end: !!sub.cancel_at_period_end || !!sub.cancel_at,
  };
  const found = (await dx.list<SubRow>("subscriptions", { filter: { stripe_subscription: { _eq: sub.id } }, limit: 1 }))[0];
  if (found) { await dx.update("subscriptions", found.id, data); return { row: { ...found, ...data } as SubRow, created: false }; }
  const row = await dx.create<SubRow>("subscriptions", { id: randomUUID(), stripe_subscription: sub.id, ...data });
  return { row, created: true };
}
