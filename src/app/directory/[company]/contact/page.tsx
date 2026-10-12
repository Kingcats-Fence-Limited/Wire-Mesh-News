import Link from "next/link";
import { notFound } from "next/navigation";
import { Shell, Crumbs } from "@/components/site/Shell";
import { Card } from "@/components/ui/Primitives";
import { COMPANIES, getCompany } from "@/lib/content/directory";
import { ENQUIRY_SUBJECT, COUNTRY } from "@/data/vocab";
import { FormDemo } from "@/components/site/FormDemo";

export function generateStaticParams() {
  return COMPANIES.map((c) => ({ company: c.slug }));
}
export const metadata = { title: "Contact a company", robots: { index: false } };

export default async function ContactCompany({ params }: { params: Promise<{ company: string }> }) {
  const c = getCompany((await params).company);
  if (!c) notFound();
  return (
    <Shell>
      <div className="wrap max-w-[900px] pt-7">
        <Crumbs items={[{ label: "Directory", href: "/directory/" }, { label: c.name, href: `/directory/${c.slug}/` }, { label: "Contact" }]} />
        <h1 className="font-display mt-4 text-[34px] tracking-[-0.045em]">Contact {c.name}<span className="text-red">.</span></h1>
        <p className="mt-2 text-[15px] font-medium leading-[1.6] text-slate">One message, one recipient. Your enquiry goes only to this company’s verified inbox — it is not a marketplace post, is never shared with other suppliers, and is not used for advertising.</p>
        <div className="mt-6 grid gap-8 md:grid-cols-[1fr_280px]">
          <FormDemo
            submitLabel="Send message"
            successText={`Sent to ${c.name}. They reply to you directly; we only keep a record that a message was sent.`}
            fields={[
              { id: "name", label: "Your name", required: true },
              { id: "email", label: "Work email", type: "email", required: true },
              { id: "company", label: "Your company", required: true },
              { id: "country", label: "Country", type: "select", required: true, options: COUNTRY.map((k) => [k.alpha2, k.name] as [string, string]) },
              { id: "subject", label: "Subject", type: "select", required: true, options: ENQUIRY_SUBJECT.map((s) => [s.code, s.label] as [string, string]) },
              { id: "message", label: "Message", type: "textarea", required: true, hint: "Product, quantity, specification and destination help the company answer in one reply." },
            ]}
            consent="I understand this message is sent to the company named above and that my contact details will be visible to them."
          />
          <aside className="flex flex-col gap-4">
            <Card tone="paper">
              <div className="font-display text-[14px]">Before you send</div>
              <ul className="mt-2 flex list-disc flex-col gap-1.5 pl-4 text-[12.5px] font-medium leading-[1.6] text-fg-3">
                <li>Sign in is required; new accounts verify their email first.</li>
                <li>Rate-limited: a few messages per day per account.</li>
                <li>The company sees your message in its directory inbox and by email.</li>
                <li>Wire Mesh News does not broker, quote or take commission.</li>
              </ul>
            </Card>
            <Link href={`/directory/${c.slug}/`} className="text-[12px] font-extrabold tracking-[0.06em] text-red-text">← BACK TO PROFILE</Link>
          </aside>
        </div>
      </div>
    </Shell>
  );
}
