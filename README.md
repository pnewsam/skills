# Skills

Collected agent skills for Claude Code.

## Installation

Clone this repo, then run the install script from the repo root:

```bash
# Interactive — choose destination, toggle skills, then press Enter to install
./install.sh

# Install to your global ~/.claude/skills
./install.sh -g

# Install to the current project's .claude/skills
./install.sh -p

# Install to a custom directory
./install.sh -d /path/to/.claude/skills

# Skip prompts and install all skills (defaults to global)
./install.sh -y
```

### Run from anywhere

Register `skills` as a CLI command so you can run it from any project directory:

```bash
./install.sh --setup
```

This symlinks `install.sh` to `~/.local/bin/skills`. After that:

```bash
# From any project directory — installs to that project's .claude/skills
cd ~/dev/my-project
skills -p

# Or interactively choose global vs project vs custom
skills
```

The script is safe to re-run — it updates existing skills in place.

### Syncing across locations

If you edit a skill in one location (e.g. the repo) and want to propagate it everywhere it's installed, use the sync command:

```bash
skills --sync              # sync all skills across all known locations
skills --sync prepare-pr   # sync a specific skill
```

`--sync` finds the most recently modified copy of each skill and copies it to every other location where that skill already exists. Install locations are tracked automatically in `~/.local/share/skills/registry`.

## Skills

| Skill | Description | Source |
|---|---|---|
| [prepare-pr](skills/prepare-pr/SKILL.md) | Prepare a pull request from a local branch — inspect changes, write a conventional commit, push, and open a PR via the GitHub CLI. | Original |
| [revise-pr](skills/revise-pr/SKILL.md) | Revise an existing PR to ensure the title, description, type of change, and checklist accurately reflect the latest commits. | Original |
| [plan-vulnerability-remediation](skills/plan-vulnerability-remediation/SKILL.md) | Triage CVEs, Dependabot alerts, and audit findings, then group them into safe, idempotent remediation PR plans before touching any code. | Original |
| [remediate-vulnerability](skills/remediate-vulnerability/SKILL.md) | Execute a vulnerability remediation plan — update dependencies or apply mitigations, verify the fix, commit, push, and open or update a PR. | Original |
| [svg-animations](skills/svg-animations/SKILL.md) | Create performant SVG animations and illustrations: path animations, shape morphing, loading spinners, animated logos, gradients, masks, and filters. | [supermemoryai/skills](https://github.com/supermemoryai/skills/blob/main/svg-animations/SKILL.md) |

## Roadmap

- **Smarter sync:** The current `--sync` uses file mtime to determine the authoritative version. This is fragile — editing a stale installed copy bumps its mtime and can cause it to overwrite a more complete repo version. A better approach would use content-aware diff resolution (similar to a three-way merge), treating the git-tracked repo version as the base and merging divergent edits from installed copies rather than blindly picking the newest file.
