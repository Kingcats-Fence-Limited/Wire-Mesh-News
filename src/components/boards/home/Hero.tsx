/* Ported 1:1 from canvas board Home-A (Hero + The brief). Markup and inline styles are the canvas's; only data is injected. */
import Link from "next/link";
import type { Article } from "@/lib/content/types";
import { articleHref, fmtDateShort, subsectionLabel, sectionByCode } from "@/lib/site";
import { getAuthor } from "@/lib/content/people";
import { demoBg } from "@/lib/demo";
import { initials } from "@/lib/initials";

const PAT: Record<string, string> = { chain: "pChain", chainL: "pChainL", weld: "pWeld", weldQ: "pWeldQ", woven: "pWoven", grate: "pGrate", perf: "pPerf", exp: "pExp", g1: "pG1", g2: "pG2", g3: "pG3", g4: "pG4", g5: "pG5" };
const CYCLE = ["pPerf", "pChain", "pWoven", "pWeld", "pGrate", "pExp", "pWeldQ"];
/** Pattern id for an article: its declared mesh, else a stable pick from its slug so lists vary like the canvas. */
export const pat = (m?: string, seed = "") => (m && PAT[m]) || CYCLE[[...seed].reduce((h, c) => (h * 31 + c.charCodeAt(0)) >>> 0, 7) % CYCLE.length];

function Title({ a }: { a: Article }) {
  if (!a.highlight || !a.title.includes(a.highlight)) return <>{a.title}</>;
  const [pre, post] = a.title.split(a.highlight);
  return (
    <>
      {pre}
      <span style={{ background: "var(--red)", padding: "0 9px 4px", borderRadius: "8px", boxDecorationBreak: "clone", WebkitBoxDecorationBreak: "clone" }}>{a.highlight}</span>
      {post}
    </>
  );
}

export function Hero({ top, side, brief, date }: { top: Article; side: [Article, Article]; brief: Article[]; date: string }) {
  const author = getAuthor(top.author);
  return (
    <>
<section style={{ background: "var(--card)", borderBottom: "1px solid var(--line)" }}>
<div className="wrap" style={{ paddingTop: "26px", paddingBottom: "26px" }}>
<div className="split herosplit" style={{ display: "grid", gridTemplateColumns: "1.7fr 1fr", gridTemplateRows: "1fr 1fr", gap: "14px", minHeight: "560px" }}>
<Link href={articleHref(top)} className="herotop" style={{ gridRow: "1 / span 2", position: "relative", overflow: "hidden", borderRadius: "18px", background: "#1C1E27", display: "block", minHeight: "560px" }}>
<span aria-hidden="true" className="demo" style={{ position: "absolute", inset: 0, ...demoBg(top.slug) }} /><span style={{ position: "absolute", inset: "0", background: "linear-gradient(180deg, rgba(21,22,28,0) 35%, rgba(21,22,28,.55) 62%, rgba(21,22,28,.94) 100%)" }}></span>
<span className="herotags" style={{ position: "absolute", left: "24px", top: "22px", display: "flex", alignItems: "center", gap: "10px" }}>
<span style={{ background: "var(--red)", color: "#FFFFFF", fontSize: "10.5px", fontWeight: "800", letterSpacing: ".16em", padding: "7px 13px", borderRadius: "999px" }}>TOP STORY</span>
<span style={{ background: "rgba(21,22,28,.6)", color: "#FFFFFF", fontSize: "10.5px", fontWeight: "800", letterSpacing: ".12em", padding: "7px 11px", borderRadius: "999px", backdropFilter: "blur(4px)" }}>{sectionByCode(top.section)!.label.toUpperCase()}</span>
</span>
<span className="herofig" style={{ position: "absolute", right: "22px", top: "22px", background: "rgba(21,22,28,.6)", color: "var(--on-dark-2)", fontSize: "10px", fontWeight: "700", letterSpacing: ".06em", padding: "6px 10px", borderRadius: "999px" }}>FIG. 1 &#183; WIRE MESH NEWS</span>
<span className="herobody" style={{ position: "absolute", left: "26px", right: "26px", bottom: "24px", color: "#FFFFFF" }}>
<span className="h heroh" style={{ display: "block", fontSize: "46px", letterSpacing: "-.05em", lineHeight: "1", marginBottom: "14px", maxWidth: "620px" }}><Title a={top} /></span>
<span className="herodek" style={{ display: "block", fontSize: "16px", fontWeight: "500", lineHeight: "1.5", color: "var(--on-dark-2)", maxWidth: "560px", marginBottom: "16px" }}>{top.dek}</span>
<span style={{ display: "flex", alignItems: "center", gap: "14px", flexWrap: "wrap" }}>
<span style={{ display: "flex", alignItems: "center", gap: "9px" }}><span style={{ width: "32px", height: "32px", borderRadius: "999px", background: "var(--surface-dark-2)", color: "#FFFFFF", boxShadow: "0 0 0 2px var(--red)", flexShrink: "0", display: "inline-flex", alignItems: "center", justifyContent: "center", fontSize: "11px", fontWeight: 800, letterSpacing: "-.02em" }}>{initials(author?.name ?? "")}</span><span style={{ fontSize: "13.5px", fontWeight: "800" }}>{author?.name}</span></span>
<span className="mono" style={{ fontSize: "12px", fontWeight: "700", color: "#B9BCC6" }}>{fmtDateShort(top.date)} 2026 &#183; {top.readMin} MIN READ</span>
<span className="herocta" style={{ marginLeft: "auto", display: "inline-flex", alignItems: "center", gap: "8px", background: "var(--card)", color: "var(--ink)", fontWeight: "800", fontSize: "14px", padding: "0 20px", minHeight: "44px", borderRadius: "999px" }}>Read the story<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6" /></svg></span>
</span>
</span>
</Link>
{side.map((a) => (
<Link key={a.slug} href={articleHref(a)} className="heroside" style={{ position: "relative", overflow: "hidden", borderRadius: "16px", background: "#1C1E27", display: "block", minHeight: "272px" }}>
<span aria-hidden="true" className="demo" style={{ position: "absolute", inset: 0, ...demoBg(a.slug) }} /><span style={{ position: "absolute", inset: "0", background: "linear-gradient(180deg, rgba(21,22,28,0) 35%, rgba(21,22,28,.55) 62%, rgba(21,22,28,.94) 100%)" }}></span>
<span style={{ position: "absolute", left: "18px", top: "16px", background: "rgba(21,22,28,.6)", color: "#FFFFFF", fontSize: "10px", fontWeight: "800", letterSpacing: ".12em", padding: "6px 10px", borderRadius: "999px" }}>{sectionByCode(a.section)!.label.toUpperCase()}</span>
<span className="sidebody" style={{ position: "absolute", left: "20px", right: "20px", bottom: "18px", color: "#FFFFFF" }}>
<span className="h sideh" style={{ display: "block", fontSize: "22px", lineHeight: "1.12", marginBottom: "8px" }}>{a.title}</span>
<span className="mono" style={{ fontSize: "11px", fontWeight: "700", color: "#B9BCC6" }}>{subsectionLabel(a.section, a.subsection).toUpperCase()} &#183; {a.readMin} MIN</span>
</span>
</Link>
))}
</div>
<div className="brief" style={{ marginTop: "22px", borderTop: "2px solid var(--ink)", display: "grid", gridTemplateColumns: "184px repeat(4, 1fr)" }}>
<div className="briefhead" style={{ padding: "16px 22px 14px 0", display: "flex", flexDirection: "column", justifyContent: "center" }}>
<div style={{ display: "inline-flex", alignItems: "center", gap: "8px", marginBottom: "5px" }}><span style={{ width: "7px", height: "7px", borderRadius: "999px", background: "var(--red)" }}></span><span className="h" style={{ fontSize: "19px" }}>The brief</span></div>
<div className="mono" style={{ fontSize: "10.5px", fontWeight: "800", letterSpacing: ".12em", color: "var(--grey)" }}>{brief.length} THINGS &#183; {date}</div>
<Link href="/subscribe/" style={{ fontSize: "11.5px", fontWeight: "800", letterSpacing: ".08em", color: "var(--red-text)", marginTop: "7px" }}>BY EMAIL &#8594;</Link>
</div>
{brief.map((a, i) => (
<Link key={a.slug} href={articleHref(a)} className="briefcell" style={{ borderColor: "var(--line)" }}><span className="num" style={{ fontSize: "15px", color: "var(--red-text)", flexShrink: "0", paddingTop: "2px" }}>{String(i + 1).padStart(2, "0")}</span><span><span style={{ display: "block", fontSize: "14.5px", fontWeight: "800", lineHeight: "1.34", marginBottom: "5px" }}>{a.title}</span><span className="mono" style={{ fontSize: "10.5px", fontWeight: "700", letterSpacing: ".08em", color: "var(--grey)" }}>{subsectionLabel(a.section, a.subsection).split(" ")[0].toUpperCase()} &#183; {a.readMin} MIN</span></span></Link>
))}
</div>
</div>
</section>
    </>
  );
}
