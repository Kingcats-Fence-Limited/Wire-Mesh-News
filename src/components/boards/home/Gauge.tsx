/* Ported 1:1 from canvas board Home-A (Gauge). Keep structure; replace data only. */
export function Gauge() {
  return (
    <>
<div style={{ height: "34px", display: "flex", background: "#0E0F14" }} aria-hidden="true">
<svg style={{ flex: "1 1 0", height: "34px", color: "#2E3140" }}><rect width="100%" height="100%" fill="url(#pG1)" /></svg>
<svg style={{ flex: "1 1 0", height: "34px", color: "#343748" }}><rect width="100%" height="100%" fill="url(#pG2)" /></svg>
<svg style={{ flex: "1 1 0", height: "34px", color: "#3A3D50" }}><rect width="100%" height="100%" fill="url(#pG3)" /></svg>
<svg style={{ flex: "1 1 0", height: "34px", color: "#414458" }}><rect width="100%" height="100%" fill="url(#pG4)" /></svg>
<svg style={{ flex: "1 1 0", height: "34px", color: "#484C62" }}><rect width="100%" height="100%" fill="url(#pG5)" /></svg>
</div>
    </>
  );
}
