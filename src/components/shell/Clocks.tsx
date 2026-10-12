"use client";

import { useEffect, useState } from "react";

const CITIES = [["SHANGHAI", "Asia/Shanghai"], ["HAMBURG", "Europe/Berlin"], ["HOUSTON", "America/Chicago"]] as const;
const fmt = (tz: string, d: Date) => new Intl.DateTimeFormat("en-GB", { hour: "2-digit", minute: "2-digit", hour12: false, timeZone: tz }).format(d);

/** Canvas Home-A masthead left block: weekday, date, three clocks. Markup is the canvas's. */
export function MastheadDateClocks() {
  const [now, setNow] = useState<Date | null>(null);
  useEffect(() => {
    setNow(new Date());
    const t = setInterval(() => setNow(new Date()), 30_000);
    return () => clearInterval(t);
  }, []);
  const d = now ?? new Date("2026-10-12T06:00:00Z");
  const wd = new Intl.DateTimeFormat("en-GB", { weekday: "long" }).format(d).toUpperCase();
  const date = new Intl.DateTimeFormat("en-GB", { day: "numeric", month: "long", year: "numeric" }).format(d);
  return (
    <div className="util" style={{ display: "flex", flexDirection: "column", gap: "9px" }} suppressHydrationWarning>
      <span style={{ fontSize: "10.5px", fontWeight: "800", letterSpacing: ".18em", color: "var(--red)" }}>{wd}</span>
      <span className="h" style={{ fontSize: "20px", letterSpacing: "-.035em", color: "var(--ink)" }}>{date}</span>
      <span style={{ display: "flex", gap: "16px", paddingTop: "9px", borderTop: "1px solid var(--line)" }}>
        {CITIES.map(([c, tz]) => (
          <span key={c} style={{ display: "flex", flexDirection: "column", gap: "2px" }}>
            <span className="mono" style={{ fontSize: "9px", fontWeight: "800", letterSpacing: ".14em", color: "var(--grey-3)" }}>{c}</span>
            <span className="mono" style={{ fontSize: "14px", fontWeight: "800", color: "var(--ink)" }}>{fmt(tz, d)}</span>
          </span>
        ))}
      </span>
    </div>
  );
}

/** Compact variant used in inner-page headers (Category-B shows a single line). */
export function ClockLine() {
  const [now, setNow] = useState<Date | null>(null);
  useEffect(() => {
    setNow(new Date());
    const t = setInterval(() => setNow(new Date()), 30_000);
    return () => clearInterval(t);
  }, []);
  const d = now ?? new Date("2026-10-12T06:00:00Z");
  return <span className="mono" style={{ fontSize: "10.5px", fontWeight: "700", letterSpacing: ".06em", color: "var(--grey)" }} suppressHydrationWarning>{CITIES.map(([c, tz]) => `${c.slice(0, 3)} ${fmt(tz, d)}`).join(" · ")}</span>;
}

/** Mobile-M date strip: "MONDAY 12 OCT" in red + three clocks. */
export function MobileDateLine() {
  const [now, setNow] = useState<Date | null>(null);
  useEffect(() => {
    setNow(new Date());
    const t = setInterval(() => setNow(new Date()), 30_000);
    return () => clearInterval(t);
  }, []);
  const d = now ?? new Date("2026-10-12T06:00:00Z");
  const wd = new Intl.DateTimeFormat("en-GB", { weekday: "long" }).format(d).toUpperCase();
  const date = new Intl.DateTimeFormat("en-GB", { day: "numeric", month: "short" }).format(d).toUpperCase();
  return (
    <>
      <span style={{ fontSize: "10px", fontWeight: "800", letterSpacing: ".12em", color: "var(--red)" }} suppressHydrationWarning>{wd} {date}</span>
      <span className="mono" style={{ fontSize: "10px", fontWeight: "700", color: "var(--grey)" }} suppressHydrationWarning>{CITIES.map(([c, tz]) => `${c.slice(0, 3).toUpperCase()} ${fmt(tz, d)}`).join(" · ")}</span>
    </>
  );
}
