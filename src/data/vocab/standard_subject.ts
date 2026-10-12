// AUTO-GENERATED from docs/Wire_Mesh_News_Vocabularies.xlsx — do not edit by hand.
// 标准主题分组。
// Used in: Standards Index SUBJECT 筛选

export type StandardSubject = { code: string; labelEn: string; labelZh: string };

export const STANDARD_SUBJECT = [{"code":"fencing_security","labelEn":"Fencing & security","labelZh":"围栏与安防"},{"code":"coatings_corrosion","labelEn":"Coatings & corrosion","labelZh":"镀层与腐蚀"},{"code":"wire_materials","labelEn":"Wire & materials","labelZh":"钢丝与材料"},{"code":"testing","labelEn":"Testing methods","labelZh":"试验方法"},{"code":"grating_walkway","labelEn":"Grating & walkway","labelZh":"格板与通道"},{"code":"reinforcement_civil","labelEn":"Reinforcement & civil","labelZh":"加固与土木"},{"code":"filtration_screening","labelEn":"Filtration & screening","labelZh":"过滤与筛分"},{"code":"architectural","labelEn":"Architectural mesh","labelZh":"建筑网"}] as const satisfies readonly StandardSubject[];

export type StandardSubjectCode = (typeof STANDARD_SUBJECT)[number]["code"];

export const STANDARD_SUBJECT_BY_CODE: Readonly<Record<string, StandardSubject>> = Object.fromEntries(STANDARD_SUBJECT.map((r) => [r.code, r]));
