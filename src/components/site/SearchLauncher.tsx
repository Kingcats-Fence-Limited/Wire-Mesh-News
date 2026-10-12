"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { clsx } from "clsx";
import { search, highlight, SEARCH_INDEX, type SearchDoc, type SearchType } from "@/lib/search";
import { SearchResultRow, TYPE_LABEL } from "./SearchResultRow";

const TRENDING = ["galvanizing thickness", "358 mesh", "anti-dumping", "EN 10223-4", "zinc price", "mill certificate"];
const JUMP: [string, string][] = [["Market data", "/market-data/"], ["Standards Index", "/standards/"], ["Company Directory", "/directory/"], ["Events calendar", "/events/"], ["Letters & Opinion", "/letters/"]];
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
      const next = [q, ...r.filter((x) => x !== q)].slice(0, 6);
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
  return { recent, push, clear };
}

/** Magnifier button in the header; opens the overlay. "/" opens it from anywhere. */
export function SearchLauncher() {
  const [open, setOpen] = useState(false);
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      const t = e.target as HTMLElement | null;
      const typing = t && (t.tagName === "INPUT" || t.tagName === "TEXTAREA" || t.isContentEditable);
      if (e.key === "/" && !typing && !open) {
        e.preventDefault();
        setOpen(true);
      }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);
  return (
    <>
      <button
        type="button"
        aria-label={open ? "Close search" : "Search"}
        aria-expanded={open}
        onClick={() => setOpen((o) => !o)}
        className="tap inline-flex items-center justify-center rounded-full border border-line text-fg transition-colors hover:border-ink"
      >
        {open ? (
          <span className="text-[15px]">✕</span>
        ) : (
          <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.3" strokeLinecap="round" aria-hidden="true"><circle cx="11" cy="11" r="7" /><path d="M16.5 16.5 21 21" /></svg>
        )}
      </button>
      {open && <SearchOverlay onClose={() => setOpen(false)} />}
    </>
  );
}

function SearchOverlay({ onClose }: { onClose: () => void }) {
  const router = useRouter();
  const [q, setQ] = useState("");
  const [debounced, setDebounced] = useState("");
  const [active, setActive] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const { recent, push, clear } = useRecent();

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
  const grouped = useMemo(() => {
    const order: SearchType[] = ["article", "standard", "company", "letter", "opinion", "topic", "event"];
    const g: { type: SearchType; items: SearchDoc[] }[] = [];
    for (const t of order) {
      const items = results.filter((r) => r.type === t).slice(0, t === "article" ? 4 : 2);
      if (items.length) g.push({ type: t, items });
    }
    return g;
  }, [results]);
  const flat = grouped.flatMap((g) => g.items);
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
      for (const w of d.title.toLowerCase().split(/[^a-z0-9\-]+/)) {
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

  return (
    <div className="fixed inset-0 z-[90] md:absolute md:inset-x-0 md:top-full md:bottom-auto" role="dialog" aria-modal="true" aria-label="Search">
      <button type="button" aria-label="Close search" onClick={onClose} className="fixed inset-0 hidden bg-ink/55 md:block" />
      <div className="relative flex h-full flex-col bg-bg md:h-auto md:max-h-[80vh] md:border-b-[3px] md:border-ink md:shadow-[0_30px_80px_rgba(21,22,28,.25)]">
        <div className="h-1 bg-red" />
        <div className="wrap flex-1 overflow-y-auto pb-5 pt-5 md:pt-7">
          <div className="flex items-center gap-3 border-b border-line pb-4 md:gap-4">
            <svg className="shrink-0" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" aria-hidden="true"><circle cx="11" cy="11" r="7" /><path d="M16.5 16.5 21 21" /></svg>
            <label htmlFor="site-search" className="sr-only">Search</label>
            <input
              id="site-search"
              ref={inputRef}
              value={q}
              onChange={(e) => {
                setQ(e.target.value);
                setActive(0);
              }}
              onKeyDown={onKey}
              placeholder="Search articles, standards, companies…"
              autoComplete="off"
              className="font-display min-w-0 flex-1 bg-transparent text-[22px] tracking-[-0.03em] outline-none placeholder:text-grey md:text-[30px]"
              role="combobox"
              aria-expanded={!empty}
              aria-controls="search-listbox"
              aria-activedescendant={flat[active] ? `sr-${flat[active].id}` : undefined}
            />
            {!empty && <span className="num meta hidden text-[12px] font-bold md:inline">{results.length} results</span>}
            <button type="button" onClick={onClose} className="shrink-0 text-[13px] font-extrabold text-red-text md:hidden">Cancel</button>
            <button type="button" aria-label="Close" onClick={onClose} className="hidden h-9 w-9 items-center justify-center rounded-full bg-paper text-slate md:inline-flex">✕</button>
          </div>

          {empty && (
            <div className="grid gap-8 pt-6 md:grid-cols-3">
              <div>
                <div className="flex items-center justify-between"><span className="kicker text-[10.5px]">Recent</span>{recent.length > 0 && <button type="button" onClick={clear} className="text-[11px] font-extrabold text-red-text">CLEAR</button>}</div>
                <div className="mt-3 flex flex-wrap gap-2">
                  {recent.length ? recent.map((r) => (
                    <button key={r} type="button" onClick={() => setQ(r)} className="inline-flex min-h-[36px] items-center rounded-full border border-line px-3.5 text-[12.5px] font-bold hover:border-ink">{r}</button>
                  )) : <span className="meta">Recent searches stay on this device only.</span>}
                </div>
              </div>
              <div>
                <span className="kicker text-[10.5px]">Trending this week</span>
                <ul className="mt-3 flex flex-col gap-2">
                  {TRENDING.map((t, i) => (
                    <li key={t}><button type="button" onClick={() => setQ(t)} className="flex items-center gap-3 text-[14px] font-bold hover:text-red-text"><span className="num text-[11px] font-extrabold text-red-text">{String(i + 1).padStart(2, "0")}</span>{t}</button></li>
                  ))}
                </ul>
              </div>
              <div className="rounded-card bg-dark p-5 text-white">
                <span className="kicker text-[10.5px] text-grey-5">Jump to</span>
                <ul className="mt-3 flex flex-col gap-2">
                  {JUMP.map(([l, h]) => (
                    <li key={h}><Link href={h} onClick={onClose} className="text-[13.5px] font-bold hover:text-red-text">{l}</Link></li>
                  ))}
                </ul>
              </div>
            </div>
          )}

          {!empty && !none && (
            <div className="grid gap-8 pt-5 md:grid-cols-[280px_1fr]">
              <div className="max-md:order-2">
                {suggestions.length > 0 && (
                  <>
                    <span className="kicker text-[10.5px]">Suggestions</span>
                    <ul className="mt-2 flex flex-col">
                      {suggestions.map((s) => (
                        <li key={s}><button type="button" onClick={() => setQ(s)} className="flex w-full items-center gap-3 rounded-lg py-2 text-left text-[14.5px] font-extrabold hover:bg-paper"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" className="text-grey" aria-hidden="true"><circle cx="11" cy="11" r="7" /><path d="M16.5 16.5 21 21" /></svg>{debounced}<span className="font-medium text-slate">{s.slice(debounced.length)}</span></button></li>
                      ))}
                    </ul>
                    <div className="my-4 h-px bg-line" />
                  </>
                )}
                <span className="kicker text-[10.5px]">Filter as you type</span>
                <div className="mt-2 flex flex-wrap gap-2">
                  {(Object.keys(counts) as SearchType[]).map((t) => (
                    <Link key={t} href={`/search/?q=${encodeURIComponent(debounced)}&type=${t}`} onClick={() => go(`/search/?q=${encodeURIComponent(debounced)}&type=${t}`)} className="inline-flex items-center gap-1.5 rounded-full border border-line px-3 py-1.5 text-[12.5px] font-bold hover:border-ink">
                      {TYPE_LABEL[t]}s <span className="num text-grey">{counts[t]}</span>
                    </Link>
                  ))}
                </div>
              </div>
              <div id="search-listbox" role="listbox" aria-label="Top matches" className="max-md:order-1">
                <span className="kicker text-[10.5px]">Top matches</span>
                <div className="mt-2 flex flex-col">
                  {flat.map((d, i) => (
                    <div key={d.id} id={`sr-${d.id}`} role="option" aria-selected={i === active} onMouseEnter={() => setActive(i)}>
                      <SearchResultRow doc={d} titleHtml={highlight(d.title, debounced)} size="sm" active={i === active} onClick={() => push(debounced)} />
                    </div>
                  ))}
                </div>
                <div className="mt-3 border-t border-line pt-3.5">
                  <button type="button" onClick={submitAll} className="inline-flex items-center gap-2 text-[13.5px] font-extrabold text-red-text">Search all content for “{debounced}” <span aria-hidden="true">→</span></button>
                </div>
              </div>
            </div>
          )}

          {none && (
            <div className="pt-6">
              <div className="flex items-start gap-4">
                <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-paper text-grey"><svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" aria-hidden="true"><circle cx="11" cy="11" r="7" /><path d="M16.5 16.5 21 21" /><path d="M8.6 8.6l4.8 4.8M13.4 8.6l-4.8 4.8" /></svg></span>
                <div>
                  <div className="font-display text-[20px]">Nothing matches “{debounced}”</div>
                  <p className="meta mt-1 leading-[1.6]">Our content is in English. Non-English keywords, misspellings and very specific model numbers usually return nothing.</p>
                </div>
              </div>
              <div className="mt-5 rounded-xl bg-paper p-4">
                <span className="kicker text-[10.5px]">Try these</span>
                <div className="mt-2.5 flex flex-wrap gap-2">
                  {["galvanizing", "zinc coating", "coating weight", "welded mesh"].map((t) => (
                    <button key={t} type="button" onClick={() => setQ(t)} className="inline-flex min-h-[36px] items-center rounded-full border border-line bg-bg px-4 text-[13px] font-extrabold hover:border-ink">{t}</button>
                  ))}
                </div>
              </div>
              <div className="mt-4 flex flex-wrap items-center justify-between gap-3 border-t border-line pt-3.5">
                <span className="meta">Still can’t find it? Tell us what you were looking for.</span>
                <Link href="/contact/?subject=editorial_tip" onClick={onClose} className="text-[12.5px] font-extrabold tracking-[0.06em] text-red-text">SUGGEST A TOPIC →</Link>
              </div>
            </div>
          )}
        </div>
        <div className="hidden items-center gap-5 border-t border-line bg-paper-2 px-8 py-2.5 md:flex">
          <span className="flex items-center gap-1.5"><Kbd>↑</Kbd><Kbd>↓</Kbd><span className="meta text-[12px]">move</span></span>
          <span className="flex items-center gap-1.5"><Kbd>↵</Kbd><span className="meta text-[12px]">open</span></span>
          <span className="flex items-center gap-1.5"><Kbd>esc</Kbd><span className="meta text-[12px]">close</span></span>
          <span className="meta ml-auto text-[12px]">Results update as you type · recent searches stay on this device</span>
        </div>
      </div>
    </div>
  );
}

function Kbd({ children }: { children: React.ReactNode }) {
  return <span className={clsx("num inline-flex h-5 min-w-5 items-center justify-center rounded-[5px] border border-line-2 border-b-2 bg-bg px-1 text-[10.5px] font-extrabold text-slate")}>{children}</span>;
}
