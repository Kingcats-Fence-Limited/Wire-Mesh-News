import type { Metadata } from "next";
import { pageMeta } from "@/lib/seo";
import { DirectoryBoard, type DirParams } from "@/components/boards/directory/DirectoryBoard";

export const metadata: Metadata = pageMeta({ title: "Company Directory", description: "Manufacturers, fabricators, distributors, machinery makers and test labs in wire mesh, classified by editors. Listing and order are never paid for.", path: "/directory/" });

export default async function DirectoryPage({ searchParams }: { searchParams: Promise<DirParams> }) {
  const sp = await searchParams;
  return <DirectoryBoard sp={sp} />;
}
