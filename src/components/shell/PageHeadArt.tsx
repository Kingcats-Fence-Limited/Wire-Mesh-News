import { preload } from "react-dom";

/**
 * The artwork behind a dark page header.
 *
 * This replaced the full-bleed mesh lattice, which fought with the headline at every
 * screen size. It is one photo plus a scrim, in one place, so the picture can be
 * swapped for a real one later without touching any page: drop a wide image into
 * public/demo (or anywhere under public) and either rename it over the file below or
 * pass `src` where the header is used.
 *
 * The scrim is what keeps white text readable on any photo, so keep it when swapping.
 */
export const HEAD_ART = {
  /** stacked welded panels — the default for most headers */
  panels: "/demo/hdr-01.webp",
  /** wire coils in a yard */
  coils: "/demo/hdr-02.webp",
  /** plant hall */
  hall: "/demo/hdr-03.webp",
} as const;

export function PageHeadArt({ src = HEAD_ART.panels, opacity = 1 }: { src?: string; opacity?: number }) {
  /* The header photo is usually the largest thing on screen: fetch it with the HTML instead
     of waiting for the stylesheet to reveal it. */
  preload(src, { as: "image", fetchPriority: "high" });
  return (
    <>
      <span
        aria-hidden="true"
        style={{
          position: "absolute",
          inset: 0,
          backgroundImage: `url(${src})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          opacity,
        }}
      />
      {/* scrim: keeps the headline legible whatever photo sits behind it */}
      <span
        aria-hidden="true"
        style={{
          position: "absolute",
          inset: 0,
          background:
            "linear-gradient(90deg, rgba(14,15,20,.96) 0%, rgba(14,15,20,.88) 34%, rgba(14,15,20,.46) 72%, rgba(14,15,20,.3) 100%)",
        }}
      />
    </>
  );
}
