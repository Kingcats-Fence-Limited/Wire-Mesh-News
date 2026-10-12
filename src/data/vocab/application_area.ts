// AUTO-GENERATED from docs/Wire_Mesh_News_Vocabularies.xlsx — do not edit by hand.
// 五个应用领域（Applications 栏目 = 名录 Application 筛选，同一套词）。scenarios 为红字典型场景。
// Used in: Applications 栏目 · Directory Application 筛选 · 企业卡领域标签

export type ApplicationArea = { code: string; labelEn: string; labelZh: string; scenariosEn: string; pattern: string };

export const APPLICATION_AREA = [{"code":"architecture","labelEn":"Architecture & Infrastructure","labelZh":"建筑与基础设施","scenariosEn":"Facades & cladding; Bridge screens; Gabion walls; Balustrades","pattern":"expanded"},{"code":"industrial_security","labelEn":"Industrial & Security","labelZh":"工业与安防","scenariosEn":"Site perimeter; Anti-climb; Machine guarding; Data centres; Airports","pattern":"welded"},{"code":"agriculture","labelEn":"Agriculture & Horticulture","labelZh":"农业与园艺","scenariosEn":"Livestock fencing; Poultry netting; Crop support; Vineyards","pattern":"woven"},{"code":"energy_environment","labelEn":"Energy & Environment","labelZh":"能源与环境","scenariosEn":"Solar site fencing; Screening media; Dust & filtration; Water treatment","pattern":"perforated"},{"code":"sports_lifestyle","labelEn":"Sports & Lifestyle","labelZh":"运动与生活","scenariosEn":"Ball-court fencing; Pool & garden; Pet & patio; Playgrounds","pattern":"chain_link"}] as const satisfies readonly ApplicationArea[];

export type ApplicationAreaCode = (typeof APPLICATION_AREA)[number]["code"];

export const APPLICATION_AREA_BY_CODE: Readonly<Record<string, ApplicationArea>> = Object.fromEntries(APPLICATION_AREA.map((r) => [r.code, r]));
