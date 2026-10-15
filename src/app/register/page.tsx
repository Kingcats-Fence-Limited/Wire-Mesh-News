import type { Metadata } from "next";
import { Suspense } from "react";
import { privateMeta } from "@/lib/seo";
import { Shell } from "@/components/shell/Shell";
import { COMPANIES } from "@/lib/content/directory";
import { AuthBoard, AuthFromUrl } from "@/components/boards/auth/AuthBoard";

export const metadata: Metadata = privateMeta("Create an account", "/register/");

export default function RegisterPage() {
  return (
    <Shell header="compact" board="b-login">
      <Suspense fallback={<AuthBoard mode="register" />}>
        <AuthFromUrl page="register" companySlugs={COMPANIES.map((c) => c.slug)} />
      </Suspense>
    </Shell>
  );
}
