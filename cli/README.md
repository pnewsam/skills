# Skills CLI

A Go CLI tool for installing agent skills into coding harness directories.

## Building

```bash
cd cli
go build -o skills-cli ./cmd/skills
```

Or use `make`:

```bash
make build
```

## Commands

### `skills install`

Install skills into harness directories. This is also the default when running `skills` with no subcommand.

```bash
# Interactive — TUI to choose harnesses and skills
skills

# Install all skills to all harnesses (symlinks)
skills install -a -y

# Install to a specific harness
skills install -t claude -y
skills install -t codex -y

# Project install (copies into <cwd>/.claude/skills)
skills install -p -y

# Custom directory (copies)
skills install -d /path/to/skills -y

# Force copy mode instead of symlinks
skills install -a -y --copy
```

By default, the CLI creates **symlinks** from each harness's skills directory back to this repo. Edits to skills in the repo are instantly available everywhere — no sync step needed.

Project installs (`-p`) and custom directory installs (`-d`) use copies, since the repo may not be available on other machines.

### `skills status`

Show what's installed in each harness directory.

```bash
skills status
```

### `skills unlink <harness>`

Remove all symlinked skills from a harness.

```bash
skills unlink codex
```

### `skills setup`

Symlink the binary to `~/.local/bin/skills` so it can be run from anywhere.

```bash
./skills-cli setup
```

## Supported harnesses

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

## Skills source detection

The CLI finds the `registry/` directory automatically using this priority:

1. `--source <dir>` flag
2. Sibling of the binary's resolved path (e.g. `../registry` relative to `cli/`)
3. `./registry/` in the current working directory
4. `source_dir` in the config file

## Project structure

```
cmd/skills/main.go       # cobra root + subcommands
internal/
  skill/skill.go          # skill discovery, YAML frontmatter parsing
  harness/harness.go      # harness definitions, config loading
  installer/installer.go  # symlink/copy logic
  tui/tui.go              # bubbletea multi-select widget
Makefile
.goreleaser.yaml          # cross-platform release config
```

## Releasing

Cross-platform builds (darwin/linux, amd64/arm64) are configured via [GoReleaser](https://goreleaser.com/):

```bash
goreleaser release --snapshot --clean
```
