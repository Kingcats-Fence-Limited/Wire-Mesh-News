/* Ported 1:1 from canvas Home-A "Latest" three-column block. */
import Link from "next/link";
import type { Article } from "@/lib/content/types";
import { articleHref, fmtDateShort, subsectionLabel } from "@/lib/site";

import { demoBg } from "@/lib/demo";

type Change = { no: string; slug: string; text: string; status: string };

function Thumb({ a, w, h, ratio }: { a: Article; w?: string; h?: string; ratio?: string }) {
  return (
    <span className={ratio ? "latthumb" : undefined} style={{ position: "relative", overflow: "hidden", background: "var(--line-2)", borderRadius: "10px", display: "block", flexShrink: "0", width: w, height: h, aspectRatio: ratio, marginBottom: ratio ? "13px" : undefined }}>
      <span aria-hidden="true" className="demo" style={{ position: "absolute", inset: 0, ...demoBg(a.slug, 0, "md") }} />
    </span>
  );
}
const K = ({ a }: { a: Article }) => <span className="kick" style={{ marginBottom: "7px" }}><i></i>{subsectionLabel(a.section, a.subsection).toUpperCase()}</span>;
const D = ({ a, mins = true }: { a: Article; mins?: boolean }) => <span className="mono meta" style={{ fontSize: "11.5px", fontWeight: "700" }}>{fmtDateShort(a.date)}{mins ? <> &#183; {a.readMin} MIN</> : null}</span>;

function Big({ a, size = 23, ratio = "4/3", last }: { a: Article; size?: number; ratio?: string; last?: boolean }) {
  return (
    <Link href={articleHref(a)} className="latbig" style={{ display: "block", marginBottom: last ? 0 : "16px", paddingBottom: last ? 0 : "16px", borderBottom: last ? undefined : "1px solid var(--line)" }}>
      <Thumb a={a} ratio={ratio} />
      <span className="lattext" style={{ display: "block" }}>
      <K a={a} />
      <span className="h lath" style={{ display: "block", fontSize: `${size}px`, marginBottom: "9px", marginTop: "9px" }}>{a.title}</span>
      <span className="latdek" style={{ display: "block", fontSize: size > 20 ? "14px" : "13.5px", fontWeight: "500", lineHeight: "1.55", color: "var(--slate)", marginBottom: "9px" }}>{a.dek}</span>
      <D a={a} />
      </span>
    </Link>
  );
}
function Row({ a, last }: { a: Article; last?: boolean }) {
  return (
    <Link href={articleHref(a)} className="latrow" style={{ display: "flex", gap: "13px", paddingTop: "16px", borderTop: "1px solid var(--line)", marginBottom: last ? 0 : "16px" }}>
      <span style={{ flex: "1 1 auto", minWidth: "0" }}><K a={a} />
        <span className="h" style={{ display: "block", fontSize: "17px", margin: "7px 0 6px" }}>{a.title}</span>
        <D a={a} mins={false} /></span>
      <Thumb a={a} w="96px" h="72px" />
    </Link>
  );
}

const TONE: Record<string, [string, string, string]> = { current: ["var(--st-withdrawn-bg)", "var(--slate)", "NO CHANGE"], under_review: ["var(--st-review-bg)", "var(--st-review-fg)", "REVIEW"], withdrawn: ["var(--st-withdrawn-bg)", "var(--slate)", "WITHDRAWN"], draft: ["var(--st-red-bg)", "var(--red-deep)", "DRAFT"] };

export function Latest({ items, sponsored, changes, mostRead, standardsCount }: { items: Article[]; sponsored?: Article; changes: Change[]; mostRead: Article[]; standardsCount: number }) {
  const [a1, a2, b1, b2, ...rest] = items;
  return (
    <>
<section className="wrap" style={{ paddingTop: "44px", paddingBottom: "44px" }}>
<div className="sec"><span className="node"></span><h2>Latest</h2><span className="rule"></span><Link href="/news/">ALL NEWS &#8594;</Link></div>
<div className="col3">
<div>
{a1 && <Big a={a1} />}
{a2 && <Row a={a2} />}
{rest[0] && <Row a={rest[0]} last />}
</div>
<div>
{b1 && <Big a={b1} size={20} ratio="16/10" />}
{b2 && <Row a={b2} />}
{sponsored && (
<div style={{ display: "flex", alignItems: "flex-start", gap: "13px", padding: "15px 15px 15px 13px", background: "var(--paper-2)", borderLeft: "3px solid var(--red)", borderRadius: "0 10px 10px 0" }}>
<span style={{ width: "58px", height: "58px", borderRadius: "8px", background: "var(--line-2)", flexShrink: "0", position: "relative", overflow: "hidden" }}><span aria-hidden="true" className="demo" style={{ position: "absolute", inset: 0, ...demoBg(sponsored.slug) }} /></span>
<span style={{ display: "flex", flexDirection: "column", gap: "5px", minWidth: "0" }}>
<span className="adtag">SPONSORED &#183; {sponsored.sponsor?.toUpperCase()}</span>
<Link href={articleHref(sponsored)} rel="sponsored" className="h" style={{ fontSize: "15.5px" }}>{sponsored.title}</Link>
</span>
</div>
)}
</div>
<div>
<div style={{ background: "var(--paper)", borderRadius: "14px", padding: "20px", marginBottom: "18px" }}>
<div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "4px" }}><span className="h" style={{ fontSize: "16px" }}>STANDARDS WATCH</span><Link href="/standards/" style={{ fontSize: "10.5px", fontWeight: "800", letterSpacing: ".1em", color: "var(--red-text)" }}>INDEX &#8594;</Link></div><p className="meta" style={{ margin: "0 0 12px", fontSize: "11px" }}>All {standardsCount} standards we track live in the Standards Index</p>
{changes.map((c) => {
  const [bg, fg, label] = TONE[c.status] ?? TONE.current;
  return (
<Link key={c.no + c.text} href={`/standards/${c.slug}/`} style={{ display: "flex", alignItems: "center", gap: "10px", padding: "10px 0", borderTop: "1px solid var(--ph)" }}><span className="mono" style={{ fontSize: "12px", fontWeight: "800", flex: "0 0 88px" }}>{c.no}</span><span style={{ fontSize: "13px", fontWeight: "500", flex: "1 1 auto", lineHeight: "1.3" }}>{c.text.length > 48 ? c.text.slice(0, 46).replace(/\s\S*$/, "") + "…" : c.text}</span><span style={{ background: bg, color: fg, fontSize: "9px", fontWeight: "800", letterSpacing: ".1em", padding: "4px 7px", borderRadius: "3px", flexShrink: "0" }}>{label}</span></Link>
  );
})}
</div>
<div style={{ marginBottom: "18px" }}>
<div className="h" style={{ fontSize: "16px", marginBottom: "13px" }}>MOST READ</div>
{mostRead.map((a, i) => (
<Link key={a.slug} href={articleHref(a)} style={{ display: "flex", alignItems: "center", gap: "11px", padding: "10px 0", borderTop: "1px solid var(--line)" }}><span className="h" style={{ fontSize: "13px", color: "var(--red-text)", flexShrink: "0" }}>{String(i + 1).padStart(2, "0")}</span><span style={{ fontSize: "14px", fontWeight: "700", lineHeight: "1.35", flex: "1 1 auto", minWidth: "0" }}>{a.title}</span><Thumb a={a} w="52px" h="42px" /></Link>
))}
</div>
<div><div className="adtag" style={{ marginBottom: "7px" }}>ADVERTISEMENT</div><div className="ad" style={{ aspectRatio: "6/5" }}>[ 300 &#215; 250 ]</div></div>
</div>
</div>
</section>
    </>
  );
}

export function InNumbers({ figures }: { figures: { value: string; unit?: string; label: string; source: string; href?: string }[] }) {
  return (
    <>
<section style={{ background: "var(--paper)", borderBottom: "1px solid var(--line)" }}>
<div className="wrap" style={{ paddingTop: "34px", paddingBottom: "34px" }}>
<div style={{ display: "flex", alignItems: "baseline", gap: "14px", marginBottom: "22px" }}>
<span className="h" style={{ fontSize: "15px", letterSpacing: ".08em" }}>THE INDEX IN NUMBERS</span>
<span style={{ flex: "1 1 0", height: "2px", background: "var(--ink)" }}></span>
<span className="mono" style={{ fontSize: "10.5px", fontWeight: "800", letterSpacing: ".1em", color: "var(--grey)" }}>COUNTED FROM OUR OWN PAGES &#183; OPEN ANY FIGURE TO CHECK IT</span>
</div>
<div className="fignum" style={{ display: "flex" }}>
{figures.map((f) => {
  const inner = (
    <>
<div className="h mono fignumv" style={{ fontSize: "54px", lineHeight: "1" }}>{f.value}{f.unit && <span style={{ fontSize: f.unit.length > 2 ? "22px" : "24px", color: "var(--red-text)" }}>{f.unit}</span>}</div>
<div style={{ fontSize: "14px", fontWeight: "800", margin: "8px 0 5px" }}>{f.label}</div>
<div className="mono" style={{ fontSize: "10.5px", fontWeight: "700", letterSpacing: ".08em", color: "var(--grey)" }}>{f.source}</div>
    </>
  );
  return f.href
    ? <Link key={f.label} href={f.href} className="figcol figlink">{inner}</Link>
    : <div key={f.label} className="figcol">{inner}</div>;
})}
</div>
</div>
</section>
    </>
  );
}
