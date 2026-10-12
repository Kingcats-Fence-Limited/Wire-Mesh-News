import Link from "next/link";
import { clsx } from "clsx";
import type { ComponentProps, ReactNode } from "react";

type Variant = "primary" | "red" | "outline" | "white" | "ghost";
type Size = "sm" | "md" | "lg";

const base =
  "inline-flex items-center justify-center gap-2 rounded-full font-extrabold whitespace-nowrap transition-colors duration-150 disabled:opacity-50 disabled:pointer-events-none select-none";

const variants: Record<Variant, string> = {
  primary: "bg-ink text-white hover:bg-red dark:bg-white dark:text-ink dark:hover:bg-red dark:hover:text-white",
  red: "bg-red text-white hover:bg-red-deep",
  outline: "bg-transparent text-fg border-[1.5px] border-ink hover:border-red hover:text-red-text dark:border-white",
  white: "bg-white text-ink hover:bg-paper",
  ghost: "bg-transparent text-fg hover:text-red-text",
};

const sizes: Record<Size, string> = {
  sm: "min-h-[38px] px-4 text-[13px]",
  md: "min-h-[44px] px-5 text-[14px]",
  lg: "min-h-[50px] px-6 text-[15px]",
};

type Common = { variant?: Variant; size?: Size; className?: string; children: ReactNode };
type ButtonProps = Common & Omit<ComponentProps<"button">, "className" | "children">;
type LinkProps = Common & { href: string } & Omit<ComponentProps<typeof Link>, "className" | "children" | "href">;

export function Button({ variant = "primary", size = "md", className, children, ...rest }: ButtonProps) {
  return (
    <button type="button" className={clsx(base, variants[variant], sizes[size], className)} {...rest}>
      {children}
    </button>
  );
}

export function ButtonLink({ variant = "primary", size = "md", className, children, href, ...rest }: LinkProps) {
  return (
    <Link href={href} className={clsx(base, variants[variant], sizes[size], className)} {...rest}>
      {children}
    </Link>
  );
}

/** Red uppercase inline link with arrow, e.g. "ALL LETTERS →" */
export function MoreLink({ href, children, className }: { href: string; children: ReactNode; className?: string }) {
  return (
    <Link
      href={href}
      className={clsx("inline-flex items-center gap-1.5 text-[12.5px] font-extrabold tracking-[0.06em] uppercase text-red-text hover:text-red-deep", className)}
    >
      {children}
      <span aria-hidden="true">→</span>
    </Link>
  );
}
