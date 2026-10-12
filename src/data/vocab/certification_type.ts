// AUTO-GENERATED from docs/Wire_Mesh_News_Vocabularies.xlsx — do not edit by hand.
// 认证类型词表。body=management 为体系认证（由认证机构颁发），product 为产品认证/测试。
// Used in: Claim 编辑台 Certifications TYPE · 企业页认证卡

export type CertificationType = { code: string; label: string; kind: string; note: string };

export const CERTIFICATION_TYPE = [{"code":"iso_9001","label":"ISO 9001 (Quality management)","kind":"management","note":""},{"code":"iso_14001","label":"ISO 14001 (Environmental management)","kind":"management","note":""},{"code":"iso_45001","label":"ISO 45001 (Occupational health & safety)","kind":"management","note":""},{"code":"iso_50001","label":"ISO 50001 (Energy management)","kind":"management","note":""},{"code":"iatf_16949","label":"IATF 16949 (Automotive quality)","kind":"management","note":""},{"code":"iso_17025","label":"ISO/IEC 17025 (Testing lab accreditation)","kind":"accreditation","note":"仅实验室"},{"code":"ce_cpr","label":"CE marking under CPR (construction products)","kind":"product","note":"需 DoP 与公告机构编号"},{"code":"ukca","label":"UKCA marking","kind":"product","note":""},{"code":"ul","label":"UL Listed / Recognized","kind":"product","note":""},{"code":"csa","label":"CSA certified","kind":"product","note":""},{"code":"bs_kitemark","label":"BSI Kitemark","kind":"product","note":""},{"code":"lpcb","label":"LPCB / LPS 1175 (security rating)","kind":"product","note":"防攀爬围栏常见"},{"code":"sbd","label":"Secured by Design","kind":"product","note":"英国安防"},{"code":"astm_test_report","label":"ASTM test report (third-party)","kind":"test_report","note":"测试报告，不是认证"},{"code":"en_test_report","label":"EN test report (third-party)","kind":"test_report","note":"测试报告，不是认证"},{"code":"rohs_reach","label":"RoHS / REACH compliance","kind":"declaration","note":"自我声明类"},{"code":"other","label":"Other (manual review)","kind":"other","note":"转人工"}] as const satisfies readonly CertificationType[];

export type CertificationTypeCode = (typeof CERTIFICATION_TYPE)[number]["code"];

export const CERTIFICATION_TYPE_BY_CODE: Readonly<Record<string, CertificationType>> = Object.fromEntries(CERTIFICATION_TYPE.map((r) => [r.code, r]));
