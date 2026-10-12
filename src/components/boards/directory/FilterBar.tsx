"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";

/* Directory-D black tool bar. One dropdown open at a time; outside click / Esc closes; More filters closes the dropdowns. */

export type MenuItem = { label: string; sub?: string; href: string; on: boolean; count: number };
export type Tick = { label: string; href: string; on: boolean; count: number };
export type Menu = { key: string; label: string; items: MenuItem[]; note?: string; wide?: boolean };

const Chev = () => <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3.2" strokeLinecap="round" aria-hidden="true"><path d="m5 8 7 7 7-7" /></svg>;

export function FilterBar({ menus, rows, resetHref, count, sort, children }: { menus: Menu[]; rows: { label: string; ticks: Tick[] }[]; resetHref: string; count: number; sort: React.ReactNode; children?: React.ReactNode }) {
  const [open, setOpen] = useState<string | null>(null);
  const root = useRef<HTMLDivElement>(null);
  const activeCount = menus.reduce((n, m) => n + m.items.filter((x) => x.on).length, 0) + rows.reduce((n, r) => n + r.ticks.filter((t) => t.on).length, 0);

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

  return (
    <div ref={root} style={{ border: "2px solid var(--ink)", borderRadius: "16px", overflow: "visible" }}>
      <div className="toolbar" style={{ background: "var(--surface-dark)", color: "#FFFFFF", padding: "13px 16px", display: "flex", alignItems: "center", gap: "10px", flexWrap: "wrap", borderRadius: "14px 14px 0 0" }}>
        <span style={{ fontSize: "10.5px", fontWeight: "800", letterSpacing: ".14em", color: "var(--grey-2)", marginRight: "2px" }} className="mono">FILTER</span>
        {menus.map((m, i) => {
          const n = m.items.filter((x) => x.on).length;
          const isOpen = open === m.key;
          return (
            <div key={m.key} style={{ position: "relative", display: "contents" }}>
              <div style={{ position: "relative" }}>
                <button type="button" className={`fchip${isOpen ? " open" : ""}`} aria-expanded={isOpen} aria-haspopup="menu" onClick={() => setOpen(isOpen ? null : m.key)}>
                  {m.label}{n > 0 && <span style={{ color: "var(--grey)", fontWeight: "800" }} className="mono">{n}</span>}<Chev />
                </button>
                {isOpen && (
                  <div role="menu" className={`ddmenu${m.items.length > 8 ? " wide2" : ""}`} style={{ minWidth: m.wide ? "340px" : "280px" }}>
                    {m.note && <div className="ddnote" style={{ gridColumn: "1 / -1" }}>{m.note}</div>}
                    {m.items.map((it) => (
                      <Link key={it.href} href={it.href} scroll={false} role="menuitemradio" aria-checked={it.on} className={`dditem${it.on ? " on" : ""}`} onClick={() => setOpen(null)}>
                        <span className="sq" aria-hidden="true" />
                        <span style={{ minWidth: 0, flex: "1 1 auto" }}>
                          <span style={{ display: "block" }}>{it.label}</span>
                          {it.sub && <span className="ddsub">{it.sub}</span>}
                        </span>
                        <span className="mono c">{it.count}</span>
                      </Link>
                    ))}
                  </div>
                )}
              </div>
              {i === 0 && <span style={{ fontSize: "10px", fontWeight: "700", letterSpacing: ".06em", color: "#6E7384" }} className="mono util">= SAME VOCABULARY AS THE APPLICATIONS SECTION</span>}
            </div>
          );
        })}
        <button type="button" className="fchip mobfilter" aria-expanded={open === "sheet"} onClick={() => setOpen(open === "sheet" ? null : "sheet")}>
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" aria-hidden="true"><path d="M4 7h16M7 12h10M10 17h4" /></svg>Filter{activeCount > 0 && <span className="mono cnt">{activeCount}</span>}
        </button>
        <button type="button" className={`fchip ghost${open === "more" ? " open" : ""}`} aria-expanded={open === "more"} onClick={() => setOpen(open === "more" ? null : "more")}>
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" aria-hidden="true"><path d="M4 7h16M7 12h10M10 17h4" /></svg>More filters
        </button>
        <div className="sortwrap" style={{ marginLeft: "auto", display: "flex", alignItems: "center", gap: "14px" }}>
          <span style={{ fontSize: "12.5px", fontWeight: "800", color: "#FFFFFF" }} className="mono">{count}<span style={{ color: "var(--grey-2)", fontWeight: "700" }}> {count === 1 ? "COMPANY" : "COMPANIES"}</span></span>
          {sort}
        </div>
        {open === "more" && (
          <div style={{ flexBasis: "100%", order: 9, marginTop: "6px" }}>
            <div style={{ border: "1px solid var(--line)", borderRadius: "16px", background: "var(--card)", padding: "20px 24px", boxShadow: "0 20px 40px -26px rgba(21,22,28,.4)", color: "var(--ink)" }}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: "12px", marginBottom: "16px", flexWrap: "wrap" }}>
                <span style={{ fontSize: "16px" }} className="h">More filters</span>
                <span style={{ fontSize: "12px" }} className="meta">Two coarse axes only; grades and processes are not filters</span>
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                {rows.map((r) => (
                  <div key={r.label} style={{ display: "flex", alignItems: "center", gap: "10px", flexWrap: "wrap" }}>
                    <span style={{ width: "86px", flexShrink: "0", fontSize: "10.5px", fontWeight: "800", letterSpacing: ".12em", color: "var(--grey)" }} className="mono">{r.label}</span>
                    {r.ticks.map((t) => <Link key={t.label} href={t.href} scroll={false} className={`tickchip${t.on ? " on" : ""}`}><span className="sq"></span>{t.label}<span className="c">{t.count}</span></Link>)}
                  </div>
                ))}
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: "10px", marginTop: "16px", paddingTop: "14px", borderTop: "1px solid var(--line)", flexWrap: "wrap" }}>
                <p style={{ margin: "0", fontSize: "11.5px", lineHeight: "1.5", flex: "1 1 260px" }} className="meta">Finer specifications (aperture, wire diameter, coating weight) are not filters: use search or the company profile.</p>
                <Link href={resetHref} className="chip">Reset</Link>
                <button type="button" onClick={() => setOpen(null)} style={{ minHeight: "38px", padding: "0 20px", border: "0", borderRadius: "999px", background: "var(--ink)", color: "var(--on-ink)", fontFamily: "inherit", fontSize: "13.5px", fontWeight: "800", cursor: "pointer" }}>Done</button>
              </div>
            </div>
          </div>
        )}
      </div>
      {children}
      {open === "sheet" && (
        <div className="sheetwrap" role="dialog" aria-modal="true" aria-label="Filters">
          <button type="button" className="sheetscrim" aria-label="Close" onClick={() => setOpen(null)} />
          <div className="sheet">
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: "12px", marginBottom: "14px" }}>
              <span className="h" style={{ fontSize: "18px" }}>Filters</span>
              <button type="button" onClick={() => setOpen(null)} aria-label="Close" style={{ width: "36px", height: "36px", border: "1px solid var(--line)", borderRadius: "999px", background: "var(--card)", color: "var(--ink)", fontSize: "15px", cursor: "pointer" }}>✕</button>
            </div>
            {menus.map((m) => (
              <div key={m.key} style={{ marginBottom: "14px" }}>
                <div className="mono" style={{ fontSize: "10.5px", fontWeight: 800, letterSpacing: ".12em", color: "var(--grey)", marginBottom: "8px" }}>{m.label.toUpperCase()}</div>
                <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
                  {m.items.map((it) => <Link key={it.href} href={it.href} scroll={false} className={`tickchip${it.on ? " on" : ""}`} onClick={() => setOpen(null)}><span className="sq"></span>{it.label}<span className="c">{it.count}</span></Link>)}
                </div>
              </div>
            ))}
            {rows.map((r) => (
              <div key={r.label} style={{ marginBottom: "14px" }}>
                <div className="mono" style={{ fontSize: "10.5px", fontWeight: 800, letterSpacing: ".12em", color: "var(--grey)", marginBottom: "8px" }}>{r.label}</div>
                <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
                  {r.ticks.map((t) => <Link key={t.label} href={t.href} scroll={false} className={`tickchip${t.on ? " on" : ""}`} onClick={() => setOpen(null)}><span className="sq"></span>{t.label}<span className="c">{t.count}</span></Link>)}
                </div>
              </div>
            ))}
            <div style={{ display: "flex", gap: "10px", paddingTop: "12px", borderTop: "1px solid var(--line)" }}>
              <Link href={resetHref} className="chip" onClick={() => setOpen(null)}>Reset</Link>
              <button type="button" onClick={() => setOpen(null)} style={{ flex: "1 1 auto", minHeight: "44px", border: 0, borderRadius: "999px", background: "var(--ink)", color: "var(--on-ink)", fontFamily: "inherit", fontSize: "14px", fontWeight: 800, cursor: "pointer" }}>Show {count} {count === 1 ? "company" : "companies"}</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
