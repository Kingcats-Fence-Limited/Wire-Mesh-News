// AUTO-GENERATED from docs/Wire_Mesh_News_Vocabularies.xlsx — do not edit by hand.
// 表面处理词表。
// Used in: 文章标签 · 定向联系表单 SURFACE TREATMENT · Claim 编辑台

export type SurfaceTreatment = { code: string; labelEn: string; labelZh: string };

export const SURFACE_TREATMENT = [{"code":"hdg","labelEn":"Hot-dip galvanized (after fabrication)","labelZh":"热浸镀锌（成品后）"},{"code":"pre_galv","labelEn":"Pre-galvanized (galvanized before welding)","labelZh":"预镀锌"},{"code":"electro_galv","labelEn":"Electro-galvanized","labelZh":"电镀锌"},{"code":"galfan_coat","labelEn":"Zn-Al alloy coated","labelZh":"锌铝合金镀层"},{"code":"pvc","labelEn":"PVC coated","labelZh":"PVC 包塑"},{"code":"powder","labelEn":"Powder coated","labelZh":"静电喷涂"},{"code":"pe","labelEn":"PE coated","labelZh":"PE 涂层"},{"code":"painted","labelEn":"Painted / primed","labelZh":"油漆 / 底漆"},{"code":"black","labelEn":"Black / uncoated","labelZh":"黑丝 / 无涂层"},{"code":"passivated","labelEn":"Pickled & passivated (stainless)","labelZh":"酸洗钝化"},{"code":"anodized","labelEn":"Anodized (aluminium)","labelZh":"阳极氧化"}] as const satisfies readonly SurfaceTreatment[];

export type SurfaceTreatmentCode = (typeof SURFACE_TREATMENT)[number]["code"];

export const SURFACE_TREATMENT_BY_CODE: Readonly<Record<string, SurfaceTreatment>> = Object.fromEntries(SURFACE_TREATMENT.map((r) => [r.code, r]));
