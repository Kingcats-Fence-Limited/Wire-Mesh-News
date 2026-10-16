#!/usr/bin/env node
/**
 * One-off setup of the Phase 2 collections in Directus (accounts, submissions, comments …).
 * Safe to run more than once: it only adds what is missing and never deletes or changes data.
 *
 *   DIRECTUS_URL=https://cms.example.com DIRECTUS_ADMIN_TOKEN=… node scripts/directus-setup.mjs
 *
 * What it does
 *   1. creates the collections and fields in scripts/directus-schema.mjs (skips existing ones)
 *   2. adds two fields to directus_files (owner_member, visibility) and three upload folders
 *   3. creates the role "Website server" with a policy that can read/write ONLY those
 *      collections and files, and a user "website-server@…" in it
 *   4. prints a new static token for that user ONCE — put it in Vercel as DIRECTUS_SERVER_TOKEN
 *
 * The admin token is only used for this run; do not put it in Vercel.
 * Add --dry-run to print what would be created without changing anything.
 */
import { randomBytes } from "node:crypto";
import { COLLECTIONS, FILE_FIELDS, FOLDERS } from "./directus-schema.mjs";

const BASE = process.env.DIRECTUS_URL?.replace(/\/$/, "");
const TOKEN = process.env.DIRECTUS_ADMIN_TOKEN;
const DRY = process.argv.includes("--dry-run");
const SERVER_EMAIL = process.env.WEBSITE_SERVER_EMAIL || "website-server@wiremeshnews.com";

if (!BASE || !TOKEN) {
  console.error("Set DIRECTUS_URL and DIRECTUS_ADMIN_TOKEN.");
  process.exit(1);
}
if (!/^https:\/\//.test(BASE) && !/^http:\/\/(127\.0\.0\.1|localhost)(:\d+)?$/.test(BASE)) {
  console.error("DIRECTUS_URL must be https:// (the admin token is sent with every request).");
  process.exit(1);
}

async function api(method, path, body) {
  if (DRY && method !== "GET") { console.log(`  [dry-run] ${method} ${path}`); return { data: {} }; }
  const res = await fetch(`${BASE}${path}`, { method, headers: { Authorization: `Bearer ${TOKEN}`, "Content-Type": "application/json" }, body: body ? JSON.stringify(body) : undefined });
  const txt = await res.text();
  const out = txt ? JSON.parse(txt) : {};
  if (!res.ok) throw new Error(`${method} ${path} → ${res.status}: ${JSON.stringify(out.errors ?? out).slice(0, 400)}`);
  return out;
}

const log = (...a) => console.log(...a);

async function main() {
  const info = await api("GET", "/server/info");
  log(`Directus ${info.data?.version ?? ""} at ${BASE}${DRY ? " (dry run)" : ""}`);

  const existing = new Set((await api("GET", "/collections?limit=-1")).data.map((c) => c.collection));

  /* 1 · collections (primary key only), then fields one by one */
  for (const c of COLLECTIONS) {
    if (!existing.has(c.collection)) {
      log(`+ collection ${c.collection}`);
      await api("POST", "/collections", { collection: c.collection, meta: { icon: c.icon, note: c.note, display_template: c.display_template ?? null, accountability: "all" }, schema: {}, fields: [c.fields.find((f) => f.field === "id")] });
    } else log(`= collection ${c.collection} exists`);
  }
  for (const c of COLLECTIONS) {
    const have = new Set(DRY && !existing.has(c.collection) ? [] : (await api("GET", `/fields/${c.collection}`)).data.map((f) => f.field));
    for (const f of c.fields) {
      if (have.has(f.field)) continue;
      const { relation, ...field } = f;
      log(`  + ${c.collection}.${f.field}`);
      await api("POST", `/fields/${c.collection}`, field);
      if (relation) await api("POST", "/relations", { collection: c.collection, field: f.field, related_collection: relation.related_collection, schema: { on_delete: relation.on_delete } });
    }
  }

  /* 2 · file fields and folders */
  const fileHave = new Set((await api("GET", "/fields/directus_files")).data.map((f) => f.field));
  for (const f of FILE_FIELDS) if (!fileHave.has(f.field)) { log(`  + directus_files.${f.field}`); await api("POST", "/fields/directus_files", f); }
  const folders = new Set((await api("GET", "/folders?limit=-1")).data.map((f) => f.name));
  for (const name of FOLDERS) if (!folders.has(name)) { log(`+ folder ${name}`); await api("POST", "/folders", { name }); }

  /* 3 · role + policy + permissions for the website server */
  const ROLE = "Website server";
  let policy = (await api("GET", `/policies?filter[name][_eq]=${encodeURIComponent(ROLE)}`)).data[0];
  if (!policy) { log(`+ policy ${ROLE}`); policy = (await api("POST", "/policies", { name: ROLE, icon: "dns", description: "Used only by the website's server to read and write user data. No app access.", admin_access: false, app_access: false })).data; }
  const have = new Set((await api("GET", `/permissions?limit=-1&filter[policy][_eq]=${policy.id}`)).data.map((p) => `${p.collection}:${p.action}`));
  const want = [];
  for (const c of COLLECTIONS) for (const action of ["create", "read", "update", "delete"]) want.push({ collection: c.collection, action });
  for (const action of ["create", "read", "update", "delete"]) want.push({ collection: "directus_files", action });
  want.push({ collection: "directus_folders", action: "read" });
  const missing = want.filter((p) => !have.has(`${p.collection}:${p.action}`)).map((p) => ({ ...p, policy: policy.id, fields: ["*"], permissions: {}, validation: {} }));
  if (missing.length) { log(`+ ${missing.length} permissions`); await api("POST", "/permissions", missing); }

  let role = (await api("GET", `/roles?filter[name][_eq]=${encodeURIComponent(ROLE)}`)).data[0];
  if (!role) { log(`+ role ${ROLE}`); role = (await api("POST", "/roles", { name: ROLE, icon: "dns", description: "The website's server (no sign-in, token only)." })).data; }
  const access = (await api("GET", `/access?filter[role][_eq]=${role.id}&filter[policy][_eq]=${policy.id}`)).data;
  if (!access.length) await api("POST", "/access", { role: role.id, policy: policy.id });

  let user = (await api("GET", `/users?filter[email][_eq]=${encodeURIComponent(SERVER_EMAIL)}`)).data[0];
  const token = randomBytes(32).toString("base64url");
  if (!user) {
    log(`+ user ${SERVER_EMAIL}`);
    user = (await api("POST", "/users", { email: SERVER_EMAIL, first_name: "Website", last_name: "Server", role: role.id, status: "active", token })).data;
    printToken(token);
  } else if (process.argv.includes("--rotate-token")) {
    await api("PATCH", `/users/${user.id}`, { token });
    log("Token rotated.");
    printToken(token);
  } else log(`= user ${SERVER_EMAIL} exists (run with --rotate-token for a new token)`);

  log("\nDone. Folders for uploads: " + FOLDERS.join(", "));
}

function printToken(token) {
  if (DRY) return;
  log("\n================================================================");
  log(" DIRECTUS_SERVER_TOKEN (shown once — add it in Vercel, then clear this screen):");
  log(" " + token);
  log("================================================================\n");
}

main().catch((e) => { console.error(e.message); process.exit(1); });
