import type { MetadataRoute } from "next";
import { SITE } from "@/lib/site";
import { INDEXABLE } from "@/lib/indexing";

export default function robots(): MetadataRoute.Robots {
  if (!INDEXABLE) return { rules: [{ userAgent: "*", disallow: "/" }] };
  return {
    rules: [{ userAgent: "*", allow: "/", disallow: ["/account/", "/api/", "/search/", "/signin/", "/register/", "/submit/"] }],
    sitemap: `${SITE.url}/sitemap.xml`,
  };
}
