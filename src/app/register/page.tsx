import type { Metadata } from "next";
import { flat } from "@/lib/params";
import { getCompany } from "@/lib/content/directory";
import { privateMeta } from "@/lib/seo";
import { AuthBoard } from "@/components/boards/auth/AuthBoard";

export const metadata: Metadata = privateMeta("Create an account", "/register/");

export default async function RegisterPage({ searchParams }: { searchParams: Promise<{ claim?: string }> }) {
  const claim = flat<Awaited<typeof searchParams>>(await searchParams as Record<string, string | string[] | undefined>).claim;
  /* Only a real directory slug can be carried through sign-up. */
  return <AuthBoard mode="register" claim={claim && getCompany(claim) ? claim : undefined} />;
}
