import type { Metadata } from "next";
import "@fontsource-variable/bricolage-grotesque/opsz.css";
import "@fontsource-variable/manrope";
import "./globals.css";
import "@/styles/boards-common.css";
import { ThemeScript } from "@/components/theme/ThemeScript";
import { CookieBanner } from "@/components/shell/CookieBanner";
import { BackToTop } from "@/components/shell/BackToTop";
import { SITE } from "@/lib/site";

export const metadata: Metadata = {
  title: { default: SITE.name, template: `%s · ${SITE.name}` },
  description: SITE.tagline + ".",
  metadataBase: new URL(SITE.url),
  openGraph: { siteName: SITE.name, type: "website", locale: "en" },
  alternates: { types: { "application/rss+xml": "/feed.xml" } },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <ThemeScript />
      </head>
      <body>
        <a href="#main" className="sr-only focus:not-sr-only focus:fixed focus:left-3 focus:top-3 focus:z-[100] focus:rounded-full focus:bg-ink focus:px-4 focus:py-2 focus:text-white">Skip to content</a>
        <div id="top" tabIndex={-1} className="outline-none" />
        {children}
        <BackToTop />
        <CookieBanner />
      </body>
    </html>
  );
}
