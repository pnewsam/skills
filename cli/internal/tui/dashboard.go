package tui

import (
	"fmt"
	"strings"

	"github.com/charmbracelet/lipgloss"
	"github.com/paulnewsam/skills/cli/internal/harness"
)

var (
	headerStyle = lipgloss.NewStyle().Bold(true).Foreground(lipgloss.Color("12"))
	linkStyle   = lipgloss.NewStyle().Foreground(lipgloss.Color("8"))
	copyStyle   = lipgloss.NewStyle().Foreground(lipgloss.Color("3"))
	emptyStyle  = lipgloss.NewStyle().Faint(true).Italic(true)
	countStyle  = lipgloss.NewStyle().Faint(true)
)

// Dashboard prints a visual overview of installed skills across all harnesses.
func Dashboard(harnesses []harness.Harness) {
	fmt.Println()

	for _, h := range harnesses {
		title := headerStyle.Render(h.Name)
		dir := countStyle.Render(h.Dir)
		fmt.Printf("  %s  %s\n", title, dir)

		skills, err := harness.InstalledSkills(h)
		if err != nil {
			fmt.Println(emptyStyle.Render("    (not found)"))
			fmt.Println()
			continue
		}

		if len(skills) == 0 {
			fmt.Println(emptyStyle.Render("    (empty)"))
			fmt.Println()
			continue
		}

		maxName := 0
		for _, sk := range skills {
			if len(sk.Name) > maxName {
				maxName = len(sk.Name)
			}
		}

		for _, sk := range skills {
			padded := sk.Name + strings.Repeat(" ", maxName-len(sk.Name))
			if sk.IsLink {
				arrow := linkStyle.Render(" -> " + sk.Target)
				fmt.Printf("    %s%s\n", padded, arrow)
			} else {
				tag := copyStyle.Render(" (copy)")
				fmt.Printf("    %s%s\n", padded, tag)
			}
		}

		count := countStyle.Render(fmt.Sprintf("    %d skill(s)", len(skills)))
		fmt.Println(count)
		fmt.Println()
	}
}
