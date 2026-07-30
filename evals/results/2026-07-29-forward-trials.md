# Forward trials: 2026-07-29

## Scope

Run fresh-agent trials in disposable local repositories against the high-use
Git, delivery, validation, session, and routing skills. Preserve raw repository
state after each task and make no live GitHub writes.

Current regression suite:

- 25 declarative cases
- 18 cases exercised locally
- 7 GitHub-dependent cases deferred until a sandbox repository and test
  account are available

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

## Deferred GitHub cases

The following cases require a sandbox GitHub repository and authenticated test
account to verify live reads and writes without risking a real project:

- `prepare-open-pr`
- `review-analyze`
- `review-post`
- `risk-analyze`
- `risk-post`
- `revise-audit`
- `revise-apply`

Their declarative case definitions and referenced skills remain covered by
registry validation. Do not claim live behavioral coverage until these cases
run against a sandbox account.
