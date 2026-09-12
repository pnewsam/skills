# review-work checks A/B — gate, registered before the run

Date: 2026-09-11. Harness: `evals/real_pr_review.workflow.js`, resuming run `wf_6a787ce4-f88` so the control arm replays from cache and only the candidate arm runs. 12 real review rounds x 2 reps.

## What is being tested

The calibration found five shapes of defect the current skill misses. Two of them — whether a check actually executes the changed code on the engine production uses, and whether a new test would fail with the defect present — are *already* in `review-work`, in the middle of a dense paragraph. Control missed them anyway.

So the candidate is not more guidance. It is the same guidance given the structure obra/superpowers uses for exactly this problem: a named gate, imperative checks, and a short rationalization table, on the grounds that discipline the model must locate in prose is discipline it skips. Three shapes the skill genuinely lacks (degenerate parameter values, index-serves-the-filter, empty-denominator rates) are added to that structure.

This is a structure-versus-prose test as much as a content test. If it fails, the honest reading is that the skill's existing sentences were not the bottleneck.

## Gate

- **Adopt** if recall(checks) exceeds recall(control) by more than 0.10 overall, AND ungrounded unanchored findings do not rise by more than 0.25 per review, AND no single case regresses by more than 0.20 recall.
- **Reject** otherwise. A null keeps `review-work` exactly as it is, and the five miss shapes stay unaddressed until something else is tried.

Recall here is per-round recall against the anchors the human reviewer raised that round. `anticipated` is reported but is not part of the gate, for the reason given in the calibration write-up: a later round can concern code the earlier commit does not contain.

## Candidate text

The arm delta below is the exact prose that would be appended to `registry/review-work/SKILL.md` if the gate clears. Nothing is applied to the skill before then, and the control arm reads the unmodified skill from the working tree.

```markdown
## Before the review is done

Evidence before assertion. A claim in the description, a comment, or a test name is not proof. Name what actually ran against this candidate, and when nothing did, that gap is the finding — do not close it by reading the code and declaring it correct.

Run these five checks before calling the review done. Each one has cost a real defect that a careful read of the diff did not catch.

- **Degenerate inputs.** For every parameter the change adds or touches, ask what an empty value does, an absent one, a duplicate, and an extreme but valid one. An empty repeatable value arrives as a one-element list, is truthy, and compiles to a filter that matches nothing while returning success. An extreme but legal bound can underflow arithmetic into a 500.
- **Empty denominators.** A rate, average, or percentile over an empty or unclassified population must say so rather than return zero. A zero error rate with nothing in the denominator reads as healthy and is the defect.
- **The access path.** Does an index actually serve each new filter, sort, or count? A row limit bounds rows returned, not rows examined, so a selective-looking predicate on an unindexed column can still scan the whole range.
- **Execution, not intention.** Does a check that actually runs execute this code, on the engine production uses? Name the job. Code reached only by a job gated on a label this change does not carry, or covered only on a different engine than production, is unverified — report that, rather than proving it correct by inspection.
- **Tests that would fail.** For each test the change adds, ask whether it would fail if the defect it targets were present. A constant patched below the fixture size, a fixture too small to reach the bound it claims to exercise, an assertion true either way — each passes with the defect intact and pins nothing.

When you find yourself concluding one of these is fine, check which move you are making:

| Thought | What it usually means |
| --- | --- |
| "The code is plainly correct here" | You proved the code, not the test. The missing pin is still a finding. |
| "The description says this was validated" | Nothing ran until you can name the job that ran it. |
| "That input cannot reach this path" | Name the validator that rejects it. If none does, it can. |
```
