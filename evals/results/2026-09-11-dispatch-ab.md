# In-unit dispatch A/B — null result

Date: 2026-09-11. Run ID `wf_84a19d92-b5d`. Harness: `evals/dispatch_ab.workflow.js` over `evals/dispatch_ab_cases.json`, 3 arms x 5 cases x 2 reps = 30 dispatch packages, each blind-scored. 60 agents, 0 errors, 0 degenerate packages.

## What was tested

Whether adding in-unit dispatch conventions to the registry changes how a controller composes a subagent dispatch. The candidate prose came from comparing our registry against obra/superpowers `subagent-driven-development`: hand work over as brief files rather than pasted history, name the model explicitly and tier it to the work, batch same-shape tasks, keep review with the controller, identify the review candidate by recorded base..head, and rule on plan conflicts instead of stopping.

Arms: `control` (current registry — `work-conventions`, `fan-out`, `ship-epic` + coordination), `dispatch` (full candidate prose, ~4 paragraphs), `trim` (the same rules in four sentences). Each arm received the same controller situation and returned the dispatch package it would actually send; a blind evaluator scored 34 anchors across the five cases.

## Result

| Arm | Recall | Anti-patterns | Prompt chars | Model named |
| --- | --- | --- | --- | --- |
| control | 0.960 | 0 | 5534 | 1.00 |
| dispatch | 1.000 | 0 | 4133 | 1.00 |
| trim | 0.935 | 0 | 3976 | 1.00 |

Gate required `dispatch` to exceed control by more than 0.15 recall. It exceeded by 0.04. **The gate is not met. No prose is promoted; the registry is unchanged.**

Per case, recall (control / dispatch / trim):

| Case | control | dispatch | trim |
| --- | --- | --- | --- |
| ctx-transcription | 0.80 | 1.00 | 0.80 |
| ctx-batch | 1.00 | 1.00 | 1.00 |
| rule-conflict | 1.00 | 1.00 | 0.875 |
| review-dispatch | 1.00 | 1.00 | 1.00 |
| parallel-shared-file | 1.00 | 1.00 | 1.00 |

## Why it nulled

The test is saturated. Control satisfied 0.96 of the anchors without any added guidance, and **zero anti-patterns appeared in any arm, in any rep**. Four of the five cases could not discriminate at all: control already batched six same-shape edits into one dispatch, already refused to run two implementers over a shared file, already identified the review candidate as `a1b2c3d..f9e8d7c` rather than `HEAD~1`, already kept review with the controller and forbade workers spawning their own, and already ruled on the TTL conflict against the spec rather than stopping to ask.

One anchor carried the entire delta: on `ctx-transcription`, control and trim both failed I5 (name a report file for the worker's full report and keep the reply short). Control did not merely omit it — one package explicitly forbade a report file and pushed a seven-item report into the return message. That is a real difference, and it is the only one the run found.

The model-tiering premise is refuted outright for this setup. `modelNamed` was 1.00 in every arm including control: the controller named an explicit model on every dispatch without being told to, and tiered it sensibly (Haiku for transcription, Opus for the concurrency-sensitive review). The delta's claim that an omitted model silently inherits the session's most expensive model describes a failure that did not occur here.

## The size signal, and why it is not a finding

Composed prompts were shorter under the candidate prose: 4133 chars against control's 5534 overall, and on `review-dispatch` control ran 10743–12194 chars against dispatch's 5698–6098, roughly double. This is suggestive but it is not evidence of anything we gated on. Control scored 1.00 on every anchor of that case, including the one about not pasting the diff — so by our own measure its longer prompt was not worse, only longer. Treating length as a defect would be inventing a metric after seeing the result. Recorded as a hypothesis, not a finding.

## Limitations

The decisive one: this measured a **composed artifact**, not a running multi-task session. The candidate prose argues that pasted history stays resident and is re-read every turn — a claim about accumulation across six dispatches. A single composed package cannot accumulate, so the central claim was never actually exercised. A controller behaves differently when it is one turn into a clean situation than when it is six tasks deep, tired of its own notes, and compacting.

Also: anchors were written from the candidate prose, which biases them toward things the prose mentions; a frontier model reading an evals-aware repository may be primed toward its house idioms; two reps per cell is enough to show saturation and not enough to resolve a small real difference; and `rule-conflict` tests the ruling paragraph, which is adjacent to dispatch rather than part of it — its result (control 1.00) is a finding about rulings, not about dispatch.

## Disposition

Keep the registry as it stands. Do not promote the dispatch prose, the trim version, or the model-tiering paragraph.

The report-file convention is the one survivor and is too small to carry a package or a reference section on this evidence. If it is worth anything it is one sentence in `ship-epic`'s dispatch-and-handoff paragraph, and it should be tested on its own rather than smuggled in on a null.

A real test of the context-accumulation claim needs a different harness: one controller, one fixture plan of six or more tasks, measured over the whole run rather than at one composition. That is a bigger build than this was, and it should be scoped deliberately rather than bolted onto these cases.
