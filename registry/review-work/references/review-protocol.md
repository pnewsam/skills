# Review protocol and convergence

## Attribution and output

Resolve the reviewer's exact active model identifier from trusted runtime metadata or explicit trusted execution context. Do not infer it from branding, a model catalog, or configured defaults. If no trustworthy exact identifier is available after checking the available metadata path, use `unknown`. A delegated reviewer reports its own model, not the coordinator's. Retain only the identifier, not unrelated runtime metadata.

Return a proposed verdict, the reviewer model, a short reason, actual validation, and supported findings. APPROVE requires enough inspected evidence and no credible merge blocker; REQUEST_CHANGES requires a supported blocking defect; uncertainty alone supports a question or COMMENT. Use COMMENT for self-review unless repository policy and explicit user authorization permit self-approval. An analysis result is not a posted approval.

Account internally for every changed file as reviewed, mechanically inspected, sampled, or not reviewed. Disclose material gaps. Anchor findings to valid locations and order them by severity; do not repeat a description of the change in place of findings.

## Requested review-and-fix loops

The agent owns the loop across review, execution, validation, and authorized delivery; no separate lifecycle entry point is required. Record each round's candidate identity, producer/reviewer model when known, findings and dispositions, repairs, validation, and publication state. Every non-fix needs a reason. Do not widen scope merely to satisfy a finding; explain an out-of-scope request while retaining any real in-scope blocker.

Use a fresh context-isolated reviewer when available and authorized. Honor a requested capable model; otherwise prefer a suitable different model family from the candidate producer. If producer provenance is unknown, record that and prefer a model different from the current repairer. Supply intent, linked ticket, instructions, exact diff, relevant unchanged context, and current validation; exclude prior verdicts and the desired result. Disclose same-model or same-context fallback honestly. Model diversity does not replace evidence.

Unless the user sets another budget, allow at most three repair rounds plus one final clean review. Stop sooner on convergence, an unresolved scope decision, or the same material finding surviving two repairs. Re-review the changed candidate; an earlier clean review cannot certify later edits. Required validation failures or missing required evidence block unconditional readiness. For a remote-readiness claim, the verified remote head must match the reviewed candidate and required CI must be green. Pending CI supports only a conditional result.

Disposition actionable human threads too; nits do not require endless churn. Do not post internal reviews, a summary comment, replies, or resolutions automatically. Use authorized delivery for those effects. A review-only request returns its assessment without entering a repair loop.
