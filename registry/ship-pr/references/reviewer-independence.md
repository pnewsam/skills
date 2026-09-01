# Reviewer independence

How to run each review pass in the convergence loop so its verdict is trustworthy.
Model diversity supplements evidence isolation; it does not replace complete diff
inspection, repository context, or validation.

## Reviewer routing priority

Use a fresh reviewer subagent when multi-agent execution is available. Route it:

1. Honor an explicitly requested reviewer model when it is available and capable
   of the repository and tool work.
2. Otherwise choose an available model whose base model or family differs from
   the candidate-producer model. Prefer comparable review capability; do not pick
   a clearly unsuitable model merely to manufacture diversity.
3. If producer provenance is unknown, choose a model different from the active
   ship/repair model and mark the original producer as unknown.
4. When multiple suitable alternatives exist, prefer one not used for the
   immediately preceding review.

After a repair, treat the model that made that repair as the producer of the new
candidate.

## Spawning the reviewer

Spawn with an explicit model override and no inherited conversation history when
the runtime supports those controls. In runtimes exposing `model` and
`fork_turns`, set `model` to the selected alternative and `fork_turns` to `none`;
do not use a full-history fork for an independent review.

Give the reviewer only:

- the PR intent and the linked ticket or issue when one exists,
- governing repository instructions,
- the exact candidate diff and relevant unchanged context,
- current validation evidence.

Do **not** give it prior-round conclusions, attempted fixes, or the desired
verdict. Instruct it to use `review-pr` in its analyze mode, judge the change
against its stated intent, return evidence-backed findings and a proposed
verdict, and make no edits or external writes. Tell it to concentrate on
functional correctness, security, and reliability within the declared scope, and
to mark any finding that would add capability, handle out-of-scope cases, or
reinterpret intent as out of scope rather than raise it as blocking.

## Fallbacks and disclosure

If no different suitable model is available, use a context-isolated fresh reviewer
on the same model. If no fresh reviewer is available, perform a new evidence pass
from the current candidate. Disclose the missing cross-model or agent
independence in either case; never imply that a same-model pass was model-diverse.
