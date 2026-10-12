/* Ported 1:1 from canvas Home-A partners strip (logo slots stay as placeholders until partners are signed). */
import Link from "next/link";
export function Partners() {
  return (
    <>
<section style={{ borderTop: "1px solid var(--line)", background: "var(--card)" }}>
<div className="wrap" style={{ padding: "22px 0", display: "flex", alignItems: "center", gap: "28px", flexWrap: "wrap" }}>
<span className="adtag" style={{ flexShrink: "0" }}>PARTNERS</span>
<div style={{ flex: "1 1 auto", display: "flex", alignItems: "center", gap: "14px", flexWrap: "wrap" }}>
<span style={{ width: "108px", height: "36px", border: "1px solid var(--line)", borderRadius: "7px", display: "inline-flex", alignItems: "center", justifyContent: "center", fontSize: "9.5px", fontWeight: "800", letterSpacing: ".12em", color: "var(--ph-2)" }}>LOGO</span>
<span style={{ width: "108px", height: "36px", border: "1px solid var(--line)", borderRadius: "7px", display: "inline-flex", alignItems: "center", justifyContent: "center", fontSize: "9.5px", fontWeight: "800", letterSpacing: ".12em", color: "var(--ph-2)" }}>LOGO</span>
<span style={{ width: "108px", height: "36px", border: "1px solid var(--line)", borderRadius: "7px", display: "inline-flex", alignItems: "center", justifyContent: "center", fontSize: "9.5px", fontWeight: "800", letterSpacing: ".12em", color: "var(--ph-2)" }}>LOGO</span>
<span style={{ width: "108px", height: "36px", border: "1px solid var(--line)", borderRadius: "7px", display: "inline-flex", alignItems: "center", justifyContent: "center", fontSize: "9.5px", fontWeight: "800", letterSpacing: ".12em", color: "var(--ph-2)" }}>LOGO</span>
<span style={{ width: "108px", height: "36px", border: "1px solid var(--line)", borderRadius: "7px", display: "inline-flex", alignItems: "center", justifyContent: "center", fontSize: "9.5px", fontWeight: "800", letterSpacing: ".12em", color: "var(--ph-2)" }}>LOGO</span>
</div>
<Link href="/advertise/" style={{ fontSize: "11.5px", fontWeight: "800", letterSpacing: ".08em", color: "var(--red-text)", flexShrink: "0" }}>BECOME A PARTNER &#8594;</Link>
</div>
</section>
    </>
  );
}
