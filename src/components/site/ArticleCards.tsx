import Link from "next/link";
import { clsx } from "clsx";
import { Kicker, Badge, Thumb } from "@/components/ui/Primitives";
import { MeshBg } from "@/components/ui/Mesh";
import type { Article } from "@/lib/content/types";
import { articleHref, fmtDate, fmtDateShort, sectionByCode, subsectionLabel } from "@/lib/site";
import { getAuthor } from "@/lib/content/people";

export function ArtKicker({ a, withSection = true, tone }: { a: Article; withSection?: boolean; tone?: "default" | "muted" | "on-dark" }) {
  const s = sectionByCode(a.section)!;
  return (
    <Kicker tone={tone}>
      {withSection ? `${s.label} · ` : ""}
      {subsectionLabel(a.section, a.subsection)}
    </Kicker>
  );
}

/** Image-led tile with title over a gradient (home hero mosaic). */
export function HeroTile({ a, size = "lg", className }: { a: Article; size?: "lg" | "sm"; className?: string }) {
  return (
    <Link href={articleHref(a)} className={clsx("group relative block overflow-hidden rounded-card-lg bg-dark text-white", className)}>
      <span className="absolute inset-0 bg-[linear-gradient(135deg,#2A2B36,#15161C)]" aria-hidden="true" />
      <MeshBg id={a.mesh ?? "weldQ"} color="#FFFFFF" opacity={0.16} />
      <span className="absolute inset-0 bg-[linear-gradient(180deg,rgba(21,22,28,0)_30%,rgba(21,22,28,.55)_60%,rgba(21,22,28,.96)_100%)]" aria-hidden="true" />
      <span className={clsx("relative flex h-full flex-col justify-end", size === "lg" ? "p-7 max-md:p-5" : "p-5")}>
        <span className="flex items-center gap-2">
          <Badge tone="topic" size="sm">{subsectionLabel(a.section, a.subsection)}</Badge>
          {a.featured && size === "lg" && <span className="num text-[10px] font-extrabold tracking-[0.1em] text-grey-3">{fmtDateShort(a.date)}</span>}
        </span>
        <span className={clsx("font-display mt-3 block group-hover:text-red-text transition-colors", size === "lg" ? "text-[34px] leading-[1.06] max-md:text-[24px]" : "text-[19px] leading-[1.18]")}>{a.title}</span>
        {size === "lg" && <span className="mt-3 hidden max-w-[62ch] text-[14.5px] font-medium leading-[1.55] text-grey-3 md:block">{a.dek}</span>}
        <span className="num mt-3 text-[11px] font-bold tracking-[0.06em] text-grey-3">{getAuthor(a.author)?.name} · {a.readMin} MIN</span>
      </span>
    </Link>
  );
}

/** Thumb + kicker + title + meta row (Latest lists, feeds). */
export function ArticleRow({ a, thumb = true, dek = false, className, size = "md" }: { a: Article; thumb?: boolean; dek?: boolean; className?: string; size?: "md" | "sm" }) {
  return (
    <Link href={articleHref(a)} className={clsx("group flex gap-4 py-4 border-b border-line", className)}>
      {thumb && (
        <span className={clsx("relative shrink-0 overflow-hidden rounded-lg bg-dark-2", size === "md" ? "w-[132px] aspect-[4/3]" : "w-[88px] aspect-[4/3]")} aria-hidden="true">
          <MeshBg id={a.mesh ?? "weldQ"} color="#FFFFFF" opacity={0.18} />
        </span>
      )}
      <span className="flex min-w-0 flex-col gap-1.5">
        <ArtKicker a={a} withSection={false} />
        <span className={clsx("font-display group-hover:text-red-text leading-[1.22]", size === "md" ? "text-[18px]" : "text-[15.5px]")}>{a.title}</span>
        {dek && <span className="text-[13.5px] font-medium leading-[1.55] text-slate">{a.dek}</span>}
        <span className="num text-[11px] font-bold tracking-[0.06em] text-grey">{fmtDateShort(a.date)} · {a.readMin} MIN{getAuthor(a.author) ? ` · ${getAuthor(a.author)!.name.toUpperCase()}` : ""}</span>
      </span>
    </Link>
  );
}

/** Vertical card with image on top (Technical Guides, Latest in Applications). */
export function ArticleCard({ a, className, ratio = "16/9", showDek = true }: { a: Article; className?: string; ratio?: "16/9" | "4/3"; showDek?: boolean }) {
  return (
    <Link href={articleHref(a)} className={clsx("group flex flex-col gap-3", className)}>
      <span className="relative block overflow-hidden rounded-card bg-dark-2" style={{ aspectRatio: ratio }} aria-hidden="true">
        <MeshBg id={a.mesh ?? "weldQ"} color="#FFFFFF" opacity={0.16} />
        <span className="absolute left-0 bottom-0 rounded-tr-lg bg-red px-2.5 py-1 text-[9.5px] font-extrabold tracking-[0.12em] text-white">{subsectionLabel(a.section, a.subsection).toUpperCase()}</span>
      </span>
      <span className="font-display text-[18px] leading-[1.22] group-hover:text-red-text">{a.title}</span>
      {showDek && <span className="text-[13.5px] font-medium leading-[1.55] text-slate">{a.dek}</span>}
      <span className="num text-[11px] font-bold tracking-[0.06em] text-grey">{fmtDate(a.date).toUpperCase()} · {a.readMin} MIN</span>
    </Link>
  );
}

/** Compact numbered row (Most read, Our coverage). */
export function NumberedRow({ a, n, thumb }: { a: Article; n: number; thumb?: boolean }) {
  return (
    <Link href={articleHref(a)} className="group flex items-start gap-3 border-b border-line-soft py-3 last:border-0">
      <span className="num w-6 shrink-0 text-[12px] font-extrabold text-red-text">{String(n).padStart(2, "0")}</span>
      {thumb && <Thumb className="w-[56px]" ratio="4/3" dark />}
      <span className="min-w-0">
        <span className="font-display block text-[15px] leading-[1.25] group-hover:text-red-text">{a.title}</span>
        <span className="num block truncate text-[10px] font-bold tracking-[0.06em] text-grey">{subsectionLabel(a.section, a.subsection).toUpperCase()} · {fmtDateShort(a.date)}</span>
      </span>
    </Link>
  );
}

/** Sponsored native card — visually distinct, always labelled. */
export function SponsoredCard({ a, className }: { a: Article; className?: string }) {
  return (
    <Link href={articleHref(a)} rel="sponsored" className={clsx("group flex gap-4 rounded-card border border-dashed border-line-2 bg-paper p-4", className)}>
      <span className="relative w-[96px] shrink-0 overflow-hidden rounded-lg bg-line" style={{ aspectRatio: "4/3" }} aria-hidden="true" />
      <span className="flex min-w-0 flex-col gap-1.5">
        <span className="flex items-center gap-2"><Badge tone="sponsored" size="sm">Sponsored</Badge><span className="meta text-[11px]">{a.sponsor}</span></span>
        <span className="text-[15.5px] font-extrabold leading-[1.25] text-fg-2 group-hover:text-red-text">{a.title}</span>
        <span className="meta text-[11px]">Paid for by {a.sponsor} · not written by our editors</span>
      </span>
    </Link>
  );
}
