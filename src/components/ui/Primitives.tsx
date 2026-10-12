import Link from "next/link";
import { clsx } from "clsx";
import type { ComponentProps, ReactNode } from "react";

/* ------------------------------------------------------------------ */
/* Kicker — red dash + small caps label (section / subsection)         */
/* ------------------------------------------------------------------ */
export function Kicker({ children, className, tone = "default" }: { children: ReactNode; className?: string; tone?: "default" | "muted" | "on-dark" }) {
  return (
    <span
      className={clsx(
        "inline-flex items-center gap-1.5 text-[10.5px] font-extrabold uppercase tracking-[0.12em]",
        tone === "default" && "text-slate",
        tone === "muted" && "text-grey",
        tone === "on-dark" && "text-grey-2",
        className,
      )}
    >
      <i aria-hidden="true" className="block h-[3px] w-3 bg-red" />
      {children}
    </span>
  );
}

/* ------------------------------------------------------------------ */
/* Section head — node · title · rule · more link                      */
/* ------------------------------------------------------------------ */
export function SectionHead({
  title,
  more,
  moreHref,
  className,
  onDark,
  as: Tag = "h2",
}: {
  title: ReactNode;
  more?: ReactNode;
  moreHref?: string;
  className?: string;
  onDark?: boolean;
  as?: "h1" | "h2" | "h3";
}) {
  return (
    <div className={clsx("flex items-center gap-3.5", className)}>
      <span aria-hidden="true" className="h-2.5 w-2.5 shrink-0 rounded-full bg-red" />
      <Tag className={clsx("font-display text-[23px] leading-none", onDark ? "text-white" : "text-fg")}>{title}</Tag>
      <span aria-hidden="true" className={clsx("h-[2px] flex-1", onDark ? "bg-line-dark" : "bg-ink dark:bg-line-2")} />
      {more && moreHref && (
        <Link href={moreHref} className="shrink-0 text-[12.5px] font-extrabold uppercase tracking-[0.06em] text-red-text hover:text-red-deep">
          {more} <span aria-hidden="true">→</span>
        </Link>
      )}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Chip — filter / tag pill                                            */
/* ------------------------------------------------------------------ */
type ChipProps = {
  active?: boolean;
  count?: number | string;
  size?: "sm" | "md";
  className?: string;
  children: ReactNode;
};

const chipBase =
  "inline-flex items-center gap-1.5 rounded-full border font-bold whitespace-nowrap transition-colors";
const chipSize = { sm: "min-h-[34px] px-3.5 text-[12.5px]", md: "min-h-[38px] px-4 text-[13.5px]" };

export function Chip({ active, count, size = "md", className, children, ...rest }: ChipProps & Omit<ComponentProps<"button">, "className" | "children">) {
  return (
    <button
      type="button"
      aria-pressed={active}
      className={clsx(
        chipBase,
        chipSize[size],
        active ? "border-ink bg-ink text-white dark:border-white dark:bg-white dark:text-ink" : "border-line bg-bg text-fg hover:border-ink dark:hover:border-white",
        className,
      )}
      {...rest}
    >
      {children}
      {count !== undefined && <span className={clsx("num text-[11.5px] font-extrabold", active ? "text-grey-3" : "text-grey")}>{count}</span>}
    </button>
  );
}

export function ChipLink({ href, active, count, size = "md", className, children }: ChipProps & { href: string }) {
  return (
    <Link
      href={href}
      aria-current={active ? "page" : undefined}
      className={clsx(chipBase, chipSize[size], active ? "border-ink bg-ink text-white dark:border-white dark:bg-white dark:text-ink" : "border-line bg-bg text-fg hover:border-ink dark:hover:border-white", className)}
    >
      {children}
      {count !== undefined && <span className={clsx("num text-[11.5px] font-extrabold", active ? "text-grey-3" : "text-grey")}>{count}</span>}
    </Link>
  );
}

/* ------------------------------------------------------------------ */
/* Badge — status + content-type labels                                */
/* ------------------------------------------------------------------ */
export type BadgeTone =
  | "current"
  | "review"
  | "withdrawn"
  | "draft"
  | "article"
  | "letter"
  | "opinion"
  | "company"
  | "standard"
  | "topic"
  | "event"
  | "live"
  | "delayed"
  | "sponsored"
  | "neutral";

const badgeTones: Record<BadgeTone, string> = {
  current: "bg-[var(--st-current-bg)] text-[var(--st-current-fg)]",
  review: "bg-[var(--st-review-bg)] text-[var(--st-review-fg)]",
  withdrawn: "bg-[var(--st-withdrawn-bg)] text-[var(--st-withdrawn-fg)]",
  draft: "bg-[var(--st-draft-bg)] text-[var(--st-draft-fg)]",
  /* search / list content types — identical in overlay and results page */
  article: "bg-ink text-white",
  letter: "bg-[var(--st-review-bg)] text-[var(--st-review-fg)]",
  opinion: "bg-bg text-slate border-[1.5px] border-line",
  company: "bg-[#E8EAF0] text-fg-3 dark:bg-dark-3 dark:text-grey-3",
  standard: "bg-[var(--st-red-bg)] text-red-deep dark:text-red-text",
  topic: "bg-red text-white",
  event: "bg-[var(--st-current-bg)] text-[var(--st-current-fg)]",
  live: "bg-red text-white",
  delayed: "bg-[var(--st-draft-bg)] text-[var(--st-draft-fg)]",
  sponsored: "bg-paper text-slate border border-line",
  neutral: "bg-paper text-slate",
};

export function Badge({ tone = "neutral", children, className, size = "md" }: { tone?: BadgeTone; children: ReactNode; className?: string; size?: "sm" | "md" }) {
  return (
    <span
      className={clsx(
        "inline-flex items-center gap-1.5 rounded-badge font-extrabold uppercase whitespace-nowrap",
        size === "md" ? "px-2 py-[4px] text-[9.5px] tracking-[0.1em]" : "px-1.5 py-[3px] text-[8.5px] tracking-[0.08em]",
        badgeTones[tone],
        className,
      )}
    >
      {children}
    </span>
  );
}

/* ------------------------------------------------------------------ */
/* Card                                                                */
/* ------------------------------------------------------------------ */
export function Card({ children, className, tone = "default", padding = "md" }: { children: ReactNode; className?: string; tone?: "default" | "paper" | "dark" | "outline-strong"; padding?: "none" | "sm" | "md" | "lg" }) {
  return (
    <div
      className={clsx(
        "rounded-card",
        tone === "default" && "border border-line bg-bg",
        tone === "paper" && "bg-paper",
        tone === "dark" && "bg-dark text-white dark:border dark:border-line-dark",
        tone === "outline-strong" && "border-2 border-ink bg-bg rounded-card-lg",
        padding === "sm" && "p-4",
        padding === "md" && "p-5",
        padding === "lg" && "p-6",
        className,
      )}
    >
      {children}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Divider & rule                                                      */
/* ------------------------------------------------------------------ */
export function VRule({ className }: { className?: string }) {
  return <span aria-hidden="true" className={clsx("inline-block h-6 w-px bg-line", className)} />;
}

/* ------------------------------------------------------------------ */
/* Placeholder image block (until real photography exists)             */
/* ------------------------------------------------------------------ */
export function Thumb({ className, ratio = "4/3", dark }: { className?: string; ratio?: "4/3" | "16/9" | "1/1" | "3/2"; dark?: boolean }) {
  return (
    <span
      aria-hidden="true"
      className={clsx("block shrink-0 overflow-hidden rounded-lg", dark ? "bg-dark-2" : "bg-line", className)}
      style={{ aspectRatio: ratio }}
    />
  );
}
