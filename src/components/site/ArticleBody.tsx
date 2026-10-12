import Link from "next/link";
import { MeshBg } from "@/components/ui/Mesh";
import { AdSlot } from "@/components/ui/AdSlot";
import type { Block } from "@/lib/content/types";
import { slugify, getStandardByNo } from "@/lib/content/standards";

/** Auto-link standard numbers in prose (HANDOFF §2.3). Titles are never linked. */
const STD_RE = /\b((?:pr)?(?:EN ISO|EN|ISO|ASTM|BS EN|DIN EN|DIN|BS|GB\/T|AASHTO|JIS)\s?[A-Z]?\d{2,5}(?:-\d{1,2})?)\b/g;
export function autoLinkStandards(html: string) {
  // skip text already inside an anchor
  const parts = html.split(/(<a\b[^>]*>[\s\S]*?<\/a>)/g);
  return parts
    .map((p) => {
      if (p.startsWith("<a")) return p;
      return p.replace(STD_RE, (m) => {
        const std = getStandardByNo(m.replace(/\s+/g, " "));
        return std ? `<a class="std-link" href="/standards/${slugify(std.no)}/">${m}</a>` : m;
      });
    })
    .join("");
}

export function ArticleBody({ blocks, showAd }: { blocks: Block[]; showAd: boolean }) {
  return (
    <div className="article-body">
      {blocks.map((b, i) => {
        switch (b.type) {
          case "p":
            return <p key={i} className="my-4 text-[16.5px] font-medium leading-[1.75] text-fg-2 [&_.dropcap]:float-left [&_.dropcap]:mr-3 [&_.dropcap]:mt-1.5 [&_.dropcap]:font-display [&_.dropcap]:text-[76px] [&_.dropcap]:leading-[.82] [&_.dropcap]:text-red [&_.dropcap]:tracking-[-0.05em]" dangerouslySetInnerHTML={{ __html: autoLinkStandards(b.html) }} />;
          case "h2":
            return (
              <h2 key={i} id={b.id} className="font-display mt-10 mb-3 scroll-mt-24 text-[24px] leading-[1.15]">
                {b.text}
              </h2>
            );
          case "ul":
            return (
              <ul key={i} className="my-4 flex flex-col gap-2 pl-5 text-[16px] font-medium leading-[1.65] text-fg-2 marker:text-red">
                {b.items.map((it, j) => <li key={j} className="list-disc" dangerouslySetInnerHTML={{ __html: autoLinkStandards(it) }} />)}
              </ul>
            );
          case "quote":
            return (
              <figure key={i} className="my-8 border-l-4 border-red pl-6">
                <blockquote className="font-display text-[24px] leading-[1.25] tracking-[-0.03em]">“{b.text}”</blockquote>
                {b.cite && <figcaption className="meta mt-2">— {b.cite}</figcaption>}
              </figure>
            );
          case "figure":
            return (
              <figure key={i} className="my-8">
                <div className="relative aspect-[16/9] overflow-hidden rounded-card bg-[#D2D4DD] dark:bg-dark-2">
                  <MeshBg id={(b.mesh as never) ?? "weldQ"} color="#8A8F9E" opacity={0.8} />
                  <span className="absolute left-0 bottom-0 rounded-tr-lg bg-red px-2.5 py-1.5 text-[10px] font-extrabold tracking-[0.12em] text-white">FIG.</span>
                </div>
                <figcaption className="meta mt-2 leading-[1.55]">{b.caption}{b.source && <span className="text-grey"> · Source: {b.source}</span>}</figcaption>
              </figure>
            );
          case "spec":
            return (
              <div key={i} className="relative my-8 overflow-hidden rounded-card bg-dark p-6 text-white">
                <MeshBg id="weldQ" color="#FFFFFF" opacity={0.14} className="!left-auto !w-[320px]" />
                <div className="relative">
                  <div className="mb-4 flex items-center gap-2.5"><span className="h-[3px] w-[15px] bg-red" /><span className="font-display text-[12.5px] tracking-[0.1em]">{b.title.toUpperCase()}</span></div>
                  <div className="flex flex-wrap gap-8">
                    <dl className="grid flex-1 grid-cols-[auto_1fr] gap-x-6 gap-y-2 text-[14px]">
                      {b.rows.map(([k, v]) => (
                        <div key={k} className="contents"><dt className="text-grey-3">{k}</dt><dd className="num font-extrabold">{v}</dd></div>
                      ))}
                    </dl>
                    {b.standards && (
                      <div className="w-[160px] border-l border-white/10 pl-6">
                        <div className="font-display mb-2 text-[11px] tracking-[0.1em] text-grey-3">STANDARDS</div>
                        <div className="num flex flex-col gap-1.5 text-[13px] font-bold">
                          {b.standards.map((s) => {
                            const std = getStandardByNo(s);
                            return std ? <Link key={s} href={`/standards/${std.slug}/`} className="border-b border-dotted border-red pb-px hover:text-red-text">{s}</Link> : <span key={s}>{s}</span>;
                          })}
                        </div>
                        <div className="num mt-2 text-[9.5px] font-extrabold tracking-[0.08em] text-grey-5">IN STANDARDS INDEX →</div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          case "table":
            return (
              <div key={i} className="my-6 overflow-x-auto">
                <table className="w-full border-collapse text-[13.5px]">
                  <thead><tr>{b.head.map((h) => <th key={h} className="bg-ink px-3 py-2.5 text-left text-[10.5px] font-extrabold tracking-[0.1em] text-white dark:bg-dark-3">{h.toUpperCase()}</th>)}</tr></thead>
                  <tbody>{b.rows.map((r, ri) => <tr key={ri} className="even:bg-paper-2">{r.map((c, ci) => <td key={ci} className="num border-b border-line px-3 py-2.5 align-top font-medium text-fg-2 first:font-bold">{c}</td>)}</tr>)}</tbody>
                </table>
                {b.caption && <p className="meta mt-2">{b.caption}</p>}
              </div>
            );
          case "checklist":
            return (
              <div key={i} className="my-8 rounded-card border-2 border-ink p-5 dark:border-line-2">
                <div className="font-display mb-3 text-[16px]">{b.title}</div>
                <ul className="flex flex-col gap-2">
                  {b.items.map((it, j) => (
                    <li key={j} className="flex items-start gap-3 text-[15px] font-medium text-fg-2"><span className="mt-1 inline-flex h-4 w-4 shrink-0 items-center justify-center rounded-sm border-[1.5px] border-ink dark:border-line-2" aria-hidden="true" />{it}</li>
                  ))}
                </ul>
              </div>
            );
          case "ad":
            return showAd ? <div key={i} className="my-8"><AdSlot kind="in-article" /></div> : null;
        }
      })}
    </div>
  );
}
