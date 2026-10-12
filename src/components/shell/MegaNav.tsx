"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";

/* Canvas Nav-J: hover opens after 120ms, closes after 240ms; one panel at a time;
   section label itself is a link; panel content is server-rendered (passed as data). */

export type MenuSection = {
  code: string;
  label: string;
  href: string;
  subs: { label: string; desc: string; href: string; icon: string }[];
  latest: { kicker: string; title: string; href: string }[];
  pick?: { kicker: string; title: string; dek: string; href: string };
};
export type MenuData = {
  sections: MenuSection[];
  date: string;
  snapshot: { name: string; value: string; pct: number | null; state: string }[];
  topics: { label: string; href: string }[];
  nextEvent?: { mon: string; day: string; name: string; where: string; href: string };
};

const ICONS: Record<string, React.ReactNode> = {
  doc: <><rect x="3" y="4.5" width="18" height="15" rx="2" /><path d="M7 9h6M7 12.5h10M7 16h8" /></>,
  gear: <><circle cx="12" cy="12" r="3" /><path d="M12 3v3M12 18v3M3 12h3M18 12h3M5.6 5.6l2.1 2.1M16.3 16.3l2.1 2.1M18.4 5.6l-2.1 2.1M7.7 16.3l-2.1 2.1" /></>,
  site: <><path d="M3 20.5h18M5 20.5V9l7-5 7 5v11.5" /><path d="M9.5 20.5v-5h5v5" /></>,
  cal: <><rect x="3" y="5" width="18" height="16" rx="2" /><path d="M3 10h18M8 3v4M16 3v4" /></>,
  chart: <path d="M4 18V9M10 18V5M16 18v-6M22 18H2" />,
  globe: <><circle cx="12" cy="12" r="9" /><path d="M3 12h18M12 3a14 14 0 0 1 0 18M12 3a14 14 0 0 0 0 18" /></>,
  trend: <path d="M3 17l6-6 4 4 8-8M14 7h7v7" />,
  ship: <><path d="M3 17h18l-2 4H5z" /><path d="M5 17V9h14v8M9 9V5h6v4" /></>,
  layers: <><path d="M12 3 3 8l9 5 9-5z" /><path d="M3 13l9 5 9-5" /></>,
  shield: <><path d="M12 3.2 4.8 6v5.4c0 4.3 3 7.8 7.2 9 4.2-1.2 7.2-4.7 7.2-9V6z" /><path d="m8.8 12 2.2 2.2 4.2-4.4" /></>,
  leaf: <path d="M5 19c8 0 14-6 14-14-8 0-14 6-14 14zM5 19l7-7" />,
  sun: <><circle cx="12" cy="12" r="4" /><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2" /></>,
  ball: <><circle cx="12" cy="12" r="9" /><path d="M3 12h18M12 3c3 3 3 15 0 18M12 3c-3 3-3 15 0 18" /></>,
  wire: <path d="M3 12c3-6 6-6 9 0s6 6 9 0" />,
  ruler: <><rect x="3" y="8" width="18" height="8" rx="1.5" /><path d="M7 8v3M11 8v4M15 8v3M19 8v4" /></>,
  weld: <><path d="M4 4h16M4 12h16M4 20h16M4 4v16M12 4v16M20 4v16" /></>,
  drop: <path d="M12 3s6 7 6 11a6 6 0 0 1-12 0c0-4 6-11 6-11z" />,
  test: <><path d="M9 3h6M10 3v7l-5 9a2 2 0 0 0 1.7 3h10.6a2 2 0 0 0 1.7-3l-5-9V3" /></>,
  tool: <path d="M14.7 6.3a4 4 0 0 0 5 5l-9.4 9.4a2.1 2.1 0 0 1-3-3l9.4-9.4z" />,
  compare: <><rect x="3" y="5" width="7" height="14" rx="1.5" /><rect x="14" y="5" width="7" height="14" rx="1.5" /></>,
  list: <><path d="M8 6h13M8 12h13M8 18h13" /><circle cx="4" cy="6" r="1" /><circle cx="4" cy="12" r="1" /><circle cx="4" cy="18" r="1" /></>,
  coin: <><circle cx="12" cy="12" r="8" /><path d="M9.5 10a2.5 2 0 0 1 5 0c0 2-5 2-5 4a2.5 2 0 0 0 5 0M12 6v2M12 16v2" /></>,
  check: <><circle cx="12" cy="12" r="9" /><path d="m8 12 3 3 5-6" /></>,
  box: <><path d="M3 7l9-4 9 4v10l-9 4-9-4z" /><path d="M3 7l9 4 9-4M12 11v10" /></>,
  building: <><rect x="4" y="3" width="16" height="18" rx="1.5" /><path d="M9 7h2M13 7h2M9 11h2M13 11h2M9 15h2M13 15h2M10 21v-3h4v3" /></>,
  plus: <><circle cx="12" cy="12" r="9" /><path d="M12 8v8M8 12h8" /></>,
  report: <><path d="M5 4h14v16H5z" /><path d="M8 9h8M8 13h8M8 17h5" /></>,
};
const Icon = ({ id, size = 17 }: { id: string; size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="var(--red)" strokeWidth="1.9" strokeLinejoin="round" strokeLinecap="round" aria-hidden="true">{ICONS[id] ?? ICONS.doc}</svg>
);

const chevDown = <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3.4" strokeLinecap="round" aria-hidden="true"><path d="m5 9 7 7 7-7" /></svg>;
const chevUp = <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3.4" strokeLinecap="round" aria-hidden="true"><path d="m19 15-7-7-7 7" /></svg>;

const QUICK: [string, string, string][] = [["doc", "Latest issue", "/news/"], ["chart", "Market data", "/market-data/"], ["cal", "Events calendar", "/events/"], ["building", "Company directory", "/directory/"], ["shield", "Standards Index", "/standards/"]];

export function MegaNav({ data, active }: { data: MenuData; active?: string }) {
  const [open, setOpen] = useState<string | null>(null);
  const enterT = useRef<number | null>(null);
  const leaveT = useRef<number | null>(null);
  const navRef = useRef<HTMLElement>(null);
  const [narrowLeft, setNarrowLeft] = useState(0);
  function show(code: string) {
    if (leaveT.current) window.clearTimeout(leaveT.current);
    enterT.current = window.setTimeout(() => setOpen(code), open ? 0 : 120);
  }
  function place(el: HTMLElement) {
    const wrap = navRef.current?.getBoundingClientRect();
    if (wrap) setNarrowLeft(Math.max(0, Math.min(el.getBoundingClientRect().left - wrap.left - 22, wrap.width - 64 - 600)));
  }
  function hide() {
    if (enterT.current) window.clearTimeout(enterT.current);
    leaveT.current = window.setTimeout(() => setOpen(null), 240);
  }
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(null);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);
  const cur = data.sections.find((s) => s.code === open);
  const isMarket = open === "market_insights";
  const narrow = open === "directory" || open === "events" || open === "standards";
  const navLink = (on: boolean) => ({ display: "inline-flex", alignItems: "center", gap: "6px", color: on ? "var(--red)" : undefined, position: "relative" as const });

  return (
    <div className="nav" style={{ borderTop: "1px solid var(--ink)", borderBottom: "3px solid var(--ink)", background: "#FFFFFF", position: "relative", zIndex: 40 }} onMouseLeave={hide}>
      <nav ref={navRef} className="wrap" aria-label="Primary" style={{ height: "50px", display: "flex", alignItems: "center", gap: "28px", fontSize: "14.5px", fontWeight: "700" }}>
        {data.sections.map((s) => (
          <Link key={s.code} href={s.href} style={navLink(open === s.code || (!open && active === s.code))} aria-expanded={open === s.code} aria-haspopup="true" onMouseEnter={() => show(s.code)} onFocus={() => show(s.code)} onClick={() => setOpen(null)}>
            {s.label}
            {open === s.code ? chevUp : chevDown}
            {open === s.code && <span style={{ position: "absolute", left: 0, right: 0, bottom: "-17px", height: "3px", background: "var(--red)" }} />}
          </Link>
        ))}
        <span style={{ width: "1px", height: "18px", background: "var(--line)" }}></span>
        {[["directory", "Directory", "/directory/"], ["events", "Events", "/events/"], ["standards", "Standards", "/standards/"]].map(([code, label, href]) => (
          <Link key={code} href={href} style={{ color: open === code ? "var(--red)" : "var(--slate)", fontWeight: "500" }} onMouseEnter={(e) => { place(e.currentTarget); show(code); }} onFocus={(e) => { place(e.currentTarget); show(code); }} onClick={() => setOpen(null)}>{label}</Link>
        ))}
      </nav>

      {open && (
        <div className="megapanel" role="region" aria-label={`${cur?.label ?? open} menu`} onMouseEnter={() => leaveT.current && window.clearTimeout(leaveT.current)} style={narrow ? { position: "absolute", left: 0, right: 0, top: "100%", zIndex: 50, pointerEvents: "none" } : { position: "absolute", left: 0, right: 0, top: "100%", background: "#FFFFFF", borderBottom: "3px solid var(--ink)", boxShadow: "0 24px 48px -24px rgba(21,22,28,.22)", zIndex: 50 }}>
          <div className="wrap" style={{ padding: 0 }}>
            {cur && (
              <div style={{ display: "grid", gridTemplateColumns: "1.08fr 1.05fr 1.12fr 0.86fr", gap: "0", background: "#FFFFFF" }}>
                <div style={{ padding: "26px 28px 26px 0" }}>
                  <div className="colhd"><span style={{ fontSize: "15px" }} className="h">Sections</span><Link href={cur.href} onClick={() => setOpen(null)} style={{ fontSize: "10.5px", fontWeight: "800", letterSpacing: ".1em", color: "var(--red)" }}>ALL</Link></div>
                  {cur.subs.map((x, i) => (
                    <Link key={x.href} href={x.href} onClick={() => setOpen(null)} className={`mi${i === 0 ? " on" : ""}`}>
                      <span className="ic"><Icon id={x.icon} /></span>
                      <span><b>{x.label}</b><span>{x.desc}</span></span>
                    </Link>
                  ))}
                </div>
                <div style={{ padding: "26px 28px", borderLeft: "1px solid var(--line)" }}>
                  <div className="colhd"><span style={{ fontSize: "15px" }} className="h">Latest in {cur.label}</span><span style={{ fontSize: "10.5px", fontWeight: "800" }} className="mono meta">{data.date}</span></div>
                  {cur.latest.map((a, i) => (
                    <Link key={a.href} href={a.href} onClick={() => setOpen(null)} style={{ display: "flex", gap: "12px", padding: "13px 0", borderBottom: i < cur.latest.length - 1 ? "1px solid var(--line)" : undefined }}>
                      <span style={{ width: "62px", aspectRatio: "1/1" }} className="ph"></span>
                      <span style={{ display: "flex", flexDirection: "column", gap: "4px", minWidth: "0" }}><span className="kick"><i></i>{a.kicker}</span><span style={{ fontSize: "13.5px", fontWeight: "800", lineHeight: "1.3", display: "-webkit-box", WebkitLineClamp: 3, WebkitBoxOrient: "vertical", overflow: "hidden" }}>{a.title}</span></span>
                    </Link>
                  ))}
                </div>
                {isMarket ? (
                  <div style={{ padding: "26px 28px", borderLeft: "1px solid var(--line)", background: "var(--ink)", color: "#FFFFFF" }}>
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: "10px", paddingBottom: "9px", borderBottom: "2px solid var(--red)", marginBottom: "12px" }}>
                      <span style={{ fontSize: "15px", color: "#FFFFFF" }} className="h">Market snapshot</span>
                      <span style={{ fontSize: "10px", fontWeight: "800", letterSpacing: ".08em", color: "var(--grey-5)" }} className="mono">WK TO {data.date}</span>
                    </div>
                    {data.snapshot.map((s, i) => (
                      <div key={s.name} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: "10px", padding: "9px 0", borderBottom: i < data.snapshot.length - 1 ? "1px solid var(--line-dark)" : undefined }}>
                        <span style={{ fontSize: "12.5px", fontWeight: "700", color: "var(--line-2)" }}>{s.name}</span>
                        <span style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                          <span className="mono" style={{ fontSize: "13px", fontWeight: "800" }}>{s.value}</span>
                          <span className="mono" style={{ fontSize: "11px", fontWeight: "800", color: s.pct === null ? "var(--grey)" : s.pct > 0 ? "#3DBE6B" : s.pct < 0 ? "#FF4A54" : "var(--grey)" }}>{s.pct === null ? "—" : `${s.pct > 0 ? "▲" : s.pct < 0 ? "▼" : "▬"}${Math.abs(s.pct).toFixed(1)}%`}</span>
                        </span>
                      </div>
                    ))}
                    <Link href="/market-data/" onClick={() => setOpen(null)} style={{ display: "inline-block", marginTop: "12px", fontSize: "10.5px", fontWeight: "800", letterSpacing: ".1em", color: "var(--red)" }}>FULL DATA &amp; METHOD &#8594;</Link>
                  </div>
                ) : (
                  <div style={{ padding: "26px 28px", borderLeft: "1px solid var(--line)" }}>
                    <div style={{ borderColor: "var(--red)" }} className="colhd"><span style={{ fontSize: "15px" }} className="h">Editors&apos; pick</span></div>
                    {cur.pick && (
                      <Link href={cur.pick.href} onClick={() => setOpen(null)} style={{ display: "block" }}>
                        <span style={{ display: "block", width: "100%", aspectRatio: "16/9", marginBottom: "11px" }} className="ph"></span>
                        <span style={{ marginBottom: "7px" }} className="kick"><i></i>{cur.pick.kicker}</span>
                        <span style={{ display: "block", fontSize: "18px", marginBottom: "7px" }} className="h">{cur.pick.title}</span>
                        <span style={{ lineHeight: "1.5", display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden" }} className="meta">{cur.pick.dek}</span>
                      </Link>
                    )}
                  </div>
                )}
                <div style={{ padding: "26px 0 26px 28px", background: "var(--paper)", margin: "0 -32px 0 0", paddingRight: "32px" }}>
                  <div style={{ marginBottom: "13px" }} className="cap">{isMarket ? "TOPICS" : "QUICK LINKS"}</div>
                  {isMarket
                    ? data.topics.map((t) => <Link key={t.href} href={t.href} onClick={() => setOpen(null)} style={{ display: "block", padding: "9px 0", fontSize: "13.5px", fontWeight: "700" }}>{t.label}</Link>)
                    : QUICK.map(([ic, l, h]) => (
                        <Link key={h} href={h} onClick={() => setOpen(null)} style={{ display: "flex", alignItems: "center", gap: "10px", padding: "9px 0", fontSize: "13.5px", fontWeight: "700" }}>
                          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="var(--ink)" strokeWidth="2" strokeLinejoin="round" strokeLinecap="round" aria-hidden="true">{ICONS[ic]}</svg>{l}
                        </Link>
                      ))}
                  {!isMarket && (
                    <div style={{ background: "var(--ink)", color: "#FFFFFF", borderRadius: "12px", padding: "17px", marginTop: "16px", position: "relative", overflow: "hidden" }}>
                      <svg width="150" height="150" viewBox="0 0 120 120" style={{ position: "absolute", right: "-46px", bottom: "-58px", color: "var(--fg-2)" }} aria-hidden="true"><use href="#w1" width="120" height="120" /></svg>
                      <div style={{ position: "relative" }}>
                        <div style={{ fontSize: "15px", color: "#FFFFFF", marginBottom: "5px" }} className="h">Weekly brief</div>
                        <p style={{ margin: "0 0 11px", fontSize: "12px", fontWeight: "500", lineHeight: "1.5", color: "var(--grey-3)" }}>The week&apos;s news and price moves, every Monday.</p>
                        <Link href="/subscribe/" onClick={() => setOpen(null)} style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", width: "100%", boxSizing: "border-box", minHeight: "40px", borderRadius: "8px", background: "var(--red)", color: "#FFFFFF", fontSize: "13px", fontWeight: "800" }}>Subscribe</Link>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}
            {narrow && (
              <div style={{ pointerEvents: "auto", display: "inline-grid", gridTemplateColumns: "auto auto 230px", gap: "26px", padding: "20px 22px 22px", background: "#FFFFFF", border: "1px solid var(--line)", borderTop: 0, borderRadius: "0 0 14px 14px", boxShadow: "0 24px 48px -24px rgba(21,22,28,.22)", marginLeft: `${narrowLeft}px`, maxWidth: "calc(100% - 28px)" }}>
                <div>
                  <div className="colhd"><span style={{ fontSize: "14px" }} className="h">Directory</span></div>
                  {[["list", "Browse companies", "/directory/"], ["shield", "Standards Index", "/standards/"], ["plus", "Suggest a listing", "/contact/?subject=directory"]].map(([ic, l, h]) => (
                    <Link key={h} href={h} onClick={() => setOpen(null)} style={{ padding: "8px 10px", margin: "0 -10px" }} className="mi"><span style={{ width: "30px", height: "30px" }} className="ic"><Icon id={ic} size={15} /></span><span><b>{l}</b></span></Link>
                  ))}
                </div>
                <div>
                  <div className="colhd"><span style={{ fontSize: "14px" }} className="h">Events</span></div>
                  {[["cal", "Calendar", "/events/"], ["report", "Show reports", "/news/events-exhibitions/"], ["plus", "Submit an event", "/contact/?subject=other"]].map(([ic, l, h]) => (
                    <Link key={h} href={h} onClick={() => setOpen(null)} style={{ padding: "8px 10px", margin: "0 -10px" }} className="mi"><span style={{ width: "30px", height: "30px" }} className="ic"><Icon id={ic} size={15} /></span><span><b>{l}</b></span></Link>
                  ))}
                </div>
                <div style={{ background: "var(--paper)", borderRadius: "11px", padding: "16px" }}>
                  <div style={{ marginBottom: "9px" }} className="cap">NEXT UP</div>
                  {data.nextEvent && (
                    <Link href={data.nextEvent.href} onClick={() => setOpen(null)} style={{ display: "flex", gap: "11px", alignItems: "center" }}>
                      <span style={{ flex: "0 0 40px", textAlign: "center" }}><span style={{ display: "block", fontSize: "10px", letterSpacing: ".08em", color: "var(--red)" }} className="h">{data.nextEvent.mon}</span><span style={{ display: "block", fontSize: "24px", lineHeight: "1" }} className="h">{data.nextEvent.day}</span></span>
                      <span style={{ minWidth: 0 }}><span style={{ display: "block", fontSize: "13.5px", fontWeight: "800", lineHeight: "1.3" }}>{data.nextEvent.name}</span><span className="meta" style={{ fontSize: "11.5px" }}>{data.nextEvent.where}</span></span>
                    </Link>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
