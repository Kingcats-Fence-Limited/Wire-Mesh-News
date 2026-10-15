"use client";

import Link from "next/link";
import { useState } from "react";
import { demoBg } from "@/lib/demo";
import { PageHeadArt, HEAD_ART } from "@/components/shell/PageHeadArt";

export type ListItem = { slug: string; href: string; kicker: string; title: string; dek: string; date: string; iso: string; readMin: number; author: string; views: number; pick: boolean; sponsor?: string };
export type SeriesBox = { title: string; href: string; parts: { n: number; title: string; href: string }[] };

const Row = ({ it }: { it: ListItem }) => (
  <Link href={it.href} style={{ display: "flex", flexDirection: "column", gap: "8px", padding: "20px 0", borderBottom: "1px solid var(--line)" }}>
<span className="kick"><i></i>{it.kicker}</span>
<span style={{ fontSize: "19px" }} className="h">{it.title}</span>
<span style={{ fontSize: "11.5px", fontWeight: "700" }} className="mono meta">{it.date} &#183; {it.readMin} MIN</span>
  </Link>
);

/* Category-B list: sort chips, first item large, then two-column rows, sponsored card after 5, series box mid-list, pagination. */
export function CategoryList({ heading, items, sponsored, series, perPage = 12 }: { heading: string; items: ListItem[]; sponsored?: ListItem; series?: SeriesBox; perPage?: number }) {
  const [sort, setSort] = useState<"latest" | "read" | "pick">("latest");
  const [page, setPage] = useState(1);
  const sorted = [...items].sort((a, b) => (sort === "read" ? b.views - a.views : sort === "pick" ? Number(b.pick) - Number(a.pick) || (a.iso < b.iso ? 1 : -1) : a.iso < b.iso ? 1 : -1));
  const pages = Math.max(1, Math.ceil(sorted.length / perPage));
  const slice = sorted.slice((page - 1) * perPage, page * perPage);
  const [first, ...rest] = slice;
  const firstBlock = rest.slice(0, 4), lastBlock = rest.slice(4);
  return (
    <>
<div className="sec"><h2>{heading}</h2><span className="rule"></span>
<span style={{ display: "flex", gap: "7px", flexShrink: "0" }} className="sorts">
{([["latest", "Latest"], ["read", "Most read"], ["pick", "Editors' pick"]] as const).filter(([k]) => k !== "read" || items.some((i) => i.views > 0)).map(([k, l]) => (
<button key={k} type="button" aria-pressed={sort === k} onClick={() => { setSort(k); setPage(1); }} style={{ minHeight: "36px", fontSize: "12.5px" }} className={`chip${sort === k ? " on" : ""}`}>{l}</button>
))}
</span>
</div>
{first && (
<Link href={first.href} className="lead" style={{ display: "grid", gridTemplateColumns: "250px minmax(0,1fr)", gap: "22px", paddingBottom: "24px", borderBottom: "1px solid var(--line)" }}>
<span style={{ aspectRatio: "4/3", ...demoBg(first.slug, 0, "md") }} className="ph"></span>
<span style={{ display: "flex", flexDirection: "column", gap: "9px" }}>
<span className="kick"><i></i>{first.kicker}</span>
<span style={{ fontSize: "24px" }} className="h">{first.title}</span>
<span style={{ fontSize: "14.5px", fontWeight: "500", lineHeight: "1.55", color: "var(--slate)" }}>{first.dek}</span>
<span style={{ fontSize: "11.5px", fontWeight: "700" }} className="mono meta">{first.date} &#183; {first.readMin} MIN &#183; {first.author.toUpperCase()}</span>
</span>
</Link>
)}
<div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0 36px", paddingTop: "6px" }} className="g2">
{firstBlock.map((it) => <Row key={it.slug} it={it} />)}
</div>
{sponsored && (
<div style={{ display: "flex", alignItems: "flex-start", gap: "13px", padding: "14px 15px 14px 13px", margin: "6px 0 18px", background: "var(--paper-2)", borderLeft: "3px solid var(--red)", borderRadius: "0 10px 10px 0" }}>
<span style={{ width: "58px", height: "58px", borderRadius: "8px", flexShrink: "0", ...demoBg(sponsored.slug) }} className="ph"></span>
<span style={{ display: "flex", flexDirection: "column", gap: "5px", minWidth: "0" }}>
<span className="adtag">SPONSORED &#183; {sponsored.sponsor?.toUpperCase()}</span>
<Link href={sponsored.href} rel="sponsored" style={{ fontSize: "15.5px" }} className="h">{sponsored.title}</Link>
</span>
</div>
)}
{series && series.parts.length > 0 && (
<div style={{ background: "var(--surface-dark)", color: "#FFFFFF", borderRadius: "16px", padding: "26px 28px", margin: "28px 0", position: "relative", overflow: "hidden" }}>
<PageHeadArt src={HEAD_ART.panels} />
<div style={{ position: "relative" }}>
<div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: "14px", flexWrap: "wrap", marginBottom: "16px" }}>
<div><span style={{ background: "var(--red)", color: "#FFFFFF", fontSize: "10px", fontWeight: "800", letterSpacing: ".15em", padding: "5px 11px", borderRadius: "999px", display: "inline-block", marginBottom: "9px" }}>SERIES</span><div style={{ fontSize: "23px", color: "#FFFFFF" }} className="h">{series.title}</div></div>
<Link href={series.href} style={{ fontSize: "11.5px", fontWeight: "800", letterSpacing: ".1em", color: "#FF4A54" }}>ALL {series.parts.length} PARTS &#8594;</Link>
</div>
<div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "12px" }} className="g3">
{series.parts.slice(0, 3).map((p) => (
<Link key={p.n} href={p.href} style={{ background: "rgba(255,255,255,.07)", borderRadius: "10px", padding: "14px 16px", color: "#FFFFFF", display: "flex", flexDirection: "column", gap: "6px" }}><span style={{ fontSize: "11px", fontWeight: "800", color: "#FF4A54" }} className="mono">PART {p.n}</span><span style={{ fontSize: "14.5px", fontWeight: "800", lineHeight: "1.3" }}>{p.title}</span></Link>
))}
</div>
</div>
</div>
)}
<div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0 36px" }} className="g2">
{lastBlock.map((it) => <Row key={it.slug} it={it} />)}
</div>
{pages > 1 && (
<nav aria-label="Pagination" style={{ display: "flex", gap: "8px", alignItems: "center", paddingTop: "28px" }}>
{Array.from({ length: pages }, (_, i) => i + 1).map((n) => n === page
  ? <span key={n} style={{ minWidth: "44px", justifyContent: "center" }} className="chip on">{n}</span>
  : <button key={n} type="button" onClick={() => setPage(n)} style={{ minWidth: "44px", justifyContent: "center" }} className="chip">{n}</button>)}
{page < pages && <button type="button" onClick={() => setPage(page + 1)} className="chip">Next &#8594;</button>}
</nav>
)}
    </>
  );
}
