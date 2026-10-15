/* Search engines should index only the real domain. Until wiremeshnews.com is attached as the
   production domain, every deployment (including wire-mesh-news.vercel.app and previews)
   tells crawlers to stay out, so the test site never competes with the launch site. */
const prodHost = process.env.VERCEL_PROJECT_PRODUCTION_URL ?? "";
export const INDEXABLE = process.env.VERCEL_ENV === "production" && /(^|\.)wiremeshnews\.com$/.test(prodHost);
