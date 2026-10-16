import type { ArticleTypeCode } from "@/data/vocab/article_type";
/** Content model for Phase 1 (local mock data). Codes reference src/data/vocab. */
import type { MaterialGroupCode } from "@/data/vocab/material_group";
/** Mesh pattern ids (SiteDefs: pChain, pChainL, pWeld, pWeldQ, pWoven, pGrate, pPerf, pExp, pG1–pG5). */
export type MeshId = "chain" | "chainL" | "weld" | "weldQ" | "woven" | "grate" | "perf" | "exp" | "g1" | "g2" | "g3" | "g4" | "g5";

export type SectionCode = "news" | "market_insights" | "applications" | "technical_guides" | "buying_guides";

/** Article types come from the controlled vocabulary (docs/Wire_Mesh_News_Vocabularies.xlsx → article_type). */
export type ArticleType = ArticleTypeCode;

export type Block =
  | { type: "p"; html: string }
  | { type: "h2"; id: string; text: string }
  | { type: "ul"; items: string[] }
  | { type: "quote"; text: string; cite?: string }
  | { type: "figure"; caption: string; source?: string; mesh?: string }
  | { type: "spec"; title: string; rows: [string, string][]; standards?: string[] }
  | { type: "table"; head: string[]; rows: string[][]; caption?: string }
  | { type: "checklist"; title: string; items: string[] }
  | { type: "ad" };

export type Article = {
  slug: string;
  section: SectionCode;
  subsection: string; // subsection code from vocab
  type: ArticleType;
  title: string;
  dek: string;
  date: string; // ISO
  updated?: string;
  readMin: number;
  author: string; // author slug
  /** Editorial keywords (free text, set by the editors; link to search). */
  tags: string[];
  /** Controlled facets in the Directory's own codes: "product:…", "application:…", "material:…" (material group), "region:…", "process:…", "surface:…". */
  facets?: string[];
  standards?: string[]; // standard numbers referenced
  companies?: string[]; // company slugs
  topics?: string[];
  mesh?: MeshId;
  appliesTo?: string[];
  takeaways?: string[];
  body: Block[];
  sources?: { title: string; url: string; accessed: string }[];
  correction?: { date: string; text: string };
  sponsor?: string; // company name when type === "sponsored"
  featured?: boolean;
  /** Home hero: the word(s) in the title to highlight in a red block */
  highlight?: string;
  /** Home hero slot: 1 = top story, 2/3 = side tiles */
  hero?: 1 | 2 | 3;
  series?: { slug: string; part: number };
  marketSeries?: string[]; // market series codes this article explains
  /** Pro analysis: the page shows the opening only; the rest is served to Pro readers (and Free readers within their monthly allowance). Defaults to true for type "analysis". */
  premium?: boolean;
};

export type Letter = {
  slug: string;
  date: string;
  title: string; // the quote
  writer: { name: string | null; role: string; org: string; country: string; verified: true };
  teaser: string;
  body: string[];
  replyTo: { slug: string; title: string; section: SectionCode };
  editorReply?: { by: string; date: string; text: string };
  ledToCorrection?: boolean;
  furtherLetters?: string[];
};

export type Column = {
  slug: string;
  date: string;
  title: string;
  summary: string;
  author: { name: string; title: string; org: string; disclosure: string };
  body: string[];
};

export type Company = {
  slug: string;
  name: string;
  legalName?: string;
  orgType: string; // organisation_type code
  categories: string[]; // category codes
  /** Editorial: up to two application areas (application_area codes), judged from covered projects. */
  applications: string[];
  materials?: MaterialGroupCode[];
  products: string[]; // product codes
  processes?: string[];
  country: string; // alpha2
  subdivision?: string;
  city: string;
  founded?: number;
  employees?: string;
  claimed: boolean;
  /** Pays for the Company plan (preview data; live from Stripe). Shown as a PAID MEMBER mark only — never changes order or placement. */
  paidMember?: boolean;
  verifiedAt?: string;
  summary: string;
  website?: string;
  exportMarkets?: string[]; // region codes (self-reported)
  certifications: { type: string; issuer?: string; no?: string; expires?: string; verified: boolean }[];
  /** product: product vocabulary code the card belongs to (optional for older entries). */
  productCards: { name: string; spec: string; photos: number; product?: string }[];
  updated: string;
};

export type EventItem = {
  slug: string;
  name: string;
  type: "trade_show" | "conference" | "webinar";
  start: string;
  end?: string;
  city?: string;
  country?: string;
  venue?: string;
  organiser?: string;
  online?: boolean;
  focus: string;
  summary: string;
  weAttend?: boolean;
  website?: string;
  /** Slug of our show report, once published (past events). */
  report?: string;
};

export type StandardStatus = "current" | "under_review" | "withdrawn" | "draft";

export type Standard = {
  no: string; // e.g. "EN 10223-4"
  slug: string;
  title: string;
  body: string; // standards_body code
  subject: string; // standard_subject code
  status: StandardStatus;
  edition?: string;
  checked: string;
  sourceUrl: string;
  replaces?: string;
  replacedBy?: string;
  adoptedAs?: string[];
  covers: string;
  whyItMatters: string[];
  related: string[];
  equivalents?: { body: string; no: string; relation: "equivalent" | "partial" | "not" }[];
  changelog: { date: string; kind: "status" | "equivalents" | "added" | "edition" | "withdrawn"; text: string; source?: string }[];
  followers: number;
  certifiedCompanies?: string[];
};

export type MarketState = "live" | "stale" | "unavailable";

export type MarketSeries = {
  code: string;
  name: string;
  unit: string;
  source: string;
  licence: "delayed30" | "nextday" | "licensed" | "own";
  asOf: string;
  latest: number | null;
  change: number | null;
  changePct: number | null;
  state: MarketState;
  lastGood?: { value: number; asOf: string };
  points: number[]; // 12 months, oldest first
  definition: string;
  updates: string;
};

export type Topic = {
  slug: string;
  name: string;
  title: string;
  intro: string;
  curator: string;
  updated: string;
  outline: string[];
  startHere: string[]; // article slugs in decision order
  terms: { term: string; def: string }[];
  companies: string[];
  sponsor?: string;
};

export type Author = {
  slug: string;
  name: string;
  role: string;
  sections: SectionCode[];
  bio: string;
  since: string;
  basedIn: string;
  email?: string;
  linkedin?: string;
  expertise: string[];
};

export type Policy = {
  slug: string;
  title: string;
  inShort: string;
  /** Publishable paragraphs; the first words up to the first full stop act as a heading when they are a short label. */
  paras: string[];
  /** For counsel-drafted policies: the section outline only. */
  sections: string[];
  draft: boolean;
  /** Human-readable effective date shown in the page header. */
  updated?: string;
};
