// AUTO-GENERATED from docs/Wire_Mesh_News_Vocabularies.xlsx — do not edit by hand.
// 制造工艺词表。仅作文章内部标签，不对外筛选，不进企业资料。
// Used in: 文章标签（内部）

export type Process = { code: string; labelEn: string; labelZh: string };

export const PROCESS = [{"code":"wire_drawing","labelEn":"Wire drawing","labelZh":"拉丝"},{"code":"annealing","labelEn":"Annealing","labelZh":"退火"},{"code":"galvanizing","labelEn":"Galvanizing","labelZh":"镀锌"},{"code":"weaving","labelEn":"Weaving","labelZh":"编织"},{"code":"crimping","labelEn":"Crimping","labelZh":"轧花"},{"code":"welding","labelEn":"Resistance welding","labelZh":"电阻焊"},{"code":"knitting","labelEn":"Knitting","labelZh":"针织"},{"code":"expanding","labelEn":"Expanding","labelZh":"拉伸（钢板网）"},{"code":"perforating","labelEn":"Perforating / punching","labelZh":"冲孔"},{"code":"press_locking","labelEn":"Press-locking (grating)","labelZh":"压锁（格板）"},{"code":"bending_forming","labelEn":"Bending & forming","labelZh":"折弯成型"},{"code":"cutting","labelEn":"Cutting & slitting","labelZh":"裁切分条"},{"code":"coating","labelEn":"Coating & painting","labelZh":"涂装"},{"code":"assembly","labelEn":"Assembly & fabrication","labelZh":"组装加工"}] as const satisfies readonly Process[];

export type ProcessCode = (typeof PROCESS)[number]["code"];

export const PROCESS_BY_CODE: Readonly<Record<string, Process>> = Object.fromEntries(PROCESS.map((r) => [r.code, r]));
