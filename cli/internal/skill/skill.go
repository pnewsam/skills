package skill

import (
	"bufio"
	"fmt"
	"os"
	"path/filepath"
	"sort"
	"strings"
)

type Skill struct {
	Name        string
	Description string
	Path        string // absolute path to the skill directory
}

// Discover finds all skills in the given directory by looking for */SKILL.md files.
func Discover(dir string) ([]Skill, error) {
	entries, err := os.ReadDir(dir)
	if err != nil {
		return nil, fmt.Errorf("reading skills directory: %w", err)
	}

	var skills []Skill
	for _, e := range entries {
		if !e.IsDir() {
			continue
		}
		skillMD := filepath.Join(dir, e.Name(), "SKILL.md")
		if _, err := os.Stat(skillMD); err != nil {
			continue
		}
		s := Skill{
			Name: e.Name(),
			Path: filepath.Join(dir, e.Name()),
		}
		if desc, err := parseFrontmatter(skillMD); err == nil {
			s.Description = desc
		}
		skills = append(skills, s)
	}

	sort.Slice(skills, func(i, j int) bool {
		return skills[i].Name < skills[j].Name
	})
	return skills, nil
}

// parseFrontmatter extracts the description from YAML frontmatter in a SKILL.md file.
func parseFrontmatter(path string) (string, error) {
	f, err := os.Open(path)
	if err != nil {
		return "", err
	}
	defer f.Close()

	scanner := bufio.NewScanner(f)
	if !scanner.Scan() || strings.TrimSpace(scanner.Text()) != "---" {
		return "", fmt.Errorf("no frontmatter")
	}

	var desc string
	for scanner.Scan() {
		line := scanner.Text()
		if strings.TrimSpace(line) == "---" {
			break
		}
		if strings.HasPrefix(line, "description:") {
			desc = strings.TrimSpace(strings.TrimPrefix(line, "description:"))
		}
	}
	return desc, nil
}
