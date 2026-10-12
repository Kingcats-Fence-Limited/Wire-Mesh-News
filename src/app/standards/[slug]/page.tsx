import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { Shell, Crumbs } from "@/components/site/Shell";
import { Badge } from "@/components/ui/Primitives";
import { MeshBg } from "@/components/ui/Mesh";
import { NumberedRow } from "@/components/site/ArticleCards";
import { FollowButton } from "@/components/site/FollowButton";
import { STANDARDS, getStandard, getStandardByNo } from "@/lib/content/standards";
import { byStandard } from "@/lib/content/articles";
import { getCompany } from "@/lib/content/directory";
import { STANDARDS_BODY, STANDARD_SUBJECT } from "@/data/vocab";
import { STATUS_TONE, STATUS_LABEL } from "@/lib/standards-ui";
import { fmtDate } from "@/lib/site";

export function generateStaticParams() {
  return STANDARDS.map((s) => ({ slug: s.slug }));
}
export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const s = getStandard((await params).slug);
  return s ? { title: `${s.no} — ${s.title}`, description: s.covers } : {};
}

const KIND_LABEL = { status: "Status", equivalents: "Equivalents added", added: "Added to index", edition: "New edition", withdrawn: "Withdrawn" } as const;
const KIND_TONE = { status: "review", equivalents: "withdrawn", added: "current", edition: "topic", withdrawn: "withdrawn" } as const;

export default async function StandardPage({ params }: { params: Promise<{ slug: string }> }) {
  const s = getStandard((await params).slug);
  if (!s) notFound();
  const body = STANDARDS_BODY.find((b) => b.code === s.body);
  const coverage = byStandard(s.no);
  const related = s.related.map((n) => ({ no: n, std: getStandardByNo(n) }));
  const certified = (s.certifiedCompanies ?? []).map((c) => getCompany(c)).filter(Boolean);

  return (
    <Shell>
      <div className="wrap pt-7">
        <Crumbs items={[{ label: "Standards Index", href: "/standards/" }, { label: s.no }]} />
      </div>
      <div className="wrap mt-4">
        <div className="overflow-hidden rounded-card-lg border-2 border-ink dark:border-line-2">
          <div className="relative overflow-hidden bg-dark p-6 text-white md:p-7">
            <MeshBg id="chain" color="#FFFFFF" opacity={0.14} className="!left-auto !w-[300px]" />
            <div className="relative flex flex-wrap items-start justify-between gap-6">
              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-2.5">
                  <Badge tone={STATUS_TONE[s.status]}>{STATUS_LABEL[s.status]}</Badge>
                  <span className="num text-[11px] font-bold text-grey-2">STATUS CHECKED {fmtDate(s.checked).toUpperCase()} · SOURCE: {body?.name.split(" — ")[0]}</span>
                </div>
                <h1 className="num font-display mt-2.5 text-[34px] tracking-[-0.02em] md:text-[38px]">{s.no}</h1>
                <p className="mt-1.5 max-w-[640px] text-[16px] font-bold leading-[1.4] text-on-dark-2">{s.title}</p>
              </div>
              <div className="flex flex-col items-start gap-2 md:items-end">
                <div className="flex flex-wrap gap-2.5">
                  <FollowButton id={s.slug} count={s.followers} />
                  <a href={s.sourceUrl} target="_blank" rel="noopener noreferrer" className="inline-flex min-h-[46px] items-center gap-2 rounded-full bg-red px-5 text-[14px] font-extrabold hover:bg-red-deep">Buy the official text ↗</a>
                </div>
                <span className="num text-[10.5px] font-bold text-grey-5">Sign in to follow · email on status change · purchase link goes to the issuing body</span>
              </div>
            </div>
          </div>

          <div className="grid lg:grid-cols-[1fr_320px]">
            <div className="p-6 lg:border-r lg:border-line">
              <h2 className="font-display text-[16px]">What it covers</h2>
              <p className="mt-2 text-[14.5px] font-medium leading-[1.72] text-fg-2">{s.covers}</p>
              {s.replacedBy && <p className="mt-3 rounded-lg bg-paper p-3 text-[13px] font-bold">Withdrawn — replaced by <Link href={`/standards/${getStandardByNo(s.replacedBy)?.slug ?? ""}/`} className="std-link">{s.replacedBy}</Link>. Older documents that cite this number should be read as pointing to the replacement.</p>}

              <h2 className="font-display mt-6 text-[16px]">Why it matters in practice</h2>
              <ul className="mt-2 flex list-disc flex-col gap-2 pl-5 text-[14px] font-medium leading-[1.65] text-fg-2 marker:text-red">{s.whyItMatters.map((w, i) => <li key={i}>{w}</li>)}</ul>

              {/* Change log */}
              <div className="mt-7 flex items-baseline justify-between"><h2 className="font-display text-[16px]">Change log</h2><span className="num text-[10.5px] font-extrabold tracking-[0.08em] text-slate">EVERY ENTRY HAS A SOURCE</span></div>
              <ol className="relative mt-3 pl-[22px]">
                <span className="absolute left-[5px] top-1.5 bottom-1.5 w-[2px] bg-line" aria-hidden="true" />
                {s.changelog.map((c, i) => (
                  <li key={i} className="relative pb-4 last:pb-0">
                    <span className={`absolute -left-[22px] top-1 h-3 w-3 rounded-full border-2 ${i === 0 ? "border-red bg-red shadow-[0_0_0_2px_#fff] dark:shadow-none" : "border-ink bg-bg dark:border-line-2"}`} aria-hidden="true" />
                    <div className="flex flex-wrap items-center gap-2"><span className="num text-[11.5px] font-extrabold">{fmtDate(c.date).toUpperCase()}</span><Badge tone={KIND_TONE[c.kind]} size="sm">{KIND_LABEL[c.kind]}</Badge></div>
                    <p className="mt-0.5 text-[13.5px] font-medium leading-[1.55] text-fg-2">{c.text} {c.source && <a href={c.source} target="_blank" rel="noopener noreferrer" className="num text-[11.5px] font-extrabold text-red-text">Source ↗</a>}</p>
                  </li>
                ))}
              </ol>
              <p className="meta mt-3 text-[11.5px] leading-[1.55]">Machine-detected changes go to a verification queue first; they appear here only after an editor confirms them and records the source. Followers are emailed after confirmation, never on detection.</p>

              <h2 className="font-display mt-7 text-[16px]">Our coverage</h2>
              {coverage.length ? coverage.map((a, i) => <NumberedRow key={a.slug} a={a} n={i + 1} />) : <p className="meta mt-2">No articles reference this standard yet.</p>}

              <div className="mt-6 flex flex-wrap items-center gap-4 rounded-xl bg-paper p-4">
                <div className="flex-1 basis-[300px]"><div className="text-[13.5px] font-extrabold">Status changed? Tell us.</div><p className="meta mt-0.5 text-[12px] leading-[1.55]">Standards change and we cannot check every one every day. Reader reports are verified and the change is noted in Standards Watch.</p></div>
                <Link href="/contact/?subject=correction" className="inline-flex min-h-[40px] items-center rounded-full border-[1.5px] border-ink px-4 text-[13px] font-extrabold hover:border-red hover:text-red-text dark:border-white">Report a change</Link>
              </div>
            </div>

            <aside className="flex flex-col gap-5 p-6">
              <div>
                <div className="kicker mb-2 text-[10px]">Bibliographic</div>
                <dl className="num text-[13px]">
                  {[["Body", body?.name.split(" — ")[0]], ["Edition", s.edition ?? "—"], ["Subject", STANDARD_SUBJECT.find((x) => x.code === s.subject)?.labelEn], ["Replaces", s.replaces ?? "—"], ["Adopted as", s.adoptedAs?.join(" / ") ?? "—"]].map(([k, v]) => (
                    <div key={String(k)} className="flex justify-between gap-3 border-t border-line-soft py-1.5"><dt className="text-slate">{k}</dt><dd className="m-0 text-right font-extrabold">{v}</dd></div>
                  ))}
                </dl>
              </div>
              <div>
                <div className="kicker mb-2 text-[10px]">Related standards</div>
                <div className="flex flex-col gap-2">
                  {related.map((r) => r.std ? <Link key={r.no} href={`/standards/${r.std.slug}/`} className="num flex items-center justify-between rounded-lg border border-line px-3 py-2 text-[13px] font-extrabold hover:border-ink"><span>{r.no}</span><Badge tone={STATUS_TONE[r.std.status]} size="sm">{STATUS_LABEL[r.std.status]}</Badge></Link> : <span key={r.no} className="num rounded-lg border border-dashed border-line px-3 py-2 text-[13px] font-bold text-grey">{r.no} <span className="text-[10px]">· not indexed yet</span></span>)}
                </div>
              </div>
              {s.equivalents && (
                <div>
                  <div className="kicker mb-2 text-[10px]">Equivalents</div>
                  <ul className="num flex flex-col text-[13px]">{s.equivalents.map((e) => <li key={e.no} className="flex items-center justify-between border-t border-line-soft py-1.5"><span className="font-bold">{e.no}</span><Badge tone={e.relation === "equivalent" ? "current" : e.relation === "partial" ? "review" : "withdrawn"} size="sm">{e.relation}</Badge></li>)}</ul>
                </div>
              )}
              <div>
                <div className="kicker mb-1 text-[10px]">Certified to this standard</div>
                <p className="meta mb-2 text-[11.5px] leading-[1.5]">Claimed companies whose certificate an editor has checked. Unchecked claims are not shown.</p>
                {certified.length ? certified.map((c) => <Link key={c!.slug} href={`/directory/${c!.slug}/`} className="flex items-center gap-2.5 border-t border-line-soft py-2 hover:text-red-text"><span className="flex h-7 w-7 items-center justify-center rounded-md border border-line bg-paper text-[10px] font-extrabold text-slate">{c!.country}</span><span className="text-[13.5px] font-extrabold">{c!.name}</span></Link>) : <p className="meta">None verified yet.</p>}
              </div>
            </aside>
          </div>
        </div>
        <p className="meta mt-4 text-[11.5px] leading-[1.6]">This page summarises a copyrighted standard in the editors’ own words. It reproduces no clause text, tables or figures and is not a substitute for the official document. Technical decisions should be made against the purchased text.</p>
      </div>
    </Shell>
  );
}
