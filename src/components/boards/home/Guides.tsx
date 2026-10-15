/* Ported 1:1 from canvas Home-A "Technical Guides": three numbered cards + six-row list. */
import Link from "next/link";
import type { Article } from "@/lib/content/types";
import { articleHref, subsectionLabel } from "@/lib/site";

import { demoBg } from "@/lib/demo";

const short = (a: Article) => subsectionLabel(a.section, a.subsection).replace("Specifications & Tolerances", "Specifications").replace("Manufacturing Processes", "Manufacturing").replace("Installation & Maintenance", "Installation").toUpperCase();

export function Guides({ cards, list }: { cards: Article[]; list: Article[] }) {
  return (
    <>
<section style={{ background: "var(--paper)", padding: "50px 0" }}>
<div className="wrap">
<div className="sec"><span className="node"></span><h2>Technical Guides</h2><span className="rule"></span><Link href="/technical-guides/">ALL GUIDES &#8594;</Link></div>
<div className="g3" style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "20px" }}>
{cards.slice(0, 3).map((a, i) => (
<Link key={a.slug} href={articleHref(a)} style={{ background: "var(--card)", borderRadius: "16px", overflow: "hidden", display: "flex", flexDirection: "column", minHeight: "300px" }}>
<div style={{ height: "6px", background: i === 0 ? "var(--red)" : "var(--ink)" }}></div>
<span style={{ position: "relative", overflow: "hidden", background: "var(--line-2)", display: "block", aspectRatio: "16/7" }}><span aria-hidden="true" className="demo" style={{ position: "absolute", inset: 0, ...demoBg(a.slug, 0, "md") }} /></span>
<div style={{ padding: "20px 22px 22px", display: "flex", flexDirection: "column", gap: "10px", flex: "1 1 auto" }}>
<div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between" }}><span className="h gnum" aria-hidden="true" data-n={String(i + 1).padStart(2, "0")} style={{ fontSize: "46px", color: "var(--line-soft)", lineHeight: "1" }} /><span className="mono meta" style={{ fontSize: "11px", fontWeight: "800" }}>{a.readMin} MIN</span></div>
<span className="kick"><i></i>{short(a)}</span>
<span className="h" style={{ fontSize: "21px" }}>{a.title}</span>
<span style={{ fontSize: "13.5px", fontWeight: "500", lineHeight: "1.55", color: "var(--slate)" }}>{a.dek}</span>
</div>
</Link>
))}
</div>
<div className="g2" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0 46px", marginTop: "10px" }}>
{list.slice(0, 6).map((a) => (
<Link key={a.slug} href={articleHref(a)} style={{ display: "flex", gap: "13px", alignItems: "flex-start", padding: "13px 0", borderTop: "1px solid var(--line)" }}><span style={{ flex: "1 1 auto", minWidth: "0" }}><span className="kick" style={{ marginBottom: "6px" }}><i></i>{short(a)}</span><span className="h" style={{ display: "block", fontSize: "16.5px", lineHeight: "1.25", margin: "6px 0 5px" }}>{a.title}</span><span className="mono meta" style={{ fontSize: "11px", fontWeight: "700" }}>{a.readMin} MIN</span></span><span style={{ width: "92px", height: "68px", borderRadius: "9px", overflow: "hidden", background: "var(--line-2)", flexShrink: "0", position: "relative", display: "block" }}><span aria-hidden="true" className="demo" style={{ position: "absolute", inset: 0, ...demoBg(a.slug) }} /></span></Link>
))}
</div>
</div>
</section>
    </>
  );
}
