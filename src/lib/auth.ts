import "server-only";
import { betterAuth, type BetterAuthOptions } from "better-auth";
import { emailOTP, oneTap, captcha } from "better-auth/plugins";
import { nextCookies } from "better-auth/next-js";
import { headers as nextHeaders } from "next/headers";
import { ENV, AUTH_LIVE } from "@/lib/server/env";
import { pool } from "@/lib/server/db";
import { sendMail, codeMail } from "@/lib/server/mail";
import { SITE } from "@/lib/site";

/* Sign-in for wiremeshnews.com: Google, Microsoft (personal and work accounts) and a 6-digit
   email code. No passwords anywhere. Accounts are created on first sign-in and linked by
   verified email, so one person signing in with Google one day and an email code the next
   lands in the same account. Users and sessions live in our own Postgres (schema
   AUTH_DB_SCHEMA); profile data lives in Directus `members` (src/lib/server/member.ts). */

const PURPOSE: Record<string, string> = {
  "sign-in": "sign in to Wire Mesh News",
  "email-verification": "confirm your email address",
  "change-email": "confirm your new sign-in email",
  "forget-password": "sign in to Wire Mesh News",
};

function siteUrl() {
  if (ENV.siteUrl) return ENV.siteUrl.replace(/\/$/, "");
  if (process.env.VERCEL_ENV === "production" && process.env.VERCEL_PROJECT_PRODUCTION_URL) return `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`;
  if (process.env.VERCEL_URL) return `https://${process.env.VERCEL_URL}`;
  return "http://localhost:3000";
}

export function authOptions(): BetterAuthOptions {
  const base = siteUrl();
  const social: BetterAuthOptions["socialProviders"] = {};
  if (ENV.googleId && ENV.googleSecret) social.google = { clientId: ENV.googleId, clientSecret: ENV.googleSecret, prompt: "select_account" };
  if (ENV.microsoftId && ENV.microsoftSecret) social.microsoft = { clientId: ENV.microsoftId, clientSecret: ENV.microsoftSecret, tenantId: "common", prompt: "select_account" };

  return {
    appName: SITE.name,
    baseURL: base,
    secret: ENV.authSecret,
    database: pool(),
    trustedOrigins: [base, SITE.url, SITE.url.replace("://www.", "://")],
    emailAndPassword: { enabled: false },
    socialProviders: social,
    account: { accountLinking: { enabled: true, trustedProviders: ["google", "microsoft", "email-otp"] } },
    user: { changeEmail: { enabled: true } },
    session: { expiresIn: 60 * 60 * 24 * 30, updateAge: 60 * 60 * 24, cookieCache: { enabled: true, maxAge: 5 * 60 } },
    rateLimit: {
      enabled: true,
      storage: "database",
      window: 60,
      max: 60,
      customRules: {
        "/email-otp/send-verification-otp": { window: 60, max: 3 },
        "/sign-in/email-otp": { window: 300, max: 10 },
        "/email-otp/request-email-change": { window: 300, max: 3 },
        "/sign-in/social": { window: 60, max: 10 },
      },
    },
    advanced: {
      cookiePrefix: "wmn",
      useSecureCookies: base.startsWith("https://"),
      ipAddress: { ipAddressHeaders: ["x-forwarded-for", "x-real-ip"] },
    },
    plugins: [
      emailOTP({
        otpLength: 6,
        expiresIn: 300,
        allowedAttempts: 5,
        storeOTP: "hashed",
        changeEmail: { enabled: true },
        async sendVerificationOTP({ email, otp, type }) {
          await sendMail(codeMail(email, otp, PURPOSE[type] ?? "continue"));
        },
      }),
      ...(ENV.googleId ? [oneTap({ clientId: ENV.googleId })] : []),
      ...(ENV.turnstileSecret ? [captcha({ provider: "cloudflare-turnstile", secretKey: ENV.turnstileSecret, endpoints: ["/email-otp/send-verification-otp"] })] : []),
      nextCookies(),
    ],
  };
}

const g = globalThis as unknown as { __wmnAuth?: ReturnType<typeof betterAuth> };
export function auth() {
  if (!AUTH_LIVE) throw new Error("Accounts are not configured.");
  return (g.__wmnAuth ??= betterAuth(authOptions()));
}

export type SessionUser = { id: string; email: string; name: string; image?: string | null; emailVerified: boolean };

/** The signed-in user for this request, or null. Works in route handlers and server components. */
export async function currentUser(h?: Headers): Promise<SessionUser | null> {
  if (!AUTH_LIVE) return null;
  const res = await auth().api.getSession({ headers: h ?? (await nextHeaders()) });
  return (res?.user as SessionUser | undefined) ?? null;
}
