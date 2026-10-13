// AUTO-GENERATED from docs/Wire_Mesh_News_Vocabularies.xlsx — do not edit by hand.
// 标准主题分组。与 category 共用同一套五大类，保证全站同一套词表。
// Used in: Standards Index SUBJECT 筛选

export type StandardSubject = { code: string; labelEn: string; labelZh: string };

export const STANDARD_SUBJECT = [{"code":"fencing","labelEn":"Perimeter & Security","labelZh":"周界与安防"},{"code":"reinforcement","labelEn":"Infrastructure & Geotechnical","labelZh":"基础设施与岩土"},{"code":"filtration","labelEn":"Filtration & Process","labelZh":"过滤与工艺"},{"code":"access","labelEn":"Architectural & Structural","labelZh":"建筑与结构"},{"code":"materials_services","labelEn":"Materials & Services","labelZh":"材料与服务"}] as const satisfies readonly StandardSubject[];

export type StandardSubjectCode = (typeof STANDARD_SUBJECT)[number]["code"];

export const STANDARD_SUBJECT_BY_CODE: Readonly<Record<string, StandardSubject>> = Object.fromEntries(STANDARD_SUBJECT.map((r) => [r.code, r]));
