import { useId } from "react";
import { clsx } from "clsx";

/**
 * Mesh pattern system (canvas: pChain / pWeld / pWoven / pGrate / pPerf / pExp / pG1–5).
 * Each <MeshBg> embeds its own <pattern> so `currentColor` resolves against the
 * referencing element (a shared <defs> would resolve it against the defs' ancestor).
 *
 * Application → pattern map (HANDOFF §3):
 *   architecture → exp · industrial → weld · agriculture → woven
 *   energy → perf · sports → chain
 */
export type MeshId =
  | "chain"
  | "chainL"
  | "weld"
  | "weldQ"
  | "woven"
  | "grate"
  | "perf"
  | "exp"
  | "g1"
  | "g2"
  | "g3"
  | "g4"
  | "g5";

/** Keyed by application_area.code AND by its `pattern` column value. */
export const APPLICATION_MESH: Record<string, MeshId> = {
  architecture: "exp",
  industrial_security: "weld",
  agriculture: "woven",
  energy_environment: "perf",
  sports_lifestyle: "chain",
  expanded: "exp",
  welded: "weld",
  woven: "woven",
  perforated: "perf",
  chain_link: "chain",
  chain: "chain",
};

type Tile = { w: number; h: number; body: React.ReactNode };

const grid = (size: number, sw: number): Tile => ({
  w: size,
  h: size,
  body: <path d={`M0 0H${size}M0 0V${size}`} stroke="currentColor" strokeWidth={sw} fill="none" />,
});

const TILES: Record<MeshId, Tile> = {
  chain: { w: 34, h: 34, body: <path d="M0 17L17 0L34 17L17 34Z" fill="none" stroke="currentColor" strokeWidth="1.5" /> },
  chainL: { w: 54, h: 54, body: <path d="M0 27L27 0L54 27L27 54Z" fill="none" stroke="currentColor" strokeWidth="2.2" /> },
  weld: {
    w: 36,
    h: 36,
    body: (
      <>
        <path d="M0 0H36M0 0V36" stroke="currentColor" strokeWidth="1.4" fill="none" />
        <circle cx="0" cy="0" r="2.8" fill="#E5242F" />
        <circle cx="36" cy="0" r="2.8" fill="#E5242F" />
        <circle cx="0" cy="36" r="2.8" fill="#E5242F" />
        <circle cx="36" cy="36" r="2.8" fill="#E5242F" />
      </>
    ),
  },
  weldQ: {
    w: 30,
    h: 30,
    body: (
      <>
        <path d="M0 0H30M0 0V30" stroke="currentColor" strokeWidth="1.2" fill="none" />
        <circle cx="0" cy="0" r="2.2" fill="currentColor" />
      </>
    ),
  },
  woven: {
    w: 36,
    h: 36,
    body: (
      <>
        <path d="M0 9Q9 1 18 9T36 9" fill="none" stroke="currentColor" strokeWidth="1.6" />
        <path d="M0 27Q9 19 18 27T36 27" fill="none" stroke="currentColor" strokeWidth="1.6" />
        <path d="M9 0Q1 9 9 18T9 36" fill="none" stroke="currentColor" strokeWidth="1.6" />
        <path d="M27 0Q19 9 27 18T27 36" fill="none" stroke="currentColor" strokeWidth="1.6" />
      </>
    ),
  },
  grate: {
    w: 22,
    h: 22,
    body: (
      <>
        <path d="M3 0V22" stroke="currentColor" strokeWidth="4.5" />
        <path d="M14 0V22" stroke="currentColor" strokeWidth="4.5" />
        <path d="M0 11H22" stroke="currentColor" strokeWidth="1.2" />
      </>
    ),
  },
  perf: {
    w: 24,
    h: 24,
    body: (
      <>
        <circle cx="6" cy="6" r="3.6" fill="currentColor" />
        <circle cx="18" cy="18" r="3.6" fill="currentColor" />
      </>
    ),
  },
  exp: { w: 32, h: 18, body: <path d="M0 9L8 0H24L32 9L24 18H8Z" fill="none" stroke="currentColor" strokeWidth="1.5" /> },
  g1: grid(30, 2.6),
  g2: grid(22, 2),
  g3: grid(16, 1.5),
  g4: grid(11, 1.1),
  g5: grid(7, 0.8),
};

type MeshBgProps = {
  id: MeshId;
  /** CSS colour for the strokes; defaults to currentColor of the parent */
  color?: string;
  opacity?: number;
  className?: string;
  /** scale the pattern tile */
  scale?: number;
  style?: React.CSSProperties;
};

/** Absolutely-positioned mesh backdrop. Parent needs `relative overflow-hidden`. */
export function MeshBg({ id, color = "currentColor", opacity = 0.14, className, scale = 1, style }: MeshBgProps) {
  const uid = useId().replace(/:/g, "");
  const pid = `m-${id}-${uid}`;
  const t = TILES[id];
  return (
    <svg
      aria-hidden="true"
      focusable="false"
      className={clsx("pointer-events-none absolute inset-0 h-full w-full", className)}
      style={{ color, opacity, ...style }}
      preserveAspectRatio="none"
    >
      <defs>
        <pattern id={pid} width={t.w} height={t.h} patternUnits="userSpaceOnUse" patternTransform={scale !== 1 ? `scale(${scale})` : undefined}>
          {t.body}
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill={`url(#${pid})`} />
    </svg>
  );
}

/** Kept for layout compatibility; patterns are now inline per MeshBg. */
export function MeshDefs() {
  return null;
}
