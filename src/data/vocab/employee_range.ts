// AUTO-GENERATED from docs/Wire_Mesh_News_Vocabularies.xlsx — do not edit by hand.
// 员工规模区间。
// Used in: Claim 编辑台 Employees

export type EmployeeRange = { code: string; label: string };

export const EMPLOYEE_RANGE = [{"code":"1_10","label":"1 – 10"},{"code":"11_50","label":"11 – 50"},{"code":"51_200","label":"51 – 200"},{"code":"201_500","label":"201 – 500"},{"code":"501_1000","label":"501 – 1,000"},{"code":"1001_5000","label":"1,001 – 5,000"},{"code":"5000_plus","label":"5,000+"}] as const satisfies readonly EmployeeRange[];

export type EmployeeRangeCode = (typeof EMPLOYEE_RANGE)[number]["code"];

export const EMPLOYEE_RANGE_BY_CODE: Readonly<Record<string, EmployeeRange>> = Object.fromEntries(EMPLOYEE_RANGE.map((r) => [r.code, r]));
