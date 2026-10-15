import type { Metadata } from "next";
import { pageMeta } from "@/lib/seo";
import { SubmitBoard } from "@/components/boards/submit/SubmitBoard";

export const metadata: Metadata = pageMeta({ title: "Submit an article", description: "Submit news, technical guides and case studies to Wire Mesh News. Every submission is reviewed by editors before publication.", path: "/submit/", noindex: true });

export default function SubmitPage() {
  return <SubmitBoard />;
}
