"use client";

/* Company-plan extras on a public profile: catalogue, video, contacts (approved by the editor). */
import { useEffect, useState } from "react";
import { AUTH_LIVE } from "@/lib/live";

type X = { catalogue: boolean; video: string | null; contacts: { name: string; role: string; email: string; phone: string }[] };
const embed = (u: string) => {
  const yt = u.match(/(?:v=|youtu\.be\/)([\w-]{6,})/)?.[1];
  if (yt) return `https://www.youtube-nocookie.com/embed/${yt}`;
  const vm = u.match(/vimeo\.com\/(\d{5,})/)?.[1];
  return vm ? `https://player.vimeo.com/video/${vm}?dnt=1` : null;
};

export function CompanyExtras({ slug, name }: { slug: string; name: string }) {
  const [x, setX] = useState<X | null>(null);
  useEffect(() => {
    if (!AUTH_LIVE) return;
    void fetch("/api/track/company/", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ slug }), keepalive: true }).catch(() => {});
    fetch(`/api/directory/extras/${encodeURIComponent(slug)}/`).then((r) => (r.ok ? r.json() : null)).then((j: { extras: X | null } | null) => setX(j?.extras ?? null)).catch(() => {});
  }, [slug]);
  if (!x || (!x.catalogue && !x.video && !x.contacts.length)) return null;
  const src = x.video ? embed(x.video) : null;
  return (
    <section style={{ marginTop: "40px" }} aria-labelledby="co-extras">
      <div style={{ display: "flex", alignItems: "center", gap: "14px", marginBottom: "16px" }}><h2 id="co-extras" style={{ margin: 0, fontSize: "28px" }} className="h">From the company</h2><span style={{ flex: "1 1 0", height: "2px", background: "var(--ink)" }} /><span className="meta" style={{ fontSize: "11.5px", fontWeight: 800, letterSpacing: ".08em" }}>SUPPLIED BY {name.toUpperCase()} · REVIEWED BY EDITORS</span></div>
      <div style={{ display: "grid", gridTemplateColumns: src ? "minmax(0,1.4fr) minmax(0,1fr)" : "1fr", gap: "22px" }} className="cols">
        {src && <div style={{ position: "relative", aspectRatio: "16/9", borderRadius: "14px", overflow: "hidden", background: "var(--ink)" }}><iframe src={src} title={`${name} video`} loading="lazy" allow="encrypted-media; picture-in-picture; fullscreen" referrerPolicy="strict-origin-when-cross-origin" style={{ position: "absolute", inset: 0, width: "100%", height: "100%", border: 0 }} /></div>}
        <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
          {x.catalogue && <a href={`/api/directory/extras/${encodeURIComponent(slug)}/catalogue/`} target="_blank" rel="noopener" style={{ display: "inline-flex", alignItems: "center", gap: "8px", alignSelf: "flex-start", background: "var(--ink)", color: "var(--on-ink)", fontWeight: 800, fontSize: "14px", padding: "0 20px", minHeight: "46px", borderRadius: "999px" }}>Product catalogue (PDF)</a>}
          {x.contacts.map((c) => (
            <div key={c.name + c.email} style={{ border: "1px solid var(--line)", borderRadius: "12px", padding: "12px 14px" }}>
              <b style={{ fontSize: "14.5px" }}>{c.name}</b>{c.role && <span className="meta"> · {c.role}</span>}
              <div style={{ fontSize: "13.5px", marginTop: "4px", display: "flex", gap: "12px", flexWrap: "wrap" }}>{c.email && <a href={`mailto:${c.email}`} style={{ color: "var(--red-text)", fontWeight: 700 }}>{c.email}</a>}{c.phone && <a href={`tel:${c.phone.replace(/[^\d+]/g, "")}`} style={{ fontWeight: 700 }}>{c.phone}</a>}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
