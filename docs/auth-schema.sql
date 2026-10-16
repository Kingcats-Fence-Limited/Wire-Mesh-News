-- schema: auth
create schema if not exists auth;
set search_path to auth;
create table "user" ("id" text not null primary key, "name" text not null, "email" text not null unique, "emailVerified" boolean not null, "image" text, "createdAt" timestamptz default CURRENT_TIMESTAMP not null, "updatedAt" timestamptz default CURRENT_TIMESTAMP not null);
create table "session" ("id" text not null primary key, "expiresAt" timestamptz not null, "token" text not null unique, "createdAt" timestamptz default CURRENT_TIMESTAMP not null, "updatedAt" timestamptz not null, "ipAddress" text, "userAgent" text, "userId" text not null references "user" ("id") on delete cascade);
create table "account" ("id" text not null primary key, "accountId" text not null, "providerId" text not null, "userId" text not null references "user" ("id") on delete cascade, "accessToken" text, "refreshToken" text, "idToken" text, "accessTokenExpiresAt" timestamptz, "refreshTokenExpiresAt" timestamptz, "scope" text, "password" text, "createdAt" timestamptz default CURRENT_TIMESTAMP not null, "updatedAt" timestamptz not null);
create table "verification" ("id" text not null primary key, "identifier" text not null, "value" text not null, "expiresAt" timestamptz not null, "createdAt" timestamptz default CURRENT_TIMESTAMP not null, "updatedAt" timestamptz default CURRENT_TIMESTAMP not null);
create table "rateLimit" ("id" text not null primary key, "key" text not null unique, "count" integer not null, "lastRequest" bigint not null);
create index "session_userId_idx" on "session" ("userId");
create index "account_userId_idx" on "account" ("userId");
create index "verification_identifier_idx" on "verification" ("identifier");
create table if not exists wmn_rate_limit (key text primary key, window_start timestamptz not null, count integer not null);
create table if not exists wmn_email_code (id text primary key, user_id text not null, email text not null, purpose text not null, code_hash text not null, attempts integer not null default 0, expires_at timestamptz not null, verified_at timestamptz);
create index if not exists wmn_email_code_user on wmn_email_code (user_id, purpose);
create table if not exists wmn_meter (user_id text not null, month text not null, slug text not null, at timestamptz not null default now(), primary key (user_id, month, slug));
create table if not exists wmn_company_views (company_slug text not null, day date not null, country text not null default '', views integer not null default 0, primary key (company_slug, day, country));
create table if not exists wmn_fetch_log (source text primary key, ran_at timestamptz not null, found integer not null default 0, added integer not null default 0, error text);
