import Link from "next/link";
import { clsx } from "clsx";
import { Badge } from "@/components/ui/Primitives";
import { BrandIcon } from "@/components/ui/Brand";
import type { BadgeTone } from "@/components/ui/Primitives";
import type { SearchDoc, SearchType } from "@/lib/search";

export const TYPE_LABEL: Record<SearchType, string> = {
  article: "Article",
  letter: "Letter",
  opinion: "Opinion",
  company: "Company",
  standard: "Standard",
  topic: "Topic",
  event: "Event",
};

function Lead({ doc, size }: { doc: SearchDoc; size: "sm" | "md" }) {
  const box = size === "md" ? "w-[150px] aspect-[4/3] rounded-lg" : "h-12 w-16 rounded-md";
  switch (doc.type) {
    case "standard":
      return (
        <span className={clsx(box, "flex shrink-0 items-center justify-center bg-[var(--st-red-bg)] text-red-deep")}>
          <svg width={size === "md" ? 34 : 22} height={size === "md" ? 34 : 22} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" aria-hidden="true"><path d="M12 3.2 4.8 6v5.4c0 4.3 3 7.8 7.2 9 4.2-1.2 7.2-4.7 7.2-9V6z" /><path d="m8.9 12 2.1 2.1 4-4.2" /></svg>
        </span>
      );
    case "letter":
      return (
        <span className={clsx(box, "flex shrink-0 items-center justify-center bg-[var(--st-review-bg)] text-[var(--st-review-fg)]")}>
          <svg width={size === "md" ? 32 : 20} height={size === "md" ? 32 : 20} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" aria-hidden="true"><path d="M3 6.5h18v11H3z" /><path d="m3 7 9 6 9-6" /></svg>
        </span>
      );
    case "company":
      return (
        <span className={clsx(box, "flex shrink-0 items-center justify-center bg-dark text-white")}>
          <BrandIcon size={size === "md" ? 42 : 26} />
        </span>
      );
    case "topic":
      return <span className={clsx(box, "font-display flex shrink-0 items-center justify-center bg-red text-white", size === "md" ? "text-[34px]" : "text-[17px]")}>T</span>;
    case "event":
      return <span className={clsx(box, "num flex shrink-0 items-center justify-center bg-[var(--st-current-bg)] text-[var(--st-current-fg)] text-[11px] font-extrabold tracking-[0.08em]")}>{doc.meta.split(" ")[1]?.toUpperCase()}</span>;
    case "opinion":
      return <span className={clsx(box, "flex shrink-0 items-center justify-center border-[1.5px] border-line text-grey font-display", size === "md" ? "text-[40px]" : "text-[22px]")}>“</span>;
    default:
      return <span className={clsx(box, "shrink-0 bg-line dark:bg-dark-2")} aria-hidden="true" />;
  }
}

/**
 * The one result renderer used by both the overlay (size="sm") and the
 * results page (size="md"). Titles/snippets come pre-highlighted HTML.
 */
export function SearchResultRow({ doc, titleHtml, snippetHtml, size = "md", active, onClick }: { doc: SearchDoc; titleHtml: string; snippetHtml?: string; size?: "sm" | "md"; active?: boolean; onClick?: () => void }) {
  const tone = doc.type as BadgeTone;
  return (
    <Link
      href={doc.href}
      onClick={onClick}
      className={clsx(
        "group flex gap-4 transition-colors",
        size === "md" ? "border-b border-line py-5" : "rounded-[10px] px-3 py-3 -mx-3",
        active && "bg-paper",
        size === "sm" && "hover:bg-paper",
      )}
    >
      <Lead doc={doc} size={size} />
      <span className="flex min-w-0 flex-1 flex-col gap-1.5">
        <span className="flex flex-wrap items-center gap-2">
          <Badge tone={tone} size="sm">{TYPE_LABEL[doc.type]}</Badge>
          <span className={clsx("meta truncate", size === "sm" && "text-[11.5px]")}>
            {doc.kicker}
            {doc.status && <> · <b className={doc.status === "current" ? "text-up" : doc.status === "withdrawn" ? "text-grey" : "text-[var(--st-review-fg)]"}>{doc.status.replace("_", " ").toUpperCase()}</b></>}
          </span>
        </span>
        <span className={clsx("font-display group-hover:text-red-text", size === "md" ? "text-[20px]" : "text-[16px]", doc.type === "standard" && "num")} dangerouslySetInnerHTML={{ __html: titleHtml }} />
        {snippetHtml && size === "md" && <span className="text-[14px] font-medium leading-[1.55] text-slate" dangerouslySetInnerHTML={{ __html: snippetHtml }} />}
        <span className={clsx("meta", size === "sm" && "text-[11.5px]")}>{doc.meta}</span>
      </span>
      {size === "sm" && active && <span className="num self-center inline-flex h-5 min-w-5 items-center justify-center rounded-[5px] border border-line-2 border-b-2 bg-bg px-1 text-[10.5px] font-extrabold text-slate">↵</span>}
    </Link>
  );
}
