import { EVENTS } from "@/lib/content/source";
import { SITE } from "@/lib/site";

export const dynamic = "force-static";

const d = (iso: string) => iso.replace(/-/g, "");
/* RFC 5545 text escaping; newlines are escaped too so a CMS value cannot inject extra calendar fields. */
const esc = (s: string) => s.replace(/\\/g, "\\\\").replace(/,/g, "\\,").replace(/;/g, "\\;").replace(/\r\n|\r|\n/g, "\\n");
const plusOne = (iso: string) => { const t = new Date(iso); t.setUTCDate(t.getUTCDate() + 1); return t.toISOString().slice(0, 10); };

/** iCalendar feed of the events calendar (all-day events; the site itself is the detail link). */
export function GET() {
  const lines = ["BEGIN:VCALENDAR", "VERSION:2.0", `PRODID:-//${SITE.name}//Events//EN`, "CALSCALE:GREGORIAN", `X-WR-CALNAME:${esc(SITE.name)} events`];
  for (const e of EVENTS) {
    lines.push("BEGIN:VEVENT", `UID:${e.slug}@wiremeshnews.com`, `DTSTAMP:${d(e.start)}T000000Z`, `DTSTART;VALUE=DATE:${d(e.start)}`, `DTEND;VALUE=DATE:${d(plusOne(e.end ?? e.start))}`, `SUMMARY:${esc(e.name)}`, `LOCATION:${esc(e.online ? "Online" : [e.venue, e.city].filter(Boolean).join(", "))}`, `DESCRIPTION:${esc(e.summary)}`, `URL:${SITE.url}/events/#${e.slug}`, "END:VEVENT");
  }
  lines.push("END:VCALENDAR");
  return new Response(lines.join("\r\n"), { headers: { "Content-Type": "text/calendar; charset=utf-8" } });
}
