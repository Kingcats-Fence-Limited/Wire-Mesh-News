import "server-only";
import { ENV } from "../env";
import { A3, NAME_TO_A2, RELEVANT, clip, daysAgo, guessProducts, lang, saveDrafts, ymd, type Found } from "./common";

/* Tender fetchers. Each returns drafts for the editors; failures are reported, never thrown. */

const CPV = ["44313000", "44313100", "44313200", "34928200", "45342000", "44221310"]; // metal netting, wire-mesh fencing, wire mesh, fences, erection of fencing, access gates
const TED_FIELDS = ["publication-number", "publication-date", "notice-title", "buyer-name", "buyer-country", "classification-cpv", "notice-type", "deadline-receipt-tender-date-lot", "estimated-value-proc", "estimated-value-cur-proc"];

async function ted(days: number): Promise<Found[]> {
  const queries = [
    `classification-cpv IN (${CPV.join(" ")}) AND publication-date>=${ymd(daysAgo(days))} SORT BY publication-date DESC`,
    `FT~("steel grating") AND publication-date>=${ymd(daysAgo(days))} SORT BY publication-date DESC`,
    `FT~("gabion") AND publication-date>=${ymd(daysAgo(days))} SORT BY publication-date DESC`,
  ];
  const out: Found[] = [];
  for (const query of queries) {
    const res = await fetch("https://api.ted.europa.eu/v3/notices/search", { method: "POST", headers: { "Content-Type": "application/json", Accept: "application/json" }, body: JSON.stringify({ query, fields: TED_FIELDS, limit: 100, page: 1, scope: "ALL", paginationMode: "PAGE_NUMBER" }), signal: AbortSignal.timeout(25_000) });
    if (!res.ok) throw new Error(`TED ${res.status}`);
    const j = (await res.json()) as { notices?: Record<string, unknown>[] };
    for (const n of j.notices ?? []) {
      const id = String(n["publication-number"] ?? "");
      if (!id) continue;
      const title = lang(n["notice-title"]) ?? "Tender";
      const country = A3[String(lang(n["buyer-country"]) ?? "").toUpperCase()] ?? null;
      const deadline = lang(n["deadline-receipt-tender-date-lot"]);
      const type = String(lang(n["notice-type"]) ?? "");
      out.push({
        collection: "tenders", source: "ted", source_id: id,
        data: {
          title: clip(title, 300), buyer: clip(lang(n["buyer-name"]), 255), country,
          products: guessProducts(title), kind: /can-|award|result/i.test(type) ? "award" : /pin-|prior/i.test(type) ? "project" : "tender",
          value: Number(lang(n["estimated-value-proc"])) || null, currency: clip(lang(n["estimated-value-cur-proc"]), 3),
          published_on: clip(lang(n["publication-date"]), 10), deadline: deadline ? deadline.slice(0, 10) : null,
          url: `https://ted.europa.eu/en/notice/-/detail/${id}`, language: "en", raw: { cpv: n["classification-cpv"], type },
        },
      });
    }
  }
  return out;
}

type WB = { id: string; notice_type?: string; noticedate?: string; project_ctry_name?: string; project_name?: string; bid_description?: string; noticetitle?: string; submission_deadline_date?: string; submission_date?: string; bid_estimate_amount?: string; bid_currency_code?: string; contact_organization?: string; agency_name?: string; procurement_group_desc?: string };
async function worldBank(days: number): Promise<Found[]> {
  const out: Found[] = [];
  const since = daysAgo(days).getTime();
  for (const term of ["fencing", "fence", "wire mesh", "gabion", "grating"]) {
    const res = await fetch(`https://search.worldbank.org/api/v2/procnotices?format=json&rows=100&os=0&srt=noticedate&order=desc&qterm=${encodeURIComponent(term)}`, { signal: AbortSignal.timeout(25_000) });
    if (!res.ok) throw new Error(`World Bank ${res.status}`);
    const j = (await res.json()) as { procnotices?: WB[] };
    for (const n of j.procnotices ?? []) {
      const date = n.noticedate ? new Date(n.noticedate) : null;
      if (date && date.getTime() < since) continue;
      const title = n.noticetitle || n.bid_description || n.project_name || "";
      if (!RELEVANT.test(`${title} ${n.bid_description ?? ""}`)) continue;
      const deadline = n.submission_deadline_date ?? (n.notice_type !== "Contract Award" ? n.submission_date : undefined);
      out.push({
        collection: "tenders", source: "worldbank", source_id: n.id,
        data: {
          title: clip(title, 300), summary: clip(n.bid_description, 2000), buyer: clip(n.contact_organization || n.agency_name, 255),
          country: NAME_TO_A2[(n.project_ctry_name ?? "").toLowerCase()] ?? null, products: guessProducts(`${title} ${n.bid_description ?? ""}`),
          kind: n.notice_type === "Contract Award" ? "award" : /expression of interest|prequal/i.test(n.notice_type ?? "") ? "prequalification" : /general procurement/i.test(n.notice_type ?? "") ? "project" : "tender",
          value: Number(n.bid_estimate_amount) || null, currency: clip(n.bid_currency_code, 3),
          published_on: date ? date.toISOString().slice(0, 10) : null, deadline: deadline ? deadline.slice(0, 10) : null,
          url: `https://projects.worldbank.org/en/projects-operations/procurement-detail/${encodeURIComponent(n.id)}`, language: "en",
          raw: { notice_type: n.notice_type, country: n.project_ctry_name, group: n.procurement_group_desc },
        },
      });
    }
  }
  return out;
}

type Sam = { noticeId: string; title: string; solicitationNumber?: string; fullParentPathName?: string; postedDate?: string; type?: string; responseDeadLine?: string | null; naicsCode?: string; uiLink?: string; description?: string; placeOfPerformance?: { city?: { name?: string }; country?: { code?: string } } };
async function sam(days: number): Promise<Found[]> {
  if (!ENV.samApiKey) return [];
  const fmt = (d: Date) => `${String(d.getUTCMonth() + 1).padStart(2, "0")}/${String(d.getUTCDate()).padStart(2, "0")}/${d.getUTCFullYear()}`;
  const out: Found[] = [];
  for (const ncode of ["238990", "332618", "332323"]) { // fence contractors (other specialty trade), fabricated wire products, ornamental & architectural metal work
    const url = `https://api.sam.gov/opportunities/v2/search?api_key=${encodeURIComponent(ENV.samApiKey)}&postedFrom=${fmt(daysAgo(days))}&postedTo=${fmt(new Date())}&ncode=${ncode}&limit=200`;
    const res = await fetch(url, { signal: AbortSignal.timeout(25_000) });
    if (!res.ok) throw new Error(`SAM.gov ${res.status}`);
    const j = (await res.json()) as { opportunitiesData?: Sam[] };
    for (const n of j.opportunitiesData ?? []) {
      if (!RELEVANT.test(n.title)) continue;
      out.push({
        collection: "tenders", source: "sam", source_id: n.noticeId,
        data: {
          title: clip(n.title, 300), buyer: clip(n.fullParentPathName?.split(".").slice(-1)[0], 255),
          country: n.placeOfPerformance?.country?.code === "USA" ? "US" : A3[n.placeOfPerformance?.country?.code ?? ""] ?? "US", city: clip(n.placeOfPerformance?.city?.name, 120),
          products: guessProducts(n.title), kind: /award/i.test(n.type ?? "") ? "award" : /sources sought|presolicitation/i.test(n.type ?? "") ? "project" : "tender",
          published_on: n.postedDate?.slice(0, 10) ?? null, deadline: n.responseDeadLine?.slice(0, 10) ?? null,
          url: n.uiLink ?? `https://sam.gov/opp/${n.noticeId}/view`, language: "en", raw: { type: n.type, naics: n.naicsCode, solicitation: n.solicitationNumber },
        },
      });
    }
  }
  return out;
}

export const TENDER_SOURCES = { ted, worldbank: worldBank, sam } as const;

/** Run every source; returns per-source counts or errors. */
export async function fetchTenders(days = 3) {
  const report: Record<string, { found?: number; added?: number; error?: string }> = {};
  for (const [name, fn] of Object.entries(TENDER_SOURCES)) {
    try { const found = await fn(days); report[name] = { found: found.length, added: await saveDrafts(found) }; }
    catch (e) { report[name] = { error: (e as Error).message }; }
  }
  return report;
}
