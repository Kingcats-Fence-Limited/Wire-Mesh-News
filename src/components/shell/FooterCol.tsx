"use client";

import { useEffect, useState } from "react";

/* Mobile-M ⑨: footer link columns collapse to an accordion on phones; open on wider screens. */
export function FooterCol({ title, children }: { title: string; children: React.ReactNode }) {
  const [open, setOpen] = useState(true);
  useEffect(() => {
    const mq = window.matchMedia("(max-width:600px)");
    const apply = () => setOpen(!mq.matches);
    apply();
    mq.addEventListener("change", apply);
    return () => mq.removeEventListener("change", apply);
  }, []);
  return (
    <details className="fcol" open={open} onToggle={(e) => setOpen((e.currentTarget as HTMLDetailsElement).open)}>
      <summary><span>{title.toUpperCase()}</span><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" aria-hidden="true"><path d="m5 9 7 7 7-7" /></svg></summary>
      <div className="fcolbody">{children}</div>
    </details>
  );
}
