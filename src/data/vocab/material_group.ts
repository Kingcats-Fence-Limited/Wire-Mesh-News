// AUTO-GENERATED from docs/Wire_Mesh_News_Vocabularies.xlsx — do not edit by hand.
// 筛选用的材质粗分组（Directory More filters 用这一层，不用细表）。
// Used in: Directory More filters

export type MaterialGroup = { code: string; labelEn: string; labelZh: string };

export const MATERIAL_GROUP = [{"code":"carbon_steel","labelEn":"Carbon steel","labelZh":"碳钢"},{"code":"stainless","labelEn":"Stainless","labelZh":"不锈钢"},{"code":"coated_steel","labelEn":"Coated steel","labelZh":"镀层钢"},{"code":"other_alloys","labelEn":"Other alloys","labelZh":"其他合金"},{"code":"non_metal","labelEn":"Non-metal","labelZh":"非金属"}] as const satisfies readonly MaterialGroup[];

export type MaterialGroupCode = (typeof MATERIAL_GROUP)[number]["code"];

export const MATERIAL_GROUP_BY_CODE: Readonly<Record<string, MaterialGroup>> = Object.fromEntries(MATERIAL_GROUP.map((r) => [r.code, r]));
