/* Preview-mode sample data for Tenders, Trade defence and Trade statistics. Every screen that
   shows it says SAMPLE DATA. Live data comes from Directus (editor-checked) and official
   statistics once the Phase 2 variables are set. */

export type TenderItem = {
  id: string; title: string; summary?: string | null; buyer?: string | null; country: string | null; city?: string | null; products: string[];
  kind: "tender" | "prequalification" | "award" | "project"; quantity?: string | null; value?: number | null; currency?: string | null;
  published_on: string | null; deadline?: string | null; source?: string | null; url?: string | null;
};

export const SAMPLE_TENDERS: TenderItem[] = [
  { id: "s-t1", title: "Sample: Perimeter security fencing for a regional water treatment works", summary: "Supply and installation of about 2.4 km of 358 anti-climb mesh fencing with two sliding gates and access control, including removal of the existing chain-link fence.", buyer: "Sample regional water authority", country: "GB", city: "Leeds", products: ["anti_climb_358", "gate"], kind: "tender", quantity: "≈2,400 m, 2 gates", value: 640000, currency: "GBP", published_on: "2026-10-12", deadline: "2026-11-14", source: "sample", url: null },
  { id: "s-t2", title: "Sample: Framework for temporary fencing and hoarding, 4 years", summary: "Framework agreement for the hire and supply of temporary mesh fencing panels, bases and clamps for public works sites.", buyer: "Sample city council", country: "DE", city: "Cologne", products: ["temporary_fence"], kind: "tender", quantity: "Framework, 4 lots", value: 1800000, currency: "EUR", published_on: "2026-10-10", deadline: "2026-11-21", source: "sample", url: null },
  { id: "s-t3", title: "Sample: Gabion retaining walls for a rural road rehabilitation project", summary: "Galvanized and PVC-coated gabion boxes and mattresses for slope protection along 18 km of rural road.", buyer: "Sample roads agency (World Bank financed)", country: "KE", city: null, products: ["gabion"], kind: "tender", quantity: "≈9,500 m³ gabions", value: 2100000, currency: "USD", published_on: "2026-10-08", deadline: "2026-11-30", source: "sample", url: null },
  { id: "s-t4", title: "Sample: Steel bar grating and stair treads for a pumping station upgrade", summary: "Hot-dip galvanized welded bar grating platforms, stair treads and handrail for a new pumping station.", buyer: "Sample municipal utility", country: "PL", city: "Gdańsk", products: ["steel_grating", "stair_tread", "handrail"], kind: "tender", quantity: "≈1,100 m² grating", value: null, currency: null, published_on: "2026-10-07", deadline: "2026-11-06", source: "sample", url: null },
  { id: "s-t5", title: "Sample: Solar farm boundary fencing, 48 MW site", summary: "Deer fencing with wooden posts and two access gates around a new solar farm; prequalification of fencing contractors.", buyer: "Sample energy developer", country: "ES", city: "Badajoz", products: ["field_fence", "gate"], kind: "prequalification", quantity: "≈6.5 km", value: null, currency: null, published_on: "2026-10-05", deadline: "2026-10-28", source: "sample", url: null },
  { id: "s-t6", title: "Sample: Award — airport airside security fence replacement", summary: "Contract awarded for the replacement of airside fencing with welded mesh panels topped with razor wire.", buyer: "Sample airport operator", country: "AU", city: "Perth", products: ["welded_mesh_panel", "razor_wire"], kind: "award", quantity: "≈5.1 km", value: 3900000, currency: "AUD", published_on: "2026-10-02", deadline: null, source: "sample", url: null },
];

export type CaseItem = {
  id: string; slug: string; importing_country: string; origins: string[]; product: string; hs_codes: string[]; products: string[];
  measure: "anti_dumping" | "countervailing" | "safeguard" | "anti_circumvention"; stage: string;
  rates?: { company: string; country: string; rate: string }[]; summary?: string | null; next_date?: string | null; authority?: string | null; case_no?: string | null; url?: string | null;
  updates?: { title: string; date: string | null; url: string | null }[];
};

export const SAMPLE_CASES: CaseItem[] = [
  { id: "s-c1", slug: "sample-us-welded-mesh", importing_country: "US", origins: ["CN"], product: "Sample: welded wire mesh panels", hs_codes: ["7314.20", "7314.39"], products: ["welded_mesh_panel"], measure: "anti_dumping", stage: "definitive", rates: [{ company: "Sample Mesh Co.", country: "CN", rate: "48.2%" }, { company: "All others", country: "CN", rate: "112.6%" }], summary: "Sample case for the preview. Definitive anti-dumping duties apply; the first administrative review window opens next month.", next_date: "2026-11-30", authority: "US Commerce / USITC", case_no: "A-000-000", url: null, updates: [{ title: "Sample: Opportunity to request administrative review", date: "2026-10-01", url: null }] },
  { id: "s-c2", slug: "sample-eu-steel-wire", importing_country: "EU", origins: ["CN", "IN"], product: "Sample: galvanized steel wire", hs_codes: ["7217.20"], products: [], measure: "anti_dumping", stage: "initiation", rates: [], summary: "Sample case for the preview. Investigation initiated; sampling of exporters under way.", next_date: "2026-12-15", authority: "European Commission", case_no: "AD000", url: null, updates: [{ title: "Sample: Notice of initiation", date: "2026-09-20", url: null }] },
  { id: "s-c3", slug: "sample-au-grating", importing_country: "AU", origins: ["CN", "MY"], product: "Sample: steel grating", hs_codes: ["7308.90"], products: ["steel_grating"], measure: "anti_dumping", stage: "expiry_review", rates: [{ company: "Sample Grating Ltd", country: "MY", rate: "11.4%" }], summary: "Sample case for the preview. Measures expire next year unless continued; the expiry review is open for submissions.", next_date: "2027-02-01", authority: "Anti-Dumping Commission", case_no: "000", url: null, updates: [] },
];

/** Deterministic sample monthly series (clearly labelled as sample on screen). */
export function sampleTrade(hs: string, flow: "import" | "export") {
  const partners = flow === "import" ? ["CN", "TR", "IN", "VN", "UA", "GB", "CH", "US"] : ["GB", "CH", "US", "NO", "MA", "RS", "TR", "IL"];
  const months: string[] = [];
  const d = new Date(Date.UTC(2026, 8, 1));
  for (let i = 23; i >= 0; i--) { const x = new Date(Date.UTC(d.getUTCFullYear(), d.getUTCMonth() - i, 1)); months.push(`${x.getUTCFullYear()}-${String(x.getUTCMonth() + 1).padStart(2, "0")}`); }
  const seed = [...hs, ...flow].reduce((h, c) => (h * 31 + c.charCodeAt(0)) % 9973, 17);
  return partners.flatMap((p, pi) => months.map((m, mi) => {
    const base = (9 - pi) * (1.2e6 + (seed % 400) * 1e3);
    const wave = 1 + 0.12 * Math.sin((mi + pi + seed) / 2.3);
    const value = Math.round(base * wave);
    return { reporter: "EU", partner: p, flow, hs, period: m, value, currency: "EUR", qty_kg: Math.round(value / (1.05 + (pi % 4) * 0.12)) };
  }));
}
