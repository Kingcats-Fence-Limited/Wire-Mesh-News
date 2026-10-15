/* schema.org builders for JSON-LD. Only facts that are on the page are stated. */
import { SITE, articleHref, sectionByCode } from "@/lib/site";
import { abs } from "@/lib/seo";
import { getAuthor } from "@/lib/content/people";
import type { Article, Author, Company, EventItem } from "@/lib/content/types";

const ORG_ID = abs("/#organization");

export const publisher = () => ({
  "@type": "NewsMediaOrganization",
  "@id": ORG_ID,
  name: SITE.name,
  url: abs("/"),
  logo: { "@type": "ImageObject", url: abs("/icons/icon-512.png"), width: 512, height: 512 },
  email: SITE.email,
  legalName: SITE.operator.legalName,
  foundingDate: String(SITE.launched),
  publishingPrinciples: abs("/policies/editorial-policy/"),
  correctionsPolicy: abs("/policies/corrections/"),
});

export const siteGraph = () => ({
  "@context": "https://schema.org",
  "@graph": [
    publisher(),
    {
      "@type": "WebSite",
      "@id": abs("/#website"),
      url: abs("/"),
      name: SITE.name,
      description: SITE.tagline,
      inLanguage: "en-GB",
      publisher: { "@id": ORG_ID },
      potentialAction: { "@type": "SearchAction", target: { "@type": "EntryPoint", urlTemplate: abs("/search/?q={search_term_string}") }, "query-input": "required name=search_term_string" },
    },
  ],
});

export const breadcrumbs = (items: { name: string; path: string }[]) => ({
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: items.map((it, i) => ({ "@type": "ListItem", position: i + 1, name: it.name, item: abs(it.path) })),
});

export function articleLd(a: Article) {
  const au = getAuthor(a.author);
  const url = abs(articleHref(a));
  const type = a.type === "column" || a.type === "opinion" ? "OpinionNewsArticle" : a.type === "analysis" ? "AnalysisNewsArticle" : a.type === "news" ? "NewsArticle" : "Article";
  return {
    "@context": "https://schema.org",
    "@type": type,
    "@id": `${url}#article`,
    headline: a.title.slice(0, 110),
    description: a.dek,
    url,
    mainEntityOfPage: url,
    image: [abs(`/og/${a.slug}/`)],
    datePublished: a.date,
    dateModified: a.updated ?? a.date,
    inLanguage: "en-GB",
    articleSection: sectionByCode(a.section)?.label,
    keywords: a.tags.join(", ") || undefined,
    isAccessibleForFree: true,
    author: au ? { "@type": "Person", name: au.name, url: abs(`/authors/${au.slug}/`), jobTitle: au.role } : { "@type": "Organization", name: SITE.name },
    publisher: { "@id": ORG_ID, "@type": "NewsMediaOrganization", name: SITE.name, logo: { "@type": "ImageObject", url: abs("/icons/icon-512.png") } },
    ...(a.type === "sponsored" && a.sponsor ? { sponsor: { "@type": "Organization", name: a.sponsor } } : {}),
    ...(a.sources?.length ? { citation: a.sources.map((s) => ({ "@type": "CreativeWork", name: s.title, url: s.url })) } : {}),
  };
}

export const personLd = (a: Author) => ({
  "@context": "https://schema.org",
  "@type": "ProfilePage",
  mainEntity: {
    "@type": "Person",
    name: a.name,
    jobTitle: a.role,
    description: a.bio,
    url: abs(`/authors/${a.slug}/`),
    worksFor: { "@id": ORG_ID },
    knowsAbout: a.expertise,
    ...(a.linkedin ? { sameAs: [a.linkedin] } : {}),
  },
});

export const companyLd = (c: Company) => ({
  "@context": "https://schema.org",
  "@type": "Organization",
  name: c.name,
  ...(c.legalName ? { legalName: c.legalName } : {}),
  description: c.summary,
  url: abs(`/directory/${c.slug}/`),
  ...(c.website ? { sameAs: [c.website] } : {}),
  ...(c.founded ? { foundingDate: String(c.founded) } : {}),
  address: { "@type": "PostalAddress", addressLocality: c.city, addressCountry: c.country },
});

export function eventLd(e: EventItem) {
  /* Placeholder links in seed data are left out rather than published as facts. */
  const site = e.website && !/\/\/(www\.)?example\.(com|org)/.test(e.website) ? e.website : undefined;
  const online = e.online && !e.city;
  return {
    "@type": "Event",
    name: e.name,
    description: e.summary,
    startDate: e.start,
    endDate: e.end ?? e.start,
    eventStatus: "https://schema.org/EventScheduled",
    eventAttendanceMode: online ? "https://schema.org/OnlineEventAttendanceMode" : e.online ? "https://schema.org/MixedEventAttendanceMode" : "https://schema.org/OfflineEventAttendanceMode",
    location: online
      ? { "@type": "VirtualLocation", url: site ?? abs("/events/") }
      : { "@type": "Place", name: e.venue ?? e.city, address: { "@type": "PostalAddress", addressLocality: e.city, addressCountry: e.country } },
    ...(e.organiser ? { organizer: { "@type": "Organization", name: e.organiser, ...(site ? { url: site } : {}) } } : {}),
    ...(site ? { url: site } : {}),
  };
}
