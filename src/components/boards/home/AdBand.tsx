/* Ported 1:1 from canvas Home-A 970×120 ad band. */
export function AdBand() {
  return (
    <>
<section style={{ background: "var(--paper)", borderTop: "1px solid var(--line-soft)", borderBottom: "1px solid var(--line-soft)" }}>
<div className="wrap" style={{ paddingTop: "22px", paddingBottom: "22px" }}>
<div className="adtag" style={{ marginBottom: "8px", justifyContent: "center", display: "flex" }}>ADVERTISEMENT</div>
<div className="ad" style={{ height: "120px", maxWidth: "970px", margin: "0 auto", background: "#FFFFFF" }}>[ 970 &#215; 120 ]</div>
</div>
</section>
    </>
  );
}
