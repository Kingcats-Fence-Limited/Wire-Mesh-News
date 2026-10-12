import Link from "next/link";
import type { Metadata } from "next";
import { Shell, Crumbs } from "@/components/site/Shell";
import { Card, Kicker } from "@/components/ui/Primitives";
import { MeshBg } from "@/components/ui/Mesh";
import { AUTHORS } from "@/lib/content/people";
import { SITE } from "@/lib/site";

export const metadata: Metadata = { title: "About", description: "Who publishes Wire Mesh News, who owns it, what it covers and how it works." };

const HOW = [
  ["Real bylines", "Every article carries the name of the person responsible for it. Outside contributions keep the real author or company byline, with sources and dates."],
  ["Sources you can check", "Internal and external links point only to pages that exist and are reachable; they are checked by a person before publication. We prefer sources a reader can open."],
  ["Pictures labelled honestly", "Images carry their source and rights. Real products and sites come first; any generated illustration is marked as such and is never evidence of a real project or test."],
  ["Mistakes get fixed in the open", "Material errors are corrected in the article with a dated note saying what changed and why. Formatting fixes do not refresh the publication date."],
];

export default function AboutPage() {
  return (
    <Shell>
      <div className="wrap pt-7">
        <Crumbs items={[{ label: "About" }]} />
        <div className="mt-4 grid gap-10 lg:grid-cols-[minmax(0,1fr)_300px]">
          <article>
            <h1 className="font-display text-[38px] leading-[1.08] tracking-[-0.045em] md:text-[44px]">Industry media for people who specify, make and buy mesh<span className="text-red">.</span></h1>
            <p className="mt-4 max-w-[720px] text-[16px] font-medium leading-[1.65] text-slate">Wire Mesh News reports on the wire mesh and metal mesh industry — news, markets, technology, applications and buying knowledge — for international buyers, engineers, specifiers, contractors, distributors and the people who make the products.</p>

            <div className="mt-7 grid gap-px overflow-hidden rounded-card border border-line bg-line sm:grid-cols-5">
              {[["Launched", String(SITE.launched)], ["Language", "English only"], ["Region", SITE.operator.region], ["Operated by", SITE.operator.legalName], ["Contact", SITE.email]].map(([k, v]) => <div key={k} className="bg-bg p-4"><div className="kicker text-[10px]">{k}</div><div className="mt-1 text-[13.5px] font-extrabold break-words">{v}</div></div>)}
            </div>

            <section id="ownership" className="mt-10 scroll-mt-20 rounded-card-lg border-2 border-ink p-6 dark:border-line-2">
              <Kicker>Ownership disclosure</Kicker>
              <h2 className="font-display mt-2 text-[26px]">Who runs this site</h2>
              <p className="mt-3 text-[15px] font-medium leading-[1.7] text-fg-2">Wire Mesh News is published and operated by <b>{SITE.operator.legalName}</b>, a manufacturer in the wire mesh and fencing industry. We think readers have a right to know that, so it is written here rather than buried in the terms.</p>
              <p className="mt-3 text-[15px] font-medium leading-[1.7] text-fg-2">That raises an obvious question: can a publication owned by a manufacturer report fairly on its own industry? Our answer is to write the rules down rather than ask for trust:</p>
              <ul className="mt-3 flex list-disc flex-col gap-2 pl-5 text-[15px] font-medium leading-[1.65] text-fg-2 marker:text-red">
                <li>Content involving the operator is published under <b>exactly the same</b> editorial review as any other company’s, with no automatic right to publication.</li>
                <li>Where reporting mentions the operator, the relationship is stated in the text.</li>
                <li>Directory listing and order are <b>never paid for</b>; the operator is listed on the same terms as everyone else.</li>
                <li>Commercial content is always labelled Sponsored Content or Advertisement.</li>
              </ul>
              <p className="mt-3 text-[14px] font-medium text-slate">If you believe any article breaks one of these rules, tell us through <Link href="/policies/corrections/" className="std-link">Corrections</Link>.</p>
            </section>

            <section id="cover" className="mt-10 scroll-mt-20">
              <h2 className="font-display text-[26px]">What we cover</h2>
              <p className="mt-3 text-[15px] font-medium leading-[1.7] text-fg-2">The first phase focuses on four areas — fencing and gates, industrial security, filtration and screening, and engineered mesh for civil works — across five sections: News, Market Insights, Applications, Technical Guides and Buying Guides.</p>
              <p className="mt-3 text-[15px] font-medium leading-[1.7] text-fg-2">Technical content states the conditions it applies under; news records when something happened and when we published it. We do not publish market-size, price-trend, certification or capability claims without evidence. AI tools help with research and organisation, but everything is checked by an editor before publication and nothing is published automatically.</p>
              <div className="mt-4 grid gap-3 sm:grid-cols-3">
                {[["Fencing & gates", "Perimeter fencing, gates, anti-climb mesh", "weld"], ["Industrial & security", "Site security, rated systems, machine guarding", "chain"], ["Filtration & screening", "Woven and sintered media, screens", "woven"]].map(([t, d, m]) => <div key={t} className="relative overflow-hidden rounded-card bg-dark p-4 text-white"><MeshBg id={m as never} color="#FFFFFF" opacity={0.14} /><div className="relative"><div className="font-display text-[16px]">{t}</div><div className="mt-1 text-[12.5px] font-medium text-grey-3">{d}</div></div></div>)}
              </div>
            </section>

            <section id="how" className="mt-10 scroll-mt-20">
              <h2 className="font-display text-[26px]">How we work</h2>
              <div className="mt-4 grid gap-4 sm:grid-cols-2">
                {HOW.map(([t, d], i) => <div key={t} className="rounded-card border border-line p-5"><span className="num text-[12px] font-extrabold text-red-text">{String(i + 1).padStart(2, "0")}</span><div className="font-display mt-1 text-[17px]">{t}</div><p className="meta mt-1.5 leading-[1.6]">{d}</p></div>)}
              </div>
              <Link href="/policies/editorial-policy/" className="mt-4 inline-block text-[12.5px] font-extrabold tracking-[0.06em] text-red-text">FULL EDITORIAL POLICY →</Link>
            </section>

            <section id="who" className="mt-10 scroll-mt-20">
              <h2 className="font-display text-[26px]">Who writes it</h2>
              <div className="mt-4 grid gap-4 sm:grid-cols-2">
                {AUTHORS.map((a) => <Link key={a.slug} href={`/authors/${a.slug}/`} className="group flex gap-4 rounded-card border border-line p-4 hover:border-ink"><span className="h-14 w-14 shrink-0 rounded-full bg-line" aria-hidden="true" /><span><span className="font-display block text-[17px] group-hover:text-red-text">{a.name}</span><span className="kicker block text-[9.5px]">{a.role}</span><span className="meta mt-1 block leading-[1.5]">{a.bio.split(". ")[0]}.</span></span></Link>)}
              </div>
              <p className="meta mt-4">We also publish outside contributions. If you have experience from a plant, a laboratory or a site that is worth writing down, <Link href="/submit/" className="font-extrabold text-red-text">we would like to read it</Link>.</p>
            </section>
          </article>

          <aside className="flex flex-col gap-5 lg:sticky lg:top-6 lg:self-start">
            <Card><div className="kicker mb-2 text-[10px]">On this page</div><ul className="flex flex-col gap-1.5 text-[13.5px] font-bold">{[["#ownership", "Ownership disclosure"], ["#cover", "What we cover"], ["#how", "How we work"], ["#who", "Who writes it"]].map(([h, l]) => <li key={h}><a href={h} className="hover:text-red-text">{l}</a></li>)}</ul></Card>
            <Card><div className="kicker mb-2 text-[10px]">Contact</div><a href={`mailto:${SITE.email}`} className="block text-[14px] font-extrabold hover:text-red-text">{SITE.email}</a><div className="meta mt-1">{SITE.operator.region}</div><Link href="/contact/" className="mt-2 inline-block text-[11.5px] font-extrabold tracking-[0.06em] text-red-text">CONTACT PAGE →</Link></Card>
            <Card><div className="kicker mb-2 text-[10px]">Policies</div><ul className="flex flex-col gap-1.5 text-[13.5px] font-bold">{[["editorial-policy", "Editorial Policy"], ["submission-guidelines", "Submission Guidelines"], ["comment-policy", "Comment Policy"], ["corrections", "Corrections"], ["privacy", "Privacy"], ["terms", "Terms"]].map(([s, l]) => <li key={s}><Link href={`/policies/${s}/`} className="hover:text-red-text">{l}</Link></li>)}</ul></Card>
            <Card tone="dark"><div className="font-display text-[15px]">Work with us</div><p className="mt-1 text-[12.5px] font-medium text-grey-3">Sponsored content, display advertising and event media partnerships — all clearly labelled.</p><Link href="/advertise/" className="mt-3 inline-flex min-h-[40px] items-center rounded-full bg-red px-4 text-[12.5px] font-extrabold">Advertise &amp; Partner</Link></Card>
          </aside>
        </div>
      </div>
    </Shell>
  );
}
