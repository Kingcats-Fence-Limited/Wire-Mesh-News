import { SECTION, SUBSECTION } from "@/data/vocab";
import type { SectionCode } from "./content/types";

export const SITE = {
  name: "Wire Mesh News",
  tagline: "Independent news, markets and standards for the global wire mesh industry",
  footerLine: "Independent industry media for wire mesh and metal mesh.",
  url: "https://www.wiremeshnews.com",
  email: "hello@wiremeshnews.com",
  /** Operator details appear only on About / Privacy / Terms (HANDOFF §5.1). */
  operator: { legalName: "KINGCATS FENCE LIMITED", region: "United States" },
  launched: 2026,
  /** Optional phone shown on About/Contact only; leave empty until a real line exists. */
  phone: "",
  clocks: [
    { label: "Shanghai", tz: "Asia/Shanghai" },
    { label: "Hamburg", tz: "Europe/Berlin" },
    { label: "Houston", tz: "America/Chicago" },
  ],
};

export const EDITORIAL_SECTIONS = SECTION.filter((s) => s.code !== "letters_opinion") as readonly { code: SectionCode; label: string; slug: string }[];

export const sectionBySlug = (slug: string) => EDITORIAL_SECTIONS.find((s) => s.slug === slug);
export const sectionByCode = (code: string) => EDITORIAL_SECTIONS.find((s) => s.code === code);
export const subsectionsOf = (code: SectionCode) => SUBSECTION.filter((s) => s.section === code);
export const subsectionLabel = (section: SectionCode, code: string) => SUBSECTION.find((s) => s.section === section && s.code === code)?.label ?? code;
export const subsectionSlug = (code: string) => code.replace(/_/g, "-");

export const SECTION_INTRO: Record<SectionCode, { intro: string; mesh: "chain" | "weld" | "weldQ" | "woven" | "grate" | "perf" | "exp" }> = {
  news: { intro: "Company moves, products, projects and the shows where the industry meets — reported, dated and sourced.", mesh: "weldQ" },
  market_insights: { intro: "Raw materials, trade measures, demand and the supply chain behind every quotation, with licensed market data where it helps.", mesh: "perf" },
  applications: { intro: "Where mesh goes to work: façades, perimeters, farms, energy sites and sports grounds — by scenario, not by product.", mesh: "exp" },
  technical_guides: { intro: "Reference material written for engineers and specifiers, with the conditions each recommendation applies under stated up front.", mesh: "weld" },
  buying_guides: { intro: "Selection, RFQs, quote evaluation, inspection and shipping — editorial guidance for buyers, never sales content.", mesh: "chain" },
};

export const NAV_RESOURCES = [
  { label: "Directory", href: "/directory/" },
  { label: "Events", href: "/events/" },
  { label: "Standards", href: "/standards/" },
];

export const FOOTER_COLUMNS = [
  { title: "Sections", links: [...EDITORIAL_SECTIONS.map((s) => ({ label: s.label, href: `/${s.slug}/` })), { label: "Opinion & Letters", href: "/letters/" }] },
  {
    title: "Resources",
    links: [
      { label: "Company Directory", href: "/directory/" },
      { label: "Events Calendar", href: "/events/" },
      { label: "Topics", href: "/topics/" },
      { label: "Market data", href: "/market-data/" },
      { label: "Standards Index", href: "/standards/" },
      { label: "RSS feed", href: "/feed.xml" },
    ],
  },
  {
    title: "Participate",
    links: [
      { label: "About", href: "/about/" },
      { label: "Contact", href: "/contact/" },
      { label: "Submit an Article", href: "/submit/" },
      { label: "Submission Guidelines", href: "/policies/submission-guidelines/" },
      { label: "Letters to the editor", href: "/letters/" },
      { label: "Advertise & Partner", href: "/advertise/" },
    ],
  },
  {
    title: "Policies",
    links: [
      { label: "Editorial Policy", href: "/policies/editorial-policy/" },
      { label: "Comment Policy", href: "/policies/comment-policy/" },
      { label: "Corrections", href: "/policies/corrections/" },
      { label: "Privacy", href: "/policies/privacy/" },
      { label: "Terms", href: "/policies/terms/" },
      { label: "Copyright", href: "/policies/copyright/" },
    ],
  },
];

export const fmtDate = (iso: string, opts: Intl.DateTimeFormatOptions = { day: "numeric", month: "short", year: "numeric" }) =>
  new Intl.DateTimeFormat("en-GB", opts).format(new Date(iso));
export const fmtDateShort = (iso: string) => new Intl.DateTimeFormat("en-GB", { day: "numeric", month: "short" }).format(new Date(iso)).toUpperCase();
export const fmtNum = (n: number, digits = 0) => new Intl.NumberFormat("en-US", { minimumFractionDigits: digits, maximumFractionDigits: digits }).format(n);
export const daysAgo = (iso: string, now = new Date("2026-10-12")) => {
  const d = Math.round((now.getTime() - new Date(iso).getTime()) / 86400000);
  if (d <= 0) return "TODAY";
  if (d === 1) return "YESTERDAY";
  if (d < 7) return `${d} DAYS AGO`;
  if (d < 14) return "1 WEEK AGO";
  if (d < 30) return `${Math.round(d / 7)} WEEKS AGO`;
  return fmtDateShort(iso);
};
export const articleHref = (a: { section: SectionCode; slug: string }) => `/${sectionByCode(a.section)!.slug}/${a.slug}/`;
