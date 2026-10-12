/* Ported 1:1 from canvas board Home-A (PrimaryNav). Keep structure; replace data only. */
export function PrimaryNav() {
  return (
    <>
<div className="nav" style={{ borderTop: "1px solid var(--ink)", borderBottom: "3px solid var(--ink)", background: "var(--card)" }}>
<nav className="wrap" style={{ height: "50px", display: "flex", alignItems: "center", gap: "28px", fontSize: "14.5px", fontWeight: "700" }}>
<a href="#" style={{ display: "inline-flex", alignItems: "center", gap: "6px" }}>News<svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3.4" strokeLinecap="round" aria-hidden="true"><path d="m5 9 7 7 7-7" /></svg></a>
<a href="#" style={{ display: "inline-flex", alignItems: "center", gap: "6px" }}>Market Insights<svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3.4" strokeLinecap="round" aria-hidden="true"><path d="m5 9 7 7 7-7" /></svg></a>
<a href="#" style={{ display: "inline-flex", alignItems: "center", gap: "6px" }}>Applications<svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3.4" strokeLinecap="round" aria-hidden="true"><path d="m5 9 7 7 7-7" /></svg></a>
<a href="#" style={{ display: "inline-flex", alignItems: "center", gap: "6px" }}>Technical Guides<svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3.4" strokeLinecap="round" aria-hidden="true"><path d="m5 9 7 7 7-7" /></svg></a>
<a href="#" style={{ display: "inline-flex", alignItems: "center", gap: "6px" }}>Buying Guides<svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3.4" strokeLinecap="round" aria-hidden="true"><path d="m5 9 7 7 7-7" /></svg></a>
<span style={{ width: "1px", height: "18px", background: "var(--line)" }}></span>
<a href="#" style={{ color: "var(--slate)", fontWeight: "500" }}>Directory</a><a href="#" style={{ color: "var(--slate)", fontWeight: "500" }}>Events</a><a href="#" style={{ color: "var(--slate)", fontWeight: "500" }}>Standards</a>
</nav>
</div>
    </>
  );
}
