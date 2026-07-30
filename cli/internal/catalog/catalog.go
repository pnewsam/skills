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
}

type Catalog struct {
	Version  int                `json:"version"`
	Profiles map[string]Profile `json:"profiles"`
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

// Select returns the available skill names included in one or more profiles.
// Results follow availableNames order so installation output stays stable.
func (c Catalog) Select(profileNames, availableNames []string) ([]string, error) {
	selected := make(map[string]bool)
	for _, profileName := range profileNames {
		profile, ok := c.Profiles[profileName]
		if !ok {
			return nil, fmt.Errorf(
				"unknown profile %q (known: %s)",
				profileName,
				strings.Join(c.ProfileNames(), ", "),
			)
		}
		for _, skillName := range profile.Skills {
			selected[skillName] = true
		}
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
