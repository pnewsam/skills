package installer

import (
	"os"
	"path/filepath"
	"testing"
)

func makeSkill(t *testing.T, root, name string) string {
	t.Helper()
	dir := filepath.Join(root, name)
	if err := os.MkdirAll(dir, 0o755); err != nil {
		t.Fatal(err)
	}
	if err := os.WriteFile(filepath.Join(dir, "SKILL.md"), []byte("---\nname: "+name+"\ndescription: test\n---\n"), 0o644); err != nil {
		t.Fatal(err)
	}
	return dir
}

func TestInstallLinkIsIdempotent(t *testing.T) {
	source := makeSkill(t, t.TempDir(), "example")
	dest := t.TempDir()

	if _, err := Install(source, dest, ModeLink, Options{}); err != nil {
		t.Fatal(err)
	}
	result, err := Install(source, dest, ModeLink, Options{})
	if err != nil {
		t.Fatal(err)
	}
	if result.Action != "Current" {
		t.Fatalf("action = %q, want Current", result.Action)
	}
}

func TestInstallPreservesCollisionWithoutForce(t *testing.T) {
	source := makeSkill(t, t.TempDir(), "example")
	dest := t.TempDir()
	existing := filepath.Join(dest, "example")
	if err := os.Mkdir(existing, 0o755); err != nil {
		t.Fatal(err)
	}
	marker := filepath.Join(existing, "user-file")
	if err := os.WriteFile(marker, []byte("keep"), 0o644); err != nil {
		t.Fatal(err)
	}

	if _, err := Install(source, dest, ModeLink, Options{}); err == nil {
		t.Fatal("expected collision error")
	}
	if _, err := os.Stat(marker); err != nil {
		t.Fatalf("existing destination was modified: %v", err)
	}
}

func TestInstallForceReplacesCollision(t *testing.T) {
	source := makeSkill(t, t.TempDir(), "example")
	dest := t.TempDir()
	existing := filepath.Join(dest, "example")
	if err := os.Mkdir(existing, 0o755); err != nil {
		t.Fatal(err)
	}

	if _, err := Install(source, dest, ModeLink, Options{Force: true}); err != nil {
		t.Fatal(err)
	}
	info, err := os.Lstat(existing)
	if err != nil {
		t.Fatal(err)
	}
	if info.Mode()&os.ModeSymlink == 0 {
		t.Fatal("destination is not a symlink")
	}
}

func TestCopyRequiresForceToUpdate(t *testing.T) {
	source := makeSkill(t, t.TempDir(), "example")
	dest := t.TempDir()

	if _, err := Install(source, dest, ModeCopy, Options{}); err != nil {
		t.Fatal(err)
	}
	if _, err := Install(source, dest, ModeCopy, Options{}); err == nil {
		t.Fatal("expected collision error")
	}
	if _, err := Install(source, dest, ModeCopy, Options{Force: true}); err != nil {
		t.Fatal(err)
	}
}

func TestUnlinkRemovesOnlyOwnedLinks(t *testing.T) {
	sourceRoot := t.TempDir()
	owned := makeSkill(t, sourceRoot, "owned")
	foreign := makeSkill(t, t.TempDir(), "foreign")
	dest := t.TempDir()
	if err := os.Symlink(owned, filepath.Join(dest, "owned")); err != nil {
		t.Fatal(err)
	}
	if err := os.Symlink(foreign, filepath.Join(dest, "foreign")); err != nil {
		t.Fatal(err)
	}

	removed, err := Unlink(dest, sourceRoot)
	if err != nil {
		t.Fatal(err)
	}
	if removed != 1 {
		t.Fatalf("removed = %d, want 1", removed)
	}
	if _, err := os.Lstat(filepath.Join(dest, "foreign")); err != nil {
		t.Fatalf("foreign link was removed: %v", err)
	}
}

func TestUnlinkRemovesDanglingOwnedLink(t *testing.T) {
	sourceRoot := t.TempDir()
	dest := t.TempDir()
	link := filepath.Join(dest, "retired")
	if err := os.Symlink(filepath.Join(sourceRoot, "retired"), link); err != nil {
		t.Fatal(err)
	}

	removed, err := Unlink(dest, sourceRoot)
	if err != nil {
		t.Fatal(err)
	}
	if removed != 1 {
		t.Fatalf("removed = %d, want 1", removed)
	}
}
