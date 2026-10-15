/* Ported 1:1 from canvas board Letters-LT: ① index (Letters / Columns tabs), ② single letter, column page in the same frame. */
import Link from "next/link";
import { Shell } from "@/components/shell/Shell";
import { CopyLink } from "@/components/boards/article/CopyLink";
import { LETTERS, COLUMNS, getLetter, getAuthor } from "@/lib/content/people";
import { getArticle } from "@/lib/content/articles";
import { sectionByCode, articleHref, fmtDate, fmtDateShort, SITE } from "@/lib/site";
import type { Letter, Column } from "@/lib/content/types";
import "@/styles/board-let.css";
import { initials } from "@/lib/initials";

export type LetParams = { tab?: string; section?: string; role?: string; sort?: string; page?: string };
const Env = ({ size = 20 }: { size?: number }) => <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="var(--grey)" strokeWidth="1.8" strokeLinejoin="round" aria-hidden="true"><path d="M3 6.5h18v11H3z" /><path d="m3 7 9 6 9-6" /></svg>;
const writerLine = (l: Letter) => `${l.writer.role} · ${l.writer.org}, ${l.writer.country}`;
const replies = (l: Letter) => LETTERS.filter((x) => x.replyTo.slug === l.replyTo.slug && x.slug !== l.slug && x.date > l.date);
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
<div style={{ display: "flex", alignItems: "center", gap: "9px", marginBottom: "7px", flexWrap: "wrap" }}><span className="rp">EDITOR&#8217;S REPLY</span><span style={{ fontSize: "11.5px" }} className="meta">{editor ? <Link href={`/authors/${editor.slug}/`} style={{ textDecoration: "underline", textUnderlineOffset: "3px" }}>{editor.name}</Link> : l.editorReply.by}, {fmtDate(l.editorReply.date)}</span>{l.ledToCorrection && <span style={{ background: "var(--st-current-bg)", color: "var(--up)" }} className="rp">LED TO A CORRECTION</span>}</div>
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
<span style={{ border: "1.5px solid var(--line)", borderRadius: "4px", fontSize: "9.5px", fontWeight: "800", letterSpacing: ".12em", padding: "4px 8px", color: "var(--slate)" }}>COLUMN</span>
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
