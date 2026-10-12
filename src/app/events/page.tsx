import Link from "next/link";
import type { Metadata } from "next";
import { Shell, PageHead } from "@/components/site/Shell";
import { Badge, Card, Chip } from "@/components/ui/Primitives";
import { MeshBg } from "@/components/ui/Mesh";
import { ArticleRow } from "@/components/site/ArticleCards";
import { NewsletterForm } from "@/components/site/NewsletterForm";
import { upcomingEvents, COMPANIES } from "@/lib/content/directory";
import { bySubsection } from "@/lib/content/articles";
import { COUNTRY_BY_CODE } from "@/data/vocab";
import { fmtDate, fmtDateShort } from "@/lib/site";

export const metadata: Metadata = { title: "Events Calendar", description: "Trade shows, conferences and webinars across wire, mesh, fencing and grating — with our reporting from the ones we attend." };

const TYPE_LABEL = { trade_show: "Trade show", conference: "Conference", webinar: "Webinar" } as const;
const range = (e: { start: string; end?: string }) => {
  const s = new Date(e.start);
  const d = new Intl.DateTimeFormat("en-GB", { day: "numeric" });
  const m = new Intl.DateTimeFormat("en-GB", { month: "short", year: "numeric" });
  if (!e.end) return `${d.format(s)} ${m.format(s)}`;
  const en = new Date(e.end);
  return `${d.format(s)} – ${d.format(en)} ${m.format(en)}`;
};

export default function EventsPage() {
  const events = upcomingEvents();
  const next = events.find((e) => e.weAttend) ?? events[0];
  const byMonth = new Map<string, typeof events>();
  for (const e of events) {
    const k = new Intl.DateTimeFormat("en-GB", { month: "long", year: "numeric" }).format(new Date(e.start)).toUpperCase();
    byMonth.set(k, [...(byMonth.get(k) ?? []), e]);
  }
  const reports = bySubsection("news", "events_exhibitions");
  return (
    <Shell>
      <PageHead
        crumbs={[{ label: "Events" }]}
        title="Events Calendar"
        intro="Trade shows, conferences and webinars across wire, mesh, fencing and grating — with our reporting from the ones we attend. Listing is free and never paid for."
        aside={<a href="/events.ics" className="inline-flex min-h-[44px] items-center gap-2 rounded-full border-[1.5px] border-ink px-5 text-[13.5px] font-extrabold hover:border-red hover:text-red-text dark:border-white"><svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" aria-hidden="true"><rect x="3" y="5" width="18" height="16" rx="2" /><path d="M3 10h18M8 3v4M16 3v4" /></svg>Subscribe to calendar</a>}
      />
      <div className="wrap">
        <div className="no-scrollbar flex gap-2 overflow-x-auto border-b border-line py-4">
          <Chip active size="sm">Upcoming</Chip><Chip size="sm">Past &amp; reports</Chip>
          <span className="mx-1 h-6 w-px self-center bg-line" />
          <Chip active size="sm">All regions</Chip><Chip size="sm">Asia</Chip><Chip size="sm">Europe</Chip><Chip size="sm">North America</Chip><Chip size="sm">Middle East</Chip>
          <span className="mx-1 h-6 w-px self-center bg-line" />
          <Chip size="sm">Trade show</Chip><Chip size="sm">Conference</Chip><Chip size="sm">Webinar</Chip>
        </div>
      </div>

      <div className="wrap grid gap-10 pt-6 lg:grid-cols-[minmax(0,1fr)_320px]">
        <div>
          {/* Next up */}
          {next && (
            <div id={next.slug} className="relative overflow-hidden rounded-card-lg bg-dark p-6 text-white md:p-8">
              <MeshBg id="chainL" color="#FFFFFF" opacity={0.08} />
              <div className="relative grid gap-6 md:grid-cols-[1.4fr_1fr]">
                <div>
                  <span className="kicker text-[10px] text-grey-3">Next up{next.weAttend && " · we’ll be there"}</span>
                  <h2 className="font-display mt-2 text-[30px] leading-[1.1]">{next.name}</h2>
                  <div className="num mt-2 text-[14px] font-bold text-on-dark-2">{range(next)} · {next.online ? "Online" : `${next.venue}, ${next.city}, ${COUNTRY_BY_CODE[next.country!]?.name}`}</div>
                  <p className="mt-3 text-[14px] font-medium leading-[1.6] text-grey-3">{next.summary} Only verifiable facts are listed; we do not quote exhibitor or visitor numbers without an official source.</p>
                  <div className="mt-4 flex flex-wrap gap-2">
                    <Badge tone="event">{TYPE_LABEL[next.type]}</Badge><Badge tone="opinion" className="!border-line-dark !text-grey-3">{next.focus}</Badge>
                    {next.website && <a href={next.website} target="_blank" rel="noopener noreferrer nofollow" className="ml-2 inline-flex min-h-[32px] items-center rounded-full bg-white px-4 text-[12.5px] font-extrabold text-ink">Official site ↗</a>}
                  </div>
                </div>
                <div className="rounded-card border border-line-dark bg-white/[.03] p-4">
                  <div className="kicker text-[10px] text-grey-3">Our coverage plan</div>
                  <ul className="mt-2 flex flex-col gap-2 text-[13px] font-medium text-on-dark-2">
                    <li><b className="text-white">Preview</b> — themes to watch, published in News › Events</li>
                    <li><b className="text-white">On-site interviews</b> — company conversations and new products</li>
                    <li><b className="text-white">Show report</b> — post-show analysis, linked to Directory profiles</li>
                  </ul>
                  <div className="mt-3 border-t border-line-dark pt-3 text-[11.5px] font-medium text-grey-3">Media partnerships can include an event introduction, reporting and company interviews; partnership content is clearly labelled. <Link href="/advertise/" className="font-extrabold text-red-text">ADVERTISE &amp; PARTNER →</Link></div>
                </div>
              </div>
            </div>
          )}

          {/* Upcoming by month */}
          <h2 className="font-display mt-10 text-[22px]">Upcoming</h2>
          {[...byMonth.entries()].map(([month, list]) => (
            <div key={month} className="mt-5">
              <div className="flex items-center gap-3"><span className="num font-display text-[12px] tracking-[0.1em] text-grey">{month}</span><span className="h-px flex-1 bg-line" /></div>
              {list.map((e) => (
                <div key={e.slug} id={e.slug} className="flex scroll-mt-20 gap-4 border-b border-line py-4">
                  <span className="num flex h-14 w-14 shrink-0 flex-col items-center justify-center rounded-lg bg-dark text-white"><span className="text-[9px] font-extrabold tracking-[0.1em]">{fmtDateShort(e.start).split(" ")[1]}</span><span className="text-[22px] font-extrabold leading-none">{fmtDateShort(e.start).split(" ")[0]}</span></span>
                  <div className="min-w-0 flex-1">
                    <div className="font-display text-[18px] leading-[1.2]">{e.name}</div>
                    <div className="num meta mt-0.5">{range(e)} · {e.online ? `Online · ${e.organiser}` : `${e.city}, ${COUNTRY_BY_CODE[e.country!]?.name}${e.venue ? ` · ${e.venue}` : ""}`}</div>
                    <p className="mt-1.5 text-[13.5px] font-medium leading-[1.55] text-fg-3">{e.summary}</p>
                    <div className="mt-2 flex flex-wrap items-center gap-2"><Badge tone="event" size="sm">{TYPE_LABEL[e.type]}</Badge><Badge tone="neutral" size="sm">{e.focus}</Badge>{e.weAttend && <Badge tone="topic" size="sm">We’ll be there</Badge>}{e.website && <a href={e.website} target="_blank" rel="noopener noreferrer nofollow" className="ml-auto text-[11px] font-extrabold tracking-[0.06em] text-red-text">DETAILS ↗</a>}</div>
                  </div>
                </div>
              ))}
            </div>
          ))}

          <h2 className="font-display mt-12 text-[22px]">Show reports</h2>
          {reports.map((a) => <ArticleRow key={a.slug} a={a} />)}
        </div>

        <aside className="flex flex-col gap-5">
          <Card tone="paper">
            <div className="font-display text-[16px]">Event alerts</div>
            <p className="meta mt-1 mb-3">One email a month: next month’s events and our coverage plan.</p>
            <NewsletterForm compact listName="event alerts" />
          </Card>
          <Card>
            <div className="font-display text-[16px]">Submit an event</div>
            <p className="meta mt-1 leading-[1.6]">Trade shows and industry events can be submitted with an official website and dates. Editors verify before listing; listing is free and paid placement is not offered.</p>
            <Link href="/contact/?subject=other" className="mt-3 inline-flex min-h-[42px] items-center rounded-full border-[1.5px] border-ink px-4 text-[13px] font-extrabold hover:border-red hover:text-red-text dark:border-white">Submit event details</Link>
          </Card>
          <Card>
            <div className="kicker mb-2 text-[10px]">Exhibiting companies</div>
            <ul className="flex flex-col">
              {COMPANIES.filter((c) => c.claimed).slice(0, 4).map((c) => <li key={c.slug}><Link href={`/directory/${c.slug}/`} className="flex items-center justify-between border-t border-line-soft py-2 text-[13.5px] font-extrabold hover:text-red-text"><span>{c.name}</span><Badge tone="review" size="sm">Self-reported</Badge></Link></li>)}
            </ul>
            <Link href="/directory/" className="mt-3 inline-block text-[11.5px] font-extrabold tracking-[0.06em] text-red-text">DIRECTORY →</Link>
          </Card>
          <p className="meta text-[11px]">Calendar last reviewed {fmtDate("2026-10-10")}.</p>
        </aside>
      </div>
    </Shell>
  );
}
