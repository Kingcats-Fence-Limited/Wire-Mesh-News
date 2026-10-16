/* Writes docs/PHASE2-DIRECTUS.md from scripts/directus-schema.mjs, so the field list never drifts. */
import { writeFileSync } from "node:fs";
import { COLLECTIONS, FILE_FIELDS, FOLDERS } from "./directus-schema.mjs";

const type = (f) => f.meta?.special?.includes("m2o") || f.relation ? `uuid → ${f.relation?.related_collection ?? "directus_files"}` : f.meta?.special?.includes("uuid") ? "uuid (primary key)" : f.type + (f.schema?.max_length && f.type === "string" ? `(${f.schema.max_length})` : "");
const flags = (f) => [f.schema?.is_nullable === false || f.schema?.is_primary_key ? "required" : "", f.schema?.is_unique ? "unique" : "", f.schema?.default_value !== undefined && f.schema?.default_value !== null ? `default ${JSON.stringify(f.schema.default_value)}` : ""].filter(Boolean).join(", ");
const notes = (f) => [f.meta?.note, f.meta?.options?.choices ? `values: ${f.meta.options.choices.map((c) => c.value).join(" / ")}` : ""].filter(Boolean).join(" · ").replace(/\|/g, "\\|");

let md = `# Phase 2 — Directus collections\n\nGenerated from \`scripts/directus-schema.mjs\` by \`node scripts/directus-doc.mjs\`. Do not edit by hand.\n\nThe easiest way to create all of this is \`DIRECTUS_URL=… DIRECTUS_ADMIN_TOKEN=… node scripts/directus-setup.mjs\` (see PHASE2.md). The tables below are for review, or for adding fields by hand.\n\n`;
for (const c of COLLECTIONS) {
  md += `## \`${c.collection}\`\n\n${c.note ?? ""}\n\n| Field | Type | Rules | Notes |\n| --- | --- | --- | --- |\n`;
  for (const f of c.fields) md += `| \`${f.field}\` | ${type(f)} | ${flags(f)} | ${notes(f)} |\n`;
  md += "\n";
}
md += `## Extra fields on \`directus_files\`\n\n| Field | Type | Notes |\n| --- | --- | --- |\n${FILE_FIELDS.map((f) => `| \`${f.field}\` | ${f.type} | ${notes(f)} |`).join("\n")}\n\n## Folders\n\n${FOLDERS.map((f) => `- \`${f}\``).join("\n")}\n\n## Access\n\nRole and policy **Website server** (created by the setup script): create, read, update and delete on every collection above and on \`directus_files\`; read on \`directus_folders\`. Its user \`website-server@wiremeshnews.com\` has a static token that goes into Vercel as \`DIRECTUS_SERVER_TOKEN\`. It has no admin access and no access to content collections it does not need.\n`;
writeFileSync(new URL("../docs/PHASE2-DIRECTUS.md", import.meta.url), md);
console.log("docs/PHASE2-DIRECTUS.md written");
