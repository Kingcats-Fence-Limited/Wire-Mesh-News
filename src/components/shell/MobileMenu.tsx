"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import type { MenuData } from "./MegaNav";
import { SocialRow } from "@/components/ui/SocialButton";

/* Canvas Mobile-M ②: full-screen dark drawer with accordion sections, resource chips, two buttons. Shown < 980px (.mobtrig). */
export function MobileMenu({ data }: { data: MenuData }) {
  const [open, setOpen] = useState(false);
  const [sec, setSec] = useState<string | null>(null);
  useEffect(() => {
    document.documentElement.style.overflow = open ? "hidden" : "";
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("keydown", onKey);
      document.documentElement.style.overflow = "";
    };
  }, [open]);
  const chev = (on: boolean) => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={on ? "var(--red)" : "var(--grey-5)"} strokeWidth="3" strokeLinecap="round" aria-hidden="true" style={{ transform: on ? "rotate(180deg)" : undefined }}><path d="m5 9 7 7 7-7" /></svg>
  );
  return (
    <>
      <button type="button" className="mobtrig" aria-label="Open menu" aria-expanded={open} onClick={() => setOpen(true)} style={{ width: "44px", height: "44px", border: 0, background: "transparent", display: "none", alignItems: "center", justifyContent: "center", cursor: "pointer", color: "var(--ink)" }}>
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" aria-hidden="true"><path d="M4 7h16M4 12h16M4 17h16" /></svg>
      </button>
      {open && (
        <div role="dialog" aria-modal="true" aria-label="Menu" style={{ position: "fixed", inset: 0, zIndex: 90, background: "var(--ink)", color: "#FFFFFF", display: "flex", flexDirection: "column" }}>
          <div style={{ height: "52px", display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 14px", borderBottom: "1px solid var(--line-dark)", flexShrink: 0 }}>
            <span style={{ display: "flex", alignItems: "center", gap: "5px" }}><svg width="22" height="22" viewBox="0 0 120 120" aria-hidden="true" style={{ color: "#FFFFFF" }}><use href="#w1" width="120" height="120" /></svg><span style={{ fontSize: "15px", letterSpacing: "-.05em" }} className="h">wire mesh</span><span style={{ background: "var(--red)", color: "#FFFFFF", fontSize: "15px", letterSpacing: "-.05em", padding: "1px 5px 2px", borderRadius: "4px" }} className="h">news</span></span>
            <button type="button" onClick={() => setOpen(false)} aria-label="Close menu" style={{ width: "34px", height: "34px", border: "1px solid var(--line-dark)", borderRadius: "999px", background: "transparent", color: "#FFFFFF", display: "inline-flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}>&#10005;</button>
          </div>
          <div style={{ padding: "14px", overflowY: "auto", flex: "1 1 auto" }}>
            <Link href="/search/" onClick={() => setOpen(false)} style={{ display: "flex", alignItems: "center", gap: "9px", background: "var(--fg-2)", borderRadius: "999px", padding: "0 14px", minHeight: "44px", marginBottom: "14px", color: "var(--grey)" }}><svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="var(--grey)" strokeWidth="2.3" strokeLinecap="round" aria-hidden="true"><circle cx="11" cy="11" r="7" /><path d="M16.5 16.5 21 21" /></svg><span style={{ fontSize: "14px", fontWeight: 600 }}>Search articles, standards, companies…</span></Link>
            <div style={{ display: "flex", flexDirection: "column" }}>
              {data.sections.map((s) => (
                <div key={s.code} style={{ borderBottom: "1px solid var(--line-dark)" }}>
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "13px 0" }}>
                    <Link href={s.href} onClick={() => setOpen(false)} style={{ fontSize: "19px", color: "#FFFFFF" }} className="h">{s.label}</Link>
                    <button type="button" aria-expanded={sec === s.code} aria-label={`Expand ${s.label}`} onClick={() => setSec(sec === s.code ? null : s.code)} style={{ width: "44px", height: "34px", border: 0, background: "transparent", display: "inline-flex", alignItems: "center", justifyContent: "flex-end", cursor: "pointer" }}>{chev(sec === s.code)}</button>
                  </div>
                  {sec === s.code && (
                    <div style={{ padding: "0 0 12px", display: "flex", flexDirection: "column", gap: "9px" }}>
                      {s.subs.map((x) => <Link key={x.href} href={x.href} onClick={() => setOpen(false)} style={{ color: "var(--grey-3)", fontSize: "13.5px", fontWeight: "600", paddingLeft: "2px" }}>{x.label}</Link>)}
                    </div>
                  )}
                </div>
              ))}
            </div>
            <div style={{ display: "flex", gap: "7px", flexWrap: "wrap", marginTop: "14px" }}>
              {[["Directory", "/directory/"], ["Events", "/events/"], ["Standards", "/standards/"], ["Market data", "/market-data/"], ["Letters", "/letters/"], ["Topics", "/topics/"]].map(([l, h]) => (
                <Link key={h} href={h} onClick={() => setOpen(false)} style={{ border: "1px solid var(--line-dark)", borderRadius: "999px", padding: "8px 13px", fontSize: "12.5px", fontWeight: "700", color: "var(--line-2)" }}>{l}</Link>
              ))}
            </div>
            <div style={{ display: "flex", gap: "9px", marginTop: "16px" }}>
              <Link href="/subscribe/" onClick={() => setOpen(false)} style={{ flex: "1 1 0", display: "inline-flex", alignItems: "center", justifyContent: "center", minHeight: "44px", borderRadius: "999px", background: "var(--red)", color: "#FFFFFF", fontSize: "14px", fontWeight: "800" }}>Subscribe free</Link>
              <Link href="/signin/" onClick={() => setOpen(false)} style={{ flex: "1 1 0", display: "inline-flex", alignItems: "center", justifyContent: "center", minHeight: "44px", borderRadius: "999px", background: "transparent", border: "1.5px solid var(--line-dark)", color: "#FFFFFF", fontSize: "14px", fontWeight: "800" }}>Sign In</Link>
            </div>
            <div style={{ marginTop: "22px" }}>
              <div className="mono" style={{ fontSize: "9.5px", fontWeight: 800, letterSpacing: ".14em", color: "var(--grey-5)", marginBottom: "10px" }}>FOLLOW</div>
              <SocialRow size={38} />
            </div>
            <div style={{ display: "flex", gap: "16px", flexWrap: "wrap", marginTop: "18px", fontSize: "12.5px", fontWeight: 700, color: "var(--grey-3)" }}>
              {[["About", "/about/"], ["Contact", "/contact/"], ["Submit an Article", "/submit/"], ["Advertise", "/advertise/"]].map(([l, h]) => <Link key={h} href={h} onClick={() => setOpen(false)} style={{ color: "var(--grey-3)" }}>{l}</Link>)}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
