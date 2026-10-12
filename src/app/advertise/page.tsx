import Link from "next/link";
import type { Metadata } from "next";
import { Shell, Crumbs } from "@/components/site/Shell";
import { Badge, Card } from "@/components/ui/Primitives";
import { FormDemo } from "@/components/site/FormDemo";
import { SITE } from "@/lib/site";

export const metadata: Metadata = { title: "Advertise & Partner", description: "Sponsored content, topic sponsorship, display advertising and event media partnerships — all clearly labelled, all priced by conversation." };

const OFFERS = [
  ["Sponsored content", "Content production and sponsored publication", "Company interviews, product introductions, technical and project case studies, produced with editorial help. Labelled Sponsored Content on lists and on the page.", false],
  ["Topic sponsorship", "Sponsor an existing topic", "A labelled sponsor placement on a content topic. Editorial content inside the topic is not counted as sponsored and is not chosen by the sponsor.", false],
  ["Advertisement", "Display advertising", "A small number of positions on the home, section and article pages, each labelled Advertisement. Unsold, unscheduled or expired slots collapse rather than show a placeholder.", false],
  ["Event partnership", "Event media partnership", "Event introduction, on-site reporting and company interviews. Deliverables are written down before a quote.", false],
  ["Paid reports", "Later phase", "Enquiries only. Original research will be sold once it exists; nothing is pre-sold.", true],
  ["Newsletter advertising", "Later phase", "Opens once the weekly brief has a verifiable, stable subscriber base.", true],
];
const STEPS = ["Enquiry", "Conversation", "Quote", "Schedule", "Production", "Editorial review", "Live", "Record"];

export default function AdvertisePage() {
  return (
    <Shell>
      <div className="wrap pt-7">
        <Crumbs items={[{ label: "Advertise & Partner" }]} />
        <div className="mt-4 grid gap-8 border-b border-line pb-8 lg:grid-cols-[1fr_auto] lg:items-end">
          <div className="max-w-[760px]">
            <h1 className="font-display text-[40px] tracking-[-0.045em]">Reach the people who specify and buy wire mesh<span className="text-red">.</span></h1>
            <p className="mt-3 text-[15.5px] font-medium leading-[1.6] text-slate">Wire Mesh News is read by international buyers, engineers, contractors and distributors. Partnerships take four forms — sponsored content, topic sponsorship, display advertising and event media partnerships — and every one of them is labelled.</p>
          </div>
          <a href="#enquiry" className="inline-flex min-h-[48px] items-center rounded-full bg-ink px-6 text-[14.5px] font-extrabold text-white hover:bg-red dark:bg-white dark:text-ink">Start an enquiry</a>
        </div>
        <p className="mt-4 rounded-r-card border-l-4 border-ink bg-paper px-4 py-3 text-[13.5px] font-medium leading-[1.6] text-fg-3 dark:border-line-2">This is a newly launched publication. We do not publish traffic or reach figures yet; audience data will appear here once it is stable and verifiable, and campaign results are reported with verifiable numbers only.</p>

        <h2 className="font-display mt-10 text-[26px]">What we offer</h2>
        <p className="meta mt-1">Four partnership types in this first phase, priced by conversation and quoted individually.</p>
        <div className="mt-4 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {OFFERS.map(([tag, t, d, later]) => <Card key={t as string} className={later ? "opacity-70" : ""}><Badge tone={later ? "withdrawn" : "sponsored"}>{tag as string}</Badge><div className="font-display mt-2.5 text-[17px]">{t as string}</div><p className="meta mt-1.5 leading-[1.6]">{d as string}</p></Card>)}
        </div>

        <h2 className="font-display mt-10 text-[26px]">How a partnership runs</h2>
        <p className="meta mt-1">No online payment, self-serve placement or membership packages in this phase.</p>
        <ol className="mt-4 grid gap-3 sm:grid-cols-4">{STEPS.map((s, i) => <li key={s} className="rounded-card border border-line p-4"><span className="num text-[12px] font-extrabold text-red-text">{String(i + 1).padStart(2, "0")}</span><span className="font-display mt-1 block text-[15px]">{s}</span></li>)}</ol>

        <div id="enquiry" className="mt-10 grid scroll-mt-20 gap-10 lg:grid-cols-[1fr_320px]">
          <div className="rounded-card-lg border border-line p-6">
            <div className="font-display text-[22px]">Enquiry form</div>
            <p className="meta mt-1 mb-4">We reply by email. Contact details and attachments are internal and never shown to other users.</p>
            <FormDemo
              submitLabel="Send enquiry"
              successText="Thank you. Your enquiry has an internal record and someone will reply by email."
              consent="I have read the Privacy Policy and agree to my contact details being used to answer this enquiry."
              fields={[
                { id: "company", label: "Company", required: true },
                { id: "contact", label: "Contact name", required: true },
                { id: "email", label: "Email", type: "email", required: true },
                { id: "type", label: "Partnership type", type: "select", required: true, options: [["sponsored", "Sponsored content"], ["topic", "Topic sponsorship"], ["display", "Display advertising"], ["event", "Event partnership"], ["other", "Other"]] },
                { id: "goals", label: "Goals", type: "textarea", required: true },
                { id: "timing", label: "Timing" },
                { id: "budget", label: "Budget range (optional)", type: "select", options: [["discuss", "Prefer to discuss"], ["b1", "Under USD 2,000"], ["b2", "USD 2,000 – 10,000"], ["b3", "Over USD 10,000"]] },
              ]}
            />
          </div>
          <aside className="flex flex-col gap-5">
            <Card><div className="font-display text-[15px]">Editorial boundary</div><ul className="mt-2 flex list-disc flex-col gap-1.5 pl-[17px] text-[12.5px] font-medium leading-[1.6] text-fg-3"><li>Paid content is fact-checked and image rights are verified like anything else.</li><li>Sponsored content is labelled on lists and pages; ad links carry rel=&quot;sponsored&quot;.</li><li>A partnership buys no right to publication; ordinary submissions are judged on merit.</li><li>No promises of rankings, listing, enquiries or orders.</li><li>Directory listing and order are never for sale.</li></ul></Card>
            <Card tone="paper"><div className="kicker text-[10px]">Contact</div><a href={`mailto:${SITE.email}`} className="mt-1 block text-[14px] font-extrabold hover:text-red-text">{SITE.email}</a><p className="meta mt-2 text-[11.5px] leading-[1.55]">Ownership is disclosed on <Link href="/about/#ownership" className="font-extrabold text-red-text">About</Link>; content from the operator and related companies is reviewed on the same terms as anyone else’s and marked.</p></Card>
            <Card><div className="font-display text-[14px]">Looking to contribute instead?</div><p className="meta mt-1">Editorial submissions are free and judged on merit.</p><Link href="/submit/" className="mt-2 inline-block text-[11.5px] font-extrabold tracking-[0.06em] text-red-text">SUBMIT AN ARTICLE →</Link></Card>
          </aside>
        </div>
      </div>
    </Shell>
  );
}
