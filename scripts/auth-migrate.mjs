#!/usr/bin/env node
/**
 * Creates (or upgrades) the sign-in tables in Postgres, in their own schema.
 *
 *   DATABASE_URL=postgres://… [AUTH_DB_SCHEMA=auth] node scripts/auth-migrate.mjs
 *   … --sql   print the SQL instead of running it (to review or run by hand)
 *
 * Safe to run more than once. It never drops anything. The same SQL, as generated for a
 * fresh database, is in docs/auth-schema.sql.
 */
import pg from "pg";
import { betterAuth } from "better-auth";
import { emailOTP, oneTap } from "better-auth/plugins";
import { getMigrations } from "better-auth/db/migration";

const url = process.env.DATABASE_URL;
const schema = process.env.AUTH_DB_SCHEMA || "auth";
if (!url) { console.error("Set DATABASE_URL."); process.exit(1); }
if (!/^[a-z_][a-z0-9_]*$/.test(schema)) { console.error("AUTH_DB_SCHEMA must be a plain lowercase name."); process.exit(1); }

const admin = new pg.Pool({ connectionString: url });
await admin.query(`create schema if not exists ${schema}`);
const pool = new pg.Pool({ connectionString: url, options: `-c search_path=${schema}` });

/* Same tables as src/lib/auth.ts: core + email OTP + one tap + database rate limits. */
const options = {
  secret: "migration-only-not-used-for-signing",
  database: pool,
  emailAndPassword: { enabled: false },
  rateLimit: { enabled: true, storage: "database" },
  plugins: [emailOTP({ sendVerificationOTP: async () => {} }), oneTap()],
};
betterAuth(options);
const { toBeCreated, toBeAdded, compileMigrations, runMigrations } = await getMigrations(options);

const SITE_TABLES = `
create table if not exists wmn_rate_limit (key text primary key, window_start timestamptz not null, count integer not null);
create table if not exists wmn_email_code (id text primary key, user_id text not null, email text not null, purpose text not null, code_hash text not null, attempts integer not null default 0, expires_at timestamptz not null, verified_at timestamptz);
create index if not exists wmn_email_code_user on wmn_email_code (user_id, purpose);
create table if not exists wmn_meter (user_id text not null, month text not null, slug text not null, at timestamptz not null default now(), primary key (user_id, month, slug));
create table if not exists wmn_company_views (company_slug text not null, day date not null, country text not null default '', views integer not null default 0, primary key (company_slug, day, country));
create table if not exists wmn_fetch_log (source text primary key, ran_at timestamptz not null, found integer not null default 0, added integer not null default 0, error text);
create table if not exists wmn_trade (source text not null, reporter text not null, partner text not null, flow text not null, hs text not null, period text not null, value numeric not null, currency text not null, qty_kg numeric, fetched_at timestamptz not null default now(), primary key (source, reporter, partner, flow, hs, period));
create index if not exists wmn_trade_q on wmn_trade (hs, reporter, flow, period);
`;

if (process.argv.includes("--sql")) {
  console.log(`-- schema: ${schema}\ncreate schema if not exists ${schema};\nset search_path to ${schema};\n`);
  console.log(await compileMigrations());
  console.log(SITE_TABLES);
} else {
  console.log(`Schema "${schema}": ${toBeCreated.length} table(s) to create, ${toBeAdded.length} to extend.`);
  await runMigrations();
  await pool.query(SITE_TABLES);
  console.log("Done.");
}
await pool.end();
await admin.end();
