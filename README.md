# Skills

Collected agent skills for Claude Code.

## Installation

### Quick start

Clone this repo and build the CLI:

```bash
git clone https://github.com/paulnewsam/skills.git
cd skills/cli
go build -o skills-cli ./cmd/skills
```

Then install skills into your harnesses:

```bash
# Interactive — choose harnesses and skills via TUI
./skills-cli

# Install all skills to all harnesses (symlinks)
./skills-cli install -a -y

# Install to a specific harness
./skills-cli install -t claude -y
./skills-cli install -t codex -y

# Project install (copies into <cwd>/.claude/skills)
./skills-cli install -p -y

# Custom directory (copies)
./skills-cli install -d /path/to/skills -y

# Force copy mode instead of symlinks
./skills-cli install -a -y --copy
```

By default, the CLI creates **symlinks** from each harness's skills directory back to this repo. Edits to skills in the repo are instantly available everywhere — no sync step needed.

Project installs (`-p`) and custom directory installs (`-d`) use copies, since the repo may not be available on other machines.

### Supported harnesses

| Harness | Skills directory |
|---------|-----------------|
| Claude Code | `~/.claude/skills` |
| Codex | `~/.agents/skills` |

Additional harnesses can be configured in `~/.config/skills/config.yaml`:

```yaml
harnesses:
  - name: cursor
    dir: ~/.cursor/rules
```

### Run from anywhere

Register `skills` as a global command:

```bash
./skills-cli setup
```

This symlinks the binary to `~/.local/bin/skills`. After that:

```bash
skills install -a -y       # symlink all skills into all harnesses
skills install -t claude -y # just Claude Code
skills install -p -y        # copy into current project
skills status               # see what's installed where
skills unlink codex         # remove symlinks from a harness
```

### Status and cleanup

```bash
# See what's installed in each harness (symlink vs copy)
skills status

# Remove all symlinked skills from a harness
skills unlink codex
```

## Skills

| Skill | Description | Source |
|---|---|---|
| [prepare-pr](registry/prepare-pr/SKILL.md) | Prepare a pull request from a local branch — inspect changes, write a conventional commit, push, and open a PR via the GitHub CLI. | Original |
| [revise-pr](registry/revise-pr/SKILL.md) | Revise an existing PR to ensure the title, description, type of change, and checklist accurately reflect the latest commits. | Original |
| [review-pr](registry/review-pr/SKILL.md) | Review a pull request and post inline code review comments on specific lines, with an overall verdict (approve, request changes, or comment), via the GitHub CLI. | Original |
| [assess-pr-risk](registry/assess-pr-risk/SKILL.md) | Assess the risk level of a pull request across blast radius, security sensitivity, test coverage, dependencies, and infrastructure changes, then post a structured assessment comment via the GitHub CLI. | Original |
| [plan-vulnerability-remediation](registry/plan-vulnerability-remediation/SKILL.md) | Triage CVEs, Dependabot alerts, and audit findings, then group them into safe, idempotent remediation PR plans before touching any code. | Original |
| [remediate-vulnerability](registry/remediate-vulnerability/SKILL.md) | Execute a vulnerability remediation plan — update dependencies or apply mitigations, verify the fix, commit, push, and open or update a PR. | Original |
| [plan-code-scanning-remediation](registry/plan-code-scanning-remediation/SKILL.md) | Triage CodeQL and SAST alerts, then group them into safe, idempotent remediation PR plans before touching any code. | Original |
| [remediate-code-scanning](registry/remediate-code-scanning/SKILL.md) | Apply source code fixes for CodeQL/SAST alerts, verify the fix, commit, push, and create or update a pull request. | Original |
| [plan-browser-tests](registry/plan-browser-tests/SKILL.md) | Analyze an application to identify its most critical user flows and produce a prioritized browser test plan in `docs/tmp/browser-test-plan.md` for use by the add-browser-test skill. | Original |
| [add-browser-test](registry/add-browser-test/SKILL.md) | Implement one browser integration test from the plan produced by plan-browser-tests — picks the next unchecked flow, writes the test, runs it to verify it passes, and marks it complete. | Original |
| [audit-browser-tests](registry/audit-browser-tests/SKILL.md) | Audit an existing browser test suite to identify stale tests, missing coverage, flaky patterns, and quality issues. Produces an audit report and an updated browser test plan. | Original |
| [fix-browser-test](registry/fix-browser-test/SKILL.md) | Repair a broken or flaky browser test — diagnoses the root cause against recent app changes, applies a targeted fix, and re-runs to confirm it passes. | Original |
| [svg-animations](registry/svg-animations/SKILL.md) | Create performant SVG animations and illustrations: path animations, shape morphing, loading spinners, animated logos, gradients, masks, and filters. | [supermemoryai/skills](https://github.com/supermemoryai/skills/blob/main/svg-animations/SKILL.md) |

## Repo structure

```
registry/           # the skill bucket — each subdirectory is a skill
  prepare-pr/
  review-pr/
  ...
cli/                # Go CLI tool for installing skills
  cmd/skills/       # cobra commands
  internal/         # skill discovery, harness config, installer, TUI
  Makefile
  .goreleaser.yaml
```

## Roadmap

- **Additional harnesses:** Cursor (`.cursor/rules/`), Copilot (`.github/copilot-instructions.md`), and others as their skill formats stabilize.
- **Content adaptation:** Some harnesses may need skill content rewritten (e.g., tool-specific references). A transformation layer could handle this while keeping the canonical source unchanged.
