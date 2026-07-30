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

func TestRepositoryCoreAndAdvisoryProfilesStayDistinct(t *testing.T) {
	repoRoot := filepath.Clean(filepath.Join("..", "..", ".."))
	registryCatalog, err := Load(filepath.Join(repoRoot, "catalog.json"))
	if err != nil {
		t.Fatal(err)
	}

	core, err := registryCatalog.ExpandedSkillNames([]string{"core"})
	if err != nil {
		t.Fatal(err)
	}
	wantCore := []string{
		"diagnose-failure",
		"prepare-pr",
		"review-pr",
		"revise-pr",
		"save-session",
		"stash",
		"validate-changes",
	}
	if !reflect.DeepEqual(core, wantCore) {
		t.Fatalf("core = %#v, want %#v", core, wantCore)
	}

	advisory, err := registryCatalog.ExpandedSkillNames([]string{"advisory"})
	if err != nil {
		t.Fatal(err)
	}
	inAdvisory := make(map[string]bool, len(advisory))
	for _, name := range advisory {
		inAdvisory[name] = true
	}
	for _, expected := range []string{
		"consult-expert",
		"backend-expert",
		"react-expert",
		"quality-expert",
		"visual-hierarchy",
	} {
		if !inAdvisory[expected] {
			t.Errorf("advisory does not include %q", expected)
		}
	}
	if inAdvisory["color-expert"] || inAdvisory["emil-design-eng"] {
		t.Error("advisory unexpectedly includes externally sourced skills")
	}
}
