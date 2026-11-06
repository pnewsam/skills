#!/usr/bin/env bash
# Build per-arm skills snapshots for real_pr_review.workflow.js `armSkills`.
# Each snapshot is `git archive` of a fixed commit with evals/ removed, so the
# reviewer cannot read eval material and the working tree cannot leak in.
# Usage: evals/build_arm_snapshots.sh <out_dir> [commit]
# Produces <out_dir>/control and <out_dir>/trim; trim overlays
# evals/candidates/review-work-trim/SKILL.md onto registry/review-work/SKILL.md.
set -euo pipefail
out=${1:?out_dir required}
rev=${2:-HEAD}
repo=$(git rev-parse --show-toplevel)
candidate="$repo/evals/candidates/review-work-trim/SKILL.md"
rm -rf "$out/control" "$out/trim"
for arm in control trim; do
  mkdir -p "$out/$arm"
  git -C "$repo" archive "$rev" registry | tar -x -C "$out/$arm"
done
cp "$candidate" "$out/trim/registry/review-work/SKILL.md"
echo "control: $(git -C "$repo" rev-parse --short "$rev")"
diff -q "$out/control/registry/review-work/SKILL.md" "$out/trim/registry/review-work/SKILL.md" || true
diff -rq "$out/control/registry" "$out/trim/registry" | grep -v 'review-work/SKILL.md' && { echo "unexpected difference" >&2; exit 1; } || true
