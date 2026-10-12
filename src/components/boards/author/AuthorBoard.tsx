/* Ported 1:1 from canvas board Author-P. */
import Link from "next/link";
import { Shell } from "@/components/shell/Shell";
import { SocialGlyph } from "@/components/ui/SocialButton";
import { AUTHORS } from "@/lib/content/people";
import { byAuthor } from "@/lib/content/articles";
import { sectionByCode, subsectionLabel, articleHref, fmtDate } from "@/lib/site";
import type { Author, SectionCode } from "@/lib/content/types";
import "@/styles/board-auth.css";

const initials = (n: string) => n.split(/\s+/).map((x) => x[0]).join("").slice(0, 2).toUpperCase();

export function AuthorBoard({ a, section }: { a: Author; section?: string }) {
  const all = byAuthor(a.slug);
  const list = section ? all.filter((x) => x.section === section) : all;
  const counts = Object.entries(all.reduce<Record<string, number>>((m, x) => ((m[x.section] = (m[x.section] ?? 0) + 1), m), {})).sort((x, y) => y[1] - x[1]);
  const others = AUTHORS.filter((x) => x.slug !== a.slug).slice(0, 3);
  const since = new Intl.DateTimeFormat("en-GB", { month: "long", year: "numeric" }).format(new Date(a.since + "-01"));
  return (
    <Shell header="compact" board="b-auth">
{/* 作者头部 */}
<section style={{ background: "var(--paper)", borderBottom: "1px solid var(--line)" }}>
<div style={{ paddingTop: "36px", paddingBottom: "36px" }} className="wrap">
<nav aria-label="Breadcrumb" style={{ fontSize: "12.5px", fontWeight: "500", color: "var(--slate)", marginBottom: "20px" }}><Link href="/" style={{ color: "var(--slate)" }}>Home</Link> / <Link href="/about/#team" style={{ color: "var(--slate)" }}>Authors</Link> / <span style={{ color: "var(--ink)", fontWeight: "800" }}>{a.name}</span></nav>
<div style={{ display: "grid", gridTemplateColumns: "1.45fr 1fr", gap: "48px", alignItems: "start" }} className="cols">
<div style={{ display: "flex", gap: "24px", alignItems: "flex-start", flexWrap: "wrap" }}>
<div style={{ width: "104px", height: "104px", borderRadius: "999px", background: "var(--line)", flexShrink: "0", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "30px", fontWeight: 800, color: "var(--slate)" }} className="h">{initials(a.name)}</div>
<div style={{ minWidth: "0", flex: "1 1 320px" }}>
<h1 style={{ margin: "0 0 6px", fontSize: "40px", letterSpacing: "-.045em" }} className="h">{a.name}</h1>
<div style={{ fontSize: "13px", fontWeight: "800", letterSpacing: ".08em", color: "var(--red)", marginBottom: "14px" }}>{a.role.toUpperCase()}</div>
<p style={{ margin: "0 0 16px", fontSize: "16px", fontWeight: "500", lineHeight: "1.65", color: "var(--fg-3)", maxWidth: "540px" }}>{a.bio}</p>
<div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
{a.expertise.map((e) => <span key={e} className="tag">{e}</span>)}
</div>
</div>
</div>
<div style={{ background: "#FFFFFF", border: "1px solid var(--line)", borderRadius: "16px", padding: "24px" }}>
<div style={{ fontSize: "11.5px", fontWeight: "800", letterSpacing: ".12em", color: "var(--slate)", marginBottom: "14px" }}>AUTHOR DETAILS</div>
<div style={{ display: "flex", flexDirection: "column", gap: "12px", fontSize: "14px", fontWeight: "500" }}>
<div style={{ display: "flex", justifyContent: "space-between", gap: "14px" }}><span style={{ color: "var(--slate)" }}>Role</span><b>{a.role.split(" · ")[0]}</b></div>
<div style={{ display: "flex", justifyContent: "space-between", gap: "14px" }}><span style={{ color: "var(--slate)" }}>Writing here since</span><b>{since}</b></div>
<div style={{ display: "flex", justifyContent: "space-between", gap: "14px" }}><span style={{ color: "var(--slate)" }}>Published</span><b>{all.length} article{all.length === 1 ? "" : "s"}</b></div>
<div style={{ display: "flex", justifyContent: "space-between", gap: "14px" }}><span style={{ color: "var(--slate)" }}>Based in</span><b>{a.basedIn}</b></div>
</div>
<div style={{ borderTop: "1px solid var(--line)", marginTop: "16px", paddingTop: "16px" }}>
<div style={{ fontSize: "11px", fontWeight: "800", letterSpacing: ".12em", color: "var(--slate)", marginBottom: "11px" }}>CONTACT &amp; SOCIAL</div>
<div style={{ display: "flex", gap: "8px", flexWrap: "wrap", alignItems: "center" }}>
{a.email && <a href={`mailto:${a.email}`} style={{ display: "inline-flex", alignItems: "center", gap: "8px", border: "1px solid var(--line)", borderRadius: "999px", minHeight: "44px", padding: "0 16px", fontSize: "13.5px", fontWeight: "800" }}><svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="var(--red)" strokeWidth="2" aria-hidden="true" style={{ flexShrink: "0" }}><rect x="2.5" y="4.5" width="19" height="15" rx="2" /><path d="m3 6 9 6 9-6" /></svg>Email</a>}
{a.linkedin && <a href={a.linkedin} rel="me noopener noreferrer" target="_blank" aria-label="LinkedIn" style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", width: "44px", height: "44px", border: "1px solid var(--line)", borderRadius: "999px", color: "var(--ink)" }}><SocialGlyph id="linkedin" size={15} /></a>}
<a href={`/authors/${a.slug}/feed.xml`} aria-label="Author RSS feed" style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", width: "44px", height: "44px", border: "1px solid var(--line)", borderRadius: "999px", color: "var(--ink)" }}><svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.3" strokeLinecap="round" aria-hidden="true"><path d="M5 11a8 8 0 0 1 8 8M5 5a14 14 0 0 1 14 14" /><circle cx="5.5" cy="18.5" r="1.5" fill="currentColor" stroke="none" /></svg></a>
<span style={{ width: "1px", height: "26px", background: "var(--line)", margin: "0 2px" }}></span>
<Link href="/signin/" style={{ display: "inline-flex", alignItems: "center", gap: "8px", border: "0", background: "var(--ink)", color: "#FFFFFF", borderRadius: "999px", minHeight: "44px", padding: "0 20px", fontSize: "13.5px", fontWeight: "800" }}><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" aria-hidden="true"><path d="M12 5.5v13M5.5 12h13" /></svg>Follow</Link>
</div>
<p style={{ margin: "11px 0 0", fontSize: "11.5px", lineHeight: "1.55" }} className="meta">Authors maintain these details themselves; items left blank are not shown. The public email can differ from the account email, which is never published.</p>
</div>
</div>
</div>
</div>
</section>
{/* 文章列表 */}
<section style={{ paddingTop: "38px", paddingBottom: "50px" }} className="wrap">
<div style={{ display: "grid", gridTemplateColumns: "minmax(0,1fr) 320px", gap: "50px", alignItems: "start" }} className="cols">
<div>
<div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: "16px", flexWrap: "wrap", borderBottom: "3px solid var(--ink)", paddingBottom: "10px" }}>
<h2 style={{ margin: "0", fontSize: "24px" }} className="h">Articles by {a.name}</h2>
<div style={{ display: "flex", gap: "7px", flexWrap: "wrap" }}>
<Link href={`/authors/${a.slug}/`} className={`chip${section ? "" : " on"}`}>All</Link>
{counts.map(([c]) => <Link key={c} href={`/authors/${a.slug}/?section=${c}`} className={`chip${section === c ? " on" : ""}`}>{sectionByCode(c)?.label}</Link>)}
</div>
</div>
{list.map((x) => (
<Link key={x.slug} href={articleHref(x)} className="row" style={{ display: "flex", gap: "20px", padding: "22px 0", borderBottom: "1px solid var(--line)" }}><span style={{ width: "186px", flexShrink: "0", aspectRatio: "4/3" }} className="thumb"></span><span style={{ display: "flex", flexDirection: "column", gap: "7px", minWidth: "0" }}><span className="kicker"><i></i>{sectionByCode(x.section)?.label.toUpperCase()} · {subsectionLabel(x.section, x.subsection).toUpperCase()}</span><span style={{ fontSize: "21px" }} className="h">{x.title}</span><span style={{ fontSize: "14px", fontWeight: "500", lineHeight: "1.5", color: "var(--slate)" }}>{x.dek}</span><span className="meta">{fmtDate(x.date)} · {x.readMin} min</span></span></Link>
))}
{list.length === 0 && <p className="meta" style={{ padding: "20px 0" }}>No articles in this section yet.</p>}
</div>
<aside style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
<div style={{ background: "var(--ink)", color: "#FFFFFF", borderRadius: "16px", padding: "24px" }}>
<div style={{ fontSize: "19px", marginBottom: "8px" }} className="h">Follow this author</div>
<p style={{ margin: "0 0 14px", fontSize: "13.5px", fontWeight: "500", lineHeight: "1.55", color: "var(--line-2)" }}>Sign in to follow; you are notified when this author publishes.</p>
<Link href="/signin/" style={{ display: "flex", alignItems: "center", justifyContent: "center", width: "100%", boxSizing: "border-box", minHeight: "46px", border: "0", borderRadius: "10px", background: "var(--red)", color: "#FFFFFF", fontWeight: "800", fontSize: "14.5px" }}>Sign in to follow</Link>
</div>
<div style={{ border: "1px solid var(--line)", borderRadius: "16px", padding: "22px" }}>
<div style={{ fontSize: "18px", marginBottom: "12px" }} className="h">Writes mostly about</div>
<div style={{ display: "flex", flexDirection: "column", gap: "10px", fontSize: "14px", fontWeight: "700" }}>
{counts.map(([c, n]) => <span key={c} style={{ display: "flex", justifyContent: "space-between" }}><Link href={`/${sectionByCode(c as SectionCode)?.slug}/`}>{sectionByCode(c)?.label}</Link><span className="meta">{n}</span></span>)}
</div>
</div>
<div style={{ border: "1px solid var(--line)", borderRadius: "16px", padding: "22px" }}>
<div style={{ fontSize: "18px", marginBottom: "12px" }} className="h">Other authors</div>
<div style={{ display: "flex", flexDirection: "column", gap: "13px", fontSize: "14px", fontWeight: "700" }}>
{others.map((o) => <Link key={o.slug} href={`/authors/${o.slug}/`} style={{ display: "flex", alignItems: "center", gap: "11px" }}><span style={{ width: "36px", height: "36px", borderRadius: "999px", background: "var(--line)", flexShrink: "0", display: "inline-flex", alignItems: "center", justifyContent: "center", fontSize: "12px", color: "var(--slate)" }}>{initials(o.name)}</span>{o.name}</Link>)}
</div>
</div>
<div style={{ background: "var(--paper)", borderRadius: "16px", padding: "22px" }}>
<div style={{ fontSize: "17px", marginBottom: "8px" }} className="h">Want to write here?</div>
<p style={{ margin: "0 0 13px", fontSize: "13.5px", fontWeight: "500", lineHeight: "1.6", color: "var(--slate)" }}>Outside contributions keep the real author&#8217;s name, and an author page like this one is created once a piece is published.</p>
<Link href="/submit/" style={{ border: "2px solid var(--ink)", fontWeight: "800", fontSize: "13.5px", padding: "0 20px", minHeight: "44px", borderRadius: "999px", display: "inline-flex", alignItems: "center" }}>Submit an article</Link>
</div>
</aside>
</div>
</section>
<div style={{ height: "4px", background: "var(--red)" }}></div>
    </Shell>
  );
}
