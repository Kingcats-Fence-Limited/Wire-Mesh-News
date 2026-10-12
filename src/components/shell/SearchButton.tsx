"use client";

import { useEffect, useState } from "react";
import { SearchOverlay } from "@/components/site/SearchLauncher";

/** Canvas magnifier button (42px on the masthead, 44px on inner headers). "/" opens from anywhere. */
export function SearchButton({ size, border }: { size: number; border: string }) {
  const [open, setOpen] = useState(false);
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      const t = e.target as HTMLElement | null;
      const typing = t && (t.tagName === "INPUT" || t.tagName === "TEXTAREA" || t.isContentEditable);
      if (e.key === "/" && !typing && !open) {
        e.preventDefault();
        setOpen(true);
      }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);
  return (
    <>
      <button type="button" className="searchbtn" aria-label={open ? "Close search" : "Search"} aria-expanded={open} onClick={() => setOpen((o) => !o)} style={{ width: size, height: size, border, background: "#FFFFFF", borderRadius: "999px", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", flexShrink: 0 }}>
        {open ? <span style={{ fontSize: "16px", lineHeight: 1 }}>✕</span> : <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--ink)" strokeWidth="2.2" strokeLinecap="round" aria-hidden="true"><circle cx="11" cy="11" r="7" /><path d="M16.5 16.5 21 21" /></svg>}
      </button>
      {open && <SearchOverlay onClose={() => setOpen(false)} />}
    </>
  );
}
