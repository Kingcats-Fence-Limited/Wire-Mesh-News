import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import "@/styles/boards-common.css";
import { ThemeScript } from "@/components/theme/ThemeScript";
import { CookieBanner } from "@/components/shell/CookieBanner";
import { BackToTop } from "@/components/shell/BackToTop";
import { SITE } from "@/lib/site";
import { INDEXABLE } from "@/lib/indexing";

/* Pages are static, but anything that depends on today's date (masthead date, "x days ago",
   upcoming events, the brief) is regenerated in the background at most once an hour on
   the next visit (incremental static regeneration), so no daily rebuild is needed. */
export const revalidate = 3600;

/* Self-hosted variable fonts (Latin subset). next/font preloads them and generates
   size-adjusted fallbacks, so text does not shift when the real font arrives. */
const bricolage = localFont({ src: "../fonts/bricolage-grotesque-latin-opsz-normal.woff2", weight: "200 800", style: "normal", display: "swap", variable: "--font-bricolage", fallback: ["Arial", "sans-serif"], adjustFontFallback: "Arial" });
const manrope = localFont({ src: "../fonts/manrope-latin-wght-normal.woff2", weight: "200 800", style: "normal", display: "swap", variable: "--font-manrope", fallback: ["Arial", "sans-serif"], adjustFontFallback: "Arial" });

export const metadata: Metadata = {
  title: { default: SITE.name, template: `%s · ${SITE.name}` },
  description: SITE.tagline + ".",
  metadataBase: new URL(SITE.url),
  openGraph: { siteName: SITE.name, type: "website", locale: "en_GB", images: [{ url: "/og/", width: 1200, height: 630, alt: SITE.name }] },
  twitter: { card: "summary_large_image", images: ["/og/"] },
  applicationName: SITE.name,
  formatDetection: { telephone: false, email: false, address: false },
  alternates: { types: { "application/rss+xml": "/feed.xml" } },
  /* Not indexable until the site runs on wiremeshnews.com (see src/lib/indexing.ts). */
  ...(INDEXABLE ? {} : { robots: { index: false, follow: false } }),
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en-GB" className={`${bricolage.variable} ${manrope.variable}`} suppressHydrationWarning>
      <body>
        {/* First thing in <body> (not <head>): Next leaves custom <head> children out of some
            streamed responses (e.g. 404s), and here it still runs before anything is painted. */}
        <ThemeScript />
        <a href="#main" className="sr-only focus:not-sr-only focus:fixed focus:left-3 focus:top-3 focus:z-[100] focus:rounded-full focus:bg-ink focus:px-4 focus:py-2 focus:text-white">Skip to content</a>
        <div id="top" tabIndex={-1} className="outline-none" />
        {children}
        <BackToTop />
        <CookieBanner />
      </body>
    </html>
  );
}
