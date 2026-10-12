#!/usr/bin/env python3
"""
Convert a Claude Design board (<x-dc> HTML) into JSX + scoped CSS.

  python3 scripts/dc2jsx.py <board.dc.html> <scope-class> <out.jsx> <out.css> [--select "<css selector>"]

- Keeps the board's structure and inline styles 1:1 (fidelity first).
- Board stylesheet is scoped under `.<scope-class>` and palette hexes become CSS variables
  so dark mode works through the same tokens as the rest of the site.
- `{{hole}}` placeholders become `{v.hole}`.
- Optional --select extracts only the first element matching a simple selector
  (tag#id, tag.class, or [data-frame=...]) — used to pull one page mock out of a spec board.
"""
import re, sys, json
from html.parser import HTMLParser

PALETTE = {
    "#15161C": "var(--ink)", "#15161c": "var(--ink)",
    "#E5242F": "var(--red)", "#e5242f": "var(--red)",
    "#C41822": "var(--red-deep)", "#c41822": "var(--red-deep)",
    "#F6F6F8": "var(--paper)", "#f6f6f8": "var(--paper)",
    "#FAFAFB": "var(--paper-2)", "#FAFAFC": "var(--paper-2)", "#FCFCFD": "var(--paper-2)",
    "#555A6B": "var(--slate)", "#555a6b": "var(--slate)",
    "#8A8F9E": "var(--grey)", "#8a8f9e": "var(--grey)",
    "#9A9FB0": "var(--grey-2)", "#A7ABB8": "var(--grey-3)", "#B4B8C2": "var(--grey-4)", "#7D8292": "var(--grey-5)",
    "#E6E6EC": "var(--line)", "#e6e6ec": "var(--line)",
    "#ECEDF1": "var(--line-soft)", "#D8D9E0": "var(--line-2)", "#DDDEE5": "var(--line-2)",
    "#2A2C36": "var(--line-dark)", "#23242E": "var(--fg-2)", "#2C2E39": "var(--fg-3)",
    "#1C1E27": "var(--surface-dark-2)", "#D8D9E0": "var(--line-2)",
}
# colours that must stay literal (on dark surfaces) — handled by context: we only swap in CSS
# values that are text/bg on light surfaces is impossible to know; so we swap everything and
# let dark-mode tokens remap. Exceptions below are never swapped.
KEEP = {"#0E0F14", "#17181F", "#191A22", "#1C1E27"}

VOID = {"area", "base", "br", "col", "embed", "hr", "img", "input", "link", "meta", "param", "source", "track", "wbr", "path", "circle", "rect", "line", "polyline", "polygon", "use", "stop", "ellipse"}
ATTR_MAP = {
    "class": "className", "for": "htmlFor", "tabindex": "tabIndex", "readonly": "readOnly", "maxlength": "maxLength",
    "autocomplete": "autoComplete", "autofocus": "autoFocus", "colspan": "colSpan", "rowspan": "rowSpan", "srcset": "srcSet",
    "stroke-width": "strokeWidth", "stroke-linecap": "strokeLinecap", "stroke-linejoin": "strokeLinejoin", "stroke-dasharray": "strokeDasharray",
    "stroke-dashoffset": "strokeDashoffset", "fill-rule": "fillRule", "clip-rule": "clipRule", "fill-opacity": "fillOpacity", "stroke-opacity": "strokeOpacity",
    "stop-color": "stopColor", "stop-opacity": "stopOpacity", "font-size": "fontSize", "font-weight": "fontWeight", "font-family": "fontFamily",
    "text-anchor": "textAnchor", "dominant-baseline": "dominantBaseline", "letter-spacing": "letterSpacing", "patternunits": "patternUnits",
    "patterntransform": "patternTransform", "preserveaspectratio": "preserveAspectRatio", "viewbox": "viewBox", "gradientunits": "gradientUnits",
    "gradienttransform": "gradientTransform", "xlink:href": "xlinkHref", "aria-hidden": "aria-hidden", "xmlns:xlink": "xmlnsXlink", "clip-path": "clipPath",
    "vector-effect": "vectorEffect", "shape-rendering": "shapeRendering", "marker-end": "markerEnd", "stroke-miterlimit": "strokeMiterlimit",
}
BOOL_ATTRS = {"checked", "disabled", "selected", "hidden", "required", "open", "multiple", "readonly", "autofocus"}


def swap_colors(s: str) -> str:
    def rep(m):
        h = m.group(0)
        if h.upper() in KEEP:
            return h
        return PALETTE.get(h, PALETTE.get(h.upper(), h))
    return re.sub(r"#[0-9A-Fa-f]{6}\b|#[0-9A-Fa-f]{3}\b", rep, s)


def style_to_obj(style: str) -> str:
    out = []
    for decl in style.split(";"):
        if ":" not in decl:
            continue
        k, v = decl.split(":", 1)
        k = k.strip()
        v = swap_colors(v.strip())
        imp = v.endswith("!important")
        if imp:
            v = v.replace("!important", "").strip()
        ck = re.sub(r"-([a-z])", lambda m: m.group(1).upper(), k)
        if k.startswith("--"):
            ck = f'"{k}"'
        if imp:
            v += " !important"  # React drops !important; keep note
        out.append(f"{ck}: {json.dumps(v)}")
    return "{{ " + ", ".join(out) + " }}"


def esc_text(t: str) -> str:
    # JSX text: holes first, then escape remaining braces
    parts = re.split(r"(\{\{\s*[\w.]+\s*\}\})", t)
    out = []
    for p in parts:
        m = re.match(r"\{\{\s*([\w.]+)\s*\}\}$", p)
        if m:
            out.append("{v." + m.group(1).replace(".", "_") + "}")
        else:
            out.append(p.replace("{", "{'{'}").replace("}", "{'}'}"))
    return "".join(out)


class Conv(HTMLParser):
    def __init__(self):
        super().__init__(convert_charrefs=False)
        self.out = []
        self.stack = []
        self.skip = 0

    def handle_starttag(self, tag, attrs):
        if tag in ("script", "style", "link", "meta", "title", "head", "html", "body", "x-dc", "helmet"):
            if tag in ("script", "style", "title", "head"):
                self.skip += 1
            return
        parts = []
        merged = {}
        for k, val in attrs:
            if k.lower() == "class":
                merged["class"] = (merged.get("class", "") + " " + (val or "")).strip()
        attrs = [(k, v) for k, v in attrs if k.lower() != "class"] + ([("class", merged["class"])] if "class" in merged else [])
        for k, val in attrs:
            lk = k.lower()
            if lk == "style" and val:
                parts.append(f"style={style_to_obj(val)}")
                continue
            name = ATTR_MAP.get(lk, lk)
            if lk.startswith("data-") or lk.startswith("aria-"):
                name = lk
            if val is None:
                parts.append(name if name in BOOL_ATTRS or True else name)
                continue
            if lk in BOOL_ATTRS:
                parts.append(f"{name}={{true}}")
                continue
            val = swap_colors(val) if lk in ("fill", "stroke", "stop-color", "color") else val
            if "{{" in val:
                val = re.sub(r"\{\{\s*([\w.]+)\s*\}\}", lambda m: "${v." + m.group(1).replace(".", "_") + "}", val)
                parts.append(f"{name}={{`{val}`}}")
            else:
                parts.append(f'{name}="{val.replace(chr(34), "&quot;")}"')
        attr_s = (" " + " ".join(parts)) if parts else ""
        if tag in VOID:
            self.out.append(f"<{tag}{attr_s} />")
        else:
            self.out.append(f"<{tag}{attr_s}>")
            self.stack.append(tag)

    def handle_startendtag(self, tag, attrs):
        self.handle_starttag(tag, attrs)
        if tag not in VOID and self.stack and self.stack[-1] == tag and tag not in ("script", "style", "link", "meta", "title", "head", "html", "body", "x-dc", "helmet"):
            self.stack.pop()
            self.out.append(f"</{tag}>")

    def handle_endtag(self, tag):
        if tag in ("script", "style", "title", "head"):
            self.skip = max(0, self.skip - 1)
            return
        if tag in ("link", "meta", "html", "body", "x-dc", "helmet") or tag in VOID:
            return
        if self.stack and self.stack[-1] == tag:
            self.stack.pop()
            self.out.append(f"</{tag}>")

    def handle_data(self, d):
        if self.skip:
            return
        if d.strip() == "":
            if "\n" in d:
                self.out.append("\n")
            return
        self.out.append(esc_text(d))

    def handle_entityref(self, name):
        if not self.skip:
            self.out.append(f"&{name};")

    def handle_charref(self, name):
        if not self.skip:
            self.out.append(f"&#{name};")

    def handle_comment(self, data):
        if not self.skip:
            self.out.append("{/* " + data.strip().replace("*/", "* /") + " */}")


def extract_style(html: str) -> str:
    m = re.search(r"<style>(.*?)</style>", html, re.S)
    return m.group(1) if m else ""


def scope_css(css: str, scope: str) -> str:
    css = swap_colors(css)
    css = re.sub(r"/\*.*?\*/", "", css, flags=re.S)
    out = []
    # split top-level blocks incl. @media
    i = 0
    def scope_rules(block: str) -> str:
        res = []
        for rule in re.finditer(r"([^{}]+)\{([^{}]*)\}", block):
            sels, body = rule.group(1).strip(), rule.group(2).strip()
            if not sels:
                continue
            scoped = []
            for s in sels.split(","):
                s = s.strip()
                if s in ("body", "html"):
                    scoped.append(f".{scope}")
                elif s.startswith("body "):
                    scoped.append(f".{scope} " + s[5:])
                else:
                    scoped.append(f".{scope} {s}")
            res.append(", ".join(scoped) + "{" + body + "}")
        return "\n".join(res)
    pos = 0
    for m in re.finditer(r"@media[^{]+\{", css):
        out.append(scope_rules(css[pos:m.start()]))
        # find matching brace
        depth = 1
        j = m.end()
        while j < len(css) and depth:
            if css[j] == "{":
                depth += 1
            elif css[j] == "}":
                depth -= 1
            j += 1
        out.append(css[m.start():m.end()] + "\n" + scope_rules(css[m.end():j - 1]) + "\n}")
        pos = j
    out.append(scope_rules(css[pos:]))
    return "\n".join(out)


def body_html(html: str) -> str:
    m = re.search(r"</helmet>(.*)</x-dc>", html, re.S)
    return m.group(1) if m else html


def select_fragment(html: str, selector: str) -> str:
    """Very small selector support: find first element start tag whose attrs match, return its full outer HTML."""
    m = re.match(r"(\w+)?(?:#([\w-]+))?(?:\.([\w-]+))?(?:\[data-frame=([\w-]+)\])?$", selector)
    tag, id_, cls, frame = m.groups()
    pat = re.compile(r"<(\w+)([^>]*)>")
    for mm in pat.finditer(html):
        t, attrs = mm.group(1), mm.group(2)
        if tag and t != tag:
            continue
        if id_ and not re.search(r'id="%s"' % re.escape(id_), attrs):
            continue
        if cls and not re.search(r'class="[^"]*\b%s\b[^"]*"' % re.escape(cls), attrs):
            continue
        if frame and not re.search(r'data-frame="%s"' % re.escape(frame), attrs):
            continue
        # walk to matching close
        depth = 0
        pos = mm.start()
        for tk in re.finditer(r"<(/?)(\w+)[^>]*?(/?)>", html[mm.start():]):
            closing, name, selfclose = tk.group(1), tk.group(2), tk.group(3)
            if name in VOID or selfclose:
                continue
            if not closing:
                depth += 1
            else:
                depth -= 1
                if depth == 0:
                    return html[mm.start(): mm.start() + tk.end()]
        break
    raise SystemExit("selector not found: " + selector)


def main():
    src, scope, out_jsx, out_css = sys.argv[1:5]
    html = open(src, encoding="utf-8").read()
    css = scope_css(extract_style(html), scope)
    frag = body_html(html)
    if "--select" in sys.argv:
        frag = select_fragment(frag, sys.argv[sys.argv.index("--select") + 1])
    c = Conv()
    c.feed(frag)
    jsx = "".join(c.out)
    # collapse blank lines
    jsx = re.sub(r"\n{3,}", "\n\n", jsx)
    open(out_jsx, "w", encoding="utf-8").write(jsx)
    open(out_css, "w", encoding="utf-8").write(css)
    print("jsx", len(jsx), "css", len(css))


if __name__ == "__main__":
    main()
