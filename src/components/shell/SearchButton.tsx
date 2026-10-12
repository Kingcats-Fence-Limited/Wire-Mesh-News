"use client";

import { useEffect, useRef, useState } from "react";
import { SearchOverlay } from "./SearchOverlay";

/** Canvas magnifier button (42px on the masthead, 44px on inner headers). "/" opens from anywhere; Esc returns focus here. */
export function SearchButton({ size, border }: { size: number; border: string }) {
  const [open, setOpen] = useState(false);
  const [top, setTop] = useState(0);
  const btn = useRef<HTMLButtonElement>(null);

  function openAt() {
    const header = btn.current?.closest("header");
    const bottom = header ? header.getBoundingClientRect().bottom : 0;
    setTop(Math.max(0, Math.round(bottom)));
    setOpen(true);
  }
  function close() {
    setOpen(false);
    btn.current?.focus();
  }

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      const t = e.target as HTMLElement | null;
      const typing = t && (t.tagName === "INPUT" || t.tagName === "TEXTAREA" || t.tagName === "SELECT" || t.isContentEditable);
      if (e.key === "/" && !typing && !open) {
        e.preventDefault();
        openAt();
      }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  return (
    <>
      <button ref={btn} type="button" className="searchbtn" aria-label={open ? "Close search" : "Search"} aria-expanded={open} onClick={() => (open ? close() : openAt())} style={{ width: size, height: size, border, background: open ? "var(--ink)" : "#FFFFFF", color: open ? "#FFFFFF" : "var(--ink)", borderRadius: "999px", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", flexShrink: 0, position: "relative", zIndex: open ? 91 : undefined }}>
        {open ? (
          <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" aria-hidden="true"><path d="M5 5l14 14M19 5L5 19" /></svg>
        ) : (
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--ink)" strokeWidth="2.2" strokeLinecap="round" aria-hidden="true"><circle cx="11" cy="11" r="7" /><path d="M16.5 16.5 21 21" /></svg>
        )}
      </button>
      {open && <SearchOverlay onClose={close} top={top} />}
    </>
  );
}
