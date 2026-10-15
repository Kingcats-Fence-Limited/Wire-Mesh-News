import type { Metadata } from "next";
import { Suspense } from "react";
import { privateMeta } from "@/lib/seo";
import { Shell } from "@/components/shell/Shell";
import { AuthBoard, AuthFromUrl } from "@/components/boards/auth/AuthBoard";

export const metadata: Metadata = privateMeta("Sign in", "/signin/");

export default function SignInPage() {
  return (
    <Shell header="compact" board="b-login">
      <Suspense fallback={<AuthBoard mode="signin" />}>
        <AuthFromUrl page="signin" />
      </Suspense>
    </Shell>
  );
}
