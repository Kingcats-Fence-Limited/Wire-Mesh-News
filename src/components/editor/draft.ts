/* Article draft shape, shared by the editor (client) and the account seed (server). */
export type EditorFile = { id: string; name: string; kind: "image" | "pdf"; url?: string; caption: string; credit: string; licence: string; cover?: boolean };
export type ArticleDraft = {
  title: string; dek: string; body: string;
  section: string; subsection: string; type: string;
  /** Controlled facets ("product:code", "application:code", "material:group", "region:code", "process:code", "surface:code"): the same codes the Directory filters use. */
  tags: string[];
  /** Standard numbers from the Standards index, company slugs from the Directory, topic slugs. */
  standards: string[]; companies: string[]; topics: string[];
  files: EditorFile[]; sources: string[]; byline: string;
  disclosure: "" | "none" | "yes"; disclosureText: string; checks: [boolean, boolean, boolean];
};
export const emptyDraft = (byline = ""): ArticleDraft => ({ title: "", dek: "", body: "", section: "", subsection: "", type: "", tags: [], standards: [], companies: [], topics: [], files: [], sources: [""], byline, disclosure: "", disclosureText: "", checks: [false, false, false] });

/** Lists the editor picks from, supplied by the server so the client bundle stays small. */
export type EditorRefs = { standards: { no: string; title: string }[]; companies: { slug: string; name: string }[]; topics: { slug: string; name: string }[] };
/** Fill fields added after a draft was saved. */
export const normalizeDraft = (d: Partial<ArticleDraft>, byline = ""): ArticleDraft => ({ ...emptyDraft(byline), ...d });
