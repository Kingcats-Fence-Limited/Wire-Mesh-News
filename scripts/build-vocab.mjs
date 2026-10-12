// Generates src/data/vocab/*.ts from docs/Wire_Mesh_News_Vocabularies.xlsx
// Run: node scripts/build-vocab.mjs   (requires `pnpm add -D xlsx` — or uses the JSON fallback)
import fs from "node:fs";
import path from "node:path";

const json = JSON.parse(fs.readFileSync("docs/wmn_vocabularies.json", "utf8"));
const headers = JSON.parse(fs.readFileSync("scripts/vocab-headers.json", "utf8"));
const out = "src/data/vocab";
fs.mkdirSync(out, { recursive: true });

const camel = (s) => s.replace(/_([a-z])/g, (_, c) => c.toUpperCase());
const pascal = (s) => s.split("_").map((w) => w[0].toUpperCase() + w.slice(1)).join("");

const index = [];
for (const [name, table] of Object.entries(json.vocabularies)) {
  const cols = headers[name];
  if (!cols) throw new Error("no headers for " + name);
  const rows = table.rows.map((r) => Object.fromEntries(cols.map((c, i) => [camel(c), r[i] == null ? "" : String(r[i])])));
  const type = pascal(name);
  const keyCol = cols.includes("code") ? "code" : camel(cols[0]);
  const file = `// AUTO-GENERATED from docs/Wire_Mesh_News_Vocabularies.xlsx — do not edit by hand.
// ${table.description.replace(/\n/g, " ")}
// Used in: ${(table.used_in || []).join(" · ")}

export type ${type} = { ${cols.map((c) => `${camel(c)}: string`).join("; ")} };

export const ${name.toUpperCase()} = ${JSON.stringify(rows, null, 0)} as const satisfies readonly ${type}[];

export type ${type}Code = (typeof ${name.toUpperCase()})[number]["${keyCol}"];

export const ${name.toUpperCase()}_BY_CODE: Readonly<Record<string, ${type}>> = Object.fromEntries(${name.toUpperCase()}.map((r) => [r.${keyCol}, r]));
`;
  fs.writeFileSync(path.join(out, `${name}.ts`), file);
  index.push(`export * from "./${name}";`);
}
fs.writeFileSync(path.join(out, "index.ts"), `// AUTO-GENERATED — 31 controlled vocabularies (generated ${json.generated}). Store codes, never names.\n${index.join("\n")}\n`);
console.log("wrote", index.length, "vocab files");
