/* Ported 1:1 from canvas Home-A footer (full version, used on every page per V2.3). */
import Link from "next/link";
import { SocialRow } from "@/components/ui/SocialButton";
import { FOOTER_COLUMNS, SITE } from "@/lib/site";
import { ThemeSwitch } from "./ThemeSwitch";
import { CookieSettingsButton } from "./CookieBanner";
import { FooterCol } from "./FooterCol";
import { FooterNewsletter } from "./FooterNewsletter";

export function Footer() {
  const year = new Date().getFullYear();
  return (
    <>
      <div style={{ height: "4px", background: "var(--red)" }}></div>
      <footer id="site-footer" style={{ background: "var(--surface-dark)", color: "#FFFFFF", position: "relative", overflow: "hidden" }}>
        <svg style={{ position: "absolute", inset: "0", width: "100%", height: "100%", color: "#1E2029" }} aria-hidden="true"><rect width="100%" height="100%" fill="url(#pChain)" /></svg>
        <div style={{ position: "absolute", inset: "0", background: "linear-gradient(180deg, rgba(21,22,28,.72), var(--surface-dark) 72%)" }}></div>
        <span className="h" aria-hidden="true" style={{ position: "absolute", left: "50%", transform: "translateX(-42%)", bottom: "-62px", fontSize: "190px", letterSpacing: "-.06em", color: "#1C1D26", lineHeight: "1", whiteSpace: "nowrap" }}>wire mesh news</span>
        <div className="wrap" style={{ position: "relative", paddingTop: "28px", paddingBottom: "26px", display: "flex", alignItems: "center", justifyContent: "space-between", gap: "32px", borderBottom: "1px solid var(--line-dark)", flexWrap: "wrap" }}>
          <div style={{ maxWidth: "430px" }}>
            <div className="h" style={{ fontSize: "24px", color: "#FFFFFF", marginBottom: "5px" }}>The weekly brief</div>
            <div style={{ fontSize: "13.5px", fontWeight: "500", color: "var(--grey-3)", lineHeight: "1.5" }}>One email a week: news, prices and standards. Unsubscribe any time.</div>
          </div>
          <FooterNewsletter />
        </div>
        <div className="wrap g5" style={{ position: "relative", paddingTop: "30px", paddingBottom: "30px", display: "grid", gridTemplateColumns: "1.5fr 1fr 1fr 1fr 1fr", gap: "30px", borderBottom: "1px solid var(--line-dark)" }}>
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: "9px", marginBottom: "13px" }}>
              <svg width="34" height="34" viewBox="0 0 120 120" aria-hidden="true"><use href="#w1" width="120" height="120" /></svg>
              <span className="h" style={{ fontSize: "22px", letterSpacing: "-.05em", color: "#FFFFFF" }}>wire mesh</span>
              <span className="h" style={{ background: "var(--red)", color: "#FFFFFF", fontSize: "22px", letterSpacing: "-.05em", padding: "3px 7px 5px", borderRadius: "6px" }}>news</span>
            </div>
            <p style={{ margin: "0 0 15px", fontSize: "13.5px", fontWeight: "500", lineHeight: "1.6", color: "var(--grey-3)", maxWidth: "290px" }}>{SITE.tagline}.</p>
            <div style={{ display: "flex", flexDirection: "column", gap: "7px", fontSize: "13.5px", fontWeight: "500", color: "var(--on-dark-2)" }}>
              <a href={`mailto:${SITE.email}`} style={{ color: "var(--on-dark-2)", display: "flex", alignItems: "center", gap: "9px" }}><svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="var(--red-text)" strokeWidth="2" aria-hidden="true"><rect x="2.5" y="4.5" width="19" height="15" rx="2" /><path d="m3 6 9 6 9-6" /></svg>{SITE.email}</a>
              {SITE.phone && <a href={`tel:${SITE.phone.replace(/\s+/g, "")}`} style={{ color: "var(--on-dark-2)", display: "flex", alignItems: "center", gap: "9px" }}><svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="var(--red-text)" strokeWidth="2" strokeLinejoin="round" aria-hidden="true"><path d="M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L15 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2z" /></svg>{SITE.phone}</a>}
              <span style={{ display: "flex", alignItems: "center", gap: "9px" }}><svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="var(--red-text)" strokeWidth="2" strokeLinejoin="round" aria-hidden="true"><path d="M12 21s7-6.3 7-11a7 7 0 1 0-14 0c0 4.7 7 11 7 11z" /><circle cx="12" cy="10" r="2.4" /></svg>{SITE.operator.region}</span>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: "8px", marginTop: "16px" }}><SocialRow /></div>
          </div>
          {FOOTER_COLUMNS.map((col) => (
            <FooterCol key={col.title} title={col.title}>
              {col.links.map((l) => <Link key={l.href} href={l.href} style={{ color: "var(--grey-3)" }}>{l.label}</Link>)}
              {col.title === "Policies" && <CookieSettingsButton style={{ border: 0, background: "transparent", padding: 0, font: "inherit", color: "#FFFFFF", textDecoration: "underline", cursor: "pointer", textAlign: "left" }} />}
            </FooterCol>
          ))}
        </div>
        <div className="wrap" style={{ position: "relative", paddingTop: "16px", paddingBottom: "18px", display: "flex", alignItems: "center", justifyContent: "space-between", gap: "20px", flexWrap: "wrap" }}>
          <span style={{ fontSize: "13px", fontWeight: "500", color: "var(--grey-5)" }}>&#169; {year} Wire Mesh News. All rights reserved. <Link href="/about/" style={{ color: "var(--grey-3)", textDecoration: "underline" }}>About this publication</Link></span>
          <span style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            <span style={{ fontSize: "12.5px", fontWeight: "600", color: "#6E7384" }}>English only</span>
            <ThemeSwitch />
            <a href="#top" aria-label="Back to top" style={{ display: "inline-flex", alignItems: "center", gap: "8px", minHeight: "36px", padding: "0 15px", border: "1px solid var(--line-dark)", borderRadius: "999px", color: "#FFFFFF", fontSize: "12.5px", fontWeight: "800" }}><svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M12 19V5M5 12l7-7 7 7" /></svg>Top</a>
          </span>
        </div>
      </footer>
    </>
  );
}
