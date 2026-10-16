/* Client-side view of the Phase 2 switches (set at build time from server env vars in
   next.config.ts). With AUTH_LIVE off, every account feature runs in preview (demo) mode. */
export const AUTH_LIVE = process.env.NEXT_PUBLIC_AUTH_LIVE === "1";
export const AUTH_GOOGLE = process.env.NEXT_PUBLIC_AUTH_GOOGLE === "1";
export const AUTH_MICROSOFT = process.env.NEXT_PUBLIC_AUTH_MICROSOFT === "1";
export const ONE_TAP_ID = process.env.NEXT_PUBLIC_GOOGLE_ONE_TAP_ID ?? "";
export const TURNSTILE_SITE_KEY = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY ?? "";
/** Stripe payments configured (checkout buttons work). Without it the pricing page says "opening soon". */
export const BILLING_LIVE = process.env.NEXT_PUBLIC_BILLING_LIVE === "1";
export const SELLER_NAME = process.env.NEXT_PUBLIC_SELLER_NAME ?? "";
