import Link from "next/link";
import { clsx } from "clsx";
import { fmtDate, SITE } from "@/lib/site";

type NavItem = { label: string; href: string; active?: boolean; sub?: boolean };

/** Shared layout for policy pages and the market methodology (Contact-O template). */
export function PolicyLayout({ navTitle, nav, title, updated, version, inShort, children, draft }: { navTitle: string; nav: NavItem[]; title: string; updated: string; version: string; inShort?: string; children: React.ReactNode; draft?: boolean }) {
  return (
    <div className="wrap mt-4 grid gap-9 pb-4 lg:grid-cols-[200px_minmax(0,1fr)]">
      <nav aria-label={navTitle} className="lg:sticky lg:top-6 lg:self-start">
        <div className="kicker mb-3 text-[10.5px]">{navTitle}</div>
        <ul className="flex flex-col gap-2.5">
          {nav.map((n) => (
            <li key={n.href + n.label} className={clsx(n.sub && "pl-3")}>
              <Link href={n.href} aria-current={n.active ? "page" : undefined} className={clsx("text-[14px]", n.active ? "font-extrabold text-red-text" : "font-medium text-slate hover:text-fg")}>{n.label}</Link>
            </li>
          ))}
        </ul>
      </nav>
      <article className="max-w-[760px]">
        <h1 className="font-display text-[34px] tracking-[-0.045em]">{title}</h1>
        <div className="mt-3 flex flex-wrap items-center gap-3.5 border-b border-line pb-4 text-[12.5px] font-medium text-slate">
          <span>Last updated {fmtDate(updated)}</span><span className="h-3.5 w-px bg-line" /><span>Version {version}</span><span className="h-3.5 w-px bg-line" /><Link href="#history" className="font-extrabold text-red-text">Change history</Link>
          {draft && <span className="ml-auto rounded-badge bg-[var(--st-review-bg)] px-2 py-1 text-[9.5px] font-extrabold tracking-[0.1em] text-[var(--st-review-fg)]">DRAFT · COUNSEL TO FINALISE</span>}
        </div>
        {inShort && (
          <div className="my-5 rounded-r-card border-l-4 border-ink bg-paper px-[18px] py-3.5 dark:border-line-2">
            <div className="kicker text-[10.5px]">In short</div>
            <p className="mt-1 text-[14px] font-medium leading-[1.6] text-fg-3">{inShort}</p>
          </div>
        )}
        <div className="policy-body [&_h2]:font-display [&_h2]:mt-7 [&_h2]:mb-2 [&_h2]:scroll-mt-24 [&_h2]:text-[20px] [&_p]:mb-3 [&_p]:text-[15px] [&_p]:font-medium [&_p]:leading-[1.7] [&_p]:text-fg-2 [&_ul]:mb-3 [&_ul]:list-disc [&_ul]:pl-5 [&_li]:text-[14.5px] [&_li]:font-medium [&_li]:leading-[1.7] [&_li]:text-fg-2 [&_b]:font-extrabold">
          {children}
        </div>
        <div id="history" className="mt-8 scroll-mt-24 rounded-card border border-line p-4">
          <div className="kicker text-[10.5px]">Change history</div>
          <ul className="num mt-2 text-[12.5px] font-medium text-fg-3"><li>{fmtDate(updated)} — Version {version}: first published.</li></ul>
        </div>
        <div className="mt-5 flex flex-wrap items-center gap-3.5 rounded-xl bg-paper px-5 py-4">
          <span className="text-[14px] font-bold">Questions about this page?</span>
          <a href={`mailto:${SITE.email}`} className="text-[13.5px] font-extrabold text-red-text">{SITE.email}</a>
        </div>
      </article>
    </div>
  );
}
