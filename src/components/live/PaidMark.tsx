"use client";

/* PAID MEMBER mark on a company profile (Company plan). A label only: no ranking effect. */
import { usePaidMembers } from "@/lib/paid-members";

export function PaidMark({ slug, paidMember }: { slug: string; paidMember?: boolean }) {
  const paid = usePaidMembers([{ slug, paidMember }]);
  if (!paid.has(slug)) return null;
  return <span title="Pays for the Company plan. Payment does not change its place in the Directory or our coverage." style={{ background: "var(--st-review-bg)", color: "var(--st-review-fg)", fontSize: "9.5px", fontWeight: 800, letterSpacing: ".1em", padding: "5px 10px", borderRadius: "4px" }}>PAID MEMBER</span>;
}
