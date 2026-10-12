/** Original demo imagery (public/demo, generated in-house — no third-party assets). Picked by a stable hash so each slug keeps its picture. */
export const DEMO_COUNT = 12;
export function demoIndex(seed: string, offset = 0) {
  let h = 7;
  for (let i = 0; i < seed.length; i++) h = (h * 31 + seed.charCodeAt(i)) >>> 0;
  return ((h + offset) % DEMO_COUNT) + 1;
}
export const demoSrc = (seed: string, offset = 0) => `/demo/wm-${String(demoIndex(seed, offset)).padStart(2, "0")}.jpg`;
export const logoSrc = (slug: string) => `/demo/logo-${slug}.png`;
/** Inline style for a cover-fitted demo photo on any box. */
export const demoBg = (seed: string, offset = 0): React.CSSProperties => ({ backgroundImage: `url(${demoSrc(seed, offset)})`, backgroundSize: "cover", backgroundPosition: "center" });
