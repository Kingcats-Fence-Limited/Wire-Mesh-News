import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { Shell, Crumbs } from "@/components/site/Shell";
import { Badge, Card, Kicker } from "@/components/ui/Primitives";
import { MeshBg } from "@/components/ui/Mesh";
import { AdSlot } from "@/components/ui/AdSlot";
import { ArticleRow } from "@/components/site/ArticleCards";
import { COMPANIES, getCompany, upcomingEvents } from "@/lib/content/directory";
import { byCompany } from "@/lib/content/articles";
import { STANDARDS } from "@/lib/content/standards";
import { CATEGORY, ORGANISATION_TYPE, COUNTRY_BY_CODE, PRODUCT_BY_CODE, CERTIFICATION_TYPE, REGION, EMPLOYEE_RANGE, SUBDIVISION } from "@/data/vocab";
import { fmtDate, fmtDateShort } from "@/lib/site";

export function generateStaticParams() {
  return COMPANIES.map((c) => ({ company: c.slug }));
}
export async function generateMetadata({ params }: { params: Promise<{ company: string }> }): Promise<Metadata> {
  const c = getCompany((await params).company);
  return c ? { title: `${c.name} · Company Directory`, description: c.summary } : {};
}

function Fact({ k, v, source, tag }: { k: string; v: React.ReactNode; source?: string; tag?: "self" | "editorial" }) {
  return (
    <div className="grid gap-1 border-t border-line py-3 md:grid-cols-[180px_1fr]">
      <dt className="meta">{k}</dt>
      <dd className="m-0">
        <span className="text-[14px] font-bold">{v}</span>
        <span className="meta mt-0.5 block text-[11px]">
          {tag === "self" && <Badge tone="review" size="sm" className="mr-2">Self-reported</Badge>}
          {tag === "editorial" && <Badge tone="neutral" size="sm" className="mr-2">Editorial</Badge>}
          {source && `Source: ${source}`}
        </span>
      </dd>
    </div>
  );
}

export default async function CompanyPage({ params }: { params: Promise<{ company: string }> }) {
  const c = getCompany((await params).company);
  if (!c) notFound();
  const country = COUNTRY_BY_CODE[c.country];
  const sub = c.subdivision ? SUBDIVISION.find((s) => s.code === c.subdivision)?.name : undefined;
  const type = ORGANISATION_TYPE.find((t) => t.code === c.orgType)?.labelEn;
  const coverage = byCompany(c.slug);
  const similar = COMPANIES.filter((x) => x.slug !== c.slug && x.categories.some((k) => c.categories.includes(k))).slice(0, 3);
  const events = upcomingEvents().slice(0, 2);
  const verified = c.certifications.filter((x) => x.verified);
  const stds = STANDARDS.filter((s) => s.certifiedCompanies?.includes(c.slug));

  return (
    <Shell>
      <div className="relative overflow-hidden bg-dark text-white">
        <MeshBg id={c.categories[0] === "filtration" ? "woven" : c.categories[0] === "access" ? "grate" : "weld"} color="#FFFFFF" opacity={0.08} className="!left-auto !w-[520px]" />
        <div className="wrap relative pt-7 pb-8">
          <div className="text-grey-3 [&_a:hover]:text-white [&_b]:text-white"><Crumbs items={[{ label: "Directory", href: "/directory/" }, { label: CATEGORY.find((k) => k.code === c.categories[0])?.labelEn ?? "", href: `/directory/?category=${c.categories[0]}` }, { label: c.name }]} /></div>
          <div className="mt-5 flex flex-wrap items-start gap-5">
            <span className="flex h-16 w-16 shrink-0 items-center justify-center rounded-xl border border-line-dark bg-dark-2 text-[16px] font-extrabold text-grey-3">{c.country}</span>
            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-center gap-2.5">
                <h1 className="font-display text-[34px] tracking-[-0.045em] md:text-[40px]">{c.name}</h1>
                {c.claimed && <Badge tone="current">Claimed</Badge>}
                <Badge tone="opinion" className="!border-line-dark !text-grey-3">{type}</Badge>
              </div>
              <div className="num mt-1 text-[13px] font-bold text-grey-3">{c.city}{sub ? `, ${sub}` : ""}, {country?.name}{c.founded && ` · Founded ${c.founded}`}</div>
              <p className="mt-3 max-w-[720px] text-[15px] font-medium leading-[1.6] text-on-dark-2">{c.summary}</p>
              <div className="mt-3 flex flex-wrap gap-1.5">
                {c.categories.map((k) => <span key={k} className="rounded-md bg-white/10 px-2.5 py-1 text-[11.5px] font-bold">{CATEGORY.find((x) => x.code === k)?.labelEn}</span>)}
                {(c.processes ?? []).map((p) => <span key={p} className="rounded-md border border-line-dark px-2.5 py-1 text-[11.5px] font-bold text-grey-3">{p.replace(/_/g, " ")}</span>)}
              </div>
            </div>
            <div className="flex flex-col items-end gap-2">
              {c.website && <a href={c.website} target="_blank" rel="noopener noreferrer nofollow" className="inline-flex min-h-[42px] items-center rounded-full bg-white px-5 text-[13.5px] font-extrabold text-ink hover:bg-red hover:text-white">Company website ↗</a>}
              <Link href="/signin/" className="inline-flex min-h-[42px] items-center rounded-full border border-line-dark px-5 text-[13.5px] font-extrabold hover:border-red">Save to my list</Link>
              <span className="num text-[10.5px] font-bold text-grey-5">{c.claimed ? `MAINTAINED BY THE COMPANY · VERIFIED ${fmtDate(c.verifiedAt!).toUpperCase()}` : "UNCLAIMED · EDITORIAL LISTING"}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="wrap grid gap-10 pt-8 lg:grid-cols-[minmax(0,1fr)_320px]">
        <div className="flex flex-col gap-10">
          {/* Products */}
          <section>
            <div className="flex items-baseline justify-between"><h2 className="font-display text-[22px]">Products</h2><span className="kicker text-[10px]">Supplied by the company · reviewed by editors</span></div>
            {c.productCards.length ? (
              <div className="mt-4 grid gap-4 md:grid-cols-3">
                {c.productCards.map((p) => (
                  <div key={p.name} className="rounded-card border border-line p-3">
                    <div className="relative aspect-[4/3] overflow-hidden rounded-lg bg-dark-2"><MeshBg id="weldQ" color="#FFFFFF" opacity={0.16} /><span className="num absolute right-2 top-2 rounded bg-black/50 px-1.5 py-0.5 text-[10px] font-extrabold text-white">{p.photos} photos</span></div>
                    <div className="font-display mt-3 text-[15px]">{p.name}</div>
                    <div className="meta mt-0.5 text-[12px] leading-[1.5]">{p.spec}</div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="meta mt-3">No products listed. {c.claimed ? "" : "This profile has not been claimed; products appear once the company maintains the listing."}</p>
            )}
            <p className="meta mt-3 text-[11.5px] leading-[1.6]">Product photos are supplied by the company, which declares it holds the rights; editors review them before display. They show appearance only and are not a specification or proof of performance. Wire Mesh News does not endorse product quality.</p>
          </section>

          {/* Certifications */}
          <section>
            <h2 className="font-display text-[22px]">Certifications</h2>
            {c.certifications.length ? (
              <div className="mt-4 grid gap-3 md:grid-cols-2">
                {c.certifications.map((x, i) => {
                  const t = CERTIFICATION_TYPE.find((k) => k.code === x.type)?.label ?? x.type;
                  return (
                    <div key={i} className="flex gap-3 rounded-card border border-line p-4">
                      <span className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg ${x.verified ? "bg-[var(--st-current-bg)] text-[var(--st-current-fg)]" : "bg-paper text-grey"}`}>
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" aria-hidden="true"><path d="M12 3.2 4.8 6v5.4c0 4.3 3 7.8 7.2 9 4.2-1.2 7.2-4.7 7.2-9V6z" />{x.verified && <path d="m8.9 12 2.1 2.1 4-4.2" />}</svg>
                      </span>
                      <span className="min-w-0">
                        <span className="block text-[14px] font-extrabold">{t}</span>
                        {x.verified ? (
                          <><span className="num meta block text-[12px]">Cert. no. {x.no} · {x.issuer}{x.expires && ` · valid to ${fmtDate(x.expires)}`}</span><span className="meta mt-1 block text-[11px]"><Badge tone="current" size="sm" className="mr-1.5">Verified</Badge>against the certifier’s database, {fmtDate(c.verifiedAt ?? c.updated)}</span></>
                        ) : (
                          <span className="meta mt-1 block text-[11.5px]">Submitted by the company; verification pending. Not shown as verified until confirmed.</span>
                        )}
                      </span>
                    </div>
                  );
                })}
              </div>
            ) : <p className="meta mt-3">No certifications on file.</p>}
            <p className="meta mt-3 text-[11.5px] leading-[1.6]">Only certifications with a certificate copy on file and a record found in the issuer’s database are marked verified. Certification data is locked once submitted; changes go through an editor.</p>
          </section>

          {/* Key facts */}
          <section>
            <h2 className="font-display text-[22px]">Key facts</h2>
            <dl className="mt-3 border-b border-line">
              <Fact k="Legal name" v={c.legalName ?? "—"} source="public registry" />
              <Fact k="Founded" v={c.founded ?? "—"} source="company website" />
              <Fact k="Organisation type" v={type} tag="editorial" source="classified by Wire Mesh News editors" />
              <Fact k="Headquarters" v={`${c.city}${sub ? `, ${sub}` : ""}, ${country?.name}`} source="company website" />
              <Fact k="Employees" v={EMPLOYEE_RANGE.find((e) => e.code === c.employees)?.label ?? "—"} tag="self" />
              <Fact k="Product categories" v={c.categories.map((k) => CATEGORY.find((x) => x.code === k)?.labelEn).join("; ")} tag="editorial" source="classified from the product list" />
              <Fact k="Product range" v={c.products.map((p) => PRODUCT_BY_CODE[p]?.labelEn ?? p.replace(/_/g, " ")).join("; ")} source="product catalogue" />
              {c.processes && <Fact k="Process capability" v={c.processes.map((p) => p.replace(/_/g, " ")).join("; ")} source="product catalogue and interview" />}
              {c.exportMarkets && <Fact k="Export markets" v={c.exportMarkets.map((r) => REGION.find((x) => x.code === r)?.labelEn).join("; ")} tag="self" source={`company statement, ${fmtDate(c.updated)}`} />}
            </dl>
            <Card tone="paper" className="mt-4">
              <div className="kicker text-[10px]">About this profile</div>
              <p className="meta mt-1.5 leading-[1.6]">{c.claimed ? "Maintained by the company after claiming; every change is reviewed by an editor and each fact carries its source." : "An editorial listing built from public information; the company has not claimed it."} Listing is not a recommendation or endorsement, and order is never paid for. Self-reported data is labelled; capacity, market-share and revenue claims that cannot be verified are not published.</p>
            </Card>
          </section>

          {/* Coverage */}
          <section>
            <div className="flex items-baseline justify-between"><h2 className="font-display text-[22px]">Coverage</h2>{coverage.length > 0 && <span className="num text-[11px] font-extrabold tracking-[0.06em] text-red-text">ALL {coverage.length} →</span>}</div>
            {coverage.length ? coverage.map((a) => <ArticleRow key={a.slug} a={a} />) : <p className="meta mt-3">Not yet mentioned in our reporting. Coverage is editorial and never arranged with the company.</p>}
          </section>
        </div>

        <aside className="flex flex-col gap-5">
          <Card>
            <div className="font-display text-[15px]">Contact details</div>
            <div className="mt-3 rounded-card bg-paper p-4">
              <div className="flex flex-col gap-1 text-[13px] font-bold text-grey blur-[3px] select-none" aria-hidden="true"><span>sales@company.example</span><span>+00 000 000 0000</span><span>Street, City, Country</span></div>
              <div className="mt-3 text-[13px] font-bold">Sign in to view contact details</div>
              <p className="meta mt-1 text-[11.5px] leading-[1.55]">Contact details are shown to signed-in readers only, to stop bulk scraping for marketing. Registration is free.</p>
              <Link href={`/signin/?next=/directory/${c.slug}/`} className="mt-3 inline-flex min-h-[40px] w-full items-center justify-center rounded-full bg-ink text-[13px] font-extrabold text-white dark:bg-white dark:text-ink">Sign in to view</Link>
              <Link href={`/directory/${c.slug}/contact/`} className="mt-2 inline-flex min-h-[40px] w-full items-center justify-center rounded-full border border-line text-[13px] font-extrabold">Contact this company</Link>
            </div>
          </Card>
          <Card>
            <div className="kicker mb-2 text-[10px]">At a glance</div>
            <dl className="num text-[13px]">
              {[["Founded", c.founded ?? "—"], ["Type", type], ["Country", country?.name], ["Products listed", c.productCards.length], ["Certifications", `${verified.length} verified`], ["Articles", coverage.length]].map(([k, v]) => (
                <div key={String(k)} className="flex justify-between border-t border-line-soft py-1.5"><dt className="text-slate">{k}</dt><dd className="m-0 font-extrabold">{v}</dd></div>
              ))}
            </dl>
          </Card>
          {stds.length > 0 && (
            <Card>
              <div className="kicker mb-2 text-[10px]">Certified to</div>
              <ul className="num flex flex-col gap-1.5 text-[13.5px] font-extrabold">{stds.map((s) => <li key={s.no}><Link href={`/standards/${s.slug}/`} className="hover:text-red-text">{s.no}</Link></li>)}</ul>
            </Card>
          )}
          <Card>
            <div className="kicker mb-2 text-[10px]">Similar companies</div>
            <ul className="flex flex-col">
              {similar.map((x) => <li key={x.slug}><Link href={`/directory/${x.slug}/`} className="flex items-center justify-between border-t border-line-soft py-2 text-[13.5px] font-extrabold hover:text-red-text"><span>{x.name}</span><span className="num text-[11px] font-bold text-grey">{x.country}</span></Link></li>)}
            </ul>
          </Card>
          <Card>
            <div className="kicker mb-2 text-[10px]">At upcoming events</div>
            {events.map((e) => (
              <Link key={e.slug} href={`/events/#${e.slug}`} className="flex items-center gap-3 border-t border-line-soft py-2.5">
                <span className="num flex h-11 w-11 shrink-0 flex-col items-center justify-center rounded-lg bg-dark text-white"><span className="text-[8.5px] font-extrabold tracking-[0.1em]">{fmtDateShort(e.start).split(" ")[1]}</span><span className="text-[16px] font-extrabold leading-none">{fmtDateShort(e.start).split(" ")[0]}</span></span>
                <span className="min-w-0"><span className="font-display block truncate text-[14px]">{e.name}</span><span className="meta block text-[11px]">{e.online ? "Online" : e.city} · <Badge tone="review" size="sm">Self-reported</Badge></span></span>
              </Link>
            ))}
          </Card>
          <Card tone="paper">
            <div className="font-display text-[14px]">Something wrong here?</div>
            <p className="meta mt-1 text-[12px] leading-[1.55]">Corrections need a verifiable source; editors check and record the change time.</p>
            <Link href="/contact/?subject=directory" className="mt-2 inline-block text-[11.5px] font-extrabold tracking-[0.06em] text-red-text">SUGGEST A CORRECTION →</Link>
          </Card>
          <AdSlot kind="mpu" />
          <Kicker className="sr-only">End</Kicker>
        </aside>
      </div>
    </Shell>
  );
}
