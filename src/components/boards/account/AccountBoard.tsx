/* Account-G (user centre). Phase 1 has no account backend, so this builds a full sample
   account from the site's own content and hands it to the client app, where every panel can
   be edited and every action works against browser-local demo state. noindex, not in the
   sitemap; no advertising. */
import { Shell } from "@/components/shell/Shell";
import { ARTICLES, latest, getArticle } from "@/lib/content/articles";
import { COMPANIES } from "@/lib/content/directory";
import { STANDARDS, EVENTS } from "@/lib/content/source";
import { articleHref, sectionByCode, fmtDate } from "@/lib/site";
import { subdivisionsOf } from "@/lib/vocab-geo";
import { editorRefs } from "@/lib/editor-refs";
import { AccountApp } from "./AccountApp";
import { DEMO_VERSION, type Demo } from "./store";
import { emptyDraft, type ArticleDraft } from "@/components/editor/draft";
import type { Article } from "@/lib/content/types";
import "@/styles/board-acct.css";

const BYLINE = "Jordan Dale · Specification consultant · Hengtai Mesh";
const S1_BODY = `A mill certificate tells you what the coating weighed on the day it was tested, on the sample the mill chose. It does not tell you what arrives on site after cutting, welding and transport.

## The three numbers to ask for

- **Coating mass per unit area**, with the class it claims to meet
- **Where it was measured**: on the wire before welding, or on the finished panel
- **How it was measured**: gravimetric strip test or magnetic gauge

| Measured on | Typical result |
| --- | --- |
| Wire before welding | 275 g/m² |
| Panel after welding | 190–240 g/m² |

## What usually goes missing

The measurement location. Two certificates can quote the same figure and describe two very different products, because one was measured on wire coil and the other on the panel a buyer will actually install. Ask for both, in writing, before the order is placed.`;

/* A published article as the editor sees it, so "Submit an edit" starts from the full text. */
const plain = (html: string) => html.replace(/<(strong|b)>(.*?)<\/\1>/g, "**$2**").replace(/<[^>]+>/g, "").replace(/&amp;/g, "&").replace(/&#8217;|&rsquo;/g, "’").replace(/&nbsp;/g, " ");
function articleToDraft(a: Article, byline: string): ArticleDraft {
  const body = a.body.map((b) => {
    switch (b.type) {
      case "p": return plain(b.html);
      case "h2": return `## ${b.text}`;
      case "ul": return b.items.map((i) => `- ${plain(i)}`).join("\n");
      case "quote": return `> ${b.text}${b.cite ? ` — ${b.cite}` : ""}`;
      case "checklist": return `## ${b.title}\n\n${b.items.map((i) => `- ${plain(i)}`).join("\n")}`;
      case "table": return [`| ${b.head.join(" | ")} |`, `| ${b.head.map(() => "---").join(" | ")} |`, ...b.rows.map((r) => `| ${r.join(" | ")} |`)].join("\n");
      case "spec": return [`## ${b.title}`, "", "| Item | Value |", "| --- | --- |", ...b.rows.map(([k, v]) => `| ${k} | ${v} |`)].join("\n");
      default: return "";
    }
  }).filter(Boolean).join("\n\n");
  return {
    ...emptyDraft(byline), title: a.title, dek: a.dek, body, section: a.section, subsection: a.subsection, type: a.type,
    tags: a.facets ?? [], standards: a.standards ?? [], companies: a.companies ?? [], topics: a.topics ?? [],
    sources: a.sources?.length ? a.sources.map((s) => `${s.title} — ${s.url}`) : [""], disclosure: "none", checks: [true, true, true],
  };
}
const wordsOf = (dr: ArticleDraft) => dr.body.trim().split(/\s+/).length;

const onArticle = (slug: string) => { const x = getArticle(slug)!; return { title: x.title, href: articleHref(x), slug: x.slug, section: sectionByCode(x.section)?.label ?? "", date: fmtDate(x.date) }; };

function buildSeed(): Demo {
  const arts = latest(14).filter((a) => a.type !== "sponsored");
  const a = (i: number) => arts[i % arts.length];
  const co = COMPANIES.find((c) => c.claimed) ?? COMPANIES[0];
  const others = COMPANIES.filter((c) => c.slug !== co.slug);
  const published = ARTICLES.find((x) => x.type !== "sponsored" && x.section === "technical_guides") ?? arts[0];
  const sec = (code: string) => sectionByCode(code)?.label ?? "";
  const pubDraft = articleToDraft(published, BYLINE), pub2 = a(5), pub2Draft = articleToDraft(pub2, BYLINE);
  return {
    v: DEMO_VERSION,
    profile: { name: "Jordan Dale", initials: "JD", avatar: null, jobTitle: "Specification consultant", company: co.name, country: "GB", city: "Leeds", since: "Mar 2026", email: "jordan.dale@example.com", pendingEmail: null },
    author: { bio: "Fencing contractor for twelve years, now a specification consultant for perimeter projects.", publicEmail: "", linkedin: "https://linkedin.com/in/jordan-dale-example", x: "", website: "", expertise: ["Perimeter security", "Site acceptance", "Hot-dip galvanizing"], visible: true },
    submissions: [
      { id: "s1", title: "Hot-dip galvanizing thickness: what the mill certificate leaves out", status: "changes_requested", section: "Technical Guides", updated: "11 Oct 2026", submitted: "9 Oct 2026", reviewed: "11 Oct 2026", words: 1840, note: "The coating-weight figures in section 2 need a source: name the test method and the standard the values are measured against. Resubmit when the table carries both.", excerpt: "A mill certificate tells you what the coating weighed on the day it was tested, on the sample the mill chose. It does not tell you what arrives on site after cutting, welding and transport.\n\nThis article walks through the three numbers a buyer should ask for, and the one that is usually missing: the measurement location.", draft: { ...emptyDraft(BYLINE), title: "Hot-dip galvanizing thickness: what the mill certificate leaves out", dek: "A mill certificate tells you what the coating weighed on the day it was tested. Here is what to ask for so it tells you what arrives on site.", body: S1_BODY, section: "technical_guides", subsection: "surface_treatments", type: "guide", tags: ["surface:hdg", "product:welded_mesh_panel", "process:galvanizing"], standards: ["EN 10244-2"], topics: ["zinc-coating-costs"], sources: ["EN 10244-2:2023, Table 2 (coating classes)", ""], disclosure: "yes", disclosureText: "I work as a consultant for Hengtai Mesh, a panel producer; no product is named in the article.", checks: [true, true, true] } },
      { id: "s2", title: "Field notes: installing 358 mesh on uneven ground", status: "pending", section: "Applications", updated: "11 Oct 2026", submitted: "11 Oct 2026", words: 1260, excerpt: "Uneven ground is where a 358 fence either keeps its rating or loses it. Notes from three sites on stepping versus raking panels, and what each does to the anti-climb gap at the bottom rail." },
      { id: "s3", title: "Comparing weld shear results across three suppliers", status: "draft", section: "Technical Guides", updated: "12 Oct 2026", words: 420, excerpt: "Three suppliers, one test rig, forty welds each. Early numbers below; the method section still needs the jig drawing.", draft: { ...emptyDraft(BYLINE), title: "Comparing weld shear results across three suppliers", dek: "Three suppliers, one test rig, forty welds each.", body: "Three suppliers, one test rig, forty welds each. Early numbers below; the method section still needs the jig drawing.\n\n## Method\n\nTo be written.", section: "technical_guides", subsection: "", type: "analysis", tags: ["process:welding"] } },
      { id: "s4", title: published.title, status: "published", section: sec(published.section), updated: "21 Sep 2026", submitted: "12 Sep 2026", reviewed: "19 Sep 2026", words: wordsOf(pubDraft), href: articleHref(published), excerpt: published.dek, draft: pubDraft },
      { id: "s5", title: pub2.title, status: "published", section: sec(pub2.section), updated: "2 Aug 2026", submitted: "20 Jul 2026", reviewed: "29 Jul 2026", words: wordsOf(pub2Draft), href: articleHref(pub2), excerpt: pub2.dek, draft: pub2Draft },
      { id: "s6", title: "Five reasons our panels beat the competition", status: "rejected", section: "Buying Guides", updated: "2 Sep 2026", submitted: "28 Aug 2026", reviewed: "2 Sep 2026", words: 690, note: "Product promotion without verifiable test data. A new submission on the same topic is treated as new.", excerpt: "Our panels are stronger, cheaper and faster to install than anything else on the market." },
      { id: "s7", title: "Letter: on measurement location in coating audits", status: "draft", section: "Letters", updated: "5 Oct 2026", words: 180, excerpt: "Your article on coating audits misses where the gauge goes. Two millimetres from a weld is not the same panel." },
    ],
    comments: [
      { id: "c1", text: "We measured 275 g/m² on the same panels; the site figure matched the certificate for once.", status: "approved", date: "10 Oct 2026", on: onArticle("reading-a-mill-certificate-line-by-line") },
      { id: "c2", text: "Which edition of EN 10244-2 is the table based on? The 2009 and 2023 class names differ.", status: "pending", date: "12 Oct 2026", on: onArticle("coating-weight-chain-link-test-report") },
      { id: "c3", text: "Good piece. One correction: the stepped-panel detail in figure 3 is mirrored.", status: "approved", date: "28 Sep 2026", on: onArticle("post-spacing-wind-load-footing") },
      { id: "c4", text: "Anyone who buys from the supplier in this article is an idiot.", status: "rejected", date: "14 Sep 2026", on: onArticle("chain-link-vs-welded-mesh-cost"), reason: "Personal attack; see the Comment Policy." },
    ],
    bookmarks: [
      ...arts.slice(0, 7).map((x, i) => ({ id: `b-a${i}`, kind: "article" as const, title: x.title, href: articleHref(x), meta: sec(x.section), saved: ["12 Oct", "11 Oct", "9 Oct", "7 Oct", "5 Oct", "1 Oct", "28 Sep"][i] })),
      ...others.slice(0, 2).map((c, i) => ({ id: `b-c${i}`, kind: "company" as const, title: c.name, href: `/directory/${c.slug}/`, meta: "Directory", saved: ["2 Oct", "20 Sep"][i] })),
      ...STANDARDS.slice(0, 2).map((s, i) => ({ id: `b-s${i}`, kind: "standard" as const, title: `${s.no} — ${s.title}`, href: `/standards/${s.slug}/`, meta: "Standards index", saved: ["30 Sep", "18 Sep"][i] })),
      ...EVENTS.slice(0, 1).map((e) => ({ id: `b-e-${e.slug}`, kind: "event" as const, title: e.name, href: `/events/#${e.slug}`, meta: `Events · ${fmtDate(e.start)}`, saved: "15 Sep" })),
    ],
    messages: [
      { id: "m1", subject: "Product enquiry · Welded mesh panel", to: { name: co.name, href: `/directory/${co.slug}/` }, status: "replied", sent: "9 Oct 2026", replied: "10 Oct 2026", product: "Welded mesh panel", quantity: "1,200 panels", body: "Hello,\n\nWe are pricing a 2.4 km perimeter for a logistics site in Leeds. Could you quote 1,200 panels, 2,030 mm high, 4 mm wire, hot-dip then powder coated RAL 6005, delivered Felixstowe?\n\nThanks,\nJordan Dale" },
      { id: "m2", subject: "Technical question · Coating weight", to: { name: others[0].name, href: `/directory/${others[0].slug}/` }, status: "awaiting_reply", sent: "12 Oct 2026", body: "Could you confirm the coating class on your posts and where on the post it is measured?" },
      { id: "m3", subject: "Sample request · Gabion", to: { name: others[1].name, href: `/directory/${others[1].slug}/` }, status: "no_reply", sent: "2 Sep 2026", product: "Gabion box & mattress", body: "We would like two sample boxes, 1 × 1 × 1 m, Zn-Al coated, for a slope trial." },
      { id: "m4", subject: "Catalogue request", to: { name: others[2].name, href: `/directory/${others[2].slug}/` }, status: "replied", sent: "18 Aug 2026", replied: "19 Aug 2026", body: "Please send your current catalogue and data sheets for woven wire cloth." },
    ],
    notices: [
      { id: "n1", kind: "submission", text: "The editors returned “Hot-dip galvanizing thickness…” — see the note on your submission.", date: "11 Oct 2026 16:20", read: false },
      { id: "n2", kind: "company", text: `Your change to ${co.name}'s product range is in review.`, date: "11 Oct 2026 09:12", read: false },
      { id: "n3", kind: "comment", text: "Your comment was approved and is now public.", date: "10 Oct 2026 09:05", read: false },
      { id: "n4", kind: "standard", text: `${STANDARDS[0].no} — status confirmed by the editors.`, date: "6 Oct 2026 10:40", read: true, href: `/standards/${STANDARDS[0].slug}/` },
      { id: "n5", kind: "billing", text: "Payment received for October. Invoice WMN-2026-0010 is ready.", date: "1 Oct 2026 08:00", read: true },
      { id: "n6", kind: "submission", text: `“${published.title}” has been published.`, date: "21 Sep 2026 11:42", read: true },
    ],
    prefs: { brief: true, reviewResults: true, commentReplies: true, standardAlerts: true, companyEnquiries: true, productNews: false },
    sessions: [
      { id: "se1", device: "Chrome on Windows", place: "Leeds, United Kingdom", last: "Active now", current: true },
      { id: "se2", device: "Safari on iPhone", place: "Leeds, United Kingdom", last: "2 hours ago" },
      { id: "se3", device: "Edge on Windows", place: "Shanghai, China", last: "9 Oct 2026" },
    ],
    deactivated: false,
    contacts: COMPANIES.filter((c) => c.claimed).map((c) => ({ name: c.name, href: `/directory/${c.slug}/` })),
    billing: (() => {
      const details = { name: "Jordan Dale", company: co.name, email: "billing@example.com", country: "GB", address: "", taxId: "" };
      return {
        cycle: "monthly" as const, nextCycle: null, cancelled: false, cancelReason: "",
        cards: [{ id: "a", brand: "Visa", last4: "4242", exp: "08/28" }, { id: "b", brand: "Mastercard", last4: "5100", exp: "02/27" }], defaultCard: "a",
        details,
        invoices: [
          { no: "WMN-2026-0010", date: "1 Oct 2026", period: "1 Oct – 31 Oct 2026", billedTo: details },
          { no: "WMN-2026-0009", date: "1 Sep 2026", period: "1 Sep – 30 Sep 2026", billedTo: { ...details, address: "14 Wellington St, Leeds LS1 4DL" } },
        ],
      };
    })(),
  };
}

export function AccountBoard() {
  const co = COMPANIES.find((c) => c.claimed) ?? COMPANIES[0];
  const related = ARTICLES.filter((x) => x.type !== "sponsored" && x.companies?.includes(co.slug)).slice(0, 4).map((x) => ({ title: x.title, href: articleHref(x) }));
  return (
    <Shell header="compact" board="b-acct">
      <section style={{ background: "var(--paper)", paddingTop: "24px", paddingBottom: "56px" }}>
        <div className="wrap">
          <AccountApp seed={buildSeed()} co={co} related={related} subs0={subdivisionsOf(co.country)} refs={editorRefs()} />
        </div>
      </section>
    </Shell>
  );
}
