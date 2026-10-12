import Link from "next/link";
import type { Metadata } from "next";
import { Shell, Crumbs } from "@/components/site/Shell";
import { Card } from "@/components/ui/Primitives";
import { FormDemo } from "@/components/site/FormDemo";
import { CONTACT_SUBJECT } from "@/data/vocab";
import { SITE } from "@/lib/site";

export const metadata: Metadata = { title: "Contact", description: "Editorial tips, corrections, submissions, advertising and account questions — routed to the right person." };

const ROUTES = [
  ["Editorial tips and news leads", "Something worth reporting, data or documents, or a fact we got wrong.", SITE.email, `mailto:${SITE.email}`],
  ["Corrections", "Found an error? Send a verifiable source; we correct and note the change.", "Report a correction →", "/policies/corrections/"],
  ["Submissions", "Use the submission flow rather than emailing a full draft.", "Submit an article →", "/submit/"],
  ["Advertising & partnerships", "Sponsored content, display advertising, event partnerships.", "Advertise & Partner →", "/advertise/"],
  ["Account & privacy", "Sign-in problems, closing an account, data access or deletion requests.", SITE.email, `mailto:${SITE.email}`],
];

export default async function ContactPage({ searchParams }: { searchParams: Promise<{ subject?: string }> }) {
  const { subject } = await searchParams;
  return (
    <Shell>
      <div className="wrap pt-7">
        <Crumbs items={[{ label: "Contact" }]} />
        <div className="mt-4 grid gap-11 lg:grid-cols-[1.05fr_1fr]">
          <div>
            <h1 className="font-display text-[40px] tracking-[-0.045em]">Contact<span className="text-red">.</span></h1>
            <p className="mt-2 text-[15.5px] font-medium leading-[1.6] text-slate">Pick the reason first and it reaches the right person. We reply on working days, normally within five.</p>
            <div className="mt-5 divide-y divide-line border-y border-line">
              {ROUTES.map(([t, d, l, h]) => <div key={t} className="flex gap-3.5 py-4"><span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-paper text-red"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.1" strokeLinejoin="round" aria-hidden="true"><path d="M4 19.5V5a1.5 1.5 0 0 1 1.5-1.5H16L20 7.5V19.5a1.5 1.5 0 0 1-1.5 1.5h-13A1.5 1.5 0 0 1 4 19.5z" /><path d="M8 9h6M8 13h8M8 17h5" /></svg></span><div><b className="block text-[15px]">{t}</b><span className="meta block leading-[1.55]">{d}</span>{h.startsWith("mailto") ? <a href={h} className="mt-0.5 inline-block text-[13px] font-extrabold text-red-text">{l}</a> : <Link href={h} className="mt-0.5 inline-block text-[13px] font-extrabold text-red-text">{l}</Link>}</div></div>)}
            </div>
            <Card tone="dark" className="mt-6">
              <div className="kicker text-[10px] text-grey-5">Publication details</div>
              <dl className="mt-3 flex flex-col gap-2 text-[14px] font-medium">
                {[["Publication", SITE.name], ["Operated by", "see About"], ["Region", SITE.operator.region], ["Email", SITE.email]].map(([k, v]) => <div key={k} className="flex justify-between gap-4"><dt className="text-grey-3">{k}</dt><dd className="m-0 font-extrabold">{k === "Operated by" ? <Link href="/about/#ownership" className="underline">{v}</Link> : v}</dd></div>)}
              </dl>
              <p className="mt-3 text-[12px] font-medium leading-[1.6] text-grey-5">The operating entity, ownership and data controller are stated on <Link href="/about/" className="underline text-grey-3">About</Link>, <Link href="/policies/privacy/" className="underline text-grey-3">Privacy</Link> and <Link href="/policies/terms/" className="underline text-grey-3">Terms</Link>; the footer does not repeat them.</p>
            </Card>
          </div>
          <div className="rounded-card-lg border border-line p-6">
            <div className="font-display text-[22px]">Send a message</div>
            <p className="meta mt-1 mb-4">Not sure who to write to? Use this form.</p>
            <FormDemo
              submitLabel="Send message"
              successText="Thanks — your message is logged and routed. We reply by email on working days."
              consent="I have read the Privacy Policy and agree to my contact details being used to answer this message."
              note="You will see a confirmation, an error or a duplicate notice after sending. The form is rate-limited; failed notifications are logged and retried."
              fields={[
                { id: "name", label: "Name", required: true },
                { id: "email", label: "Email", type: "email", required: true, placeholder: "you@company.com" },
                { id: "company", label: "Company" },
                { id: "reason", label: "Reason", type: "select", required: true, options: CONTACT_SUBJECT.map((s) => [s.code, s.label] as [string, string]) },
                { id: "message", label: "Message", type: "textarea", required: true },
              ]}
            />
            {subject && <p className="meta mt-3 text-[11.5px]">Pre-selected reason: {CONTACT_SUBJECT.find((s) => s.code === subject)?.label ?? subject}</p>}
          </div>
        </div>
      </div>
    </Shell>
  );
}
