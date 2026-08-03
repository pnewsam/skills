# GitHub interaction mechanics

Shared rules for reading and writing pull-request state. Apply these in any PR skill that touches GitHub.

## Select one authenticated access path

Prefer an available authenticated GitHub connector or app. Otherwise use authenticated `gh`:

```bash
gh --version
gh auth status
```

Do not require both paths. If neither is authenticated, stop and explain how to connect the integration or authenticate `gh`. Once a path is selected, use it for the whole task.

## Resolve the target PR

If the user names a PR number, use it. Otherwise detect the PR for the current branch.

With a connector, resolve the repository, search open PRs for the current head, and fetch the selected PR. With `gh`:

```bash
gh pr view --json number,title,body,baseRefName,headRefName,state,url,headRefOid
```

If no PR is found, list open PRs so the user can choose:

```bash
gh pr list --state open
```

Record for later use: `number`, `title`, `body`, `baseRefName` (base branch), `headRefName` (head branch), `url`, and the current head SHA.

## Merged or closed PRs

If the PR state is `MERGED` or `CLOSED`, stop and tell the user. Do not edit a closed PR unless the user explicitly asks for a retrospective change.

## Write once, then verify

Perform each GitHub write exactly once through the selected access path, then fetch the live result and confirm it:

- Before writing, verify the repository, PR number, and current head SHA.
- After writing, re-fetch and verify the change is present — title and body for a metadata edit, the submitted review for a review, the new head SHA for a push.
- If the selected path rejects the write because direct user authorization is missing, do not retry through another path to bypass it. Report the rejection and preserve the prepared payload for the original user-authorized context.
