"""One-off migration of hard-coded Mint Lime colours to Touchstone.

Rules (see design/TOUCHSTONE.md): no dark sections, lime is never text,
charcoal #1D201E for text, paper #F6F5F1 for pages, stone #ECEAE3 for quiet
edges and fills, lime-soft #EAF8D6 for tints.
Already applied on 2026-09-28. To rerun, from apps/web: python3 ../../design/touchstone-codemod.py
"""
import re, pathlib, collections

INK, INK2, MUTED = "1D201E", "3A3F3C", "5A605C"
PAPER, STONE, STONE2 = "F6F5F1", "ECEAE3", "E1DED4"
LIME, LIME2, LIMESOFT, LIMESOFT2 = "B7F56A", "A2EA4E", "EAF8D6", "E2F6C6"

TEXTISH = {"text", "fill", "stroke", "decoration", "caret", "placeholder", "outline", "ring", "accent", "ring-offset"}
BORDERISH = {"border", "border-t", "border-b", "border-l", "border-r", "border-x", "border-y", "divide"}
BGISH = {"bg", "from", "via", "to"}

TEXT_MAP = {"1F3A00": INK, "B7F56A": INK, "99D055": INK, "DFFBBC": INK, "F9FCF5": INK, "4E8C16": INK,
            "4D7220": MUTED, "166534": INK, "065F46": INK, "3F6212": INK, "2D5004": INK, "DCFAB7": INK,
            "3A5C13": INK2, "8FA874": "8B908B", "CFF89D": INK}
BORDER_MAP = {"E5FBC9": STONE, "D1E8B8": STONE, "3A5C13": STONE, "82C337": STONE, "375811": STONE,
              "99D055": STONE, "E5E7EB": STONE, "B7F56A": STONE, "1F3A00": INK, "DCFAB7": STONE, "CFF89D": STONE}
BG_MAP = {"2D5004": LIME2, "2E5400": LIME, "192E00": LIME2, "142400": LIME2, "0F1A00": LIME2, "0A1100": LIME2,
          "E5FBC9": STONE, "F9FCF5": PAPER, "DCFAB7": LIMESOFT, "CFF89D": LIMESOFT2, "F8F9FA": PAPER,
          "EBF4DD": LIMESOFT, "F4F9ED": PAPER, "F4FBEA": PAPER, "F7FEE7": PAPER, "F0FDF4": PAPER, "ECFDF5": PAPER,
          "F1FDE1": PAPER, "A8EB58": LIME2, "A6EC55": LIME2, "CBF79C": LIME2, "CBF799": LIME2, "99D055": LIME2,
          "4E8C16": LIME, "EEF3FF": STONE, "F3F4F6": STONE, "E5E7EB": STONE, "DFFBBC": LIMESOFT}

UTIL = re.compile(r"(?P<pre>(?:[a-z0-9-]+:)*)(?P<util>bg|text|border(?:-[tblrxy])?|divide|ring(?:-offset)?|outline|accent|from|via|to|fill|stroke|decoration|caret|placeholder)-\[#(?P<hex>[0-9A-Fa-f]{6})\](?P<op>/\d+)?")
stats = collections.Counter()

def util_sub(m):
    pre, util, hexv, op = m.group("pre"), m.group("util"), m.group("hex").upper(), m.group("op") or ""
    new = None
    if util in TEXTISH:
        new = TEXT_MAP.get(hexv)
    elif util in BORDERISH:
        if hexv == "B7F56A" and re.search(r"(focus|focus-within|focus-visible|active|aria-[a-z-]+|data-\[[^\]]*\]|peer-[a-z-]+|group-[a-z-]+):$", pre):
            new = INK
        else:
            new = BORDER_MAP.get(hexv)
    elif util in BGISH:
        if hexv == "1F3A00":
            new = INK if op else LIME
        else:
            new = BG_MAP.get(hexv)
    if not new:
        return m.group(0)
    stats[(hexv, util)] += 1
    return f"{pre}{util}-[#{new}]{op}"

DARK_MARKERS = re.compile(r"from-black|via-black|to-black|bg-black|bg-\[#25D366\]|bg-\[#20B858\]|bg-danger-500|bg-red-|bg-\[#B04A1E\]|bg-\[#D9A441\]")
WHITE = re.compile(r"(?P<pre>(?:[a-z0-9-]+:)*)text-white(?P<op>/\d+)?(?![\w-])")
STRINGS = re.compile(r"(\"[^\"\n]*\"|'[^'\n]*'|`[^`]*`)")

def white_sub(m):
    stats[("white", "text")] += 1
    return f"{m.group('pre')}text-[#{INK}]{m.group('op') or ''}"

LITERAL = {"1F3A00": INK, "F9FCF5": PAPER, "E5FBC9": STONE, "DCFAB7": LIMESOFT, "CFF89D": LIMESOFT2,
           "2D5004": INK2, "4D7220": MUTED, "3A5C13": INK2, "192E00": INK, "142400": INK, "99D055": LIME2,
           "D1E8B8": STONE, "8FA874": "8B908B", "DFFBBC": LIMESOFT, "0A1100": INK, "0F1A00": INK}
LIT = re.compile(r"#(" + "|".join(LITERAL) + r")\b", re.I)

root = pathlib.Path("src")
changed = 0
for path in list(root.rglob("*.tsx")) + list(root.rglob("*.ts")):
    src = path.read_text()
    out = UTIL.sub(util_sub, src)
    if DARK_MARKERS.search(out):
        # Only convert white text inside class strings that now sit on lime.
        out = STRINGS.sub(lambda s: WHITE.sub(white_sub, s.group(0)) if f"bg-[#{LIME}]" in s.group(0) and not DARK_MARKERS.search(s.group(0)) else s.group(0), out)
    else:
        out = WHITE.sub(white_sub, out)
    out = LIT.sub(lambda m: (stats.update([("literal", m.group(1).upper())]) or "#" + LITERAL[m.group(1).upper()]), out)
    # Pill controls become 12px controls, shadows go.
    out = re.sub(r"\bshadow-(2xs|xs|sm|md|lg|xl|2xl)\b", "", out)
    out = re.sub(r"\bshadow-\[[^\]]+\]", "", out)
    if out != src:
        path.write_text(out)
        changed += 1

print("files changed:", changed)
for k, v in stats.most_common(40):
    print(v, k)
