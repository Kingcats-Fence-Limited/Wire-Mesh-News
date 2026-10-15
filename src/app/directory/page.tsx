import type { Metadata } from "next";
import { flat } from "@/lib/params";
import { pageMeta } from "@/lib/seo";
import { DirectoryBoard, type DirParams } from "@/components/boards/directory/DirectoryBoard";

export const metadata: Metadata = pageMeta({ title: "Company Directory", description: "Manufacturers, fabricators, distributors, machinery makers and test labs in wire mesh, classified by editors. Listing and order are never paid for.", path: "/directory/" });

export default async function DirectoryPage({ searchParams }: { searchParams: Promise<DirParams> }) {
  const sp = flat<Awaited<typeof searchParams>>(await searchParams as Record<string, string | string[] | undefined>);
  return <DirectoryBoard sp={sp} />;
}
