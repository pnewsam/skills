---
name: publish-pr
description: Prepare a local change for a commit, push, or new GitHub PR, or update an existing PR title and body. Detects current PR state and preserves distinct creation, factual sync, and prose-only polish modes. Preview is read-only; carries the user's requested delivery endpoint.
---

# Publish PR

Apply `work-conventions` and `pr-conventions`. Own Git/GitHub mechanics and PR metadata, not a separate validation policy. Use `references/github-mechanics.md` for authenticated access, target resolution, and verified writes.

## Resolve state and endpoint

Resolve the repository, head, evidence-backed base, and any existing PR. Search by repository/head before creating; reuse the matching PR and investigate a base mismatch instead of opening a duplicate. A closed or merged PR is a valid read-only target; metadata edits require an explicit retrospective request.

Choose the action from the user's request and current state:

- **Preview:** inspect and draft only.
- **Commit:** create a suitable branch if needed, stage related changes, and commit locally.
- **Publish:** commit plus push the intended branch.
- **Open PR:** publish plus create or reuse the matching PR; default to draft unless requested otherwise.
- **Update metadata:** preview or apply a factual sync or prose-only polish to an existing PR.

An existing PR changes creation into reuse; it does not turn an authorized code commit/push into a metadata-only action. Carry prior authorization; do not ask again for an already requested endpoint. Metadata-only requests never authorize code or Git mutations. Do not assign people, request reviews, add labels, merge, or deploy by default.

## Prepare a code candidate

Read repository instructions, branch, status, committed diff against the verified base, staged/unstaged changes, and intended untracked files. Fetch current base state when preparing publication, compare divergence, and identify overlap before claiming integration readiness. A feature-branch upstream is not the PR base.

Preserve unrelated changes and index state. Isolate intended work when necessary. Do not commit on a protected base branch; follow the user's/repository's branch convention. Stage explicit related paths or hunks and inspect the staged diff. Exclude credentials, dependency directories, and incidental build artifacts. Do not rewrite history or broadly clean the checkout for convenience. Use `rebase-pr` only when rebase is requested.

Check validation evidence against the actual candidate and required repository checks; reuse current proof. Run missing required checks within scope. Do not knowingly commit failing work except for explicitly requested preservation. Preview does not run checks that write project reports or caches.

Write factual commit/PR text using the repository template and `pr-conventions`. Skip duplicate commits. Confirm the commit and destination before push. Read `references/visual-evidence.md` when visual evidence helps review; do not claim attachment from a local file or placeholder.

## Update existing metadata

Read the current title, full body, template, head SHA, commits, and diff before drafting.

- **Sync:** correct facts and omissions only from the actual candidate and observed validation. Revise an inaccurate title. Leave an already accurate body alone.
- **Polish:** improve prose while preserving every fact, number, link, identifier, command, result, and checklist state. If facts need correcting, identify that as a sync instead of hiding it inside polish.

Preview returns proposed text. An explicit request to update/apply authorizes editing the title/body only. Refresh the head and editable fields immediately before applying; reconcile concurrent changes rather than overwriting them. Preserve template structure and human content. Use `references/update_output_templates.md` when helpful.

## Publish and verify

Refresh repository/head/base and matching PR state at the boundary. Prefer structured text fields or a temporary UTF-8 body file with `--body-file`. Verify the remote head after push and URL, title/body, head/base, and draft state after creation or update. Use `references/pr_output_templates.md` if an output template helps.

After an ambiguous write, inspect actual state before retrying. A permission rejection is not a reason to switch access paths. Return only the boundary reached and remaining conditions; conflicts, pending CI, or unavailable checks do not support a merge-ready claim.
