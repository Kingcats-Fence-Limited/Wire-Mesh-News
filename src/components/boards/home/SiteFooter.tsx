/* Ported 1:1 from canvas board Home-A (SiteFooter). Keep structure; replace data only. */
export function SiteFooter({ v }: { v: Record<string, string> }) {
  return (
    <>
<div style={{ height: "4px", background: "var(--red)" }}></div>
<footer style={{ background: "var(--ink)", color: "#FFFFFF", position: "relative", overflow: "hidden" }}>
<svg style={{ position: "absolute", inset: "0", width: "100%", height: "100%", color: "#1E2029" }} aria-hidden="true"><rect width="100%" height="100%" fill="url(#pChain)" /></svg>
<div style={{ position: "absolute", inset: "0", background: "linear-gradient(180deg, rgba(21,22,28,.72), var(--ink) 72%)" }}></div>
<span className="h" aria-hidden="true" style={{ position: "absolute", right: "-34px", bottom: "-62px", fontSize: "190px", letterSpacing: "-.06em", color: "#1C1D26", lineHeight: "1", whiteSpace: "nowrap" }}>wire mesh news</span>
<div className="wrap" style={{ position: "relative", paddingTop: "28px", paddingBottom: "26px", display: "flex", alignItems: "center", justifyContent: "space-between", gap: "32px", borderBottom: "1px solid var(--line-dark)", flexWrap: "wrap" }}>
<div style={{ maxWidth: "430px" }}>
<div className="h" style={{ fontSize: "24px", color: "#FFFFFF", marginBottom: "5px" }}>The weekly brief</div>
<div style={{ fontSize: "13.5px", fontWeight: "500", color: "var(--grey-3)", lineHeight: "1.5" }}>One email a week: news, prices and standards. Unsubscribe any time.</div>
</div>
<div style={{ display: "flex", gap: "10px", alignItems: "center", flex: "1 1 380px", maxWidth: "480px" }}>
<input type="email" placeholder="you@company.com" aria-label="Email address" style={{ flex: "1 1 auto", minWidth: "0", minHeight: "50px", borderRadius: "999px", border: "0", padding: "0 20px", fontSize: "15px", fontFamily: "inherit", fontWeight: "500" }} />
<button type="button" style={{ minHeight: "50px", border: "0", borderRadius: "999px", background: "var(--red)", color: "#FFFFFF", fontWeight: "800", fontSize: "15px", fontFamily: "inherit", padding: "0 26px", cursor: "pointer", flexShrink: "0" }}>Subscribe</button>
</div>
</div>
<div className="wrap g5" style={{ position: "relative", paddingTop: "30px", paddingBottom: "30px", display: "grid", gridTemplateColumns: "1.5fr 1fr 1fr 1fr 1fr", gap: "30px", borderBottom: "1px solid var(--line-dark)" }}>
<div>
<div style={{ display: "flex", alignItems: "center", gap: "9px", marginBottom: "13px" }}>
<svg width="34" height="34" viewBox="0 0 120 120" aria-hidden="true"><use href="#w1" width="120" height="120" /></svg>
<span className="h" style={{ fontSize: "22px", letterSpacing: "-.05em", color: "#FFFFFF" }}>wire mesh</span>
<span className="h" style={{ background: "var(--red)", color: "#FFFFFF", fontSize: "22px", letterSpacing: "-.05em", padding: "3px 7px 5px", borderRadius: "6px" }}>news</span>
</div>
<p style={{ margin: "0 0 15px", fontSize: "13.5px", fontWeight: "500", lineHeight: "1.6", color: "var(--grey-3)", maxWidth: "290px" }}>Independent news, markets and standards for the global wire mesh industry.</p>
<div style={{ display: "flex", flexDirection: "column", gap: "7px", fontSize: "13.5px", fontWeight: "500", color: "var(--line-2)" }}>
<a href="#" style={{ color: "var(--line-2)", display: "flex", alignItems: "center", gap: "9px" }}><svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="var(--red)" strokeWidth="2" aria-hidden="true"><rect x="2.5" y="4.5" width="19" height="15" rx="2" /><path d="m3 6 9 6 9-6" /></svg>hello@wiremeshnews.com</a>
<span style={{ display: "flex", alignItems: "center", gap: "9px" }}><svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="var(--red)" strokeWidth="2" strokeLinejoin="round" aria-hidden="true"><path d="M12 21s7-6.3 7-11a7 7 0 1 0-14 0c0 4.7 7 11 7 11z" /><circle cx="12" cy="10" r="2.4" /></svg>[注册地占位]</span>
</div>
<div style={{ display: "flex", alignItems: "center", gap: "8px", marginTop: "16px" }}><a href="#" className="soc" aria-label="LinkedIn"><svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" shapeRendering="geometricPrecision"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" /></svg></a><a href="#" className="soc" aria-label="YouTube"><svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" shapeRendering="geometricPrecision"><path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" /></svg></a><a href="#" className="soc" aria-label="X (Twitter)"><svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" shapeRendering="geometricPrecision"><path d="M18.901 1.153h3.68l-8.04 9.19L24 22.846h-7.406l-5.8-7.584-6.638 7.584H.474l8.6-9.83L0 1.154h7.594l5.243 6.932ZM17.61 20.644h2.039L6.486 3.24H4.298Z" /></svg></a><a href="#" className="soc" aria-label="WhatsApp channel"><svg width="17" height="17" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" shapeRendering="geometricPrecision"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" /></svg></a><a href="#" className="soc" aria-label="RSS feed"><svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" shapeRendering="geometricPrecision"><path d="M19.199 24C19.199 13.467 10.533 4.8 0 4.8V0c13.165 0 24 10.835 24 24h-4.801zM3.291 17.415c1.814 0 3.293 1.479 3.293 3.295 0 1.813-1.485 3.29-3.301 3.29C1.47 24 0 22.526 0 20.71s1.475-3.294 3.291-3.294zM15.909 24h-4.665c0-6.169-5.075-11.245-11.244-11.245V8.09c8.727 0 15.909 7.184 15.909 15.91z" /></svg></a></div>
</div>
<div style={{ display: "flex", flexDirection: "column", gap: "10px", fontSize: "13.5px", fontWeight: "500" }}>
<span style={{ fontWeight: "800", fontSize: "11.5px", letterSpacing: ".12em", color: "#FFFFFF", marginBottom: "3px" }}>SECTIONS</span>
<a href="#" style={{ color: "var(--grey-3)" }}>News</a><a href="#" style={{ color: "var(--grey-3)" }}>Market Insights</a><a href="#" style={{ color: "var(--grey-3)" }}>Applications</a><a href="#" style={{ color: "var(--grey-3)" }}>Technical Guides</a><a href="#" style={{ color: "var(--grey-3)" }}>Buying Guides</a><a href="#" style={{ color: "var(--grey-3)" }}>Opinion &amp; Letters</a>
</div>
<div style={{ display: "flex", flexDirection: "column", gap: "10px", fontSize: "13.5px", fontWeight: "500" }}>
<span style={{ fontWeight: "800", fontSize: "11.5px", letterSpacing: ".12em", color: "#FFFFFF", marginBottom: "3px" }}>RESOURCES</span>
<a href="#" style={{ color: "var(--grey-3)" }}>Company Directory</a><a href="#" style={{ color: "var(--grey-3)" }}>Events Calendar</a><a href="#" style={{ color: "var(--grey-3)" }}>Standards Index</a><a href="#" style={{ color: "var(--grey-3)" }}>Market data</a><a href="#" style={{ color: "var(--grey-3)" }}>Topics</a><a href="#" style={{ color: "var(--grey-3)" }}>RSS feed</a>
</div>
<div style={{ display: "flex", flexDirection: "column", gap: "10px", fontSize: "13.5px", fontWeight: "500" }}>
<span style={{ fontWeight: "800", fontSize: "11.5px", letterSpacing: ".12em", color: "#FFFFFF", marginBottom: "3px" }}>PARTICIPATE</span>
<a href="#" style={{ color: "var(--grey-3)" }}>About</a><a href="#" style={{ color: "var(--grey-3)" }}>Contact</a><a href="#" style={{ color: "var(--grey-3)" }}>Submit an Article</a><a href="#" style={{ color: "var(--grey-3)" }}>Submission Guidelines</a><a href="#" style={{ color: "var(--grey-3)" }}>Letters to the editor</a><a href="#" style={{ color: "var(--grey-3)" }}>Advertise &amp; Partner</a>
</div>
<div style={{ display: "flex", flexDirection: "column", gap: "10px", fontSize: "13.5px", fontWeight: "500" }}>
<span style={{ fontWeight: "800", fontSize: "11.5px", letterSpacing: ".12em", color: "#FFFFFF", marginBottom: "3px" }}>POLICIES</span>
<a href="#" style={{ color: "var(--grey-3)" }}>Editorial Policy</a><a href="#" style={{ color: "var(--grey-3)" }}>Comment Policy</a><a href="#" style={{ color: "var(--grey-3)" }}>Corrections</a><a href="#" style={{ color: "var(--grey-3)" }}>Privacy</a><a href="#" style={{ color: "var(--grey-3)" }}>Terms</a><a href="#" style={{ color: "var(--grey-3)" }}>Copyright</a><a href="#" style={{ color: "#FFFFFF", textDecoration: "underline" }}>Cookie settings</a>
</div>
</div>
<div className="wrap" style={{ position: "relative", paddingTop: "16px", paddingBottom: "18px", display: "flex", alignItems: "center", justifyContent: "space-between", gap: "20px", flexWrap: "wrap" }}>
<span style={{ fontSize: "13px", fontWeight: "500", color: "var(--grey-5)" }}>&#169; {v.year} Wire Mesh News. All rights reserved. <a href="#" style={{ color: "var(--grey-3)", textDecoration: "underline" }}>About this publication</a></span>
<span style={{ display: "flex", alignItems: "center", gap: "12px" }}>
<span style={{ fontSize: "12.5px", fontWeight: "600", color: "#6E7384" }}>English only</span>
<span style={{ display: "flex", alignItems: "center", gap: "2px", background: "var(--fg-2)", borderRadius: "999px", padding: "3px" }}>
<button type="button" aria-label="Light theme" aria-pressed="true" style={{ width: "32px", height: "28px", border: "0", borderRadius: "999px", background: "#FFFFFF", color: "var(--ink)", display: "inline-flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}><svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" aria-hidden="true"><circle cx="12" cy="12" r="4.2" /><path d="M12 2.8v2.4M12 18.8v2.4M2.8 12h2.4M18.8 12h2.4M5.5 5.5l1.7 1.7M16.8 16.8l1.7 1.7M18.5 5.5l-1.7 1.7M7.2 16.8l-1.7 1.7" /></svg></button>
<button type="button" aria-label="Dark theme" aria-pressed="false" style={{ width: "32px", height: "28px", border: "0", borderRadius: "999px", background: "transparent", color: "var(--grey-2)", display: "inline-flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}><svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinejoin="round" aria-hidden="true"><path d="M20 14.5A8.5 8.5 0 0 1 9.5 4a8.5 8.5 0 1 0 10.5 10.5z" /></svg></button>
</span>
<a href="#" aria-label="Back to top" style={{ display: "inline-flex", alignItems: "center", gap: "8px", minHeight: "36px", padding: "0 15px", border: "1px solid var(--line-dark)", borderRadius: "999px", color: "#FFFFFF", fontSize: "12.5px", fontWeight: "800" }}><svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M12 20V5M5 12l7-7 7 7" /></svg>Top</a>
</span>
</div>
</footer>
    </>
  );
}
