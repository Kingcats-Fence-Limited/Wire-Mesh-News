/* Structured data (schema.org JSON-LD). `<` is escaped so text from content can never close
   the script element. JSON-LD is data, not script, so the CSP does not need to allow it. */
export function JsonLd({ data }: { data: object | object[] }) {
  const json = JSON.stringify(data).replace(/</g, "\\u003c").replace(/[\u2028\u2029]/g, (c) => (c === "\u2028" ? "\\u2028" : "\\u2029"));
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: json }} />;
}
