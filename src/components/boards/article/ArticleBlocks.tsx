/* Article-C body blocks: markup and inline styles follow the canvas. Renders blocks that were
   prepared on the server (src/lib/article-prepare.ts: HTML sanitised, standards linked), so
   the same component draws the static page and a Pro article unlocked in the browser. */
import Link from "next/link";
import type { PreparedBlock } from "@/lib/article-prepare";

const PAT: Record<string, string> = { chain: "pChain", chainL: "pChainL", weld: "pWeld", weldQ: "pWeldQ", woven: "pWoven", grate: "pGrate", perf: "pPerf", exp: "pExp" };

export function ArticleBlocks({ blocks, showAd }: { blocks: PreparedBlock[]; showAd: boolean }) {
  let h = 0, fig = 1, firstP = true, adDone = false;
  return (
    <>
      {blocks.map((b, i) => {
        switch (b.type) {
          case "p": {
            let html = b.html;
            if (firstP) { firstP = false; html = html.replace(/^(<[^>]+>)*([A-Za-z])/, (m, _t, c) => m.slice(0, m.length - 1) + `<span class="dropcap">${c}</span>`); }
            return <p key={i} dangerouslySetInnerHTML={{ __html: html }} />;
          }
          case "h2": {
            h += 1;
            const ad = showAd && !adDone && h === 3;
            if (ad) adDone = true;
            return (
              <div key={i}>
                {ad && (
                  <div style={{ margin: "34px 0 32px" }} className="noprint" data-ad>
                    <div style={{ fontSize: "10px", fontWeight: "800", letterSpacing: ".18em", color: "var(--grey)", marginBottom: "7px" }}>ADVERTISEMENT</div>
                    <div style={{ height: "180px", border: "1px solid var(--line)", borderRadius: "12px", background: "var(--paper-2)", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: "5px", color: "var(--grey)" }}><span style={{ fontSize: "13px", fontWeight: "700" }}>580 × 180 IN-ARTICLE</span></div>
                  </div>
                )}
                <h2 id={b.id} className="h"><span className="no">{String(h).padStart(2, "0")}</span>{b.text.replace(/^\d+\s*[·.\-–]\s*/, "")}</h2>
              </div>
            );
          }
          case "ul":
            return <ul key={i}>{b.items.map((it, j) => <li key={j} dangerouslySetInnerHTML={{ __html: it }} />)}</ul>;
          case "quote":
            return (
              <div key={i} style={{ display: "flex", gap: "20px", margin: "34px 0 36px", padding: "2px 0" }}>
                <span style={{ fontSize: "72px", lineHeight: ".62", color: "var(--red-text)", flexShrink: "0" }} className="h">&#8220;</span>
                <div>
                  <p style={{ margin: "0 0 12px", fontFamily: "var(--font-display)", fontWeight: "800", fontSize: "24px", letterSpacing: "-.03em", lineHeight: "1.38", color: "var(--ink)" }}>{b.text}</p>
                  {b.cite && <div style={{ fontSize: "12.5px", fontWeight: "700", letterSpacing: ".04em", color: "var(--slate)" }}>{b.cite}</div>}
                </div>
              </div>
            );
          case "figure": {
            fig += 1;
            return (
              <figure key={i} style={{ margin: "0 0 30px" }}>
                <div style={{ borderRadius: "12px", overflow: "hidden", background: "var(--line-2)", aspectRatio: "16/7" }}>
                  <svg width="100%" height="100%" style={{ display: "block" }} aria-hidden="true" preserveAspectRatio="none" viewBox="0 0 752 329"><rect width="752" height="329" fill="var(--ph)" /><g color="var(--grey)" opacity=".8"><rect width="752" height="329" fill={`url(#${PAT[b.mesh ?? "grate"] ?? "pGrate"})`} /></g></svg>
                </div>
                <figcaption style={{ marginTop: "11px", fontSize: "12.5px", fontWeight: "500", color: "var(--slate)" }}><b style={{ color: "var(--ink)" }}>FIG. {fig} —</b> {b.caption.replace(/^Fig(?:ure)?\.?\s*\d+\s*[—–-]\s*/i, "")}{b.source && <> &#183; Source: {b.source}</>}</figcaption>
              </figure>
            );
          }
          case "spec":
            return (
              <div key={i} className="quick" style={{ position: "relative", overflow: "hidden", background: "var(--surface-dark)", color: "#FFFFFF", borderRadius: "14px", padding: "24px 26px", margin: "30px 0 34px" }}>
                <svg style={{ position: "absolute", right: "0", top: "0", height: "100%", width: "320px" }} aria-hidden="true" preserveAspectRatio="none" viewBox="0 0 320 220"><g color="#FFFFFF" opacity=".16"><rect width="320" height="220" fill="url(#pWeldQ)" /></g><rect width="320" height="220" fill="url(#fadeR)" /></svg>
                <div style={{ position: "relative" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "9px", marginBottom: "16px" }}><span style={{ width: "15px", height: "3px", background: "var(--red)" }}></span><span style={{ fontSize: "12.5px", letterSpacing: ".1em" }} className="h">{b.title.toUpperCase()}</span></div>
                  <dl style={{ margin: "0", display: "grid", gridTemplateColumns: `repeat(${Math.min(4, b.rows.length)},1fr)`, gap: "18px" }}>
                    {b.rows.map(([k, v]) => {
                      const m = v.match(/^([≥≤~]?\s*[\d][\d.,×x\s+]*)\s*([a-zA-Z/²%].*)?$/);
                      const val = m ? m[1].trim() : v, unit = m?.[2] ?? "";
                      const size = val.length > 10 ? "17px" : val.length > 7 || !/\d/.test(val) ? "19px" : "23px";
                      return <div key={k}><dt style={{ fontSize: "11px", fontWeight: "800", letterSpacing: ".1em", color: "var(--grey-2)", marginBottom: "6px" }}>{k.toUpperCase()}</dt><dd style={{ margin: "0", fontSize: size, fontWeight: "700", lineHeight: 1.2 }} className="mono">{val}</dd><div style={{ fontSize: "11.5px", fontWeight: "500", color: "var(--grey-2)" }}>{unit || " "}</div></div>;
                    })}
                  </dl>
                  {b.standards && (
                    <div style={{ marginTop: "16px", paddingTop: "12px", borderTop: "1px solid rgba(255,255,255,.14)", display: "flex", gap: "14px", alignItems: "center", flexWrap: "wrap" }}>
                      <span style={{ fontSize: "11px", fontWeight: "800", letterSpacing: ".1em", color: "var(--grey-2)" }}>STANDARDS</span>
                      {b.standards.map((s, si) => { const std = b.stdSlugs?.[si] ? { slug: b.stdSlugs[si] } : null; return std ? <Link key={s} href={`/standards/${std.slug}/`} className="mono" style={{ color: "#FFFFFF", fontWeight: 700, fontSize: "13px", borderBottom: "1.5px dotted var(--red)" }}>{s}</Link> : <span key={s} className="mono" style={{ fontSize: "13px", fontWeight: 700 }}>{s}</span>; })}
                    </div>
                  )}
                </div>
              </div>
            );
          case "table":
            return (
              <div key={i}>
                <table className="spec">
                  <thead><tr>{b.head.map((x) => <th key={x}>{x.toUpperCase()}</th>)}</tr></thead>
                  <tbody>{b.rows.map((r, ri) => <tr key={ri}>{r.map((c, ci) => <td key={ci} className={ci ? "mono" : undefined}>{c}</td>)}</tr>)}</tbody>
                </table>
                {b.caption && <p style={{ margin: "11px 0 24px", fontSize: "12.5px", color: "var(--grey)" }}>{b.caption}</p>}
              </div>
            );
          case "checklist":
            return (
              <div key={i} style={{ margin: "0 0 30px" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "9px", margin: "26px 0 14px" }}><span style={{ width: "15px", height: "3px", background: "var(--red)" }}></span><span style={{ fontSize: "12.5px", letterSpacing: ".1em" }} className="h">{b.title.toUpperCase()}</span></div>
                <div className="g2" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px 20px" }}>
                  {b.items.map((it) => <div key={it} style={{ display: "flex", gap: "10px", alignItems: "flex-start" }}><span style={{ width: "18px", height: "18px", border: "2px solid var(--ink)", borderRadius: "4px", flexShrink: "0", marginTop: "2px" }}></span><span style={{ fontSize: "14.5px", fontWeight: "600", lineHeight: "1.5" }}>{it}</span></div>)}
                </div>
              </div>
            );
          case "ad":
            return null;
        }
      })}
    </>
  );
}
