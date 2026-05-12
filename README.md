# Skills

Collected agent skills for Claude Code.

## Installation

```bash
git clone https://github.com/paulnewsam/skills.git
cd skills/cli
go build -o skills-cli ./cmd/skills
```

## Usage

```bash
# Interactive — choose harnesses and skills via TUI
./skills-cli

# Install all skills to all harnesses
./skills-cli install -a -y

# Install to a specific harness
./skills-cli install -t claude -y

# Project install (copies into <cwd>/.claude/skills)
./skills-cli install -p -y

# Check what's installed
./skills-cli status
```

Run `./skills-cli setup` to register `skills` as a global command in `~/.local/bin`. See [cli/README.md](cli/README.md) for full CLI documentation.

## Skills

### Pull requests

| Skill | Description |
|---|---|
| [prepare-pr](registry/prepare-pr/SKILL.md) | Prepare a pull request from a local branch — inspect changes, write a conventional commit, push, and open a PR. |
| [revise-pr](registry/revise-pr/SKILL.md) | Revise an existing PR to ensure the title, description, and checklist accurately reflect the latest commits. |
| [review-pr](registry/review-pr/SKILL.md) | Review a pull request and post inline code review comments with an overall verdict (approve, request changes, or comment). |
| [assess-pr-risk](registry/assess-pr-risk/SKILL.md) | Assess the risk level of a pull request across blast radius, security sensitivity, test coverage, and dependencies. |

### Security

| Skill | Description |
|---|---|
| [plan-vulnerability-remediation](registry/plan-vulnerability-remediation/SKILL.md) | Triage CVEs, Dependabot alerts, and audit findings, then group them into safe remediation PR plans. |
| [remediate-vulnerability](registry/remediate-vulnerability/SKILL.md) | Execute a vulnerability remediation plan — update dependencies, verify the fix, commit, push, and open a PR. |
| [plan-code-scanning-remediation](registry/plan-code-scanning-remediation/SKILL.md) | Triage CodeQL and SAST alerts, then group them into remediation PR plans. |
| [remediate-code-scanning](registry/remediate-code-scanning/SKILL.md) | Apply source code fixes for CodeQL/SAST alerts, verify the fix, and create or update a pull request. |

### Testing

| Skill | Description |
|---|---|
| [plan-browser-tests](registry/plan-browser-tests/SKILL.md) | Analyze an application to identify critical user flows and produce a prioritized browser test plan. |
| [add-browser-test](registry/add-browser-test/SKILL.md) | Implement one browser integration test from the plan — picks the next unchecked flow, writes the test, and verifies it passes. |
| [audit-browser-tests](registry/audit-browser-tests/SKILL.md) | Audit an existing browser test suite to identify stale tests, missing coverage, flaky patterns, and quality issues. |
| [fix-browser-test](registry/fix-browser-test/SKILL.md) | Repair a broken or flaky browser test — diagnoses the root cause, applies a targeted fix, and re-runs to confirm. |

### Design

| Skill | Description |
|---|---|
| [svg-animations](registry/svg-animations/SKILL.md) | Create performant SVG animations and illustrations: path animations, shape morphing, loading spinners, animated logos, gradients, masks, and filters. |
