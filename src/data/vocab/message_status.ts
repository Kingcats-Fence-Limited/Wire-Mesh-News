// AUTO-GENERATED from docs/Wire_Mesh_News_Vocabularies.xlsx — do not edit by hand.
// 定向联系消息状态。
// Used in: 用户中心 My messages · 企业端消息箱

export type MessageStatus = { code: string; label: string };

export const MESSAGE_STATUS = [{"code":"sent","label":"Sent"},{"code":"awaiting_reply","label":"Awaiting reply"},{"code":"replied","label":"Replied"},{"code":"no_reply","label":"No reply (14 days)"},{"code":"blocked","label":"Blocked (abuse)"}] as const satisfies readonly MessageStatus[];

export type MessageStatusCode = (typeof MESSAGE_STATUS)[number]["code"];

export const MESSAGE_STATUS_BY_CODE: Readonly<Record<string, MessageStatus>> = Object.fromEntries(MESSAGE_STATUS.map((r) => [r.code, r]));
