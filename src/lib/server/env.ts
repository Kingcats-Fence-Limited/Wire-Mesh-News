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
};

/** Accounts are live only when sign-in, its database and Directus are all configured. */
export const AUTH_LIVE = !!(ENV.authSecret && ENV.databaseUrl && ENV.directusUrl && ENV.directusServerToken);
export const DIRECTUS_LIVE = !!(ENV.directusUrl && ENV.directusServerToken);
export const MAIL_LIVE = !!(ENV.resendKey || ENV.mailSinkFile);

export function missingForLive(): string[] {
  const need: [string, string][] = [["BETTER_AUTH_SECRET", ENV.authSecret], ["DATABASE_URL", ENV.databaseUrl], ["DIRECTUS_URL", ENV.directusUrl], ["DIRECTUS_SERVER_TOKEN", ENV.directusServerToken], ["RESEND_API_KEY", ENV.resendKey || ENV.mailSinkFile]];
  return need.filter(([, val]) => !val).map(([k]) => k);
}
