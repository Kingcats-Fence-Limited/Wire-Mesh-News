import type { Metadata } from "next";
import { LettersBoard, type LetParams } from "@/components/boards/letters/LettersBoard";

export const metadata: Metadata = { title: "Letters & Opinion", description: "Short, signed letters from people who specify, buy, test and make wire mesh — and occasional columns from outside the newsroom." };

export default async function LettersPage({ searchParams }: { searchParams: Promise<LetParams> }) {
  return <LettersBoard sp={await searchParams} />;
}
