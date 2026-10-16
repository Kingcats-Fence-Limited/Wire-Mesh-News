import "server-only";

/* Phase 2 switches. Nothing here is on until its environment variables are set, so the
   production site keeps running in preview (demo) mode until the team decides to go live.
   Set them in Vercel → Settings → Environment Variables (Preview first, Production later). */

const v = (k: string) => (process.env[k] ?? "").trim();

export const ENV = {
  /* Sign-in (Better Auth). */
  authSecret: v("BETTER_AUTH_SECRET"),
  databaseUrl: v("DATABASE_URL"),
  /** Postgres schema for the sign-in tables (kept apart from Directus' own tables). */
  authSchema: v("AUTH_DB_SCHEMA") || "auth",
  siteUrl: v("BETTER_AUTH_URL") || v("SITE_URL"),
  googleId: v("GOOGLE_CLIENT_ID"),
  googleSecret: v("GOOGLE_CLIENT_SECRET"),
  microsoftId: v("MICROSOFT_CLIENT_ID"),
  microsoftSecret: v("MICROSOFT_CLIENT_SECRET"),
  /* Directus (user data). */
  directusUrl: v("DIRECTUS_URL").replace(/\/$/, ""),
  directusServerToken: v("DIRECTUS_SERVER_TOKEN"),
  /* Email. */
  resendKey: v("RESEND_API_KEY"),
  mailFrom: v("MAIL_FROM") || "Wire Mesh News <no-reply@wiremeshnews.com>",
  editorsInbox: v("EDITORS_INBOX") || "hello@wiremeshnews.com",
  /** Local testing only: write outgoing mail to this file instead of sending it. */
  mailSinkFile: v("MAIL_SINK_FILE"),
  /* Bot protection. */
  turnstileSecret: v("TURNSTILE_SECRET_KEY"),
  /* Scheduled clean-up (Vercel Cron sends this as a bearer token). */
  cronSecret: v("CRON_SECRET"),
  /* Directus Flow → /api/hooks/directus sends this in the x-wmn-hook header. */
  hookSecret: v("DIRECTUS_HOOK_SECRET"),
  /* Payments (Stripe, Hong Kong account). Price ids from the Stripe dashboard → Product catalogue. */
  stripeSecret: v("STRIPE_SECRET_KEY"),
  stripeWebhookSecret: v("STRIPE_WEBHOOK_SECRET"),
  stripeTax: v("STRIPE_TAX") === "on",
  stripePrices: {
    pro: { monthly: v("STRIPE_PRICE_PRO_MONTHLY"), yearly: v("STRIPE_PRICE_PRO_YEARLY") },
    team: { monthly: v("STRIPE_PRICE_TEAM_MONTHLY"), yearly: v("STRIPE_PRICE_TEAM_YEARLY") },
    company: { monthly: v("STRIPE_PRICE_COMPANY_MONTHLY"), yearly: v("STRIPE_PRICE_COMPANY_YEARLY") },
    teamSeat: { monthly: v("STRIPE_PRICE_TEAM_SEAT_MONTHLY"), yearly: v("STRIPE_PRICE_TEAM_SEAT_YEARLY") },
    sponsorYearly: v("STRIPE_PRICE_SPONSOR_YEARLY"),
  },
  /** The legal seller shown on the pricing page, Terms and invoices. */
  sellerName: v("SELLER_NAME"),
  /* Data sources for the fetchers (all optional). */
  samApiKey: v("SAM_API_KEY"),
  censusApiKey: v("CENSUS_API_KEY"),
};

/** Accounts are live only when sign-in, its database and Directus are all configured. */
export const AUTH_LIVE = !!(ENV.authSecret && ENV.databaseUrl && ENV.directusUrl && ENV.directusServerToken);
export const DIRECTUS_LIVE = !!(ENV.directusUrl && ENV.directusServerToken);
/** Payments are live when accounts are live and Stripe is configured. */
export const BILLING_LIVE = AUTH_LIVE && !!(ENV.stripeSecret && ENV.stripeWebhookSecret && ENV.stripePrices.pro.monthly);
export const MAIL_LIVE = !!(ENV.resendKey || ENV.mailSinkFile);

export function missingForLive(): string[] {
  const need: [string, string][] = [["BETTER_AUTH_SECRET", ENV.authSecret], ["DATABASE_URL", ENV.databaseUrl], ["DIRECTUS_URL", ENV.directusUrl], ["DIRECTUS_SERVER_TOKEN", ENV.directusServerToken], ["RESEND_API_KEY", ENV.resendKey || ENV.mailSinkFile]];
  return need.filter(([, val]) => !val).map(([k]) => k);
}
