"use client";

/* Pro article paywall. The static page carries only the opening (#art-preview); this asks the
   server for the rest when the reader may see it. Free readers get a monthly allowance;
   everyone else sees the offer. Preview mode: the sample article opens on request. */
import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { ArticleBlocks } from "./ArticleBlocks";
import type { PreparedBlock } from "@/lib/article-prepare";
import { AUTH_LIVE, BILLING_LIVE } from "@/lib/live";
import { TRIAL_DAYS, FREE_PREMIUM_PER_MONTH } from "@/lib/plans";

type R = { access: "preview" | "pro" | "meter" | "signin" | "offer" | "limit"; blocks?: PreparedBlock[]; used?: number; limit?: number; error?: string };

export function PremiumGate({ slug, showAd }: { slug: string; showAd: boolean }) {
  const [r, setR] = useState<R | null>(null);
  const [busy, setBusy] = useState(false);
  const [open, setOpen] = useState(false);

  const ask = useCallback(async (consume: boolean) => {
    const res = await fetch(`/api/articles/${encodeURIComponent(slug)}/`, { method: consume ? "POST" : "GET", cache: "no-store" }).catch(() => null);
    const j = (await res?.json().catch(() => null)) as R | null;
    if (j) setR(j);
  }, [slug]);
  useEffect(() => { if (AUTH_LIVE) void ask(false); }, [ask]);

  const unlocked = !!r?.blocks && (r.access !== "preview" || open);
  useEffect(() => {
    const el = document.getElementById("art-preview");
    if (el) el.hidden = unlocked;
  }, [unlocked]);

  if (unlocked && r?.blocks) {
    return (
      <>
        {r.access === "meter" && <div className="noprint" style={{ margin: "0 0 26px", padding: "10px 14px", background: "var(--paper)", borderRadius: "10px", fontSize: "13px", fontWeight: 600 }}>Free Pro article {r.used} of {r.limit} this month. <Link href="/pricing/" style={{ color: "var(--red-text)", fontWeight: 800 }}>Unlimited with Pro</Link></div>}
        <ArticleBlocks blocks={r.blocks} showAd={showAd} />
      </>
    );
  }

  const left = Math.max(0, (r?.limit ?? FREE_PREMIUM_PER_MONTH) - (r?.used ?? 0));
  const trialCta = <Link href="/pricing/" style={{ background: "var(--red)", color: "#FFFFFF", fontWeight: 800, fontSize: "15px", padding: "0 24px", minHeight: "48px", borderRadius: "999px", display: "inline-flex", alignItems: "center" }}>{BILLING_LIVE ? `Start ${TRIAL_DAYS}-day free trial` : "See Pro plans"}</Link>;
  return (
    <div className="noprint paywall" style={{ position: "relative", margin: "6px 0 36px" }}>
      <div aria-hidden="true" style={{ position: "absolute", left: 0, right: 0, top: "-120px", height: "120px", background: "linear-gradient(to bottom, transparent, var(--bg))", pointerEvents: "none" }} />
      <div style={{ border: "2px solid var(--ink)", borderRadius: "16px", padding: "24px 26px", background: "var(--card)", display: "flex", flexDirection: "column", gap: "12px" }}>
        <span style={{ alignSelf: "flex-start", background: "var(--red)", color: "#FFFFFF", fontSize: "10.5px", fontWeight: 800, letterSpacing: ".14em", padding: "4px 9px", borderRadius: "5px" }}>PRO ANALYSIS</span>
        <div style={{ fontSize: "24px" }} className="h">
          {!AUTH_LIVE ? "The rest of this article is for Pro readers" : !r ? "Checking your access…" : r.access === "signin" ? `Sign in to read — ${FREE_PREMIUM_PER_MONTH} Pro articles a month are free` : r.access === "offer" ? `Read it with one of your free Pro articles (${left} left this month)` : "You have read this month's free Pro articles"}
        </div>
        <p style={{ margin: 0, fontSize: "14.5px", fontWeight: 500, lineHeight: 1.6, color: "var(--fg-3)" }}>Pro includes every analysis article, tenders and project leads, the trade-defence tracker, monthly trade statistics and the template library. News stays free.</p>
        <div style={{ display: "flex", gap: "10px", flexWrap: "wrap", alignItems: "center" }}>
          {!AUTH_LIVE && <button type="button" onClick={() => { setOpen(true); void ask(false); }} style={{ border: 0, background: "var(--ink)", color: "var(--on-ink)", fontFamily: "inherit", fontWeight: 800, fontSize: "15px", padding: "0 24px", minHeight: "48px", borderRadius: "999px", cursor: "pointer" }}>Read on (preview)</button>}
          {AUTH_LIVE && r?.access === "signin" && <Link href={`/signin/?next=${encodeURIComponent(location.pathname)}`} style={{ background: "var(--ink)", color: "var(--on-ink)", fontWeight: 800, fontSize: "15px", padding: "0 24px", minHeight: "48px", borderRadius: "999px", display: "inline-flex", alignItems: "center" }}>Sign in or create a free account</Link>}
          {AUTH_LIVE && r?.access === "offer" && <button type="button" disabled={busy} onClick={async () => { setBusy(true); await ask(true); setBusy(false); }} style={{ border: 0, background: "var(--ink)", color: "var(--on-ink)", fontFamily: "inherit", fontWeight: 800, fontSize: "15px", padding: "0 24px", minHeight: "48px", borderRadius: "999px", cursor: "pointer" }}>{busy ? "Opening…" : "Read this article"}</button>}
          {trialCta}
        </div>
        {!AUTH_LIVE && <span className="meta">Preview site: articles open for review. On the live site Free readers get {FREE_PREMIUM_PER_MONTH} Pro articles a month.</span>}
      </div>
    </div>
  );
}
