# Pull requests

## Contents

- Resolve the PR and action
- Update an existing PR
- Screenshots
- Post a review
- Publish and verify

Use [GitHub mechanics](github-mechanics.md) for access, target resolution, and verified writes.

## Resolve the PR and action

Resolve the repository, head, evidence-backed base, and any existing PR. Search by repository and head before creating; reuse the matching PR and investigate a base mismatch instead of opening a duplicate. A closed or merged PR is a valid read-only target; editing it requires an explicit retrospective request.

Choose the action from the request and current state:

- **Preview:** inspect and draft only. Preview does not run checks that write project reports or caches.
- **Commit:** create a suitable branch if needed, stage related changes, and commit locally.
- **Push:** commit plus push the intended branch. Confirm the commit and destination first.
- **Open PR:** push plus create or reuse the matching PR, as a draft unless requested otherwise.
- **Update metadata:** preview or apply a factual sync or prose-only polish to an existing PR.

An existing PR turns creation into reuse; it does not turn an authorized commit or push into a metadata-only action. A metadata-only request never authorizes code or Git changes. Do not assign people, request reviews, add labels, or merge by default.

## Update an existing PR

Read the current title, full body, template, head SHA, commits, and diff before drafting.

- **Sync:** correct facts and omissions only from the actual candidate and observed validation. Revise an inaccurate title. Leave an accurate body alone.
- **Polish:** improve prose while preserving every fact, number, link, identifier, command, result, and checklist state. If facts need correcting, call it a sync instead of hiding it inside polish.

Preview returns proposed text. A request to update or apply authorizes editing the title and body only. Refresh the head and editable fields immediately before applying, and reconcile concurrent edits rather than overwriting them. Preserve the template structure and human-written content. Use the [update output templates](update_output_templates.md) when helpful.

## Screenshots

`validate-work` captures before/after images and writes a `screenshots.md` table. The CLI cannot upload images to GitHub, so give the user the local folder and the table to drag images into. Add the table to the body only when a PR update is authorized. Never claim an image is attached while it is still a local file or placeholder. Upload elsewhere only with authorized visibility, and never use a throwaway branch as an image host, because the embeds break when the branch is deleted.

## Post a review

Post only the review or comment explicitly requested. Use the [finding model](../../pr-conventions/references/finding-model.md) for findings, and confirm the evidence still applies to the current head. Do not post internal review rounds automatically. Before posting a review, refresh the head and diff, confirm the verdict and each inline position, and submit one review. Put line-anchored findings inline on valid changed lines; use the body only for findings that do not map to a line or whose valid position cannot be established. Verify the posted review and any selected resolutions. If a summary comment is explicitly requested, derive it from the round ledger and verified remote head; do not attest to local-only fixes. Replies to existing threads and their resolution belong to `reconcile-work`.

## Publish and verify

Refresh the repository, head, base, and matching PR state at the boundary. Prefer structured text fields or a temporary UTF-8 body file with `--body-file`. After a push, verify the remote head. After creating or updating a PR, verify its URL, title, body, head, base, and draft state. Use the [PR output templates](pr_output_templates.md) if a template helps. Return the boundary reached and remaining conditions; conflicts, pending CI, or unavailable checks do not support a merge-ready claim.
