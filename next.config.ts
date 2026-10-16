import type { NextConfig } from "next";

/* Security headers for every response. The CSP allows inline scripts/styles because Next.js
   bootstraps with inline scripts and the boards use inline styles; everything else is
   same-origin only. */
/* The Vercel toolbar (vercel.live + its websocket) is allowed on preview deployments only. */
const preview = process.env.VERCEL_ENV !== "production";
const live = preview ? " https://vercel.live" : "";

/* Phase 2 switches (see src/lib/server/env.ts). Accounts go live only when sign-in, its
   database and Directus are all configured; until then the site stays in preview mode. */
const env = (k: string) => (process.env[k] ?? "").trim();
const authLive = !!(env("BETTER_AUTH_SECRET") && env("DATABASE_URL") && env("DIRECTUS_URL") && env("DIRECTUS_SERVER_TOKEN"));
const google = authLive && !!(env("GOOGLE_CLIENT_ID") && env("GOOGLE_CLIENT_SECRET"));
const billingLive = authLive && !!(env("STRIPE_SECRET_KEY") && env("STRIPE_WEBHOOK_SECRET") && env("STRIPE_PRICE_PRO_MONTHLY"));
const microsoft = authLive && !!(env("MICROSOFT_CLIENT_ID") && env("MICROSOFT_CLIENT_SECRET"));
const oneTap = google && env("GOOGLE_ONE_TAP") !== "off";
const turnstile = !!env("NEXT_PUBLIC_TURNSTILE_SITE_KEY");
/* Google One Tap and Cloudflare Turnstile load their own script and frame. */
const gsi = oneTap ? " https://accounts.google.com" : "";
const cf = turnstile ? " https://challenges.cloudflare.com" : "";
/* Company-plan profiles may embed one YouTube (privacy-enhanced) or Vimeo video. */
const video = authLive ? " https://www.youtube-nocookie.com https://player.vimeo.com" : "";
const csp = [
  "default-src 'self'",
  `script-src 'self' 'unsafe-inline'${live}${gsi}${cf}`,
  `style-src 'self' 'unsafe-inline'${gsi}`,
  "img-src 'self' data: blob: https:",
  "font-src 'self' data:",
  `connect-src 'self'${preview ? " https://vercel.live wss://ws-us3.pusher.com" : ""}${gsi}`,
  preview || gsi || cf || video ? `frame-src${preview ? " https://vercel.live" : ""}${gsi}${cf}${video}` : "frame-src 'none'",
  "frame-ancestors 'none'",
  "base-uri 'self'",
  "form-action 'self'",
  "object-src 'none'",
  "upgrade-insecure-requests",
].join("; ");

const indexable = process.env.VERCEL_ENV === "production" && /(^|\.)wiremeshnews\.com$/.test(process.env.VERCEL_PROJECT_PRODUCTION_URL ?? "");

const nextConfig: NextConfig = {
  // Framework V2.4: canonical URLs end with a slash (/events/, /news/{slug}/).
  trailingSlash: true,
  poweredByHeader: false,
  /* Read by client components; only on/off flags and public IDs, never secrets. */
  env: {
    NEXT_PUBLIC_AUTH_LIVE: authLive ? "1" : "",
    NEXT_PUBLIC_BILLING_LIVE: billingLive ? "1" : "",
    NEXT_PUBLIC_SELLER_NAME: env("SELLER_NAME"),
    NEXT_PUBLIC_AUTH_GOOGLE: google ? "1" : "",
    NEXT_PUBLIC_AUTH_MICROSOFT: microsoft ? "1" : "",
    NEXT_PUBLIC_GOOGLE_ONE_TAP_ID: oneTap ? env("GOOGLE_CLIENT_ID") : "",
  },
  /* Share-card fonts are read from disk by src/lib/og.tsx. */
  outputFileTracingIncludes: { "/og/**": ["./assets/og/**"] },
  /* Page <title>, description and canonical always go in <head>, for every visitor. Next 15
     otherwise streams them into <body> for non-crawler browsers on dynamic pages, which
     some SEO tools and social-card fetchers miss. */
  htmlLimitedBots: /.*/,
  experimental: {
    /* The site's CSS is small (about 30 KB), so it is inlined into the HTML rather than
       fetched as several render-blocking files. */
    inlineCss: true,
  },
  async headers() {
    const base = [
      { key: "Content-Security-Policy", value: csp },
      { key: "X-Content-Type-Options", value: "nosniff" },
      { key: "X-Frame-Options", value: "DENY" },
      { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
      { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=(), payment=(), usb=(), interest-cohort=()" },
      { key: "Strict-Transport-Security", value: "max-age=63072000; includeSubDomains; preload" },
      /* Google One Tap needs to talk to its own window; otherwise the strictest setting. */
      { key: "Cross-Origin-Opener-Policy", value: oneTap ? "same-origin-allow-popups" : "same-origin" },
    ];
    return [
      { source: "/:path*", headers: indexable ? base : [...base, { key: "X-Robots-Tag", value: "noindex, nofollow" }] },
      { source: "/account/:path*", headers: [{ key: "X-Robots-Tag", value: "noindex, nofollow" }, { key: "Cache-Control", value: "private, no-store" }] },
      { source: "/api/:path*", headers: [{ key: "X-Robots-Tag", value: "noindex, nofollow" }] },
    ];
  },
};

export default nextConfig;
