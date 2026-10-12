// AUTO-GENERATED from docs/Wire_Mesh_News_Vocabularies.xlsx — do not edit by hand.
// 广告位库存。
// Used in: 广告系统

export type AdSlot = { code: string; label: string; size: string; pages: string; capNote: string };

export const AD_SLOT = [{"code":"leaderboard","label":"Leaderboard","size":"970×120","pages":"home, category, directory, events","capNote":"不进首屏"},{"code":"mpu","label":"MPU","size":"300×250","pages":"sidebar: article, home, category, directory, topic","capNote":""},{"code":"half_page","label":"Half page","size":"300×600","pages":"article sidebar","capNote":"文章 ≥1200 字"},{"code":"in_article","label":"In-article","size":"580×180","pages":"article body","capNote":"每篇最多 1，只在小标题之间"},{"code":"in_feed","label":"In-feed sponsored card","size":"card","pages":"home, category","capNote":"每 10 条最多 1"},{"code":"series_sponsor","label":"Series sponsor","size":"text+logo","pages":"topic","capNote":""},{"code":"partner_strip","label":"Partner strip","size":"logo row","pages":"all pages footer","capNote":""},{"code":"newsletter_sponsor","label":"Newsletter sponsor","size":"image+text / text link","pages":"weekly brief","capNote":""},{"code":"sponsored_listing","label":"Sponsored listing","size":"card","pages":"directory","capNote":"第一期不启用；物理分区"}] as const satisfies readonly AdSlot[];

export type AdSlotCode = (typeof AD_SLOT)[number]["code"];

export const AD_SLOT_BY_CODE: Readonly<Record<string, AdSlot>> = Object.fromEntries(AD_SLOT.map((r) => [r.code, r]));
