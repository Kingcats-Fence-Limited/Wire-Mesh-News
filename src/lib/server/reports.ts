import "server-only";
import { DIRECTUS_LIVE } from "./env";
import { dx } from "./directus";

/* Reports shop data. Live: published rows of Directus `reports`. Preview: the planned reports,
   marked as coming soon (nothing can be bought). */
export type Report = { slug: string; title: string; summary: string | null; contents: string[] | null; price_usd: number; pages: number | null; published_at: string | null; cover: string | null; sample: string | null; soon?: boolean };

const PLANNED: Report[] = [
  { slug: "global-fencing-market-2027", title: "Global Fencing & Wire Mesh Market 2027", summary: "Demand by end use and region, trade flows by HS code, price drivers (rod, zinc, freight), trade-defence exposure and the 40 largest producers. Coming soon.", contents: ["Market size and growth by region", "End uses: security, agriculture, infrastructure, sport, solar", "Trade flows and the main exporter–importer pairs", "Costs: wire rod, zinc and freight", "Trade defence: measures in force and under review", "Producer profiles"], price_usd: 490, pages: null, published_at: null, cover: null, sample: null, soon: true },
  { slug: "security-fencing-buyers-guide-2027", title: "Security Fencing Buyer's Guide 2027", summary: "How to specify, compare and accept rated security fencing systems, with a supplier checklist and cost benchmarks. Coming soon.", contents: ["Security ratings explained", "System comparison", "Specification and acceptance", "Cost benchmarks per metre"], price_usd: 199, pages: null, published_at: null, cover: null, sample: null, soon: true },
];

export async function getReports(): Promise<Report[]> {
  if (!DIRECTUS_LIVE) return PLANNED;
  const live = await dx.list<Report>("reports", { filter: { status: { _eq: "published" } }, fields: ["slug", "title", "summary", "contents", "price_usd", "pages", "published_at", "cover", "sample"], sort: ["-published_at"], limit: 100 }).catch(() => []);
  return live.length ? live : PLANNED;
}
export async function getReport(slug: string) {
  return (await getReports()).find((r) => r.slug === slug);
}
