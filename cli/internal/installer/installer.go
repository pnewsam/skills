package installer

import (
	"fmt"
	"io"
	"io/fs"
	"os"
	"path/filepath"
	"strings"
)

type Mode int

const (
	ModeLink Mode = iota
	ModeCopy
)

type Result struct {
	Skill  string
	Action string // "Linking", "Updating", "Replacing", "Installing", etc.
}

// Install installs a single skill into the destination directory.
func Install(skillPath, destDir string, mode Mode) (Result, error) {
	skillName := filepath.Base(skillPath)
	dst := filepath.Join(destDir, skillName)

	if err := os.MkdirAll(destDir, 0o755); err != nil {
		return Result{}, fmt.Errorf("creating destination: %w", err)
	}

	info, err := os.Lstat(dst)
	existsAsLink := err == nil && info.Mode()&os.ModeSymlink != 0
	existsAsDir := err == nil && info.IsDir()

	r := Result{Skill: skillName}

	if mode == ModeLink {
		switch {
		case existsAsLink:
			os.Remove(dst)
			r.Action = "Updating"
		case existsAsDir:
			os.RemoveAll(dst)
			r.Action = "Replacing"
		default:
			r.Action = "Linking"
		}
		if err := os.Symlink(skillPath, dst); err != nil {
			return r, fmt.Errorf("creating symlink: %w", err)
		}
	} else {
		switch {
		case existsAsLink:
			os.Remove(dst)
			r.Action = "Replacing"
		case existsAsDir:
			r.Action = "Updating"
		default:
			r.Action = "Installing"
		}
		if err := copyDir(skillPath, dst); err != nil {
			return r, fmt.Errorf("copying skill: %w", err)
		}
	}

	return r, nil
}

// Unlink removes all symlinks from the given directory.
func Unlink(dir string) (int, error) {
	entries, err := os.ReadDir(dir)
	if err != nil {
		if os.IsNotExist(err) {
			return 0, nil
		}
		return 0, err
	}

	removed := 0
	for _, e := range entries {
		fullPath := filepath.Join(dir, e.Name())
		info, err := os.Lstat(fullPath)
		if err != nil {
			continue
		}
		if info.Mode()&os.ModeSymlink != 0 {
			if err := os.Remove(fullPath); err != nil {
				return removed, fmt.Errorf("removing %s: %w", fullPath, err)
			}
			fmt.Printf("  Removing %s\n", fullPath)
			removed++
		}
	}
	return removed, nil
}

func copyDir(src, dst string) error {
	return filepath.WalkDir(src, func(path string, d fs.DirEntry, err error) error {
		if err != nil {
			return err
		}

		// Skip .DS_Store
		if d.Name() == ".DS_Store" {
			return nil
		}

		rel, _ := filepath.Rel(src, path)
		target := filepath.Join(dst, rel)

		if d.IsDir() {
			return os.MkdirAll(target, 0o755)
		}

		return copyFile(path, target)
	})
}

func copyFile(src, dst string) error {
	in, err := os.Open(src)
	if err != nil {
		return err
	}
	defer in.Close()

	info, err := in.Stat()
	if err != nil {
		return err
	}

	out, err := os.OpenFile(dst, os.O_CREATE|os.O_WRONLY|os.O_TRUNC, info.Mode())
	if err != nil {
		return err
	}
	defer out.Close()

	_, err = io.Copy(out, in)
	return err
}

// ModeString returns a human-readable string for the install mode.
func ModeString(m Mode) string {
	if m == ModeLink {
		return "symlink"
	}
	return "copy"
}

// ParseMode parses a mode string.
func ParseMode(s string) Mode {
	if strings.EqualFold(s, "copy") {
		return ModeCopy
	}
	return ModeLink
}
