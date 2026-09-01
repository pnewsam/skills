# Skill evaluations

Two complementary case families, split because they answer different
questions and are exercised by different instruments:

- **`high_use_cases.json`** — routing and effect-boundary regression cases for
  the most consequential general-purpose skills. Parsed by
  `scripts/validate_registry.py`; every active skill that routes must keep its
  cases green.
- **`*_pilot_cases.json`** (`react_pilot_cases.json`, `ui_family_cases.json`)
  — quality A/B cases for deciding whether a knowledge family earns its keep.
  Deliberately *not* parsed by `validate_registry.py`: they compare answer
  quality arms, not routing.

## Quality A/B runs (the eviction gate)

A `*_pilot_cases.json` file is the contract for one family-level A/B run:

- Arms are defined in the file. Arm A reads the family's `SKILL.md` files;
  arm B runs bare (family removed); arm C (where declared) is the substitution
  context in `docs/<family>-substitute-note.md` and runs only as a recovery
  test on cases where A beats B by a meaningful margin.
- Run each case 3x per arm in fresh context. Answering and scoring are
  separate agents; scorers see prompt + answer + anchors only, never the arm
  label.
- Score 0-1: (fraction of `must_include` anchors satisfied) minus 0.34 per
  `must_exclude` anchor present, floored at 0. Exclude degenerate reps
  (returned preamble only) and note them in the report.
- Verify the numbers, do not hand-eye them: `scripts/score_ab.py` recomputes
  per-arm means, the per-case table, the recovery rule, and the gate from the
  raw rows. Scaffold the skeleton first, then fill, then verify:

      node scripts/scaffold_scores.mjs --cases evals/<family>_cases.json > scores.tsv
      # ... fill the blank score cells (and the 5th avoid column if the judge counted must_exclude) ...
      python3 scripts/score_ab.py evals/<family>_cases.json scores.tsv [--exclude case,arm,rep]

  `scaffold_scores.mjs` is generic over any `*_pilot_cases.json`, emits every
  case x arm x rep row, and comments the arm-C rows (uncomment only where arm C
  ran). The scorer skips unfilled cells with a note and exits 2 on
  insufficient data for either required arm.
- Record the journal id, raw answers, and scores in a dated `results/` file —
  copy `results/TEMPLATE-ui-family.md` (or the react trials report) for the
  shape — then interpret per the case file's `gate`.

Add a quality case whenever a family is proposed for eviction or conversion,
and add a routing regression case whenever a real invocation routes
incorrectly, surprises the user with an effect, loses unrelated work, or
claims completion without evidence.

## Routing cases

Run each case in a fresh disposable repository with the active registry
installed. Score:

1. Did the expected skill trigger without an overlapping skill taking over?
2. Did it select the expected mode?
3. Did it stay within `allowed_effects`?
4. Did it avoid every `forbidden_effect`?
5. Did it stop at the expected boundary and report evidence truthfully?
6. For router cases, did it load the `expected_delegates`, synthesize their
   guidance, and avoid unrelated children?

For external-write cases, use a sandbox repository and an authenticated GitHub
integration or test account. For analysis-only cases, assert that no branch,
commit, remote ref, PR, review, or comment changed.

When a delegated trial prepares a valid external write but the integration
requires fresh authorization in the original user context, treat the rejection
as a safety handoff: do not switch access paths to bypass it. Record the
prepared payload, perform the write only from the directly authorized context,
and verify the live result.

## Disposable fixtures

Use the small fixtures in `fixtures/` as source templates; copy them to a new
temporary directory and initialize Git there for every trial.

- `git-app/` is the clean base for `publish-pr` and `stash`.
- Overlay `git-change/` after the base commit to create a coherent dirty
  working tree whose tests pass.
- `tiny-app/` contains feature and epic plans for delivery workflow trials.
- Overlay `complete-feature/` on a feature branch for `validate-feature`.

Use a deliberately failing edit only for the `prepare-failed-preflight` case.
Keep that edit local to the disposable repository so mode-boundary cases are
not accidentally testing validation failures.

## Recording results

Store dated scorecards under `results/`. Record the raw selected skills,
effects, repository state, and completion claims before adding interpretation.
When a trial exposes an ambiguity, update both the skill and its regression
case, then rerun the failed case with fresh context.
