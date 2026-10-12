"use client";

import Link from "next/link";
import { useEffect, useId, useRef, useState } from "react";

export type DropItem = { label: string; href: string; on: boolean; count?: number };
const EVT = "wmn:dropmenu";

/* Black tool-bar dropdown (Directory-D / Standards-Y): one open at a time, outside click and Esc close, items are links (no page jump). */
export function DropMenu({ label, items, note, className = "fchip", minWidth = 260 }: { label: string; items: DropItem[]; note?: string; className?: string; minWidth?: number }) {
  const [open, setOpen] = useState(false);
  const id = useId();
  const root = useRef<HTMLDivElement>(null);
  const n = items.filter((i) => i.on).length;
  useEffect(() => {
    if (!open) return;
    window.dispatchEvent(new CustomEvent(EVT, { detail: id }));
    const onOther = (e: Event) => { if ((e as CustomEvent).detail !== id) setOpen(false); };
    const onDoc = (e: MouseEvent) => { if (root.current && !root.current.contains(e.target as Node)) setOpen(false); };
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") setOpen(false); };
    window.addEventListener(EVT, onOther); document.addEventListener("mousedown", onDoc); document.addEventListener("keydown", onKey);
    return () => { window.removeEventListener(EVT, onOther); document.removeEventListener("mousedown", onDoc); document.removeEventListener("keydown", onKey); };
  }, [open, id]);
  return (
    <div ref={root} style={{ position: "relative" }}>
      <button type="button" className={`${className}${open ? " open" : ""}`} aria-expanded={open} aria-haspopup="menu" onClick={() => setOpen((o) => !o)}>
        {label}{n > 0 && <span style={{ color: "var(--grey)", fontWeight: 800 }} className="mono">{n}</span>}
        <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3.2" strokeLinecap="round" aria-hidden="true"><path d="m5 8 7 7 7-7" /></svg>
      </button>
      {open && (
        <div role="menu" className="ddmenu" style={{ minWidth }}>
          {note && <div className="ddnote">{note}</div>}
          {items.map((it) => (
            <Link key={it.href} href={it.href} scroll={false} role="menuitemradio" aria-checked={it.on} className={`dditem${it.on ? " on" : ""}`} onClick={() => setOpen(false)}>
              <span className="sq" aria-hidden="true" /><span style={{ flex: "1 1 auto" }}>{it.label}</span>{it.count !== undefined && <span className="mono c">{it.count}</span>}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
