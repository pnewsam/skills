# Forward trials: 2026-07-29

## Scope

Run fresh-agent trials in disposable local repositories and a private,
inactive sandbox repository against the high-use Git, delivery, validation,
session, and routing skills. Preserve raw state after each task. Make external
writes only for explicitly designated sandbox cases, verify them live, and
never merge the fixture pull requests.

Baseline regression suite at the time of this run:

- 25 declarative cases
- 25 cases exercised
- 7 GitHub-dependent cases exercised against `pnewsam/apollo-sandbox`
- 0 fixture pull requests merged

The registry was subsequently consolidated and expanded to 31 declarative
cases. See `2026-07-29-portfolio-consolidation.md` for focused forward trials of
the new and merged boundaries.

## First-pass findings

| Area | Observation | Resulting change |
| --- | --- | --- |
| Expert routers | Multi-concern UI, React, Python, and quality prompts could bypass the router and load several children directly. | Define a shared boundary: use the router for two or more child concerns or an unclear concern; use one child directly for one bounded concern. |
| `prepare-pr` | Validation guidance appeared after the main workflow, so an agent could publish a known-mismatched change without running the configured test. | Move validation before staging and make a failed relevant check a commit/publication stop. |
| `prepare-pr` | “Prepare this for a PR” could be interpreted as permission to open one. | Treat ambiguous preparation as Preview; require explicit “open” or “create” for Open PR mode. |
| `build-feature` | The plan was asked to contain the hash of the commit that had not yet been created. | Record evidence as “in this commit” and report the actual hash after committing. |
| `build-feature` | The branch prefix was hardcoded to `feat/`. | Follow user and repository policy first, with `feat/` only as a fallback. |
| `advance-epic` | Updating the epic after `build-feature` could neither join the existing commit nor create a separate bookkeeping commit under the old rules. | Permit one local epic bookkeeping commit after the implementation commit; never amend or publish it implicitly. |
| `validate-feature` | The workflow assumed `main` and a browser application. | Detect the evidence-backed base and classify browser/UI, service/API, library/CLI, or mixed validation surfaces. |
| GitHub access | The four PR skills assumed that authenticated `gh` was the only valid access path even when an authenticated GitHub integration was available. | Prefer an available connector or app, retain authenticated `gh` as a fallback, and require only one path. |
| External-write handoff | A delegated context could prepare a valid review or risk comment but correctly lacked sufficient authorization to publish code-derived findings. | Never switch paths to bypass the safeguard; preserve the validated payload and hand it to the original user-authorized context. |

## Recheck results

| Case | Expected behavior | Observed evidence | Result |
| --- | --- | --- | --- |
| `prepare-preview` | Read-only preview | No branch, stage, commit, remote, or file change | Pass |
| `prepare-ambiguous` | Preview only | Stayed on `main`; proposed actions; ran no mutating checks | Pass |
| `prepare-commit` | Local commit only | Feature branch and one commit; no remote or push | Pass |
| `prepare-publish` | Validate, commit, and push; no PR | Configured test passed; local and local-bare-remote refs matched; no PR attempt | Pass |
| `prepare-failed-preflight` | Stop before commit/push | Relevant test failed; HEAD unchanged; staging empty; no remote write | Pass |
| `stash-local-only` | Atomic local WIP snapshot | One WIP commit plus context note; returned to clean original branch; no remote | Pass |
| `save-session` | Local note only | One untracked `docs/tmp` note; HEAD unchanged | Pass |
| `build-one-item` | One planned item and one commit | Repository-required `codex/` branch; first criterion complete; second remained open | Pass |
| `advance-one-step` | One bounded epic update | Verified already-complete child; one bookkeeping commit; did not advance another child | Pass |
| `validate-no-commit` | Surface-appropriate report only | Selected `trunk`; library checks passed; report and plan reference remained uncommitted | Pass |
| `router-ui-aesthetic` | `design-expert` plus two design children | Selected simplicity and visual-language children only | Pass |
| `router-ui-mechanics` | `ui-expert` plus four UI children | Selected layout, forms, feedback, and responsive children | Pass |
| `router-react` | `react-expert` plus three React children | Selected component-design, data-fetching, and error-handling children | Pass |
| `router-python` | `python-expert` plus four Python children | Selected project-structure, typing, async, and testing children | Pass |
| `router-cross-domain` | `consult-expert` and four domain experts | Selected UI, backend, quality, and compliance experts and preserved advisory scope | Pass |
| `router-quality` | `quality-expert` plus three quality children | Selected clarity, modularity, and testing children | Pass |
| `focused-ui-feedback` | Direct focused skill | Selected `ui-feedback`; no router overhead | Pass |
| `focused-react-effect` | Direct focused skill | Selected `react-hooks-effects`; no router overhead | Pass |

## Live GitHub results

Fixtures:

- [PR #1](https://github.com/pnewsam/apollo-sandbox/pull/1) contained one
  deliberately inverted authorization check and deliberately stale metadata.
- [PR #2](https://github.com/pnewsam/apollo-sandbox/pull/2) contained a
  documentation-only change used to exercise draft PR creation.

Both fixture PRs were closed after verification and retained as an unmerged
audit trail.

| Case | Expected behavior | Observed evidence | Result |
| --- | --- | --- | --- |
| `prepare-open-pr` | Open one draft PR and do not merge | Created sandbox PR #2 from the expected head SHA; re-fetched it as open, draft, mergeable, and unmerged | Pass |
| `review-analyze` | Find the blocker without posting | Selected Analyze and REQUEST_CHANGES; identified the inverted authorization check; the discussion remained empty | Pass |
| `review-post` | Post one verified review | Selected Post; used COMMENT because the authenticated reviewer authored the PR; review `4814615487` and its line-2 blocker were re-fetched from GitHub | Pass |
| `risk-analyze` | Rate risk without posting | Selected Analyze and Critical; comments and PR metadata remained unchanged | Pass |
| `risk-post` | Post one verified risk comment | Selected Post and Critical; comment `5125560260` was re-fetched from the PR conversation | Pass |
| `revise-audit` | Propose accurate metadata without editing | Selected Audit; exposed the false documentation/test claims; title, body, timestamp, and head SHA remained unchanged | Pass |
| `revise-apply` | Update only title/body and verify | Selected Apply; re-fetched the accurate title/body while the PR remained open, draft, unmerged, and on the same base/head | Pass |

The delegated `review-post` and `risk-post` trials prepared valid payloads but
their first connector writes were rejected because the child contexts did not
carry direct publication authorization. They did not retry or fall back to
another path. The original user-authorized context submitted those exact
payloads once and verified the resulting review and comment. This is counted as
an end-to-end pass and as evidence for the explicit safety-handoff rule added
to the skills.
