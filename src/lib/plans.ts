/* Paid plans. One source for the pricing page, the account's billing panel and the server's
   checks. Prices are in whole US dollars; the Stripe price ids come from the environment
   (docs/PHASE2.md → Payments). Yearly = two months free. */

export type PlanId = "free" | "pro" | "team" | "company" | "sponsor";
export type Cycle = "monthly" | "yearly";
export type PaidPlan = Exclude<PlanId, "free">;

export type Plan = {
  id: PlanId;
  name: string;
  tagline: string;
  /** Whole USD per month / per year. */
  price: { monthly: number; yearly: number } | null;
  seats?: { included: number; extraMonthly: number; extraYearly: number };
  trialDays: number;
  cta: string;
  highlight?: boolean;
};

export const TRIAL_DAYS = 14;
/** Premium articles a signed-in Free reader can open each calendar month. */
export const FREE_PREMIUM_PER_MONTH = 2;

export const PLANS: Plan[] = [
  { id: "free", name: "Free", tagline: "For keeping up with the industry.", price: null, trialDays: 0, cta: "Create a free account" },
  { id: "pro", name: "Pro", tagline: "For sales, sourcing and engineering professionals who act on the news.", price: { monthly: 29, yearly: 290 }, trialDays: TRIAL_DAYS, cta: "Start 14-day free trial", highlight: true },
  { id: "team", name: "Team", tagline: "Pro for your sales or purchasing team, on one invoice.", price: { monthly: 99, yearly: 990 }, seats: { included: 5, extraMonthly: 15, extraYearly: 150 }, trialDays: TRIAL_DAYS, cta: "Start 14-day free trial" },
  { id: "company", name: "Company", tagline: "For manufacturers and suppliers listed in the Directory.", price: { monthly: 49, yearly: 490 }, trialDays: TRIAL_DAYS, cta: "Start 14-day free trial" },
];

/** Directory Sponsor: a separate, yearly-only product for listed companies. Everything in the
    Company plan, plus a SPONSOR mark, a highlighted card with a website button, and labelled
    rotating sponsor spots outside the editorial list. Never changes order or coverage. */
export const SPONSOR = { id: "sponsor" as const, name: "Directory Sponsor", priceYearly: 1990, cta: "Become a sponsor" };
export const SPONSOR_POINTS = [
  "★ SPONSOR mark with the year on your Directory card and profile",
  "Highlighted card with a “Visit website” button",
  "Rotating, labelled sponsor spots on related articles and section pages (max. 2 per page)",
  "Everything in the Company plan: analytics, catalogue, video, contacts, matched tenders",
  "Pro for one person",
  "Your place in the Directory list stays exactly the same",
];
export const PLAN = Object.fromEntries([...PLANS, { id: "sponsor", name: SPONSOR.name, tagline: "Yearly Directory sponsorship.", price: { monthly: Math.round(SPONSOR.priceYearly / 12), yearly: SPONSOR.priceYearly }, trialDays: 0, cta: SPONSOR.cta }].map((p) => [p.id, p])) as Record<PlanId, Plan>;

/** What each plan unlocks. `true` = included; a string = included with that note; false = not included. */
export type Feature = { group: string; label: string; hint?: string; free: boolean | string; pro: boolean | string; team: boolean | string; company: boolean | string };

export const FEATURES: Feature[] = [
  { group: "News & analysis", label: "News, guides, standards and the Directory", free: true, pro: true, team: true, company: true },
  { group: "News & analysis", label: "Pro analysis articles", hint: "Market outlooks, project and company deep dives, show briefings", free: `${FREE_PREMIUM_PER_MONTH} a month`, pro: "Unlimited", team: "Unlimited", company: "Unlimited (1 user)" },
  { group: "News & analysis", label: "Ad-free reading", free: false, pro: true, team: true, company: true },
  { group: "Leads", label: "Tenders & project leads", hint: "Fencing, mesh and grating tenders worldwide, with buyer, quantity, deadline and the original notice", free: "Titles and countries", pro: "Full details", team: "Full details", company: "Full details" },
  { group: "Leads", label: "Tender alerts by product and country", free: false, pro: "Daily email", team: "Daily email, shared", company: "Matched to your products" },
  { group: "Trade intelligence", label: "Trade defence tracker", hint: "Anti-dumping, countervailing and safeguard cases on wire, mesh, fencing and grating", free: "Case list", pro: "Duty rates, companies, key dates", team: true, company: true },
  { group: "Trade intelligence", label: "Case alerts", free: false, pro: true, team: true, company: true },
  { group: "Trade intelligence", label: "Trade statistics by HS code", hint: "Monthly imports and exports, partner rankings and unit values from official statistics", free: "Annual totals", pro: "Monthly detail + CSV", team: "Monthly detail + CSV", company: "Monthly detail + CSV" },
  { group: "Tools", label: "Specification templates & checklists", free: "2 samples", pro: "Full library", team: "Full library", company: "Full library" },
  { group: "Tools", label: "Mesh weight & cost calculator", free: true, pro: true, team: true, company: true },
  { group: "Your company", label: "Claim and edit your Directory profile", hint: "Always free; paying never changes order or placement", free: true, pro: true, team: true, company: true },
  { group: "Your company", label: "Profile analytics", hint: "Views, enquiries and where they come from", free: false, pro: false, team: false, company: true },
  { group: "Your company", label: "Catalogue PDF, video and extra contacts on your profile", free: false, pro: false, team: false, company: true },
  { group: "Account", label: "People included", free: "1", pro: "1", team: "5 (+US$15/month each)", company: "1" },
  { group: "Account", label: "Invoices with your company and tax details", free: false, pro: true, team: true, company: true },
];

export const yearlySaving = (p: Plan) => (p.price ? p.price.monthly * 12 - p.price.yearly : 0);
export const usd = (n: number) => `US$${n.toLocaleString("en-US")}`;
