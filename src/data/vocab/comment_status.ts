// AUTO-GENERATED from docs/Wire_Mesh_News_Vocabularies.xlsx — do not edit by hand.
// 评论状态。
// Used in: 评论区

export type CommentStatus = { code: string; label: string };

export const COMMENT_STATUS = [{"code":"pending","label":"Pending review"},{"code":"approved","label":"Approved"},{"code":"rejected","label":"Rejected"},{"code":"removed","label":"Removed after publication"}] as const satisfies readonly CommentStatus[];

export type CommentStatusCode = (typeof COMMENT_STATUS)[number]["code"];

export const COMMENT_STATUS_BY_CODE: Readonly<Record<string, CommentStatus>> = Object.fromEntries(COMMENT_STATUS.map((r) => [r.code, r]));
