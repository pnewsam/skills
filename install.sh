#!/usr/bin/env bash
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
SKILLS_SRC="$SCRIPT_DIR/skills"
TARGET_DIR="${HOME}/.claude/skills"
AUTO_YES=0

usage() {
  echo "Usage: $0 [-d <target-dir>] [-y]"
  echo ""
  echo "  -d <dir>   Install skills to <dir> instead of ~/.claude/skills"
  echo "  -y         Skip interactive selection and install all skills"
  exit 1
}

while getopts ":d:yh" opt; do
  case $opt in
    d) TARGET_DIR="$OPTARG" ;;
    y) AUTO_YES=1 ;;
    h) usage ;;
    *) usage ;;
  esac
done

# Collect available skills (bash 3 compatible)
ALL_SKILLS=()
for d in "$SKILLS_SRC"/*/; do
  [[ -f "$d/SKILL.md" ]] && ALL_SKILLS+=("$(basename "$d")")
done

# Sort (bash 3 compatible via external sort)
IFS=$'\n' ALL_SKILLS=($(printf '%s\n' "${ALL_SKILLS[@]}" | sort)); unset IFS

if [[ ${#ALL_SKILLS[@]} -eq 0 ]]; then
  echo "No skills found in $SKILLS_SRC"
  exit 1
fi

# Initialize selection array (1 = selected, 0 = deselected)
SELECTED=()
for _ in "${ALL_SKILLS[@]}"; do
  SELECTED+=(1)
done

if [[ "$AUTO_YES" -eq 0 ]]; then
  echo "Select skills to install (all selected by default)."
  echo "Enter a number to toggle selection, then press Enter with no input to confirm."
  echo ""

  while true; do
    for i in "${!ALL_SKILLS[@]}"; do
      if [[ "${SELECTED[$i]}" -eq 1 ]]; then
        marker="[x]"
      else
        marker="[ ]"
      fi
      printf "  %2d) %s %s\n" "$((i + 1))" "$marker" "${ALL_SKILLS[$i]}"
    done
    echo ""
    read -rp "Toggle (number), or press Enter to install: " input

    [[ -z "$input" ]] && break

    if ! [[ "$input" =~ ^[0-9]+$ ]] || [[ "$input" -lt 1 ]] || [[ "$input" -gt ${#ALL_SKILLS[@]} ]]; then
      echo "Invalid: enter a number between 1 and ${#ALL_SKILLS[@]}"
      echo ""
      continue
    fi

    idx=$((input - 1))
    if [[ "${SELECTED[$idx]}" -eq 1 ]]; then
      SELECTED[$idx]=0
    else
      SELECTED[$idx]=1
    fi
    echo ""
  done
fi

# Collect final install list
INSTALL=()
for i in "${!ALL_SKILLS[@]}"; do
  [[ "${SELECTED[$i]}" -eq 1 ]] && INSTALL+=("${ALL_SKILLS[$i]}")
done

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
    echo "  Updating  $skill"
  else
    echo "  Installing $skill"
  fi

  rsync -a --exclude='.DS_Store' "$src/" "$dst/"
done

echo ""
echo "Done."
