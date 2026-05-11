# Skills

Collected agent skills for Claude Code.

## Installation

Clone this repo, then run the install script from the repo root:

```bash
# Interactive — choose harnesses and skills, then press Enter to install
./install.sh

# Install to all known harnesses (symlinks)
./install.sh -a -y

# Install to a specific harness
./install.sh -t claude -y
./install.sh -t codex -y

# Project install (copies into <cwd>/.claude/skills)
./install.sh -p

# Custom directory (copies)
./install.sh -d /path/to/skills

# Force copy mode instead of symlinks
./install.sh -a -y --copy
```

By default, the script creates **symlinks** from each harness's skills directory back to this repo. Edits to skills in the repo are instantly available everywhere — no sync step needed.

Project installs (`-p`) and custom directory installs (`-d`) use copies, since the repo may not be available on other machines.

### Supported harnesses

| Harness | Skills directory |
|---------|-----------------|
| Claude Code | `~/.claude/skills` |
| Codex | `~/.agents/skills` |

Adding a new harness is a one-line addition to the `HARNESS_DEFS` array at the top of `install.sh`.

### Run from anywhere

Register `skills` as a CLI command so you can run it from any project directory:

```bash
./install.sh --setup
```

This symlinks `install.sh` to `~/.local/bin/skills`. After that:

```bash
skills -a -y          # symlink all skills into all harnesses
skills -t claude -y   # just Claude Code
skills -p             # copy into current project
skills --status       # see what's installed where
skills --unlink codex # remove symlinks from a harness
```

### Status and cleanup

```bash
# See what's installed in each harness (symlink vs copy)
./install.sh --status

# Remove all symlinked skills from a harness
./install.sh --unlink codex
```

## Skills

| Skill | Description | Source |
|---|---|---|
| [prepare-pr](skills/prepare-pr/SKILL.md) | Prepare a pull request from a local branch — inspect changes, write a conventional commit, push, and open a PR via the GitHub CLI. | Original |
| [revise-pr](skills/revise-pr/SKILL.md) | Revise an existing PR to ensure the title, description, type of change, and checklist accurately reflect the latest commits. | Original |
| [review-pr](skills/review-pr/SKILL.md) | Review a pull request and post inline code review comments on specific lines, with an overall verdict (approve, request changes, or comment), via the GitHub CLI. | Original |
| [plan-vulnerability-remediation](skills/plan-vulnerability-remediation/SKILL.md) | Triage CVEs, Dependabot alerts, and audit findings, then group them into safe, idempotent remediation PR plans before touching any code. | Original |
| [remediate-vulnerability](skills/remediate-vulnerability/SKILL.md) | Execute a vulnerability remediation plan — update dependencies or apply mitigations, verify the fix, commit, push, and open or update a PR. | Original |
| [plan-code-scanning-remediation](skills/plan-code-scanning-remediation/SKILL.md) | Triage CodeQL and SAST alerts, then group them into safe, idempotent remediation PR plans before touching any code. | Original |
| [remediate-code-scanning](skills/remediate-code-scanning/SKILL.md) | Apply source code fixes for CodeQL/SAST alerts, verify the fix, commit, push, and create or update a pull request. | Original |
| [svg-animations](skills/svg-animations/SKILL.md) | Create performant SVG animations and illustrations: path animations, shape morphing, loading spinners, animated logos, gradients, masks, and filters. | [supermemoryai/skills](https://github.com/supermemoryai/skills/blob/main/svg-animations/SKILL.md) |

## Roadmap

- **Additional harnesses:** Cursor (`.cursor/rules/`), Copilot (`.github/copilot-instructions.md`), and others as their skill formats stabilize.
- **Content adaptation:** Some harnesses may need skill content rewritten (e.g., tool-specific references). A transformation layer could handle this while keeping the canonical source unchanged.
