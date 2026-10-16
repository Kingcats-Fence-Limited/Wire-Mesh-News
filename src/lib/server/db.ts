import "server-only";
import { Pool } from "pg";
import { ENV } from "./env";

/* One Postgres pool per server instance, for the sign-in tables and small website tables
   (rate limits, email codes). Everything lives in its own schema (AUTH_DB_SCHEMA, default
   "auth") so it never mixes with Directus' tables, even when both share one database. */
const g = globalThis as unknown as { __wmnPool?: Pool };

export function pool(): Pool {
  if (!g.__wmnPool) {
    const schema = /^[a-z_][a-z0-9_]*$/.test(ENV.authSchema) ? ENV.authSchema : "auth";
    g.__wmnPool = new Pool({
      connectionString: ENV.databaseUrl,
      max: 5,
      idleTimeoutMillis: 10_000,
      options: `-c search_path=${schema}`,
      ssl: /sslmode=(require|verify)/.test(ENV.databaseUrl) ? { rejectUnauthorized: !/sslmode=require/.test(ENV.databaseUrl) } : undefined,
    });
  }
  return g.__wmnPool;
}

/* Website tables next to the sign-in tables. Created by scripts/auth-migrate.mjs. */
export const SITE_TABLES_SQL = `
create table if not exists wmn_rate_limit (
  key text primary key,
  window_start timestamptz not null,
  count integer not null
);
create table if not exists wmn_email_code (
  id text primary key,
  user_id text not null,
  email text not null,
  purpose text not null,
  code_hash text not null,
  attempts integer not null default 0,
  expires_at timestamptz not null,
  verified_at timestamptz
);
create index if not exists wmn_email_code_user on wmn_email_code (user_id, purpose);
create table if not exists wmn_meter (
  user_id text not null,
  month text not null,
  slug text not null,
  opened_at timestamptz not null default now(),
  primary key (user_id, month, slug)
);
create table if not exists wmn_company_views (
  company_slug text not null,
  day date not null,
  country text not null default '',
  views integer not null default 0,
  primary key (company_slug, day, country)
);
create table if not exists wmn_meter (
  user_id text not null,
  month text not null,
  slug text not null,
  at timestamptz not null default now(),
  primary key (user_id, month, slug)
);
create table if not exists wmn_company_views (
  company_slug text not null,
  day date not null,
  country text not null default '',
  views integer not null default 0,
  primary key (company_slug, day, country)
);
create table if not exists wmn_fetch_log (
  source text primary key,
  ran_at timestamptz not null,
  found integer not null default 0,
  added integer not null default 0,
  error text
);
`;
