import { clsx } from "clsx";

/**
 * Ad inventory (Ads-S): 8 slot types. Every slot carries the ADVERTISEMENT
 * label; placement caps and ad-free zones are enforced by the page, not here.
 * Phase 1 renders labelled placeholders only.
 */
export type AdSlotKind =
  | "leaderboard" // 970×120, grey band, never above the fold
  | "mpu" // 300×250 sidebar
  | "half" // 300×600 sidebar
  | "in-article" // 728×90 / fluid, before section 3
  | "mobile-banner" // 320×90, one per page on mobile
  | "sponsored-card" // native card in feeds
  | "series-sponsor" // topic sponsor strip
  | "partner-strip"; // footer partner logos

const dims: Record<AdSlotKind, { w: number; h: number; label: string }> = {
  leaderboard: { w: 970, h: 120, label: "970 × 120" },
  mpu: { w: 300, h: 250, label: "300 × 250" },
  half: { w: 300, h: 600, label: "300 × 600" },
  "in-article": { w: 728, h: 90, label: "728 × 90" },
  "mobile-banner": { w: 320, h: 90, label: "320 × 90" },
  "sponsored-card": { w: 0, h: 0, label: "SPONSORED" },
  "series-sponsor": { w: 0, h: 0, label: "SERIES SPONSOR" },
  "partner-strip": { w: 0, h: 0, label: "PARTNERS" },
};

export function AdTag({ children = "Advertisement", className }: { children?: string; className?: string }) {
  return (
    <span className={clsx("inline-flex items-center gap-1.5 text-[9.5px] font-extrabold uppercase tracking-[0.14em] text-grey", className)}>
      {children}
    </span>
  );
}

export function AdSlot({ kind, className }: { kind: AdSlotKind; className?: string }) {
  const d = dims[kind];
  return (
    <div className={clsx("flex flex-col items-center", className)} data-ad-slot={kind}>
      <AdTag className="mb-2" />
      <div
        className="num flex w-full items-center justify-center border border-dashed border-line-2 bg-bg text-[11px] font-extrabold tracking-[0.1em] text-grey"
        style={{ maxWidth: d.w || undefined, height: d.h || 120 }}
        role="img"
        aria-label={`Advertisement slot ${d.label}`}
      >
        [ {d.label} ]
      </div>
    </div>
  );
}

/** Full-width grey band holding a centred leaderboard (Home-A pattern). */
export function AdBand({ className }: { className?: string }) {
  return (
    <section className={clsx("border-y border-line-soft bg-paper", className)} aria-label="Advertisement">
      <div className="wrap py-[22px]">
        <AdSlot kind="leaderboard" />
      </div>
    </section>
  );
}
