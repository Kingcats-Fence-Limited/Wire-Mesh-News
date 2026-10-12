import type { Metadata } from "next";
import { EventsBoard, type EvParams } from "@/components/boards/events/EventsBoard";

export const metadata: Metadata = { title: "Events Calendar", description: "Trade shows, conferences and webinars across wire, mesh, fencing and grating — with our reporting from the ones we attend." };

export default async function EventsPage({ searchParams }: { searchParams: Promise<EvParams> }) {
  return <EventsBoard sp={await searchParams} />;
}
