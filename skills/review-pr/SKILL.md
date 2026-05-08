---
name: review-pr
description: perform a thorough code review of a GitHub pull request and post the review as inline comments on specific lines, with an overall verdict. use when asked to review a PR, leave code review comments, approve a PR, or request changes. analyzes correctness, security, error handling, code quality, test coverage, and performance, then submits a proper GitHub review (with line-level comments) via the GitHub CLI.
---

# Review PR

## Overview

Perform a thorough code review of a pull request by reading the actual diff, identifying issues at the line level, and submitting a proper GitHub review that includes inline comments on specific lines plus an overall verdict (APPROVE, REQUEST_CHANGES, or COMMENT).

This is a read-first, write-last skill. Read and analyze everything before drafting a single comment. Never invent findings that are not traceable to a specific line in the diff.

## Safety rules

- Never modify source code, commit history, or branch state. The only write operations are posting the review comment.
- Do not post a review until the full assessment is complete and confirmed by the user (unless explicitly asked to run automatically).
- Only comment on lines that appear in the diff. GitHub rejects inline comments on lines outside the changed hunks.
- Do not approve a PR that has blocking issues. When in doubt, use COMMENT rather than APPROVE or REQUEST_CHANGES.
- Do not invent issues. Every comment must cite a specific file and line from the diff.

## Review dimensions

Evaluate each dimension for every changed file. Focus effort on changed lines, but note issues in unchanged surrounding context if they are clearly relevant.

### 1. Correctness and logic

Look for:
- Off-by-one errors, incorrect boundary conditions
- Incorrect boolean logic, flipped conditions
- Unreachable code paths
- Incorrect assumptions about input types or ranges
- Race conditions or incorrect ordering of operations
- Missing null/undefined checks where the value could plausibly be absent

### 2. Security

Look for:
- Injection vulnerabilities (SQL, shell, HTML, path traversal)
- Hardcoded secrets, tokens, or credentials
- Insecure deserialization
- Missing authentication or authorization checks on new endpoints/routes
- Overly permissive CORS, CSP, or access control settings
- Logging of sensitive data (passwords, tokens, PII)
- Use of deprecated or known-insecure cryptographic functions

### 3. Error handling

Look for:
- Empty or swallowed catch blocks (`catch (e) {}`)
- Errors caught but not logged or surfaced
- Exceptions thrown where callers cannot reasonably handle them
- Async errors not awaited or not propagated
- Resource leaks (file handles, connections, locks) in error paths

### 4. Code quality

Look for:
- Functions that are too long or do too many things (suggest decomposition)
- Duplicated logic that could be extracted
- Unnecessary complexity: nested ternaries, overly clever one-liners
- Magic numbers or strings that should be named constants
- Misleading or inaccurate variable/function names
- Dead code, commented-out code, debug statements left in

### 5. Performance

Look for:
- N+1 query patterns (database calls inside loops)
- Unnecessary re-computation in hot paths
- Blocking synchronous I/O where async is expected
- Large objects allocated or copied unnecessarily
- Missing indexes for new query patterns (if schema is visible)

### 6. Test coverage

Look for:
- New code paths with no corresponding test
- Tests that only test the happy path, missing error cases
- Test assertions that are too loose (e.g. `expect(result).toBeTruthy()`)
- Mocks that make the test pass regardless of implementation

### 7. Documentation and clarity

Look for:
- Public API changes with no documentation update
- Misleading or outdated comments on changed lines
- Missing JSDoc/docstrings on exported functions with non-obvious behavior
- Commit message or PR description that doesn't match the code

## Severity levels

Assign one severity to each comment:

| Severity | Meaning | Effect on verdict |
|----------|---------|-------------------|
| Blocking | Must be fixed before merge — correctness, security, data integrity | Drives REQUEST_CHANGES |
| Major | Should be fixed — significant quality issue, but edge cases or non-critical paths | Drives REQUEST_CHANGES unless few and acknowledged |
| Minor | Should consider fixing — style, clarity, minor improvement | Does not block approval |
| Nit | Optional — personal preference, very small style point | Prefix with "Nit:" |
| Praise | Something done well — highlight positive patterns | Does not affect verdict |

## Verdict logic

Choose one verdict based on the overall findings:

- **APPROVE**: No blocking or major issues. Only minor/nit feedback or praise. Use sparingly — approval signals readiness to merge.
- **REQUEST_CHANGES**: One or more blocking or major issues found. The author must address at least the blocking items before the PR should merge.
- **COMMENT**: Non-blocking feedback only, or you are not sure whether the code is correct (e.g. missing domain context). Also use COMMENT when asked not to approve or block.

When multiple findings point in different directions, the most severe single finding determines the verdict.

## Workflow

### 1. Verify the GitHub CLI is available

```bash
gh --version
```

If `gh` is not installed or not authenticated, stop and instruct the user to install it (`brew install gh` on macOS) and run `gh auth login`.

### 2. Identify the target PR

If the user provides a PR number, use that. Otherwise, detect from the current branch:

```bash
gh pr view --json number,title,body,baseRefName,headRefName,state,url,author
```

If no PR is found, list open PRs:

```bash
gh pr list --state open
```

Store: `number`, `title`, `baseRefName`, `headRefName`, `state`, `url`.

Also fetch the repo identity for API calls:

```bash
gh repo view --json nameWithOwner -q '.nameWithOwner'
```

Store as `REPO` (e.g. `org/repo-name`).

### 3. Fetch and parse the diff

First, get a high-level summary of what changed:

```bash
git fetch origin
git diff --stat origin/<baseRefName>...origin/<headRefName>
git diff --name-status origin/<baseRefName>...origin/<headRefName>
```

Then fetch the full diff. For large PRs (100+ files), fetch per file or per module:

```bash
gh pr diff <number>
```

Or for a specific file:

```bash
git diff origin/<baseRefName>...origin/<headRefName> -- <path>
```

**Tracking line numbers in the diff:**

The unified diff format includes `@@` hunk headers like:

```
@@ -10,6 +10,8 @@
```

The second pair (`+10,8`) means: the new file starts at line 10, and this hunk covers 8 lines. Track the current line number in the new file as you read each hunk. Lines starting with `+` (additions) and ` ` (context) advance the new-file line counter. Lines starting with `-` (deletions) do not. Only additions (`+` lines) and their surrounding context lines can receive inline comments.

**Important**: Record the exact new-file line number for every `+` line where you might want to leave a comment. You cannot comment on lines that are not in the diff.

### 4. Analyze the diff

Work through the diff systematically. For each changed file:

1. Read the file-level context: what is this file's purpose?
2. Read each hunk and understand what the change does
3. For each finding, record:
   - **file**: path relative to repo root (exactly as it appears in the diff header, e.g. `src/api/auth.ts`)
   - **line**: the new-file line number of the specific line the comment applies to
   - **severity**: Blocking / Major / Minor / Nit / Praise
   - **dimension**: which of the 7 dimensions this falls under
   - **comment body**: what the issue is, why it matters, and (where appropriate) how to fix it

Also record findings that apply to the PR as a whole (for the summary) but that cannot be pinned to a specific line.

### 5. Determine the overall verdict

Based on the findings:
- Any Blocking finding → REQUEST_CHANGES
- Any Major finding → REQUEST_CHANGES (unless context clearly justifies COMMENT)
- Minor / Nit / Praise only → APPROVE or COMMENT based on confidence
- No findings → APPROVE (state this explicitly)

### 6. Draft the review

**Inline comments:** Each comment body should be concise, direct, and actionable. Follow this structure:

```
[Severity prefix, if not implicit]: <the issue>

<why it matters or what could go wrong>

<optional: suggested fix or alternative>
```

Example:
```
**Blocking:** This catch block swallows the error silently.

If the database write fails, the caller will receive a success response with no indication that the write was lost, leading to data inconsistency.

Consider: re-throwing the error, or returning an error result that the caller must handle.
```

Prefix nits explicitly: `Nit: ...`
Prefix praise explicitly: `Nice: ...` or `Good: ...`

**Summary body:** Write a concise overall review summary that:
- States the overall verdict and the single most important finding
- Groups any inline comments that share a theme
- Notes anything positive about the PR
- Adds any overall observations that couldn't be pinned to a line

Use this template:

```markdown
## Code Review

**Verdict: <APPROVE / REQUEST_CHANGES / COMMENT>**

<One paragraph overall assessment. Name the key finding that drove the verdict. Be specific.>

### Summary of findings

| Severity | File | Issue |
|----------|------|-------|
| Blocking | `path/to/file.ts:42` | <brief description> |
| Major | `path/to/file.ts:87` | <brief description> |
| Minor | `path/to/file.ts:15` | <brief description> |

<If no findings: "No issues found. Code looks good to merge.">

### What's working well

<Optional: note patterns done well, tests added, clean implementation choices.>

---
_Reviewed by Claude Code · <branch> → <base> · <date>_
```

### 7. Present for confirmation

Show the user:
- The overall verdict
- The full list of inline comments (file, line, severity, body)
- The full summary body

Ask for confirmation before posting. If the user asks to adjust comments, revise and re-present.

Skip confirmation only if the user has explicitly requested automatic posting.

### 8. Post the review via the GitHub API

Build the review payload as a JSON file, then post it using `gh api`:

```bash
# Write the payload to a temp file
cat > /tmp/pr_review_payload.json << 'PAYLOAD'
{
  "body": "<summary body>",
  "event": "COMMENT",
  "comments": [
    {
      "path": "src/api/auth.ts",
      "line": 42,
      "side": "RIGHT",
      "body": "**Blocking:** ..."
    },
    {
      "path": "src/utils/helpers.ts",
      "line": 17,
      "side": "RIGHT",
      "body": "Nit: ..."
    }
  ]
}
PAYLOAD

# Post the review
gh api repos/<REPO>/pulls/<number>/reviews \
  --method POST \
  --input /tmp/pr_review_payload.json

# Clean up
rm /tmp/pr_review_payload.json
```

Replace `"event"` with the appropriate value:
- `"APPROVE"` — approves the PR
- `"REQUEST_CHANGES"` — requests changes
- `"COMMENT"` — submits without approval or change request

**If a comment line is rejected:** GitHub returns a 422 if a comment line is not in the diff. If this happens:
1. Check the exact line number against the diff output
2. Adjust the line number to the nearest `+` line in the same hunk
3. Or convert the comment to a general PR comment (not inline)

After posting, verify the review appears:

```bash
gh pr view <number> --json reviews
```

### 9. Final response

Report:
- PR number and URL
- Verdict posted (APPROVE / REQUEST_CHANGES / COMMENT)
- Count of inline comments by severity
- The single most important finding
- Any comments that could not be posted inline (and why)

## Handling common situations

### PR has no diff (no changes)

Stop and inform the user. There is nothing to review.

### Very large PR (100+ files)

Do not review every file exhaustively. Instead:
1. Prioritize files that touch security, auth, data access, or public APIs
2. Do a lighter pass on test files and config changes
3. Note in the summary that due to PR size, review focused on high-risk areas
4. List the files that were not reviewed in depth

### PR is already merged or closed

Still perform the review and post it — post-merge review is valuable for team learning and catching regressions before they compound. Note the state in the summary.

### PR authored by the user themselves

Still post the review. Self-review is valid. Use COMMENT rather than APPROVE for self-authored PRs unless the user explicitly asks to self-approve.

### Inline comment line not in diff

Convert the comment to a general comment referencing the file and line by name:
```
In `src/api/auth.ts` around line 42: <comment body>
```
Add it to the summary body rather than the `comments` array.

### `gh api` fails with 422

A 422 usually means a line number is not in the diff. Fix the line number or move the comment to the summary. Do not retry with the same line number.

### No issues found

State this clearly. Post an APPROVE review with a brief positive summary. Do not fabricate issues to seem thorough.

### User asks to approve without a full review

Warn the user that approving without reviewing the diff defeats the purpose. If they confirm, post an APPROVE with a note that the review was not performed.
