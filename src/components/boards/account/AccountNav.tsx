"use client";

/* Account-G left navigation. Highlights the panel in view (and the one in the URL hash),
   so a click visibly lands somewhere. Also gives every preview-only button a short notice
   instead of doing nothing: any button marked data-preview in the account board. */
import { useEffect, useState } from "react";

export type NavItem = { id: string; label: string; count?: string; red?: boolean };

export function AccountNav({ items }: { items: NavItem[] }) {
  const [active, setActive] = useState(items[1]?.id ?? items[0].id);
  const [toast, setToast] = useState<string | null>(null);

  useEffect(() => {
    const fromHash = () => { const h = location.hash.slice(1); if (items.some((i) => i.id === h)) setActive(h); };
    fromHash();
    window.addEventListener("hashchange", fromHash);
    const els = Array.from(new Set(items.map((i) => i.id))).map((id) => document.getElementById(id)).filter(Boolean) as HTMLElement[];
    const io = new IntersectionObserver((entries) => {
      const vis = entries.filter((e) => e.isIntersecting).sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
      if (vis[0]) setActive(vis[0].target.id);
    }, { rootMargin: "-20% 0px -60% 0px" });
    els.forEach((el) => io.observe(el));

    let t: ReturnType<typeof setTimeout> | undefined;
    const onClick = (e: MouseEvent) => {
      const b = (e.target as HTMLElement).closest<HTMLElement>("[data-preview]");
      if (!b) return;
      setToast(`“${b.textContent?.trim()}” works once accounts go live. This is the preview account; nothing is saved.`);
      clearTimeout(t); t = setTimeout(() => setToast(null), 3800);
    };
    document.addEventListener("click", onClick);
    return () => { window.removeEventListener("hashchange", fromHash); io.disconnect(); document.removeEventListener("click", onClick); clearTimeout(t); };
  }, [items]);

  /* "Profile" and "Account settings" both point at the settings panel; light the one clicked. */
  const [clicked, setClicked] = useState<string | null>(null);
  return (
    <>
      <div className="navlist" style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
        {items.map((it) => {
          const on = it.id === active && (clicked ? clicked === it.label : items.find((x) => x.id === active)?.label === it.label);
          return (
            <a key={it.label} href={`#${it.id}`} aria-current={on ? "true" : undefined} onClick={() => { setClicked(it.label); setActive(it.id); }} className={`navi${on ? " on" : ""}`}>
              {it.label}
              {it.count && <span className="ct" style={it.red ? { background: "var(--red)", color: "#FFFFFF" } : undefined}>{it.count}</span>}
            </a>
          );
        })}
      </div>
      <div role="status" aria-live="polite" style={{ position: "fixed", left: "50%", bottom: "28px", transform: "translateX(-50%)", zIndex: 60, maxWidth: "min(92vw, 520px)", background: "var(--ink)", color: "var(--on-ink)", borderRadius: "12px", padding: toast ? "12px 16px" : 0, fontSize: "13px", fontWeight: 600, lineHeight: 1.5, boxShadow: "0 10px 30px rgba(0,0,0,.25)", opacity: toast ? 1 : 0, pointerEvents: "none", transition: "opacity .2s" }}>{toast}</div>
    </>
  );
}
