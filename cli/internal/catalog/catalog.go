package catalog

import (
	"encoding/json"
	"fmt"
	"os"
	"sort"
	"strings"
)

type Profile struct {
	Description string   `json:"description"`
	Skills      []string `json:"skills"`
	Includes    []string `json:"includes,omitempty"`
}

type Catalog struct {
	Version  int                      `json:"version"`
	Profiles map[string]Profile       `json:"profiles"`
	Skills   map[string]SkillMetadata `json:"skills,omitempty"`
}

type SkillMetadata struct {
	Layer          string   `json:"layer"`
	Scope          string   `json:"scope"`
	Requires       []string `json:"requires"`
	OptionalSkills []string `json:"optional_skills"`
}

// ExpandedSkills closes required package dependencies, never optional routes.
// Catalogs without skill metadata remain usable for independent custom packages.
func (c Catalog) ExpandedSkills(names []string) ([]string, error) {
	state := make(map[string]int)
	var stack []string
	var visit func(string) error
	visit = func(name string) error {
		if state[name] == 1 {
			return fmt.Errorf("skill dependency cycle: %s", strings.Join(append(stack, name), " -> "))
		}
		if state[name] == 2 {
			return nil
		}
		metadata, exists := c.Skills[name]
		if len(c.Skills) > 0 && !exists {
			return fmt.Errorf("unknown skill dependency %q", name)
		}
		state[name] = 1
		stack = append(stack, name)
		for _, dep := range metadata.Requires {
			if err := visit(dep); err != nil {
				return err
			}
		}
		stack = stack[:len(stack)-1]
		state[name] = 2
		return nil
	}
	for _, name := range names {
		if err := visit(name); err != nil {
			return nil, err
		}
	}
	result := make([]string, 0, len(state))
	for name := range state {
		result = append(result, name)
	}
	sort.Strings(result)
	return result, nil
}

func Load(path string) (Catalog, error) {
	data, err := os.ReadFile(path)
	if err != nil {
		return Catalog{}, fmt.Errorf("reading catalog: %w", err)
	}

	var result Catalog
	if err := json.Unmarshal(data, &result); err != nil {
		return Catalog{}, fmt.Errorf("parsing catalog: %w", err)
	}
	if result.Version != 1 {
		return Catalog{}, fmt.Errorf("unsupported catalog version %d", result.Version)
	}
	if len(result.Profiles) == 0 {
		return Catalog{}, fmt.Errorf("catalog contains no profiles")
	}
	return result, nil
}

func (c Catalog) ProfileNames() []string {
	names := make([]string, 0, len(c.Profiles))
	for name := range c.Profiles {
		names = append(names, name)
	}
	sort.Strings(names)
	return names
}

// ExpandedSkillNames returns the unique skills included directly or transitively
// by one or more profiles. The result is sorted for stable display and testing.
func (c Catalog) ExpandedSkillNames(profileNames []string) ([]string, error) {
	selected := make(map[string]bool)
	state := make(map[string]int)
	var stack []string

	var visit func(string) error
	visit = func(profileName string) error {
		profile, ok := c.Profiles[profileName]
		if !ok {
			return fmt.Errorf(
				"unknown profile %q (known: %s)",
				profileName,
				strings.Join(c.ProfileNames(), ", "),
			)
		}
		switch state[profileName] {
		case 1:
			start := 0
			for i, name := range stack {
				if name == profileName {
					start = i
					break
				}
			}
			cycle := append(append([]string{}, stack[start:]...), profileName)
			return fmt.Errorf("profile include cycle: %s", strings.Join(cycle, " -> "))
		case 2:
			return nil
		}

		state[profileName] = 1
		stack = append(stack, profileName)
		for _, includedName := range profile.Includes {
			if err := visit(includedName); err != nil {
				return err
			}
		}
		for _, skillName := range profile.Skills {
			selected[skillName] = true
		}
		stack = stack[:len(stack)-1]
		state[profileName] = 2
		return nil
	}

	for _, profileName := range profileNames {
		if err := visit(profileName); err != nil {
			return nil, err
		}
	}

	result := make([]string, 0, len(selected))
	for name := range selected {
		result = append(result, name)
	}
	sort.Strings(result)
	return c.ExpandedSkills(result)
}

// Select returns the available skill names included in one or more profiles.
// Results follow availableNames order so installation output stays stable.
func (c Catalog) Select(profileNames, availableNames []string) ([]string, error) {
	expanded, err := c.ExpandedSkillNames(profileNames)
	if err != nil {
		return nil, err
	}
	return c.SelectSkills(expanded, availableNames)
}

// SelectSkills also closes dependencies for an interactive package selection.
func (c Catalog) SelectSkills(names, availableNames []string) ([]string, error) {
	expanded, err := c.ExpandedSkills(names)
	if err != nil {
		return nil, err
	}
	selected := make(map[string]bool, len(expanded))
	for _, name := range expanded {
		selected[name] = true
	}

	available := make(map[string]bool, len(availableNames))
	for _, name := range availableNames {
		available[name] = true
	}
	for name := range selected {
		if !available[name] {
			return nil, fmt.Errorf(
				"profile references skill %q, but it is not available in the source",
				name,
			)
		}
	}

	result := make([]string, 0, len(selected))
	for _, name := range availableNames {
		if selected[name] {
			result = append(result, name)
		}
	}
	return result, nil
}
