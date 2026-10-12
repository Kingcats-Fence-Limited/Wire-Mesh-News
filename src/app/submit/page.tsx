import Link from "next/link";
import type { Metadata } from "next";
import { Shell, PageHead } from "@/components/site/Shell";
import { Card, Badge } from "@/components/ui/Primitives";

export const metadata: Metadata = { title: "Submit an Article", description: "Technical articles, case studies, market analysis and letters from people who work in the industry." };

const STATES = [["draft", "Draft", "Only you can see it"], ["pending", "Pending review", "An editor has it"], ["changes", "Changes requested", "Notes are on the draft"], ["rejected", "Rejected", "With a reason"], ["published", "Published", "Live, with your byline"]];

export default function SubmitPage() {
  return (
    <Shell>
      <PageHead crumbs={[{ label: "Submit an Article" }]} title="Submit an Article" intro="We publish technical articles, case studies, market analysis and letters from people who work in the industry. We do not publish press releases, product promotion or SEO articles." aside={<Link href="/signin/?next=/submit/" className="inline-flex min-h-[48px] items-center rounded-full bg-ink px-6 text-[14.5px] font-extrabold text-white hover:bg-red dark:bg-white dark:text-ink">Sign in to start a draft</Link>} />
      <div className="wrap grid gap-10 pt-8 lg:grid-cols-[minmax(0,1fr)_320px]">
        <div>
          <h2 className="font-display text-[22px]">What we look for</h2>
          <ul className="mt-3 flex list-disc flex-col gap-2 pl-5 text-[15px] font-medium leading-[1.65] text-fg-2 marker:text-red">
            <li>A specific problem and a specific answer.</li><li>Real numbers with sources.</li><li>Experience from a site, a plant or a laboratory.</li><li>Clear statements of what the reader should do differently.</li><li>800–2,000 words for articles; 200–400 for letters.</li>
          </ul>
          <h2 className="font-display mt-8 text-[22px]">How the process works</h2>
          <p className="mt-2 text-[15px] font-medium leading-[1.65] text-fg-2">Submit through your account. Drafts go to an editor; you will see one of five states and receive an email on each change. Accepted articles are edited for clarity and house style and sent back to you before publication.</p>
          <div className="mt-4 grid gap-3 sm:grid-cols-5">{STATES.map(([k, l, d]) => <div key={k} className="rounded-card border border-line p-3"><Badge tone={k === "published" ? "current" : k === "rejected" ? "draft" : k === "changes" ? "review" : "neutral"} size="sm">{l}</Badge><div className="meta mt-2 text-[11.5px] leading-[1.5]">{d}</div></div>)}</div>
          <h2 className="font-display mt-8 text-[22px]">Disclosure and rights</h2>
          <p className="mt-2 text-[15px] font-medium leading-[1.65] text-fg-2">State your employer and any commercial interest in the subject; undisclosed interests found after publication lead to removal of the article and the account. You keep copyright and grant Wire Mesh News a non-exclusive, perpetual licence to publish, edit, translate and distribute the piece. We do not pay for submissions.</p>
          <Link href="/policies/submission-guidelines/" className="mt-4 inline-block text-[12.5px] font-extrabold tracking-[0.06em] text-red-text">FULL SUBMISSION GUIDELINES →</Link>
        </div>
        <aside className="flex flex-col gap-5">
          <Card tone="dark"><div className="font-display text-[16px]">The submission editor</div><p className="mt-1 text-[12.5px] font-medium leading-[1.6] text-grey-3">Writing, images with rights declaration, sources, disclosure and a preview — all inside your account. Opens in the next release; sign in now to be notified.</p><Badge tone="review" size="sm" className="mt-3">Phase 3</Badge></Card>
          <Card><div className="font-display text-[15px]">Prefer to write a letter?</div><p className="meta mt-1 leading-[1.55]">200–400 words on something we published. Same verification, faster turnaround.</p><Link href="/letters/#write" className="mt-2 inline-block text-[11.5px] font-extrabold tracking-[0.06em] text-red-text">WRITE TO THE EDITOR →</Link></Card>
        </aside>
      </div>
    </Shell>
  );
}
