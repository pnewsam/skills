#!/usr/bin/env bash
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
SKILLS_SRC="$SCRIPT_DIR/skills"
INVOKED_FROM="$PWD"

# ── Harness definitions ──────────────────────────────────────────
# Each entry: name|global_skills_directory
# Add new coding harnesses here. The script will symlink skills
# from your repo into each harness's expected location.
HARNESS_DEFS=(
  "claude|${HOME}/.claude/skills"
  "codex|${HOME}/.agents/skills"
)

_harness_name() { echo "${1%%|*}"; }
_harness_dir()  { echo "${1#*|}"; }

# ── --setup: install this script as 'skills' in ~/.local/bin ─────
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

# ── --status: show what's installed where ────────────────────────
if [[ "${1:-}" == "--status" ]]; then
  echo ""
  for hdef in "${HARNESS_DEFS[@]}"; do
    name="$(_harness_name "$hdef")"
    dir="$(_harness_dir "$hdef")"
    echo "  $name ($dir):"
    if [[ ! -d "$dir" ]]; then
      echo "    (not installed)"
    else
      found=0
      for entry in "$dir"/*/; do
        [[ ! -d "$entry" ]] && continue
        skill="$(basename "$entry")"
        if [[ -L "$entry" || -L "${entry%/}" ]]; then
          target="$(readlink "${entry%/}" 2>/dev/null || readlink "$entry" 2>/dev/null || echo "?")"
          echo "    $skill -> $target (symlink)"
        elif [[ -f "$entry/SKILL.md" ]]; then
          echo "    $skill (copy)"
        fi
        found=1
      done
      [[ $found -eq 0 ]] && echo "    (empty)"
    fi
    echo ""
  done
  exit 0
fi

# ── --unlink: remove symlinks for a harness ──────────────────────
if [[ "${1:-}" == "--unlink" ]]; then
  shift
  target_harness="${1:-}"
  if [[ -z "$target_harness" ]]; then
    echo "Usage: $(basename "$0") --unlink <harness>"
    echo "Harnesses: $(printf '%s ' "${HARNESS_DEFS[@]}" | sed 's/|[^ ]*//g')"
    exit 1
  fi
  for hdef in "${HARNESS_DEFS[@]}"; do
    if [[ "$(_harness_name "$hdef")" == "$target_harness" ]]; then
      dir="$(_harness_dir "$hdef")"
      removed=0
      for entry in "$dir"/*/; do
        link="${entry%/}"
        if [[ -L "$link" ]]; then
          echo "  Removing $link"
          rm "$link"
          removed=$((removed + 1))
        fi
      done
      echo "Removed $removed symlink(s) from $dir."
      exit 0
    fi
  done
  echo "Unknown harness: $target_harness"
  exit 1
fi

usage() {
  echo "Usage: $(basename "$0") [options]"
  echo "       $(basename "$0") --setup"
  echo "       $(basename "$0") --status"
  echo "       $(basename "$0") --unlink <harness>"
  echo ""
  echo "Install skills via symlinks into coding harness directories."
  echo ""
  echo "Options:"
  echo "  -t <harness>   Target a specific harness (repeatable)"
  echo "  -a             Target all known harnesses"
  echo "  -p             Project install to <cwd>/.claude/skills (copies, not symlinks)"
  echo "  -d <dir>       Install to a custom directory (copies, not symlinks)"
  echo "  --copy         Force copy mode instead of symlinks"
  echo "  -y             Skip prompts; install all skills"
  echo "  -h             Show this help"
  echo ""
  echo "Commands:"
  echo "  --setup        Install this script as 'skills' in ~/.local/bin"
  echo "  --status       Show what's installed in each harness"
  echo "  --unlink <h>   Remove all symlinked skills from a harness"
  echo ""
  echo "Harnesses:"
  for hdef in "${HARNESS_DEFS[@]}"; do
    printf "  %-12s %s\n" "$(_harness_name "$hdef")" "$(_harness_dir "$hdef")"
  done
  exit 1
}

# ── Parse flags ──────────────────────────────────────────────────
MODE="link"
TARGET_HARNESSES=()
AUTO_YES=0
PROJECT_MODE=0
CUSTOM_DIR=""

# Handle long flags before getopts
ARGS=()
for arg in "$@"; do
  if [[ "$arg" == "--copy" ]]; then
    MODE="copy"
  else
    ARGS+=("$arg")
  fi
done
set -- "${ARGS[@]+"${ARGS[@]}"}"

while getopts ":at:pd:yh" opt; do
  case $opt in
    a) for hdef in "${HARNESS_DEFS[@]}"; do TARGET_HARNESSES+=("$hdef"); done ;;
    t) found=0
       for hdef in "${HARNESS_DEFS[@]}"; do
         if [[ "$(_harness_name "$hdef")" == "$OPTARG" ]]; then
           TARGET_HARNESSES+=("$hdef")
           found=1
         fi
       done
       if [[ $found -eq 0 ]]; then
         echo "Unknown harness: $OPTARG"
         echo "Known harnesses: $(for h in "${HARNESS_DEFS[@]}"; do _harness_name "$h"; done | tr '\n' ' ')"
         exit 1
       fi ;;
    p) PROJECT_MODE=1; MODE="copy" ;;
    d) CUSTOM_DIR="$OPTARG"; MODE="copy" ;;
    y) AUTO_YES=1 ;;
    h) usage ;;
    *) usage ;;
  esac
done

# ── Collect available skills ─────────────────────────────────────
ALL_SKILLS=()
for d in "$SKILLS_SRC"/*/; do
  [[ -f "$d/SKILL.md" ]] && ALL_SKILLS+=("$(basename "$d")")
done
IFS=$'\n' ALL_SKILLS=($(printf '%s\n' "${ALL_SKILLS[@]}" | sort)); unset IFS

if [[ ${#ALL_SKILLS[@]} -eq 0 ]]; then
  echo "No skills found in $SKILLS_SRC"
  exit 1
fi

# ── Non-interactive mode ─────────────────────────────────────────
if [[ "$AUTO_YES" -eq 1 ]]; then
  INSTALL=("${ALL_SKILLS[@]}")

  if [[ "$PROJECT_MODE" -eq 1 ]]; then
    TARGETS=("copy|${INVOKED_FROM}/.claude/skills")
  elif [[ -n "$CUSTOM_DIR" ]]; then
    TARGETS=("copy|${CUSTOM_DIR}")
  elif [[ ${#TARGET_HARNESSES[@]} -gt 0 ]]; then
    TARGETS=()
    for hdef in "${TARGET_HARNESSES[@]}"; do
      TARGETS+=("${MODE}|$(_harness_dir "$hdef")")
    done
  else
    # Default: all harnesses
    TARGETS=()
    for hdef in "${HARNESS_DEFS[@]}"; do
      TARGETS+=("${MODE}|$(_harness_dir "$hdef")")
    done
  fi
else
  # ── Interactive mode ─────────────────────────────────────────
  if ! command -v python3 &>/dev/null; then
    echo "Error: python3 is required for interactive mode. Use -y to skip prompts."
    exit 1
  fi

  # Build harness list for the UI
  HARNESS_LABELS=()
  HARNESS_DIRS=()
  for hdef in "${HARNESS_DEFS[@]}"; do
    HARNESS_LABELS+=("$(_harness_name "$hdef")  —  $(_harness_dir "$hdef")")
    HARNESS_DIRS+=("$(_harness_dir "$hdef")")
  done

  # If project or custom dir specified, skip harness selection
  if [[ "$PROJECT_MODE" -eq 1 ]]; then
    TARGETS=("copy|${INVOKED_FROM}/.claude/skills")
    # Just select skills
    _ui_output=$(python3 - "skills_only" "${ALL_SKILLS[@]}" <<'PYEOF'
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

def draw(fd_out, items, cursor, selected):
    lines = []
    for i, item in enumerate(items):
        mark = '[x]' if selected[i] else '[ ]'
        if i == cursor:
            lines.append(f'\r\033[2K  \033[7m{mark} {item}\033[0m')
        else:
            lines.append(f'\r\033[2K  {mark} {item}')
    lines.append('\r\033[2K')
    lines.append('\r\033[2K  \033[2m↑/↓\033[0m move  \033[2mSpace\033[0m toggle  \033[2mEnter\033[0m confirm')
    os.write(fd_out, ('\n'.join(lines) + '\n').encode())
    return len(lines)

def select_multi(fd_in, fd_out, title, items):
    os.write(fd_out, f'{title}\n\n'.encode())
    cursor, n = 0, len(items)
    selected = [True] * n
    num_lines = draw(fd_out, items, cursor, selected)
    while True:
        key = read_key(fd_in)
        if   key == 'up':    cursor = (cursor - 1) % n
        elif key == 'down':  cursor = (cursor + 1) % n
        elif key == 'space': selected[cursor] = not selected[cursor]
        elif key == 'enter': break
        elif key == 'quit':  raise SystemExit(1)
        os.write(fd_out, f'\033[{num_lines}A\r'.encode())
        num_lines = draw(fd_out, items, cursor, selected)
    os.write(fd_out, b'\n')
    return selected

def main():
    skills = sys.argv[2:]  # skip "skills_only" marker
    fd_in  = os.open('/dev/tty', os.O_RDONLY)
    fd_out = os.open('/dev/tty', os.O_WRONLY)
    old    = termios.tcgetattr(fd_in)
    try:
        tty.setraw(fd_in)
        chosen = select_multi(fd_in, fd_out, 'Select skills to install:', skills)
    finally:
        termios.tcsetattr(fd_in, termios.TCSADRAIN, old)
        os.close(fd_in)
        os.close(fd_out)
    for i, skill in enumerate(skills):
        if chosen[i]:
            print(skill)

main()
PYEOF
    ) || { echo "Aborted."; exit 1; }

    INSTALL=()
    while IFS= read -r line; do
      [[ -n "$line" ]] && INSTALL+=("$line")
    done <<< "$_ui_output"

  elif [[ -n "$CUSTOM_DIR" ]]; then
    TARGETS=("copy|${CUSTOM_DIR}")
    # Same skills-only selection (reuse above pattern)
    _ui_output=$(python3 - "skills_only" "${ALL_SKILLS[@]}" <<'PYEOF'
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

def draw(fd_out, items, cursor, selected):
    lines = []
    for i, item in enumerate(items):
        mark = '[x]' if selected[i] else '[ ]'
        if i == cursor:
            lines.append(f'\r\033[2K  \033[7m{mark} {item}\033[0m')
        else:
            lines.append(f'\r\033[2K  {mark} {item}')
    lines.append('\r\033[2K')
    lines.append('\r\033[2K  \033[2m↑/↓\033[0m move  \033[2mSpace\033[0m toggle  \033[2mEnter\033[0m confirm')
    os.write(fd_out, ('\n'.join(lines) + '\n').encode())
    return len(lines)

def select_multi(fd_in, fd_out, title, items):
    os.write(fd_out, f'{title}\n\n'.encode())
    cursor, n = 0, len(items)
    selected = [True] * n
    num_lines = draw(fd_out, items, cursor, selected)
    while True:
        key = read_key(fd_in)
        if   key == 'up':    cursor = (cursor - 1) % n
        elif key == 'down':  cursor = (cursor + 1) % n
        elif key == 'space': selected[cursor] = not selected[cursor]
        elif key == 'enter': break
        elif key == 'quit':  raise SystemExit(1)
        os.write(fd_out, f'\033[{num_lines}A\r'.encode())
        num_lines = draw(fd_out, items, cursor, selected)
    os.write(fd_out, b'\n')
    return selected

def main():
    skills = sys.argv[2:]
    fd_in  = os.open('/dev/tty', os.O_RDONLY)
    fd_out = os.open('/dev/tty', os.O_WRONLY)
    old    = termios.tcgetattr(fd_in)
    try:
        tty.setraw(fd_in)
        chosen = select_multi(fd_in, fd_out, 'Select skills to install:', skills)
    finally:
        termios.tcsetattr(fd_in, termios.TCSADRAIN, old)
        os.close(fd_in)
        os.close(fd_out)
    for i, skill in enumerate(skills):
        if chosen[i]:
            print(skill)

main()
PYEOF
    ) || { echo "Aborted."; exit 1; }

    INSTALL=()
    while IFS= read -r line; do
      [[ -n "$line" ]] && INSTALL+=("$line")
    done <<< "$_ui_output"

  else
    # Full interactive: select harnesses, then skills
    # Pre-select harnesses passed via -t
    PRESELECT_HARNESSES=""
    if [[ ${#TARGET_HARNESSES[@]} -gt 0 ]]; then
      for hdef in "${TARGET_HARNESSES[@]}"; do
        PRESELECT_HARNESSES+="$(_harness_name "$hdef")|"
      done
    fi

    _ui_output=$(python3 - "$MODE" "$PRESELECT_HARNESSES" \
      "---HARNESSES---" "${HARNESS_LABELS[@]}" \
      "---SKILLS---" "${ALL_SKILLS[@]}" <<'PYEOF'
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

def draw(fd_out, items, cursor, selected):
    lines = []
    for i, item in enumerate(items):
        mark = '[x]' if selected[i] else '[ ]'
        if i == cursor:
            lines.append(f'\r\033[2K  \033[7m{mark} {item}\033[0m')
        else:
            lines.append(f'\r\033[2K  {mark} {item}')
    lines.append('\r\033[2K')
    lines.append('\r\033[2K  \033[2m↑/↓\033[0m move  \033[2mSpace\033[0m toggle  \033[2mEnter\033[0m confirm')
    os.write(fd_out, ('\n'.join(lines) + '\n').encode())
    return len(lines)

def select_multi(fd_in, fd_out, title, items, preselected=None):
    os.write(fd_out, f'{title}\n\n'.encode())
    cursor, n = 0, len(items)
    selected = preselected if preselected else [True] * n
    num_lines = draw(fd_out, items, cursor, selected)
    while True:
        key = read_key(fd_in)
        if   key == 'up':    cursor = (cursor - 1) % n
        elif key == 'down':  cursor = (cursor + 1) % n
        elif key == 'space': selected[cursor] = not selected[cursor]
        elif key == 'enter': break
        elif key == 'quit':  raise SystemExit(1)
        os.write(fd_out, f'\033[{num_lines}A\r'.encode())
        num_lines = draw(fd_out, items, cursor, selected)
    os.write(fd_out, b'\n')
    return selected

def main():
    args = sys.argv[1:]
    mode = args[0]
    preselect_str = args[1]  # "claude|codex|" or ""

    # Split harnesses and skills
    rest = args[2:]
    h_sep = rest.index("---HARNESSES---")
    s_sep = rest.index("---SKILLS---")
    harnesses = rest[h_sep + 1:s_sep]
    skills = rest[s_sep + 1:]

    fd_in  = os.open('/dev/tty', os.O_RDONLY)
    fd_out = os.open('/dev/tty', os.O_WRONLY)
    old    = termios.tcgetattr(fd_in)
    try:
        tty.setraw(fd_in)

        # If harnesses were pre-selected via -t, skip harness selection
        if preselect_str:
            harness_sel = [True] * len(harnesses)
        else:
            label = f'Select target harnesses (symlink):'
            if mode == 'copy':
                label = f'Select target harnesses (copy):'
            harness_sel = select_multi(fd_in, fd_out, label, harnesses)

        skill_sel = select_multi(fd_in, fd_out, 'Select skills to install:', skills)
    finally:
        termios.tcsetattr(fd_in, termios.TCSADRAIN, old)
        os.close(fd_in)
        os.close(fd_out)

    # Output: harness indices on first line, then selected skills
    chosen_h = [str(i) for i, s in enumerate(harness_sel) if s]
    print(','.join(chosen_h))
    for i, skill in enumerate(skills):
        if skill_sel[i]:
            print(skill)

main()
PYEOF
    ) || { echo "Aborted."; exit 1; }

    # Parse output: first line = harness indices, rest = skills
    _harness_indices=$(printf '%s\n' "$_ui_output" | head -1)
    INSTALL=()
    while IFS= read -r line; do
      [[ -n "$line" ]] && INSTALL+=("$line")
    done < <(printf '%s\n' "$_ui_output" | tail -n +2)

    TARGETS=()
    IFS=',' read -ra _indices <<< "$_harness_indices"
    for idx in "${_indices[@]}"; do
      [[ -z "$idx" ]] && continue
      TARGETS+=("${MODE}|${HARNESS_DIRS[$idx]}")
    done
  fi
fi

# ── Build TARGETS for non-interactive with specified harnesses ───
if [[ -z "${TARGETS+x}" ]]; then
  if [[ ${#TARGET_HARNESSES[@]} -gt 0 ]]; then
    TARGETS=()
    for hdef in "${TARGET_HARNESSES[@]}"; do
      TARGETS+=("${MODE}|$(_harness_dir "$hdef")")
    done
  else
    TARGETS=()
    for hdef in "${HARNESS_DEFS[@]}"; do
      TARGETS+=("${MODE}|$(_harness_dir "$hdef")")
    done
  fi
fi

if [[ ${#INSTALL[@]} -eq 0 ]]; then
  echo "No skills selected. Nothing installed."
  exit 0
fi

if [[ ${#TARGETS[@]} -eq 0 ]]; then
  echo "No harnesses selected. Nothing installed."
  exit 0
fi

# ── Install ──────────────────────────────────────────────────────
echo ""
for target_entry in "${TARGETS[@]}"; do
  t_mode="${target_entry%%|*}"
  t_dir="${target_entry#*|}"
  mkdir -p "$t_dir"

  if [[ "$t_mode" == "link" ]]; then
    echo "Symlinking ${#INSTALL[@]} skill(s) into $t_dir ..."
  else
    echo "Copying ${#INSTALL[@]} skill(s) into $t_dir ..."
  fi

  for skill in "${INSTALL[@]}"; do
    src="$SKILLS_SRC/$skill"
    dst="$t_dir/$skill"

    if [[ "$t_mode" == "link" ]]; then
      if [[ -L "$dst" ]]; then
        rm "$dst"
        echo "  Updating   $skill (symlink)"
      elif [[ -d "$dst" ]]; then
        rm -rf "$dst"
        echo "  Replacing  $skill (copy -> symlink)"
      else
        echo "  Linking    $skill"
      fi
      ln -s "$src" "$dst"
    else
      if [[ -L "$dst" ]]; then
        rm "$dst"
        echo "  Replacing  $skill (symlink -> copy)"
      elif [[ -d "$dst" ]]; then
        echo "  Updating   $skill"
      else
        echo "  Installing $skill"
      fi
      rsync -a --exclude='.DS_Store' "$src/" "$dst/"
    fi
  done
  echo ""
done

echo "Done."
