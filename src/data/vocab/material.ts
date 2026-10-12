// AUTO-GENERATED from docs/Wire_Mesh_News_Vocabularies.xlsx — do not edit by hand.
// 材质词表。只到类别，不到具体牌号。
// Used in: Claim 编辑台 Materials · Directory More filters MATERIAL（按 group 聚合为 Carbon steel / Stainless / Other alloys） · 文章材料标签

export type Material = { code: string; labelEn: string; labelZh: string; group: string };

export const MATERIAL = [{"code":"low_carbon","labelEn":"Low-carbon steel","labelZh":"低碳钢","group":"carbon_steel"},{"code":"high_tensile","labelEn":"High-tensile steel","labelZh":"高强度钢","group":"carbon_steel"},{"code":"spring_steel","labelEn":"Spring steel","labelZh":"弹簧钢","group":"carbon_steel"},{"code":"ss_304","labelEn":"Stainless steel 304 / 304L","labelZh":"不锈钢 304","group":"stainless"},{"code":"ss_316","labelEn":"Stainless steel 316 / 316L","labelZh":"不锈钢 316","group":"stainless"},{"code":"ss_duplex","labelEn":"Duplex stainless","labelZh":"双相不锈钢","group":"stainless"},{"code":"ss_other","labelEn":"Other stainless grades","labelZh":"其他不锈钢","group":"stainless"},{"code":"galfan","labelEn":"Zn-Al coated (Galfan / Zn-5Al / Zn-10Al)","labelZh":"锌铝合金镀层","group":"coated_steel"},{"code":"aluminium","labelEn":"Aluminium & alloys","labelZh":"铝及铝合金","group":"other_alloys"},{"code":"copper_brass","labelEn":"Copper, brass & bronze","labelZh":"铜、黄铜、青铜","group":"other_alloys"},{"code":"nickel_alloy","labelEn":"Nickel alloys (Monel, Inconel, Hastelloy)","labelZh":"镍基合金","group":"other_alloys"},{"code":"titanium","labelEn":"Titanium","labelZh":"钛","group":"other_alloys"},{"code":"frp","labelEn":"FRP / GRP composite","labelZh":"玻璃钢","group":"non_metal"},{"code":"polymer","labelEn":"Polymer / plastic mesh","labelZh":"塑料网","group":"non_metal"}] as const satisfies readonly Material[];

export type MaterialCode = (typeof MATERIAL)[number]["code"];

export const MATERIAL_BY_CODE: Readonly<Record<string, Material>> = Object.fromEntries(MATERIAL.map((r) => [r.code, r]));
