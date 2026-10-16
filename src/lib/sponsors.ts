import type { Company } from "@/lib/content/types";

/* What the browser needs about a Directory Sponsor (mark, highlighted card, sponsor spot). */
export type SponsorCard = { slug: string; year: number; name: string; summary: string; city: string; country: string; website: string | null; products: string[]; applications: string[] };
export const sponsorCard = (c: Company, year: number): SponsorCard => ({ slug: c.slug, year, name: c.name, summary: c.summary, city: c.city, country: c.country, website: c.website ?? null, products: c.products, applications: c.applications });
