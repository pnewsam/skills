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

type Options struct {
	// Force permits replacing an existing destination that is not already a
	// symlink to the requested source.
	Force bool
}

// Install installs a single skill into the destination directory.
func Install(skillPath, destDir string, mode Mode, opts Options) (Result, error) {
	skillName := filepath.Base(skillPath)
	dst := filepath.Join(destDir, skillName)

	if err := os.MkdirAll(destDir, 0o755); err != nil {
		return Result{}, fmt.Errorf("creating destination: %w", err)
	}

	r := Result{Skill: skillName}
	info, err := os.Lstat(dst)
	exists := err == nil
	if err != nil && !os.IsNotExist(err) {
		return r, fmt.Errorf("inspecting destination: %w", err)
	}
	existsAsLink := exists && info.Mode()&os.ModeSymlink != 0

	if mode == ModeLink {
		if existsAsLink && sameLinkTarget(dst, skillPath) {
			r.Action = "Current"
			return r, nil
		}
		if exists && !opts.Force {
			return r, fmt.Errorf("destination %s already exists; use --force to replace it", dst)
		}
		if exists {
			if err := removeDestination(dst, info); err != nil {
				return r, err
			}
			r.Action = "Replacing"
		} else {
			r.Action = "Linking"
		}
		if err := os.Symlink(skillPath, dst); err != nil {
			return r, fmt.Errorf("creating symlink: %w", err)
		}
	} else {
		if exists && !opts.Force {
			return r, fmt.Errorf("destination %s already exists; use --force to replace it", dst)
		}

		tmp, err := os.MkdirTemp(destDir, "."+skillName+".tmp-")
		if err != nil {
			return r, fmt.Errorf("creating temporary destination: %w", err)
		}
		defer os.RemoveAll(tmp)

		if err := copyDir(skillPath, tmp); err != nil {
			return r, fmt.Errorf("copying skill: %w", err)
		}
		if exists {
			if err := removeDestination(dst, info); err != nil {
				return r, err
			}
			r.Action = "Replacing"
		} else {
			r.Action = "Installing"
		}
		if err := os.Rename(tmp, dst); err != nil {
			return r, fmt.Errorf("activating copied skill: %w", err)
		}
	}

	return r, nil
}

// Unlink removes only symlinks that point into sourceDir.
func Unlink(dir, sourceDir string) (int, error) {
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
			target, err := os.Readlink(fullPath)
			if err != nil {
				continue
			}
			if !filepath.IsAbs(target) {
				target = filepath.Join(filepath.Dir(fullPath), target)
			}
			if !isWithin(sourceDir, target) {
				continue
			}
			if err := os.Remove(fullPath); err != nil {
				return removed, fmt.Errorf("removing %s: %w", fullPath, err)
			}
			fmt.Printf("  Removing %s\n", fullPath)
			removed++
		}
	}
	return removed, nil
}

func sameLinkTarget(linkPath, requestedTarget string) bool {
	current, err := filepath.EvalSymlinks(linkPath)
	if err != nil {
		return false
	}
	requested, err := filepath.EvalSymlinks(requestedTarget)
	if err != nil {
		requested, err = filepath.Abs(requestedTarget)
		if err != nil {
			return false
		}
	}
	return filepath.Clean(current) == filepath.Clean(requested)
}

func isWithin(parent, child string) bool {
	parentAbs, err := canonicalPath(parent)
	if err != nil {
		return false
	}
	childAbs, err := canonicalPath(child)
	if err != nil {
		return false
	}
	rel, err := filepath.Rel(parentAbs, childAbs)
	return err == nil && rel != ".." && !strings.HasPrefix(rel, ".."+string(filepath.Separator))
}

func canonicalPath(path string) (string, error) {
	abs, err := filepath.Abs(path)
	if err != nil {
		return "", err
	}

	current := filepath.Clean(abs)
	var missing []string
	for {
		resolved, evalErr := filepath.EvalSymlinks(current)
		if evalErr == nil {
			for i := len(missing) - 1; i >= 0; i-- {
				resolved = filepath.Join(resolved, missing[i])
			}
			return filepath.Clean(resolved), nil
		}
		parent := filepath.Dir(current)
		if parent == current {
			return filepath.Clean(abs), nil
		}
		missing = append(missing, filepath.Base(current))
		current = parent
	}
}

func removeDestination(path string, info fs.FileInfo) error {
	if info.IsDir() && info.Mode()&os.ModeSymlink == 0 {
		if err := os.RemoveAll(path); err != nil {
			return fmt.Errorf("removing existing directory %s: %w", path, err)
		}
		return nil
	}
	if err := os.Remove(path); err != nil {
		return fmt.Errorf("removing existing destination %s: %w", path, err)
	}
	return nil
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
