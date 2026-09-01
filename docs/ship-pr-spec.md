# ship-pr — specification

The top-level **runbook** for a single PR unit of work. It drives one PR-sized
change through the entire lifecycle — Frame → Plan → Build → Verify → Publish →
Review → Revise → Verify — until the PR converges or hits a bounded stop, and it
deliberately stops short of merge. It is the runbook that absorbs `harden-pr`
(whose loop becomes its convergence engine), so `harden-pr` is deleted when
`ship-pr` lands.

**Decided:** whole-lifecycle scope, name `ship-pr` (see `docs/uow-lifecycle.md`
and `docs/registry-rebalance-plan.md`).

## Scope

**In scope — the whole lifecycle for one PR.** `ship-pr` starts from an intent or
an in-progress change and drives it to a merge-ready PR, taking the OODA
back-edges when evidence demands (re-verify after a fix; return to Plan/Frame on
new evidence):

```
Frame → Plan → Build → Verify → Publish → Review → Revise → (loop) → merge-ready
  ▲       ▲       ▲        │                  │        │
  │       │       └── fails/regressions ──────┘        │
  │       └────────── rethink approach ──── findings ──┘
  └──────────────── scope was wrong ───────────────────┘
```

Phases with an obvious step are skipped (a clear one-line fix needs no Plan
phase). It never merges; merge is a separate authorized action.

**Relationship to `ship-epic`.** They are siblings at different grains, and both
stop before merge:

| Runbook | UOW | Grain | Drives | Ends at |
| --- | --- | --- | --- | --- |
| `ship-epic` | epic | many features | plan missing features, advance each, prepare a PR | a prepared PR |
| **`ship-pr`** | one PR | one change | the full Frame→…→Review loop for a single PR | merge-ready PR |

The Plan→Build overlap is real but grain-separated: `ship-epic` coordinates a
multi-feature initiative; `ship-pr` takes one change through its whole life. A
natural future refactor is for `ship-epic` to delegate each feature's delivery to
`ship-pr`; out of scope for this change (leave `ship-epic` as-is, note the seam).

## Composes vs. owns

The bitter-lesson line: a runbook earns its place only by owning control the base
model would not reliably infer. `ship-pr` **delegates all atomic work to
operations** and keeps only the orchestration.

**Composes (delegates to operations):**

- Frame — base-model inline: read the issue/intent, reproduce, gather context.
- `plan-feature` — Plan phase, when the approach is not obvious.
- `execute-feature` — Build phase: the scoped change plus tests.
- `verify` (base-model inline) — Verify phase: re-check after every source change.
- `publish-pr` — Publish phase: open the PR if none exists for the branch; ensure
  the reviewed head is the live head.
- `review-pr` — Review phase: each independent review pass runs `review-pr` in its
  analyze mode. `ship-pr` does not re-implement review criteria.
- `address-review` — Revise phase: triage and apply inbound human review threads
  (fix / reply / defer / fold), the operation that already owns that decision.
- `rebase-pr` — only if the base drifted mid-loop and a reconcile is needed.

**Owns (the control logic, ported from `harden-pr`):**

- **Model-diverse independent review.** Each pass uses a fresh reviewer from a
  different model family than the candidate producer; context-isolated, no prior
  round conclusions. Disclose when diversity/isolation could not be achieved.
- **Convergence contract.** Call the PR merge-ready only when a fresh independent
  review of the *exact latest candidate* finds no credible Blocking/Major issue;
  every credible Minor and actionable human thread is fixed or deferred with a
  merge-safe reason; required + change-targeted validation has no known failure;
  no unrelated changes; and (when published) the verified remote head SHA is the
  reviewed candidate with required CI green.
- **Bounded stop.** Default ≤3 repair rounds + 1 clean verification pass (≤4
  review passes) unless the user sets another budget. Early-stop when: converged;
  budget exhausted; the same material finding survives two repairs; validation
  can't pass without widening scope or a product decision; or auth/branch/repo
  state blocks a safe next action.
- **Traceable ledger.** Per round: candidate fingerprint/SHA, findings and
  dispositions, changed files, validation, publication state, remaining
  uncertainty. Every completion claim traces to the ledger.
- **Scope discipline.** Harden what the PR set out to do; do not grow the diff,
  add capability, or reinterpret intent. Out-of-scope findings are deferred, not
  fixed, regardless of stated severity.

## Effects and authorization

Same ladder as `harden-pr`; each stage separately authorized, none implied by the
previous:

| Mode | Adds | Completion claim |
| --- | --- | --- |
| Local | read PR, edit checked-out branch, run validation | local candidate hardened |
| Publish | + ordinary commits and push | remote head hardened, CI reported |
| Respond | + reply to / resolve verified threads | remote PR + selected threads updated |

Posting a review, approving/requesting changes, posting the hardening-summary
comment, changing PR metadata, force-push/rebase/history rewrite, and **merge**
each require their own explicit authorization. Never post the internal review
passes.

## What changes vs. today's harden-pr

This is a promotion, not a rewrite — but two real improvements:

1. **A Publish entry point.** `harden-pr` assumes an open PR; `ship-pr` runs
   `publish-pr` first when none exists, so one runbook covers "take this branch to
   a merge-ready PR" end to end.
2. **Delegation instead of in-lining.** `harden-pr` in-lines its review and repair
   prose. `ship-pr` delegates review to `review-pr` and human-thread triage to
   `address-review`, keeping only convergence control — removing duplicated prose
   and honoring one-verb-per-phase.

Everything else (convergence contract, model-diversity routing, bounded stop,
ledger, effect modes, summary-comment shape) ports over intact.

## Migration when ship-pr lands

- Create `registry/ship-pr/` (runbook); port `harden-pr`'s convergence contract,
  reviewer-routing, ledger, and summary-comment reference material.
- `git mv registry/harden-pr → archive/ship-pr-merge-evicted/harden-pr`.
- Repoint the `core` profile (`harden-pr` → `ship-pr`), the `harden-pr` routing
  cases in `evals/high_use_cases.json`, README (Git/PR table + mermaid), and
  cross-references in `pr-conventions`, `review-pr`, `address-review`.
- Update the Kind: `ship-pr` is a `runbook`.

## Resolved

- **Scope:** whole-lifecycle (Frame→…→merge-ready for one PR).
- **Name:** `ship-pr`, parallel to `ship-epic`; both stop before merge.
- **Publish:** `ship-pr` owns it (runs `publish-pr` when no PR exists).
- **Kind:** `runbook`. One runbook kind covers linear and branching flows alike;
  `ship-pr`'s branching (phase skips, converged-vs-loop, early-stops, the OODA
  back-edges) is a property of this runbook, not a reason for a second kind.

## Still open

- **`ship-epic` delegation.** Future: `ship-epic` delegates each feature's delivery
  to `ship-pr`. Deferred; leave `ship-epic` as-is for now.
