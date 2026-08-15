#!/usr/bin/env python3
"""WCAG 2.x contrast-ratio checker — the ground-truth check that replaces prose
about "use enough contrast". No third-party dependencies.

Usage:
    check_contrast.py FG BG [--large]        # one pair, human-readable
    check_contrast.py --json pairs.json      # many pairs; nonzero exit if any fail AA

Colors: #rgb, #rrggbb, or "r,g,b" (0-255). A pair fails if it does not meet
WCAG AA (4.5:1 normal text, 3:1 large text >=18.66px bold or >=24px).
The JSON form takes a list of {"fg","bg","label"?,"large"?}.
"""
from __future__ import annotations
import argparse, json, sys


def parse_color(s: str) -> tuple[int, int, int]:
    s = s.strip()
    if s.startswith("#"):
        h = s[1:]
        if len(h) == 3:
            h = "".join(c * 2 for c in h)
        if len(h) != 6:
            raise ValueError(f"bad hex color: {s!r}")
        return tuple(int(h[i:i + 2], 16) for i in (0, 2, 4))  # type: ignore[return-value]
    if "," in s:
        parts = [int(p) for p in s.split(",")]
        if len(parts) != 3 or not all(0 <= p <= 255 for p in parts):
            raise ValueError(f"bad rgb color: {s!r}")
        return parts[0], parts[1], parts[2]
    raise ValueError(f"unrecognized color: {s!r}")


def _lin(c: int) -> float:
    cs = c / 255
    return cs / 12.92 if cs <= 0.03928 else ((cs + 0.055) / 1.055) ** 2.4


def luminance(rgb: tuple[int, int, int]) -> float:
    r, g, b = (_lin(c) for c in rgb)
    return 0.2126 * r + 0.7152 * g + 0.0722 * b


def ratio(fg: str, bg: str) -> float:
    l1, l2 = luminance(parse_color(fg)), luminance(parse_color(bg))
    hi, lo = max(l1, l2), min(l1, l2)
    return (hi + 0.05) / (lo + 0.05)


def verdicts(r: float, large: bool = False) -> dict[str, bool]:
    return {
        "AA": r >= (3.0 if large else 4.5),
        "AAA": r >= (4.5 if large else 7.0),
    }


def main() -> int:
    ap = argparse.ArgumentParser(description="WCAG contrast checker")
    ap.add_argument("fg", nargs="?")
    ap.add_argument("bg", nargs="?")
    ap.add_argument("--large", action="store_true", help="large text thresholds")
    ap.add_argument("--json", metavar="FILE", help="check a list of pairs")
    a = ap.parse_args()

    if a.json:
        pairs = json.load(open(a.json))
        failures = 0
        for p in pairs:
            r = ratio(p["fg"], p["bg"])
            v = verdicts(r, p.get("large", False))
            mark = "PASS" if v["AA"] else "FAIL"
            if not v["AA"]:
                failures += 1
            label = p.get("label", f'{p["fg"]} on {p["bg"]}')
            print(f"{mark}  {r:5.2f}:1  AA={v['AA']} AAA={v['AAA']}  {label}")
        print(f"\n{len(pairs)} pair(s), {failures} below AA")
        return 1 if failures else 0

    if not (a.fg and a.bg):
        ap.error("provide FG and BG, or --json FILE")
    r = ratio(a.fg, a.bg)
    v = verdicts(r, a.large)
    print(f"{r:.2f}:1  ({'large' if a.large else 'normal'} text)")
    print(f"  AA  {'pass' if v['AA'] else 'FAIL'}")
    print(f"  AAA {'pass' if v['AAA'] else 'FAIL'}")
    return 0 if v["AA"] else 1


if __name__ == "__main__":
    sys.exit(main())
