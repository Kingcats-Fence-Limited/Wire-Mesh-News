import type { Metadata } from "next";
import "@fontsource-variable/bricolage-grotesque/opsz.css";
import "@fontsource-variable/manrope";
import "./globals.css";
import { ThemeScript } from "@/components/theme/ThemeScript";

export const metadata: Metadata = {
  title: {
    default: "Wire Mesh News",
    template: "%s · Wire Mesh News",
  },
  description:
    "Independent news, markets and standards for the global wire mesh industry.",
  metadataBase: new URL("https://www.wiremeshnews.com"),
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <ThemeScript />
      </head>
      <body>
        {children}
      </body>
    </html>
  );
}
