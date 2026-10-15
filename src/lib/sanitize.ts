/* Article body HTML is rendered with dangerouslySetInnerHTML. Today it comes from our own
   seed files, but once it comes from the CMS (and from contributors' submissions) it must
   be treated as untrusted: only basic inline formatting and safe links survive. Runs on the
   server at render time, so nothing extra ships to the browser. */
import sanitizeHtml from "sanitize-html";

const OPTIONS: sanitizeHtml.IOptions = {
  allowedTags: ["a", "b", "strong", "i", "em", "u", "sup", "sub", "code", "br", "span", "abbr", "mark", "small"],
  allowedAttributes: { a: ["href", "title", "class", "rel", "target"], span: ["class"], abbr: ["title"] },
  allowedClasses: { a: ["std-link"], span: ["dropcap", "num", "mono"] },
  allowedSchemes: ["http", "https", "mailto"],
  allowProtocolRelative: false,
  transformTags: {
    a: (tag, attribs) => {
      const external = /^https?:\/\//i.test(attribs.href ?? "");
      return { tagName: "a", attribs: external ? { ...attribs, rel: "noopener noreferrer nofollow", target: "_blank" } : attribs };
    },
  },
};

export const cleanHtml = (html: string) => sanitizeHtml(html, OPTIONS);
