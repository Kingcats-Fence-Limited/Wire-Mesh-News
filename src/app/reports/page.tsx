import type { Metadata } from "next";
import Link from "next/link";
import { pageMeta } from "@/lib/seo";
import { Shell } from "@/components/shell/Shell";
import { IntelHero } from "@/components/boards/intel/IntelHero";
import { BuyReport } from "@/components/boards/intel/BuyReport";
import { getReports } from "@/lib/server/reports";
import "@/styles/board-intel.css";

export const revalidate = 3600;
export const metadata: Metadata = pageMeta({ title: "Reports", description: "Market and buyer reports on fencing, wire mesh and grating from Wire Mesh News, sold one by one with an invoice.", path: "/reports/" });

export default async function ReportsPage() {
  const reports = await getReports();
  return (
    <Shell header="compact" board="b-intel">
      <IntelHero crumb="Reports" title="Reports" lede="In-depth market and buyer reports, bought one at a time. Each comes as a PDF with an invoice." />
      <section style={{ paddingTop: "30px", paddingBottom: "56px" }} className="wrap">
        <div style={{ display: "grid", gridTemplateColumns: "repeat(2, minmax(0,1fr))", gap: "16px" }} className="cols">
          {reports.map((r) => (
            <article key={r.slug} className="row">
              {r.soon && <span className="sample" style={{ alignSelf: "flex-start" }}>COMING SOON</span>}
              <Link href={`/reports/${r.slug}/`} className="h" style={{ fontSize: "20px", color: "inherit" }}>{r.title}</Link>
              <p style={{ margin: 0, fontSize: "14px", fontWeight: 500, lineHeight: 1.6, color: "var(--fg-3)" }}>{r.summary}</p>
              <div style={{ display: "flex", gap: "12px", alignItems: "center", flexWrap: "wrap", marginTop: "auto" }}>
                <span className="h" style={{ fontSize: "22px" }}>US${r.price_usd}</span>
                <BuyReport slug={r.slug} price={r.price_usd} soon={r.soon} />
                <Link href={`/reports/${r.slug}/`} className="ibtn">Contents</Link>
              </div>
            </article>
          ))}
        </div>
        <p style={{ marginTop: "22px", fontSize: "12.5px" }} className="meta">Prices exclude any VAT or sales tax shown at checkout. Reports are for the buyer&apos;s own organisation; see the <Link href="/policies/terms/" className="lnk">Terms</Link>. Need custom research? <Link href="/contact/?subject=other" className="lnk">Talk to us</Link>.</p>
      </section>
    </Shell>
  );
}
