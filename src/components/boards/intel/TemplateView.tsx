"use client";

/* Template body: printed straight from the page (Print / save as PDF) or copied as text. Pro
   templates load from the server for entitled readers. */
import Link from "next/link";
import { useEffect, useState } from "react";
import type { TemplateSection } from "@/lib/content/templates";
import { AUTH_LIVE } from "@/lib/live";

export function TemplateView({ slug, title, initial }: { slug: string; title: string; initial: TemplateSection[] | null }) {
  const [sections, setSections] = useState<TemplateSection[] | null>(initial);
  const [locked, setLocked] = useState<{ signedIn: boolean } | null>(null);
  const [copied, setCopied] = useState(false);
  useEffect(() => {
    if (initial) return;
    fetch(`/api/intel/templates/${encodeURIComponent(slug)}/`).then(async (r) => {
      const j = (await r.json().catch(() => ({}))) as { sections?: TemplateSection[]; locked?: boolean; signedIn?: boolean };
      if (j.sections) setSections(j.sections); else setLocked({ signedIn: !!j.signedIn });
    }).catch(() => setLocked({ signedIn: false }));
  }, [slug, initial]);

  const text = () => [title, "", ...(sections ?? []).flatMap((s) => [s.heading, ...s.items.map((i) => `  - ${i}`), ""]), "Template: Wire Mesh News (wiremeshnews.com). Fill in figures from the current official standards."].join("\n");
  if (locked) {
    return (
      <div className="upsell" style={{ margin: "10px 0 0" }}>
        <div><div style={{ fontSize: "18px", marginBottom: "4px" }} className="h">This template is part of Pro</div><span className="meta">The full library of specifications and checklists comes with Pro, Team and Company plans.</span></div>
        <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
          {AUTH_LIVE && !locked.signedIn && <Link href={`/signin/?next=${encodeURIComponent(`/tools/templates/${slug}/`)}`} className="ibtn">Sign in</Link>}
          <Link href="/pricing/" className="ibtn red">See plans</Link>
        </div>
      </div>
    );
  }
  if (!sections) return <p className="meta" role="status">Loading…</p>;
  return (
    <>
      <div className="noprint" style={{ display: "flex", gap: "8px", flexWrap: "wrap", margin: "0 0 18px" }}>
        <button type="button" className="ibtn dark" onClick={() => window.print()}>Print / save as PDF</button>
        <button type="button" className="ibtn" onClick={() => { void navigator.clipboard?.writeText(text()).then(() => { setCopied(true); setTimeout(() => setCopied(false), 2000); }); }}>{copied ? "Copied" : "Copy as text"}</button>
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: "18px" }}>
        {sections.map((s) => (
          <section key={s.heading} style={{ border: "1px solid var(--line)", borderRadius: "12px", padding: "16px 18px", breakInside: "avoid" }}>
            <h2 style={{ margin: "0 0 10px", fontSize: "17px" }} className="h">{s.heading}</h2>
            <ul style={{ margin: 0, paddingLeft: 0, listStyle: "none", display: "flex", flexDirection: "column", gap: "8px" }}>
              {s.items.map((i) => <li key={i} style={{ display: "flex", gap: "10px", fontSize: "14.5px", fontWeight: 500, lineHeight: 1.55 }}><span aria-hidden="true" style={{ width: "16px", height: "16px", border: "2px solid var(--ink)", borderRadius: "4px", flexShrink: 0, marginTop: "3px" }} />{i}</li>)}
            </ul>
          </section>
        ))}
      </div>
    </>
  );
}
