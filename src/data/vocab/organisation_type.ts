// AUTO-GENERATED from docs/Wire_Mesh_News_Vocabularies.xlsx — do not edit by hand.
// 企业/机构类型。由编辑设定，企业不可自改。
// Used in: Directory 企业类型 · Company profile · Claim 申请表 · 注册时的机构类型

export type OrganisationType = { code: string; labelEn: string; labelZh: string; note: string };

export const ORGANISATION_TYPE = [{"code":"manufacturer","labelEn":"Manufacturer","labelZh":"制造商","note":"自有产线生产网类产品"},{"code":"processor","labelEn":"Processor / Fabricator","labelZh":"加工商","note":"裁切、焊接、成型、表面处理等二次加工"},{"code":"distributor","labelEn":"Distributor / Stockist","labelZh":"经销商 / 库存商","note":"不生产，销售与备货"},{"code":"machinery","labelEn":"Machinery & Equipment","labelZh":"设备制造商","note":"织网机、焊网机、拉丝、镀锌线等"},{"code":"testing_lab","labelEn":"Testing Laboratory","labelZh":"检测实验室","note":"第三方检测与认证测试"},{"code":"standards_body","labelEn":"Standards Body","labelZh":"标准机构","note":"ISO、CEN、ASTM、BSI 等"},{"code":"association","labelEn":"Industry Association","labelZh":"行业协会","note":"协会、商会、学会"}] as const satisfies readonly OrganisationType[];

export type OrganisationTypeCode = (typeof ORGANISATION_TYPE)[number]["code"];

export const ORGANISATION_TYPE_BY_CODE: Readonly<Record<string, OrganisationType>> = Object.fromEntries(ORGANISATION_TYPE.map((r) => [r.code, r]));
