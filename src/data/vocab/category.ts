// AUTO-GENERATED from docs/Wire_Mesh_News_Vocabularies.xlsx — do not edit by hand.
// 名录与产品词表的五个用途大类。
// Used in: Directory 分类卡 · 筛选 Product 维度 · 首页名录版块

export type Category = { code: string; labelEn: string; labelZh: string; sort: string };

export const CATEGORY = [{"code":"fencing","labelEn":"Fencing","labelZh":"围栏","sort":"1"},{"code":"reinforcement","labelEn":"Construction","labelZh":"建筑工程","sort":"2"},{"code":"filtration","labelEn":"Industrial","labelZh":"工业用网","sort":"3"},{"code":"access","labelEn":"Grating","labelZh":"格栅","sort":"4"},{"code":"materials_services","labelEn":"Wire & services","labelZh":"线材与服务","sort":"5"}] as const satisfies readonly Category[];

export type CategoryCode = (typeof CATEGORY)[number]["code"];

export const CATEGORY_BY_CODE: Readonly<Record<string, Category>> = Object.fromEntries(CATEGORY.map((r) => [r.code, r]));
