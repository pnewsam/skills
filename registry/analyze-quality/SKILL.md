---
name: analyze-quality
description: Analyze a repository's language-agnostic software quality using change history, structure, defects, tests, and operational evidence; interpret the signals through the focused quality-* skills; and rank bounded improvement candidates. Use for recurring quality audits, refactoring hotspot analysis, test-health or reliability assessment, or when deciding what maintainability work deserves a feature plan. Defaults to read-only analysis and never edits code, creates plans, commits, or publishes.
---

# Analyze Quality

## Outcome

Produce a read-only, evidence-backed quality assessment with a small ranked set of bounded improvement candidates. Use measurements to locate investigation targets, then use `quality-expert` and the smallest relevant focused quality skills to interpret them.

Do not equate a metric threshold with a defect. Prefer repository-relative trends and corroborating signals over universal limits or a composite quality score.

## Source anchors

- Code churn and defect density: https://www.microsoft.com/en-us/research/wp-content/uploads/2016/02/icse05churn.pdf
- Google engineering review guidance: https://google.github.io/eng-practices/review/reviewer/looking-for.html
- Google test-flakiness taxonomy: https://testing.googleblog.com/2020/12/test-flakiness-one-of-main-challenges.html

## Modes and effects

- **Maintainability:** clarity, modularity, refactoring pressure, duplication, dependency structure, and change isolation.
- **Correctness:** defect concentration, reverts, invariant risk, concurrency, and error-prone boundaries.
- **Testing:** coverage of changed behavior, flakiness, skips, runtime variance, and regression confidence.
- **Reliability:** recurring failures, retry amplification, timeout behavior, recovery, and diagnostic evidence.
- **Broad:** begin with repository-wide low-cost signals, then inspect only the strongest candidate areas across the modes above.

This workflow may inspect local files and Git history and run existing, read-only project checks when they are necessary to verify a signal. It must not edit files, install analyzers, create plans, commit, push, post, or change external systems.

Read `references/metrics.md` before selecting metrics or ranking findings.

## Workflow

### 1. Scope and measure

Identify the requested mode, repository boundaries, available history, and generated or vendored paths to exclude. Use existing repository tools first. Collect only measurements that can change the prioritization decision.

For a broad run, begin with:

- change frequency and normalized churn over useful time windows
- file and function size or complexity when existing tooling supports it
- co-change, dependency cycles, fan-in/fan-out, or boundary violations
- bug-fix and revert concentration
- tests, skips, flakes, duration, and recent failures when evidence exists

Record the measurement method, window, exclusions, and important data gaps. Do not install a tool merely to make the report look complete.

### 2. Interpret and rank

Route the evidence through `quality-expert`:

- `quality-code-clarity` for local reading and reasoning cost
- `quality-modularity` for coupling, ownership, and change isolation
- `quality-refactoring` for behavior-preserving improvement candidates
- `quality-correctness` for defects, invariants, and boundary risk
- `quality-testing` for confidence, gaps, and test health
- `quality-reliability` for failure, recovery, and operability

Require at least two corroborating signals before ranking a metric-driven candidate highly, unless direct defect or incident evidence is strong. Rank by:

- instability or repeated failure
- friction and difficulty of safe change
- exposure or dependency centrality
- confidence in the evidence
- feasibility of one bounded improvement

Prefer three strong candidates over a long smell inventory.

### 3. Report and hand off

For each candidate report:

- affected scope and quality concern
- evidence, baseline, window, and exclusions
- interpretation and plausible false positives
- expected improvement and behavior that must remain invariant
- a small first change and verification approach
- confidence and unresolved questions

Recommend `plan-feature` in Convergence mode for the selected candidate. Do not create that plan from this skill.

## Safety and reruns

- Preserve unrelated work and ignore generated, vendored, snapshot, migration, fixture, and lock files unless the selected mode specifically concerns them.
- Redact secrets and sensitive data from commands and reported evidence.
- Treat missing history, tests, coverage, or operational telemetry as a limitation, not a failing score.
- On rerun, use the same measurement definition when practical and explain any window, tool, or exclusion changes before comparing trends.
