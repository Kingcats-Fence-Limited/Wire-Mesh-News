/* Ported 1:1 from canvas board Error-R: 404 (①) and the shared 500/403/410 card (②). Error pages are noindex and always offer a way out. */
import Link from "next/link";
import { Shell } from "@/components/shell/Shell";
import { mostRead } from "@/lib/content/articles";
import { EDITORIAL_SECTIONS, SITE, articleHref, sectionByCode } from "@/lib/site";
import "@/styles/board-err.css";
import { demoBg } from "@/lib/demo";

export function NotFoundBoard({ path }: { path?: string }) {
  const picks = mostRead(3);
  return (
    <Shell header="compact" board="b-err">
<section style={{ paddingTop: "34px", paddingBottom: "50px" }} className="wrap">
<div className="frame">
<div style={{ display: "grid", gridTemplateColumns: "1.1fr 1fr", gap: "0", alignItems: "stretch" }} className="cols">
<div style={{ padding: "44px 44px 40px" }}>
<div style={{ display: "flex", alignItems: "center", gap: "18px", marginBottom: "20px" }}>
<svg width="86" height="86" viewBox="0 0 120 120" style={{ color: "var(--ink)", flexShrink: "0" }} role="img" aria-label="A broken wire"><path d="M12 26L33 90Q39 106 46 90L55 66Q60 54 65 66L74 90Q81 106 87 90L100 50" fill="none" stroke="currentColor" strokeWidth="10" strokeLinecap="round" strokeLinejoin="round" strokeDasharray="26 16" /><circle cx="107" cy="26" r="9" fill="var(--red)" /></svg>
<div style={{ fontSize: "84px", letterSpacing: "-.06em", lineHeight: "1" }} className="h big">404</div>
</div>
<h1 style={{ margin: "0 0 12px", fontSize: "34px", letterSpacing: "-.045em" }} className="h">This wire is broken</h1>
<p style={{ margin: "0 0 10px", fontSize: "16.5px", fontWeight: "500", lineHeight: "1.6", color: "var(--fg-3)", maxWidth: "460px" }}>We can&#8217;t find this page. It may have moved, changed address, or never existed.</p>
{path && <p style={{ margin: "0 0 26px", fontSize: "13px" }} className="meta mono">{path}</p>}
<form action="/search/" method="get" style={{ display: "flex", alignItems: "center", gap: "12px", border: "2px solid var(--ink)", borderRadius: "999px", padding: "0 20px", minHeight: "54px", maxWidth: "460px", marginBottom: "20px" }}>
<svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="var(--ink)" strokeWidth="2.3" strokeLinecap="round" aria-hidden="true"><circle cx="11" cy="11" r="7" /><path d="M16.5 16.5 21 21" /></svg>
<label htmlFor="e404" style={{ position: "absolute", width: "1px", height: "1px", overflow: "hidden", clip: "rect(0 0 0 0)" }}>Search</label>
<input id="e404" name="q" type="search" placeholder="Search for what you were looking for" style={{ border: "0", outline: "0", flex: "1 1 auto", fontFamily: "inherit", fontSize: "16px", fontWeight: "500", minHeight: "48px", background: "transparent" }} />
</form>
<div style={{ display: "flex", gap: "11px", flexWrap: "wrap" }}>
<Link href="/" className="btn">Back to the front page</Link>
<Link href="/news/" className="btn ghost">Browse the latest</Link>
</div>
<p style={{ margin: "22px 0 0", lineHeight: "1.6", maxWidth: "440px" }} className="meta">Sure something should be here? Send the address to <a href={`mailto:${SITE.email}`} style={{ color: "var(--red-text)", fontWeight: "800" }}>{SITE.email}</a> and we will look.</p>
</div>
<div style={{ background: "var(--paper)", padding: "40px 36px", borderLeft: "1px solid var(--line)" }}>
<div style={{ fontSize: "11.5px", fontWeight: "800", letterSpacing: ".12em", color: "var(--slate)", marginBottom: "16px" }}>PERHAPS YOU WERE LOOKING FOR</div>
{picks.map((a) => (
<Link key={a.slug} href={articleHref(a)} style={{ display: "flex", gap: "13px", paddingBottom: "16px", borderBottom: "1px solid var(--line)", marginBottom: "16px" }}><span style={{ width: "74px", aspectRatio: "1/1", ...demoBg(a.slug) }} className="thumb"></span><span style={{ display: "flex", flexDirection: "column", gap: "5px" }}><span className="kicker"><i></i>{sectionByCode(a.section)?.label.toUpperCase()}</span><span style={{ fontSize: "15px", fontWeight: "800", lineHeight: "1.3" }}>{a.title}</span></span></Link>
))}
<div style={{ fontSize: "11.5px", fontWeight: "800", letterSpacing: ".12em", color: "var(--slate)", marginBottom: "12px" }}>MAIN SECTIONS</div>
<div style={{ display: "flex", gap: "7px", flexWrap: "wrap" }}>
{EDITORIAL_SECTIONS.map((s) => <Link key={s.slug} href={`/${s.slug}/`} style={{ border: "1px solid var(--line)", background: "var(--card)", borderRadius: "999px", padding: "8px 14px", fontSize: "13px", fontWeight: "700" }}>{s.label}</Link>)}
<Link href="/directory/" style={{ border: "1px solid var(--line)", background: "var(--card)", borderRadius: "999px", padding: "8px 14px", fontSize: "13px", fontWeight: "700" }}>Directory</Link>
<Link href="/events/" style={{ border: "1px solid var(--line)", background: "var(--card)", borderRadius: "999px", padding: "8px 14px", fontSize: "13px", fontWeight: "700" }}>Events</Link>
</div>
</div>
</div>
</div>
</section>
    </Shell>
  );
}

const KIND = {
  500: { bg: "var(--st-red-bg)", color: "var(--red-text)", icon: <><path d="M10.3 3.9 2.4 17.5A1.9 1.9 0 0 0 4 20.4h16a1.9 1.9 0 0 0 1.6-2.9L13.7 3.9a1.9 1.9 0 0 0-3.4 0z" /><path d="M12 9.5v4M12 17v.01" /></>, title: "Something went wrong", text: "The server hit an error — nothing you did. We have been alerted." },
  403: { bg: "var(--paper)", color: "var(--slate)", icon: <><rect x="4" y="10.5" width="16" height="10" rx="2" /><path d="M8 10.5V7.8a4 4 0 0 1 8 0v2.7" /></>, title: "No access", text: "This page belongs to another account, or needs a sign-in. Drafts, submissions under review and notifications are private to their owner." },
  410: { bg: "var(--paper)", color: "var(--slate)", icon: <><path d="M5 20.5V4.5A1.5 1.5 0 0 1 6.5 3H15l4 4.3V20.5A1.5 1.5 0 0 1 17.5 22h-11A1.5 1.5 0 0 1 5 20.5z" /><path d="M8.5 12.5h7M8.5 16.5h4" /></>, title: "This content has been withdrawn", text: "The article was withdrawn for a factual or copyright reason. We never delete quietly; the reason is recorded on the Corrections page." },
} as const;

/* Shared 500 / 403 / 410 card. */
export function ErrorCard({ code, ref, onRetry }: { code: 500 | 403 | 410; ref?: string; onRetry?: () => void }) {
  const k = KIND[code];
  return (
    <div style={{ padding: "28px 26px", display: "flex", flexDirection: "column", minHeight: "380px", boxSizing: "border-box", maxWidth: "420px" }} className="frame">
<div style={{ width: "50px", height: "50px", borderRadius: "13px", background: k.bg, display: "inline-flex", alignItems: "center", justifyContent: "center", marginBottom: "15px" }}>
<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke={code === 500 ? "var(--red)" : "var(--ink)"} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">{k.icon}</svg>
</div>
<div style={{ fontSize: "13px", letterSpacing: ".1em", color: k.color, marginBottom: "7px" }} className="h">{code}</div>
<h1 style={{ margin: "0 0 9px", fontSize: "22px" }} className="h">{k.title}</h1>
<p style={{ margin: "0 0 16px", fontSize: "14px", fontWeight: "500", lineHeight: "1.6", color: "var(--slate)" }}>{k.text}</p>
{code === 500 && ref && <p style={{ margin: "0 0 16px", fontSize: "12px" }} className="meta mono">Ref: {ref}</p>}
{code === 410 && <Link href="/policies/corrections/" style={{ fontSize: "12.5px", fontWeight: "800", letterSpacing: ".06em", color: "var(--red-text)", marginBottom: "14px" }}>CORRECTIONS &#8594;</Link>}
<div style={{ marginTop: "auto", display: "flex", gap: "9px", flexWrap: "wrap" }}>
{code === 500 && <button type="button" onClick={onRetry} style={{ minHeight: "44px", fontSize: "13.5px", padding: "0 18px" }} className="btn">Try again</button>}
{code === 403 && <Link href="/signin/" style={{ minHeight: "44px", fontSize: "13.5px", padding: "0 18px" }} className="btn">Sign in</Link>}
<Link href="/" style={{ minHeight: "44px", fontSize: "13.5px", padding: "0 18px" }} className="btn ghost">Back to the front page</Link>
</div>
    </div>
  );
}
