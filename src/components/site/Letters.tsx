import Link from "next/link";
import { clsx } from "clsx";
import { Kicker, Badge } from "@/components/ui/Primitives";
import type { Letter, Column } from "@/lib/content/types";
import { daysAgo, fmtDate } from "@/lib/site";

export function EnvelopeIcon({ size = 20, className }: { size?: number; className?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" aria-hidden="true" className={className}>
      <path d="M3 6.5h18v11H3z" />
      <path d="m3 7 9 6 9-6" />
    </svg>
  );
}

export function LetterItem({ l, teaser = false, dateMode = "relative", className }: { l: Letter; teaser?: boolean; dateMode?: "relative" | "absolute"; className?: string }) {
  return (
    <article className={clsx("flex gap-4 border-t border-line py-[18px]", className)}>
      <span className="flex h-[46px] w-[46px] shrink-0 items-center justify-center rounded-full border border-line bg-paper text-grey"><EnvelopeIcon /></span>
      <div className="min-w-0 flex-1">
        <div className="mb-1.5 flex flex-wrap items-center gap-x-2.5 gap-y-1">
          <Kicker>Letter</Kicker>
          <span className="text-[12px] font-bold">{l.writer.name ?? "Name withheld"}</span>
          <span className="meta text-[12px]">· {l.writer.role} · {l.writer.org}{l.writer.name ? "" : " · identity verified by the editor"}</span>
          <span className="num ml-auto text-[11px] font-bold text-grey">{dateMode === "relative" ? daysAgo(l.date) : fmtDate(l.date).toUpperCase()}</span>
        </div>
        <Link href={`/letters/${l.slug}/`} className="font-display block text-[19px] leading-[1.26] hover:text-red-text md:text-[20px]">“{l.title}”</Link>
        {teaser && <p className="mt-2 text-[13.5px] font-medium leading-[1.6] text-fg-3">{l.teaser}</p>}
        <div className="meta mt-2 flex flex-wrap items-center gap-x-3.5 gap-y-1.5 text-[12.5px]">
          <span>Replying to <Link href={`/letters/#`} className="underline hover:text-red-text">{l.replyTo.title}</Link></span>
          {l.editorReply && <Badge tone="standard" size="sm">Editor replied</Badge>}
          {l.ledToCorrection && <Badge tone="current" size="sm">Led to a correction</Badge>}
          {l.furtherLetters && l.furtherLetters.length > 0 && <span className="num text-[11px] font-extrabold tracking-[0.06em] text-grey">{l.furtherLetters.length} FURTHER LETTER{l.furtherLetters.length > 1 ? "S" : ""} →</span>}
        </div>
      </div>
    </article>
  );
}

export function ColumnCard({ c, compact = false }: { c: Column; compact?: boolean }) {
  return (
    <div className="rounded-card-lg border-2 border-ink p-[22px] dark:border-line-2">
      <div className="mb-3.5 flex items-center justify-between gap-2.5">
        <span className="font-display text-[13px] tracking-[0.08em] text-grey">{compact ? "COLUMN" : "THIS WEEK’S COLUMN"}</span>
        <Badge tone="opinion">Opinion</Badge>
      </div>
      <span className="font-display block text-[44px] leading-[.5] text-red" aria-hidden="true">“</span>
      <Link href={`/letters/columns/${c.slug}/`} className="font-display mt-3.5 block text-[21px] leading-[1.2] hover:text-red-text">{c.title}</Link>
      {!compact && <p className="meta mt-3 leading-[1.6]">{c.summary}</p>}
      <div className="mt-3.5 flex items-center gap-3 border-t border-line-soft pt-3.5">
        <span className="h-[38px] w-[38px] shrink-0 rounded-full bg-line" aria-hidden="true" />
        <span className="min-w-0"><span className="block text-[13.5px] font-extrabold">{c.author.name}</span><span className="meta block text-[11.5px]">{c.author.title} · {c.author.org}</span></span>
      </div>
      <p className="meta mt-3 text-[11px] leading-[1.55] text-grey">The author’s own view, not that of Wire Mesh News. Disclosure: {c.author.disclosure}</p>
    </div>
  );
}

export function WriteToEditor({ className }: { className?: string }) {
  return (
    <div className={clsx("flex flex-wrap items-center gap-4 rounded-xl bg-paper p-[16px_18px]", className)}>
      <div className="flex-1 basis-[320px]">
        <div className="font-display text-[16px]">Write to the editor</div>
        <p className="meta mt-1 leading-[1.6]">200–400 words — one specific point or one experience from site. Sign in to send; we verify your name and organisation before publishing. You can ask for your name to be withheld.</p>
      </div>
      <Link href="/letters/#write" className="inline-flex min-h-[44px] items-center rounded-full bg-ink px-5 text-[13.5px] font-extrabold text-white hover:bg-red dark:bg-white dark:text-ink">Send a letter</Link>
    </div>
  );
}
