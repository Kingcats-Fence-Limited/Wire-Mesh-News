"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { clsx } from "clsx";
import { NAV_RESOURCES, SITE } from "@/lib/site";
import { Wordmark } from "@/components/ui/Brand";
import { SocialRow } from "@/components/ui/SocialButton";
import { Badge } from "@/components/ui/Primitives";

export type MenuData = {
  sections: {
    code: string;
    label: string;
    href: string;
    subs: { label: string; href: string }[];
    items: { title: string; href: string; kicker: string; date: string }[];
    pick?: { title: string; dek: string; href: string; kicker: string };
  }[];
  snapshot: { name: string; value: number | null; pct: number | null; state: string; unit: string }[];
  nextEvent?: { name: string; when: string; where: string; href: string };
  newThisWeek: number;
  live?: { title: string; href: string };
};

const QUICK = [
  { label: "Latest issue", href: "/news/" },
  { label: "Market data", href: "/market-data/" },
  { label: "Events calendar", href: "/events/" },
  { label: "Company directory", href: "/directory/" },
  { label: "Standards Index", href: "/standards/" },
];

/* ------------------------------------------------------------------ */
/* Desktop nav + mega menu                                             */
/* ------------------------------------------------------------------ */
export function NavClient({ data, mobileOnlyTrigger }: { data: MenuData; mobileOnlyTrigger?: boolean }) {
  const [open, setOpen] = useState<string | null>(null);
  const [drawer, setDrawer] = useState(false);
  const enterT = useRef<number | null>(null);
  const leaveT = useRef<number | null>(null);

  function show(code: string) {
    if (leaveT.current) window.clearTimeout(leaveT.current);
    enterT.current = window.setTimeout(() => setOpen(code), open ? 0 : 120);
  }
  function hide() {
    if (enterT.current) window.clearTimeout(enterT.current);
    leaveT.current = window.setTimeout(() => setOpen(null), 240);
  }
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") {
        setOpen(null);
        setDrawer(false);
      }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);
  useEffect(() => {
    document.documentElement.style.overflow = drawer ? "hidden" : "";
    return () => {
      document.documentElement.style.overflow = "";
    };
  }, [drawer]);

  if (mobileOnlyTrigger) {
    return (
      <>
        <button
          type="button"
          aria-label="Open menu"
          aria-expanded={drawer}
          onClick={() => setDrawer(true)}
          className="tap inline-flex items-center justify-center rounded-full text-fg"
        >
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" aria-hidden="true"><path d="M4 7h16M4 12h16M4 17h16" /></svg>
        </button>
        {drawer && <Drawer data={data} onClose={() => setDrawer(false)} />}
      </>
    );
  }

  const current = data.sections.find((s) => s.code === open);
  const isMarket = open === "market_insights";
  const narrow = open === "directory" || open === "events" || open === "standards";

  return (
    <div className="relative" onMouseLeave={hide}>
      <nav aria-label="Primary" className="flex h-[52px] items-stretch">
        <ul className="flex items-stretch gap-1">
          {data.sections.map((s) => (
            <li key={s.code} className="flex items-stretch" onMouseEnter={() => show(s.code)}>
              <Link
                href={s.href}
                aria-expanded={open === s.code}
                aria-haspopup="true"
                onFocus={() => show(s.code)}
                onClick={() => setOpen(null)}
                className={clsx(
                  "relative inline-flex items-center px-3.5 text-[14px] font-extrabold transition-colors hover:text-red-text",
                  open === s.code && "text-red-text after:absolute after:inset-x-3.5 after:bottom-0 after:h-[3px] after:bg-red",
                )}
              >
                {s.label}
              </Link>
            </li>
          ))}
        </ul>
        <span aria-hidden="true" className="mx-3 my-auto h-6 w-px bg-line" />
        <ul className="flex items-stretch gap-1">
          {NAV_RESOURCES.map((r) => {
            const code = r.label.toLowerCase();
            return (
              <li key={r.href} className="flex items-stretch" onMouseEnter={() => show(code)}>
                <Link
                  href={r.href}
                  onFocus={() => show(code)}
                  onClick={() => setOpen(null)}
                  className={clsx("inline-flex items-center px-3 text-[14px] font-bold text-slate transition-colors hover:text-red-text", open === code && "text-red-text")}
                >
                  {r.label}
                </Link>
              </li>
            );
          })}
        </ul>
        <span className="ml-auto flex items-center gap-4 text-[12px] font-bold text-slate">
          <Link href="/letters/" className="hover:text-red-text">Letters</Link>
          <Link href="/topics/" className="hover:text-red-text">Topics</Link>
        </span>
      </nav>

      {/* Panel */}
      {open && (
        <div
          role="region"
          aria-label={`${current?.label ?? open} menu`}
          onMouseEnter={() => leaveT.current && window.clearTimeout(leaveT.current)}
          className={clsx(
            "absolute left-0 right-0 top-full z-50 border-b-[3px] border-ink bg-bg shadow-[0_24px_60px_rgba(21,22,28,.18)] dark:border-line-2",
            narrow && "right-auto min-w-[320px]",
          )}
        >
          {current && (
            <div className="grid grid-cols-[220px_1fr_1fr_200px] gap-8 px-2 py-7">
              <div>
                <div className="kicker mb-3">Sections</div>
                <ul className="flex flex-col gap-2.5">
                  <li><Link href={current.href} className="text-[14px] font-extrabold text-red-text">All {current.label}</Link></li>
                  {current.subs.map((s) => (
                    <li key={s.href}><Link href={s.href} onClick={() => setOpen(null)} className="text-[14px] font-bold hover:text-red-text">{s.label}</Link></li>
                  ))}
                </ul>
              </div>
              <div>
                <div className="kicker mb-3">Latest in {current.label}</div>
                <ul className="flex flex-col divide-y divide-line">
                  {current.items.map((a) => (
                    <li key={a.href} className="py-2.5 first:pt-0">
                      <Link href={a.href} onClick={() => setOpen(null)} className="group block">
                        <span className="num mb-1 block text-[10px] font-extrabold tracking-[0.1em] text-grey">{a.date} · {a.kicker}</span>
                        <span className="font-display text-[15px] leading-[1.25] group-hover:text-red-text">{a.title}</span>
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                {isMarket ? (
                  <>
                    <div className="kicker mb-3">Market snapshot</div>
                    {data.snapshot.length ? (
                      <ul className="num flex flex-col divide-y divide-line text-[13px]">
                        {data.snapshot.map((s) => (
                          <li key={s.name} className="flex items-center justify-between py-2 first:pt-0">
                            <span className="font-bold">{s.name}</span>
                            {s.state === "unavailable" || s.value === null ? (
                              <span className="text-[10px] font-extrabold tracking-[0.1em] text-grey">UNAVAILABLE</span>
                            ) : (
                              <span className="flex items-center gap-2"><span className="font-extrabold">{s.value.toLocaleString("en-US")}</span><Pct v={s.pct} /></span>
                            )}
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <p className="meta">Licensed market data is not yet live.</p>
                    )}
                    <Link href="/market-data/" onClick={() => setOpen(null)} className="mt-3 inline-flex text-[12px] font-extrabold tracking-[0.06em] text-red-text">FULL DATA &amp; METHOD →</Link>
                  </>
                ) : current.pick ? (
                  <>
                    <div className="kicker mb-3">Editors’ pick</div>
                    <Link href={current.pick.href} onClick={() => setOpen(null)} className="group block">
                      <span className="mb-2 block aspect-[16/9] rounded-lg bg-dark-2" aria-hidden="true" />
                      <span className="num mb-1 block text-[10px] font-extrabold tracking-[0.1em] text-grey">{current.pick.kicker}</span>
                      <span className="font-display block text-[17px] leading-[1.2] group-hover:text-red-text">{current.pick.title}</span>
                      <span className="meta mt-1 block leading-[1.5]">{current.pick.dek}</span>
                    </Link>
                  </>
                ) : null}
              </div>
              <div className="border-l border-line pl-6">
                <div className="kicker mb-3">Quick links</div>
                <ul className="flex flex-col gap-2.5 text-[13.5px] font-bold">
                  {QUICK.map((q) => (
                    <li key={q.href}><Link href={q.href} onClick={() => setOpen(null)} className="hover:text-red-text">{q.label}</Link></li>
                  ))}
                </ul>
                <div className="mt-5 rounded-card bg-dark p-4 text-white">
                  <div className="font-display text-[15px]">Weekly brief</div>
                  <p className="mt-1 text-[12px] font-medium text-grey-3">One email a week: news, prices and standards changes.</p>
                  <Link href="/subscribe/" onClick={() => setOpen(null)} className="mt-3 inline-flex min-h-[36px] items-center rounded-full bg-red px-4 text-[12.5px] font-extrabold">Subscribe</Link>
                </div>
              </div>
            </div>
          )}
          {open === "directory" && (
            <NarrowPanel title="Directory" links={[["Browse companies", "/directory/"], ["Standards Index", "/standards/"], ["Suggest a listing", "/contact/?subject=directory"]]} onPick={() => setOpen(null)} />
          )}
          {open === "events" && (
            <NarrowPanel title="Events" links={[["Calendar", "/events/"], ["Show reports", "/news/events-exhibitions/"], ["Submit an event", "/contact/?subject=other"]]} onPick={() => setOpen(null)} extra={data.nextEvent && (
              <Link href={data.nextEvent.href} onClick={() => setOpen(null)} className="mt-4 flex items-center gap-3 rounded-card border border-line p-3 hover:border-ink">
                <span className="num flex h-12 w-12 flex-col items-center justify-center rounded-lg bg-dark text-white"><span className="text-[9px] font-extrabold tracking-[0.1em]">{data.nextEvent.when.split(" ")[1]}</span><span className="text-[17px] font-extrabold leading-none">{data.nextEvent.when.split(" ")[0]}</span></span>
                <span className="min-w-0"><span className="kicker block text-[9.5px]">Next up</span><span className="font-display block truncate text-[14px]">{data.nextEvent.name}</span><span className="meta block text-[11.5px]">{data.nextEvent.where}</span></span>
              </Link>
            )} />
          )}
          {open === "standards" && (
            <NarrowPanel title="Standards Index" links={[["Browse the index", "/standards/"], ["Equivalence table", "/standards/#equivalence"], ["Report a change", "/contact/?subject=correction"]]} onPick={() => setOpen(null)} />
          )}
        </div>
      )}
    </div>
  );
}

function Pct({ v }: { v: number | null }) {
  if (v === null) return null;
  const cls = v > 0 ? "text-up" : v < 0 ? "text-down" : "text-flat";
  const arrow = v > 0 ? "▲" : v < 0 ? "▼" : "▬";
  return <span className={clsx("text-[11.5px] font-extrabold", cls)}>{arrow} {Math.abs(v).toFixed(1)}%</span>;
}

function NarrowPanel({ title, links, onPick, extra }: { title: string; links: [string, string][]; onPick: () => void; extra?: React.ReactNode }) {
  return (
    <div className="px-6 py-6">
      <div className="kicker mb-3">{title}</div>
      <ul className="flex flex-col gap-2.5 text-[14px] font-bold">
        {links.map(([l, h]) => (
          <li key={h}><Link href={h} onClick={onPick} className="hover:text-red-text">{l}</Link></li>
        ))}
      </ul>
      {extra}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Mobile drawer (Mobile-M ②): full-screen, accordion sections         */
/* ------------------------------------------------------------------ */
function Drawer({ data, onClose }: { data: MenuData; onClose: () => void }) {
  const [openSec, setOpenSec] = useState<string | null>(null);
  return (
    <div role="dialog" aria-modal="true" aria-label="Menu" className="fixed inset-0 z-[80] flex flex-col bg-dark text-white">
      <div className="flex h-14 items-center justify-between border-b border-line-dark px-4">
        <Wordmark size={17} tone="white" />
        <button type="button" onClick={onClose} aria-label="Close menu" className="tap inline-flex items-center justify-center rounded-full border border-line-dark text-white">✕</button>
      </div>
      <div className="flex-1 overflow-y-auto px-4 pb-10">
        <div className="flex gap-2 py-4">
          <Link href="/signin/" onClick={onClose} className="inline-flex min-h-[44px] flex-1 items-center justify-center rounded-full border border-line-dark text-[14px] font-extrabold">Sign in</Link>
          <Link href="/subscribe/" onClick={onClose} className="inline-flex min-h-[44px] flex-1 items-center justify-center rounded-full bg-red text-[14px] font-extrabold">Subscribe free</Link>
        </div>
        <div className="kicker mb-2 text-grey-2">Sections</div>
        <ul className="divide-y divide-line-dark border-y border-line-dark">
          {data.sections.map((s) => (
            <li key={s.code}>
              <div className="flex items-center">
                <Link href={s.href} onClick={onClose} className="flex-1 py-3.5 font-display text-[19px]">{s.label}</Link>
                <button type="button" aria-expanded={openSec === s.code} aria-label={`Expand ${s.label}`} onClick={() => setOpenSec(openSec === s.code ? null : s.code)} className="tap inline-flex items-center justify-center text-grey-2">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" aria-hidden="true" className={clsx("transition-transform", openSec === s.code && "rotate-180")}><path d="m5 9 7 7 7-7" /></svg>
                </button>
              </div>
              {openSec === s.code && (
                <ul className="flex flex-col gap-2.5 pb-4 pl-3">
                  {s.subs.map((x) => (
                    <li key={x.href}><Link href={x.href} onClick={onClose} className="text-[14px] font-bold text-grey-3">{x.label}</Link></li>
                  ))}
                </ul>
              )}
            </li>
          ))}
        </ul>
        <div className="kicker mb-2 mt-5 text-grey-2">Resources</div>
        <div className="flex flex-wrap gap-2">
          {[...NAV_RESOURCES, { label: "Market data", href: "/market-data/" }, { label: "Letters", href: "/letters/" }, { label: "Topics", href: "/topics/" }].map((r) => (
            <Link key={r.href} href={r.href} onClick={onClose} className="inline-flex min-h-[40px] items-center rounded-full border border-line-dark px-4 text-[13px] font-bold">{r.label}</Link>
          ))}
        </div>
        <div className="kicker mb-2 mt-6 text-grey-2">Follow</div>
        <SocialRow size={38} />
        <div className="mt-6 flex flex-wrap gap-x-4 gap-y-2 text-[12.5px] font-bold text-grey-3">
          <Link href="/about/" onClick={onClose}>About</Link>
          <Link href="/contact/" onClick={onClose}>Contact</Link>
          <Link href="/submit/" onClick={onClose}>Submit an Article</Link>
          <Link href="/advertise/" onClick={onClose}>Advertise</Link>
        </div>
        <p className="mt-6 text-[11px] font-medium text-grey-5">{SITE.tagline}</p>
        {data.live && <Badge tone="live" size="sm" className="mt-3">Live</Badge>}
      </div>
    </div>
  );
}
