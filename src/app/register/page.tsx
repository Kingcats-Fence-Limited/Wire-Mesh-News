import Link from "next/link";
import type { Metadata } from "next";
import { Shell } from "@/components/site/Shell";
import { AuthCard } from "@/components/site/AuthCard";
import { FormDemo } from "@/components/site/FormDemo";
import { Badge } from "@/components/ui/Primitives";

export const metadata: Metadata = { title: "Register", robots: { index: false } };

export default function RegisterPage() {
  return (
    <Shell>
      <AuthCard title="Create a free account" intro="A real, working email address is required: four checks run before an account is active." footer={<>Already registered? <Link href="/signin/" className="font-extrabold text-red-text">Sign in</Link></>}>
        <div className="mb-4 flex flex-wrap gap-1.5">{["Format", "Domain MX", "Disposable blocklist", "Confirmation link"].map((s, i) => <Badge key={s} tone="neutral" size="sm">{i + 1} · {s}</Badge>)}</div>
        <FormDemo submitLabel="Create account" successText="Check your inbox for the confirmation link. Until you click it the account can read but not post." consent="I agree to the Terms of Use and have read the Privacy Policy." fields={[{ id: "name", label: "Name", required: true }, { id: "email", label: "Work or personal email", type: "email", required: true, hint: "Disposable addresses are rejected." }, { id: "password", label: "Password", required: true }]} />
      </AuthCard>
    </Shell>
  );
}
