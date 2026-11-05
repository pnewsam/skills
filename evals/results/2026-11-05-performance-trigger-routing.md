# Trigger routing: performance evidence in validate-work (2026-11-05)

Question: do benchmark and before/after metrics requests route to `validate-work` once its description names them?

## Method

`evals/trigger/run.py` with `build_fixture.sh`, Claude Code 2.1.318, default model (claude-opus-5-5), 2 reps × 6 prompts × 2 arms = 24 runs. The prompts were written for this test, not taken from transcripts, so they are dev-only with no holdout. Examples: "Can you benchmark this PR against main and tell me if it's actually faster?" and "Compare memory use before and after this PR".

| Arm | Registry |
| --- | --- |
| A | main |
| B | A plus the validate-work description change and `references/performance-evidence.md` |

## Results

| Category (prompts) | A | B |
| --- | --- | --- |
| Benchmark or before/after metrics (6) | 0/12 | 12/12 |

Every A miss loaded no skill and went straight to tools. No run picked a wrong registry skill.

## Limits

Routing is not outcome quality: this does not show that the reference improves what the agent measures or how it reports noise. The prompts are synthetic and the fixture branch is not a performance change. A behavioral A/B on a real performance PR remains open.
