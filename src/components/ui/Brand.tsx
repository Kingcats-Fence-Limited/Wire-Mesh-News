import Link from "next/link";
import { clsx } from "clsx";

/** Brand icon: wave stroke + red dot (canvas symbol #w1). */
export function BrandIcon({ size = 30, className }: { size?: number; className?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 120 120" aria-hidden="true" className={className}>
      <path
        d="M12 26L33 90Q39 106 46 90L55 66Q60 54 65 66L74 90Q81 106 87 90L100 50"
        fill="none"
        stroke="currentColor"
        strokeWidth="10"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle cx="107" cy="26" r="9" fill="#E5242F" />
    </svg>
  );
}

type WordmarkProps = {
  /** font-size in px of the wordmark text */
  size?: number;
  /** show the wave icon before the text */
  icon?: boolean;
  /** render as a link to home */
  href?: string | null;
  className?: string;
  /** colour of the "wire mesh" part; defaults to currentColor */
  tone?: "ink" | "white";
};

/**
 * Wordmark: "wire mesh" + red block "news".
 * Never change the proportions: block padding scales with font size.
 */
export function Wordmark({ size = 21, icon = true, href = "/", className, tone }: WordmarkProps) {
  const pad = Math.round(size * 0.33);
  const padY = Math.max(2, Math.round(size * 0.1));
  const content = (
    <span
      className={clsx(
        "inline-flex items-center gap-[0.42em] font-display whitespace-nowrap",
        tone === "white" && "text-white",
        tone === "ink" && "text-ink",
        className,
      )}
      style={{ fontSize: size, letterSpacing: "-0.05em", lineHeight: 1 }}
    >
      {icon && <BrandIcon size={Math.round(size * 1.5)} />}
      <span>wire mesh</span>
      <span
        className="rounded-[0.28em] bg-red text-white"
        style={{ padding: `${padY}px ${pad}px ${padY + 2}px` }}
      >
        news
      </span>
    </span>
  );
  if (href === null) return content;
  return (
    <Link href={href} aria-label="Wire Mesh News home" className="inline-flex">
      {content}
    </Link>
  );
}
