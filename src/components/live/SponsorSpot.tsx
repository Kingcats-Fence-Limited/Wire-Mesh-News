"use client";

/* A labelled sponsor spot outside the editorial lists: one Directory Sponsor, chosen from those
   matching the page's products or application areas, rotating on every visit. */
import Link from "next/link";
import { useEffect, useState } from "react";
import { useSponsors } from "@/lib/paid-members";
import type { SponsorCard } from "@/lib/sponsors";
import { SponsorRibbon } from "./SponsorMark";

export function SponsorSpot({ products = [], applications = [], exclude }: { products?: string[]; applications?: string[]; exclude?: string }) {
  const list = useSponsors();
  const [pick, setPick] = useState<SponsorCard | null>(null);
  const key = `${products.join(",")}|${applications.join(",")}|${exclude ?? ""}`;
  useEffect(() => {
    if (!list?.length) return;
    const pool = list.filter((s) => s.slug !== exclude);
    const match = pool.filter((s) => s.products.some((p) => products.includes(p)) || s.applications.some((a) => applications.includes(a)));
    const from = match.length ? match : pool;
    setPick(from.length ? from[Math.floor(Math.random() * from.length)] : null);
    // `key` stands for products/applications/exclude (fresh arrays on every render).
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [list, key]);
  if (!pick) return null;
  return (
    <aside aria-label="Sponsored" data-ad style={{ border: "1.5px solid var(--red)", borderRadius: "14px", padding: "16px 18px", background: "var(--card)", display: "flex", flexDirection: "column", gap: "10px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: "8px" }}>
        <span style={{ fontSize: "10px", fontWeight: 800, letterSpacing: ".16em", color: "var(--grey)" }}>SPONSORED</span>
        <SponsorRibbon year={pick.year} small />
      </div>
      <Link href={`/directory/${pick.slug}/`} className="h" style={{ fontSize: "18px", color: "var(--ink)" }}>{pick.name}</Link>
      <span style={{ fontSize: "12px", fontWeight: 700, color: "var(--slate)" }}>{pick.city} · {pick.country}</span>
      <p style={{ margin: 0, fontSize: "13px", fontWeight: 500, lineHeight: 1.55, color: "var(--fg-3)" }}>{pick.summary}</p>
      <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
        <Link href={`/directory/${pick.slug}/`} style={{ display: "inline-flex", alignItems: "center", minHeight: "34px", padding: "0 14px", borderRadius: "999px", background: "var(--ink)", color: "var(--on-ink)", fontSize: "12.5px", fontWeight: 800 }}>Profile</Link>
        {pick.website && <a href={pick.website} target="_blank" rel="sponsored noopener" style={{ display: "inline-flex", alignItems: "center", minHeight: "34px", padding: "0 14px", borderRadius: "999px", border: "1.5px solid var(--red)", color: "var(--red-text)", fontSize: "12.5px", fontWeight: 800 }}>Visit website ↗</a>}
      </div>
      <span style={{ fontSize: "11px", fontWeight: 500, color: "var(--grey)" }}>Directory Sponsor. Shown in rotation; it does not affect our coverage. <Link href="/policies/directory-listing-policy/" style={{ textDecoration: "underline" }}>Why?</Link></span>
    </aside>
  );
}
