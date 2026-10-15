import type { Metadata } from "next";
import { Suspense } from "react";
import { pageMeta } from "@/lib/seo";
import { JsonLd } from "@/components/seo/JsonLd";
import { eventLd } from "@/lib/schema";
import { Shell } from "@/components/shell/Shell";
import { EVENTS } from "@/lib/content/source";
import { COMPANIES } from "@/lib/content/directory";
import { bySubsection, getArticle } from "@/lib/content/articles";
import { articleHref, todayIso } from "@/lib/site";
import { EventsBoard, EventsFromUrl, type EvData } from "@/components/boards/events/EventsBoard";

export const metadata: Metadata = pageMeta({ title: "Events Calendar", description: "Trade shows, conferences and webinars across wire, mesh, fencing and grating — with our reporting from the ones we attend.", path: "/events/" });

/* Static (regenerated hourly with the rest of the site); filters run in the browser. */
export default function EventsPage() {
  const today = todayIso();
  const upcoming = EVENTS.filter((e) => (e.end ?? e.start) >= today);
  const data: EvData = {
    events: EVENTS,
    reportHrefs: Object.fromEntries(EVENTS.filter((e) => e.report).map((e) => { const a = getArticle(e.report!); return [e.report!, a ? articleHref(a) : "/news/events-exhibitions/"]; })),
    reports: bySubsection("news", "events_exhibitions").slice(0, 2).map((a) => ({ slug: a.slug, title: a.title, href: articleHref(a), date: a.date, readMin: a.readMin })),
    exhibitors: COMPANIES.filter((c) => c.claimed).slice(0, 2).map((c) => ({ slug: c.slug, name: c.name })),
  };
  return (
    <Shell header="compact" active="events" board="b-ev">
      {upcoming.length > 0 && <JsonLd data={{ "@context": "https://schema.org", "@graph": upcoming.map(eventLd) }} />}
      <Suspense fallback={<EventsBoard sp={{}} data={data} today={today} />}>
        <EventsFromUrl data={data} />
      </Suspense>
    </Shell>
  );
}
