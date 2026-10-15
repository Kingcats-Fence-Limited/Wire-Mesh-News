import type { Metadata } from "next";
import { pageMeta } from "@/lib/seo";
import { AdvertiseBoard } from "@/components/boards/advertise/AdvertiseBoard";

export const metadata: Metadata = pageMeta({ title: "Advertise & Partner", description: "Sponsored content, topic sponsorship, display advertising and event media partnerships with Wire Mesh News — all clearly labelled.", path: "/advertise/" });

export default function AdvertisePage() {
  return <AdvertiseBoard />;
}
