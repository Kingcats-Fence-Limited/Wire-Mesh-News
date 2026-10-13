"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { search, highlight, SEARCH_INDEX, type SearchDoc, type SearchType } from "@/lib/search";
import "@/styles/board-sov.css";
import { demoBg } from "@/lib/demo";

/* SearchOv-W — full-width dropdown under the header. Esc closes and returns focus to the magnifier. */

const TRENDING = ["coating weight g/m²", "chain link vs welded mesh", "anti-dumping duty EU", "weld shear test"];
const JUMP: { label: string; href: string; icon: React.ReactNode }[] = [
  { label: "Market data", href: "/market-data/", icon: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--red-text)" strokeWidth="2" strokeLinecap="round" aria-hidden="true"><path d="M4 18V9M10 18V5M16 18v-6M22 18H2" /></svg> },
  { label: "Standards Index", href: "/standards/", icon: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--red-text)" strokeWidth="2" strokeLinejoin="round" aria-hidden="true"><path d="M12 3.2 4.8 6v5.4c0 4.3 3 7.8 7.2 9 4.2-1.2 7.2-4.7 7.2-9V6z" /></svg> },
  { label: "Company directory", href: "/directory/", icon: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--red-text)" strokeWidth="2" strokeLinejoin="round" aria-hidden="true"><path d="M4 20.5V5.5A1.5 1.5 0 0 1 5.5 4H13v16.5M13 20.5h6.5V10H13" /></svg> },
  { label: "Events calendar", href: "/events/", icon: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--red-text)" strokeWidth="2" strokeLinejoin="round" aria-hidden="true"><rect x="3" y="5" width="18" height="16" rx="2" /><path d="M3 10h18M8 3v4M16 3v4" /></svg> },
];
const TYPE_LABEL: Record<SearchType, string> = { article: "Articles", letter: "Letters", opinion: "Opinion", company: "Directory", standard: "Standards", topic: "Topics", event: "Events" };
const TP: Record<SearchType, { cls: string; label: string }> = {
  article: { cls: "art", label: "ARTICLE" },
  letter: { cls: "let", label: "LETTER" },
  opinion: { cls: "let", label: "OPINION" },
  company: { cls: "co", label: "COMPANY" },
  standard: { cls: "std", label: "STANDARD" },
  topic: { cls: "top", label: "TOPIC" },
  event: { cls: "ev", label: "EVENT" },
};
const RECENT_KEY = "wmn-recent-searches";

function useRecent() {
  const [recent, setRecent] = useState<string[]>([]);
  useEffect(() => {
    try {
      setRecent(JSON.parse(localStorage.getItem(RECENT_KEY) ?? "[]"));
    } catch {
      /* ignore */
    }
  }, []);
  const push = useCallback((q: string) => {
    setRecent((r) => {
      const next = [q, ...r.filter((x) => x !== q)].slice(0, 5);
      try {
        localStorage.setItem(RECENT_KEY, JSON.stringify(next));
      } catch {
        /* ignore */
      }
      return next;
    });
  }, []);
  const remove = useCallback((q: string) => {
    setRecent((r) => {
      const next = r.filter((x) => x !== q);
      try {
        localStorage.setItem(RECENT_KEY, JSON.stringify(next));
      } catch {
        /* ignore */
      }
      return next;
    });
  }, []);
  const clear = useCallback(() => {
    setRecent([]);
    try {
      localStorage.removeItem(RECENT_KEY);
    } catch {
      /* ignore */
    }
  }, []);
  return { recent, push, remove, clear };
}

const Mag = ({ size = 26, stroke = "var(--ink)" }: { size?: number; stroke?: string }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={stroke} strokeWidth="2.2" strokeLinecap="round" aria-hidden="true" style={{ flexShrink: 0 }}><circle cx="11" cy="11" r="7" /><path d="M16.5 16.5 21 21" /></svg>
);
const Clock = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--grey)" strokeWidth="2.2" strokeLinecap="round" aria-hidden="true" style={{ flexShrink: 0 }}><circle cx="12" cy="12" r="9" /><path d="M12 7v5.3l3.3 2" /></svg>
);

function Lead({ d }: { d: SearchDoc }) {
  const box: React.CSSProperties = { width: "48px", height: "48px", borderRadius: "9px", display: "inline-flex", alignItems: "center", justifyContent: "center", flexShrink: 0 };
  switch (d.type) {
    case "article":
      return <span className="ph" style={{ width: "64px", height: "48px", ...demoBg(d.href) }} />;
    case "company":
      return <span style={{ ...box, background: "var(--surface-dark)", color: "#FFFFFF" }}><svg width="26" height="26" viewBox="0 0 120 120" aria-hidden="true"><use href="#w1" width="120" height="120" /></svg></span>;
    case "standard":
      return <span style={{ ...box, background: "var(--st-red-bg)", color: "var(--red-deep)" }}><svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" aria-hidden="true"><path d="M12 3.2 4.8 6v5.4c0 4.3 3 7.8 7.2 9 4.2-1.2 7.2-4.7 7.2-9V6z" /><path d="m8.9 12 2.1 2.1 4.1-4.3" /></svg></span>;
    case "topic":
      return <span className="h" style={{ ...box, background: "var(--red)", color: "#FFFFFF", fontWeight: 800, fontSize: "17px" }}>T</span>;
    case "event":
      return <span style={{ ...box, background: "var(--st-current-bg)", color: "var(--up)" }}><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" aria-hidden="true"><rect x="3" y="5" width="18" height="16" rx="2" /><path d="M3 10h18M8 3v4M16 3v4" /></svg></span>;
    default:
      return <span style={{ ...box, background: "var(--st-review-bg)", color: "var(--st-review-fg)" }}><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinejoin="round" aria-hidden="true"><path d="M3 6.5h18v11H3z" /><path d="m3 7 9 6 9-6" /></svg></span>;
  }
}

export function SearchOverlay({ onClose, top = 0 }: { onClose: () => void; top?: number }) {
  const router = useRouter();
  const [q, setQ] = useState("");
  const [debounced, setDebounced] = useState("");
  const [active, setActive] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const { recent, push, remove, clear } = useRecent();

  useEffect(() => {
    inputRef.current?.focus();
    document.documentElement.style.overflow = "hidden";
    return () => {
      document.documentElement.style.overflow = "";
    };
  }, []);
  useEffect(() => {
    const t = setTimeout(() => setDebounced(q.trim()), 200);
    return () => clearTimeout(t);
  }, [q]);

  const results = useMemo(() => (debounced.length >= 2 ? search(debounced) : []), [debounced]);
  const flat = useMemo(() => {
    const order: SearchType[] = ["article", "company", "standard", "topic", "letter", "opinion", "event"];
    const out: SearchDoc[] = [];
    for (const t of order) out.push(...results.filter((r) => r.type === t).slice(0, t === "article" ? 3 : 1));
    return out.slice(0, 6);
  }, [results]);
  const counts = useMemo(() => {
    const c: Partial<Record<SearchType, number>> = {};
    for (const r of results) c[r.type] = (c[r.type] ?? 0) + 1;
    return c;
  }, [results]);
  const suggestions = useMemo(() => {
    if (debounced.length < 2) return [];
    const stem = debounced.toLowerCase();
    const seen = new Set<string>();
    const out: string[] = [];
    for (const d of SEARCH_INDEX) {
      for (const w of `${d.title} ${d.kicker}`.toLowerCase().split(/[^a-z0-9\-]+/)) {
        if (w.startsWith(stem) && w !== stem && !seen.has(w) && w.length > stem.length + 1) {
          seen.add(w);
          out.push(w);
        }
      }
      if (out.length >= 3) break;
    }
    return out;
  }, [debounced]);

  function go(href: string) {
    if (debounced) push(debounced);
    onClose();
    router.push(href);
  }
  function submitAll() {
    if (!q.trim()) return;
    go(`/search/?q=${encodeURIComponent(q.trim())}`);
  }
  function onKey(e: React.KeyboardEvent) {
    if (e.key === "Escape") onClose();
    else if (e.key === "ArrowDown") {
      e.preventDefault();
      setActive((a) => Math.min(a + 1, flat.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActive((a) => Math.max(a - 1, 0));
    } else if (e.key === "Enter") {
      e.preventDefault();
      if (flat[active]) go(flat[active].href);
      else submitAll();
    }
  }

  const empty = debounced.length < 2;
  const none = !empty && results.length === 0;
  const kbd = (s: string) => <span className="kbd">{s}</span>;

  return (
    <div className="b-sov sovroot" role="dialog" aria-modal="true" aria-label="Search" style={{ top }}>
      <button type="button" aria-label="Close search" onClick={onClose} className="sovscrim" />
      <div className="sovpanel">
        <div style={{ height: "4px", background: "var(--red)" }} />
        <div className="sovscroll">
          <div className="wrap sovbody">
            <div style={{ display: "flex", alignItems: "center", gap: "16px", paddingBottom: empty ? "20px" : "18px", borderBottom: "1px solid var(--line)" }}>
              <Mag />
              <label htmlFor="site-search" style={{ position: "absolute", width: "1px", height: "1px", overflow: "hidden", clip: "rect(0 0 0 0)" }}>Search</label>
              <input
                id="site-search"
                ref={inputRef}
                className="sq"
                value={q}
                onChange={(e) => {
                  setQ(e.target.value);
                  setActive(0);
                }}
                onKeyDown={onKey}
                placeholder="Search specs, standards, companies"
                autoComplete="off"
                role="combobox"
                aria-expanded={!empty}
                aria-controls="search-listbox"
                aria-activedescendant={flat[active] ? `sr-${flat[active].id}` : undefined}
              />
              {empty ? (
                <span className="closex" style={{ display: "flex", alignItems: "center", gap: "7px", flexShrink: 0 }}>{kbd("esc")}<span className="meta" style={{ fontSize: "12px" }}>close</span></span>
              ) : (
                <>
                  <span className="mono meta count" style={{ fontSize: "12px", fontWeight: 700, flexShrink: 0 }}>{results.length} {results.length === 1 ? "result" : "results"}</span>
                  <button type="button" aria-label="Clear" onClick={() => setQ("")} className="closex" style={{ width: "34px", height: "34px", borderRadius: "999px", background: "var(--paper)", color: "var(--slate)", display: "inline-flex", alignItems: "center", justifyContent: "center", flexShrink: 0, fontSize: "14px", border: 0, cursor: "pointer" }}>✕</button>
                </>
              )}
              <button type="button" className="cancel" onClick={onClose}>Cancel</button>
            </div>

            {empty && (
              <div className="grid3">
                <div>
                  <div className="lbl">RECENT</div>
                  {recent.length ? (
                    <>
                      {recent.map((r) => (
                        <div key={r} className="row" style={{ cursor: "default" }}>
                          <Clock />
                          <button type="button" onClick={() => setQ(r)} style={{ border: 0, background: "transparent", padding: 0, font: "inherit", fontSize: "14.5px", fontWeight: 700, color: "inherit", cursor: "pointer", textAlign: "left", flex: "1 1 auto", minWidth: 0 }}>{r}</button>
                          <button type="button" aria-label={`Remove ${r}`} onClick={() => remove(r)} style={{ marginLeft: "auto", color: "var(--grey)", fontSize: "13px", border: 0, background: "transparent", cursor: "pointer", padding: 0 }}>✕</button>
                        </div>
                      ))}
                      <button type="button" onClick={clear} style={{ border: 0, background: "transparent", padding: "10px 0 0", fontFamily: "inherit", fontSize: "12px", fontWeight: 800, color: "var(--grey)", cursor: "pointer" }}>Clear history</button>
                    </>
                  ) : (
                    <p className="meta" style={{ margin: 0, lineHeight: 1.6 }}>Your recent searches will appear here. They stay on this device and are never uploaded.</p>
                  )}
                </div>
                <div>
                  <div className="lbl">TRENDING THIS WEEK</div>
                  {TRENDING.map((t, i) => (
                    <button key={t} type="button" className="row" onClick={() => setQ(t)}>
                      <span className="h" style={{ fontSize: "13px", color: "var(--red-text)", flexShrink: 0 }}>{String(i + 1).padStart(2, "0")}</span>
                      <span style={{ fontSize: "14.5px", fontWeight: 700, lineHeight: 1.3 }}>{t}</span>
                    </button>
                  ))}
                </div>
                <div style={{ background: "var(--surface-dark)", borderRadius: "13px", padding: "20px", position: "relative", overflow: "hidden" }}>
                  <svg style={{ position: "absolute", inset: 0, width: "100%", height: "100%", color: "#262834" }} aria-hidden="true"><rect width="100%" height="100%" fill="url(#pChain)" /></svg>
                  <div style={{ position: "relative" }}>
                    <div className="lbl" style={{ color: "var(--grey-5)" }}>JUMP TO</div>
                    {JUMP.map((j) => (
                      <Link key={j.href} href={j.href} className="jump" onClick={onClose}>{j.icon}{j.label}</Link>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {!empty && !none && (
              <div className="grid2">
                <div>
                  {suggestions.length > 0 && (
                    <>
                      <div className="lbl">SUGGESTIONS</div>
                      {suggestions.map((s) => (
                        <button key={s} type="button" className="row" onClick={() => setQ(s)}>
                          <Mag size={14} stroke="var(--grey)" />
                          <span style={{ fontSize: "14.5px", fontWeight: 800 }}>{debounced.toLowerCase()}<span style={{ fontWeight: 500, color: "var(--slate)" }}>{s.slice(debounced.length)}</span></span>
                        </button>
                      ))}
                      <div style={{ height: "1px", background: "var(--line)", margin: "14px 0" }} />
                    </>
                  )}
                  <div className="lbl">FILTER AS YOU TYPE</div>
                  <div style={{ display: "flex", gap: "7px", flexWrap: "wrap" }}>
                    {(Object.keys(counts) as SearchType[]).map((t) => (
                      <button key={t} type="button" className="chip" onClick={() => go(`/search/?q=${encodeURIComponent(debounced)}&type=${t}`)}>
                        {TYPE_LABEL[t]} <span className="mono" style={{ color: "var(--grey)" }}>{counts[t]}</span>
                      </button>
                    ))}
                  </div>
                </div>
                <div id="search-listbox" role="listbox" aria-label="Top matches">
                  <div className="lbl">TOP MATCHES</div>
                  {flat.map((d, i) => {
                    const tp = TP[d.type];
                    const isArt = d.type === "article";
                    return (
                      <button
                        key={d.id}
                        id={`sr-${d.id}`}
                        type="button"
                        role="option"
                        aria-selected={i === active}
                        className={`row${i === active ? " on" : ""}`}
                        style={{ alignItems: isArt ? "flex-start" : "center", padding: "13px 12px" }}
                        onMouseEnter={() => setActive(i)}
                        onClick={() => go(d.href)}
                      >
                        <Lead d={d} />
                        <span style={{ display: "flex", flexDirection: "column", gap: "5px", minWidth: 0, flex: "1 1 auto" }}>
                          <span style={{ display: "flex", alignItems: "center", gap: "8px", minWidth: 0 }}>
                            <span className={`tp ${tp.cls}`}>{tp.label}</span>
                            {isArt ? <span className="kick"><i />{d.kicker.split(" · ").pop()?.toUpperCase()}</span> : <span className="meta" style={{ fontSize: "11.5px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", minWidth: 0, flex: "0 1 auto" }}>{d.kicker}</span>}
                          </span>
                          <span className={`h${d.type === "standard" ? " mono" : ""}`} style={{ fontSize: "17px" }} dangerouslySetInnerHTML={{ __html: highlight(d.title, debounced) }} />
                          <span className="meta" style={{ fontSize: "12px" }}>{d.meta}</span>
                        </span>
                        {i === active && <span className="kbd" style={{ flexShrink: 0 }}>↵</span>}
                      </button>
                    );
                  })}
                  <div style={{ borderTop: "1px solid var(--line)", marginTop: "12px", paddingTop: "14px" }}>
                    <button type="button" onClick={submitAll} style={{ display: "flex", alignItems: "center", gap: "10px", fontSize: "13.5px", fontWeight: 800, color: "var(--red-text)", border: 0, background: "transparent", padding: 0, fontFamily: "inherit", cursor: "pointer" }}>
                      Search all content for “{debounced}”<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6" /></svg>
                    </button>
                  </div>
                </div>
              </div>
            )}

            {none && (
              <div>
                <div style={{ display: "flex", gap: "16px", alignItems: "flex-start", padding: "22px 0 18px" }}>
                  <span style={{ width: "46px", height: "46px", borderRadius: "12px", background: "var(--paper)", display: "inline-flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="var(--grey)" strokeWidth="2.2" strokeLinecap="round" aria-hidden="true"><circle cx="11" cy="11" r="7" /><path d="M16.5 16.5 21 21" /><path d="M8.6 8.6l4.8 4.8M13.4 8.6l-4.8 4.8" /></svg>
                  </span>
                  <div>
                    <div className="h" style={{ fontSize: "20px", marginBottom: "6px" }}>Nothing matches “{debounced}”</div>
                    <p className="meta" style={{ margin: 0, lineHeight: 1.6 }}>Our content is in English. Non-English keywords, misspellings and very specific model numbers usually return nothing.</p>
                  </div>
                </div>
                <div style={{ background: "var(--paper)", borderRadius: "11px", padding: "16px 18px" }}>
                  <div className="lbl" style={{ marginBottom: "10px" }}>TRY THESE</div>
                  <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
                    {["galvanizing", "zinc coating", "coating weight", "welded mesh"].map((t) => (
                      <button key={t} type="button" className="try" onClick={() => setQ(t)}>{t}</button>
                    ))}
                  </div>
                </div>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: "14px", flexWrap: "wrap", marginTop: "16px", paddingTop: "14px", borderTop: "1px solid var(--line)" }}>
                  <span className="meta">Still can’t find it? Tell us what you were looking for.</span>
                  <Link href="/contact/?subject=editorial_tip" onClick={onClose} style={{ fontSize: "12.5px", fontWeight: 800, letterSpacing: ".06em", color: "var(--red-text)" }}>SUGGEST A TOPIC →</Link>
                </div>
              </div>
            )}
          </div>
        </div>
        <div className="sovbar">
          <div className="wrap" style={{ display: "flex", alignItems: "center", gap: "18px", flexWrap: "wrap", width: "100%" }}>
            <span style={{ display: "flex", alignItems: "center", gap: "7px" }}>{kbd("↑")}{kbd("↓")}<span className="meta" style={{ fontSize: "12px" }}>move</span></span>
            <span style={{ display: "flex", alignItems: "center", gap: "7px" }}>{kbd("↵")}<span className="meta" style={{ fontSize: "12px" }}>open</span></span>
            <span style={{ display: "flex", alignItems: "center", gap: "7px" }}>{kbd("esc")}<span className="meta" style={{ fontSize: "12px" }}>close</span></span>
            <span style={{ marginLeft: "auto", display: "flex", alignItems: "center", gap: "7px" }}>{kbd("/")}<span className="meta" style={{ fontSize: "12px" }}>{empty ? "Press slash on any page to open search" : "Results update as you type · recent searches stay on this device"}</span></span>
          </div>
        </div>
      </div>
    </div>
  );
}
