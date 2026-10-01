# Prior art for coding-agent UI

Paths were checked on 2026-10-01. Repos move code around, so confirm a path before you cite it.

## Primary references (closed source)

- **Claude Code desktop and web:** code.claude.com/docs (the desktop, web, and IDE pages have screenshots), `anthropics/claude-code` CHANGELOG.md, and anthropic.com/news.
- **Codex app (ChatGPT):** developers.openai.com/codex (app, cloud, and IDE pages), `openai/codex` CHANGELOG.md, and help.openai.com release notes. Only the Codex TUI is open source (`codex-rs/tui/src/`). `codex-rs/app-server` shows the event and approval shapes behind the app.
- **Cursor:** cursor.com/docs (agent, review, and diff pages) and cursor.com/changelog.

The user's screenshots of these products outrank anything you infer about them.

## Open source (React unless noted)

| Repo | Best for | Where the UI lives |
| --- | --- | --- |
| pingdotgg/t3code | Closest to Codex and Claude desktop: diff panel, approvals, branch toolbar | `apps/web/src/components/`, `apps/web/src/components/chat/` |
| anomalyco/opencode (SolidJS) | The most-used open agent GUI: tool rows, prompt dock, review tab | `packages/session-ui/src/components/`, `packages/app/src/pages/session/`, `packages/ui/src/components/` |
| OpenHands/OpenHands | Chat alongside terminal, browser, and diff panes | `src/components/features/chat/`, `src/components/features/diff-viewer/` |
| cline/cline | Tool-call and approval cards, task history | `apps/vscode/webview-ui/src/components/chat/` |
| continuedev/continue | Composer, @-mentions, accept and reject controls for diffs | `gui/src/components/mainInput/`, `gui/src/components/StepContainer/` |
| siteboon/claudecodeui | Web UI around Claude Code | `src/modules/chat/`, `src/modules/git-panel/` |
| vercel/ai-elements | shadcn-based AI SDK components: conversation, prompt input, tool, reasoning, plan, task, terminal, file tree, confirmation, checkpoint. Docs at elements.ai-sdk.dev. `vercel/chatbot` shows them composed in an app | `packages/elements/src/` |
| assistant-ui/assistant-ui | Headless thread, composer, message, and action-bar primitives, plus styled components such as approval cards, code diffs, agent plans, and tool rows. Docs at assistant-ui.com | `packages/react/src/primitives/` (headless), `packages/ui/src/components/react/assistant-ui/elements/` (styled) |
| zed-industries/zed (Rust/GPUI) | Native agent panel and diff UX; borrow the patterns, not the code | `crates/agent_ui/src/` |
