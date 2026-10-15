import type { Metadata } from "next";
import { pageMeta } from "@/lib/seo";
import { AboutBoard } from "@/components/boards/about/AboutBoard";

export const metadata: Metadata = pageMeta({ title: "About", description: "Who publishes Wire Mesh News, who owns it, what we cover and how we work.", path: "/about/" });

export default function AboutPage() {
  return <AboutBoard />;
}
