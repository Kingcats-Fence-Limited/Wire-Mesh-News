import "server-only";
import { ENV } from "./env";

/* Directus REST with the website-server token (scripts/directus-setup.mjs creates it). That
   role can read and write only the user-data collections, so a bug here cannot touch
   editorial content or Directus' own settings. */

type Query = { filter?: unknown; fields?: string[]; sort?: string[]; limit?: number; search?: string };

export class DirectusError extends Error {
  constructor(public status: number, message: string) { super(message); }
}

function qs(q: Query = {}) {
  const p = new URLSearchParams();
  if (q.filter) p.set("filter", JSON.stringify(q.filter));
  if (q.fields) p.set("fields", q.fields.join(","));
  if (q.sort) p.set("sort", q.sort.join(","));
  p.set("limit", String(q.limit ?? 200));
  if (q.search) p.set("search", q.search);
  return p.toString();
}

async function call<T>(method: string, path: string, body?: unknown, raw = false): Promise<T> {
  const res = await fetch(`${ENV.directusUrl}${path}`, {
    method,
    headers: { Authorization: `Bearer ${ENV.directusServerToken}`, ...(body !== undefined && !(body instanceof FormData) ? { "Content-Type": "application/json" } : {}) },
    body: body === undefined ? undefined : body instanceof FormData ? body : JSON.stringify(body),
    cache: "no-store",
  });
  if (raw) return res as unknown as T;
  if (res.status === 204) return undefined as T;
  const j = await res.json().catch(() => ({}));
  if (!res.ok) throw new DirectusError(res.status, (j as { errors?: { message: string }[] }).errors?.[0]?.message ?? `Directus ${res.status}`);
  return (j as { data: T }).data;
}

export const dx = {
  list: <T>(collection: string, q?: Query) => call<T[]>("GET", `/items/${collection}?${qs(q)}`),
  get: <T>(collection: string, id: string, fields?: string[]) => call<T>("GET", `/items/${collection}/${encodeURIComponent(id)}${fields ? `?fields=${fields.join(",")}` : ""}`),
  create: <T>(collection: string, data: Record<string, unknown>) => call<T>("POST", `/items/${collection}`, data),
  update: <T>(collection: string, id: string, data: Record<string, unknown>) => call<T>("PATCH", `/items/${collection}/${encodeURIComponent(id)}`, data),
  remove: (collection: string, id: string) => call<void>("DELETE", `/items/${collection}/${encodeURIComponent(id)}`),
  removeMany: (collection: string, ids: string[]) => (ids.length ? call<void>("DELETE", `/items/${collection}`, ids) : Promise.resolve()),
  upload: (form: FormData) => call<{ id: string; type: string; filesize: string }>("POST", "/files", form),
  file: (id: string) => call<{ id: string; type: string; owner_member: string | null; visibility: string; filename_download: string }>("GET", `/files/${encodeURIComponent(id)}?fields=id,type,owner_member,visibility,filename_download`),
  updateFile: (id: string, data: Record<string, unknown>) => call<unknown>("PATCH", `/files/${encodeURIComponent(id)}`, data),
  files: <T>(q?: Query) => call<T[]>("GET", `/files?${qs(q)}`),
  removeFile: (id: string) => call<void>("DELETE", `/files/${encodeURIComponent(id)}`),
  asset: (id: string, transform?: string) => call<Response>("GET", `/assets/${encodeURIComponent(id)}${transform ? `?${transform}` : ""}`, undefined, true),
  folders: () => call<{ id: string; name: string }[]>("GET", "/folders?limit=-1"),
};

let folderCache: Record<string, string> | null = null;
export async function folderId(name: string): Promise<string | undefined> {
  if (!folderCache) folderCache = Object.fromEntries((await dx.folders()).map((f) => [f.name, f.id]));
  return folderCache[name];
}
