// AUTO-GENERATED from docs/Wire_Mesh_News_Vocabularies.xlsx — do not edit by hand.
// 定向联系表单主题。
// Used in: 定向联系表单

export type EnquirySubject = { code: string; label: string };

export const ENQUIRY_SUBJECT = [{"code":"product_enquiry","label":"Product enquiry"},{"code":"technical_question","label":"Technical question"},{"code":"sample_request","label":"Sample request"},{"code":"catalogue_request","label":"Catalogue request"},{"code":"other","label":"Other"}] as const satisfies readonly EnquirySubject[];

export type EnquirySubjectCode = (typeof ENQUIRY_SUBJECT)[number]["code"];

export const ENQUIRY_SUBJECT_BY_CODE: Readonly<Record<string, EnquirySubject>> = Object.fromEntries(ENQUIRY_SUBJECT.map((r) => [r.code, r]));
