#!/usr/bin/env bash
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
SKILLS_SRC="$SCRIPT_DIR/skills"
INVOKED_FROM="$PWD"
TARGET_DIR=""
AUTO_YES=0

REGISTRY_FILE="${HOME}/.local/share/skills/registry"

# --- --setup: install this script as 'skills' in ~/.local/bin ---
if [[ "${1:-}" == "--setup" ]]; then
  INSTALL_BIN="${HOME}/.local/bin"
  mkdir -p "$INSTALL_BIN"
  ln -sf "$SCRIPT_DIR/install.sh" "$INSTALL_BIN/skills"
  chmod +x "$SCRIPT_DIR/install.sh"
  echo "Linked: $INSTALL_BIN/skills -> $SCRIPT_DIR/install.sh"
  echo ""
  if ! echo "$PATH" | tr ':' '\n' | grep -qx "$INSTALL_BIN"; then
    echo "Note: $INSTALL_BIN is not in your PATH."
    echo "Add this to your shell config (~/.zshrc or ~/.bashrc):"
    echo "  export PATH=\"\$HOME/.local/bin:\$PATH\""
  else
    echo "Run 'skills' from any directory to install skills."
  fi
  exit 0
fi

# --- --sync: propagate newest version of each skill across all known locations ---
if [[ "${1:-}" == "--sync" ]]; then
  shift

  # Collect available skills from repo
  ALL_SKILLS=()
  for d in "$SKILLS_SRC"/*/; do
    [[ -f "$d/SKILL.md" ]] && ALL_SKILLS+=("$(basename "$d")")
  done
  IFS=$'\n' ALL_SKILLS=($(printf '%s\n' "${ALL_SKILLS[@]}" | sort)); unset IFS

  # Build list of all known skill locations (repo always first)
  LOCATIONS=("$SKILLS_SRC")

  # Always include global if it exists
  [[ -d "${HOME}/.claude/skills" ]] && LOCATIONS+=("${HOME}/.claude/skills")

  # Add registry entries
  if [[ -f "$REGISTRY_FILE" ]]; then
    while IFS= read -r loc; do
      [[ -n "$loc" && -d "$loc" ]] && LOCATIONS+=("$loc")
    done < "$REGISTRY_FILE"
  fi

  # Deduplicate while preserving order (bash 3 compatible)
  UNIQUE_LOCS=()
  for loc in "${LOCATIONS[@]}"; do
    loc="$(cd "$loc" 2>/dev/null && pwd || echo "$loc")"
    already=0
    for seen in "${UNIQUE_LOCS[@]+"${UNIQUE_LOCS[@]}"}"; do
      [[ "$seen" == "$loc" ]] && { already=1; break; }
    done
    [[ $already -eq 0 ]] && UNIQUE_LOCS+=("$loc")
  done

  # Determine which skills to sync
  if [[ $# -gt 0 ]]; then
    SYNC_SKILLS=("$@")
  else
    SYNC_SKILLS=("${ALL_SKILLS[@]}")
  fi

  echo ""
  echo "Syncing ${#SYNC_SKILLS[@]} skill(s) across ${#UNIQUE_LOCS[@]} location(s):"
  for loc in "${UNIQUE_LOCS[@]}"; do echo "  $loc"; done
  echo ""

  _mtime() {
    stat -f %m "$1" 2>/dev/null || stat -c %Y "$1" 2>/dev/null || echo 0
  }

  for skill in "${SYNC_SKILLS[@]}"; do
    newest_time=0
    newest_src=""
    for loc in "${UNIQUE_LOCS[@]}"; do
      skill_file="$loc/$skill/SKILL.md"
      if [[ -f "$skill_file" ]]; then
        mtime=$(_mtime "$skill_file")
        if [[ "$mtime" -gt "$newest_time" ]]; then
          newest_time=$mtime
          newest_src="$loc/$skill"
        fi
      fi
    done

    if [[ -z "$newest_src" ]]; then
      echo "  $skill: not found in any location — skipping"
      continue
    fi

    src_real="$(cd "$newest_src" && pwd)"
    updated=0
    for loc in "${UNIQUE_LOCS[@]}"; do
      dst="$loc/$skill"
      [[ ! -d "$dst" ]] && continue
      dst_real="$(cd "$dst" && pwd)"
      [[ "$dst_real" == "$src_real" ]] && continue
      rsync -a --exclude='.DS_Store' "$newest_src/" "$dst/"
      echo "  $skill  →  $dst"
      updated=$((updated + 1))
    done

    [[ $updated -eq 0 ]] && echo "  $skill: up to date everywhere"
  done

  echo ""
  echo "Done."
  exit 0
fi

usage() {
  echo "Usage: $(basename "$0") [-g | -p | -d <dir>] [-y] [-h]"
  echo "       $(basename "$0") --setup"
  echo "       $(basename "$0") --sync [skill...]"
  echo ""
  echo "  -g           Install to ~/.claude/skills (global)"
  echo "  -p           Install to <cwd>/.claude/skills (project)"
  echo "  -d <dir>     Install to a custom directory"
  echo "  -y           Skip prompts; install all skills to global"
  echo "  -h           Show this help"
  echo "  --setup      Install this script as 'skills' in ~/.local/bin"
  echo "  --sync       Propagate the newest version of each skill across all"
  echo "               known install locations. Optionally name specific skills."
  exit 1
}

while getopts ":gpd:yh" opt; do
  case $opt in
    g) TARGET_DIR="${HOME}/.claude/skills" ;;
    p) TARGET_DIR="${INVOKED_FROM}/.claude/skills" ;;
    d) TARGET_DIR="$OPTARG" ;;
    y) AUTO_YES=1 ;;
    h) usage ;;
    *) usage ;;
  esac
done

# Collect available skills
ALL_SKILLS=()
for d in "$SKILLS_SRC"/*/; do
  [[ -f "$d/SKILL.md" ]] && ALL_SKILLS+=("$(basename "$d")")
done

IFS=$'\n' ALL_SKILLS=($(printf '%s\n' "${ALL_SKILLS[@]}" | sort)); unset IFS

if [[ ${#ALL_SKILLS[@]} -eq 0 ]]; then
  echo "No skills found in $SKILLS_SRC"
  exit 1
fi

GLOBAL_DIR="${HOME}/.claude/skills"
PROJECT_DIR="${INVOKED_FROM}/.claude/skills"

if [[ "$AUTO_YES" -eq 1 ]]; then
  [[ -z "$TARGET_DIR" ]] && TARGET_DIR="$GLOBAL_DIR"
  INSTALL=("${ALL_SKILLS[@]}")
else
  # Interactive UI via Python3
  if ! command -v python3 &>/dev/null; then
    echo "Error: python3 is required for interactive mode. Use -y to skip prompts."
    exit 1
  fi

  _ui_output=$(python3 - "$TARGET_DIR" "$GLOBAL_DIR" "$PROJECT_DIR" "${ALL_SKILLS[@]}" <<'PYEOF'
import sys, os, tty, termios

def read_key(fd):
    ch = os.read(fd, 1)
    if ch == b'\x1b':
        try:
            ch2 = os.read(fd, 1)
            if ch2 == b'[':
                ch3 = os.read(fd, 1)
                if ch3 == b'A': return 'up'
                if ch3 == b'B': return 'down'
        except OSError:
            pass
        return 'esc'
    if ch in (b'\r', b'\n'): return 'enter'
    if ch == b' ': return 'space'
    if ch in (b'\x03', b'\x04'): return 'quit'
    return 'other'

def draw(fd_out, items, cursor, selected, multi):
    lines = []
    for i, item in enumerate(items):
        mark = ('[x]' if selected[i] else '[ ]') if multi else '   '
        if i == cursor:
            lines.append(f'\r\033[2K  \033[7m{mark} {item}\033[0m')
        else:
            lines.append(f'\r\033[2K  {mark} {item}')
    lines.append('\r\033[2K')
    if multi:
        lines.append('\r\033[2K  \033[2m↑/↓\033[0m move  \033[2mSpace\033[0m toggle  \033[2mEnter\033[0m confirm')
    else:
        lines.append('\r\033[2K  \033[2m↑/↓\033[0m move  \033[2mEnter\033[0m select')
    os.write(fd_out, ('\n'.join(lines) + '\n').encode())
    return len(lines)

def select_one(fd_in, fd_out, title, items):
    os.write(fd_out, f'{title}\n\n'.encode())
    cursor, n = 0, len(items)
    num_lines = draw(fd_out, items, cursor, [False] * n, False)
    while True:
        key = read_key(fd_in)
        if   key == 'up':    cursor = (cursor - 1) % n
        elif key == 'down':  cursor = (cursor + 1) % n
        elif key == 'enter': break
        elif key == 'quit':  raise SystemExit(1)
        os.write(fd_out, f'\033[{num_lines}A\r'.encode())
        num_lines = draw(fd_out, items, cursor, [False] * n, False)
    os.write(fd_out, b'\n')
    return cursor

def select_multi(fd_in, fd_out, title, items):
    os.write(fd_out, f'{title}\n\n'.encode())
    cursor, n = 0, len(items)
    selected = [True] * n
    num_lines = draw(fd_out, items, cursor, selected, True)
    while True:
        key = read_key(fd_in)
        if   key == 'up':    cursor = (cursor - 1) % n
        elif key == 'down':  cursor = (cursor + 1) % n
        elif key == 'space': selected[cursor] = not selected[cursor]
        elif key == 'enter': break
        elif key == 'quit':  raise SystemExit(1)
        os.write(fd_out, f'\033[{num_lines}A\r'.encode())
        num_lines = draw(fd_out, items, cursor, selected, True)
    os.write(fd_out, b'\n')
    return selected

def read_line(fd_in, fd_out, prompt):
    os.write(fd_out, prompt.encode())
    buf = b''
    while True:
        ch = os.read(fd_in, 1)
        if ch in (b'\r', b'\n'):
            os.write(fd_out, b'\n')
            break
        elif ch in (b'\x7f', b'\x08'):
            if buf:
                buf = buf[:-1]
                os.write(fd_out, b'\x08 \x08')
        elif ch >= b' ':
            buf += ch
            os.write(fd_out, ch)
    return buf.decode('utf-8', errors='replace')

def main():
    args       = sys.argv[1:]
    preset_dir = args[0]
    global_dir = args[1]
    project_dir = args[2]
    skills     = args[3:]

    fd_in  = os.open('/dev/tty', os.O_RDONLY)
    fd_out = os.open('/dev/tty', os.O_WRONLY)
    old    = termios.tcgetattr(fd_in)
    try:
        tty.setraw(fd_in)

        # Destination selection (skip if already set via flags)
        if preset_dir:
            target_dir = preset_dir
        else:
            dest_items = [
                f'Global   — {global_dir}',
                f'Project  — {project_dir}',
                'Custom   — enter a path',
            ]
            idx = select_one(fd_in, fd_out, 'Where do you want to install skills?', dest_items)
            if idx == 0:
                target_dir = global_dir
            elif idx == 1:
                target_dir = project_dir
            else:
                termios.tcsetattr(fd_in, termios.TCSADRAIN, old)
                target_dir = os.path.expanduser(read_line(fd_in, fd_out, 'Path: '))
                if not target_dir.rstrip('/').endswith('.claude/skills'):
                    target_dir = os.path.join(target_dir.rstrip('/'), '.claude/skills')
                tty.setraw(fd_in)

        # Skills selection
        tty.setraw(fd_in)
        chosen = select_multi(fd_in, fd_out, 'Select skills to install:', skills)
    finally:
        termios.tcsetattr(fd_in, termios.TCSADRAIN, old)
        os.close(fd_in)
        os.close(fd_out)

    # Results go to stdout (captured by bash)
    print(target_dir)
    for i, skill in enumerate(skills):
        if chosen[i]:
            print(skill)

main()
PYEOF
  ) || { echo "Aborted."; exit 1; }

  TARGET_DIR=$(printf '%s\n' "$_ui_output" | head -1)
  INSTALL=()
  while IFS= read -r line; do
    [[ -n "$line" ]] && INSTALL+=("$line")
  done < <(printf '%s\n' "$_ui_output" | tail -n +2)
fi

if [[ ${#INSTALL[@]} -eq 0 ]]; then
  echo "No skills selected. Nothing installed."
  exit 0
fi

mkdir -p "$TARGET_DIR"
echo ""
echo "Installing ${#INSTALL[@]} skill(s) to $TARGET_DIR ..."
echo ""

for skill in "${INSTALL[@]}"; do
  src="$SKILLS_SRC/$skill"
  dst="$TARGET_DIR/$skill"
  if [[ -d "$dst" ]]; then
    echo "  Updating   $skill"
  else
    echo "  Installing $skill"
  fi
  rsync -a --exclude='.DS_Store' "$src/" "$dst/"
done

# Record TARGET_DIR in the registry for future syncs
mkdir -p "$(dirname "$REGISTRY_FILE")"
touch "$REGISTRY_FILE"
if ! grep -qxF "$TARGET_DIR" "$REGISTRY_FILE" 2>/dev/null; then
  echo "$TARGET_DIR" >> "$REGISTRY_FILE"
fi

echo ""
echo "Done."
