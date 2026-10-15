import type { NextConfig } from "next";

/* Security headers for every response. The CSP allows inline scripts/styles because Next.js
   bootstraps with inline scripts and the boards use inline styles; everything else is
   same-origin only. */
/* The Vercel toolbar (vercel.live + its websocket) is allowed on preview deployments only. */
const preview = process.env.VERCEL_ENV !== "production";
const live = preview ? " https://vercel.live" : "";
const csp = [
  "default-src 'self'",
  `script-src 'self' 'unsafe-inline'${live}`,
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' data: blob: https:",
  "font-src 'self' data:",
  `connect-src 'self'${preview ? " https://vercel.live wss://ws-us3.pusher.com" : ""}`,
  preview ? "frame-src https://vercel.live" : "frame-src 'none'",
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
      { key: "Cross-Origin-Opener-Policy", value: "same-origin" },
    ];
    return [
      { source: "/:path*", headers: indexable ? base : [...base, { key: "X-Robots-Tag", value: "noindex, nofollow" }] },
      { source: "/account/:path*", headers: [{ key: "X-Robots-Tag", value: "noindex, nofollow" }, { key: "Cache-Control", value: "private, no-store" }] },
    ];
  },
};

export default nextConfig;
