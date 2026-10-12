// AUTO-GENERATED from docs/Wire_Mesh_News_Vocabularies.xlsx — do not edit by hand.
// 活动类型。
// Used in: Events 筛选

export type EventType = { code: string; label: string };

export const EVENT_TYPE = [{"code":"trade_show","label":"Trade show"},{"code":"conference","label":"Conference"},{"code":"webinar","label":"Webinar"},{"code":"training","label":"Training / workshop"},{"code":"award","label":"Awards"}] as const satisfies readonly EventType[];

export type EventTypeCode = (typeof EVENT_TYPE)[number]["code"];

export const EVENT_TYPE_BY_CODE: Readonly<Record<string, EventType>> = Object.fromEntries(EVENT_TYPE.map((r) => [r.code, r]));
