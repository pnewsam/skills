package catalog

import (
	"os"
	"path/filepath"
	"reflect"
	"testing"
)

func TestLoadAndSelectProfiles(t *testing.T) {
	path := filepath.Join(t.TempDir(), "catalog.json")
	data := []byte(`{
  "version": 1,
  "profiles": {
    "core": {"description": "Core", "skills": ["beta", "alpha"]},
    "extra": {
      "description": "Extra",
      "includes": ["core"],
      "skills": ["gamma", "beta"]
    }
  }
}`)
	if err := os.WriteFile(path, data, 0o644); err != nil {
		t.Fatal(err)
	}

	catalog, err := Load(path)
	if err != nil {
		t.Fatal(err)
	}
	got, err := catalog.Select(
		[]string{"core", "extra"},
		[]string{"alpha", "beta", "gamma"},
	)
	if err != nil {
		t.Fatal(err)
	}
	want := []string{"alpha", "beta", "gamma"}
	if !reflect.DeepEqual(got, want) {
		t.Fatalf("Select() = %#v, want %#v", got, want)
	}
}

func TestSelectRejectsUnknownProfile(t *testing.T) {
	catalog := Catalog{Version: 1, Profiles: map[string]Profile{"core": {}}}
	if _, err := catalog.Select([]string{"missing"}, []string{"alpha"}); err == nil {
		t.Fatal("expected unknown profile error")
	}
}

func TestSelectRejectsUnavailableSkill(t *testing.T) {
	catalog := Catalog{
		Version: 1,
		Profiles: map[string]Profile{
			"core": {Skills: []string{"missing"}},
		},
	}
	if _, err := catalog.Select([]string{"core"}, []string{"alpha"}); err == nil {
		t.Fatal("expected unavailable skill error")
	}
}

func TestExpandedSkillNamesRejectsUnknownInclude(t *testing.T) {
	catalog := Catalog{
		Version: 1,
		Profiles: map[string]Profile{
			"advisory": {Includes: []string{"missing"}},
		},
	}
	if _, err := catalog.ExpandedSkillNames([]string{"advisory"}); err == nil {
		t.Fatal("expected unknown included profile error")
	}
}

func TestExpandedSkillNamesRejectsIncludeCycle(t *testing.T) {
	catalog := Catalog{
		Version: 1,
		Profiles: map[string]Profile{
			"one": {Includes: []string{"two"}},
			"two": {Includes: []string{"one"}},
		},
	}
	if _, err := catalog.ExpandedSkillNames([]string{"one"}); err == nil {
		t.Fatal("expected profile include cycle error")
	}
}

func TestRepositoryCatalogResolvesEveryProfile(t *testing.T) {
	repoRoot := filepath.Clean(filepath.Join("..", "..", ".."))
	registryDir := filepath.Join(repoRoot, "registry")
	entries, err := os.ReadDir(registryDir)
	if err != nil {
		t.Fatal(err)
	}
	var available []string
	for _, entry := range entries {
		if !entry.IsDir() {
			continue
		}
		if _, err := os.Stat(filepath.Join(registryDir, entry.Name(), "SKILL.md")); err == nil {
			available = append(available, entry.Name())
		}
	}

	registryCatalog, err := Load(filepath.Join(repoRoot, "catalog.json"))
	if err != nil {
		t.Fatal(err)
	}
	for _, profileName := range registryCatalog.ProfileNames() {
		selected, err := registryCatalog.Select([]string{profileName}, available)
		if err != nil {
			t.Fatalf("profile %s: %v", profileName, err)
		}
		if len(selected) == 0 {
			t.Fatalf("profile %s resolved no skills", profileName)
		}
	}
}

func TestDependenciesApplyToProfilesAndIndividualSelections(t *testing.T) {
	c := Catalog{Version: 1,
		Profiles: map[string]Profile{"core": {Skills: []string{"operation"}}},
		Skills: map[string]SkillMetadata{
			"operation": {Requires: []string{"runbook", "reference"}, OptionalSkills: []string{"optional"}},
			"runbook":   {Requires: []string{"reference"}}, "reference": {}, "optional": {},
		},
	}
	available := []string{"operation", "runbook", "reference", "optional"}
	want := available[:3]
	profile, err := c.Select([]string{"core"}, available)
	if err != nil {
		t.Fatal(err)
	}
	single, err := c.SelectSkills([]string{"operation"}, available)
	if err != nil {
		t.Fatal(err)
	}
	if !reflect.DeepEqual(profile, want) || !reflect.DeepEqual(single, want) {
		t.Fatalf("profile %v, individual %v, want %v", profile, single, want)
	}
	if _, err := c.SelectSkills([]string{"operation"}, []string{"operation", "runbook"}); err == nil {
		t.Fatal("missing transitive dependency must fail before install")
	}
}

func TestDependencyErrors(t *testing.T) {
	for name, skills := range map[string]map[string]SkillMetadata{
		"cycle":   {"a": {Requires: []string{"b"}}, "b": {Requires: []string{"a"}}},
		"unknown": {"a": {Requires: []string{"missing"}}},
	} {
		t.Run(name, func(t *testing.T) {
			if _, err := (Catalog{Skills: skills}).ExpandedSkills([]string{"a"}); err == nil {
				t.Fatal("expected dependency error")
			}
		})
	}
}

func TestGeneralProfileExcludesOptionalPackagesAndClosesDependencies(t *testing.T) {
	c, err := Load(filepath.Join("..", "..", "..", "catalog.json"))
	if err != nil {
		t.Fatal(err)
	}
	names, err := c.ExpandedSkillNames([]string{"general"})
	if err != nil {
		t.Fatal(err)
	}
	if len(names) != 17 {
		t.Fatalf("general has %d packages, want seventeen general responsibilities", len(names))
	}
	selected := map[string]bool{}
	for _, name := range names {
		selected[name] = true
	}
	for _, name := range names {
		for _, dependency := range c.Skills[name].Requires {
			if !selected[dependency] {
				t.Errorf("%s missing dependency %s", name, dependency)
			}
		}
	}
	for _, name := range []string{"emil-design-eng", "svg-animations", "ingest-skill", "mindsdb-track-design-system-metrics"} {
		if selected[name] {
			t.Errorf("optional package %s leaked into general", name)
		}
	}
	for _, name := range []string{"harden-pr", "advance-epic", "trim-comments", "polish-issue"} {
		if selected[name] {
			t.Errorf("retired entry point %s survived", name)
		}
	}
}
