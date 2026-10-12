import Link from "next/link";
import { Shell } from "@/components/site/Shell";
import { ArticleRow } from "@/components/site/ArticleCards";
import { latest } from "@/lib/content/articles";
import { EDITORIAL_SECTIONS, SITE } from "@/lib/site";

export const metadata = { title: "Page not found", robots: { index: false } };

export default function NotFound() {
  return (
    <Shell>
      <div className="wrap grid gap-10 py-12 lg:grid-cols-[1fr_1fr]">
        <div>
          <div className="num font-display text-[96px] leading-none tracking-[-0.06em] text-red">404</div>
          <h1 className="font-display mt-2 text-[32px] tracking-[-0.045em]">This wire is broken</h1>
          <p className="mt-3 max-w-[520px] text-[15.5px] font-medium leading-[1.6] text-slate">We can’t find that page. It may have moved, changed address, or never existed.</p>
          <div className="mt-5 flex flex-wrap gap-2.5">
            <Link href="/search/" className="inline-flex min-h-[44px] items-center rounded-full bg-ink px-5 text-[14px] font-extrabold text-white dark:bg-white dark:text-ink">Search</Link>
            <Link href="/" className="inline-flex min-h-[44px] items-center rounded-full border-[1.5px] border-ink px-5 text-[14px] font-extrabold dark:border-white">Home</Link>
            <Link href="/news/" className="inline-flex min-h-[44px] items-center rounded-full border border-line px-5 text-[14px] font-extrabold">Latest articles</Link>
          </div>
          <p className="meta mt-5">Sure something should be here? Send the address to <a href={`mailto:${SITE.email}`} className="font-extrabold text-red-text">{SITE.email}</a> and we’ll look.</p>
          <div className="mt-6 flex flex-wrap gap-2">{EDITORIAL_SECTIONS.map((s) => <Link key={s.code} href={`/${s.slug}/`} className="inline-flex min-h-[36px] items-center rounded-full border border-line px-4 text-[13px] font-bold hover:border-ink">{s.label}</Link>)}</div>
        </div>
        <div>
          <div className="font-display text-[13px] tracking-[0.1em]">PERHAPS YOU WERE LOOKING FOR</div>
          {latest(3).map((a) => <ArticleRow key={a.slug} a={a} />)}
        </div>
      </div>
    </Shell>
  );
}
