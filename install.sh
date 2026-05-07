#!/usr/bin/env bash
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
SKILLS_SRC="$SCRIPT_DIR/skills"
INVOKED_FROM="$PWD"
TARGET_DIR=""
AUTO_YES=0

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

usage() {
  echo "Usage: $(basename "$0") [-g | -p | -d <dir>] [-y] [-h]"
  echo "       $(basename "$0") --setup"
  echo ""
  echo "  -g           Install to ~/.claude/skills (global)"
  echo "  -p           Install to <cwd>/.claude/skills (project)"
  echo "  -d <dir>     Install to a custom directory"
  echo "  -y           Skip prompts; install all skills to global"
  echo "  -h           Show this help"
  echo "  --setup      Install this script as 'skills' in ~/.local/bin"
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

echo ""
echo "Done."
