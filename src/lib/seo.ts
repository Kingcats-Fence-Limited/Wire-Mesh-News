/* One place that builds page metadata, so every page gets the same canonical URL, Open Graph
   and Twitter tags. Next replaces (rather than merges) `alternates` and `openGraph` from the
   layout when a page sets them, so the shared parts are repeated here. */
import type { Metadata } from "next";
import { SITE } from "@/lib/site";

export const OG_LOCALE = "en_GB";
const RSS = { "application/rss+xml": "/feed.xml" };

/** Trim a description to about 160 characters at a word boundary. */
export function clip(s: string | undefined, max = 160): string | undefined {
  if (!s) return undefined;
  const t = s.replace(/\s+/g, " ").trim();
  if (t.length <= max) return t;
  const cut = t.slice(0, max - 1);
  return cut.slice(0, cut.lastIndexOf(" ") > 80 ? cut.lastIndexOf(" ") : cut.length).replace(/[,;:.\s]+$/, "") + "…";
}

type PageMeta = {
  title: string;
  description?: string;
  /** Path with the trailing slash, e.g. "/directory/". Query strings are never canonical. */
  path: string;
  type?: "website" | "article" | "profile";
  /** Extra Open Graph fields (publishedTime, authors, section, tags …). */
  og?: Record<string, unknown>;
  /** Keep the page out of search results but let crawlers follow its links. */
  noindex?: boolean;
  /** Use the title as-is, without the " · Wire Mesh News" suffix. */
  absolute?: boolean;
  /** Share image path; defaults to the site card. */
  image?: string;
};

const SUFFIX = ` · ${SITE.name}`;

export function pageMeta({ title, description, path, type = "website", og = {}, noindex, absolute, image = "/og/" }: PageMeta): Metadata {
  const desc = clip(description);
  /* Long headlines drop the site-name suffix so the headline itself is what shows in results. */
  const abs_ = absolute || title.length + SUFFIX.length > 65;
  const images = [{ url: image, width: 1200, height: 630, alt: title }];
  return {
    title: abs_ ? { absolute: title } : title,
    ...(desc ? { description: desc } : {}),
    alternates: { canonical: path, types: RSS },
    openGraph: { siteName: SITE.name, locale: OG_LOCALE, type, url: path, title, ...(desc ? { description: desc } : {}), images, ...og },
    twitter: { card: "summary_large_image", title, ...(desc ? { description: desc } : {}), images: [image] },
    ...(noindex ? { robots: { index: false, follow: true } } : {}),
  } as Metadata;
}

/** For pages that must never be indexed or followed (account, sign-in …). */
export function privateMeta(title: string, path: string): Metadata {
  return { title, alternates: { canonical: path }, robots: { index: false, follow: false } };
}

export const abs = (path: string) => `${SITE.url}${path}`;
