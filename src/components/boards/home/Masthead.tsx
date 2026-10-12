/* Ported 1:1 from canvas board Home-A (Masthead). Keep structure; replace data only. */
export function Masthead({ v }: { v: Record<string, string> }) {
  return (
    <>
<header style={{ background: "var(--card)" }}>
<div className="wrap" style={{ paddingTop: "24px", paddingBottom: "18px" }}>
<div style={{ display: "grid", gridTemplateColumns: "1fr auto 1fr", alignItems: "center", gap: "28px" }}>
<div className="util" style={{ display: "flex", flexDirection: "column", gap: "9px" }}>
<span style={{ fontSize: "10.5px", fontWeight: "800", letterSpacing: ".18em", color: "var(--red-text)" }}>{v.now_wd}</span>
<span className="h" style={{ fontSize: "20px", letterSpacing: "-.035em", color: "var(--ink)" }}>{v.now_date}</span>
<span style={{ display: "flex", gap: "16px", paddingTop: "9px", borderTop: "1px solid var(--line)" }}>
<span style={{ display: "flex", flexDirection: "column", gap: "2px" }}><span className="mono" style={{ fontSize: "9px", fontWeight: "800", letterSpacing: ".14em", color: "var(--grey-3)" }}>SHANGHAI</span><span className="mono" style={{ fontSize: "14px", fontWeight: "800", color: "var(--ink)" }}>{v.clock_sha}</span></span>
<span style={{ display: "flex", flexDirection: "column", gap: "2px" }}><span className="mono" style={{ fontSize: "9px", fontWeight: "800", letterSpacing: ".14em", color: "var(--grey-3)" }}>HAMBURG</span><span className="mono" style={{ fontSize: "14px", fontWeight: "800", color: "var(--ink)" }}>{v.clock_ham}</span></span>
<span style={{ display: "flex", flexDirection: "column", gap: "2px" }}><span className="mono" style={{ fontSize: "9px", fontWeight: "800", letterSpacing: ".14em", color: "var(--grey-3)" }}>HOUSTON</span><span className="mono" style={{ fontSize: "14px", fontWeight: "800", color: "var(--ink)" }}>{v.clock_hou}</span></span>
</span>
</div>
<a href="#" className="mastmid" style={{ display: "flex", alignItems: "center", gap: "13px", justifyContent: "center" }}>
<svg width="54" height="54" viewBox="0 0 120 120" aria-hidden="true"><use href="#w1" width="120" height="120" /></svg>
<span className="h" style={{ fontSize: "54px", letterSpacing: "-.055em" }}>wire mesh</span>
<span className="h" style={{ background: "var(--red)", color: "#FFFFFF", fontSize: "54px", letterSpacing: "-.055em", padding: "4px 14px 10px", borderRadius: "12px" }}>news</span>
</a>
<div style={{ display: "flex", alignItems: "center", gap: "9px", justifyContent: "flex-end" }}>
<button type="button" aria-label="Search" style={{ width: "42px", height: "42px", border: "1.5px solid var(--line)", background: "var(--card)", borderRadius: "999px", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", flexShrink: "0" }}><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--ink)" strokeWidth="2.2" strokeLinecap="round" aria-hidden="true"><circle cx="11" cy="11" r="7" /><path d="M16.5 16.5 21 21" /></svg></button>
<a href="#" className="mastbtn hdbtn" style={{ border: "1.5px solid var(--line)" }}>Sign In</a>
<a href="#" className="mastbtn" style={{ background: "var(--red)", color: "#FFFFFF" }}>Subscribe free</a>
</div>
</div>
<div style={{ marginTop: "20px", display: "flex", flexDirection: "column", alignItems: "center", gap: "0" }}>
<div style={{ width: "100%", display: "flex", alignItems: "center", gap: "20px" }}>
<span style={{ flex: "1 1 0", height: "1px", background: "var(--line)" }}></span>
<span className="h" style={{ fontSize: "15.5px", letterSpacing: "-.01em", color: "var(--ink)", whiteSpace: "nowrap", padding: "0 4px" }}>Independent news, markets and standards for the global wire mesh industry</span>
<span style={{ flex: "1 1 0", height: "1px", background: "var(--line)" }}></span>
</div>
</div>
</div>
</header>
    </>
  );
}
