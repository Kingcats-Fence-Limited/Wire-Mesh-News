import type { Metadata } from "next";
import { pageMeta } from "@/lib/seo";
import { JsonLd } from "@/components/seo/JsonLd";
import { eventLd } from "@/lib/schema";
import { EVENTS } from "@/lib/content/directory";
import { todayIso } from "@/lib/site";
import { EventsBoard, type EvParams } from "@/components/boards/events/EventsBoard";

export const metadata: Metadata = pageMeta({ title: "Events Calendar", description: "Trade shows, conferences and webinars across wire, mesh, fencing and grating — with our reporting from the ones we attend.", path: "/events/" });

export default async function EventsPage({ searchParams }: { searchParams: Promise<EvParams> }) {
  const today = todayIso();
  const upcoming = EVENTS.filter((e) => (e.end ?? e.start) >= today);
  return <>{upcoming.length > 0 && <JsonLd data={{ "@context": "https://schema.org", "@graph": upcoming.map(eventLd) }} />}<EventsBoard sp={await searchParams} /></>;
}
