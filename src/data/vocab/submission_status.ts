// AUTO-GENERATED from docs/Wire_Mesh_News_Vocabularies.xlsx — do not edit by hand.
// 投稿状态。
// Used in: 用户中心 My submissions

export type SubmissionStatus = { code: string; label: string };

export const SUBMISSION_STATUS = [{"code":"draft","label":"Draft"},{"code":"pending","label":"Pending review"},{"code":"changes_requested","label":"Changes requested"},{"code":"rejected","label":"Rejected"},{"code":"published","label":"Published"},{"code":"withdrawn","label":"Withdrawn by author"}] as const satisfies readonly SubmissionStatus[];

export type SubmissionStatusCode = (typeof SUBMISSION_STATUS)[number]["code"];

export const SUBMISSION_STATUS_BY_CODE: Readonly<Record<string, SubmissionStatus>> = Object.fromEntries(SUBMISSION_STATUS.map((r) => [r.code, r]));
