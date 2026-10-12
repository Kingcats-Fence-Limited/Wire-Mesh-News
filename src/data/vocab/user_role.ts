// AUTO-GENERATED from docs/Wire_Mesh_News_Vocabularies.xlsx — do not edit by hand.
// 账号角色，可叠加，不在注册时选择。
// Used in: 用户中心角色标

export type UserRole = { code: string; label: string; howGranted: string };

export const USER_ROLE = [{"code":"reader","label":"READER","howGranted":"注册并验证邮箱即得"},{"code":"author","label":"AUTHOR","howGranted":"首篇稿件通过后自动获得"},{"code":"company","label":"COMPANY","howGranted":"企业认领通过后获得"},{"code":"editor","label":"EDITOR","howGranted":"内部"},{"code":"admin","label":"ADMIN","howGranted":"内部"}] as const satisfies readonly UserRole[];

export type UserRoleCode = (typeof USER_ROLE)[number]["code"];

export const USER_ROLE_BY_CODE: Readonly<Record<string, UserRole>> = Object.fromEntries(USER_ROLE.map((r) => [r.code, r]));
