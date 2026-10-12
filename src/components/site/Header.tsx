import Link from "next/link";
import { clsx } from "clsx";
import { Wordmark } from "@/components/ui/Brand";
import { ButtonLink } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Primitives";
import { EDITORIAL_SECTIONS, NAV_RESOURCES, SITE, subsectionsOf, articleHref, fmtDateShort } from "@/lib/site";
import { bySection, latest, featured } from "@/lib/content/articles";
import { snapshotSeries, MARKET_LICENSED } from "@/lib/content/market";
import { upcomingEvents } from "@/lib/content/directory";
import { MastheadClocks } from "./Clocks";
import { NavClient, type MenuData } from "./NavClient";
import { SearchLauncher } from "./SearchLauncher";
import type { SectionCode } from "@/lib/content/types";

function buildMenuData(): MenuData {
  const sections = EDITORIAL_SECTIONS.map((s) => {
    const code = s.code as SectionCode;
    const subs = subsectionsOf(code).map((x) => ({ label: x.label, href: `/${s.slug}/${x.code.replace(/_/g, "-")}/` }));
    const items = bySection(code, 3).map((a) => ({ title: a.title, href: articleHref(a), kicker: a.subsection.replace(/_/g, " ").toUpperCase(), date: fmtDateShort(a.date) }));
    const pick = featured().find((a) => a.section === code) ?? bySection(code, 1)[0];
    return {
      code,
      label: s.label,
      href: `/${s.slug}/`,
      subs,
      items,
      pick: pick ? { title: pick.title, dek: pick.dek, href: articleHref(pick), kicker: pick.subsection.replace(/_/g, " ").toUpperCase() } : undefined,
    };
  });
  const snap = MARKET_LICENSED
    ? snapshotSeries().map((s) => ({ name: s.name, value: s.latest, pct: s.changePct, state: s.state, unit: s.unit }))
    : [];
  const next = upcomingEvents()[0];
  return {
    sections,
    snapshot: snap,
    nextEvent: next ? { name: next.name, when: fmtDateShort(next.start), where: next.online ? "Online" : next.city ?? "", href: `/events/#${next.slug}` } : undefined,
    newThisWeek: latest(50).filter((a) => a.date >= "2026-10-06").length,
    live: latest(1)[0] ? { title: latest(1)[0].title, href: articleHref(latest(1)[0]) } : undefined,
  };
}

/**
 * Site header. `variant="full"` = home masthead (utility bar, date + clocks,
 * big wordmark, tagline); `variant="compact"` = inner pages.
 */
export function Header({ variant = "compact" }: { variant?: "full" | "compact" }) {
  const data = buildMenuData();
  return (
    <header className="relative z-40 bg-bg">
      {/* Utility bar */}
      <div className="bg-dark text-white">
        <div className="wrap flex h-9 items-center gap-4 text-[11px] font-extrabold tracking-[0.1em]">
          <span className="num whitespace-nowrap">
            <span className="text-white">{data.newThisWeek}</span> <span className="text-grey-5">NEW<span className="max-sm:hidden"> THIS WEEK</span></span>
          </span>
          {data.live && (
            <Link href={data.live.href} className="flex min-w-0 items-center gap-2.5 hover:text-red-text">
              <Badge tone="live" size="sm">Live</Badge>
              <span className="truncate text-[12px] font-semibold tracking-normal normal-case">{data.live.title}</span>
            </Link>
          )}
          <span className="ml-auto hidden items-center gap-4 text-grey-3 md:flex">
            <Link href="/submit/" className="hover:text-white">Submit an Article</Link>
            <Link href="/advertise/" className="hover:text-white">Advertise</Link>
          </span>
        </div>
      </div>

      {/* Masthead */}
      {variant === "full" ? (
        <div className="wrap">
          <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-6 py-6 max-md:grid-cols-[auto_1fr_auto] max-md:py-4">
            <div className="max-md:hidden">
              <MastheadClocks />
            </div>
            <div className="md:hidden">
              <NavClient data={data} mobileOnlyTrigger />
            </div>
            <div className="flex flex-col items-center gap-3 text-center">
              <span className="max-lg:hidden"><Wordmark size={54} /></span>
              <span className="max-md:hidden lg:hidden"><Wordmark size={40} /></span>
              <span className="md:hidden"><Wordmark size={24} /></span>
              <p className="meta max-md:hidden text-[13px] font-semibold tracking-[0.01em]">{SITE.tagline}</p>
            </div>
            <div className="flex items-center justify-end gap-2.5">
              <SearchLauncher />
              <ButtonLink href="/signin/" variant="outline" size="sm" className="max-lg:hidden">Sign in</ButtonLink>
              <ButtonLink href="/subscribe/" size="sm" className="max-md:hidden">Subscribe free</ButtonLink>
            </div>
          </div>
        </div>
      ) : (
        <div className="wrap">
          <div className="flex h-[64px] items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="md:hidden">
                <NavClient data={data} mobileOnlyTrigger />
              </div>
              <Wordmark size={21} />
              <span className="ml-3 hidden lg:inline">
                <MastheadClocks compact />
              </span>
            </div>
            <div className="flex items-center gap-2.5">
              <SearchLauncher />
              <ButtonLink href="/signin/" variant="outline" size="sm" className="max-md:hidden">Sign in</ButtonLink>
              <ButtonLink href="/subscribe/" size="sm" className="max-md:hidden">Subscribe free</ButtonLink>
            </div>
          </div>
        </div>
      )}

      {/* Primary nav + mega menu (desktop) */}
      <div className={clsx("border-t border-ink border-b-[3px] border-b-ink dark:border-line-2 max-md:hidden")}>
        <div className="wrap">
          <NavClient data={data} />
        </div>
      </div>
      <div className="h-[3px] bg-ink dark:bg-line-2 md:hidden" aria-hidden="true" />
      {/* Resources are reachable from the drawer on mobile; render for a11y / SEO anyway */}
      <nav aria-label="Resources" className="sr-only">
        {NAV_RESOURCES.map((r) => (
          <Link key={r.href} href={r.href}>{r.label}</Link>
        ))}
      </nav>
    </header>
  );
}
