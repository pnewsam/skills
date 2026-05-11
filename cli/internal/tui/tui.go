package tui

import (
	"fmt"
	"strings"

	tea "github.com/charmbracelet/bubbletea"
	"github.com/charmbracelet/lipgloss"
)

var (
	selectedStyle = lipgloss.NewStyle().Foreground(lipgloss.Color("10")) // green
	cursorStyle   = lipgloss.NewStyle().Bold(true).Reverse(true)
	dimStyle      = lipgloss.NewStyle().Faint(true)
)

type model struct {
	title    string
	items    []string
	selected []bool
	cursor   int
	done     bool
	aborted  bool
}

func (m model) Init() tea.Cmd { return nil }

func (m model) Update(msg tea.Msg) (tea.Model, tea.Cmd) {
	switch msg := msg.(type) {
	case tea.KeyMsg:
		switch msg.String() {
		case "up", "k":
			if m.cursor > 0 {
				m.cursor--
			} else {
				m.cursor = len(m.items) - 1
			}
		case "down", "j":
			if m.cursor < len(m.items)-1 {
				m.cursor++
			} else {
				m.cursor = 0
			}
		case " ":
			m.selected[m.cursor] = !m.selected[m.cursor]
		case "a":
			allSelected := true
			for _, s := range m.selected {
				if !s {
					allSelected = false
					break
				}
			}
			for i := range m.selected {
				m.selected[i] = !allSelected
			}
		case "enter":
			m.done = true
			return m, tea.Quit
		case "ctrl+c", "q", "esc":
			m.aborted = true
			return m, tea.Quit
		}
	}
	return m, nil
}

func (m model) View() string {
	if m.done || m.aborted {
		return ""
	}

	var b strings.Builder
	b.WriteString(m.title + "\n\n")

	for i, item := range m.items {
		mark := "[ ]"
		if m.selected[i] {
			mark = "[x]"
		}

		line := fmt.Sprintf("  %s %s", mark, item)
		if i == m.cursor {
			line = cursorStyle.Render(line)
		} else if m.selected[i] {
			line = selectedStyle.Render(line)
		}
		b.WriteString(line + "\n")
	}

	b.WriteString("\n")
	b.WriteString(dimStyle.Render("  ↑/↓ move  space toggle  a all/none  enter confirm  q quit"))
	b.WriteString("\n")
	return b.String()
}

// MultiSelect presents an interactive multi-select list.
// Returns a bool slice indicating which items were selected, or an error if aborted.
func MultiSelect(title string, items []string, preselected []bool) ([]bool, error) {
	if len(items) == 0 {
		return nil, fmt.Errorf("no items to select")
	}

	selected := make([]bool, len(items))
	if preselected != nil {
		copy(selected, preselected)
	} else {
		for i := range selected {
			selected[i] = true
		}
	}

	m := model{
		title:    title,
		items:    items,
		selected: selected,
	}

	p := tea.NewProgram(m)
	result, err := p.Run()
	if err != nil {
		return nil, err
	}

	final := result.(model)
	if final.aborted {
		return nil, fmt.Errorf("aborted")
	}

	return final.selected, nil
}
