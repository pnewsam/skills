---
name: diagnose-failure
description: Diagnose a reproducible software failure and identify its most likely root cause using read-only inspection, focused experiments, and proportionate test execution. Use when asked why code, a test, build, service, or workflow is failing, flaky, hanging, or behaving unexpectedly. Produces an evidence-backed diagnosis and does not edit code, commit, push, or fix the problem unless the user separately asks for implementation.
---

# Diagnose Failure

## Outcome

Explain the smallest credible cause of the reported failure, backed by a reproduction or equivalent evidence. Separate what is known from what is inferred, record rejected hypotheses, and stop before implementing a fix.

Use the existing project tools and conventions. Do not introduce a debugger, test framework, dependency, or logging system merely to investigate one issue.

## Effect boundary

This workflow may:

- read local files and repository state
- run existing tests, builds, linters, type checks, or read-only diagnostics
- create disposable artifacts under a temporary directory
- read remote logs or CI evidence when the user placed them in scope

It must not:

- edit project files or configuration
- change branches, commits, indexes, remotes, issues, or pull requests
- install dependencies without separate authorization
- claim a root cause from correlation alone

If the user asks to diagnose and fix, complete and report the diagnosis first, then treat implementation as a separate phase with its own applicable skill.

## Workflow

### 1. Restate the symptom precisely

Capture:

- expected behavior
- observed behavior and exact error
- trigger, inputs, environment, and frequency
- last-known-good state when available
- whether the failure is deterministic, intermittent, or not yet reproduced

Do not silently replace the reported symptom with a nearby failure that is easier to reproduce.

### 2. Establish repository and runtime context

Inspect the smallest useful set of evidence:

- repository instructions and current diff
- package and task configuration
- relevant entrypoint, call path, and tests
- runtime, framework, and dependency versions already recorded by the project
- CI logs, application logs, or traces supplied or available in scope

Note pre-existing dirty work and do not disturb it.

### 3. Reproduce with the narrowest faithful command

Prefer, in order:

1. an existing single-test or single-package command
2. the smallest existing build or type-check target that exposes the failure
3. a read-only request or invocation with the original inputs
4. log/trace correlation when direct reproduction is unsafe or impossible

Record the command, exit status, and decisive output. Do not run an entire expensive suite when a focused reproduction exists.

### 4. Localize the failing boundary

Trace from the observed symptom toward its inputs:

- Which layer first produces an incorrect value or state?
- Is the failure in configuration, environment, data, control flow, timing, integration, persistence, rendering, or the test itself?
- Which nearby code is merely where the failure surfaces?
- What changed between the working and failing paths?

Use repository history only as evidence. Do not assume the newest change caused the failure merely because it is recent.

### 5. Rank hypotheses

Maintain a short list:

| Hypothesis | Supporting evidence | Contradicting evidence | Next discriminator |
| --- | --- | --- | --- |
| <cause> | <facts> | <facts> | <small check> |

Test the highest-information discriminator first. Prefer a check that can rule out several hypotheses over repeated speculative reading.

### 6. Run controlled checks

Change one variable at a time. Use existing flags, focused commands, alternate inputs, read-only queries, or temporary copies outside the project.

For intermittent failures, repeat the smallest reproduction enough to establish a pattern, but do not present absence during a short run as proof that the issue is fixed.

Stop when:

- one cause explains the evidence and competing hypotheses are materially weaker
- the missing information requires user access, production state, or a write
- further investigation would cost more than the uncertainty justifies

### 7. Report the diagnosis

Return:

1. **Symptom:** exact observed failure.
2. **Reproduction:** command or evidence source and result.
3. **Root cause:** precise cause, or the narrowest remaining hypothesis.
4. **Evidence:** files, lines, logs, values, or experiments that support it.
5. **Rejected hypotheses:** plausible alternatives ruled out and how.
6. **Confidence:** high, medium, or low, with the missing evidence if not high.
7. **Fix boundary:** smallest likely repair and validation needed, without applying it.

Use “not reproduced” or “cause not proven” when that is the truthful result.

## Common failure modes

- **A failing test is not automatically a product bug.** Check whether the test, fixture, clock, selector, or environment encodes a stale assumption.
- **The thrown line is not automatically the cause.** Trace the invalid state to where it was introduced.
- **A passing retry is not a diagnosis.** Identify the timing, ordering, shared state, or external dependency that explains the flake.
- **A broad dependency reinstall is not an experiment.** It changes many variables and destroys evidence.
- **Logs can mislead.** Correlate timestamps, request or trace IDs, environment, and code version before connecting events.
