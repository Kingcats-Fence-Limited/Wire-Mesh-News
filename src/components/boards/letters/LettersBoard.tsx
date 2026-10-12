/* Ported 1:1 from canvas board Letters-LT: ① index (Letters / Columns tabs), ② single letter, column page in the same frame. */
import Link from "next/link";
import { Shell } from "@/components/shell/Shell";
import { DropMenu } from "@/components/boards/shared/DropMenu";
import { CopyLink } from "@/components/boards/article/CopyLink";
import { LETTERS, COLUMNS, getLetter, getAuthor } from "@/lib/content/people";
import { getArticle } from "@/lib/content/articles";
import { EDITORIAL_SECTIONS, sectionByCode, articleHref, fmtDate, fmtDateShort, SITE } from "@/lib/site";
import type { Letter, Column } from "@/lib/content/types";
import "@/styles/board-let.css";
import { initials } from "@/lib/initials";

export type LetParams = { tab?: string; section?: string; role?: string; sort?: string; page?: string };
const Env = ({ size = 20 }: { size?: number }) => <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="var(--grey)" strokeWidth="1.8" strokeLinejoin="round" aria-hidden="true"><path d="M3 6.5h18v11H3z" /><path d="m3 7 9 6 9-6" /></svg>;
const writerLine = (l: Letter) => `${l.writer.role} · ${l.writer.org}, ${l.writer.country}`;
const replies = (l: Letter) => LETTERS.filter((x) => x.replyTo.slug === l.replyTo.slug && x.slug !== l.slug && x.date > l.date);
const PER = 10;

function WriteCard() {
  return (
    <div style={{ background: "var(--surface-dark)", color: "#FFFFFF", borderRadius: "16px", padding: "24px" }}>
<div style={{ fontSize: "20px", marginBottom: "8px" }} className="h">Write to the editor</div>
<p style={{ margin: "0 0 14px", fontSize: "13.5px", fontWeight: "500", lineHeight: "1.6", color: "var(--on-dark-2)" }}>200–400 words. One specific point, one experience from a site or a plant, or a correction to something we published.</p>
<ul style={{ margin: "0 0 16px", paddingLeft: "18px", fontSize: "12.5px", fontWeight: "500", lineHeight: "1.7", color: "var(--grey-3)" }}>
<li>Sign in to send. We verify your name and organisation before publishing.</li>
<li>You can ask for your name to be withheld; the editor must still know who you are.</li>
<li>Letters may be shortened. We never change the point you make.</li>
<li>No product promotion, no price quotes, nothing about a named competitor.</li>
</ul>
<Link href="/signin/?next=/letters/" style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", width: "100%", boxSizing: "border-box", minHeight: "46px", borderRadius: "999px", background: "var(--red)", color: "#FFFFFF", fontSize: "14px", fontWeight: "800" }}>Send a letter</Link>
<p style={{ margin: "11px 0 0", fontSize: "11px", fontWeight: "500", lineHeight: "1.55", color: "var(--grey-5)" }}>By sending a letter you grant Wire Mesh News a non-exclusive licence to publish and edit it. See the <Link href="/policies/comment-policy/" style={{ color: "var(--grey-3)", textDecoration: "underline" }}>Letters policy</Link>.</p>
    </div>
  );
}

export function LettersBoard({ sp }: { sp: LetParams }) {
  const tab = sp.tab === "columns" ? "columns" : "letters";
  const sort = sp.sort === "oldest" ? "oldest" : "newest";
  const roles = [...new Set(LETTERS.map((l) => l.writer.role))];
  const letters = LETTERS.filter((l) => (!sp.section || l.replyTo.section === sp.section) && (!sp.role || l.writer.role === sp.role)).sort((a, b) => (sort === "newest" ? (a.date < b.date ? 1 : -1) : a.date < b.date ? -1 : 1));
  const page = Math.max(1, parseInt(sp.page ?? "1") || 1);
  const pages = Math.max(1, Math.ceil(letters.length / PER));
  const slice = letters.slice((page - 1) * PER, page * PER);
  const month = LETTERS.filter((l) => l.date >= "2026-10-01").length;
  const columns = [...COLUMNS].sort((a, b) => (a.date < b.date ? 1 : -1));
  const href = (patch: Partial<LetParams>) => { const m: Record<string, string | undefined> = { ...sp, page: undefined, ...patch }; const p = new URLSearchParams(); for (const [k, v] of Object.entries(m)) if (v) p.set(k, v); const s = p.toString(); return `/letters/${s ? `?${s}` : ""}`; };
  const toggle = (k: keyof LetParams, v: string) => href({ [k]: sp[k] === v ? undefined : v });
  return (
    <Shell header="compact" board="b-let">
<section style={{ paddingTop: "30px", paddingBottom: "24px", borderBottom: "1px solid var(--line)", display: "flex", alignItems: "flex-end", justifyContent: "space-between", gap: "30px", flexWrap: "wrap" }} className="wrap">
<div style={{ maxWidth: "640px" }}>
<nav aria-label="Breadcrumb" className="meta" style={{ marginBottom: "14px" }}><Link href="/" style={{ color: "var(--slate)" }}>Home</Link> / <b style={{ color: "var(--ink)" }}>Letters &amp; Opinion</b></nav>
<h1 style={{ margin: "0 0 10px", fontSize: "40px", letterSpacing: "-.045em" }} className="h">Letters &amp; Opinion<span style={{ color: "var(--red-text)" }}>.</span></h1>
<p style={{ margin: "0", fontSize: "15.5px", fontWeight: "500", lineHeight: "1.6", color: "var(--slate)" }}>Short, signed letters from people who specify, buy, test and make wire mesh — and an occasional column from outside the newsroom. Every writer is identified to the editor, even when published without a name.</p>
</div>
<div style={{ display: "flex", flexDirection: "column", gap: "10px", alignItems: "flex-end" }}>
<div className="seg"><Link href={href({ tab: undefined })} scroll={false} className={tab === "letters" ? "on" : undefined}>Letters <span style={{ fontWeight: "700", opacity: ".7" }} className="mono">{LETTERS.length}</span></Link>{COLUMNS.length > 0 && <Link href={href({ tab: "columns" })} scroll={false} className={tab === "columns" ? "on" : undefined}>Columns <span style={{ fontWeight: "700", color: tab === "columns" ? undefined : "var(--grey)" }} className="mono">{COLUMNS.length}</span></Link>}</div>
<Link href="/policies/comment-policy/" style={{ fontSize: "12.5px", fontWeight: "800", letterSpacing: ".06em", color: "var(--red-text)" }}>LETTERS POLICY →</Link>
</div>
</section>
{tab === "letters" && (
<div style={{ paddingTop: "16px", paddingBottom: "16px", borderBottom: "1px solid var(--line)", display: "flex", gap: "9px", flexWrap: "wrap", alignItems: "center" }} className="wrap chips">
<span style={{ fontSize: "12px", fontWeight: "800", letterSpacing: ".06em", color: "var(--grey)", marginRight: "3px" }} className="meta">REPLYING TO</span>
<Link href={href({ section: undefined })} scroll={false} className={`chip${sp.section ? "" : " on"}`}>All sections</Link>
{EDITORIAL_SECTIONS.filter((s) => LETTERS.some((l) => l.replyTo.section === s.code)).map((s) => <Link key={s.code} href={toggle("section", s.code)} scroll={false} className={`chip${sp.section === s.code ? " on" : ""}`}>{s.label}</Link>)}
<span style={{ width: "1px", height: "22px", background: "var(--line)", margin: "0 4px" }}></span>
<span style={{ fontSize: "12px", fontWeight: "800", letterSpacing: ".06em", color: "var(--grey)", marginRight: "3px" }} className="meta">WRITER</span>
<DropMenu className="chip" label={sp.role ?? "Any role"} items={[{ label: "Any role", href: href({ role: undefined }), on: !sp.role }, ...roles.map((r) => ({ label: r, href: href({ role: r }), on: sp.role === r }))]} />
<span style={{ marginLeft: "auto", display: "flex", alignItems: "center", gap: "9px" }}><span style={{ fontSize: "12px", fontWeight: "800", letterSpacing: ".06em", color: "var(--grey)" }} className="meta">SORT</span><Link href={href({ sort: sort === "newest" ? "oldest" : undefined })} scroll={false} className="chip">{sort === "newest" ? "Newest" : "Oldest"}<svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" aria-hidden="true"><path d="m5 8 7 7 7-7" /></svg></Link></span>
</div>
)}
<section style={{ paddingTop: "10px", paddingBottom: "40px", display: "grid", gridTemplateColumns: "minmax(0,1fr) 320px", gap: "44px", alignItems: "start" }} className="wrap cols">
<div>
{tab === "letters" ? (<>
<div style={{ display: "flex", alignItems: "center", gap: "10px", padding: "14px 0 10px" }}>
<span style={{ fontSize: "13px", letterSpacing: ".08em", color: "var(--grey)" }} className="h">FROM OUR READERS</span>
<span style={{ fontSize: "11px", fontWeight: "800", color: "var(--grey-4)" }} className="mono">{month} THIS MONTH</span>
</div>
{slice.length === 0 && <p className="meta" style={{ padding: "16px 0" }}>No letters match. <Link href="/letters/" style={{ color: "var(--red-text)", fontWeight: 800 }}>Clear filters</Link></p>}
{slice.map((l) => {
  const more = replies(l).length;
  return (
<article key={l.slug} className="letter">
<span className="av"><Env /></span>
<div style={{ minWidth: "0", flex: "1 1 auto" }}>
<div style={{ display: "flex", alignItems: "center", gap: "9px", flexWrap: "wrap", marginBottom: "7px" }}>
<span className="kick"><i></i>LETTER</span>
<span style={{ fontSize: "12.5px", fontWeight: "700" }}>{l.writer.name ?? "Name withheld"}</span><span style={{ fontSize: "12px" }} className="meta">· {writerLine(l)}{!l.writer.name && <> · <i>identity verified by the editor</i></>}</span>
<span style={{ fontSize: "11px", fontWeight: "700", marginLeft: "auto" }} className="mono meta">{fmtDate(l.date).toUpperCase()}</span>
</div>
<Link href={`/letters/${l.slug}/`} style={{ display: "block", fontSize: "21px", lineHeight: "1.24", marginBottom: "8px" }} className="h">&#8220;{l.title}&#8221;</Link>
<p style={{ margin: "0 0 8px", fontSize: "13.5px", lineHeight: "1.6", color: "var(--fg-3)" }} className="meta">{l.teaser}</p>
<div style={{ fontSize: "12.5px", display: "flex", gap: "14px", flexWrap: "wrap" }} className="meta"><span>Replying to <Link href={`/${sectionByCode(l.replyTo.section)?.slug}/${l.replyTo.slug}/`} style={{ color: "var(--slate)", textDecoration: "underline" }}>{l.replyTo.title}</Link></span>{l.ledToCorrection ? <span style={{ background: "var(--st-current-bg)", color: "var(--up)" }} className="rp">LED TO A CORRECTION</span> : l.editorReply ? <span className="rp">EDITOR REPLIED</span> : null}{more > 0 && <span style={{ fontSize: "11px", fontWeight: "800", color: "var(--grey)" }} className="mono">{more} FURTHER LETTER{more === 1 ? "" : "S"} →</span>}</div>
</div>
</article>
  );
})}
{pages > 1 && (
<nav aria-label="Pagination" style={{ display: "flex", gap: "8px", alignItems: "center", paddingTop: "22px" }}>
{Array.from({ length: pages }, (_, i) => i + 1).map((n) => n === page ? <span key={n} style={{ minWidth: "42px", justifyContent: "center" }} className="chip on">{n}</span> : <Link key={n} href={href({ page: String(n) })} style={{ minWidth: "42px", justifyContent: "center" }} className="chip">{n}</Link>)}
{page < pages && <Link href={href({ page: String(page + 1) })} className="chip">Next →</Link>}
</nav>
)}
</>) : (<>
<div style={{ display: "flex", alignItems: "center", gap: "10px", padding: "14px 0 10px" }}>
<span style={{ fontSize: "13px", letterSpacing: ".08em", color: "var(--grey)" }} className="h">COLUMNS</span>
<span style={{ border: "1.5px solid var(--line)", borderRadius: "4px", fontSize: "9.5px", fontWeight: "800", letterSpacing: ".12em", padding: "4px 8px", color: "var(--slate)" }}>OPINION</span>
</div>
{columns.map((c) => (
<article key={c.slug} className="letter">
<span style={{ width: "46px", height: "46px", borderRadius: "999px", background: "var(--ink)", color: "var(--on-ink)", flexShrink: "0", display: "inline-flex", alignItems: "center", justifyContent: "center", fontSize: "14px", fontWeight: 800, letterSpacing: "-.02em" }}>{initials(c.author.name)}</span>
<div style={{ minWidth: "0", flex: "1 1 auto" }}>
<div style={{ display: "flex", alignItems: "center", gap: "9px", flexWrap: "wrap", marginBottom: "7px" }}>
<span className="kick"><i></i>COLUMN</span>
<span style={{ fontSize: "12.5px", fontWeight: "700" }}>{c.author.name}</span><span style={{ fontSize: "12px" }} className="meta">· {c.author.title} · {c.author.org}</span>
<span style={{ fontSize: "11px", fontWeight: "700", marginLeft: "auto" }} className="mono meta">{fmtDate(c.date).toUpperCase()}</span>
</div>
<Link href={`/letters/columns/${c.slug}/`} style={{ display: "block", fontSize: "21px", lineHeight: "1.24", marginBottom: "8px" }} className="h">{c.title}</Link>
<p style={{ margin: "0", fontSize: "13.5px", lineHeight: "1.6", color: "var(--fg-3)" }} className="meta">{c.summary}</p>
</div>
</article>
))}
<p style={{ margin: "16px 0 0", fontSize: "11px", lineHeight: "1.55", color: "var(--grey)" }} className="meta">Columns are written by outside authors under their own name, job title and organisation, with a disclosure of interests. The newsroom does not write columns.</p>
</>)}
</div>
<aside style={{ display: "flex", flexDirection: "column", gap: "18px", paddingTop: "14px" }}>
<WriteCard />
{tab === "letters" && COLUMNS.length > 0 && (
<div style={{ border: "2px solid var(--ink)", borderRadius: "16px", padding: "20px" }}>
<div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: "10px", marginBottom: "12px" }}>
<span style={{ fontSize: "13px", letterSpacing: ".08em", color: "var(--grey)" }} className="h">COLUMNS</span>
<span style={{ border: "1.5px solid var(--line)", borderRadius: "4px", fontSize: "9.5px", fontWeight: "800", letterSpacing: ".12em", padding: "4px 8px", color: "var(--slate)" }}>OPINION</span>
</div>
{columns.slice(0, 3).map((c) => <Link key={c.slug} href={`/letters/columns/${c.slug}/`} style={{ display: "flex", gap: "11px", alignItems: "flex-start", padding: "10px 0", borderTop: "1px solid var(--line-soft)" }}><span style={{ width: "36px", height: "36px", borderRadius: "999px", background: "var(--ink)", color: "var(--on-ink)", flexShrink: "0", display: "inline-flex", alignItems: "center", justifyContent: "center", fontSize: "12px", fontWeight: 800, letterSpacing: "-.02em" }}>{initials(c.author.name)}</span><span style={{ minWidth: "0" }}><span style={{ display: "block", fontSize: "15px", lineHeight: "1.25", marginBottom: "3px" }} className="h">{c.title}</span><span style={{ fontSize: "11.5px" }} className="meta">{c.author.name} · {c.author.title} · {c.author.org}</span></span></Link>)}
<Link href="/letters/?tab=columns" style={{ display: "block", paddingTop: "12px", borderTop: "1px solid var(--line-soft)", fontSize: "12.5px", fontWeight: "800", letterSpacing: ".06em", color: "var(--red-text)" }}>ALL COLUMNS →</Link>
<p style={{ margin: "10px 0 0", fontSize: "11px", lineHeight: "1.55", color: "var(--grey)" }} className="meta">Columns are written by outside authors under their own name, job title and organisation, with a disclosure of interests. The newsroom does not write columns.</p>
</div>
)}
<div style={{ border: "1px solid var(--line)", borderRadius: "14px", padding: "18px 20px" }}>
<div style={{ fontSize: "15px", marginBottom: "9px" }} className="h">How we choose letters</div>
<ul style={{ margin: "0", paddingLeft: "17px", fontSize: "12.5px", fontWeight: "500", lineHeight: "1.7", color: "var(--fg-3)" }}>
<li>It adds something to a piece we published — a correction, a counter-example, a question we did not ask.</li>
<li>The writer has first-hand standing: they specify, buy, test, make or regulate.</li>
<li>We publish disagreement with our own reporting and say so when a letter led to a correction.</li>
</ul>
</div>
</aside>
</section>
    </Shell>
  );
}

export function LetterBoard({ l }: { l: Letter }) {
  const art = getArticle(l.replyTo.slug);
  const further = [...(l.furtherLetters ?? []).map((s) => getLetter(s)).filter(Boolean), ...replies(l).filter((x) => !l.furtherLetters?.includes(x.slug))];
  const url = `${SITE.url}/letters/${l.slug}/`;
  const editor = l.editorReply ? getAuthor(l.editorReply.by.toLowerCase().replace(/\s+/g, "-")) : undefined;
  return (
    <Shell header="compact" board="b-let">
<section style={{ paddingTop: "30px", paddingBottom: "40px" }} className="wrap">
<div style={{ maxWidth: "820px" }}>
<nav aria-label="Breadcrumb" style={{ marginBottom: "14px" }} className="meta"><Link href="/" style={{ color: "var(--slate)" }}>Home</Link> / <Link href="/letters/" style={{ color: "var(--slate)" }}>Letters &amp; Opinion</Link> / <b style={{ color: "var(--ink)" }}>Letter</b></nav>
<div style={{ display: "flex", alignItems: "center", gap: "9px", flexWrap: "wrap", marginBottom: "12px" }}>
<span className="kick"><i></i>LETTER TO THE EDITOR</span>
<span style={{ fontSize: "11px", fontWeight: "700" }} className="mono meta">{fmtDate(l.date).toUpperCase()}</span>
</div>
<h1 style={{ margin: "0 0 16px", fontSize: "32px", letterSpacing: "-.045em", lineHeight: "1.14" }} className="h">&#8220;{l.title}&#8221;</h1>
<div style={{ display: "flex", alignItems: "center", gap: "12px", padding: "14px 0", borderTop: "1px solid var(--line)", borderBottom: "1px solid var(--line)", marginBottom: "22px", flexWrap: "wrap" }}>
<span style={{ width: "40px", height: "40px" }} className="av"><Env size={18} /></span>
<span style={{ minWidth: "0", flex: "1 1 240px" }}><span style={{ display: "block", fontSize: "14px", fontWeight: "800" }}>{l.writer.name ?? "Name withheld"}</span><span style={{ display: "block", fontSize: "12px" }} className="meta">{writerLine(l)} · Identity and organisation verified by the editor</span></span>
<span style={{ marginLeft: "auto", display: "flex", gap: "8px" }}><a href={`mailto:?subject=${encodeURIComponent(`“${l.title}”`)}&body=${encodeURIComponent(url)}`} style={{ minHeight: "34px", fontSize: "12px" }} className="chip">Share</a><CopyLink url={url} /></span>
</div>
<div className="body">
{l.body.map((p, i) => <p key={i} style={i === l.body.length - 1 ? { marginBottom: 0 } : undefined}>{p}</p>)}
</div>
{art && (
<div style={{ margin: "24px 0 18px", border: "1px solid var(--line)", borderRadius: "12px", padding: "14px 16px", display: "flex", gap: "14px", alignItems: "center" }}>
<span style={{ width: "84px", height: "62px", borderRadius: "8px", background: "var(--line)", flexShrink: "0" }}></span>
<span style={{ minWidth: "0" }}><span style={{ marginBottom: "4px" }} className="kick"><i></i>REPLYING TO · {sectionByCode(art.section)?.label.toUpperCase()}</span><Link href={articleHref(art)} style={{ display: "block", fontSize: "16px", lineHeight: "1.25" }} className="h">{art.title}</Link><span style={{ fontSize: "11.5px" }} className="meta">{fmtDate(art.date)} · {art.readMin} min</span></span>
</div>
)}
{l.editorReply && (
<div style={{ background: "var(--paper)", borderLeft: "4px solid var(--red)", borderRadius: "0 12px 12px 0", padding: "16px 20px", marginBottom: "22px" }}>
<div style={{ display: "flex", alignItems: "center", gap: "9px", marginBottom: "7px", flexWrap: "wrap" }}><span className="rp">EDITOR&#8217;S REPLY</span><span style={{ fontSize: "11.5px" }} className="meta">{editor ? <Link href={`/authors/${editor.slug}/`}>{editor.name}</Link> : l.editorReply.by}, {fmtDate(l.editorReply.date)}</span>{l.ledToCorrection && <span style={{ background: "var(--st-current-bg)", color: "var(--up)" }} className="rp">LED TO A CORRECTION</span>}</div>
<p style={{ margin: "0", fontSize: "14.5px", fontWeight: "500", lineHeight: "1.65", color: "var(--fg-2)" }}>{l.editorReply.text}</p>
</div>
)}
<div style={{ display: "flex", alignItems: "center", gap: "16px", flexWrap: "wrap", padding: "16px 18px", background: "var(--surface-dark)", color: "#FFFFFF", borderRadius: "12px" }}>
<div style={{ flex: "1 1 300px" }}><div style={{ fontSize: "16px", marginBottom: "3px" }} className="h">Have a different view?</div><p style={{ margin: "0", fontSize: "12.5px", fontWeight: "500", lineHeight: "1.55", color: "var(--grey-3)" }}>Reply with a letter of your own. Letters answering this one are linked below it.</p></div>
<Link href={`/signin/?next=/letters/${l.slug}/`} style={{ background: "var(--red)", color: "#FFFFFF", fontWeight: "800", fontSize: "13.5px", padding: "0 20px", minHeight: "44px", borderRadius: "999px", display: "inline-flex", alignItems: "center" }}>Reply with a letter</Link>
</div>
{further.length > 0 && (
<div style={{ marginTop: "20px", paddingTop: "16px", borderTop: "1px solid var(--line)" }}>
<div style={{ fontSize: "13px", letterSpacing: ".08em", color: "var(--grey)", marginBottom: "10px" }} className="h">FURTHER LETTERS ON THIS ARTICLE · {further.length}</div>
{further.map((f, i) => <Link key={f!.slug} href={`/letters/${f!.slug}/`} style={{ display: "flex", justifyContent: "space-between", gap: "14px", padding: "9px 0", borderBottom: i < further.length - 1 ? "1px solid var(--line-soft)" : undefined }}><span style={{ fontSize: "15px" }} className="h">&#8220;{f!.title}&#8221;</span><span style={{ fontSize: "11px", fontWeight: "700", flexShrink: "0" }} className="mono meta">{fmtDateShort(f!.date)}</span></Link>)}
</div>
)}
<p style={{ margin: "18px 0 0", fontSize: "11.5px", lineHeight: "1.6", color: "var(--grey)" }} className="meta">Letters express the views of their writers, not of Wire Mesh News. Letters are edited for length and clarity; the writer&#8217;s point is not altered. Writers may be contacted by the editor before publication.</p>
</div>
</section>
    </Shell>
  );
}

export function ColumnBoard({ c }: { c: Column }) {
  const url = `${SITE.url}/letters/columns/${c.slug}/`;
  const others = COLUMNS.filter((x) => x.slug !== c.slug).slice(0, 2);
  return (
    <Shell header="compact" board="b-let">
<section style={{ paddingTop: "30px", paddingBottom: "40px" }} className="wrap">
<div style={{ maxWidth: "820px" }}>
<nav aria-label="Breadcrumb" style={{ marginBottom: "14px" }} className="meta"><Link href="/" style={{ color: "var(--slate)" }}>Home</Link> / <Link href="/letters/?tab=columns" style={{ color: "var(--slate)" }}>Letters &amp; Opinion</Link> / <b style={{ color: "var(--ink)" }}>Column</b></nav>
<div style={{ display: "flex", alignItems: "center", gap: "9px", flexWrap: "wrap", marginBottom: "12px" }}>
<span style={{ border: "1.5px solid var(--line)", borderRadius: "4px", fontSize: "9.5px", fontWeight: "800", letterSpacing: ".12em", padding: "4px 8px", color: "var(--slate)" }}>OPINION</span>
<span className="kick"><i></i>COLUMN</span>
<span style={{ fontSize: "11px", fontWeight: "700" }} className="mono meta">{fmtDate(c.date).toUpperCase()}</span>
</div>
<h1 style={{ margin: "0 0 10px", fontSize: "32px", letterSpacing: "-.045em", lineHeight: "1.14" }} className="h">{c.title}</h1>
<p style={{ margin: "0 0 16px", fontSize: "16px", fontWeight: 500, lineHeight: 1.6, color: "var(--slate)" }}>{c.summary}</p>
<div style={{ display: "flex", alignItems: "center", gap: "12px", padding: "14px 0", borderTop: "1px solid var(--line)", borderBottom: "1px solid var(--line)", marginBottom: "22px", flexWrap: "wrap" }}>
<span style={{ width: "40px", height: "40px", borderRadius: "999px", background: "var(--ink)", color: "var(--on-ink)", flexShrink: "0", display: "inline-flex", alignItems: "center", justifyContent: "center", fontSize: "13px", fontWeight: 800, letterSpacing: "-.02em" }}>{initials(c.author.name)}</span>
<span style={{ minWidth: "0", flex: "1 1 240px" }}><span style={{ display: "block", fontSize: "14px", fontWeight: "800" }}>{c.author.name}</span><span style={{ display: "block", fontSize: "12px" }} className="meta">{c.author.title} · {c.author.org}</span></span>
<span style={{ marginLeft: "auto", display: "flex", gap: "8px" }}><a href={`mailto:?subject=${encodeURIComponent(c.title)}&body=${encodeURIComponent(url)}`} style={{ minHeight: "34px", fontSize: "12px" }} className="chip">Share</a><CopyLink url={url} /></span>
</div>
<div className="body">
{c.body.map((p, i) => <p key={i}>{p}</p>)}
</div>
<div style={{ background: "var(--paper)", borderLeft: "4px solid var(--ink)", borderRadius: "0 12px 12px 0", padding: "14px 18px", margin: "22px 0" }}>
<div style={{ fontSize: "11px", fontWeight: "800", letterSpacing: ".1em", color: "var(--slate)", marginBottom: "5px" }}>DISCLOSURE</div>
<div style={{ fontSize: "13.5px", fontWeight: "500", lineHeight: "1.6", color: "var(--fg-3)" }}>{c.author.disclosure} The views are the author&#8217;s own, not the editors&#8217;.</div>
</div>
<div style={{ display: "flex", alignItems: "center", gap: "16px", flexWrap: "wrap", padding: "16px 18px", background: "var(--surface-dark)", color: "#FFFFFF", borderRadius: "12px" }}>
<div style={{ flex: "1 1 300px" }}><div style={{ fontSize: "16px", marginBottom: "3px" }} className="h">Disagree?</div><p style={{ margin: "0", fontSize: "12.5px", fontWeight: "500", lineHeight: "1.55", color: "var(--grey-3)" }}>Columns invite letters. Reply with one of your own.</p></div>
<Link href={`/signin/?next=/letters/columns/${c.slug}/`} style={{ background: "var(--red)", color: "#FFFFFF", fontWeight: "800", fontSize: "13.5px", padding: "0 20px", minHeight: "44px", borderRadius: "999px", display: "inline-flex", alignItems: "center" }}>Reply with a letter</Link>
</div>
{others.length > 0 && (
<div style={{ marginTop: "20px", paddingTop: "16px", borderTop: "1px solid var(--line)" }}>
<div style={{ fontSize: "13px", letterSpacing: ".08em", color: "var(--grey)", marginBottom: "10px" }} className="h">MORE COLUMNS</div>
{others.map((o, i) => <Link key={o.slug} href={`/letters/columns/${o.slug}/`} style={{ display: "flex", justifyContent: "space-between", gap: "14px", padding: "9px 0", borderBottom: i < others.length - 1 ? "1px solid var(--line-soft)" : undefined }}><span style={{ fontSize: "15px" }} className="h">{o.title}</span><span style={{ fontSize: "11px", fontWeight: "700", flexShrink: "0" }} className="mono meta">{fmtDateShort(o.date)}</span></Link>)}
</div>
)}
</div>
</section>
    </Shell>
  );
}
