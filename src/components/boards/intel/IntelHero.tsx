/* Shared dark hero for the intelligence pages. */
import Link from "next/link";
import { INTEL_TABS } from "@/lib/site";

export function IntelHero({ crumb, title, lede, here, children }: { crumb: string; title: string; lede: string; here?: string; children?: React.ReactNode }) {
  return (
    <section style={{ background: "var(--surface-dark)", color: "#FFFFFF", position: "relative", overflow: "hidden" }}>
      <svg width="460" height="460" viewBox="0 0 120 120" style={{ position: "absolute", right: "-70px", top: "-110px", color: "var(--mesh-dark)" }} aria-hidden="true"><use href="#w2" width="120" height="120" /></svg>
      <div style={{ position: "relative", paddingTop: "44px", paddingBottom: "44px" }} className="wrap">
        <nav aria-label="Breadcrumb" style={{ fontSize: "12.5px", fontWeight: 500, color: "var(--grey-2)", marginBottom: "14px" }}><Link href="/" style={{ color: "var(--grey-2)" }}>Home</Link> / <span style={{ color: "#FFFFFF", fontWeight: 800 }}>{crumb}</span></nav>
        <h1 style={{ margin: "0 0 12px", fontSize: "48px", letterSpacing: "-.05em", lineHeight: 1.03, maxWidth: "780px", color: "#FFFFFF" }} className="h">{title}<span style={{ color: "var(--red-text)" }}>.</span></h1>
        <p style={{ margin: 0, fontSize: "17px", fontWeight: 500, lineHeight: 1.55, maxWidth: "680px", color: "var(--on-dark-2)" }}>{lede}</p>
        {children}
        {here && (
          <nav aria-label="Intelligence" className="itabs">
            {INTEL_TABS.map((t) => <Link key={t.href} href={t.href} aria-current={t.href === here ? "page" : undefined}>{t.label}</Link>)}
          </nav>
        )}
      </div>
    </section>
  );
}

/** "Unlock with Pro" banner used under locked lists. */
export function Upsell({ signedIn, live, what }: { signedIn: boolean; live: boolean; what: string }) {
  return (
    <div className="upsell" style={{ margin: "18px 0" }}>
      <div style={{ minWidth: 0 }}>
        <div style={{ fontSize: "18px", marginBottom: "4px" }} className="h">{what}</div>
        <span className="meta">Part of Pro, Team and Company plans. 14-day free trial; cancel any time.</span>
      </div>
      <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
        {live && !signedIn && <Link href={`/signin/?next=${encodeURIComponent("/pricing/")}`} className="ibtn">Sign in</Link>}
        <Link href="/pricing/" className="ibtn red">See plans</Link>
      </div>
    </div>
  );
}
