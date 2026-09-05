#!/usr/bin/env bash
# extract_ui_pilot.sh — stage the prose ui-* family out of the active registry
# for the bitter-lesson eviction pilot (arm B). DRY-RUN by default: prints the
# plan and changes nothing. Pass --apply to perform a reversible local move.
#
# This does NOT commit, push, or delete history. The move is fully reversible
# with git. Do not run --apply until the ui_family_cases.json A/B has been
# scored and the eviction gate is met (see evals/ui_family_cases.json and
# docs/registry-rebalance-plan.md).
#
# Moved: the 13 prose ui-* skills + the ui-expert router + visual-hierarchy
# (whose verdict is recorded separately in the A/B report). Kept: the converted
# checkers ui-color and ui-spacing, which stay in every arm.
#
# Usage:
#   scripts/extract_ui_pilot.sh              # dry run (default)
#   scripts/extract_ui_pilot.sh --apply      # move to archive/ui-evicted/ on a pilot branch
set -euo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$ROOT"

UI_SKILLS=(
  ui-actions ui-content ui-data-viz ui-depth ui-email ui-expert ui-feedback
  ui-forms ui-icons ui-layouts ui-onboarding ui-patterns ui-responsive
  ui-typography visual-hierarchy
)
KEEP_SKILLS=(ui-color ui-spacing)
DEST="archive/ui-evicted"
BRANCH="pilot/ui-eviction"
MODE="${1:-}"

plan() {
  echo "Pilot: ui-* knowledge eviction (arm B)"
  echo "Skills to move ($(echo "${UI_SKILLS[@]}" | wc -w | tr -d ' ')): ${UI_SKILLS[*]}"
  echo "Lines of prose under test: $(wc -l registry/{ui-actions,ui-content,ui-data-viz,ui-depth,ui-email,ui-feedback,ui-forms,ui-icons,ui-layouts,ui-onboarding,ui-patterns,ui-responsive,ui-typography}/SKILL.md 2>/dev/null | tail -1 | awk '{print $1}')"
  echo "Destination (Tier B, in-repo): $DEST/"
  echo "Kept (converted checkers): ${KEEP_SKILLS[*]}"
  echo
  echo "catalog.json edits:"
  echo "  profiles.ui.skills   -> ${KEEP_SKILLS[*]} (was $(python3 -c "import json;c=json.load(open('catalog.json'));print(len(c['profiles']['ui']['skills']))") skills)"
  echo "  profiles.design.skills -> drop visual-hierarchy (design-explore stays)"
  echo "  high_use_cases.json   -> drop router-ui-mechanics, focused-ui-feedback, focused-visual-hierarchy"
  echo "  cli/internal/catalog/catalog_test.go -> advisory expectations: -ui-expert -visual-hierarchy +ui-color +ui-spacing"
}

case "$MODE" in
  ""|--dry-run)
    echo "=== DRY RUN (no changes). Re-run with --apply to perform the move. ==="
    plan
    echo
    echo "Gate before --apply: ui_family_cases.json A/B reports mean(B) >= mean(A) - 0.10"
    echo "and no B-only must_exclude violation; record it in evals/results/2026-08-XX-ui-family.md."
    ;;

  --apply)
    if [ -n "$(git status --porcelain)" ]; then
      echo "ERROR: working tree is dirty. Commit or stash first — this script needs a clean tree to stay reversible." >&2
      exit 1
    fi
    if [ "$(git rev-parse --abbrev-ref HEAD)" != "$BRANCH" ]; then
      echo "Switching to pilot branch '$BRANCH' (reversible: git checkout main deletes nothing)..."
      git checkout -b "$BRANCH" 2>/dev/null || git checkout "$BRANCH"
    fi
    mkdir -p "$DEST"
    for s in "${UI_SKILLS[@]}"; do
      echo "  git mv registry/$s $DEST/$s"
      git mv "registry/$s" "$DEST/$s"
    done
    python3 - "$ROOT/catalog.json" "${KEEP_SKILLS[@]}" <<'PY'
import json, sys
p = sys.argv[1]; keep = sys.argv[2:]
c = json.load(open(p))
c["profiles"]["ui"]["skills"] = keep
c["profiles"]["ui"]["description"] = "Converted UI checks: WCAG contrast and spacing-scale validators. Prose family retired to archive/ui-evicted/ pending the A/B verdict."
c["profiles"]["design"]["skills"] = ["design-explore"]
c["profiles"]["design"]["description"] = "Visual direction via search: design-explore (generate-N-and-judge). Prescriptive design prose retired to archive/."
json.dump(c, open(p, "w"), indent=2)
open(p, "a").write("\n")
print(f"catalog.json updated: ui -> {keep}, design -> [design-explore]")
PY
    python3 - "$ROOT/evals/high_use_cases.json" "${UI_SKILLS[@]}" <<'PY'
import json, sys
p = sys.argv[1]; moved = set(sys.argv[2:])
cases = json.load(open(p))
def touches(c):
    refs = {c.get("expected_skill")} | set(c.get("expected_delegates") or [])
    return bool(refs & moved)
kept = [c for c in cases if not touches(c)]
dropped = [c["id"] for c in cases if touches(c)]
json.dump(kept, open(p, "w"), indent=1)
open(p, "a").write("\n")
print(f"high_use_cases.json: dropped routing cases for the evicted family: {dropped or 'none'}")
PY
    python3 - "$ROOT/cli/internal/catalog/catalog_test.go" <<'PY'
import re, sys
p = sys.argv[1]
s = open(p).read()
old = '''		"consult-expert",
		"compliance-expert",
		"platform-expert",
		"ui-expert",
		"visual-hierarchy",
	} {'''
new = '''		"consult-expert",
		"compliance-expert",
		"platform-expert",
		"ui-color",
		"ui-spacing",
	} {'''
if old in s:
    s = s.replace(old, new)
    open(p, "w").write(s)
    print("catalog_test.go: advisory expectations now ui-color/ui-spacing")
else:
    print("catalog_test.go: expected advisory block not found — update manually (ui-expert/visual-hierarchy should now be absent)")
PY
    cat > "$DEST/README.md" <<'MD'
# ui-evicted (arm B, pending A/B verdict)

These 15 skills (13 prose ui-* + ui-expert + visual-hierarchy) were moved out
of the active registry for the bitter-lesson eviction pilot. They are here for
history and reversibility only and are not installable. The converted checkers
that stay active: `ui-color` (contrast validator) and `ui-spacing` (scale
lint).

If the A/B in `evals/ui_family_cases.json` shows the prose does not beat the
base model (+ the substitute in `docs/ui-substitute-note.md`), they stay
evicted. `visual-hierarchy`'s verdict is recorded separately in the same run.
Re-import a single survivor via `ingest-skill` with provenance: external.
MD
    git add -A "$DEST/README.md" catalog.json evals/high_use_cases.json cli/internal/catalog/catalog_test.go
    echo "Validating registry after move..."
    python3 scripts/validate_registry.py >/dev/null && echo "validator: 0 errors"
    (cd "$ROOT/cli" && go test ./... >/dev/null 2>&1 && echo "go test ./...: ok") || echo "go test: FAILED — inspect cli/internal/catalog/catalog_test.go"
    echo
    echo "Done on branch '$BRANCH'. This is arm B. Restore arm A: git checkout main"
    ;;

  *)
    echo "Unknown option: $MODE (use --apply or omit for dry run)" >&2
    exit 2
    ;;
esac