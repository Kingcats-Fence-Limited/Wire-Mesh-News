import Link from "next/link";
import type { Metadata } from "next";
import { Shell } from "@/components/site/Shell";
import { AuthCard } from "@/components/site/AuthCard";
import { FormDemo } from "@/components/site/FormDemo";

export const metadata: Metadata = { title: "Sign in", robots: { index: false } };

export default function SignInPage() {
  return (
    <Shell>
      <AuthCard title="Sign in" intro="Comments, letters, saved companies, contact details in the Directory and standard alerts all need an account." footer={<>No account? <Link href="/register/" className="font-extrabold text-red-text">Register free</Link> · <Link href="/register/?reset=1" className="font-extrabold">Forgot password</Link><br />Accounts open in the next release; this screen shows the final flow.</>}>
        <FormDemo submitLabel="Sign in" successText="Signed in (demo). Account features arrive in Phase 3." fields={[{ id: "email", label: "Email", type: "email", required: true }, { id: "password", label: "Password", required: true }]} />
      </AuthCard>
    </Shell>
  );
}
