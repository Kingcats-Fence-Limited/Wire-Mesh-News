import type { Metadata } from "next";
import { DirectoryBoard, type DirParams } from "@/components/boards/directory/DirectoryBoard";

export const metadata: Metadata = { title: "Company Directory", description: "Manufacturers, fabricators, distributors, machinery makers and test labs in wire mesh, classified by editors. Listing and order are never paid for." };

export default async function DirectoryPage({ searchParams }: { searchParams: Promise<DirParams> }) {
  const sp = await searchParams;
  return <DirectoryBoard sp={sp} />;
}
