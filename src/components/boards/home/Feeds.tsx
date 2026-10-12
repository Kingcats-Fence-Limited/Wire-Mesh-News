/* Ported 1:1 from canvas Home-A two-column "Market Insights" / "Buying Guides" feeds. */
import Link from "next/link";
import type { Article } from "@/lib/content/types";
import { articleHref, fmtDateShort, subsectionLabel } from "@/lib/site";

import { demoBg } from "@/lib/demo";

const short = (a: Article) => subsectionLabel(a.section, a.subsection).replace("Cost & Quote Evaluation", "Cost & Quote").replace("Selection & Comparison", "Selection").toUpperCase();

function Lead({ a }: { a: Article }) {
  return (
    <Link href={articleHref(a)} style={{ display: "block", marginBottom: "4px" }}><span style={{ position: "relative", overflow: "hidden", background: "var(--line-2)", borderRadius: "12px", display: "block", aspectRatio: "16/9", marginBottom: "13px" }}><span aria-hidden="true" className="demo" style={{ position: "absolute", inset: 0, ...demoBg(a.slug) }} /></span><span className="kick" style={{ marginBottom: "8px" }}><i></i>{short(a)}</span><span className="h" style={{ display: "block", fontSize: "23px", lineHeight: "1.15", margin: "8px 0 8px" }}>{a.title}</span><span style={{ display: "block", fontSize: "14px", fontWeight: "500", lineHeight: "1.55", color: "var(--slate)", marginBottom: "8px" }}>{a.dek}</span><span className="mono meta" style={{ fontSize: "11.5px", fontWeight: "700" }}>{fmtDateShort(a.date)} &#183; {a.readMin} MIN</span></Link>
  );
}
function Row({ a }: { a: Article }) {
  return (
    <Link href={articleHref(a)} style={{ display: "flex", gap: "13px", alignItems: "flex-start", padding: "13px 0", borderTop: "1px solid var(--line)" }}><span style={{ flex: "1 1 auto", minWidth: "0" }}><span className="kick" style={{ marginBottom: "6px" }}><i></i>{short(a)}</span><span className="h" style={{ display: "block", fontSize: "16.5px", lineHeight: "1.25", margin: "6px 0 5px" }}>{a.title}</span><span className="mono meta" style={{ fontSize: "11px", fontWeight: "700" }}>{fmtDateShort(a.date)} &#183; {a.readMin} MIN</span></span><span style={{ width: "92px", height: "68px", borderRadius: "9px", overflow: "hidden", background: "var(--line-2)", flexShrink: "0", position: "relative", display: "block" }}><span aria-hidden="true" className="demo" style={{ position: "absolute", inset: 0, ...demoBg(a.slug) }} /></span></Link>
  );
}
function Sponsored({ a, margin }: { a: Article; margin: string }) {
  return (
    <div style={{ display: "flex", alignItems: "flex-start", gap: "13px", padding: "14px 15px 14px 13px", margin, background: "var(--paper-2)", borderLeft: "3px solid var(--red)", borderRadius: "0 10px 10px 0" }}>
<span style={{ width: "58px", height: "58px", borderRadius: "8px", background: "var(--line-2)", flexShrink: "0", position: "relative", overflow: "hidden" }}><span aria-hidden="true" className="demo" style={{ position: "absolute", inset: 0, ...demoBg(a.slug) }} /></span>
<span style={{ display: "flex", flexDirection: "column", gap: "5px", minWidth: "0" }}>
<span className="adtag">SPONSORED &#183; {a.sponsor?.toUpperCase()}</span>
<Link href={articleHref(a)} rel="sponsored" className="h" style={{ fontSize: "15.5px" }}>{a.title}</Link>
</span>
</div>
  );
}

type Col = { title: string; href: string; items: Article[]; sponsored?: Article };
export function Feeds({ left, right }: { left: Col; right: Col }) {
  const [l0, l1, ...lrest] = left.items;
  const [r0, ...rrest] = right.items;
  return (
    <>
<section className="wrap" style={{ paddingTop: "50px", paddingBottom: "46px" }}>
<div className="split" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "46px", alignItems: "start" }}>
<div>
<div className="sec" style={{ marginBottom: "18px" }}><span className="node"></span><h2 style={{ fontSize: "26px" }}>{left.title}</h2><span className="rule"></span><Link href={left.href}>ALL INSIGHTS &#8594;</Link></div>
{l0 && <Lead a={l0} />}
{l1 && <Row a={l1} />}
{left.sponsored && <Sponsored a={left.sponsored} margin="12px 0 0" />}
{lrest.slice(0, 3).map((a) => <Row key={a.slug} a={a} />)}
</div>
<div>
<div className="sec" style={{ marginBottom: "18px" }}><span className="node"></span><h2 style={{ fontSize: "26px" }}>{right.title}</h2><span className="rule"></span><Link href={right.href}>ALL GUIDES &#8594;</Link></div>
{r0 && <Lead a={r0} />}
{rrest.slice(0, 4).map((a) => <Row key={a.slug} a={a} />)}
{right.sponsored && <Sponsored a={right.sponsored} margin="13px 0 0" />}
</div>
</div>
</section>
    </>
  );
}
