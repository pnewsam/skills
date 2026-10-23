# Trigger routing: four registry variants (2026-10-23)

Question: do the usage-audit trigger rewrites route real requests to the right skill, does a `reconcile-work` operation route open-PR work, and does folding the platform runbooks into operations lose routing?

## Method

`evals/trigger/run.py`, Claude Code 2.1.309, default model (claude-opus-5-5), 3 reps × 20 prompts × 4 arms = 240 runs. The prompts are verbatim user requests from 2026-09-28 to 2026-10-22 transcripts, without their conversations. They stay outside this public repo. A run scores a hit when its first non-reference skill is an accepted owner for that arm.

| Arm | Registry |
| --- | --- |
| A | Before #72 |
| B | main after #72 (new execute-work and validate-work trigger wording) |
| C | B plus `reconcile-work` |
| D | C with publish-pr, rebase-pr, create-issue, and create-project removed and their phrases moved into deliver-work, reconcile-work, plan-work, and plan-epic descriptions |

## Results

| Category (prompts) | A | B | C | D |
| --- | --- | --- | --- | --- |
| Address a PR review (4) | 3/12 | 9/12 | 9/12 | 10/12 |
| Rebase or conflicts (3) | 7/9 | 9/9 | 9/9 | 9/9 |
| Update PR description (2) | 4/6 | 4/6 | 4/6 | 3/6 |
| Screenshots (3) | 0/9 | 9/9 | 9/9 | 9/9 |
| Manual QA (3) | 0/9 | 3/9 | 2/9 | 4/9 |
| Open or update a PR (3) | 2/9 | 3/9 | 2/9 | 5/9 |
| File an issue (2) | 6/6 | 6/6 | 6/6 | 6/6 |
| **Total** | **22/60** | **43/60** | **41/60** | **46/60** |

Every miss loaded no skill; the session went straight to Bash. No run picked a wrong registry skill.

## Findings

- The #72 trigger wording roughly doubled correct routing (22 → 43). Screenshots went from 0/9 to 9/9 and review responses from 3/12 to 9/12.
- `reconcile-work` routes review responses as well as execute-work's wording does (9/12 each), not better. Its case rests on owning the open-PR loop, not on routing.
- Folding the runbooks into operations did not lose routing (46 vs 41). Operations with the user's phrases in their descriptions routed rebases (9/9) and issues (6/6) as reliably as named runbooks, and opened PRs more often (5/9 vs 2/9).
- Manual QA and terse PR requests ("draft PR it") remain weak in every arm.

## Limits

Three reps per prompt, so arm differences under about five hits are noise. B, C, and D are not separable at this size; only A vs the rest is clear. Prompts lacked their conversations, which likely depresses routing for terse follow-ups. Routing is not outcome quality.
