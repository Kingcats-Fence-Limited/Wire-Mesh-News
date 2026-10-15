import type { MetadataRoute } from "next";
import { SITE } from "@/lib/site";
import { INDEXABLE } from "@/lib/indexing";

/* Until the site runs on wiremeshnews.com nothing is crawled (see src/lib/indexing.ts).
   On the real domain, only machine endpoints and internal search results are blocked.
   Account, sign-in, register, submit and company-contact pages are NOT blocked here on
   purpose: they carry a noindex tag, and a crawler can only see that tag if it is allowed
   to fetch the page. Blocking them in robots.txt could leave them in results as bare URLs. */
export default function robots(): MetadataRoute.Robots {
  if (!INDEXABLE) return { rules: [{ userAgent: "*", disallow: "/" }] };
  return {
    rules: [{ userAgent: "*", allow: "/", disallow: ["/api/", "/search/"] }],
    sitemap: `${SITE.url}/sitemap.xml`,
    host: SITE.url,
  };
}
