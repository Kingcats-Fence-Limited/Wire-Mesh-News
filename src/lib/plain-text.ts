/* HTML → plain text for search, previews and feeds. Tags are removed until none are left and
   angle brackets are dropped, so the result can never carry markup; entities are decoded with
   &amp; last (so "&amp;lt;" stays "&lt;"). */
export function htmlToText(html: string): string {
  let out = html.replace(/<!\[CDATA\[|\]\]>/g, ""), prev = "";
  while (out !== prev) { prev = out; out = out.replace(/<[^<>]*>/g, " "); }
  return out
    .replace(/[<>]/g, " ")
    .replace(/&nbsp;/g, " ").replace(/&#8217;|&rsquo;/g, "’").replace(/&quot;/g, '"').replace(/&#39;/g, "'")
    .replace(/&lt;|&gt;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/\s+/g, " ")
    .trim();
}
