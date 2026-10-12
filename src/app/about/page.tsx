import type { Metadata } from "next";
import { AboutBoard } from "@/components/boards/about/AboutBoard";

export const metadata: Metadata = { title: "About", description: "Who publishes Wire Mesh News, who owns it, what we cover and how we work." };

export default function AboutPage() {
  return <AboutBoard />;
}
