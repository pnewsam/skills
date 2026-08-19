# Quality Analysis Metrics

## Contents

- Measurement contract
- Maintainability signals
- Correctness signals
- Testing signals
- Reliability signals
- Ranking and false positives

## Measurement contract

Record for every metric used:

| Field | Meaning |
| --- | --- |
| Baseline | Current observed value or condition |
| Method | Reproducible command, query, or inspection rule |
| Window | History period or runtime sample |
| Exclusions | Generated, vendored, snapshot, fixture, migration, lock, or other noise |
| Confidence | High, medium, or low based on evidence quality |
| Limitation | Missing history, telemetry, tests, ownership, or runtime context |

Use repository-relative percentiles and trends when no project standard exists. Do not invent universal file-length, complexity, or coverage gates.

## Maintainability signals

### Change pressure

- commits and distinct change days per file or module
- recency-weighted touches over 30, 90, and 365 days
- lines added and removed normalized by current size
- files or modules that repeatedly change together
- number and concentration of authors

### Structural friction

- file and function size
- cyclomatic or cognitive complexity
- nesting depth and parameter count
- dependency cycles and boundary violations
- fan-in, fan-out, and public API surface
- duplicated implementations or competing patterns
- structural outliers among comparable sibling modules

The strongest maintainability candidates usually combine change pressure with structural friction. Length or complexity alone is weak evidence.

Interpret local reading cost, boundary evidence, and safe-transformation choice directly — the quality-* interpretive prose was evicted; the base model covers it.

## Correctness signals

- bug-fix and revert concentration by file or subsystem
- recurring failures attributed to the same boundary
- incidents involving data integrity, retries, races, or edge conditions
- changes to critical rules without nearby behavioral tests
- repeated production or support reports for one workflow

Do not infer that every commit containing `fix` is a defect. Inspect a sample and report the classification method.

Identify the invariant or boundary behind a candidate and the proof that would cover it directly — the base model covers this; use the browser-test skills when the proof is a real end-to-end test.

## Testing signals

- changed production behavior without corresponding tests
- same-code pass/fail frequency
- skipped or quarantined test age
- retry dependence
- slowest tests and duration variance
- repeated failure clusters
- expensive end-to-end coverage where a lower level could prove the behavior
- critical flows with no recent automated or exploratory evidence

Coverage percentage is a weak proxy. Prefer whether a test would fail for a meaningful regression at the cheapest reliable level.

## Reliability signals

- failure and recovery rate
- timeout and retry frequency
- retry amplification or duplicate work
- queue age, dead-letter volume, or backlog growth
- repeated dependency or partial-failure incidents
- mean time to detect or diagnose when trustworthy data exists
- missing logs, metrics, or traces at critical boundaries

Compare production signals only when workload, environment, and observation windows are compatible.

## Ranking and false positives

Rank candidates using separate evidence-backed dimensions:

1. Instability or repeated failure.
2. Friction and difficulty of safe change.
3. Exposure, usage, or dependency centrality.
4. Confidence and corroboration.
5. Feasibility of one bounded improvement.

Do not collapse the dimensions into a single quality score. A high score hides trade-offs and invites metric gaming.

Common false positives:

- long generated or declarative files
- migrations and snapshots with intentional churn
- central stable modules with high fan-in but clear ownership
- coordinated files that correctly represent one transaction
- low coverage around trivial adapters
- high author count in healthy shared infrastructure
- recent one-time migrations that distort the history window
