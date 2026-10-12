"use client";

import { useEffect, useState } from "react";
import { SITE } from "@/lib/site";

function fmt(tz: string, d: Date) {
  return new Intl.DateTimeFormat("en-GB", { hour: "2-digit", minute: "2-digit", hour12: false, timeZone: tz }).format(d);
}

/** Masthead left block: weekday + date and the three city clocks (Home-A). */
export function MastheadClocks({ compact = false }: { compact?: boolean }) {
  const [now, setNow] = useState<Date | null>(null);
  useEffect(() => {
    setNow(new Date());
    const t = setInterval(() => setNow(new Date()), 30_000);
    return () => clearInterval(t);
  }, []);
  const d = now ?? new Date("2026-10-12T06:00:00Z");
  const wd = new Intl.DateTimeFormat("en-GB", { weekday: "long" }).format(d).toUpperCase();
  const date = new Intl.DateTimeFormat("en-GB", { day: "numeric", month: "long", year: "numeric" }).format(d);
  if (compact) {
    return (
      <span className="num text-[10px] font-bold tracking-[0.04em] text-grey" suppressHydrationWarning>
        {SITE.clocks.map((c) => `${c.label.slice(0, 3).toUpperCase()} ${fmt(c.tz, d)}`).join(" · ")}
      </span>
    );
  }
  return (
    <div className="flex flex-col gap-1.5" suppressHydrationWarning>
      <div className="text-[11px] font-extrabold tracking-[0.12em] text-red-text">{wd}</div>
      <div className="text-[13px] font-bold text-fg">{date}</div>
      <div className="num mt-1 flex flex-col gap-0.5 text-[11px] font-bold text-grey">
        {SITE.clocks.map((c) => (
          <span key={c.tz} className="flex items-center gap-2">
            <span className="w-[66px] tracking-[0.08em] text-slate">{c.label.toUpperCase()}</span>
            <span className="text-fg">{fmt(c.tz, d)}</span>
          </span>
        ))}
      </div>
    </div>
  );
}
