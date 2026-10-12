// AUTO-GENERATED from docs/Wire_Mesh_News_Vocabularies.xlsx — do not edit by hand.
// 企业认领状态。
// Used in: 认领流程

export type ClaimStatus = { code: string; label: string };

export const CLAIM_STATUS = [{"code":"draft","label":"Draft"},{"code":"email_pending","label":"Awaiting email verification"},{"code":"under_review","label":"Under review"},{"code":"approved","label":"Approved"},{"code":"rejected","label":"Rejected"},{"code":"revoked","label":"Revoked"}] as const satisfies readonly ClaimStatus[];

export type ClaimStatusCode = (typeof CLAIM_STATUS)[number]["code"];

export const CLAIM_STATUS_BY_CODE: Readonly<Record<string, ClaimStatus>> = Object.fromEntries(CLAIM_STATUS.map((r) => [r.code, r]));
