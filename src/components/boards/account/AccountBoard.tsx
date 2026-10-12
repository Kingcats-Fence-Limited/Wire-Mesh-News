/* Ported 1:1 from canvas board Account-G (user centre). Phase 1 has no account backend, so this renders a sample account so the panels can be reviewed; the banner says so. Not in the sitemap, noindex. */
import Link from "next/link";
import { Shell } from "@/components/shell/Shell";
import { ARTICLES, latest } from "@/lib/content/articles";
import { COMPANIES } from "@/lib/content/directory";
import { articleHref, sectionByCode } from "@/lib/site";
import { AccountSettings } from "./AccountSettings";
import "@/styles/board-acct.css";
import { demoBg } from "@/lib/demo";

const DEMO = { initials: "JD", name: "Jordan Dale", since: "Mar 2026", company: COMPANIES.find((c) => c.claimed) ?? COMPANIES[0] };

const St = ({ kind, children }: { kind: "red" | "amber" | "grey" | "green" | "mint"; children: React.ReactNode }) => {
  const m = { red: ["var(--st-red-bg)", "var(--red-deep)"], amber: ["var(--st-review-bg)", "var(--st-review-fg)"], grey: ["var(--line)", "var(--slate)"], green: ["var(--st-current-bg)", "var(--up)"], mint: ["var(--st-current-bg)", "var(--up)"] }[kind];
  return <span style={{ background: m[0], color: m[1] }} className="st">{children}</span>;
};

export function AccountBoard() {
  const arts = latest(6);
  const saved = [arts[0], arts[3], arts[5]].filter(Boolean);
  const published = ARTICLES.find((a) => a.type !== "sponsored") ?? arts[0];
  const co = DEMO.company;
  return (
    <Shell header="compact" board="b-acct">
<section style={{ background: "var(--paper)", paddingTop: "28px", paddingBottom: "56px" }}>
<div className="wrap">
<div style={{ display: "flex", alignItems: "center", gap: "12px", flexWrap: "wrap", background: "var(--surface-dark)", color: "#FFFFFF", borderRadius: "12px", padding: "12px 16px", marginBottom: "22px", fontSize: "13px", fontWeight: "600" }}>
<span style={{ background: "var(--red)", fontSize: "10px", fontWeight: "800", letterSpacing: ".14em", padding: "3px 8px", borderRadius: "3px" }}>PREVIEW</span>
<span>You are looking at a sample account. Sign-in, submissions and claims go live with the account release; nothing here is saved.</span>
<Link href="/signin/" style={{ marginLeft: "auto", color: "#FFFFFF", textDecoration: "underline", fontWeight: "800" }}>Back to sign in</Link>
</div>
<nav aria-label="Breadcrumb" style={{ fontSize: "12.5px", fontWeight: "500", color: "var(--slate)", marginBottom: "12px" }}><Link href="/" style={{ color: "var(--slate)" }}>Home</Link> / <span style={{ color: "var(--ink)", fontWeight: "800" }}>My account</span></nav>
<h1 style={{ margin: "0 0 6px", fontSize: "40px", letterSpacing: "-.045em" }} className="h">My account<span style={{ color: "var(--red-text)" }}>.</span></h1>
<p style={{ margin: "0 0 24px", fontSize: "14px" }} className="meta">The account area is kept out of the sitemap and search index; everything here is visible to you only.</p>
<div style={{ display: "grid", gridTemplateColumns: "252px minmax(0,1fr)", gap: "32px", alignItems: "start" }} className="cols">
{/* 侧边导航 */}
<aside style={{ display: "flex", flexDirection: "column", gap: "18px" }}>
<div style={{ padding: "20px" }} className="panel">
<div style={{ display: "flex", gap: "13px", alignItems: "center", paddingBottom: "16px", borderBottom: "1px solid var(--line)", marginBottom: "14px" }}>
<span style={{ width: "46px", height: "46px", borderRadius: "999px", background: "var(--ink)", color: "var(--on-ink)", display: "inline-flex", alignItems: "center", justifyContent: "center", fontSize: "16px", fontWeight: "800", flexShrink: "0" }}>{DEMO.initials}</span>
<div style={{ minWidth: "0" }}><div style={{ fontSize: "15px", fontWeight: "800" }}>{DEMO.name}</div><div style={{ display: "flex", alignItems: "center", gap: "6px", marginTop: "3px" }}><span style={{ background: "var(--ink)", color: "var(--on-ink)", fontSize: "9.5px", fontWeight: "800", letterSpacing: ".1em", padding: "3px 7px", borderRadius: "4px" }}>PRO</span><span className="meta">since {DEMO.since}</span></div></div>
</div>
<div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
<a href="#settings" className="navi">Profile</a>
<a href="#submissions" className="navi on">My submissions<span className="ct">5</span></a>
<a href="#comments" className="navi">My comments<span className="ct">3</span></a>
<a href="#author" className="navi">Author profile</a>
<a href="#bookmarks" className="navi">Bookmarks<span className="ct">12</span></a>
<a href="#messages" className="navi">My messages<span className="ct">2</span></a>
<a href="#company" className="navi">My company<span style={{ background: "var(--red)", color: "#FFFFFF" }} className="ct">Claimed</span></a>
<a href="#billing" className="navi">Subscription &amp; billing</a>
<a href="#notifications" className="navi">Notifications<span className="ct">2</span></a>
<a href="#settings" className="navi">Account settings</a>
</div>
<div style={{ borderTop: "1px solid var(--line)", marginTop: "14px", paddingTop: "14px" }}>
<div style={{ fontSize: "10.5px", fontWeight: "800", letterSpacing: ".1em", color: "var(--grey)", marginBottom: "8px" }}>YOUR ROLES</div>
<div style={{ display: "flex", gap: "6px", flexWrap: "wrap", marginBottom: "12px" }}>
<span style={{ background: "var(--ink)", color: "var(--on-ink)", fontSize: "10.5px", fontWeight: "800", letterSpacing: ".06em", padding: "4px 9px", borderRadius: "4px" }}>READER</span>
<span style={{ background: "var(--ink)", color: "var(--on-ink)", fontSize: "10.5px", fontWeight: "800", letterSpacing: ".06em", padding: "4px 9px", borderRadius: "4px" }}>AUTHOR</span>
<span style={{ background: "var(--red)", color: "#FFFFFF", fontSize: "10.5px", fontWeight: "800", letterSpacing: ".06em", padding: "4px 9px", borderRadius: "4px" }}>COMPANY</span>
</div>
<p style={{ margin: "0 0 14px", lineHeight: "1.55", fontSize: "11.5px" }} className="meta">Roles stack; there is nothing to choose at registration. A published submission adds Author, a verified claim adds Company, and the matching panels appear.</p>
<Link href="/signin/" style={{ color: "var(--slate)" }} className="navi">Sign out</Link></div>
</div>
<div style={{ padding: "20px", background: "var(--surface-dark)", color: "#FFFFFF", border: "0" }} className="panel">
<div style={{ fontSize: "17px", marginBottom: "7px", color: "#FFFFFF" }} className="h">Have something to share?</div>
<p style={{ margin: "0 0 13px", fontSize: "13px", fontWeight: "500", lineHeight: "1.55", color: "var(--on-dark-2)" }}>Technical experience, project case studies and industry observations are all welcome; editors review before publication.</p>
<Link href="/submit/" style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", width: "100%", boxSizing: "border-box", minHeight: "44px", borderRadius: "10px", background: "var(--red)", color: "#FFFFFF", fontSize: "14px", fontWeight: "800" }}>New submission</Link>
</div>
</aside>
{/* 主面板：我的稿件 */}
<div style={{ display: "flex", flexDirection: "column", gap: "26px" }}>
<div className="panel" id="submissions" style={{ scrollMarginTop: "24px" }}>
<div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: "16px", flexWrap: "wrap", padding: "20px 22px", borderBottom: "2px solid var(--ink)" }}>
<h2 style={{ margin: "0", fontSize: "23px" }} className="h">My submissions</h2>
<div style={{ display: "flex", gap: "7px", flexWrap: "wrap" }}>
<button type="button" className="btn dark">All</button>
<button type="button" className="btn">Draft</button>
<button type="button" className="btn">Pending</button>
<button type="button" className="btn">Changes requested</button>
<button type="button" className="btn">Published</button>
</div>
</div>
<div className="row">
<div style={{ flex: "1 1 auto", display: "flex", flexDirection: "column", gap: "7px", minWidth: "0" }}>
<div style={{ display: "flex", gap: "10px", alignItems: "center", flexWrap: "wrap" }}><St kind="red">CHANGES REQUESTED</St><span className="meta">Submitted 9 Oct · Reviewed 11 Oct</span></div>
<Link href="/submit/" style={{ fontSize: "19px" }} className="h">Hot-dip galvanizing thickness: what the mill certificate leaves out</Link>
<div style={{ background: "var(--st-red-bg)", borderLeft: "4px solid var(--red)", borderRadius: "0 8px 8px 0", padding: "12px 16px", marginTop: "4px" }}>
<div style={{ fontSize: "11px", fontWeight: "800", letterSpacing: ".1em", color: "var(--red-deep)", marginBottom: "4px" }}>EDITOR&apos;S NOTE</div>
<div style={{ fontSize: "13.5px", fontWeight: "500", lineHeight: "1.6", color: "var(--fg-3)" }}>The coating-weight figures in section 2 need a source: name the test method and the standard the values are measured against. Resubmit when the table carries both.</div>
</div>
</div>
<div style={{ display: "flex", flexDirection: "column", gap: "8px", flexShrink: "0" }}><Link href="/submit/" className="btn dark">Edit &amp; resubmit</Link><button type="button" className="btn">View</button></div>
</div>
<div className="row">
<div style={{ flex: "1 1 auto", display: "flex", flexDirection: "column", gap: "7px", minWidth: "0" }}>
<div style={{ display: "flex", gap: "10px", alignItems: "center", flexWrap: "wrap" }}><St kind="amber">PENDING REVIEW</St><span className="meta">Submitted 11 Oct · body locked</span></div>
<span style={{ fontSize: "19px" }} className="h">Field notes: installing 358 mesh on uneven ground</span>
<p style={{ margin: "0", lineHeight: "1.5" }} className="meta">With the editors; a reply usually takes five working days. You can withdraw it to draft while it is in review.</p>
</div>
<div style={{ display: "flex", flexDirection: "column", gap: "8px", flexShrink: "0" }}><button type="button" className="btn">Withdraw to draft</button><button type="button" className="btn">Preview</button></div>
</div>
<div className="row">
<div style={{ flex: "1 1 auto", display: "flex", flexDirection: "column", gap: "7px", minWidth: "0" }}>
<div style={{ display: "flex", gap: "10px", alignItems: "center", flexWrap: "wrap" }}><St kind="grey">DRAFT</St><span className="meta">Last saved 12 Oct 09:14</span></div>
<Link href="/submit/" style={{ fontSize: "19px" }} className="h">Untitled draft — Comparing weld shear results across three suppliers</Link>
<p style={{ margin: "0", lineHeight: "1.5" }} className="meta">Drafts are visible to you only; edit, preview and submit at any time.</p>
</div>
<div style={{ display: "flex", flexDirection: "column", gap: "8px", flexShrink: "0" }}><Link href="/submit/" className="btn dark">Continue editing</Link><button type="button" className="btn">Delete</button></div>
</div>
<div className="row">
<div style={{ flex: "1 1 auto", display: "flex", flexDirection: "column", gap: "7px", minWidth: "0" }}>
<div style={{ display: "flex", gap: "10px", alignItems: "center", flexWrap: "wrap" }}><St kind="green">PUBLISHED</St><span className="meta">Published 21 Sep · one edit awaiting review</span></div>
<Link href={articleHref(published)} style={{ fontSize: "19px" }} className="h">{published.title}</Link>
<p style={{ margin: "0", lineHeight: "1.5" }} className="meta">While an edit is in review the live article stays as it is; the new version replaces it once approved.</p>
</div>
<div style={{ display: "flex", flexDirection: "column", gap: "8px", flexShrink: "0" }}><Link href={articleHref(published)} className="btn">View live</Link><Link href="/submit/" className="btn">Submit an edit</Link></div>
</div>
<div style={{ borderBottom: "0" }} className="row">
<div style={{ flex: "1 1 auto", display: "flex", flexDirection: "column", gap: "7px", minWidth: "0" }}>
<div style={{ display: "flex", gap: "10px", alignItems: "center", flexWrap: "wrap" }}><St kind="grey">NOT ACCEPTED</St><span className="meta">Reviewed 2 Sep</span></div>
<span style={{ fontSize: "19px", color: "var(--slate)" }} className="h">Five reasons our panels beat the competition</span>
<p style={{ margin: "0", lineHeight: "1.5" }} className="meta">Reason: product promotion without verifiable test data. A new submission on the same topic is treated as new.</p>
</div>
<div style={{ display: "flex", flexDirection: "column", gap: "8px", flexShrink: "0" }}><Link href="/policies/submission-guidelines/" className="btn">View reason</Link></div>
</div>
</div>
{/* 其他面板 */}
<div>
<div style={{ display: "flex", alignItems: "baseline", gap: "12px", marginBottom: "14px" }}>
<h2 style={{ margin: "0", fontSize: "21px" }} className="h">Other panels</h2>
<span className="meta">Switch with the left-hand navigation</span>
</div>
<div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px" }} className="cols">
<div className="mini" id="comments">
<div className="minihd"><span style={{ fontSize: "17px" }} className="h">My comments</span><span className="meta">3</span></div>
<div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
<div style={{ display: "flex", flexDirection: "column", gap: "5px" }}><div style={{ display: "flex", gap: "9px", alignItems: "center" }}><St kind="green">APPROVED</St><span className="meta">10 Oct</span></div><span style={{ fontSize: "13.5px", fontWeight: "500", lineHeight: "1.5" }}>We measured 275 g/m² on the same panels; the site figure matched the certificate for once. <Link href={articleHref(arts[1])} style={{ color: "var(--red-text)", fontWeight: "800" }}>On: {arts[1].title}</Link></span><div style={{ display: "flex", gap: "14px", fontSize: "12.5px", fontWeight: "700", color: "var(--slate)" }}><button type="button" className="btn" style={{ minHeight: "30px", padding: "0 10px", fontSize: "12px" }}>Edit</button><button type="button" className="btn" style={{ minHeight: "30px", padding: "0 10px", fontSize: "12px" }}>Delete</button></div></div>
<div style={{ display: "flex", flexDirection: "column", gap: "5px", paddingTop: "12px", borderTop: "1px solid var(--line)" }}><div style={{ display: "flex", gap: "9px", alignItems: "center" }}><St kind="amber">PENDING</St><span className="meta">12 Oct</span></div><span style={{ fontSize: "13.5px", fontWeight: "500", lineHeight: "1.5" }}>Which edition of EN 10244-2 is the table based on? The 2009 and 2023 class names differ. — shown to other readers once approved.</span></div>
</div>
<p style={{ margin: "0", lineHeight: "1.55" }} className="meta">Editing an approved comment sends it back to review.</p>
</div>
<div className="mini" id="bookmarks">
<div className="minihd"><span style={{ fontSize: "17px" }} className="h">Bookmarks</span><span className="meta">12</span></div>
<div style={{ display: "flex", flexDirection: "column", gap: "13px" }}>
{saved.map((a, i) => (
<Link key={a.slug} href={articleHref(a)} style={{ display: "flex", gap: "12px", alignItems: "flex-start" }}><span style={{ width: "62px", height: "46px", borderRadius: "7px", background: "var(--line)", flexShrink: "0", ...demoBg(a.slug) }}></span><span style={{ display: "flex", flexDirection: "column", gap: "3px" }}><span style={{ fontSize: "14px", fontWeight: "800", lineHeight: "1.3" }}>{a.title}</span><span className="meta">{sectionByCode(a.section)?.label} · saved {["12 Oct", "9 Oct", "5 Oct"][i]}</span></span></Link>
))}
<Link href={`/directory/${co.slug}/`} style={{ display: "flex", gap: "12px", alignItems: "flex-start" }}><span style={{ width: "62px", height: "46px", borderRadius: "7px", background: "var(--line)", flexShrink: "0" }}></span><span style={{ display: "flex", flexDirection: "column", gap: "3px" }}><span style={{ fontSize: "14px", fontWeight: "800", lineHeight: "1.3" }}>{co.name}</span><span className="meta">Directory · saved 2 Oct</span></span></Link>
</div>
<a href="#bookmarks" style={{ fontSize: "12.5px", fontWeight: "800", letterSpacing: ".06em", color: "var(--red-text)" }}>ALL BOOKMARKS →</a>
</div>
<div className="mini" id="notifications">
<div className="minihd"><span style={{ fontSize: "17px" }} className="h">Notifications</span><button type="button" style={{ minHeight: "34px", fontSize: "12px" }} className="btn">Mark all read</button></div>
<div style={{ display: "flex", flexDirection: "column", gap: "13px" }}>
<div style={{ display: "flex", gap: "11px", alignItems: "flex-start" }}><span style={{ width: "9px", height: "9px", borderRadius: "999px", background: "var(--red)", flexShrink: "0", marginTop: "6px" }}></span><div><div style={{ fontSize: "14px", fontWeight: "700", lineHeight: "1.45" }}>The editors returned “Hot-dip galvanizing thickness…” — see the note on your submission.</div><span className="meta">11 Oct 16:20</span></div></div>
<div style={{ display: "flex", gap: "11px", alignItems: "flex-start" }}><span style={{ width: "9px", height: "9px", borderRadius: "999px", background: "var(--red)", flexShrink: "0", marginTop: "6px" }}></span><div><div style={{ fontSize: "14px", fontWeight: "700", lineHeight: "1.45" }}>Your comment was approved and is now public.</div><span className="meta">10 Oct 09:05</span></div></div>
<div style={{ display: "flex", gap: "11px", alignItems: "flex-start", opacity: ".6" }}><span style={{ width: "9px", height: "9px", borderRadius: "999px", background: "var(--line-2)", flexShrink: "0", marginTop: "6px" }}></span><div><div style={{ fontSize: "14px", fontWeight: "700", lineHeight: "1.45" }}>“{published.title}” has been published.</div><span className="meta">21 Sep 11:42</span></div></div>
</div>
<p style={{ margin: "0", lineHeight: "1.55" }} className="meta">Notifications only concern your own content; whether they are also emailed is set under Account settings.</p>
</div>
<AccountSettings />
<div className="mini" id="messages">
<div className="minihd"><span style={{ fontSize: "17px" }} className="h">My messages</span><span className="meta">2</span></div>
<p style={{ margin: "0", lineHeight: "1.55" }} className="meta">Messages you sent through “Contact this company”. Companies reply straight to your email; there is no on-site chat.</p>
<div style={{ display: "flex", flexDirection: "column", gap: "13px" }}>
<div style={{ display: "flex", flexDirection: "column", gap: "6px", paddingBottom: "13px", borderBottom: "1px solid var(--line)" }}>
<div style={{ display: "flex", alignItems: "center", gap: "9px", flexWrap: "wrap" }}><St kind="green">REPLIED</St><span className="meta">Sent 9 Oct · replied 10 Oct</span></div>
<span style={{ fontSize: "14px", fontWeight: "800", lineHeight: "1.3" }}>Product enquiry · Welded mesh panel</span>
<span className="meta">To <Link href={`/directory/${co.slug}/`} style={{ color: "var(--red-text)", fontWeight: "800" }}>{co.name}</Link></span>
</div>
<div style={{ display: "flex", flexDirection: "column", gap: "6px", paddingBottom: "13px", borderBottom: "1px solid var(--line)" }}>
<div style={{ display: "flex", alignItems: "center", gap: "9px", flexWrap: "wrap" }}><St kind="amber">AWAITING REPLY</St><span className="meta">Sent 12 Oct · 2 days ago</span></div>
<span style={{ fontSize: "14px", fontWeight: "800", lineHeight: "1.3" }}>Technical question · Coating weight</span>
<span className="meta">To <Link href={`/directory/${COMPANIES[1].slug}/`} style={{ color: "var(--red-text)", fontWeight: "800" }}>{COMPANIES[1].name}</Link></span>
</div>
<div style={{ display: "flex", flexDirection: "column", gap: "6px", opacity: ".6" }}>
<div style={{ display: "flex", alignItems: "center", gap: "9px", flexWrap: "wrap" }}><span style={{ background: "var(--st-withdrawn-bg)", color: "var(--slate)" }} className="st">NO REPLY</span><span className="meta">Sent 2 Sep · no reply after 30 days</span></div>
<span style={{ fontSize: "14px", fontWeight: "800", lineHeight: "1.3" }}>Sample request · Gabion</span>
<span className="meta">To {COMPANIES[2].name}</span>
</div>
</div>
<div style={{ background: "var(--paper)", borderRadius: "9px", padding: "12px 15px", fontSize: "12.5px", fontWeight: "500", lineHeight: "1.6", color: "var(--fg-3)" }}>We <b>do not guarantee a reply</b> and we do not chase on your behalf. Companies that never answer are noted internally, but reply rates are not published: statistics from samples this small mislead.</div>
<div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}><button type="button" className="btn">Export record</button><Link href="/directory/" className="btn">Browse the directory</Link></div>
</div>
<div className="mini" id="company">
<div className="minihd"><span style={{ fontSize: "17px" }} className="h">My company</span><St kind="green">CLAIMED</St></div>
<div style={{ display: "flex", gap: "13px", alignItems: "flex-start", paddingBottom: "14px", borderBottom: "1px solid var(--line)" }}>
<span style={{ width: "46px", height: "46px", borderRadius: "11px", background: "var(--line)", flexShrink: "0" }}></span>
<div style={{ minWidth: "0" }}><div style={{ fontSize: "15px", fontWeight: "800" }}>{co.name}</div><div className="meta">Manufacturer · {co.city}</div><Link href={`/directory/${co.slug}/`} style={{ fontSize: "12px", fontWeight: "800", color: "var(--red-text)" }}>View public profile &#8594;</Link></div>
</div>
<div style={{ display: "flex", flexDirection: "column", gap: "10px", fontSize: "13.5px", fontWeight: "500" }}>
<div style={{ display: "flex", justifyContent: "space-between", gap: "12px" }}><span style={{ color: "var(--slate)" }}>Claim approved</span><b>{co.verifiedAt ?? "—"}</b></div>
<div style={{ display: "flex", justifyContent: "space-between", gap: "12px" }}><span style={{ color: "var(--slate)" }}>Verified by</span><b>Company-domain email</b></div>
<div style={{ display: "flex", justifyContent: "space-between", gap: "12px" }}><span style={{ color: "var(--slate)" }}>Edits in review</span><b style={{ color: "var(--st-review-fg)" }}>1</b></div>
</div>
<div className="note">Your change to “Product range” is in review. The public page keeps the previous content until it is approved.</div>
<div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}><button type="button" className="btn dark">Edit company profile</button><button type="button" className="btn">Change history</button></div>
<p style={{ margin: "0", lineHeight: "1.55" }} className="meta">Editable: summary, product range, certifications, contact details, event plans. Not editable: category, related coverage, editorial notes.</p>
</div>
<div className="mini" id="author">
<div className="minihd"><span style={{ fontSize: "17px" }} className="h">Author profile</span><St kind="mint">PUBLIC</St></div>
<p style={{ margin: "0", lineHeight: "1.55" }} className="meta">Shown on your author page and on the author card of every article. Only accounts with a published article have an author page.</p>
<div style={{ display: "flex", flexDirection: "column", gap: "11px" }}>
<div style={{ display: "flex", flexDirection: "column", gap: "5px" }}><label htmlFor="ab" className="lbl">BIO</label><textarea id="ab" rows={2} className="inp" defaultValue="Fencing contractor for twelve years, now a specification consultant for perimeter projects." /></div>
<div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px" }}>
<div style={{ display: "flex", flexDirection: "column", gap: "5px" }}><label htmlFor="ae" className="lbl">PUBLIC EMAIL</label><input id="ae" type="email" className="inp" placeholder="author@wiremeshnews.com" /></div>
<div style={{ display: "flex", flexDirection: "column", gap: "5px" }}><label htmlFor="al" className="lbl">LINKEDIN</label><input id="al" type="url" className="inp" placeholder="linkedin.com/in/" /></div>
<div style={{ display: "flex", flexDirection: "column", gap: "5px" }}><label htmlFor="ax" className="lbl">X / TWITTER</label><input id="ax" type="text" className="inp" placeholder="@handle" /></div>
<div style={{ display: "flex", flexDirection: "column", gap: "5px" }}><label htmlFor="aw" className="lbl">WEBSITE</label><input id="aw" type="url" className="inp" placeholder="https://" /></div>
</div>
<div style={{ display: "flex", flexDirection: "column", gap: "5px" }}><label htmlFor="af" className="lbl">FIELDS OF EXPERTISE</label><input id="af" type="text" className="inp" placeholder="Comma-separated, up to five" /></div>
</div>
<div className="note">A public email gets scraped; use a forwarding address rather than your everyday one. <b>Your registration email is never shown.</b> Changing the by-line name needs an editor&apos;s confirmation, and by-lines on published articles do not change with the account name.</div>
<div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}><button type="button" className="btn dark">Save</button><Link href="/authors/mei-lin/" className="btn">Preview author page</Link></div>
</div>
<div className="mini" id="billing">
<div className="minihd"><span style={{ fontSize: "17px" }} className="h">Subscription &amp; billing</span><St kind="green">ACTIVE</St></div>
<div style={{ background: "var(--surface-dark)", color: "#FFFFFF", borderRadius: "12px", padding: "16px 18px" }}>
<div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", gap: "12px", marginBottom: "7px" }}>
<span style={{ fontSize: "19px", color: "#FFFFFF" }} className="h">Pro</span>
<span style={{ fontSize: "15px", fontWeight: "800" }}>Price to be announced</span>
</div>
<div style={{ fontSize: "12.5px", fontWeight: "500", color: "var(--grey-3)", lineHeight: "1.55" }}>Next charge — · payment method ···· 4242</div>
</div>
<div style={{ display: "flex", flexDirection: "column", gap: "9px", fontSize: "13.5px", fontWeight: "500" }}>
<div style={{ display: "flex", gap: "10px" }}><span style={{ color: "var(--red-text)", fontWeight: "800", flexShrink: "0" }}>&#183;</span><span>No display advertising anywhere on the site</span></div>
<div style={{ display: "flex", gap: "10px" }}><span style={{ color: "var(--red-text)", fontWeight: "800", flexShrink: "0" }}>&#183;</span><span>Per-standard alerts and the full market-data look-back</span></div>
</div>
<div style={{ borderTop: "1px solid var(--line)", paddingTop: "13px" }}>
<div style={{ fontSize: "11.5px", fontWeight: "800", letterSpacing: ".1em", color: "var(--slate)", marginBottom: "10px" }}>BILLING HISTORY</div>
<div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: "10px", padding: "7px 0", fontSize: "13.5px" }}><span style={{ fontWeight: "700" }}>1 Oct 2026</span><span style={{ color: "var(--slate)", fontWeight: "500" }}>—</span><span style={{ fontSize: "12.5px", fontWeight: "800", color: "var(--red-text)" }}>Invoice</span></div>
<div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: "10px", padding: "7px 0", borderTop: "1px solid var(--line)", fontSize: "13.5px" }}><span style={{ fontWeight: "700" }}>1 Sep 2026</span><span style={{ color: "var(--slate)", fontWeight: "500" }}>—</span><span style={{ fontSize: "12.5px", fontWeight: "800", color: "var(--red-text)" }}>Invoice</span></div>
</div>
<div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}><button type="button" className="btn">Change payment method</button><button type="button" className="btn">Invoice details</button><button type="button" style={{ color: "var(--red-deep)", borderColor: "var(--st-red-bg)" }} className="btn">Cancel subscription</button></div>
</div>
</div>
</div>
</div>
</div>
</div>
</section>
    </Shell>
  );
}
