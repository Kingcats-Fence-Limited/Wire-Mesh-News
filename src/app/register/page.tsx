import type { Metadata } from "next";
import { AuthBoard } from "@/components/boards/auth/AuthBoard";

export const metadata: Metadata = { title: "Create an account", robots: { index: false } };

export default async function RegisterPage({ searchParams }: { searchParams: Promise<{ claim?: string }> }) {
  return <AuthBoard mode="register" claim={(await searchParams).claim} />;
}
