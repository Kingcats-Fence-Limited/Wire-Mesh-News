import Link from "next/link";
import type { Metadata } from "next";
import { Shell, PageHead } from "@/components/site/Shell";
import { Badge, Card, ChipLink } from "@/components/ui/Primitives";
import { LetterItem, ColumnCard } from "@/components/site/Letters";
import { SponsoredCard } from "@/components/site/ArticleCards";
import { LETTERS, COLUMNS } from "@/lib/content/people";
import { sponsoredFor } from "@/lib/content/articles";
import { EDITORIAL_SECTIONS } from "@/lib/site";
import type { SectionCode } from "@/lib/content/types";

export const metadata: Metadata = { title: "Letters & Opinion", description: "Short, signed letters from people who specify, buy, test and make wire mesh — and an occasional column from outside the newsroom." };

export default async function LettersPage({ searchParams }: { searchParams: Promise<{ tab?: string; section?: string }> }) {
  const sp = await searchParams;
  const tab = sp.tab === "columns" ? "columns" : "letters";
  const section = sp.section as SectionCode | undefined;
  const letters = LETTERS.filter((l) => !section || l.replyTo.section === section).sort((a, b) => (a.date < b.date ? 1 : -1));
  const thisMonth = LETTERS.filter((l) => l.date >= "2026-10-01").length;
  const sponsored = sponsoredFor();

  return (
    <Shell>
      <PageHead
        crumbs={[{ label: "Letters & Opinion" }]}
        title="Letters & Opinion"
        intro="Short, signed letters from people who specify, buy, test and make wire mesh — and an occasional column from outside the newsroom. Every writer is identified to the editor, even when published without a name."
        aside={
          <div className="flex flex-col items-start gap-2.5 md:items-end">
            <div className="inline-flex rounded-full border-[1.5px] border-ink p-[3px] dark:border-white">
              <Link href="/letters/" aria-current={tab === "letters" ? "page" : undefined} className={`inline-flex min-h-[34px] items-center gap-2 rounded-full px-4 text-[13.5px] font-extrabold ${tab === "letters" ? "bg-ink text-white dark:bg-white dark:text-ink" : ""}`}>Letters <span className="num opacity-70">{LETTERS.length}</span></Link>
              <Link href="/letters/?tab=columns" aria-current={tab === "columns" ? "page" : undefined} className={`inline-flex min-h-[34px] items-center gap-2 rounded-full px-4 text-[13.5px] font-extrabold ${tab === "columns" ? "bg-ink text-white dark:bg-white dark:text-ink" : ""}`}>Columns <span className="num text-grey">{COLUMNS.length}</span></Link>
            </div>
            <Link href="/policies/submission-guidelines/" className="text-[12px] font-extrabold tracking-[0.06em] text-red-text">LETTERS POLICY →</Link>
          </div>
        }
      />

      {tab === "letters" && (
        <div className="wrap">
          <div className="no-scrollbar flex items-center gap-2 overflow-x-auto border-b border-line py-4">
            <span className="kicker mr-1 text-[10.5px]">Replying to</span>
            <ChipLink href="/letters/" active={!section} size="sm">All sections</ChipLink>
            {EDITORIAL_SECTIONS.map((s) => (
              <ChipLink key={s.code} href={`/letters/?section=${s.code}`} active={section === s.code} size="sm" count={LETTERS.filter((l) => l.replyTo.section === s.code).length}>{s.label}</ChipLink>
            ))}
          </div>
        </div>
      )}

      <div className="wrap grid gap-11 pt-4 lg:grid-cols-[minmax(0,1fr)_320px]">
        <div>
          {tab === "letters" ? (
            <>
              <div className="flex items-center gap-2.5 py-3"><span className="font-display text-[13px] tracking-[0.08em] text-grey">FROM OUR READERS</span><span className="num text-[11px] font-extrabold text-grey-4">{thisMonth} THIS MONTH</span></div>
              {letters.map((l, i) => (
                <div key={l.slug}>
                  <LetterItem l={l} teaser dateMode="absolute" />
                  {i === 2 && sponsored && <SponsoredCard a={sponsored} className="my-2" />}
                </div>
              ))}
              <div className="border-t border-line" />
              <nav aria-label="Pagination" className="mt-6 flex items-center gap-2">
                <span className="inline-flex min-h-[38px] min-w-[42px] items-center justify-center rounded-full bg-ink text-[13.5px] font-bold text-white dark:bg-white dark:text-ink">1</span>
                <span className="meta">Page 1 of 1</span>
              </nav>
            </>
          ) : (
            <div className="grid gap-5 pt-4 md:grid-cols-2">
              {COLUMNS.map((c) => <ColumnCard key={c.slug} c={c} />)}
              <Card tone="paper" className="md:col-span-2">
                <div className="font-display text-[16px]">About columns</div>
                <p className="meta mt-1 leading-[1.6]">Columns are written by outside authors under their own name, job title and organisation, with a disclosure of interests at the end. The newsroom does not write columns; OPINION is labelled wherever a column appears.</p>
              </Card>
            </div>
          )}
        </div>

        <aside className="flex flex-col gap-5 pt-3">
          <div id="write" className="scroll-mt-20 rounded-card-lg bg-dark p-6 text-white">
            <div className="font-display text-[20px]">Write to the editor</div>
            <p className="mt-2 text-[13.5px] font-medium leading-[1.6] text-on-dark-2">200–400 words. One specific point, one experience from a site or a plant, or a correction to something we published.</p>
            <ul className="mt-3.5 flex list-disc flex-col gap-1.5 pl-[18px] text-[12.5px] font-medium leading-[1.6] text-grey-3">
              <li>Sign in to send. We verify your name and organisation before publishing.</li>
              <li>You can ask for your name to be withheld; the editor must still know who you are.</li>
              <li>Letters may be shortened. We never change the point you make.</li>
              <li>No product promotion, no price quotes, nothing about a named competitor.</li>
            </ul>
            <Link href="/signin/?next=/letters/" className="mt-4 inline-flex min-h-[46px] w-full items-center justify-center rounded-full bg-red text-[14px] font-extrabold hover:bg-red-deep">Send a letter</Link>
            <p className="mt-3 text-[11px] font-medium leading-[1.55] text-grey-5">By sending a letter you grant Wire Mesh News a non-exclusive licence to publish and edit it. See the <Link href="/policies/submission-guidelines/" className="underline text-grey-3">Letters policy</Link>.</p>
          </div>
          {tab === "letters" && (
            <div className="rounded-card-lg border-2 border-ink p-5 dark:border-line-2">
              <div className="mb-3 flex items-center justify-between"><span className="font-display text-[13px] tracking-[0.08em] text-grey">COLUMNS</span><Badge tone="opinion">Opinion</Badge></div>
              {COLUMNS.map((c) => (
                <Link key={c.slug} href={`/letters/columns/${c.slug}/`} className="group flex gap-3 border-t border-line-soft py-2.5">
                  <span className="h-9 w-9 shrink-0 rounded-full bg-line" aria-hidden="true" />
                  <span className="min-w-0"><span className="font-display block text-[15px] leading-[1.25] group-hover:text-red-text">{c.title}</span><span className="meta block text-[11.5px]">{c.author.name} · {c.author.title} · {c.author.org}</span></span>
                </Link>
              ))}
              <Link href="/letters/?tab=columns" className="mt-3 block border-t border-line-soft pt-3 text-[12.5px] font-extrabold tracking-[0.06em] text-red-text">ALL COLUMNS →</Link>
            </div>
          )}
          <Card>
            <div className="font-display text-[15px]">How we choose letters</div>
            <ul className="mt-2 flex list-disc flex-col gap-1.5 pl-[17px] text-[12.5px] font-medium leading-[1.65] text-fg-3">
              <li>It adds something to a piece we published — a correction, a counter-example, a question we did not ask.</li>
              <li>The writer has first-hand standing: they specify, buy, test, make or regulate.</li>
              <li>We publish disagreement with our own reporting and say so when a letter led to a correction.</li>
            </ul>
          </Card>
        </aside>
      </div>
    </Shell>
  );
}
