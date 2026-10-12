// AUTO-GENERATED from docs/Wire_Mesh_News_Vocabularies.xlsx — do not edit by hand.
// 标准状态。
// Used in: Standards Index 状态标

export type StandardStatus = { code: string; label: string; badge: string };

export const STANDARD_STATUS = [{"code":"current","label":"Current","badge":"cur"},{"code":"under_review","label":"Under review","badge":"rev"},{"code":"draft","label":"Draft","badge":"dft"},{"code":"revised","label":"Recently revised","badge":"new"},{"code":"withdrawn","label":"Withdrawn","badge":"wd"},{"code":"superseded","label":"Superseded","badge":"wd"}] as const satisfies readonly StandardStatus[];

export type StandardStatusCode = (typeof STANDARD_STATUS)[number]["code"];

export const STANDARD_STATUS_BY_CODE: Readonly<Record<string, StandardStatus>> = Object.fromEntries(STANDARD_STATUS.map((r) => [r.code, r]));
