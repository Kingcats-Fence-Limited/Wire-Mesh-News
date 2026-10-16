import type { Metadata } from "next";
import Link from "next/link";
import { pageMeta } from "@/lib/seo";
import { Shell } from "@/components/shell/Shell";
import { IntelHero } from "@/components/boards/intel/IntelHero";
import { MeshCalculator } from "@/components/boards/intel/MeshCalculator";
import { TEMPLATES } from "@/lib/content/templates";
import { PRODUCT_BY_CODE } from "@/data/vocab/product";
import "@/styles/board-intel.css";

export const metadata: Metadata = pageMeta({ title: "Templates & tools", description: "Purchase specifications, inspection checklists and test records for wire mesh, fencing, gabions and grating, plus a welded mesh weight and cost calculator.", path: "/tools/" });

const KIND = { specification: "SPECIFICATION", checklist: "CHECKLIST", record: "RECORD SHEET" } as const;

export default function ToolsPage() {
  return (
    <Shell header="compact" board="b-intel">
      <IntelHero crumb="Templates & tools" title="Templates and tools" lede="Specifications, inspection checklists and test records you can fill in and send, plus a calculator for welded mesh weight and cost." />
      <section id="calculator" style={{ paddingTop: "34px", paddingBottom: "20px" }} className="wrap">
        <h2 style={{ margin: "0 0 6px", fontSize: "28px" }} className="h">Welded mesh panel calculator</h2>
        <p style={{ margin: "0 0 18px" }} className="meta">Free for everyone. Change any figure; results update as you type.</p>
        <MeshCalculator />
      </section>
      <section id="templates" style={{ paddingTop: "30px", paddingBottom: "56px" }} className="wrap">
        <h2 style={{ margin: "0 0 6px", fontSize: "28px" }} className="h">Templates</h2>
        <p style={{ margin: "0 0 18px" }} className="meta">Written in our own words. They name the standards to cite but do not reproduce them; fill in the figures from the current official text.</p>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(2, minmax(0,1fr))", gap: "14px" }} className="cols">
          {TEMPLATES.map((t) => (
            <Link key={t.slug} href={`/tools/templates/${t.slug}/`} className="row" style={{ color: "inherit" }}>
              <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
                <span className="st" style={{ background: "var(--paper)", color: "var(--slate)" }}>{KIND[t.kind]}</span>
                <span className="st" style={{ background: t.free ? "var(--st-current-bg)" : "var(--ink)", color: t.free ? "var(--up)" : "var(--on-ink)" }}>{t.free ? "FREE" : "PRO"}</span>
              </div>
              <span className="h" style={{ fontSize: "17px" }}>{t.title}</span>
              <span className="meta" style={{ lineHeight: 1.55 }}>{t.summary}</span>
              <div className="tags">{t.products.slice(0, 3).map((p) => <span key={p} className="tag">{PRODUCT_BY_CODE[p]?.labelEn ?? p}</span>)}</div>
            </Link>
          ))}
        </div>
      </section>
    </Shell>
  );
}
