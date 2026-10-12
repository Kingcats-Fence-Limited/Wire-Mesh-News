// AUTO-GENERATED from docs/Wire_Mesh_News_Vocabularies.xlsx — do not edit by hand.
// 联系表单与 Contact 页的事由。
// Used in: Contact 页 · 定向联系 SUBJECT 另有企业咨询类：product_enquiry / technical_question / sample_request / catalogue_request / other

export type ContactSubject = { code: string; label: string; routesTo: string };

export const CONTACT_SUBJECT = [{"code":"editorial_tip","label":"Editorial tip / news lead","routesTo":"editorial@"},{"code":"correction","label":"Request a correction","routesTo":"corrections@"},{"code":"submission","label":"Submit an article / letter","routesTo":"submissions@"},{"code":"advertising","label":"Advertising & partnership","routesTo":"partners@"},{"code":"account_privacy","label":"Account & privacy","routesTo":"privacy@"},{"code":"directory","label":"Directory listing / claim","routesTo":"directory@"},{"code":"other","label":"Other","routesTo":"hello@"}] as const satisfies readonly ContactSubject[];

export type ContactSubjectCode = (typeof CONTACT_SUBJECT)[number]["code"];

export const CONTACT_SUBJECT_BY_CODE: Readonly<Record<string, ContactSubject>> = Object.fromEntries(CONTACT_SUBJECT.map((r) => [r.code, r]));
