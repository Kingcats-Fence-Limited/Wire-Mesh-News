/* The site-search index as static JSON. The header search loads it the first time it opens,
   so article text is not part of every page's JavaScript. Rebuilt with the hourly ISR cycle. */
import { SEARCH_INDEX } from "@/lib/search";

export const dynamic = "force-static";
export const revalidate = 3600;

export function GET() {
  return Response.json(SEARCH_INDEX, { headers: { "Cache-Control": "public, max-age=300, stale-while-revalidate=3600" } });
}
