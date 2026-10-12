import Link from "next/link";
import { Wordmark } from "@/components/ui/Brand";
import { SocialRow } from "@/components/ui/SocialButton";
import { ThemeToggle } from "@/components/theme/ThemeToggle";
import { FOOTER_COLUMNS, SITE } from "@/lib/site";
import { CookieSettingsButton } from "./CookieBanner";
import { NewsletterForm } from "./NewsletterForm";

/**
 * Full footer (Nav-J ⑤): newsletter band · brand + 4 columns · legal bar.
 * Used on every page; the year is rendered on the server.
 */
export function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="mt-16 bg-dark text-white" id="site-footer">
      {/* Newsletter band */}
      <div className="border-b border-line-dark">
        <div className="wrap flex flex-col gap-5 py-8 md:flex-row md:items-center md:justify-between">
          <div>
            <div className="font-display text-[22px]">The weekly brief</div>
            <p className="mt-1 text-[13.5px] font-medium text-grey-3">One email a week: news, prices and standards updates. Unsubscribe any time.</p>
          </div>
          <NewsletterForm tone="dark" />
        </div>
      </div>

      {/* Columns */}
      <div className="wrap grid gap-10 py-12 md:grid-cols-[1.3fr_repeat(4,1fr)]">
        <div>
          <Wordmark size={22} tone="white" />
          <p className="mt-4 max-w-[30ch] text-[13.5px] font-medium leading-[1.6] text-grey-3">{SITE.footerLine}</p>
          <a href={`mailto:${SITE.email}`} className="mt-3 block text-[13.5px] font-extrabold hover:text-red-text">{SITE.email}</a>
          <SocialRow className="mt-5" />
        </div>
        {FOOTER_COLUMNS.map((col) => (
          <div key={col.title}>
            <div className="mb-4 text-[11px] font-extrabold tracking-[0.14em] text-grey-5">{col.title.toUpperCase()}</div>
            <ul className="flex flex-col gap-2.5">
              {col.links.map((l) => (
                <li key={l.href}><Link href={l.href} className="text-[13.5px] font-bold text-grey-3 hover:text-white">{l.label}</Link></li>
              ))}
              {col.title === "Policies" && (
                <li><CookieSettingsButton className="text-[13.5px] font-bold text-grey-3 hover:text-white" /></li>
              )}
            </ul>
          </div>
        ))}
      </div>

      {/* Legal bar */}
      <div className="border-t border-line-dark">
        <div className="wrap flex flex-wrap items-center gap-x-6 gap-y-3 py-5 text-[12px] font-medium text-grey-5">
          <span>© {year} {SITE.name}. All rights reserved.</span>
          <Link href="/about/" className="font-bold text-grey-3 hover:text-white">About this publication</Link>
          <span className="hidden sm:inline">English edition</span>
          <span className="ml-auto flex items-center gap-3">
            <ThemeToggle />
            <a href="#top" className="inline-flex min-h-[36px] items-center gap-2 rounded-full border border-line-dark px-3.5 text-[12px] font-extrabold text-white hover:border-red hover:text-red-text">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M12 19V5M5 12l7-7 7 7" /></svg>
              Top
            </a>
          </span>
        </div>
      </div>
    </footer>
  );
}
