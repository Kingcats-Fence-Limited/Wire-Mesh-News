import Link from "next/link";
import type { Metadata } from "next";
import { Shell, Crumbs } from "@/components/site/Shell";
import { Badge, Card, ChipLink } from "@/components/ui/Primitives";
import { MeshBg } from "@/components/ui/Mesh";
import { STANDARDS, recentStandardChanges } from "@/lib/content/standards";
import { byStandard } from "@/lib/content/articles";
import { STANDARDS_BODY, STANDARD_SUBJECT } from "@/data/vocab";
import { fmtDate, fmtDateShort } from "@/lib/site";
import type { StandardStatus } from "@/lib/content/types";
import { STATUS_TONE, STATUS_LABEL } from "@/lib/standards-ui";

export const metadata: Metadata = { title: "Standards Index", description: "A maintained index of the standards that govern wire mesh, fencing, coatings, grating and filtration media: number, title, body, status and a plain-English summary. We summarise; we never reproduce standard text." };


export default async function StandardsPage({ searchParams }: { searchParams: Promise<{ body?: string; subject?: string; status?: string }> }) {
  const sp = await searchParams;
  const list = STANDARDS.filter((s) => (!sp.body || s.body === sp.body) && (!sp.subject || s.subject === sp.subject) && (!sp.status || s.status === sp.status)).sort((a, b) => a.no.localeCompare(b.no, undefined, { numeric: true }));
  const q = (patch: Record<string, string | undefined>) => {
    const p = new URLSearchParams();
    for (const [k, v] of Object.entries({ ...sp, ...patch })) if (v) p.set(k, v);
    const s = p.toString();
    return `/standards/${s ? `?${s}` : ""}`;
  };
  const bodies = [...new Set(STANDARDS.map((s) => s.body))];
  const subjects = [...new Set(STANDARDS.map((s) => s.subject))];
  const changes = recentStandardChanges(4);
  const eq = STANDARDS.filter((s) => s.equivalents?.length);

  return (
    <Shell>
      <div className="relative overflow-hidden bg-dark text-white">
        <MeshBg id="weld" color="#FFFFFF" opacity={0.1} className="!left-auto !w-[520px]" />
        <div className="wrap relative pt-7 pb-8">
          <div className="text-grey-3 [&_b]:text-white"><Crumbs items={[{ label: "Standards Index" }]} /></div>
          <div className="mt-4 grid gap-6 lg:grid-cols-[1fr_auto] lg:items-end">
            <div className="max-w-[760px]">
              <h1 className="font-display text-[40px] tracking-[-0.045em]">Standards Index<span className="text-red">.</span></h1>
              <p className="mt-3 text-[15.5px] font-medium leading-[1.6] text-on-dark-2">The standards that govern wire mesh, fencing, coatings, grating and filtration media — number, title, issuing body, current status and a plain-English summary of what each one covers. Every status carries the date it was last checked against the issuing body.</p>
            </div>
            <div className="num flex gap-6 text-[12px] font-extrabold tracking-[0.08em] text-grey-3">
              <span><b className="font-display block text-[26px] tracking-[-0.02em] text-white">{STANDARDS.length}</b>STANDARDS</span>
              <span><b className="font-display block text-[26px] tracking-[-0.02em] text-white">{bodies.length}</b>BODIES</span>
              <span><b className="font-display block text-[26px] tracking-[-0.02em] text-white">{STANDARDS.filter((s) => s.status === "under_review").length}</b>UNDER REVIEW</span>
            </div>
          </div>
          <div className="mt-6 rounded-card border border-red/40 bg-red/10 p-4 text-[13px] font-medium leading-[1.6] text-on-dark-2">
            <b className="text-white">What this index is not.</b> We do not reproduce clauses, tables or figures, host PDFs, or offer downloads. Standards are copyrighted works; buy the official text from the issuing body — every entry links to it. Our summaries are written by editors and are not a substitute for the standard.
          </div>
        </div>
      </div>

      {/* Filter bar */}
      <div className="border-b-[3px] border-ink bg-ink text-white dark:border-line-2">
        <div className="wrap flex flex-wrap items-center gap-2 py-3">
          <span className="kicker mr-1 text-[10px] text-grey-3">Body</span>
          <ChipLink href={q({ body: undefined })} active={!sp.body} size="sm" className={!sp.body ? "" : "!border-line-dark !bg-transparent !text-white hover:!border-white"}>All</ChipLink>
          {bodies.map((b) => <ChipLink key={b} href={q({ body: sp.body === b ? undefined : b })} active={sp.body === b} size="sm" className={sp.body === b ? "" : "!border-line-dark !bg-transparent !text-white hover:!border-white"}>{STANDARDS_BODY.find((x) => x.code === b)?.name.split(" — ")[0] ?? b.toUpperCase()}</ChipLink>)}
          <span className="mx-2 h-5 w-px bg-line-dark" />
          <span className="kicker mr-1 text-[10px] text-grey-3">Status</span>
          {(["current", "under_review", "draft", "withdrawn"] as StandardStatus[]).map((st) => <ChipLink key={st} href={q({ status: sp.status === st ? undefined : st })} active={sp.status === st} size="sm" className={sp.status === st ? "" : "!border-line-dark !bg-transparent !text-white hover:!border-white"}>{STATUS_LABEL[st]}</ChipLink>)}
        </div>
      </div>

      <div className="wrap grid gap-10 pt-6 lg:grid-cols-[minmax(0,1fr)_300px]">
        <div>
          <div className="no-scrollbar flex gap-2 overflow-x-auto border-b border-line pb-3">
            <ChipLink href={q({ subject: undefined })} active={!sp.subject} size="sm">All subjects</ChipLink>
            {subjects.map((s) => <ChipLink key={s} href={q({ subject: sp.subject === s ? undefined : s })} active={sp.subject === s} size="sm" count={STANDARDS.filter((x) => x.subject === s).length}>{STANDARD_SUBJECT.find((x) => x.code === s)?.labelEn}</ChipLink>)}
          </div>

          <div className="mt-2 hidden grid-cols-[170px_1fr_120px_130px_90px] gap-4 px-4 py-2 text-[10px] font-extrabold tracking-[0.1em] text-grey md:grid">
            <span>NUMBER</span><span>TITLE</span><span>BODY</span><span>STATUS</span><span>CHECKED</span>
          </div>
          <ul>
            {list.map((s) => (
              <li key={s.no}>
                <Link href={`/standards/${s.slug}/`} className="group grid gap-2 border-b border-line-soft px-4 py-4 hover:bg-paper-2 md:grid-cols-[170px_1fr_120px_130px_90px] md:items-center md:gap-4">
                  <span className="num font-display text-[17px] tracking-[-0.01em] group-hover:text-red-text">{s.no}</span>
                  <span className="min-w-0">
                    <span className="block text-[14px] font-bold leading-[1.35]">{s.title}</span>
                    <span className="meta block text-[11.5px]">{STANDARD_SUBJECT.find((x) => x.code === s.subject)?.labelEn}{byStandard(s.no).length ? ` · ${byStandard(s.no).length} article${byStandard(s.no).length > 1 ? "s" : ""}` : ""}{s.replacedBy ? ` · replaced by ${s.replacedBy}` : ""}</span>
                  </span>
                  <span className="text-[12.5px] font-bold text-slate">{STANDARDS_BODY.find((x) => x.code === s.body)?.name.split(" — ")[0]}</span>
                  <span><Badge tone={STATUS_TONE[s.status]}>{STATUS_LABEL[s.status]}</Badge></span>
                  <span className="num text-[11px] font-bold text-grey">{fmtDateShort(s.checked)}</span>
                </Link>
              </li>
            ))}
          </ul>
          {list.length === 0 && <p className="meta py-10 text-center">No standards match. <Link href="/standards/" className="font-extrabold text-red-text">Clear filters</Link></p>}

          {/* Equivalence */}
          <section id="equivalence" className="mt-12 scroll-mt-20">
            <h2 className="font-display text-[22px]">Equivalence table</h2>
            <p className="meta mt-1 leading-[1.6]">National adoptions and the nearest counterparts in other systems. “Equivalent” means the body itself declares adoption; “partial” is an editorial judgement with the key difference noted on the standard’s page.</p>
            <div className="mt-4 overflow-x-auto">
              <table className="w-full border-collapse text-[13px]">
                <thead><tr>{["Standard", "Counterpart", "Body", "Relation"].map((h) => <th key={h} className="bg-ink px-3 py-2.5 text-left text-[10.5px] font-extrabold tracking-[0.1em] text-white dark:bg-dark-3">{h.toUpperCase()}</th>)}</tr></thead>
                <tbody>
                  {eq.flatMap((s) => s.equivalents!.map((e, i) => (
                    <tr key={s.no + e.no} className="even:bg-paper-2">
                      <td className="num border-b border-line px-3 py-2.5 font-extrabold">{i === 0 ? <Link href={`/standards/${s.slug}/`} className="hover:text-red-text">{s.no}</Link> : ""}</td>
                      <td className="num border-b border-line px-3 py-2.5 font-bold">{e.no}</td>
                      <td className="border-b border-line px-3 py-2.5 text-slate">{e.body}</td>
                      <td className="border-b border-line px-3 py-2.5"><Badge tone={e.relation === "equivalent" ? "current" : e.relation === "partial" ? "review" : "withdrawn"} size="sm">{e.relation === "equivalent" ? "Equivalent" : e.relation === "partial" ? "Partial" : "Not equivalent"}</Badge></td>
                    </tr>
                  )))}
                </tbody>
              </table>
            </div>
          </section>
        </div>

        <aside className="flex flex-col gap-5">
          <Card>
            <div className="mb-2 flex items-center justify-between"><span className="font-display text-[12px] tracking-[0.1em]">RECENT CHANGES</span><span className="meta text-[11px]">every entry sourced</span></div>
            <ul className="flex flex-col divide-y divide-line-soft">
              {changes.map((c) => (
                <li key={c.no + c.date} className="py-2.5 first:pt-0 last:pb-0">
                  <Link href={`/standards/${c.slug}/`} className="group block">
                    <span className="flex items-center gap-2"><span className="num text-[14px] font-extrabold group-hover:text-red-text">{c.no}</span><Badge tone={STATUS_TONE[c.status]} size="sm">{STATUS_LABEL[c.status]}</Badge></span>
                    <span className="meta mt-1 block text-[12px] leading-[1.5]">{c.text}</span>
                    <span className="num text-[10px] font-bold tracking-[0.06em] text-grey">{fmtDate(c.date).toUpperCase()}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </Card>
          <Card tone="paper">
            <div className="font-display text-[15px]">How this index is maintained</div>
            <ul className="mt-2 flex list-disc flex-col gap-1.5 pl-[17px] text-[12.5px] font-medium leading-[1.6] text-fg-3">
              <li>Status comes only from the issuing body’s own catalogue; every entry shows the check date.</li>
              <li>Full review each quarter; items under review or in draft are checked monthly.</li>
              <li>Withdrawn standards stay listed and point to their replacement.</li>
              <li>Summaries are written by editors and never copy clause wording.</li>
            </ul>
          </Card>
          <Card tone="dark">
            <div className="font-display text-[15px]">Status changed? Tell us.</div>
            <p className="mt-1 text-[12.5px] font-medium leading-[1.6] text-grey-3">Standards change and we cannot check every one every day. Reader reports are verified and the change is noted in Standards Watch.</p>
            <Link href="/contact/?subject=correction" className="mt-3 inline-flex min-h-[40px] items-center rounded-full border border-line-dark px-4 text-[12.5px] font-extrabold hover:border-red">Report a change</Link>
          </Card>
        </aside>
      </div>
    </Shell>
  );
}
