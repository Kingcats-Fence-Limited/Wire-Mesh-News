"use client";

/* Account-G user centre, as a single-page app: the left navigation switches panels in
   place (the URL hash follows, so links, reloads and the back button work) instead of
   scrolling a long page. */
import Link from "next/link";
import { Component, useCallback, useEffect, useRef, useState, type ReactNode } from "react";
import { DemoProvider, useDemo, type Demo } from "./store";
import { Overview, Profile, Notifications, Settings } from "./PanelsAccount";
import { Submissions, Comments, AuthorProfile, Bookmarks, Messages, Avatar } from "./PanelsContent";
import { CompanyPanel } from "./CompanyPanel";
import { BillingPanel } from "./BillingPanel";
import { ConfirmBtn, Head } from "./ui";
import type { Company } from "@/lib/content/types";
import type { SubOpt } from "@/lib/vocab-geo";
import type { EditorRefs } from "@/components/editor/draft";

const PANELS = ["overview", "profile", "submissions", "comments", "author", "bookmarks", "messages", "company", "billing", "notifications", "settings"] as const;
type PanelId = (typeof PANELS)[number];
const ALIAS: Record<string, PanelId> = { "": "overview" };
const toPanel = (h: string): PanelId => (PANELS as readonly string[]).includes(h) ? (h as PanelId) : ALIAS[h] ?? "overview";

type Props = { seed: Demo; co: Company; related: { title: string; href: string }[]; subs0: SubOpt[]; refs: EditorRefs };

export function AccountApp(props: Props) {
  const [panel, setPanel] = useState<PanelId>("overview");
  const top = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const sync = () => {
      const h = location.hash.slice(1), id = toPanel(h);
      /* An unknown or empty hash shows Overview; tidy the address bar to match. */
      if (h && h !== id) history.replaceState(null, "", `#${id}`);
      setPanel(id);
    };
    sync();
    window.addEventListener("hashchange", sync);
    window.addEventListener("popstate", sync);
    return () => { window.removeEventListener("hashchange", sync); window.removeEventListener("popstate", sync); };
  }, []);

  const go = useCallback((p: string) => {
    const id = toPanel(p);
    setPanel(id);
    if (location.hash.slice(1) !== id) history.pushState(null, "", `#${id}`);
    const el = top.current;
    if (el && el.getBoundingClientRect().top < 0) el.scrollIntoView({ block: "start" });
  }, []);

  return (
    <Recover>
      <DemoProvider seed={props.seed} go={go}>
        <Shell {...props} panel={panel} go={go} topRef={top} />
      </DemoProvider>
    </Recover>
  );
}

/* If saved demo data ever breaks a panel, offer a clean start instead of a dead page. */
class Recover extends Component<{ children: ReactNode }, { failed: boolean }> {
  state = { failed: false };
  static getDerivedStateFromError() { return { failed: true }; }
  render() {
    if (!this.state.failed) return this.props.children;
    return (
      <div className="panel" role="alert" style={{ padding: "24px", display: "flex", flexDirection: "column", gap: "12px", alignItems: "flex-start" }}>
        <b className="h" style={{ fontSize: "20px" }}>This preview could not load your saved demo data.</b>
        <span className="meta">It was probably saved by an older version of the page. Starting again clears only the demo data in this browser.</span>
        <button type="button" className="btn dark" onClick={() => { try { localStorage.removeItem("wmn-demo-account"); } catch { /* ignore */ } location.reload(); }}>Start again with the sample data</button>
      </div>
    );
  }
}

function Shell({ co, related, subs0, refs, panel, go, topRef }: Props & { panel: PanelId; go: (p: string) => void; topRef: React.RefObject<HTMLDivElement | null> }) {
  const { d, reset, epoch } = useDemo();
  const unread = d.notices.filter((n) => !n.read && !n.archived).length;
  const needs = d.submissions.filter((s) => s.status === "changes_requested").length;
  const NAV: { group: string; items: { id: PanelId; label: string; count?: number | string; alert?: boolean }[] }[] = [
    { group: "", items: [{ id: "overview", label: "Overview" }] },
    { group: "YOU", items: [{ id: "profile", label: "Profile" }, { id: "author", label: "Author profile" }, { id: "settings", label: "Account settings" }] },
    { group: "CONTENT", items: [{ id: "submissions", label: "My submissions", count: needs ? `${needs} to fix` : d.submissions.length, alert: needs > 0 }, { id: "comments", label: "My comments", count: d.comments.length }, { id: "bookmarks", label: "Bookmarks", count: d.bookmarks.length }, { id: "messages", label: "My messages", count: d.messages.length }] },
    { group: "COMPANY & BILLING", items: [{ id: "company", label: "My company", count: "Claimed" }, { id: "billing", label: "Subscription & billing" }] },
    { group: "", items: [{ id: "notifications", label: "Notifications", count: unread || undefined, alert: unread > 0 }] },
  ];
  const flat = NAV.flatMap((g) => g.items);
  const link = (it: (typeof flat)[number], mobile = false) => (
    <a key={it.id} href={`#${it.id}`} aria-current={panel === it.id ? "page" : undefined} onClick={(e) => { e.preventDefault(); go(it.id); }} className={`navi${panel === it.id ? " on" : ""}${mobile ? " mob" : ""}`}>
      {it.label}
      {it.count !== undefined && <span className={`ct${it.alert || it.count === "Claimed" ? " hot" : ""}`}>{it.count}</span>}
    </a>
  );

  return (
    <>
      <div className="pbar">
        <span className="tag">PREVIEW</span>
        <span style={{ flex: "1 1 260px" }}>Sample account with test data. Everything is editable and every button works; changes stay in this browser only.</span>
        <ConfirmBtn label="Reset demo data" confirm="Reset" small onConfirm={reset} />
        <Link href="/signin/" style={{ color: "#FFFFFF", textDecoration: "underline", fontWeight: 800 }}>Sign-in page</Link>
      </div>
      <nav aria-label="Breadcrumb" style={{ fontSize: "12.5px", fontWeight: 500, color: "var(--slate)", marginBottom: "12px" }}><Link href="/" style={{ color: "var(--slate)" }}>Home</Link> / <span style={{ color: "var(--ink)", fontWeight: 800 }}>My account</span></nav>

      <h1 className="sr-only">My account</h1>
      <div className="acct" ref={topRef} style={{ scrollMarginTop: "16px" }}>
        <aside className="side">
          <div className="panel" style={{ padding: "18px" }}>
            <div style={{ display: "flex", gap: "12px", alignItems: "center", paddingBottom: "14px", borderBottom: "1px solid var(--line)", marginBottom: "10px" }}>
              <Avatar />
              <div style={{ minWidth: 0 }}><div style={{ fontSize: "15px", fontWeight: 800, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{d.profile.name}</div><div style={{ display: "flex", alignItems: "center", gap: "6px", marginTop: "3px" }}><span className="rl">PRO</span><span className="meta">since {d.profile.since}</span></div></div>
            </div>
            <nav aria-label="Account" className="navlist">
              {NAV.map((g, i) => (
                <div key={i} style={{ display: "flex", flexDirection: "column", gap: "2px", paddingTop: i ? "8px" : 0, marginTop: i ? "8px" : 0, borderTop: i ? "1px solid var(--line)" : undefined }}>
                  {g.group && <span className="grp">{g.group}</span>}
                  {g.items.map((it) => link(it))}
                </div>
              ))}
            </nav>
            <div style={{ borderTop: "1px solid var(--line)", marginTop: "10px", paddingTop: "12px" }}>
              <div className="grp" style={{ padding: 0, marginBottom: "7px" }}>YOUR ROLES</div>
              <div style={{ display: "flex", gap: "6px", flexWrap: "wrap", marginBottom: "10px" }}><span className="rl">READER</span><span className="rl">AUTHOR</span><span className="rl red">COMPANY</span></div>
                            <Link href="/signin/" className="navi" style={{ color: "var(--slate)" }}>Sign out</Link>
            </div>
          </div>
        </aside>

        <div className="mobnav" role="navigation" aria-label="Account sections">{flat.map((it) => link(it, true))}</div>

        <main className="main" key={epoch}>
          {panel === "overview" && <Overview companyName={co.name} />}
          {panel === "profile" && <Profile />}
          {panel === "submissions" && <Submissions refs={refs} />}
          {panel === "comments" && <Comments />}
          {panel === "author" && <AuthorProfile />}
          {panel === "bookmarks" && <Bookmarks />}
          {panel === "messages" && <Messages />}
          {/* Kept mounted (just hidden) so unsent company edits survive a visit to another panel. */}
          <div hidden={panel !== "company"} style={{ display: panel === "company" ? "contents" : undefined }}><Head title="My company" sub="The directory profile you manage. Edits are reviewed before they go live; the public page keeps its current content until then." actions={<Link href={`/directory/${co.slug}/`} className="btn">View public profile</Link>} /><CompanyPanel co={co} related={related} subs0={subs0} /></div>
          {panel === "billing" && <><Head title="Subscription & billing" sub="Your plan, payment method and invoices. Prices are announced before paid plans open." /><BillingPanel /></>}
          {panel === "notifications" && <Notifications />}
          {panel === "settings" && <Settings />}
        </main>
      </div>
    </>
  );
}
