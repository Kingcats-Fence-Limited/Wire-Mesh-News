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

/* The site's own tables (rate limits, codes, meter, trade statistics …) are created by scripts/auth-migrate.mjs. */
