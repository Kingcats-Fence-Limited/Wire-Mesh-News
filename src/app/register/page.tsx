import type { Metadata } from "next";
import { privateMeta } from "@/lib/seo";
import { AuthBoard } from "@/components/boards/auth/AuthBoard";

export const metadata: Metadata = privateMeta("Create an account", "/register/");

export default async function RegisterPage({ searchParams }: { searchParams: Promise<{ claim?: string }> }) {
  return <AuthBoard mode="register" claim={(await searchParams).claim} />;
}
