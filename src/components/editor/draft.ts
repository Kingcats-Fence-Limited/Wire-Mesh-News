/* Article draft shape, shared by the editor (client) and the account seed (server). */
export type EditorFile = { id: string; name: string; kind: "image" | "pdf"; url?: string; caption: string; credit: string; licence: string; cover?: boolean };
export type ArticleDraft = {
  title: string; dek: string; body: string;
  section: string; subsection: string; type: string; tags: string[];
  files: EditorFile[]; sources: string[]; byline: string;
  disclosure: "" | "none" | "yes"; disclosureText: string; checks: [boolean, boolean, boolean];
};
export const emptyDraft = (byline = ""): ArticleDraft => ({ title: "", dek: "", body: "", section: "", subsection: "", type: "", tags: [], files: [], sources: [""], byline, disclosure: "", disclosureText: "", checks: [false, false, false] });
