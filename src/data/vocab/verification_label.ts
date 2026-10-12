// AUTO-GENERATED from docs/Wire_Mesh_News_Vocabularies.xlsx — do not edit by hand.
// 企业资料来源标注。
// Used in: 企业页 Key facts

export type VerificationLabel = { code: string; label: string; display: string };

export const VERIFICATION_LABEL = [{"code":"verified","label":"Verified","display":"VERIFIED — checked by our editors against {source} on {date}."},{"code":"self_reported","label":"Self-reported","display":"SELF-REPORTED — supplied by the company and not independently verified."},{"code":"editorial","label":"Editorial","display":"由编辑根据公开资料整理"}] as const satisfies readonly VerificationLabel[];

export type VerificationLabelCode = (typeof VERIFICATION_LABEL)[number]["code"];

export const VERIFICATION_LABEL_BY_CODE: Readonly<Record<string, VerificationLabel>> = Object.fromEntries(VERIFICATION_LABEL.map((r) => [r.code, r]));
