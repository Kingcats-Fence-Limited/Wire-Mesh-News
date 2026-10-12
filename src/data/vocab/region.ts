// AUTO-GENERATED from docs/Wire_Mesh_News_Vocabularies.xlsx — do not edit by hand.
// 出口市场 / 名录地区 / 展会地区共用的固定区域表（展会页筛选也用这一张，不另设 Asia 之类的粗分）。
// Used in: Claim 编辑台 Export markets · Directory Region 筛选（按 country.region 聚合） · Events 地区筛选

export type Region = { code: string; labelEn: string; labelZh: string };

export const REGION = [{"code":"europe","labelEn":"Europe","labelZh":"欧洲"},{"code":"north_america","labelEn":"North America","labelZh":"北美"},{"code":"latin_america","labelEn":"Latin America","labelZh":"拉丁美洲"},{"code":"middle_east","labelEn":"Middle East","labelZh":"中东"},{"code":"africa","labelEn":"Africa","labelZh":"非洲"},{"code":"south_asia","labelEn":"South Asia","labelZh":"南亚"},{"code":"southeast_asia","labelEn":"Southeast Asia","labelZh":"东南亚"},{"code":"east_asia","labelEn":"East Asia","labelZh":"东亚"},{"code":"central_asia","labelEn":"Central Asia & Caucasus","labelZh":"中亚与高加索"},{"code":"oceania","labelEn":"Oceania","labelZh":"大洋洲"}] as const satisfies readonly Region[];

export type RegionCode = (typeof REGION)[number]["code"];

export const REGION_BY_CODE: Readonly<Record<string, Region>> = Object.fromEntries(REGION.map((r) => [r.code, r]));
