import type { Metadata } from "next";
import { SubmitBoard } from "@/components/boards/submit/SubmitBoard";

export const metadata: Metadata = { title: "Submit an article", description: "Submit news, technical guides and case studies to Wire Mesh News. Every submission is reviewed by editors before publication." };

export default function SubmitPage() {
  return <SubmitBoard />;
}
