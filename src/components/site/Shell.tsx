import Link from "next/link";
import { clsx } from "clsx";
import { Header } from "./Header";
import { Footer } from "./Footer";

/** Page wrapper: header variant + main landmark + full footer. */
export function Shell({ children, header = "compact", className }: { children: React.ReactNode; header?: "full" | "compact"; className?: string }) {
  return (
    <>
      <Header variant={header} />
      <main id="main" className={clsx("min-h-[60vh]", className)}>
        {children}
      </main>
      <Footer />
    </>
  );
}

/** Breadcrumb trail used on every inner page. */
export function Crumbs({ items }: { items: { label: string; href?: string }[] }) {
  return (
    <nav aria-label="Breadcrumb" className="meta flex flex-wrap items-center gap-1.5">
      <Link href="/" className="hover:text-red-text">Home</Link>
      {items.map((it, i) => (
        <span key={i} className="flex items-center gap-1.5">
          <span aria-hidden="true" className="text-grey-4">/</span>
          {it.href ? <Link href={it.href} className="hover:text-red-text">{it.label}</Link> : <b className="text-fg">{it.label}</b>}
        </span>
      ))}
    </nav>
  );
}

/** Standard inner-page header: crumbs, H1 with red full stop, intro. */
export function PageHead({ crumbs, title, intro, aside, className, dot = true }: { crumbs: { label: string; href?: string }[]; title: React.ReactNode; intro?: React.ReactNode; aside?: React.ReactNode; className?: string; dot?: boolean }) {
  return (
    <div className={clsx("wrap pt-7", className)}>
      <Crumbs items={crumbs} />
      <div className="mt-4 flex flex-col gap-6 border-b border-line pb-7 md:flex-row md:items-end md:justify-between">
        <div className="max-w-[760px]">
          <h1 className="font-display text-[34px] tracking-[-0.045em] md:text-[40px]">
            {title}
            {dot && <span className="text-red">.</span>}
          </h1>
          {intro && <p className="mt-3 text-[15.5px] font-medium leading-[1.6] text-slate">{intro}</p>}
        </div>
        {aside}
      </div>
    </div>
  );
}
