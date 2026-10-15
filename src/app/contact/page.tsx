import type { Metadata } from "next";
import { Suspense } from "react";
import { pageMeta } from "@/lib/seo";
import { Shell } from "@/components/shell/Shell";
import { ContactBoard, ContactFromUrl } from "@/components/boards/contact/ContactBoard";

export const metadata: Metadata = pageMeta({ title: "Contact", description: "Editorial tips, corrections, submissions, advertising and account questions — routed to the right person.", path: "/contact/" });

export default function ContactPage() {
  return (
    <Shell header="compact" board="b-contact">
      <Suspense fallback={<ContactBoard />}>
        <ContactFromUrl />
      </Suspense>
    </Shell>
  );
}
