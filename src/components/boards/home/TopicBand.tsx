/* Ported 1:1 from canvas Home-A red "Topic" band. */
import Link from "next/link";
import type { Topic } from "@/lib/content/types";

export function TopicBand({ topic, count }: { topic: Topic; count: number }) {
  const steps = topic.outline.length > 4 ? [...topic.outline.slice(0, 3), topic.outline[topic.outline.length - 1]] : topic.outline;
  return (
    <>
<section style={{ background: "var(--red)", color: "#FFFFFF", position: "relative", overflow: "hidden" }}>
<svg style={{ position: "absolute", inset: "0", width: "100%", height: "100%", color: "#CF1F29" }} aria-hidden="true"><rect width="100%" height="100%" fill="url(#pWeldQ)" /></svg>
<svg width="640" height="640" viewBox="0 0 120 120" style={{ position: "absolute", right: "-110px", top: "-170px", color: "var(--red-deep)" }} aria-hidden="true"><use href="#w2" width="120" height="120" /></svg>
<div className="wrap" style={{ position: "relative", paddingTop: "54px", paddingBottom: "54px" }}>
<div className="split" style={{ display: "grid", gridTemplateColumns: "1fr 1.2fr", gap: "50px", alignItems: "center" }}>
<div>
<span style={{ background: "var(--ink)", color: "#FFFFFF", fontSize: "10.5px", fontWeight: "800", letterSpacing: ".16em", padding: "7px 14px", borderRadius: "999px", display: "inline-block", marginBottom: "18px" }}>TOPIC</span>
<h2 className="h" style={{ margin: "0 0 16px", fontSize: "48px", letterSpacing: "-.06em", color: "#FFFFFF", lineHeight: ".98" }}>{topic.title}</h2>
<p style={{ margin: "0 0 22px", fontSize: "16.5px", fontWeight: "500", lineHeight: "1.6" }}>{topic.intro.split(". ")[0].replace(/\.$/, "")}.</p>
<Link href={`/topics/${topic.slug}/`} style={{ background: "var(--ink)", color: "#FFFFFF", fontWeight: "800", fontSize: "15px", padding: "0 26px", minHeight: "52px", borderRadius: "999px", display: "inline-flex", alignItems: "center" }}>Open the topic &#183; {count} articles</Link>
</div>
<div style={{ display: "flex", flexDirection: "column", gap: "2px" }}>
{steps.map((s, i) => (
<Link key={s} href={`/topics/${topic.slug}/#step-${i + 1}`} style={{ display: "flex", alignItems: "center", gap: "18px", background: "rgba(21,22,28,.22)", borderRadius: i === 0 ? "12px 12px 2px 2px" : i === steps.length - 1 ? "2px 2px 12px 12px" : "2px", padding: "16px 22px", color: "#FFFFFF" }}><span className="h" style={{ color: "rgba(255,255,255,.6)", fontSize: "14px" }}>{String(i + 1).padStart(2, "0")}</span><span style={{ fontSize: "16.5px", fontWeight: "800", lineHeight: "1.3" }}>{s}</span><span style={{ marginLeft: "auto", fontWeight: "800" }}>&#8594;</span></Link>
))}
</div>
</div>
</div>
</section>
    </>
  );
}
