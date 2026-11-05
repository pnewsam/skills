# Performance evidence

## Contents

- Choose the measure
- Build both sides
- Run a fair comparison
- Report
- Clean up

## Choose the measure

Measure what the change claims to improve, taken from the PR, issue, or user: latency, throughput, memory, startup time, bundle size, query count, render count, or similar. Add a guardrail when the change could plausibly trade one cost for another, such as memory for speed.

Prefer a deterministic count over wall-clock time when one captures the claim: bytes, queries, allocations, renders, or network requests do not need repeated runs to beat noise. Use the project's own benchmark, profiler, or size script before writing a harness. For command timings, use `hyperfine` if it is installed. Otherwise write the smallest harness that exercises the changed path, and use the identical harness on both sides. Keep it out of the commit unless the user wants it kept.

## Build both sides

Measure the after side from the candidate. Measure the before side from a separate worktree at the merge base with the PR's base branch, as in [visual evidence](visual-evidence.md). Never switch branches in a checkout with changes. Build both sides the same way, in production mode when the claim is about production, with the same dependencies, data, configuration, and machine.

## Run a fair comparison

- Warm up before measuring, unless cold start is the claim.
- Interleave runs (before, after, before, after) so drift in machine load affects both sides equally.
- Take at least 5 timed runs per side, and more when the spread is wide relative to the change.
- Close what you control that competes for the machine, and record what you cannot control.
- Keep the raw per-run numbers in a file, not only the summary.

The change is supported only when the difference exceeds the run-to-run spread. When the ranges overlap, report "within noise", not a win. A single run, or numbers from different machines or sessions, cannot support a claim.

## Report

Report the measure, both commit SHAs, the exact command or harness, the environment (machine, OS, runtime versions, relevant settings), and the run count. Give a table that can go straight into a PR or Linear comment:

```markdown
| Metric | Before (`<base sha>`) | After (`<head sha>`) | Change |
| --- | --- | --- | --- |
| <metric, unit> | <median> (<min>–<max>) | <median> (<min>–<max>) | <±%> |

<N> interleaved runs per side after <W> warm-up runs on <environment>. Command: `<command>`. Raw data: `<path>`.
```

State limits: a local machine is not production, a synthetic workload is not real traffic, and a micro-benchmark does not prove an end-to-end gain. Say which acceptance criteria the numbers support and which remain unverified.

## Clean up

Posting results to a PR or Linear issue is publication; `publish-work` does it when asked. Remove the before worktree and any temporary harness and output you added.
