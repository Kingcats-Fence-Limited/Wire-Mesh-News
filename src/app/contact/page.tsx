import type { Metadata } from "next";
import { ContactBoard } from "@/components/boards/contact/ContactBoard";

export const metadata: Metadata = { title: "Contact", description: "Editorial tips, corrections, submissions, advertising and account questions — routed to the right person." };

export default async function ContactPage({ searchParams }: { searchParams: Promise<{ subject?: string }> }) {
  return <ContactBoard subject={(await searchParams).subject} />;
}
