import type { Metadata } from "next";
import { pageMeta } from "@/lib/seo";
import { Shell } from "@/components/shell/Shell";
import { IntelHero } from "@/components/boards/intel/IntelHero";
import { TendersBoard } from "@/components/boards/intel/TendersBoard";
import { AUTH_LIVE } from "@/lib/live";
import "@/styles/board-intel.css";

export const metadata: Metadata = pageMeta({ title: "Tenders & project leads", description: "Public tenders and project leads for fencing, wire mesh, gabions and steel grating worldwide, checked by our editors, with daily email alerts for Pro readers.", path: "/tenders/" });

export default function TendersPage() {
  return (
    <Shell header="compact" board="b-intel">
      <IntelHero here="/tenders/" crumb="Tenders & projects" title="Tenders and project leads" lede="Fencing, mesh, gabion and grating tenders from public procurement portals around the world, found every morning and checked by an editor before they appear." />
      <TendersBoard live={AUTH_LIVE} />
    </Shell>
  );
}
