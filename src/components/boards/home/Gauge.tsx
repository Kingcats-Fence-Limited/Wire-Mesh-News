/* Ported 1:1 from canvas board Home-A (Gauge). Keep structure; replace data only. */
export function Gauge() {
  return (
    <>
<div style={{ height: "34px", display: "flex", background: "#0E0F14" }} aria-hidden="true">
<svg style={{ flex: "1 1 0", height: "34px", color: "#7D8292" }}><rect width="100%" height="100%" fill="url(#pG1)" /></svg>
<svg style={{ flex: "1 1 0", height: "34px", color: "#8A8F9E" }}><rect width="100%" height="100%" fill="url(#pG2)" /></svg>
<svg style={{ flex: "1 1 0", height: "34px", color: "#9A9FB0" }}><rect width="100%" height="100%" fill="url(#pG3)" /></svg>
<svg style={{ flex: "1 1 0", height: "34px", color: "#A7ABB8" }}><rect width="100%" height="100%" fill="url(#pG4)" /></svg>
<svg style={{ flex: "1 1 0", height: "34px", color: "#B4B8C2" }}><rect width="100%" height="100%" fill="url(#pG5)" /></svg>
</div>
    </>
  );
}
