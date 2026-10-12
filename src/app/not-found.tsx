import type { Metadata } from "next";
import { NotFoundBoard } from "@/components/boards/error/ErrorBoard";

export const metadata: Metadata = { title: "Page not found", robots: { index: false } };

export default function NotFound() {
  return <NotFoundBoard />;
}
