package updater

import (
	"os"
	"os/exec"
	"path/filepath"
	"testing"
)

func run(t *testing.T, dir string, args ...string) string {
	t.Helper()
	cmd := exec.Command("git", args...)
	cmd.Dir = dir
	cmd.Env = append(os.Environ(),
		"GIT_AUTHOR_NAME=t", "GIT_AUTHOR_EMAIL=t@t",
		"GIT_COMMITTER_NAME=t", "GIT_COMMITTER_EMAIL=t@t",
	)
	out, err := cmd.CombinedOutput()
	if err != nil {
		t.Fatalf("git %v: %v\n%s", args, err, out)
	}
	return string(out)
}

// newRepo creates an origin bare repo and a working clone with one commit.
func newRepo(t *testing.T) (clone, origin string) {
	t.Helper()
	root := t.TempDir()
	origin = filepath.Join(root, "origin.git")
	clone = filepath.Join(root, "clone")
	run(t, root, "init", "--bare", "-b", "main", origin)

	tmp := filepath.Join(root, "seed")
	run(t, root, "clone", "-q", origin, tmp)
	if err := os.WriteFile(filepath.Join(tmp, "README.md"), []byte("hi\n"), 0o644); err != nil {
		t.Fatal(err)
	}
	run(t, tmp, "add", "-A")
	run(t, tmp, "commit", "-q", "-m", "init")
	run(t, tmp, "push", "-q", "origin", "main")

	run(t, root, "clone", "-q", origin, clone)
	return clone, origin
}

func TestIsRepoAndHead(t *testing.T) {
	clone, _ := newRepo(t)
	if !IsRepo(clone) {
		t.Fatal("expected IsRepo=true for a clone")
	}
	if IsRepo(t.TempDir()) {
		t.Fatal("expected IsRepo=false for a non-repo dir")
	}
	if h, err := ShortHead(clone); err != nil || h == "" {
		t.Fatalf("ShortHead: %q err=%v", h, err)
	}
}

func TestDirtyTrackedFilesExcludesArtifactsAndUntracked(t *testing.T) {
	clone, _ := newRepo(t)

	// Clean tree.
	if d, err := DirtyTrackedFiles(clone); err != nil || len(d) != 0 {
		t.Fatalf("clean tree: got %v err=%v", d, err)
	}

	// An untracked file is not a "dirty tracked file".
	if err := os.WriteFile(filepath.Join(clone, "PHILOSOPHY.md"), []byte("x"), 0o644); err != nil {
		t.Fatal(err)
	}
	// A dirty build artifact must be ignored (regression: also the first line).
	if err := os.MkdirAll(filepath.Join(clone, "cli"), 0o755); err != nil {
		t.Fatal(err)
	}
	run(t, clone, "add", "cli") // stage the empty dir? no-op; create tracked artifact below
	if err := os.WriteFile(filepath.Join(clone, "cli", "skills"), []byte("v1"), 0o755); err != nil {
		t.Fatal(err)
	}
	run(t, clone, "add", "cli/skills")
	run(t, clone, "commit", "-q", "-m", "add artifact")
	if err := os.WriteFile(filepath.Join(clone, "cli", "skills"), []byte("v2-rebuilt"), 0o755); err != nil {
		t.Fatal(err)
	}
	d, err := DirtyTrackedFiles(clone)
	if err != nil {
		t.Fatal(err)
	}
	if len(d) != 0 {
		t.Fatalf("expected artifact + untracked to be ignored, got %v", d)
	}

	// A real tracked change is reported (and not truncated on the first line).
	if err := os.WriteFile(filepath.Join(clone, "README.md"), []byte("changed\n"), 0o644); err != nil {
		t.Fatal(err)
	}
	d, err = DirtyTrackedFiles(clone)
	if err != nil {
		t.Fatal(err)
	}
	if len(d) != 1 || d[0] != "README.md" {
		t.Fatalf("expected [README.md], got %v", d)
	}
}

func TestDivergenceDetectsBehind(t *testing.T) {
	clone, origin := newRepo(t)

	// Advance origin from a second clone, then fetch into the first.
	root := filepath.Dir(origin)
	other := filepath.Join(root, "other")
	run(t, root, "clone", "-q", origin, other)
	if err := os.WriteFile(filepath.Join(other, "f2"), []byte("2"), 0o644); err != nil {
		t.Fatal(err)
	}
	run(t, other, "add", "-A")
	run(t, other, "commit", "-q", "-m", "second")
	run(t, other, "push", "-q", "origin", "main")

	if err := Fetch(clone, 30_000_000_000); err != nil {
		t.Fatalf("fetch: %v", err)
	}
	ahead, behind, upstream, err := Divergence(clone)
	if err != nil {
		t.Fatal(err)
	}
	if ahead != 0 || behind != 1 {
		t.Fatalf("expected ahead=0 behind=1, got ahead=%d behind=%d (upstream %s)", ahead, behind, upstream)
	}
}
