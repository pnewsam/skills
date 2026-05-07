# Skills

Collected agent skills for Claude Code.

## Installation

Clone this repo, then run the install script from the repo root:

```bash
# Interactive — toggle skills on/off, then press Enter to install
./install.sh

# Install everything without prompting
./install.sh -y

# Install to a custom directory (e.g. a project-local .claude/skills)
./install.sh -d /path/to/project/.claude/skills
./install.sh -d /path/to/project/.claude/skills -y
```

Skills are copied to `~/.claude/skills/` by default. The script is safe to re-run — it updates existing skills in place.

## Skills

| Skill | Description | Source |
|---|---|---|
| [prepare-pr](skills/prepare-pr/SKILL.md) | Prepare a pull request from a local branch — inspect changes, write a conventional commit, push, and open a PR via the GitHub CLI. | Original |
| [revise-pr](skills/revise-pr/SKILL.md) | Revise an existing PR to ensure the title, description, type of change, and checklist accurately reflect the latest commits. | Original |
| [plan-vulnerability-remediation](skills/plan-vulnerability-remediation/SKILL.md) | Triage CVEs, Dependabot alerts, and audit findings, then group them into safe, idempotent remediation PR plans before touching any code. | Original |
| [remediate-vulnerability](skills/remediate-vulnerability/SKILL.md) | Execute a vulnerability remediation plan — update dependencies or apply mitigations, verify the fix, commit, push, and open or update a PR. | Original |
| [svg-animations](skills/svg-animations/SKILL.md) | Create performant SVG animations and illustrations: path animations, shape morphing, loading spinners, animated logos, gradients, masks, and filters. | [supermemoryai/skills](https://github.com/supermemoryai/skills/blob/main/svg-animations/SKILL.md) |
