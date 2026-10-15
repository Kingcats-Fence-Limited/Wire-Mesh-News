import type { Metadata } from "next";
import { flat } from "@/lib/params";
import { pageMeta } from "@/lib/seo";
import { LettersBoard, type LetParams } from "@/components/boards/letters/LettersBoard";

export const metadata: Metadata = pageMeta({ title: "Letters & Opinion", description: "Short, signed letters from people who specify, buy, test and make wire mesh — and occasional columns from outside the newsroom.", path: "/letters/" });

export default async function LettersPage({ searchParams }: { searchParams: Promise<LetParams> }) {
  return <LettersBoard sp={flat<Awaited<typeof searchParams>>(await searchParams as Record<string, string | string[] | undefined>)} />;
}
