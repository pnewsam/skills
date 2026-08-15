#!/usr/bin/env python3
"""score_ab.py — turn raw A/B rep scores into the eviction-gate verdict.

Reads a `*_pilot_cases.json` (arms, gate, cases) and a scores file, and emits
the per-case table + gate verdict the family report pastes into
evals/results/. Stdlib only.

Scores file format (whitespace-separated, `#` comments allowed; blank rows
skipped):

    case_id   arm   rep   score   avoid_violations

- `score` is the per-rep 0-1 anchor score as scored by the blind judge: the
  formula from the case file — (fraction of must_include satisfied) minus 0.34
  per must_exclude present, floored at 0 — so must_exclude penalties are already
  inside the score; the `avoid_violations` column is only for the gate's
  separate "no B-only must_exclude" clause. If the column is missing, that
  clause is reported as not assessable.
- `--exclude case,arm,rep[,...]` removes degenerate reps (returned preamble
  only) recorded in the journal; excluded reps do not count toward means.
- Recovery rule: arm C "recovers" case k when meanC(k) >= meanA(k) - 0.10,
  matching the gate margin. Arm C rows are optional (C runs only where A - B
  > 0.15 per the case-file protocol).

Usage:
    python3 scripts/score_ab.py evals/ui_family_cases.json scores.tsv
    python3 scripts/score_ab.py ... --exclude controlled-form-perf,B,2

Exit codes: 0 gate PASS, 1 gate FAIL, 2 insufficient/invalid input.
"""

from __future__ import annotations

import json
import re
import statistics
import sys
from collections import defaultdict
from pathlib import Path


UNSET = {"", "_", "na", "n/a", "null", "none"}


def _num(tok: str):
    t = tok.strip().lower()
    return None if t in UNSET else float(t)


def load_scores(path: str):
    """Return (rows, skipped) where rows is (case, arm, rep, score, avoid_or_None).

    A row with a blank/unset score is kept as an expected row but flagged as
    skipped (scaffold_scores.mjs emits those cells for the harness to fill).
    Skipped rows never count toward the means.
    """
    rows, skipped = [], 0
    for lineno, raw in enumerate(Path(path).read_text().splitlines(), 1):
        line = raw.split("#", 1)[0].strip()
        if not line:
            continue
        parts = line.split()
        if len(parts) < 3:
            sys.exit(f"{path}:{lineno}: expected 'case arm rep score [avoid]', got: {line!r}")
        case, arm, rep = parts[0], parts[1], parts[2]
        s = _num(parts[3]) if len(parts) > 3 else None
        avoid = _num(parts[4]) if len(parts) > 4 else None
        if s is None:
            skipped += 1
            rows.append((case, arm, rep, None, None))
            continue
        if not 0.0 <= s <= 1.0 or (avoid is not None and not 0.0 <= avoid <= 100):
            sys.exit(f"{path}:{lineno}: score must be 0-1; row out of range")
        rows.append((case, arm, rep, s, avoid))
    return rows, skipped


def parse_excludes(spec: str):
    out = set()
    parts = [t.strip() for t in spec.split(",") if t.strip()]
    if len(parts) % 3 != 0:
        sys.exit(f"bad --exclude {spec!r}; want case,arm,rep[,case,arm,rep,...]")
    for i in range(0, len(parts), 3):
        case, arm, rep = parts[i], parts[i + 1], parts[i + 2]
        if not re.fullmatch(r"[a-z0-9-]+", case, re.I) or not re.fullmatch(r"[A-Za-z]", arm) or not re.fullmatch(r"[0-9]+", rep):
            sys.exit(f"bad --exclude triple {case},{arm},{rep}; want case,arm,rep")
        out.add((case, arm.upper(), int(rep)))
    return out


def main() -> int:
    if len(sys.argv) < 3:
        print(__doc__)
        return 2
    cases_path, scores_path = sys.argv[1], sys.argv[2]
    excludes = set()
    if "--exclude" in sys.argv:
        i = sys.argv.index("--exclude")
        if i + 1 >= len(sys.argv):
            sys.exit("--exclude needs a value")
        excludes = parse_excludes(sys.argv[i + 1])

    spec = json.loads(Path(cases_path).read_text())
    cases = {c["id"]: c for c in spec["cases"]}
    all_rows, skipped = load_scores(scores_path)
    rows = [r for r in all_rows if (r[0], r[1], r[2]) not in excludes]
    expected_empty = [r for r in rows if r[3] is None]
    rows = [r for r in rows if r[3] is not None]
    if not rows:
        sys.exit("no scored rows — fill the scores (scaffold_scores.mjs emits the skeleton) or the file is empty")
    if expected_empty:
        print(f"# note: {len(expected_empty)} row(s) still unfilled (skipped; not counted). Remove the blank score cells or fill them.")

    # group per (case, arm)
    grouped: dict[tuple[str, str], list[float]] = defaultdict(list)
    avoid_by: dict[tuple[str, str], list[float]] = defaultdict(list)
    expected_arms = set()
    pat = re.compile(r"([A-Za-z])_(.+)")
    for name in spec["arms"]:
        m = pat.match(name)
        if m:
            expected_arms.add(m.group(1).upper())
    for case, arm, _rep, score, avoid in rows:
        if arm not in expected_arms:
            sys.exit(f"unknown arm {arm!r} (known: {sorted(expected_arms)})")
        if case not in cases:
            sys.exit(f"unknown case {case!r} (known: {sorted(cases)})")
        grouped[(case, arm)].append(score)
        if avoid is not None:
            avoid_by[(case, arm)].append(avoid)

    def mean(arm, case=None):
        key = (case, arm) if case else None
        vals = [v for (c, a), vs in grouped.items() for v in vs if (key is None or (c, a) == key) and a == arm]
        return statistics.fmean(vals) if vals else float("nan")

    # per-case table
    print(f"{'case':<24}{'kind':<13}{'A':>6}{'B':>6}{'C':>6}{'d(B-A)':>8}  flag")
    flags = []
    for cid in spec["cases"]:
        a, b, c = (mean(x, cid["id"]) for x in ("A", "B", "C"))
        d = b - a
        flag = ""
        if cid.get("kind") == "openjudgment" and abs(d) <= 0.101 and a == a:
            flag = "open tie (strong)"
        elif a - b > 0.25:
            if c != c:  # C did not run
                flag = "A>B>0.25, C absent -> CONVERT?"
            else:
                flag = "A>B>0.25, C recovered" if c >= a - 0.10 else "A>B>0.25, C NOT recovered -> CONVERT?"
        elif b - a > 0.25:
            flag = "B>A>0.25"
        line = f"{cid['id']:<24}{cid.get('kind','?'):<13}{a:>6.3f}{b:>6.3f}{'-' if c != c else f'{c:>6.3f}'}{d:>8.3f}  {flag}"
        print(line.rstrip())
        flags.append(flag)

    mA, mB = mean("A"), mean("B")
    print(f"\n{'overall':<24}{'':<13}{mA:>6.3f}{mB:>6.3f}{'':>6}{mB - mA:>8.3f}")

    if mA != mA or mB != mB or not rows:
        print("\nVERDICT: INSUFFICIENT DATA — arm A or arm B has no filled scores")
        return 2

    # gate
    margin = 0.10
    mean_ok = mB >= mA - margin
    # strict clause: any B-only must_exclude violation where A has none
    strict_ok, strict_note = True, "no avoid-violation data (strict clause not assessable)"
    have_avoid = any(r[4] is not None for r in rows)
    if have_avoid:
        strict_note = "assessed from avoid_violations column (0 violations)"
    for cid in spec["cases"]:
        b_avoid = avoid_by.get((cid["id"], "B"), [])
        a_avoid = max(avoid_by.get((cid["id"], "A"), [0]) or [0])
        if any(v > 0 for v in b_avoid) and a_avoid == 0:
            strict_ok, strict_note = False, f"B-only violation on {cid['id']}"

    verdict = "PASS" if (mean_ok and strict_ok) else "FAIL"
    print(f"\nGate: mean(B) >= mean(A) - 0.10  -> {'ok' if mean_ok else 'FAIL'}")
    print(f"      no B-only must_exclude violation -> {'ok' if strict_ok else 'FAIL'} ({strict_note})")
    print(f"VERDICT: {verdict}")
    return 0 if verdict == "PASS" else 1


if __name__ == "__main__":
    sys.exit(main())