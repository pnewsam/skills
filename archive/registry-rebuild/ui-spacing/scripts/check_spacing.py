#!/usr/bin/env python3
"""Spacing scale-conformance lint — the ground-truth check that replaces prose
about "use the scale, not arbitrary pixel values". No third-party dependencies.

Scans CSS/SCSS/JSX/TSX text for spacing values (margin, padding, gap, inset,
top/right/bottom/left, and Tailwind arbitrary utilities like p-[13px]) and flags
any px value not on the spacing scale, with the nearest on-scale value.

Usage:
    check_spacing.py FILE [FILE ...]         # scan files
    cat x.css | check_spacing.py -           # scan stdin
    check_spacing.py --allowed 0,4,8,12,16,24,32,48,64 FILE
    check_spacing.py --base 8 FILE           # multiples of 8 (default base 4)

Exit status is nonzero if any off-scale spacing value is found.
"""
from __future__ import annotations
import argparse, re, sys

SPACING_PROP = re.compile(
    r"\b(margin|padding|gap|row-gap|column-gap|inset|top|right|bottom|left)"
    r"(?:-(?:top|right|bottom|left|inline|block|start|end|x|y))?\s*:\s*([^;{}]+)",
    re.I,
)
TW_ARBITRARY = re.compile(r"\b(?:p|m|gap|space|inset|top|right|bottom|left)[a-z]*-\[(\d+)px\]")
PX = re.compile(r"(\d+)px")


def nearest(v: int, allowed: list[int]) -> int:
    return min(allowed, key=lambda a: abs(a - v))


def scan(text: str, allowed: set[int]) -> list[tuple[int, int, str]]:
    """Return (line_no, value, context) for each off-scale spacing value."""
    out = []
    allow_sorted = sorted(allowed)
    for i, line in enumerate(text.splitlines(), 1):
        vals: list[tuple[int, str]] = []
        for m in SPACING_PROP.finditer(line):
            for px in PX.finditer(m.group(2)):
                vals.append((int(px.group(1)), m.group(0).strip()))
        for m in TW_ARBITRARY.finditer(line):
            vals.append((int(m.group(1)), m.group(0)))
        for v, ctx in vals:
            if v != 0 and v not in allowed:
                out.append((i, v, ctx))
    return out


def main() -> int:
    ap = argparse.ArgumentParser(description="Spacing scale-conformance lint")
    ap.add_argument("files", nargs="+", help="files to scan, or - for stdin")
    ap.add_argument("--base", type=int, default=4, help="scale base in px (default 4)")
    ap.add_argument("--max", type=int, default=256, help="largest scale value (default 256)")
    ap.add_argument("--allowed", help="explicit comma-separated allowed px values")
    a = ap.parse_args()

    if a.allowed:
        allowed = {int(x) for x in a.allowed.split(",")}
    else:
        allowed = {n for n in range(0, a.max + 1, a.base)}

    total = 0
    for f in a.files:
        text = sys.stdin.read() if f == "-" else open(f, encoding="utf-8").read()
        hits = scan(text, allowed)
        for line, v, ctx in hits:
            near = nearest(v, list(allowed))
            print(f"{f}:{line}: {v}px off-scale -> nearest {near}px   [{ctx[:60]}]")
        total += len(hits)
    scale_desc = a.allowed or f"multiples of {a.base}px"
    print(f"\n{total} off-scale spacing value(s) (scale: {scale_desc})")
    return 1 if total else 0


if __name__ == "__main__":
    sys.exit(main())
