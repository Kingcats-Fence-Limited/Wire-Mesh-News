import Link from "next/link";
import { MegaNav, type MenuData } from "./MegaNav";
import { MastheadDateClocks, ClockLine, MobileDateLine } from "./Clocks";
import { ThemeSwitch } from "./ThemeSwitch";
import { SearchButton } from "./SearchButton";
import { MobileMenu } from "./MobileMenu";
import { EDITORIAL_SECTIONS, subsectionsOf, subsectionSlug, articleHref, fmtDateShort } from "@/lib/site";
import { bySection, latest, featured } from "@/lib/content/articles";
import { snapshotSeries, MARKET_LICENSED, TOPICS } from "@/lib/content/market";
import { upcomingEvents } from "@/lib/content/source";
import type { SectionCode } from "@/lib/content/types";

/* Sub-section descriptions and icons for the mega menu (canvas Nav-J shows one line under each). */
const SUB_META: Record<string, [string, string]> = {
  company_news: ["Company moves, capacity and people", "doc"],
  product_technology: ["New products, processes and machinery", "gear"],
  projects_case_studies: ["Projects and site reports", "site"],
  events_exhibitions: ["Show reports and previews", "cal"],
  materials_costs: ["Raw materials, coatings and cost", "coin"],
  trade_policy: ["Tariffs, anti-dumping and regulation", "globe"],
  demand_trends: ["Demand and end-market shifts", "trend"],
  supply_chain: ["Freight, lead times and stock", "ship"],
  architecture: ["Façades, screens and infrastructure", "building"],
  industrial_security: ["Site perimeters and machine guarding", "shield"],
  agriculture: ["Livestock, crops and horticulture", "leaf"],
  energy_environment: ["Solar sites, utilities and erosion control", "sun"],
  sports_lifestyle: ["Courts, pools and gardens", "ball"],
  materials: ["Wire grades and base materials", "wire"],
  specifications_tolerances: ["Dimensions, tolerances and how to specify", "ruler"],
  manufacturing: ["Welding, weaving and finishing", "weld"],
  surface_treatments: ["Galvanizing, PVC and powder", "drop"],
  standards_testing: ["Standards, test methods and reports", "test"],
  installation_maintenance: ["Posts, footings and upkeep", "tool"],
  selection_comparison: ["Choosing between mesh types", "compare"],
  rfq_preparation: ["What a complete enquiry states", "list"],
  cost_quote: ["Reading and comparing quotations", "coin"],
  quality_inspection: ["Certificates, tests and inspection", "check"],
  packing_shipping: ["Packing, containers and transit damage", "box"],
};

export function buildMenu(): MenuData {
  const sections = EDITORIAL_SECTIONS.map((s) => {
    const code = s.code as SectionCode;
    const pick = featured().find((a) => a.section === code) ?? bySection(code, 1)[0];
    return {
      code,
      label: s.label,
      href: `/${s.slug}/`,
      subs: subsectionsOf(code).map((x) => ({ label: x.label, desc: SUB_META[x.code]?.[0] ?? "", icon: SUB_META[x.code]?.[1] ?? "doc", href: `/${s.slug}/${subsectionSlug(x.code)}/` })),
      latest: bySection(code, 3).map((a) => ({ kicker: a.subsection.replace(/_/g, " ").split(" ")[0].toUpperCase(), title: a.title, href: articleHref(a) })),
      pick: pick ? { kicker: pick.subsection.replace(/_/g, " ").toUpperCase(), title: pick.title, dek: pick.dek, href: articleHref(pick) } : undefined,
    };
  });
  const next = upcomingEvents()[0];
  return {
    sections,
    date: fmtDateShort("2026-10-12"),
    snapshot: MARKET_LICENSED ? snapshotSeries().map((s) => ({ name: s.name.split(",")[0], value: s.latest === null ? "—" : s.latest.toLocaleString("en-US"), pct: s.state === "live" ? s.changePct : null, state: s.state })) : [],
    topics: TOPICS.slice(0, 4).map((t) => ({ label: t.name, href: `/topics/${t.slug}/` })),
    nextEvent: next ? { mon: fmtDateShort(next.start).split(" ")[1], day: fmtDateShort(next.start).split(" ")[0], name: next.name, where: next.online ? "Online" : `${next.city}`, href: `/events/#${next.slug}` } : undefined,
  };
}

function UtilityBar({ live }: { live?: { title: string; href: string } }) {
  /* "this week" is measured back from the newest article, not a date typed into the
     source, so the count stays right without anyone editing it. */
  const recent = latest(60);
  const newest = recent[0]?.date;
  const weekAgo = newest ? new Date(new Date(newest).getTime() - 6 * 86400000).toISOString().slice(0, 10) : "";
  const n = newest ? recent.filter((a) => a.date >= weekAgo).length : 0;
  return (
    <div className="utilbar" style={{ background: "var(--surface-dark)", color: "#FFFFFF" }}>
      <div className="wrap" style={{ height: "40px", display: "flex", alignItems: "center", gap: "16px", fontSize: "12.5px", fontWeight: "500" }}>
        <span className="mono utilcount" style={{ color: "#FFFFFF", flexShrink: "0", fontWeight: "700" }}>{n}<span style={{ color: "var(--grey-5)", fontWeight: "500" }}> NEW<span className="util"> THIS WEEK</span></span></span>
        <span style={{ width: "1px", height: "14px", background: "var(--line-dark)", flexShrink: "0" }}></span>
        <span className="utillive" style={{ background: "var(--red)", fontSize: "10px", fontWeight: "800", letterSpacing: ".14em", padding: "3px 8px", borderRadius: "3px", flexShrink: "0" }}>LIVE</span>
        {live && <Link href={live.href} style={{ color: "#FFFFFF", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", minWidth: "0" }}>{live.title}</Link>}
        <div className="util" style={{ marginLeft: "auto", display: "flex", alignItems: "center", gap: "14px", flexShrink: "0" }}>
          <Link href="/subscribe/" style={{ color: "var(--grey-3)" }}>Newsletter</Link><a href="/feed.xml" style={{ color: "var(--grey-3)" }}>RSS</a>
          <span style={{ width: "1px", height: "14px", background: "var(--line-dark)" }}></span>
          <ThemeSwitch />
        </div>
      </div>
    </div>
  );
}

/** Site header. "full" = Home-A masthead (date, clocks, big wordmark, tagline); "compact" = Category-B header. */
export function Header({ variant = "compact", active }: { variant?: "full" | "compact"; active?: string }) {
  const data = buildMenu();
  const live = latest(1)[0];
  return (
    <>
      <UtilityBar live={live ? { title: live.title, href: articleHref(live) } : undefined} />
      {variant === "full" ? (
        <header style={{ background: "var(--bg)" }}>
          <div className="wrap" style={{ paddingTop: "24px", paddingBottom: "18px" }}>
            <div className="masthead" style={{ display: "grid", gridTemplateColumns: "1fr auto 1fr", alignItems: "center", gap: "28px" }}>
              <MastheadDateClocks />
              <MobileMenu data={data} />
              <Link href="/" className="mastmid" aria-label="Wire Mesh News home" style={{ display: "flex", alignItems: "center", gap: "13px", justifyContent: "center" }}>
                <svg width="54" height="54" viewBox="0 0 120 120" aria-hidden="true"><use href="#w1" width="120" height="120" /></svg>
                <span className="h" style={{ fontSize: "54px", letterSpacing: "-.055em" }}>wire mesh</span>
                <span className="h" style={{ background: "var(--red)", color: "#FFFFFF", fontSize: "54px", letterSpacing: "-.055em", padding: "4px 14px 10px", borderRadius: "12px" }}>news</span>
              </Link>
              <div className="mastright" style={{ display: "flex", alignItems: "center", gap: "9px", justifyContent: "flex-end" }}>
                <SearchButton size={42} border="1.5px solid var(--line)" />
                <Link href="/signin/" className="mastbtn hdbtn" style={{ border: "1.5px solid var(--line)" }}>Sign In</Link>
                <Link href="/subscribe/" className="mastbtn hdbtn" style={{ background: "var(--red)", color: "#FFFFFF" }}>Subscribe free</Link>
              </div>
            </div>
            <div className="mobdate" style={{ display: "none", alignItems: "center", justifyContent: "space-between", gap: "8px", padding: "8px 0", borderBottom: "2px solid var(--ink)" }}><MobileDateLine /></div>
            <div className="tagline" style={{ marginTop: "20px", display: "flex", flexDirection: "column", alignItems: "center", gap: "0" }}>
              <div style={{ width: "100%", display: "flex", alignItems: "center", gap: "20px" }}>
                <span style={{ flex: "1 1 0", height: "1px", background: "var(--line)" }}></span>
                <span className="h" style={{ fontSize: "15.5px", letterSpacing: "-.01em", color: "var(--ink)", whiteSpace: "nowrap", padding: "0 4px" }}>Independent news, markets and standards for the global wire mesh industry</span>
                <span style={{ flex: "1 1 0", height: "1px", background: "var(--line)" }}></span>
              </div>
            </div>
          </div>
        </header>
      ) : (
        <header style={{ borderBottom: "1px solid var(--line)", background: "var(--bg)" }}>
          <div style={{ height: "82px", display: "flex", alignItems: "center", justifyContent: "space-between", gap: "20px" }} className="wrap">
            <div style={{ display: "flex", alignItems: "center", gap: "14px", minWidth: 0 }}>
              <MobileMenu data={data} />
              <Link href="/" aria-label="Wire Mesh News home" style={{ display: "flex", alignItems: "center", gap: "9px", flexShrink: "0" }}>
                <svg width="38" height="38" viewBox="0 0 120 120" aria-hidden="true"><use href="#w1" width="120" height="120" /></svg>
                <span style={{ fontSize: "25px", letterSpacing: "-.05em" }} className="h">wire mesh</span>
                <span style={{ background: "var(--red)", color: "#FFFFFF", fontSize: "25px", letterSpacing: "-.05em", padding: "3px 8px 5px", borderRadius: "7px" }} className="h">news</span>
              </Link>
              <span className="util" style={{ marginLeft: "10px" }}><ClockLine /></span>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: "10px", flexShrink: "0" }}>
              <SearchButton size={44} border="1px solid var(--line)" />
              <Link href="/submit/" style={{ border: "2px solid var(--ink)", fontWeight: "800", fontSize: "14px", padding: "0 18px", minHeight: "44px", borderRadius: "999px", display: "inline-flex", alignItems: "center" }} className="hdbtn">Submit an Article</Link>
              <Link href="/subscribe/" className="hdbtn" style={{ background: "var(--red)", color: "#FFFFFF", fontWeight: "800", fontSize: "14px", padding: "0 20px", minHeight: "44px", borderRadius: "999px", display: "inline-flex", alignItems: "center" }}>Subscribe</Link>
              <Link href="/signin/" className="hdbtn" style={{ border: "1px solid var(--line)", fontWeight: "800", fontSize: "14px", padding: "0 18px", minHeight: "44px", borderRadius: "999px", display: "inline-flex", alignItems: "center" }}>Sign In</Link>
            </div>
          </div>
        </header>
      )}
      <MegaNav data={data} active={active} />
    </>
  );
}
