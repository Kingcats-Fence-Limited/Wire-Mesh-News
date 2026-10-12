/* Ported 1:1 from canvas Home-A "Letters & Opinion". Display rules (from the board): hidden when fewer than 3 letters or the newest is older than 60 days; right column becomes an invitation when no column is live. */
import Link from "next/link";
import type { Column, Letter } from "@/lib/content/types";
import { daysAgo } from "@/lib/site";
import { initials } from "@/lib/initials";

const sectionSlug: Record<string, string> = { news: "news", market_insights: "market-insights", applications: "applications", technical_guides: "technical-guides", buying_guides: "buying-guides" };

function LetterRow({ l }: { l: Letter }) {
  return (
    <article style={{ display: "flex", gap: "16px", padding: "18px 0", borderTop: "1px solid var(--line)" }}>
      <span style={{ flexShrink: "0", width: "46px", height: "46px", borderRadius: "999px", background: "#F2F3F5", border: "1px solid var(--line)", display: "inline-flex", alignItems: "center", justifyContent: "center" }}>
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--grey)" strokeWidth="1.8" strokeLinejoin="round" aria-hidden="true"><path d="M3 6.5h18v11H3z" /><path d="m3 7 9 6 9-6" /></svg>
      </span>
      <div style={{ minWidth: "0" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "9px", flexWrap: "wrap", marginBottom: "7px" }}>
          <span className="kick"><i></i>LETTER</span>
          <span style={{ fontSize: "12px", fontWeight: "700", color: "var(--ink)" }}>{l.writer.role}</span>
          <span className="meta" style={{ fontSize: "12px" }}>&#183; {l.writer.org}, {l.writer.country}</span>
          <span className="mono meta" style={{ fontSize: "11px", fontWeight: "700" }}>{daysAgo(l.date)}</span>
        </div>
        <Link href={`/letters/${l.slug}/`} className="h" style={{ display: "block", fontSize: "19px", lineHeight: "1.26", marginBottom: "7px" }}>&#8220;{l.title}&#8221;</Link>
        <div className="meta" style={{ fontSize: "12.5px" }}>In reply to <Link href={`/${sectionSlug[l.replyTo.section]}/${l.replyTo.slug}/`} style={{ color: "var(--slate)", textDecoration: "underline" }}>{l.replyTo.title}</Link></div>
      </div>
    </article>
  );
}

export function LettersBlock({ letters, column, monthCount }: { letters: Letter[]; column?: Column; monthCount: number }) {
  if (letters.length < 3) return null;
  return (
    <>
<section style={{ borderTop: "1px solid var(--line)", background: "var(--card)" }}>
<div className="wrap" style={{ paddingTop: "46px", paddingBottom: "46px" }}>
<div className="sec" style={{ marginBottom: "8px" }}><span className="node"></span><h2>Letters &amp; Opinion</h2><span className="rule"></span><Link href="/letters/">ALL LETTERS &#8594;</Link></div>
<p className="meta" style={{ margin: "0 0 22px", fontSize: "13px" }}>Readers first, columns second. The editorial team does not write columns; every column is by an outside author under their real name, title and organisation, with interests disclosed at the end.</p>
<div className="g2" style={{ display: "grid", gridTemplateColumns: "1.55fr 1fr", gap: "44px", alignItems: "start" }}>
<div>
<div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "4px" }}>
<span className="h" style={{ fontSize: "14px", letterSpacing: ".08em", color: "var(--grey)" }}>FROM OUR READERS</span>
<span className="mono" style={{ fontSize: "11px", fontWeight: "800", color: "var(--grey-4)" }}>{monthCount} THIS MONTH</span>
</div>
{letters.slice(0, 3).map((l) => <LetterRow key={l.slug} l={l} />)}
<div style={{ display: "flex", alignItems: "center", gap: "16px", flexWrap: "wrap", marginTop: "20px", padding: "16px 18px", background: "var(--paper)", borderRadius: "12px" }}>
<div style={{ flex: "1 1 320px" }}>
<div className="h" style={{ fontSize: "16px", marginBottom: "4px" }}>Write to the editor</div>
<p className="meta" style={{ margin: "0", fontSize: "12.5px", lineHeight: "1.6" }}>200&#8211;400 words on one specific question or one experience from site. Sign in to submit; we verify identity and organisation before publishing. You may ask to be anonymous, but the editors must know who you are.</p>
</div>
<Link href="/letters/#write" style={{ background: "var(--ink)", color: "var(--on-ink)", fontWeight: "800", fontSize: "13.5px", padding: "0 20px", minHeight: "44px", borderRadius: "999px", display: "inline-flex", alignItems: "center" }}>Send a letter</Link>
</div>
</div>
<div>
{column ? (
<div style={{ border: "2px solid var(--ink)", borderRadius: "16px", padding: "22px" }}>
<div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: "10px", marginBottom: "14px" }}>
<span className="h" style={{ fontSize: "14px", letterSpacing: ".08em", color: "var(--grey)" }}>THIS WEEK&#8217;S COLUMN</span>
<span style={{ border: "1.5px solid var(--line)", borderRadius: "4px", fontSize: "9.5px", fontWeight: "800", letterSpacing: ".12em", padding: "4px 8px", color: "var(--slate)" }}>OPINION</span>
</div>
<span className="h" style={{ fontSize: "44px", lineHeight: ".5", color: "var(--red-text)", display: "block", marginBottom: "14px" }}>&#8220;</span>
<Link href={`/letters/columns/${column.slug}/`} className="h" style={{ display: "block", fontSize: "21px", lineHeight: "1.2", marginBottom: "12px" }}>{column.title}</Link>
<p className="meta" style={{ margin: "0 0 14px", fontSize: "13px", lineHeight: "1.6" }}>{column.summary}</p>
<div style={{ display: "flex", alignItems: "center", gap: "11px", paddingTop: "13px", borderTop: "1px solid var(--line-soft)" }}>
<span style={{ width: "38px", height: "38px", borderRadius: "999px", background: "var(--ink)", color: "var(--on-ink)", flexShrink: "0", display: "inline-flex", alignItems: "center", justifyContent: "center", fontSize: "12px", fontWeight: 800, letterSpacing: "-.02em" }}>{initials(column.author.name)}</span>
<span style={{ minWidth: "0" }}><span style={{ display: "block", fontSize: "13.5px", fontWeight: "800" }}>{column.author.name}</span><span className="meta" style={{ display: "block", fontSize: "11.5px" }}>{column.author.title} &#183; {column.author.org}</span></span>
</div>
<p className="meta" style={{ margin: "12px 0 0", fontSize: "11px", lineHeight: "1.55", color: "var(--grey)" }}>The author&#8217;s own view, not the editors&#8217;. Disclosure: {column.author.disclosure}</p>
</div>
) : (
<div style={{ border: "2px solid var(--ink)", borderRadius: "16px", padding: "22px" }}>
<span className="h" style={{ fontSize: "14px", letterSpacing: ".08em", color: "var(--grey)", display: "block", marginBottom: "14px" }}>WRITE A COLUMN</span>
<p className="meta" style={{ margin: "0 0 14px", fontSize: "13px", lineHeight: "1.6" }}>We publish one outside column a week, under the author&#8217;s real name, title and organisation. Pitch us a 700&#8211;900 word argument.</p>
<Link href="/submit/" style={{ color: "var(--red-text)", fontWeight: "800", fontSize: "12px", letterSpacing: ".1em" }}>HOW TO PITCH &#8594;</Link>
</div>
)}
<div style={{ marginTop: "14px", borderLeft: "3px solid var(--red)", paddingLeft: "16px" }}>
<div className="h" style={{ fontSize: "13px", letterSpacing: ".06em", color: "var(--grey)", marginBottom: "9px" }}>HOW THIS SECTION WORKS</div>
<ul style={{ margin: "0", paddingLeft: "16px", fontSize: "12px", fontWeight: "500", lineHeight: "1.75", color: "var(--slate)" }}>
<li>Every letter is from a <b style={{ color: "var(--ink)" }}>verified</b> reader; role and organisation type are shown, names on request</li>
<li>Letters reply to a <b style={{ color: "var(--ink)" }}>specific article</b> and are linked from it</li>
<li>Columns are opinion, labelled as such, and never mixed into News</li>
<li>Corrections prompted by a letter are credited to the writer</li>
</ul>
</div>
</div>
</div>
</div>
</section>
    </>
  );
}
