package harness

import (
	"fmt"
	"os"
	"path/filepath"
	"strings"

	"gopkg.in/yaml.v3"
)

type Harness struct {
	Name string `yaml:"name"`
	Dir  string `yaml:"dir"`
}

type configFile struct {
	Harnesses []Harness `yaml:"harnesses"`
	SourceDir string    `yaml:"source_dir"`
}

// Defaults returns the built-in harness definitions.
func Defaults() []Harness {
	home, _ := os.UserHomeDir()
	return []Harness{
		{Name: "claude", Dir: filepath.Join(home, ".claude", "skills")},
		{Name: "codex", Dir: filepath.Join(home, ".agents", "skills")},
	}
}

// ConfigPath returns the path to the config file.
func ConfigPath() string {
	home, _ := os.UserHomeDir()
	return filepath.Join(home, ".config", "skills", "config.yaml")
}

// LoadConfig reads the optional config file and merges with defaults.
func LoadConfig() ([]Harness, string) {
	harnesses := Defaults()
	sourceDir := ""

	data, err := os.ReadFile(ConfigPath())
	if err != nil {
		return harnesses, sourceDir
	}

	var cfg configFile
	if err := yaml.Unmarshal(data, &cfg); err != nil {
		return harnesses, sourceDir
	}

	sourceDir = cfg.SourceDir

	// Merge: config harnesses override defaults by name, or append new ones
	for _, ch := range cfg.Harnesses {
		ch.Dir = expandHome(ch.Dir)
		found := false
		for i, h := range harnesses {
			if h.Name == ch.Name {
				harnesses[i] = ch
				found = true
				break
			}
		}
		if !found {
			harnesses = append(harnesses, ch)
		}
	}

	return harnesses, sourceDir
}

// FindByName returns the harness with the given name, or an error.
func FindByName(harnesses []Harness, name string) (Harness, error) {
	for _, h := range harnesses {
		if h.Name == name {
			return h, nil
		}
	}
	names := make([]string, len(harnesses))
	for i, h := range harnesses {
		names[i] = h.Name
	}
	return Harness{}, fmt.Errorf("unknown harness %q (known: %s)", name, strings.Join(names, ", "))
}

// InstalledSkills returns the skills installed in the harness directory.
type InstalledSkill struct {
	Name     string
	IsLink   bool
	Target   string // symlink target, if IsLink
	HasSkill bool   // has SKILL.md (for copies)
}

func InstalledSkills(h Harness) ([]InstalledSkill, error) {
	entries, err := os.ReadDir(h.Dir)
	if err != nil {
		if os.IsNotExist(err) {
			return nil, nil
		}
		return nil, err
	}

	var skills []InstalledSkill
	for _, e := range entries {
		if !e.IsDir() && e.Type()&os.ModeSymlink == 0 {
			// Check if it's a symlink (ReadDir doesn't always report symlinks as dirs)
			info, err := os.Lstat(filepath.Join(h.Dir, e.Name()))
			if err != nil || info.Mode()&os.ModeSymlink == 0 {
				continue
			}
		}

		fullPath := filepath.Join(h.Dir, e.Name())
		info, err := os.Lstat(fullPath)
		if err != nil {
			continue
		}

		s := InstalledSkill{Name: e.Name()}
		if info.Mode()&os.ModeSymlink != 0 {
			s.IsLink = true
			s.Target, _ = os.Readlink(fullPath)
		} else if info.IsDir() {
			_, err := os.Stat(filepath.Join(fullPath, "SKILL.md"))
			s.HasSkill = err == nil
			if !s.HasSkill {
				continue
			}
		} else {
			continue
		}
		skills = append(skills, s)
	}
	return skills, nil
}

func expandHome(path string) string {
	if strings.HasPrefix(path, "~/") {
		home, _ := os.UserHomeDir()
		return filepath.Join(home, path[2:])
	}
	return path
}
