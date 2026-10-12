import type { Metadata } from "next";
import { AdvertiseBoard } from "@/components/boards/advertise/AdvertiseBoard";

export const metadata: Metadata = { title: "Advertise & Partner", description: "Sponsored content, topic sponsorship, display advertising and event media partnerships with Wire Mesh News — all clearly labelled." };

export default function AdvertisePage() {
  return <AdvertiseBoard />;
}
