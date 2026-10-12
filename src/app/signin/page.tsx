import type { Metadata } from "next";
import { AuthBoard } from "@/components/boards/auth/AuthBoard";

export const metadata: Metadata = { title: "Sign in", robots: { index: false } };

export default async function SignInPage({ searchParams }: { searchParams: Promise<{ mode?: string; next?: string }> }) {
  const sp = await searchParams;
  return <AuthBoard mode={sp.mode === "reset" ? "reset" : "signin"} next={sp.next} />;
}
