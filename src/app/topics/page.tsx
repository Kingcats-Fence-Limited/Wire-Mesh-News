import type { Metadata } from "next";
import { TopicsIndexBoard } from "@/components/boards/topic/TopicBoard";

export const metadata: Metadata = { title: "Topics", description: "Curated reading paths across the sections, in the order a real decision is made." };

export default function TopicsPage() {
  return <TopicsIndexBoard />;
}
