"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { clsx } from "clsx";
import { search, snippet, highlight, type SearchType } from "@/lib/search";
import { SearchResultRow, TYPE_LABEL } from "./SearchResultRow";
import { Badge, Chip } from "@/components/ui/Primitives";
import { EDITORIAL_SECTIONS } from "@/lib/site";

const TYPES: (SearchType | "all")[] = ["all", "article", "letter", "company", "standard", "topic", "event"];
const PAGE = 20;

export function SearchResults() {
  const sp = useSearchParams();
  const router = useRouter();
  const q = sp.get("q") ?? "";
  const type = (sp.get("type") as SearchType | "all") || "all";
  const section = sp.get("section") ?? "all";
  const page = Math.max(1, Number(sp.get("page") ?? 1));
  const [draft, setDraft] = useState(q);

  const all = useMemo(() => search(q), [q]);
  const results = useMemo(() => search(q, { type, section }), [q, type, section]);
  const counts = useMemo(() => {
    const c: Record<string, number> = { all: all.length };
    for (const r of all) c[r.type] = (c[r.type] ?? 0) + 1;
    return c;
  }, [all]);
  const sectionCounts = useMemo(() => {
    const c: Record<string, number> = {};
    for (const r of all) if (r.section) c[r.section] = (c[r.section] ?? 0) + 1;
    return c;
  }, [all]);

  const set = (patch: Record<string, string | null>) => {
    const p = new URLSearchParams(sp.toString());
    for (const [k, v] of Object.entries(patch)) {
      if (v) p.set(k, v);
      else p.delete(k);
    }
    if (!("page" in patch)) p.delete("page");
    router.push(`/search/?${p.toString()}`);
  };
  const pageItems = results.slice((page - 1) * PAGE, page * PAGE);
  const pages = Math.max(1, Math.ceil(results.length / PAGE));
  const filtered = type !== "all" || section !== "all";

  return (
    <div className="wrap pt-6">
      <form
        onSubmit={(e) => {
          e.preventDefault();
          set({ q: draft.trim() || null, type: null, section: null });
        }}
        className="flex min-h-[56px] items-center gap-3 rounded-full border-2 border-ink px-5 dark:border-white"
        role="search"
      >
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.3" strokeLinecap="round" aria-hidden="true"><circle cx="11" cy="11" r="7" /><path d="M16.5 16.5 21 21" /></svg>
        <label htmlFor="q" className="sr-only">Search</label>
        <input id="q" type="search" value={draft} onChange={(e) => setDraft(e.target.value)} placeholder="Search articles, standards, companies…" className="min-w-0 flex-1 bg-transparent text-[17px] font-medium outline-none" />
        {draft && <button type="button" aria-label="Clear" onClick={() => setDraft("")} className="h-8 w-8 rounded-full bg-paper text-slate">✕</button>}
        <button type="submit" className="inline-flex min-h-[42px] items-center rounded-full bg-ink px-5 text-[14px] font-extrabold text-white dark:bg-white dark:text-ink">Search</button>
      </form>

      <div className="mt-4 flex flex-wrap items-center gap-2">
        <span className="kicker mr-1 w-16 text-[10.5px]">Type</span>
        {TYPES.map((t) => <Chip key={t} active={type === t} size="sm" count={counts[t] ?? 0} onClick={() => set({ type: t === "all" ? null : t })}>{t === "all" ? "All" : `${TYPE_LABEL[t]}s`}</Chip>)}
      </div>
      <div className="mt-2 flex flex-wrap items-center gap-2">
        <span className="kicker mr-1 w-16 text-[10.5px]">Section</span>
        <Chip active={section === "all"} size="sm" onClick={() => set({ section: null })}>All</Chip>
        {EDITORIAL_SECTIONS.map((s) => <Chip key={s.code} active={section === s.code} size="sm" count={sectionCounts[s.code] ?? 0} onClick={() => set({ section: s.code })}>{s.label}</Chip>)}
      </div>

      <div className="mt-6 grid gap-10 lg:grid-cols-[minmax(0,1fr)_290px]">
        <div>
          {!q && (
            <div className="rounded-card bg-paper p-6">
              <div className="font-display text-[18px]">Search the whole site</div>
              <p className="meta mt-1 leading-[1.6]">Articles, letters, companies, standards, topics and events share one index. Market prices are not in search — they live on the <Link href="/market-data/" className="font-extrabold text-red-text">Market data</Link> page.</p>
            </div>
          )}
          {q && results.length > 0 && (
            <>
              <div className="flex items-baseline justify-between border-b-[3px] border-ink pb-2.5 dark:border-line-2">
                <span className="num text-[14.5px] font-bold text-slate"><b className="text-fg">{results.length} results</b> for “{q}”</span>
                {filtered && <button type="button" onClick={() => set({ type: null, section: null })} className="text-[12px] font-extrabold tracking-[0.06em] text-red-text">CLEAR FILTERS</button>}
              </div>
              {pageItems.map((d) => <SearchResultRow key={d.id} doc={d} titleHtml={highlight(d.title, q)} snippetHtml={snippet(d, q)} />)}
              <nav aria-label="Pagination" className="mt-5 flex items-center gap-2">
                {Array.from({ length: pages }, (_, i) => i + 1).map((n) => <button key={n} type="button" onClick={() => set({ page: String(n) })} className={clsx("inline-flex min-h-[38px] min-w-[42px] items-center justify-center rounded-full border text-[13.5px] font-bold", n === page ? "border-ink bg-ink text-white dark:border-white dark:bg-white dark:text-ink" : "border-line")}>{n}</button>)}
                <span className="meta ml-auto text-[12px]">{PAGE} per page · URL carries q, type, section, page</span>
              </nav>
            </>
          )}
          {q && results.length === 0 && (
            <div>
              <div className="flex items-start gap-4">
                <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-paper text-grey"><svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" aria-hidden="true"><circle cx="11" cy="11" r="7" /><path d="M16.5 16.5 21 21" /><path d="M8.6 8.6l4.8 4.8M13.4 8.6l-4.8 4.8" /></svg></span>
                <div><h2 className="font-display text-[26px]">No results for “{q}”</h2><p className="mt-1 max-w-[560px] text-[15px] font-medium leading-[1.6] text-slate">Nothing matches with the current filters. Our content is in English, so non-English keywords usually return nothing.</p></div>
              </div>
              <div className="mt-5 grid gap-4 md:grid-cols-2">
                <div className="rounded-card bg-paper p-5"><div className="kicker text-[10.5px]">Try instead</div><div className="mt-2.5 flex flex-wrap gap-2">{["galvanizing thickness", "coating weight", "zinc coating", "welded mesh"].map((t) => <button key={t} type="button" onClick={() => { setDraft(t); set({ q: t, type: null, section: null }); }} className="inline-flex min-h-[34px] items-center rounded-full border border-line bg-bg px-3.5 text-[12.5px] font-extrabold hover:border-ink">{t}</button>)}</div></div>
                <div className="rounded-card bg-paper p-5"><div className="kicker text-[10.5px]">Widen the search</div><div className="mt-2.5 flex flex-col gap-2 text-[13.5px] font-bold">
                  {type !== "all" && <button type="button" onClick={() => set({ type: null })} className="flex justify-between text-left"><span>All types</span><span className="meta">{search(q, { section }).length} results →</span></button>}
                  {section !== "all" && <button type="button" onClick={() => set({ section: null })} className="flex justify-between text-left"><span>All sections</span><span className="meta">{search(q, { type }).length} results →</span></button>}
                  {!filtered && <span className="meta">No filters are applied. Try a shorter or more general term.</span>}
                </div></div>
              </div>
              <div className="mt-5 flex flex-wrap items-center justify-between gap-3 border-t border-line pt-4"><span className="meta">Still nothing? Tell us what you were looking for — if it is worth a guide, we will write it.</span><Link href="/contact/?subject=editorial_tip" className="text-[12.5px] font-extrabold tracking-[0.06em] text-red-text">SUGGEST A TOPIC →</Link></div>
            </div>
          )}
        </div>
        <aside className="flex flex-col gap-5">
          <div className="rounded-card border border-line p-5">
            <div className="font-display mb-3 text-[16px]">Results by type</div>
            <ul className="flex flex-col gap-2.5">
              {TYPES.filter((t) => t !== "all").map((t) => <li key={t}><button type="button" onClick={() => set({ type: t })} className="flex w-full items-center justify-between text-[14px] font-bold hover:text-red-text"><span className="flex items-center gap-2"><Badge tone={t as never} size="sm">{TYPE_LABEL[t as SearchType]}</Badge>{TYPE_LABEL[t as SearchType]}s</span><span className="num text-grey">{counts[t] ?? 0}</span></button></li>)}
            </ul>
          </div>
          <div className="rounded-card border border-line p-5">
            <div className="font-display mb-3 text-[16px]">Related searches</div>
            <div className="flex flex-wrap gap-2">{["coating weight", "zinc g/m²", "EN 10244", "PVC coated", "358 mesh"].map((t) => <button key={t} type="button" onClick={() => { setDraft(t); set({ q: t, type: null, section: null }); }} className="inline-flex min-h-[34px] items-center rounded-full border border-line px-3.5 text-[12.5px] font-bold hover:border-ink">{t}</button>)}</div>
          </div>
          <div className="rounded-card bg-paper p-5"><div className="font-display text-[14px]">Looking for a price?</div><p className="meta mt-1 mb-2 leading-[1.5]">Prices are not in search. Licensed market series live on one page.</p><Link href="/market-data/" className="text-[12px] font-extrabold tracking-[0.06em] text-red-text">MARKET DATA →</Link></div>
        </aside>
      </div>
    </div>
  );
}
