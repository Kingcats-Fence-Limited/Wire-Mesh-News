import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { pageMeta } from "@/lib/seo";
import { Shell } from "@/components/shell/Shell";
import { BuyReport } from "@/components/boards/intel/BuyReport";
import { getReport, getReports } from "@/lib/server/reports";
import "@/styles/board-intel.css";

export const revalidate = 3600;
export async function generateStaticParams() { return (await getReports()).map((r) => ({ slug: r.slug })); }

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const r = await getReport((await params).slug);
  return r ? pageMeta({ title: r.title, description: r.summary ?? r.title, path: `/reports/${r.slug}/` }) : {};
}

export default async function ReportPage({ params }: { params: Promise<{ slug: string }> }) {
  const r = await getReport((await params).slug);
  if (!r) notFound();
  return (
    <Shell header="compact" board="b-intel">
      <section style={{ paddingTop: "28px", paddingBottom: "56px", maxWidth: "900px" }} className="wrap">
        <nav aria-label="Breadcrumb" style={{ fontSize: "12.5px", fontWeight: 500, color: "var(--slate)", marginBottom: "14px" }}><Link href="/" style={{ color: "var(--slate)" }}>Home</Link> / <Link href="/reports/" style={{ color: "var(--slate)" }}>Reports</Link></nav>
        <div style={{ display: "grid", gridTemplateColumns: r.cover ? "220px minmax(0,1fr)" : "1fr", gap: "28px" }} className="cols">
          {r.cover && /* eslint-disable-next-line @next/next/no-img-element */ <img src={`/api/reports/${r.slug}/cover/`} alt={`Cover of ${r.title}`} width={220} style={{ width: "100%", borderRadius: "10px", border: "1px solid var(--line)" }} />}
          <div>
            {r.soon && <span className="sample">COMING SOON</span>}
            <h1 style={{ margin: "10px 0 12px", fontSize: "38px", letterSpacing: "-.04em", lineHeight: 1.06 }} className="h">{r.title}</h1>
            <p style={{ margin: "0 0 18px", fontSize: "16px", fontWeight: 500, lineHeight: 1.6, color: "var(--fg-3)" }}>{r.summary}</p>
            <div style={{ display: "flex", gap: "14px", alignItems: "center", flexWrap: "wrap", marginBottom: "22px" }}>
              <span className="h" style={{ fontSize: "28px" }}>US${r.price_usd}</span>
              <BuyReport slug={r.slug} price={r.price_usd} soon={r.soon} />
              {r.sample && <a href={`/api/reports/${r.slug}/sample/`} className="ibtn" target="_blank" rel="noopener">Free sample pages</a>}
            </div>
            {r.pages ? <p className="meta">{r.pages} pages · PDF{r.published_at ? ` · published ${new Intl.DateTimeFormat("en-GB", { month: "long", year: "numeric" }).format(new Date(r.published_at))}` : ""}</p> : null}
            {(r.contents?.length ?? 0) > 0 && (<><h2 className="h" style={{ fontSize: "20px", margin: "22px 0 10px" }}>Contents</h2><ol style={{ margin: 0, paddingLeft: "20px", fontSize: "15px", fontWeight: 500, lineHeight: 1.8 }}>{r.contents!.map((c) => <li key={c}>{c}</li>)}</ol></>)}
          </div>
        </div>
      </section>
    </Shell>
  );
}
