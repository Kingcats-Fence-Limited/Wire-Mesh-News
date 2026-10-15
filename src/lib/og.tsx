/* Share-card images (1200×630) for Open Graph / X. Rendered at build time with next/og.
   Fonts: Bricolage Grotesque 800 and Manrope 700 (SIL OFL), kept in /assets/og. */
import { ImageResponse } from "next/og";
import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { SITE } from "@/lib/site";

export const OG_SIZE = { width: 1200, height: 630 };
export const OG_TYPE = "image/png";

let fonts: Promise<{ name: string; data: Buffer; weight: 700 | 800; style: "normal" }[]> | null = null;
const loadFonts = () =>
  (fonts ??= Promise.all([
    readFile(join(process.cwd(), "assets/og/bricolage-grotesque-latin-800-normal.woff")).then((data) => ({ name: "Bricolage", data, weight: 800 as const, style: "normal" as const })),
    readFile(join(process.cwd(), "assets/og/manrope-latin-700-normal.woff")).then((data) => ({ name: "Manrope", data, weight: 700 as const, style: "normal" as const })),
  ]));

export async function ogCard({ kicker, title, meta }: { kicker?: string; title: string; meta?: string }) {
  const size = title.length > 90 ? 52 : title.length > 60 ? 62 : 74;
  return new ImageResponse(
    (
      <div style={{ width: "100%", height: "100%", display: "flex", flexDirection: "column", justifyContent: "space-between", background: "#15161c", color: "#ffffff", padding: "64px 72px", fontFamily: "Manrope" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 18 }}>
          <div style={{ width: 54, height: 54, background: "#e5242f", borderRadius: 12, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "Bricolage", fontSize: 30, fontWeight: 800 }}>W</div>
          <div style={{ fontFamily: "Bricolage", fontSize: 34, fontWeight: 800, letterSpacing: -1 }}>{SITE.name}</div>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 22 }}>
          {kicker && <div style={{ display: "flex", fontSize: 24, fontWeight: 700, letterSpacing: 4, color: "#ff6b73", textTransform: "uppercase" }}>{kicker}</div>}
          <div style={{ display: "flex", fontFamily: "Bricolage", fontSize: size, fontWeight: 800, lineHeight: 1.05, letterSpacing: -2 }}>{title.length > 140 ? title.slice(0, 137) + "…" : title}</div>
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", fontSize: 24, fontWeight: 700, color: "#b9bcc8" }}>
          <div style={{ display: "flex" }}>{meta ?? SITE.tagline}</div>
          <div style={{ display: "flex", width: 120, height: 10, background: "#e5242f", borderRadius: 5 }} />
        </div>
      </div>
    ),
    { ...OG_SIZE, fonts: await loadFonts() },
  );
}
