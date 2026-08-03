#!/usr/bin/env python3
"""Check (or fix) prose line-wrapping across registry skill markdown.

Skill docs use one line per prose paragraph (soft wrap): the editor wraps text
visually, so hard-wrapping at a fixed column is avoided. This script joins each
hard-wrapped prose paragraph into a single line and leaves already-single-line
paragraphs unchanged.

It preserves verbatim: YAML frontmatter, fenced code blocks, headings, thematic
breaks, table rows, blockquotes, HTML comments, list items, and any
*preformatted* block — one containing an indented line, a flow arrow (-> / =>), a
box-drawing char, or a stack of parallel fields/labels (decision trees, ASCII
diagrams, template fields).

Usage:
  python3 scripts/check_prose_wrap.py            # check; report drift, exit 0 (non-blocking)
  python3 scripts/check_prose_wrap.py --strict   # check; exit 1 if any file has drift
  python3 scripts/check_prose_wrap.py --fix       # rewrite files in place

The detector is heuristic, so --fix is intended for local, human-reviewed use.
CI runs check mode only: it annotates drift without auto-changing content.
"""
import glob
import os
import re
import sys

LIST_RE = re.compile(r'^(\s*)([-*+]|\d+[.)])\s')
HEADING_RE = re.compile(r'^\s{0,3}#{1,6}\s')
HR_RE = re.compile(r'^\s{0,3}([-*_])(\s*\1){2,}\s*$')
FENCE_RE = re.compile(r'^\s*(```|~~~)')
TABLE_RE = re.compile(r'^\s*\|')
QUOTE_RE = re.compile(r'^\s*>')
BOX_RE = re.compile(r'[│┃├└┌┐┘┴┬┼─━╱╲╳╭╮╰╯]')
ARROW_RE = re.compile(r'->|=>|<-')
BOLD_LED = re.compile(r'^\s*\*\*')                          # **Label:** ...
ITALIC_WHOLE = re.compile(r'^\s*\*[^*].*[^*]\*\s*$')        # *whole line italic*
PLACEHOLDER_WHOLE = re.compile(r'^\s*<[^>]+>[.,;:)]?\s*$')  # a bare <placeholder> line
LABEL_LED = re.compile(r"^\s*[A-Za-z][A-Za-z0-9 /'-]{0,24}:(\s|$)")  # Good: / Note: ...


def is_boundary(line):
    """Ends a paragraph/list block and passes through as its own line."""
    return (line.strip() == '' or HEADING_RE.match(line) or HR_RE.match(line)
            or TABLE_RE.match(line) or QUOTE_RE.match(line)
            or line.lstrip().startswith('<!--')
            or line.lstrip().startswith('-->'))


def is_preformatted(block):
    """A gathered block is preformatted (keep verbatim) if it is not plain prose:
    an indented line, a flow arrow, a box-drawing char, or a stack of parallel
    short fields/labels (e.g. **Primary:** / *created: <date>* / Good: ...)."""
    bold = whole_italic = placeholder = label = 0
    for ln in block:
        if ln[:1] in (' ', '\t'):                 # indented line = code/outline
            return True
        if ARROW_RE.search(ln) or BOX_RE.search(ln):
            return True
        if BOLD_LED.match(ln):
            bold += 1
        if ITALIC_WHOLE.match(ln):
            whole_italic += 1
        if PLACEHOLDER_WHOLE.match(ln):
            placeholder += 1
        if LABEL_LED.match(ln):
            label += 1
    return bold >= 2 or whole_italic >= 2 or label >= 2 or placeholder >= 1


def reflow(src):
    lines = src.split('\n')
    out = []
    i, n = 0, len(lines)

    if lines and lines[0].strip() == '---':          # frontmatter
        out.append(lines[0]); i = 1
        while i < n and lines[i].strip() != '---':
            out.append(lines[i]); i += 1
        if i < n:
            out.append(lines[i]); i += 1

    while i < n:
        line = lines[i]

        fence = FENCE_RE.match(line)                 # fenced code
        if fence:
            out.append(line); i += 1
            marker = fence.group(1)
            while i < n and not re.match(r'^\s*' + re.escape(marker), lines[i]):
                out.append(lines[i]); i += 1
            if i < n:
                out.append(lines[i]); i += 1
            continue

        if is_boundary(line):                        # blank/heading/table/etc.
            out.append(line); i += 1
            continue

        if LIST_RE.match(line):                      # list item: unwrap
            buf = [line.rstrip()]
            i += 1
            while i < n and not is_boundary(lines[i]) and not LIST_RE.match(lines[i]) \
                    and not FENCE_RE.match(lines[i]):
                buf.append(lines[i].strip())
                i += 1
            out.append(' '.join(x if k == 0 else x.strip() for k, x in enumerate(buf)))
            continue

        buf = [line]                                 # gather a block
        i += 1
        while i < n and not is_boundary(lines[i]) and not LIST_RE.match(lines[i]) \
                and not FENCE_RE.match(lines[i]):
            buf.append(lines[i])
            i += 1
        if is_preformatted(buf):
            out.extend(x.rstrip() for x in buf)              # keep verbatim
        else:
            out.append(' '.join(x.strip() for x in buf))     # one line per paragraph

    return '\n'.join(out)


def main(argv):
    fix = '--fix' in argv
    strict = '--strict' in argv
    root = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
    paths = sorted(glob.glob(os.path.join(root, 'registry', '**', '*.md'),
                             recursive=True))
    drifted = []
    for path in paths:
        with open(path, encoding='utf-8') as f:
            original = f.read()
        result = reflow(original)
        if not result.endswith('\n'):
            result += '\n'
        if result != original:
            drifted.append(os.path.relpath(path, root))
            if fix:
                with open(path, 'w', encoding='utf-8') as f:
                    f.write(result)

    if fix:
        print(f'reflowed {len(drifted)} file(s)')
        for rel in drifted:
            print(f'  {rel}')
        return 0

    for rel in drifted:
        print(f'::warning file={rel}::hard-wrapped prose — run '
              f'`python3 scripts/check_prose_wrap.py --fix` to reflow to one line per paragraph')
    if drifted:
        print(f'\n{len(drifted)} file(s) have hard-wrapped prose. '
              f'Fix locally with: python3 scripts/check_prose_wrap.py --fix')
    else:
        print('prose wrapping OK: every skill file is one line per paragraph')
    return 1 if (strict and drifted) else 0


if __name__ == '__main__':
    sys.exit(main(sys.argv[1:]))
