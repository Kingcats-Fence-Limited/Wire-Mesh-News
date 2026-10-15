// AUTO-GENERATED from docs/Wire_Mesh_News_Vocabularies.xlsx — do not edit by hand.
// 文章体裁标识（列表与详情页都显示）。
// Used in: 文章页 · 列表页标识

export type ArticleType = { code: string; label: string; note: string };

export const ARTICLE_TYPE = [{"code":"news","label":"News","note":""},{"code":"analysis","label":"Analysis","note":""},{"code":"guide","label":"Guide","note":""},{"code":"case_study","label":"Case study","note":""},{"code":"interview","label":"Interview","note":""},{"code":"explainer","label":"Explainer","note":""},{"code":"opinion","label":"Opinion","note":"必须带标识，不与 News 混排"},{"code":"column","label":"Column","note":"固定署名作者的定期专栏（属观点类）：必须带标识，不与 News 混排"},{"code":"letter","label":"Letter","note":"读者来信"},{"code":"sponsored","label":"Sponsored content","note":"必须带标识，rel=sponsored"},{"code":"correction","label":"Correction notice","note":""}] as const satisfies readonly ArticleType[];

export type ArticleTypeCode = (typeof ARTICLE_TYPE)[number]["code"];

export const ARTICLE_TYPE_BY_CODE: Readonly<Record<string, ArticleType>> = Object.fromEntries(ARTICLE_TYPE.map((r) => [r.code, r]));
