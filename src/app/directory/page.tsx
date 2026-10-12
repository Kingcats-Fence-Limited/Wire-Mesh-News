import Link from "next/link";
import type { Metadata } from "next";
import { Shell, Crumbs } from "@/components/site/Shell";
import { Badge, ChipLink, Card } from "@/components/ui/Primitives";
import { MeshBg } from "@/components/ui/Mesh";
import { AdSlot } from "@/components/ui/AdSlot";
import { COMPANIES } from "@/lib/content/directory";
import { CATEGORY, ORGANISATION_TYPE, REGION, COUNTRY_BY_CODE, PRODUCT_BY_CODE } from "@/data/vocab";
import { fmtDate } from "@/lib/site";
import { clsx } from "clsx";

export const metadata: Metadata = { title: "Company Directory", description: "Manufacturers, fabricators, distributors, machinery makers and test labs in wire mesh, classified by editors. Listing and order are never paid for." };

const regionOf = (alpha2: string) => COUNTRY_BY_CODE[alpha2]?.region;

export default async function DirectoryPage({ searchParams }: { searchParams: Promise<{ category?: string; type?: string; region?: string; claimed?: string; sort?: string }> }) {
  const sp = await searchParams;
  let list = COMPANIES.filter((c) => (!sp.category || c.categories.includes(sp.category)) && (!sp.type || c.orgType === sp.type) && (!sp.region || regionOf(c.country) === sp.region) && (sp.claimed !== "1" || c.claimed));
  list = [...list].sort((a, b) => (sp.sort === "name" ? a.name.localeCompare(b.name) : a.updated < b.updated ? 1 : -1));
  const q = (patch: Record<string, string | undefined>) => {
    const p = new URLSearchParams();
    const merged = { ...sp, ...patch };
    for (const [k, v] of Object.entries(merged)) if (v) p.set(k, v);
    const s = p.toString();
    return `/directory/${s ? `?${s}` : ""}`;
  };
  const active = [sp.category && CATEGORY.find((c) => c.code === sp.category)?.labelEn, sp.type && ORGANISATION_TYPE.find((t) => t.code === sp.type)?.labelEn, sp.region && REGION.find((r) => r.code === sp.region)?.labelEn, sp.claimed === "1" && "Claimed only"].filter(Boolean) as string[];

  return (
    <Shell>
      {/* Dark head */}
      <div className="relative overflow-hidden bg-dark text-white">
        <MeshBg id="weld" color="#FFFFFF" opacity={0.08} className="!left-auto !w-[560px]" />
        <div className="wrap relative pt-7 pb-8">
          <div className="text-grey-3 [&_b]:text-white"><Crumbs items={[{ label: "Directory" }]} /></div>
          <div className="mt-4 grid gap-6 lg:grid-cols-[1fr_auto] lg:items-end">
            <div className="max-w-[720px]">
              <h1 className="font-display text-[40px] tracking-[-0.045em]">Company Directory<span className="text-red">.</span></h1>
              <p className="mt-3 text-[15.5px] font-medium leading-[1.6] text-on-dark-2">Who makes, finishes, sells, tests and equips the wire mesh industry — classified by editors from public information and claimed profiles. Listing is free; order is never paid for.</p>
            </div>
            <div className="num flex gap-6 text-[12px] font-extrabold tracking-[0.08em] text-grey-3">
              <span><b className="font-display block text-[26px] tracking-[-0.02em] text-white">{COMPANIES.length}</b>COMPANIES</span>
              <span><b className="font-display block text-[26px] tracking-[-0.02em] text-white">{COMPANIES.filter((c) => c.claimed).length}</b>CLAIMED</span>
              <span><b className="font-display block text-[26px] tracking-[-0.02em] text-white">{new Set(COMPANIES.map((c) => c.country)).size}</b>COUNTRIES</span>
            </div>
          </div>
          {/* Category cards */}
          <div className="no-scrollbar mt-7 flex gap-3 overflow-x-auto pb-1 md:grid md:grid-cols-5">
            {CATEGORY.map((c) => {
              const on = sp.category === c.code;
              return (
                <Link key={c.code} href={q({ category: on ? undefined : c.code })} className={clsx("flex min-w-[200px] flex-col gap-1 rounded-card border p-4 transition-colors", on ? "border-red bg-red/10" : "border-line-dark bg-white/[.03] hover:border-grey-5")}>
                  <span className="font-display text-[16px]">{c.labelEn}</span>
                  <span className="num text-[11px] font-bold text-grey-3">{COMPANIES.filter((x) => x.categories.includes(c.code)).length} companies</span>
                </Link>
              );
            })}
          </div>
        </div>
      </div>

      {/* Black control bar */}
      <div className="border-b-[3px] border-ink bg-ink text-white dark:border-line-2">
        <div className="wrap flex flex-wrap items-center gap-2 py-3">
          <span className="kicker mr-1 text-[10px] text-grey-3">Type</span>
          <ChipLink href={q({ type: undefined })} active={!sp.type} size="sm" className={clsx(!sp.type ? "" : "!border-line-dark !bg-transparent !text-white hover:!border-white")}>All</ChipLink>
          {ORGANISATION_TYPE.map((t) => (
            <ChipLink key={t.code} href={q({ type: sp.type === t.code ? undefined : t.code })} active={sp.type === t.code} size="sm" className={clsx(sp.type === t.code ? "" : "!border-line-dark !bg-transparent !text-white hover:!border-white")}>{t.labelEn}</ChipLink>
          ))}
          <span className="mx-2 h-5 w-px bg-line-dark" />
          <span className="kicker mr-1 text-[10px] text-grey-3">Region</span>
          <details className="relative">
            <summary className="inline-flex min-h-[34px] cursor-pointer list-none items-center gap-2 rounded-full border border-line-dark px-3.5 text-[12.5px] font-bold">{sp.region ? REGION.find((r) => r.code === sp.region)?.labelEn : "Any region"} <span aria-hidden="true">⌄</span></summary>
            <div className="absolute left-0 top-full z-20 mt-2 flex w-56 flex-col rounded-card border border-line bg-bg p-2 text-fg shadow-xl">
              <Link href={q({ region: undefined })} className="rounded-lg px-3 py-2 text-[13px] font-bold hover:bg-paper">Any region</Link>
              {REGION.map((r) => <Link key={r.code} href={q({ region: r.code })} className="rounded-lg px-3 py-2 text-[13px] font-bold hover:bg-paper">{r.labelEn}</Link>)}
            </div>
          </details>
          <Link href={q({ claimed: sp.claimed === "1" ? undefined : "1" })} className={clsx("inline-flex min-h-[34px] items-center gap-2 rounded-full border px-3.5 text-[12.5px] font-bold", sp.claimed === "1" ? "border-white bg-white text-ink" : "border-line-dark text-white hover:border-white")}>Claimed only</Link>
          <span className="ml-auto flex items-center gap-2 text-[11px] font-extrabold tracking-[0.08em] text-grey-3">SORT
            <Link href={q({ sort: undefined })} className={clsx("rounded-full px-2.5 py-1", !sp.sort && "bg-white text-ink")}>Updated</Link>
            <Link href={q({ sort: "name" })} className={clsx("rounded-full px-2.5 py-1", sp.sort === "name" && "bg-white text-ink")}>A–Z</Link>
          </span>
        </div>
      </div>

      <div className="wrap grid gap-10 pt-6 lg:grid-cols-[minmax(0,1fr)_300px]">
        <div>
          <div className="flex flex-wrap items-center gap-2 border-b border-line pb-3">
            <span className="num text-[13.5px] font-bold text-slate"><b className="text-fg">{list.length}</b> companies</span>
            {active.map((a) => <Badge key={a} tone="neutral">{a}</Badge>)}
            {active.length > 0 && <Link href="/directory/" className="ml-2 text-[11.5px] font-extrabold tracking-[0.06em] text-red-text">CLEAR FILTERS</Link>}
            <span className="meta ml-auto text-[11.5px]">Natural listings · order is editorial, never paid</span>
          </div>
          <div className="mt-4 grid gap-4 md:grid-cols-2">
            {list.map((c) => (
              <Link key={c.slug} href={`/directory/${c.slug}/`} className="group flex flex-col rounded-card border border-line transition-colors hover:border-ink">
                <span className="relative h-2 overflow-hidden rounded-t-card bg-dark"><MeshBg id={c.categories[0] === "filtration" ? "woven" : c.categories[0] === "access" ? "grate" : c.categories[0] === "reinforcement" ? "chainL" : "weld"} color="#FFFFFF" opacity={0.3} /></span>
                <span className="flex flex-1 flex-col gap-2.5 p-4">
                  <span className="flex items-start gap-3">
                    <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg border border-line bg-paper text-[12px] font-extrabold text-slate">{c.country}</span>
                    <span className="min-w-0 flex-1">
                      <span className="flex items-center gap-2"><span className="font-display truncate text-[17px] group-hover:text-red-text">{c.name}</span>{c.claimed && <Badge tone="current" size="sm">Claimed</Badge>}</span>
                      <span className="meta block text-[12px]">{ORGANISATION_TYPE.find((t) => t.code === c.orgType)?.labelEn} · {c.city}, {COUNTRY_BY_CODE[c.country]?.name}</span>
                    </span>
                  </span>
                  <span className="line-clamp-2 text-[13px] font-medium leading-[1.55] text-fg-3">{c.summary}</span>
                  <span className="flex flex-wrap gap-1.5">
                    {c.products.slice(0, 3).map((p) => <span key={p} className="rounded-md bg-paper px-2 py-0.5 text-[10.5px] font-bold text-fg-3">{PRODUCT_BY_CODE[p]?.labelEn ?? p.replace(/_/g, " ")}</span>)}
                  </span>
                  <span className="mt-auto flex items-center justify-between border-t border-line-soft pt-2.5 text-[10.5px] font-bold tracking-[0.04em] text-grey">
                    <span>{c.certifications.filter((x) => x.verified).length} verified certification{c.certifications.filter((x) => x.verified).length === 1 ? "" : "s"}</span>
                    <span className="num">UPDATED {fmtDate(c.updated).toUpperCase()}</span>
                  </span>
                </span>
              </Link>
            ))}
          </div>
          {list.length === 0 && <p className="meta py-10 text-center">No companies match these filters. <Link href="/directory/" className="font-extrabold text-red-text">Clear filters</Link></p>}
          <div className="mt-6 flex items-center justify-between gap-4 border-t border-line pt-4 text-[12px]">
            <span className="num font-bold text-slate">SHOWING 1–{list.length} OF {list.length}</span>
            <span className="num flex items-center gap-2 font-bold text-slate">JUMP TO <span className="inline-flex h-8 w-12 items-center justify-center rounded-md border border-line">1</span></span>
          </div>

          {/* Sponsored zone — separate, labelled, not active in phase 1 */}
          <div className="mt-8 rounded-card border border-dashed border-line-2 p-5">
            <div className="flex items-center gap-2"><Badge tone="sponsored">Sponsored listings</Badge><span className="meta text-[11.5px]">Physically separate from natural results · not active yet</span></div>
            <p className="meta mt-2 leading-[1.6]">When enabled, paid placements appear only in this labelled zone. They never change the order of natural listings above and never add a “verified” mark.</p>
          </div>
        </div>

        <aside className="flex flex-col gap-5">
          <Card id="claim" className="scroll-mt-20" tone="dark">
            <div className="font-display text-[18px]">Is your company listed?</div>
            <p className="mt-2 text-[13px] font-medium leading-[1.6] text-grey-3">Claim the profile to keep products, certifications and contact details current. Claims are verified against a company-domain email and reviewed by an editor.</p>
            <ul className="mt-3 flex list-disc flex-col gap-1 pl-4 text-[12.5px] font-medium text-on-dark-2">
              <li>Free, now and later</li>
              <li>Certifications shown only after verification</li>
              <li>Contact details visible to signed-in readers only</li>
            </ul>
            <Link href="/signin/?next=/directory/" className="mt-4 inline-flex min-h-[44px] w-full items-center justify-center rounded-full bg-red text-[13.5px] font-extrabold hover:bg-red-deep">Claim a profile</Link>
          </Card>
          <Card>
            <div className="font-display text-[15px]">How companies are listed</div>
            <ul className="mt-2 flex list-disc flex-col gap-1.5 pl-[17px] text-[12.5px] font-medium leading-[1.6] text-fg-3">
              <li>Classified by editors from public information.</li>
              <li>Self-reported data is labelled; unverifiable capacity or market-share figures are not published.</li>
              <li>Related companies of our publisher are listed on identical terms and marked.</li>
            </ul>
            <Link href="/policies/directory-listing-policy/" className="mt-3 inline-block text-[11.5px] font-extrabold tracking-[0.06em] text-red-text">LISTING POLICY →</Link>
          </Card>
          <AdSlot kind="mpu" />
        </aside>
      </div>
    </Shell>
  );
}
