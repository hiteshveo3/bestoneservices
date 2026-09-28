"""Second Touchstone pass over apps/web/src (applied 2026-09-28).

House rules: no pill controls, no dividing lines (space and tone separate
blocks), filled input fields with an ink focus ring.
Run from apps/web: python3 ../../design/touchstone-sweep.py
"""
import re, pathlib, collections

stats = collections.Counter()
STONE, PAPER = "#ECEAE3", "#F6F5F1"
CLASS_ATTR = re.compile(r'(className=)("([^"]*)"|\{`([^`]*)`\})', re.S)
FIELD_TAG = re.compile(r"<(input|select|textarea)\b[^>]*?className=(\"[^\"]*\"|\{`[^`]*`\})", re.S)

def tokens(s):
    return s.split()

def sub_tokens(cls, fn):
    # keep ${...} expressions intact by only touching whitespace-separated plain tokens
    parts = re.split(r"(\$\{[^}]*\})", cls)
    return "".join(p if p.startswith("${") else fn(p) for p in parts)

def field_rule(cls):
    def fn(p):
        o = p
        p = re.sub(r"(?<![\w:-])bg-white(?![\w/-])", f"bg-[{STONE}]", p)
        p = p.replace(f"border-[{STONE}]", "border-transparent")
        p = re.sub(r"(?<![\w:-])rounded-full(?![\w-])", "rounded-xl", p)
        if p != o: stats["field"] += 1
        return p
    out = sub_tokens(cls, fn)
    if "focus:bg-white" not in out:
        out = out.rstrip() + " focus:bg-white focus:border-[#1D201E]"
    return out

def generic_rule(cls):
    def fn(p):
        o = p
        # 1. Pills become 12px controls (6px for small labels)
        if re.search(r"(?<![\w:-])rounded-full(?![\w-])", p) and re.search(r"(?<![\w-])p[xy]-", cls):
            small = re.search(r"text-(xs|\[1[0-3]px\])", cls)
            p = re.sub(r"(?<![\w:-])rounded-full(?![\w-])", "rounded-md" if small else "rounded-xl", p)
            stats["pill"] += 1
        # 2. Dividing lines go
        for pat in [rf"(?<![\w:-])border-[tbxy](-\d)?(?![\w-])", r"(?<![\w:-])divide-[xy](-\d)?(?![\w-])", rf"(?<![\w:-])divide-\[{re.escape(STONE)}\](/\d+)?"]:
            if re.search(pat, p):
                p = re.sub(pat, "", p); stats["line"] += 1
        # side borders keep only if another border width remains; stone side colour tokens go with them
        p = re.sub(rf"(?<![\w:-])border-[tbxy]-\[{re.escape(STONE)}\](/\d+)?", "", p)
        # 3. Hover outlines become hover tone
        if "hover:border-[#1D201E]" in p:
            p = p.replace("hover:border-[#1D201E]", "hover:bg-[#EAF8D6]"); stats["hover"] += 1
        return p
    out = sub_tokens(cls, fn)
    # 4. Full stone borders on filled surfaces go; paper cards become white cards
    if re.search(rf"(?<![\w:-])border(?![\w-])", out) and f"border-[{STONE}]" in out and "focus:" not in out:
        has_bg = re.search(r"(?<![\w:-])bg-(white|\[#[0-9A-Fa-f]{6}\]|lime|paper|stone)", out)
        if has_bg:
            out = re.sub(rf"(?<![\w:-])border(?![\w-])", "", out)
            out = re.sub(rf"(?<![\w:-])border-\[{re.escape(STONE)}\](/\d+)?", "", out)
            out = re.sub(rf"(?<![\w:-])bg-\[{re.escape(PAPER)}\](?![\w/])", "bg-white", out) if "rounded" in out else out
            stats["card-border"] += 1
    out = re.sub(r"[ \t]{2,}", " ", out)
    return out

def process(src):
    marks = {}
    def field_sub(m):
        attr = m.group(2)
        if attr.startswith('"'):
            new = '"' + field_rule(attr[1:-1]) + '"'
        else:
            new = "{`" + field_rule(attr[2:-2]) + "`}"
        key = f"@@FIELD{len(marks)}@@"
        marks[key] = new
        return m.group(0).replace(attr, key)
    src = FIELD_TAG.sub(field_sub, src)
    def cls_sub(m):
        if m.group(3) is not None:
            return m.group(1) + '"' + generic_rule(m.group(3)) + '"'
        return m.group(1) + "{`" + generic_rule(m.group(4)) + "`}"
    src = CLASS_ATTR.sub(cls_sub, src)
    for k, v in marks.items():
        src = src.replace(k, v)
    return src

changed = 0
for path in pathlib.Path("src").rglob("*.tsx"):
    if "components/touchstone" in str(path):
        continue
    s = path.read_text()
    out = process(s)
    if out != s:
        path.write_text(out); changed += 1
print("files changed:", changed, dict(stats))


# --- Pass 2 (2026-09-28): eyebrow badges become plain eyebrows; h1/h2 weights settle on 650 ---
EYEBROW_BADGE = re.compile(r'className="([^"]*\buppercase\b[^"]*)"')
HEAD_TAG = re.compile(r'(<h[12]\b[^>]*?className=")([^"]*)(")', re.S)

def eyebrow_sub(m):
    cls = m.group(1)
    if re.search(r"bg-\[#(EAF8D6|B7F56A)\]", cls) and re.search(r"text-(xs|\[1[0-2]px\])", cls) and re.search(r"(?<![\w-])px-", cls):
        stats["eyebrow"] += 1
        flex = "inline-flex items-center gap-1.5 " if "flex" in cls else ""
        return f'className="{flex}ts-eyebrow"'
    return m.group(0)

def head_sub(m):
    cls = re.sub(r"(?<![\w:-])font-(medium|normal|bold|semibold|extrabold)(?![\w-])", "font-[650]", m.group(2))
    if cls != m.group(2):
        stats["heading"] += 1
    return m.group(1) + cls + m.group(3)

stats.clear(); changed = 0
for path in pathlib.Path("src").rglob("*.tsx"):
    if "components/touchstone" in str(path):
        continue
    s = path.read_text()
    out = HEAD_TAG.sub(head_sub, EYEBROW_BADGE.sub(eyebrow_sub, s))
    if out != s:
        path.write_text(out); changed += 1
print("pass 2 files changed:", changed, dict(stats))
