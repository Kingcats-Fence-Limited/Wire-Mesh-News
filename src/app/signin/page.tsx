import type { Metadata } from "next";
import { flat } from "@/lib/params";
import { privateMeta } from "@/lib/seo";
import { AuthBoard } from "@/components/boards/auth/AuthBoard";

export const metadata: Metadata = privateMeta("Sign in", "/signin/");

export default async function SignInPage({ searchParams }: { searchParams: Promise<{ mode?: string; next?: string }> }) {
  const sp = flat<Awaited<typeof searchParams>>(await searchParams as Record<string, string | string[] | undefined>);
  return <AuthBoard mode={sp.mode === "reset" ? "reset" : "signin"} next={sp.next} />;
}
