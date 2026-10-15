import type { Metadata } from "next";
import { pageMeta } from "@/lib/seo";
import { TopicsIndexBoard } from "@/components/boards/topic/TopicBoard";

export const metadata: Metadata = pageMeta({ title: "Topics", description: "Curated reading paths across the sections, in the order a real decision is made.", path: "/topics/" });

export default function TopicsPage() {
  return <TopicsIndexBoard />;
}
