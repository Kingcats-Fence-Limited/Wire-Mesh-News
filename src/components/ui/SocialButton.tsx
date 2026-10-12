import { clsx } from "clsx";

/**
 * The five fixed channels (HANDOFF §3, Nav-J). Glyphs are the official
 * Simple Icons paths. Pure links — no SDKs are loaded anywhere on the site.
 */
export type SocialId = "linkedin" | "youtube" | "x" | "whatsapp" | "rss";

export const SOCIALS: { id: SocialId; label: string; href: string }[] = [
  { id: "linkedin", label: "LinkedIn", href: "https://www.linkedin.com/company/wiremeshnews" },
  { id: "youtube", label: "YouTube", href: "https://www.youtube.com/@wiremeshnews" },
  { id: "x", label: "X", href: "https://x.com/wiremeshnews" },
  { id: "whatsapp", label: "WhatsApp channel", href: "https://whatsapp.com/channel/wiremeshnews" },
  { id: "rss", label: "RSS feed", href: "/feed.xml" },
];

const PATHS: Record<SocialId, string> = {
  linkedin:
    "M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z",
  youtube:
    "M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z",
  x: "M18.901 1.153h3.68l-8.04 9.19L24 22.846h-7.406l-5.8-7.584-6.638 7.584H.474l8.6-9.83L0 1.154h7.594l5.243 6.932ZM17.61 20.644h2.039L6.486 3.24H4.298Z",
  whatsapp:
    "M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z",
  rss: "M19.199 24C19.199 13.467 10.533 4.8 0 4.8V0c13.165 0 24 10.835 24 24h-4.801zM3.291 17.415c1.814 0 3.293 1.479 3.293 3.295 0 1.813-1.485 3.29-3.301 3.29C1.47 24 0 22.526 0 20.71s1.475-3.294 3.291-3.294zM15.909 24h-4.665c0-6.169-5.075-11.245-11.244-11.245V8.09c8.727 0 15.909 7.184 15.909 15.91z",
};

export function SocialGlyph({ id, size = 16 }: { id: SocialId; size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d={PATHS[id]} />
    </svg>
  );
}

type Props = {
  id: SocialId;
  href?: string;
  label?: string;
  /** dark = on dark footer; light = on white page (article share row) */
  tone?: "dark" | "light";
  size?: 42 | 38;
  className?: string;
};

/**
 * Round social button. Hover, :active and :focus-visible all turn the
 * whole disc red — the same reaction on desktop and touch.
 */
export function SocialButton({ id, href, label, tone = "dark", size = 42, className }: Props) {
  const meta = SOCIALS.find((s) => s.id === id)!;
  const external = !(href ?? meta.href).startsWith("/");
  const dark = tone === "dark";
  return (
    <a
      href={href ?? meta.href}
      aria-label={label ?? meta.label}
      target={external ? "_blank" : undefined}
      rel={external ? "noopener noreferrer" : undefined}
      className={clsx("soc", !dark && "soc-light", className)}
      style={{ width: size, height: size, ...(dark ? {} : { background: "var(--card)", borderColor: "var(--line)", color: "var(--ink)" }), WebkitTapHighlightColor: "transparent" }}
    >
      <SocialGlyph id={id} size={size === 42 ? 17 : 15} />
    </a>
  );
}

export function SocialRow({ tone = "dark", size = 42, className }: { tone?: "dark" | "light"; size?: 42 | 38; className?: string }) {
  return (
    <div className={className} style={{ display: "flex", alignItems: "center", gap: "10px" }}>
      {SOCIALS.map((s) => (
        <SocialButton key={s.id} id={s.id} tone={tone} size={size} />
      ))}
    </div>
  );
}
