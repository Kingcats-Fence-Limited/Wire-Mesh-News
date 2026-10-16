"use client";

/* Welded mesh panel weight and cost calculator. Pure arithmetic in the browser: steel weight
   from wire lengths, zinc from the wire surface, cost from the user's own prices. */
import { useState } from "react";

const num = (v: string) => Number(v.replace(",", ".")) || 0;
const fmt = (n: number, d = 2) => (Number.isFinite(n) ? n.toLocaleString("en-GB", { maximumFractionDigits: d, minimumFractionDigits: d }) : "—");

export function MeshCalculator() {
  const [v, setV] = useState({ h: "2030", w: "2500", sh: "50", sv: "200", dh: "4.0", dv: "4.0", zinc: "60", steel: "620", coat: "180", freight: "2800", perBox: "900" });
  const set = (k: keyof typeof v) => (e: React.ChangeEvent<HTMLInputElement>) => setV({ ...v, [k]: e.target.value });
  const H = num(v.h) / 1000, W = num(v.w) / 1000, sh = num(v.sh) / 1000, sv = num(v.sv) / 1000;
  const nV = sh > 0 ? Math.floor(W / sh + 1e-9) + 1 : 0; // vertical wires across the width
  const nH = sv > 0 ? Math.floor(H / sv + 1e-9) + 1 : 0; // horizontal wires up the height
  const dV = num(v.dv) / 1000, dH = num(v.dh) / 1000;
  const lenV = nV * H, lenH = nH * W;
  const steelKg = 7850 * (Math.PI / 4) * (dV * dV * lenV + dH * dH * lenH);
  const area = Math.PI * (dV * lenV + dH * lenH); // m² of wire surface
  const zincKg = (num(v.zinc) * area) / 1000;
  const totalKg = steelKg + zincKg;
  const costSteel = (steelKg / 1000) * num(v.steel), costCoat = (totalKg / 1000) * num(v.coat);
  const freight = num(v.perBox) > 0 ? num(v.freight) / num(v.perBox) : 0;
  const perPanel = costSteel + costCoat + freight;
  const field = (k: keyof typeof v, label: string, unit: string) => (
    <label style={{ display: "flex", flexDirection: "column", gap: "4px", fontSize: "11.5px", fontWeight: 800, letterSpacing: ".06em", color: "var(--slate)" }}>{label}
      <span style={{ display: "flex", alignItems: "center", gap: "6px" }}><input inputMode="decimal" className="inp" style={{ width: "100%", borderRadius: "10px" }} value={v[k]} onChange={set(k)} /><span className="meta" style={{ fontWeight: 700, minWidth: "48px" }}>{unit}</span></span>
    </label>
  );
  return (
    <div style={{ display: "grid", gridTemplateColumns: "minmax(0,1.2fr) minmax(0,1fr)", gap: "24px" }} className="cols">
      <div style={{ display: "grid", gridTemplateColumns: "repeat(2, minmax(0,1fr))", gap: "12px" }}>
        {field("h", "PANEL HEIGHT", "mm")}{field("w", "PANEL WIDTH", "mm")}
        {field("sh", "VERTICAL WIRE CENTRES", "mm")}{field("sv", "HORIZONTAL WIRE CENTRES", "mm")}
        {field("dv", "VERTICAL WIRE Ø", "mm")}{field("dh", "HORIZONTAL WIRE Ø", "mm")}
        {field("zinc", "ZINC COATING", "g/m²")}{field("steel", "WIRE ROD / WIRE PRICE", "per t")}
        {field("coat", "GALVANIZING / COATING COST", "per t")}{field("freight", "FREIGHT PER CONTAINER", "")}
        {field("perBox", "PANELS PER CONTAINER", "pcs")}
      </div>
      <div className="row" style={{ alignSelf: "start", gap: "10px" }} aria-live="polite">
        <span className="meta" style={{ fontWeight: 800, letterSpacing: ".08em" }}>PER PANEL</span>
        <div style={{ display: "flex", justifyContent: "space-between" }}><span>Wires</span><b>{nV} vertical × {nH} horizontal</b></div>
        <div style={{ display: "flex", justifyContent: "space-between" }}><span>Steel weight</span><b>{fmt(steelKg)} kg</b></div>
        <div style={{ display: "flex", justifyContent: "space-between" }}><span>Zinc</span><b>{fmt(zincKg, 3)} kg</b></div>
        <div style={{ display: "flex", justifyContent: "space-between" }}><span>Weight per m² of panel</span><b>{fmt(H * W ? totalKg / (H * W) : 0)} kg</b></div>
        <div style={{ borderTop: "1px solid var(--line)", paddingTop: "10px", display: "flex", justifyContent: "space-between" }}><span>Wire cost</span><b>{fmt(costSteel)}</b></div>
        <div style={{ display: "flex", justifyContent: "space-between" }}><span>Coating cost</span><b>{fmt(costCoat)}</b></div>
        <div style={{ display: "flex", justifyContent: "space-between" }}><span>Freight share</span><b>{fmt(freight)}</b></div>
        <div style={{ borderTop: "2px solid var(--ink)", paddingTop: "10px", display: "flex", justifyContent: "space-between", fontSize: "18px" }}><span className="h">Material + freight</span><b>{fmt(perPanel)}</b></div>
        <div style={{ display: "flex", justifyContent: "space-between" }}><span>Per metre of fence</span><b>{fmt(W ? perPanel / W : 0)}</b></div>
        <span className="meta">Your currency, your prices. Excludes welding, labour, posts, packing, margin and duties. Steel density 7,850 kg/m³; zinc mass from the wire surface area.</span>
      </div>
    </div>
  );
}
