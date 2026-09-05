#!/usr/bin/env bash
# extract_react_pilot.sh — stage the react-* knowledge family out of the active
# registry for the bitter-lesson eviction pilot. DRY-RUN by default: prints the
# plan and changes nothing. Pass --apply to perform a reversible local move.
#
# This does NOT commit, push, or delete history. The move is fully reversible
# with git. Do not run --apply until the react_pilot_cases.json A/B has been
# scored and the eviction gate is met (see docs/registry-rebalance-plan.md).
#
# Usage:
#   scripts/extract_react_pilot.sh              # dry run (default)
#   scripts/extract_react_pilot.sh --apply      # move to archive/react-pilot/ on a pilot branch
#   scripts/extract_react_pilot.sh --tier-a     # print the separate-repo recipe (needs git-filter-repo)
set -euo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$ROOT"

REACT_SKILLS=(
  react-accessibility react-architecture react-component-design react-data-fetching
  react-error-handling react-expert react-form-patterns react-hooks-effects
  react-performance react-routing react-state-management react-testing
)
DEST="archive/react-pilot"
BRANCH="pilot/react-eviction"
MODE="${1:-}"

plan() {
  echo "Pilot: react knowledge eviction"
  echo "Skills to move ($(echo "${REACT_SKILLS[@]}" | wc -w | tr -d ' ')): ${REACT_SKILLS[*]}"
  echo "Lines of prose under test: $(wc -l registry/react-*/SKILL.md | tail -1 | awk '{print $1}')"
  echo "Destination (Tier B, in-repo): $DEST/"
  echo "catalog.json edits: delete profiles.react; drop \"react\" from profiles.advisory.includes"
  echo "After move: arm B (registry without react-*) is ready for A/B trials."
}

case "$MODE" in
  ""|--dry-run)
    echo "=== DRY RUN (no changes). Re-run with --apply to perform the move. ==="
    plan
    echo
    echo "Restore after --apply:  git checkout main && git branch -D $BRANCH"
    ;;

  --tier-a)
    echo "Tier A — extract into a separate 'skills-knowledge' repo WITH history."
    echo "Requires git-filter-repo (not a fallback; do not hand-roll history rewrites):"
    echo "  pip install git-filter-repo   # or: brew install git-filter-repo"
    echo
    echo "Recipe (run from a scratch dir, not this working tree):"
    echo "  git clone --no-local $ROOT skills-knowledge"
    echo "  cd skills-knowledge"
    printf '  git filter-repo'
    for s in "${REACT_SKILLS[@]}"; do printf ' \\\n    --path registry/%s' "$s"; done
    printf '\n'
    echo "  # then in this repo, run --apply to remove them from the active side."
    echo "  # Re-import any single skill later via the ingest-skill workflow with"
    echo "  # provenance: external / policy: preserve in catalog.json."
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
    for s in "${REACT_SKILLS[@]}"; do
      echo "  git mv registry/$s $DEST/$s"
      git mv "registry/$s" "$DEST/$s"
    done
    python3 - "$ROOT/catalog.json" <<'PY'
import json, sys
p = sys.argv[1]
c = json.load(open(p))
c["profiles"].pop("react", None)
adv = c["profiles"].get("advisory", {})
if "includes" in adv:
    adv["includes"] = [x for x in adv["includes"] if x != "react"]
json.dump(c, open(p, "w"), indent=2)
open(p, "a").write("\n")
print("catalog.json updated: react profile removed, dropped from advisory.includes")
PY
    python3 - "$ROOT/evals/high_use_cases.json" "${REACT_SKILLS[@]}" <<'PY'
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
    cat > "$DEST/README.md" <<'MD'
# react-pilot (evicted, pending A/B verdict)

These 12 react-* skills were moved out of the active registry for the
bitter-lesson eviction pilot. They are here for history and reversibility only
and are not installable. If the A/B in `evals/react_pilot_cases.json` shows the
prose does not beat the base model (+ the substitute in
`docs/react-substitute-note.md`), they stay evicted; productionize the move to a
separate `skills-knowledge` repo with `scripts/extract_react_pilot.sh --tier-a`.
Re-import a single survivor via `ingest-skill` with provenance: external.
MD
    git add -A "$DEST/README.md" catalog.json evals/high_use_cases.json
    echo "Validating registry after move..."
    python3 scripts/validate_registry.py >/dev/null && echo "validator: 0 errors"
    echo
    echo "Done on branch '$BRANCH'. This is arm B. Restore arm A: git checkout main"
    ;;

  *)
    echo "Unknown option: $MODE (use --apply, --tier-a, or omit for dry run)" >&2
    exit 2
    ;;
esac
