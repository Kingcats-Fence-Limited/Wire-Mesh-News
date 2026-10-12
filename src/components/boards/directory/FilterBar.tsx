"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";

/* Directory-D black tool bar. One panel open at a time; outside click / Esc closes.
   Simple menus (Application, Region) drop down under their button; the Product menu is a full-width
   panel grouped by product family; More filters is a full-width panel; phones get one bottom sheet. */

export type MenuItem = { label: string; sub?: string; href: string; on: boolean; count: number };
export type Tick = { label: string; href: string; on: boolean; count: number };
export type Group = { title: string; items: MenuItem[] };
export type Menu = { key: string; label: string; items: MenuItem[]; groups?: Group[]; note?: string; wide?: boolean };

const Chev = () => <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3.2" strokeLinecap="round" aria-hidden="true"><path d="m5 8 7 7 7-7" /></svg>;

function Opt({ it, onPick, tone }: { it: MenuItem; onPick: () => void; tone?: "pill" | "row" }) {
  return (
    <Link href={it.href} scroll={false} role="menuitemradio" aria-checked={it.on} className={`${tone === "pill" ? "fpill" : "frow"}${it.on ? " on" : ""}${it.count === 0 ? " zero" : ""}`} onClick={onPick}>
      <span className="sq" aria-hidden="true" />
      <span className="lab">{it.label}{it.sub && <span className="sub">{it.sub}</span>}</span>
      <span className="mono c">{it.count}</span>
    </Link>
  );
}

export function FilterBar({ menus, rows, resetHref, count, sort, children }: { menus: Menu[]; rows: { label: string; ticks: Tick[] }[]; resetHref: string; count: number; sort: React.ReactNode; children?: React.ReactNode }) {
  const [open, setOpen] = useState<string | null>(null);
  const root = useRef<HTMLDivElement>(null);
  const activeCount = menus.reduce((n, m) => n + (m.groups ? m.groups.flatMap((g) => g.items) : m.items).filter((x) => x.on).length, 0) + rows.reduce((n, r) => n + r.ticks.filter((t) => t.on).length, 0);
  const close = () => setOpen(null);

  useEffect(() => {
    if (!open) return;
    function onDoc(e: MouseEvent) {
      if (root.current && !root.current.contains(e.target as Node)) setOpen(null);
    }
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(null);
    }
    document.addEventListener("mousedown", onDoc);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDoc);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  const panelMenu = menus.find((m) => m.key === open && m.groups);

  return (
    <div ref={root} style={{ border: "2px solid var(--ink)", borderRadius: "16px", position: "relative" }}>
      <div className="toolbar" style={{ background: "var(--surface-dark)", color: "#FFFFFF", padding: "13px 16px", display: "flex", alignItems: "center", gap: "10px", flexWrap: "wrap", borderRadius: "14px 14px 0 0" }}>
        <span style={{ fontSize: "10.5px", fontWeight: "800", letterSpacing: ".14em", color: "var(--grey-2)", marginRight: "2px" }} className="mono">FILTER</span>
        {menus.map((m, i) => {
          const all = m.groups ? m.groups.flatMap((g) => g.items) : m.items;
          const n = all.filter((x) => x.on).length;
          const isOpen = open === m.key;
          return (
            <div key={m.key} style={{ display: "contents" }}>
              <div style={{ position: "relative" }}>
                <button type="button" className={`fchip${isOpen ? " open" : ""}`} aria-expanded={isOpen} aria-haspopup="menu" onClick={() => setOpen(isOpen ? null : m.key)}>
                  {m.label}{n > 0 && <span className="cnt mono">{n}</span>}<Chev />
                </button>
                {isOpen && !m.groups && (
                  <div role="menu" className="ddmenu" style={{ minWidth: m.wide ? "340px" : "280px" }}>
                    {m.note && <div className="ddnote">{m.note}</div>}
                    {m.items.map((it) => <Opt key={it.href} it={it} onPick={close} />)}
                  </div>
                )}
              </div>
              {i === 0 && <span style={{ fontSize: "10px", fontWeight: "700", letterSpacing: ".06em", color: "#6E7384" }} className="mono util">= SAME VOCABULARY AS THE APPLICATIONS SECTION</span>}
            </div>
          );
        })}
        <button type="button" className="fchip mobfilter" aria-expanded={open === "sheet"} onClick={() => setOpen(open === "sheet" ? null : "sheet")}>
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" aria-hidden="true"><path d="M4 7h16M7 12h10M10 17h4" /></svg>Filter{activeCount > 0 && <span className="cnt mono">{activeCount}</span>}
        </button>
        <button type="button" className={`fchip ghost${open === "more" ? " open" : ""}`} aria-expanded={open === "more"} onClick={() => setOpen(open === "more" ? null : "more")}>
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" aria-hidden="true"><path d="M4 7h16M7 12h10M10 17h4" /></svg>More filters
        </button>
        <div className="sortwrap" style={{ marginLeft: "auto", display: "flex", alignItems: "center", gap: "14px" }}>
          <span style={{ fontSize: "12.5px", fontWeight: "800", color: "#FFFFFF" }} className="mono">{count}<span style={{ color: "var(--grey-2)", fontWeight: "700" }}> {count === 1 ? "COMPANY" : "COMPANIES"}</span></span>
          {sort}
        </div>
      </div>

      {/* Product: full-width grouped panel */}
      {panelMenu && (
        <div role="menu" className="fpanel">
          <div className="fpanelhd">
            <span className="h" style={{ fontSize: "16px" }}>{panelMenu.label}</span>
            {panelMenu.note && <span className="meta">{panelMenu.note}</span>}
            <button type="button" className="fclose" aria-label="Close" onClick={close}>✕</button>
          </div>
          <div className="fgroups">
            {panelMenu.groups!.map((g) => (
              <div key={g.title} className="fgroup">
                <div className="fgrouphd">{g.title}</div>
                {g.items.map((it) => <Opt key={it.href} it={it} onPick={close} />)}
              </div>
            ))}
          </div>
          <div className="fpanelft">
            <span className="meta">Counts are companies in the directory today; a product with 0 is still a valid filter and fills as listings are added.</span>
            <Link href={resetHref} className="chip" scroll={false} onClick={close}>Reset</Link>
            <button type="button" className="fdone" onClick={close}>Done</button>
          </div>
        </div>
      )}

      {/* More filters: full-width panel */}
      {open === "more" && (
        <div className="fpanel">
          <div className="fpanelhd">
            <span className="h" style={{ fontSize: "16px" }}>More filters</span>
            <span className="meta">Coarse axes only; grades and processes are not filters</span>
            <button type="button" className="fclose" aria-label="Close" onClick={close}>✕</button>
          </div>
          <div className="frows">
            {rows.map((r) => (
              <div key={r.label} className="frowline">
                <span className="mono flabel">{r.label}</span>
                <div className="fpills">
                  {r.ticks.map((t) => <Link key={t.label} href={t.href} scroll={false} className={`fpill${t.on ? " on" : ""}`} onClick={close}><span className="sq" aria-hidden="true" />{t.label}<span className="c mono">{t.count}</span></Link>)}
                </div>
              </div>
            ))}
          </div>
          <div className="fpanelft">
            <span className="meta">Finer specifications (aperture, wire diameter, coating weight) are not filters: use search or the company profile.</span>
            <Link href={resetHref} className="chip" scroll={false} onClick={close}>Reset</Link>
            <button type="button" className="fdone" onClick={close}>Done</button>
          </div>
        </div>
      )}

      {children}

      {/* Phone: one bottom sheet with everything */}
      {open === "sheet" && (
        <div className="sheetwrap" role="dialog" aria-modal="true" aria-label="Filters">
          <button type="button" className="sheetscrim" aria-label="Close" onClick={close} />
          <div className="sheet">
            <div className="sheethd">
              <span className="h" style={{ fontSize: "19px" }}>Filters</span>
              {activeCount > 0 && <span className="cnt mono" style={{ background: "var(--red)", color: "#FFFFFF" }}>{activeCount}</span>}
              <button type="button" className="fclose" aria-label="Close" onClick={close}>✕</button>
            </div>
            <div className="sheetbody">
              {menus.map((m) => (
                <section key={m.key} className="fsec">
                  <h3 className="fsechd">{m.label}</h3>
                  {m.groups ? m.groups.map((g) => (
                    <div key={g.title} style={{ marginBottom: "12px" }}>
                      <div className="fgrouphd">{g.title}</div>
                      <div className="fpills">{g.items.map((it) => <Opt key={it.href} it={it} onPick={close} tone="pill" />)}</div>
                    </div>
                  )) : (
                    <div className="fpills">{m.items.map((it) => <Opt key={it.href} it={it} onPick={close} tone="pill" />)}</div>
                  )}
                </section>
              ))}
              {rows.map((r) => (
                <section key={r.label} className="fsec">
                  <h3 className="fsechd">{r.label.charAt(0) + r.label.slice(1).toLowerCase()}</h3>
                  <div className="fpills">{r.ticks.map((t) => <Link key={t.label} href={t.href} scroll={false} className={`fpill${t.on ? " on" : ""}`} onClick={close}><span className="sq" aria-hidden="true" />{t.label}<span className="c mono">{t.count}</span></Link>)}</div>
                </section>
              ))}
            </div>
            <div className="sheetft">
              <Link href={resetHref} className="chip" scroll={false} onClick={close}>Reset</Link>
              <button type="button" className="fdone" style={{ flex: "1 1 auto" }} onClick={close}>Show {count} {count === 1 ? "company" : "companies"}</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
