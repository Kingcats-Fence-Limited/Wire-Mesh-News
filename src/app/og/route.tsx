/* Default share card, served at /og/ (a plain route rather than the opengraph-image file
   convention, whose generated URL is redirected by trailingSlash and breaks some crawlers). */
import { ogCard } from "@/lib/og";

export const dynamic = "force-static";

export function GET() {
  return ogCard({ kicker: "Industry news · Markets · Standards", title: "Independent news for the global wire mesh industry" });
}
