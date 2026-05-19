package main

import (
	"fmt"
	"os"
	"os/exec"
	"path/filepath"
	"strings"

	"github.com/paulnewsam/skills/cli/internal/harness"
	"github.com/paulnewsam/skills/cli/internal/installer"
	"github.com/paulnewsam/skills/cli/internal/skill"
	"github.com/paulnewsam/skills/cli/internal/tui"
	"github.com/spf13/cobra"
)

// Set via -ldflags at build time.
var buildCommit = "dev"

var (
	flagTargets []string
	flagAll     bool
	flagProject bool
	flagDir     string
	flagCopy    bool
	flagYes     bool
	flagSource  string
)

func main() {
	if err := rootCmd.Execute(); err != nil {
		os.Exit(1)
	}
}

var rootCmd = &cobra.Command{
	Use:   "skills",
	Short: "Install agent skills into coding harness directories",
	Long:  "Install agent skills (symlinks or copies) into coding harness directories like Claude Code and Codex.",
	RunE:  runInstall,
}

var installCmd = &cobra.Command{
	Use:   "install",
	Short: "Install skills into harness directories",
	RunE:  runInstall,
}

var statusCmd = &cobra.Command{
	Use:   "status",
	Short: "Show installed skills per harness",
	RunE:  runStatus,
}

var unlinkCmd = &cobra.Command{
	Use:   "unlink <harness>",
	Short: "Remove symlinks from a harness directory",
	Args:  cobra.ExactArgs(1),
	RunE:  runUnlink,
}

var dashboardCmd = &cobra.Command{
	Use:   "dashboard",
	Short: "Show a visual overview of installed skills",
	RunE:  runDashboard,
}

var versionCmd = &cobra.Command{
	Use:   "version",
	Short: "Print the build version",
	Run: func(cmd *cobra.Command, args []string) {
		fmt.Println(buildCommit)
	},
}

var setupCmd = &cobra.Command{
	Use:   "setup",
	Short: "Install this binary so 'skills' works globally",
	RunE:  runSetup,
}

func init() {
	for _, cmd := range []*cobra.Command{rootCmd, installCmd} {
		cmd.Flags().StringSliceVarP(&flagTargets, "target", "t", nil, "Target harness (repeatable)")
		cmd.Flags().BoolVarP(&flagAll, "all", "a", false, "Target all known harnesses")
		cmd.Flags().BoolVarP(&flagProject, "project", "p", false, "Project install to <cwd>/.claude/skills (copies)")
		cmd.Flags().StringVarP(&flagDir, "dir", "d", "", "Install to a custom directory (copies)")
		cmd.Flags().BoolVar(&flagCopy, "copy", false, "Force copy mode instead of symlinks")
		cmd.Flags().BoolVarP(&flagYes, "yes", "y", false, "Skip prompts; install all skills")
		cmd.Flags().StringVar(&flagSource, "source", "", "Skills source directory")
	}

	rootCmd.AddCommand(installCmd, statusCmd, unlinkCmd, setupCmd, dashboardCmd, versionCmd)

	// Check for updates on every command (non-blocking, best-effort).
	rootCmd.PersistentPreRun = func(cmd *cobra.Command, args []string) {
		checkForUpdate()
	}
}

// findSourceDir resolves the skills source directory.
func findSourceDir() (string, error) {
	// 1. --source flag
	if flagSource != "" {
		return flagSource, nil
	}

	// 2. Binary is a symlink → resolve, look for registry/ sibling (or parent)
	exe, err := os.Executable()
	if err == nil {
		resolved, _ := filepath.EvalSymlinks(exe)
		for _, base := range []string{filepath.Dir(resolved), filepath.Dir(exe)} {
			// Binary lives in cli/ → check ../registry
			candidate := filepath.Join(base, "..", "registry")
			if isSkillsDir(candidate) {
				return filepath.Clean(candidate), nil
			}
			// Binary lives at repo root
			candidate = filepath.Join(base, "registry")
			if isSkillsDir(candidate) {
				return candidate, nil
			}
		}
	}

	// 3. ./registry/ in current working directory
	cwd, err := os.Getwd()
	if err == nil {
		candidate := filepath.Join(cwd, "registry")
		if isSkillsDir(candidate) {
			return candidate, nil
		}
	}

	// 4. source_dir in config file
	_, sourceDir := harness.LoadConfig()
	if sourceDir != "" {
		expanded := expandHome(sourceDir)
		if isSkillsDir(expanded) {
			return expanded, nil
		}
	}

	return "", fmt.Errorf("could not find skills source directory.\nUse --source <dir> or run from the skills repo root")
}

func isSkillsDir(dir string) bool {
	entries, err := os.ReadDir(dir)
	if err != nil {
		return false
	}
	for _, e := range entries {
		if e.IsDir() {
			if _, err := os.Stat(filepath.Join(dir, e.Name(), "SKILL.md")); err == nil {
				return true
			}
		}
	}
	return false
}

func expandHome(path string) string {
	if strings.HasPrefix(path, "~/") {
		home, _ := os.UserHomeDir()
		return filepath.Join(home, path[2:])
	}
	return path
}

func runInstall(cmd *cobra.Command, args []string) error {
	sourceDir, err := findSourceDir()
	if err != nil {
		return err
	}

	skills, err := skill.Discover(sourceDir)
	if err != nil {
		return fmt.Errorf("discovering skills: %w", err)
	}
	if len(skills) == 0 {
		return fmt.Errorf("no skills found in %s", sourceDir)
	}

	harnesses, _ := harness.LoadConfig()
	mode := installer.ModeLink

	if flagCopy || flagProject || flagDir != "" {
		mode = installer.ModeCopy
	}

	type target struct {
		dir  string
		mode installer.Mode
	}
	var targets []target

	switch {
	case flagProject:
		cwd, _ := os.Getwd()
		targets = append(targets, target{filepath.Join(cwd, ".claude", "skills"), installer.ModeCopy})
	case flagDir != "":
		targets = append(targets, target{flagDir, installer.ModeCopy})
	case flagAll:
		for _, h := range harnesses {
			targets = append(targets, target{h.Dir, mode})
		}
	case len(flagTargets) > 0:
		for _, name := range flagTargets {
			h, err := harness.FindByName(harnesses, name)
			if err != nil {
				return err
			}
			targets = append(targets, target{h.Dir, mode})
		}
	}

	var selectedSkills []skill.Skill

	if flagYes {
		// Non-interactive: install all skills
		selectedSkills = skills
		if len(targets) == 0 {
			for _, h := range harnesses {
				targets = append(targets, target{h.Dir, mode})
			}
		}
	} else {
		// Interactive mode
		if len(targets) == 0 && !flagProject && flagDir == "" {
			// Select harnesses
			harnessLabels := make([]string, len(harnesses))
			for i, h := range harnesses {
				harnessLabels[i] = fmt.Sprintf("%s  —  %s", h.Name, h.Dir)
			}

			modeLabel := "symlink"
			if mode == installer.ModeCopy {
				modeLabel = "copy"
			}
			sel, err := tui.MultiSelect(fmt.Sprintf("Select target harnesses (%s):", modeLabel), harnessLabels, nil)
			if err != nil {
				return fmt.Errorf("aborted")
			}

			for i, s := range sel {
				if s {
					targets = append(targets, target{harnesses[i].Dir, mode})
				}
			}
		}

		// Select skills
		skillNames := make([]string, len(skills))
		for i, s := range skills {
			skillNames[i] = s.Name
		}

		sel, err := tui.MultiSelect("Select skills to install:", skillNames, nil)
		if err != nil {
			return fmt.Errorf("aborted")
		}

		for i, s := range sel {
			if s {
				selectedSkills = append(selectedSkills, skills[i])
			}
		}
	}

	if len(selectedSkills) == 0 {
		fmt.Println("No skills selected. Nothing installed.")
		return nil
	}
	if len(targets) == 0 {
		fmt.Println("No harnesses selected. Nothing installed.")
		return nil
	}

	// Install
	fmt.Println()
	for _, t := range targets {
		modeStr := "Symlinking"
		if t.mode == installer.ModeCopy {
			modeStr = "Copying"
		}
		fmt.Printf("%s %d skill(s) into %s ...\n", modeStr, len(selectedSkills), t.dir)

		for _, s := range selectedSkills {
			r, err := installer.Install(s.Path, t.dir, t.mode)
			if err != nil {
				fmt.Fprintf(os.Stderr, "  Error installing %s: %v\n", s.Name, err)
				continue
			}
			fmt.Printf("  %-12s %s\n", r.Action, r.Skill)
		}
		fmt.Println()
	}

	fmt.Println("Done.")
	return nil
}

func runStatus(cmd *cobra.Command, args []string) error {
	harnesses, _ := harness.LoadConfig()

	fmt.Println()
	for _, h := range harnesses {
		fmt.Printf("  %s (%s):\n", h.Name, h.Dir)

		skills, err := harness.InstalledSkills(h)
		if err != nil {
			fmt.Printf("    (not installed)\n")
			fmt.Println()
			continue
		}

		if len(skills) == 0 {
			fmt.Printf("    (empty)\n")
			fmt.Println()
			continue
		}

		for _, s := range skills {
			if s.IsLink {
				fmt.Printf("    %s -> %s (symlink)\n", s.Name, s.Target)
			} else {
				fmt.Printf("    %s (copy)\n", s.Name)
			}
		}
		fmt.Println()
	}
	return nil
}

func runUnlink(cmd *cobra.Command, args []string) error {
	harnesses, _ := harness.LoadConfig()
	h, err := harness.FindByName(harnesses, args[0])
	if err != nil {
		return err
	}

	removed, err := installer.Unlink(h.Dir)
	if err != nil {
		return err
	}
	fmt.Printf("Removed %d symlink(s) from %s.\n", removed, h.Dir)
	return nil
}

func runDashboard(cmd *cobra.Command, args []string) error {
	harnesses, _ := harness.LoadConfig()
	tui.Dashboard(harnesses)
	return nil
}

func runSetup(cmd *cobra.Command, args []string) error {
	exe, err := os.Executable()
	if err != nil {
		return fmt.Errorf("finding executable: %w", err)
	}
	exe, err = filepath.EvalSymlinks(exe)
	if err != nil {
		return fmt.Errorf("resolving executable: %w", err)
	}

	// Remove any stale "skills" binaries elsewhere in PATH that would shadow ours.
	removeStaleBinaries(exe)

	home, _ := os.UserHomeDir()
	binDir := filepath.Join(home, ".local", "bin")
	if err := os.MkdirAll(binDir, 0o755); err != nil {
		return fmt.Errorf("creating %s: %w", binDir, err)
	}

	linkPath := filepath.Join(binDir, "skills")
	os.Remove(linkPath)
	if err := os.Symlink(exe, linkPath); err != nil {
		return fmt.Errorf("creating symlink: %w", err)
	}

	fmt.Printf("Linked: %s -> %s\n\n", linkPath, exe)

	// Check if binDir is in PATH
	pathDirs := filepath.SplitList(os.Getenv("PATH"))
	inPath := false
	for _, d := range pathDirs {
		if d == binDir {
			inPath = true
			break
		}
	}

	if !inPath {
		fmt.Printf("Note: %s is not in your PATH.\n", binDir)
		fmt.Println("Add this to your shell config (~/.zshrc or ~/.bashrc):")
		fmt.Printf("  export PATH=\"$HOME/.local/bin:$PATH\"\n")
	} else {
		fmt.Println("Run 'skills' from any directory to install skills.")
	}
	return nil
}

// removeStaleBinaries finds other "skills" binaries in PATH that would shadow
// the canonical one and removes them (with a message).
func removeStaleBinaries(canonical string) {
	others := findAllInPath("skills")
	for _, p := range others {
		resolved, err := filepath.EvalSymlinks(p)
		if err != nil {
			resolved = p
		}
		// Keep it if it resolves to our canonical binary.
		if resolved == canonical {
			continue
		}
		fmt.Printf("  Removing stale binary: %s\n", p)
		if err := os.Remove(p); err != nil {
			fmt.Fprintf(os.Stderr, "  Warning: could not remove %s: %v\n", p, err)
		}
	}
}

// findAllInPath returns all absolute paths for a named binary found in PATH.
func findAllInPath(name string) []string {
	var results []string
	seen := map[string]bool{}
	for _, dir := range filepath.SplitList(os.Getenv("PATH")) {
		p := filepath.Join(dir, name)
		if seen[p] {
			continue
		}
		seen[p] = true
		if _, err := os.Lstat(p); err == nil {
			results = append(results, p)
		}
	}
	return results
}

// checkForUpdate compares the embedded build commit against the repo's current
// HEAD. If they differ, it prints a one-line hint. Silently does nothing if
// the repo can't be found or git isn't available.
func checkForUpdate() {
	if buildCommit == "dev" {
		return // local dev build, skip check
	}

	repoDir := repoRoot()
	if repoDir == "" {
		return
	}

	out, err := exec.Command("git", "-C", repoDir, "rev-parse", "--short", "HEAD").Output()
	if err != nil {
		return
	}

	head := strings.TrimSpace(string(out))
	if head != buildCommit {
		fmt.Fprintf(os.Stderr, "Update available: build %s -> HEAD %s  (run: cd %s && make build && skills setup)\n", buildCommit, head, filepath.Join(repoDir, "cli"))
	}
}

// repoRoot finds the skills repo root by resolving the binary path.
func repoRoot() string {
	exe, err := os.Executable()
	if err != nil {
		return ""
	}
	resolved, err := filepath.EvalSymlinks(exe)
	if err != nil {
		return ""
	}
	// Binary lives in cli/ → repo root is ../
	candidate := filepath.Clean(filepath.Join(filepath.Dir(resolved), ".."))
	if _, err := os.Stat(filepath.Join(candidate, ".git")); err == nil {
		return candidate
	}
	return ""
}
