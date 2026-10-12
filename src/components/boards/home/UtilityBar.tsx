/* Ported 1:1 from canvas board Home-A (UtilityBar). Keep structure; replace data only. */
export function UtilityBar({ v }: { v: Record<string, string> }) {
  return (
    <>
<div style={{ background: "var(--surface-dark)", color: "#FFFFFF" }}>
<div className="wrap" style={{ height: "40px", display: "flex", alignItems: "center", gap: "16px", fontSize: "12.5px", fontWeight: "500" }}>
<span className="mono" style={{ color: "#FFFFFF", flexShrink: "0", fontWeight: "700" }}>{v.week_n}<span style={{ color: "var(--grey-5)", fontWeight: "500" }}> NEW THIS WEEK</span></span>
<span style={{ width: "1px", height: "14px", background: "var(--line-dark)", flexShrink: "0" }}></span>
<span style={{ background: "var(--red)", fontSize: "10px", fontWeight: "800", letterSpacing: ".14em", padding: "3px 8px", borderRadius: "3px", flexShrink: "0" }}>LIVE</span>
<a href="#" style={{ color: "#FFFFFF", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", minWidth: "0" }}>EU raises anti-dumping duty on imported welded mesh panels to [N]%</a>
<div className="util" style={{ marginLeft: "auto", display: "flex", alignItems: "center", gap: "14px", flexShrink: "0" }}>
<a href="#" style={{ color: "var(--grey-3)" }}>Newsletter</a><a href="#" style={{ color: "var(--grey-3)" }}>RSS</a>
<span style={{ width: "1px", height: "14px", background: "var(--line-dark)" }}></span>
<div style={{ display: "flex", alignItems: "center", gap: "2px", background: "var(--surface-dark-2)", borderRadius: "999px", padding: "3px" }}>
<button type="button" aria-label="Light theme" aria-pressed="true" style={{ width: "30px", height: "26px", border: "0", borderRadius: "999px", background: "var(--card)", color: "var(--ink)", display: "inline-flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" aria-hidden="true"><circle cx="12" cy="12" r="4.2" /><path d="M12 2.8v2.4M12 18.8v2.4M2.8 12h2.4M18.8 12h2.4M5.5 5.5l1.7 1.7M16.8 16.8l1.7 1.7M18.5 5.5l-1.7 1.7M7.2 16.8l-1.7 1.7" /></svg></button>
<button type="button" aria-label="Dark theme" aria-pressed="false" style={{ width: "30px", height: "26px", border: "0", borderRadius: "999px", background: "transparent", color: "var(--grey-2)", display: "inline-flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinejoin="round" aria-hidden="true"><path d="M20 14.5A8.5 8.5 0 0 1 9.5 4a8.5 8.5 0 1 0 10.5 10.5z" /></svg></button>
</div>
</div>
</div>
</div>
    </>
  );
}
