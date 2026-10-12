// AUTO-GENERATED from docs/Wire_Mesh_News_Vocabularies.xlsx — do not edit by hand.
// 五个编辑栏目 + 读者参与栏目。
// Used in: 文章主栏目 · 导航 · 超级菜单

export type Section = { code: string; label: string; slug: string };

export const SECTION = [{"code":"news","label":"News","slug":"news"},{"code":"market_insights","label":"Market Insights","slug":"market-insights"},{"code":"applications","label":"Applications","slug":"applications"},{"code":"technical_guides","label":"Technical Guides","slug":"technical-guides"},{"code":"buying_guides","label":"Buying Guides","slug":"buying-guides"},{"code":"letters_opinion","label":"Letters & Opinion","slug":"opinion"}] as const satisfies readonly Section[];

export type SectionCode = (typeof SECTION)[number]["code"];

export const SECTION_BY_CODE: Readonly<Record<string, Section>> = Object.fromEntries(SECTION.map((r) => [r.code, r]));
