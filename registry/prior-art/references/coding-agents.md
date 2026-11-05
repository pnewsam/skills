# Coding agents

Claude Code, Codex, Cursor, and open-source peers, with UI and engine paths.

## Closed

- **Claude Code desktop and web:** code.claude.com/docs (the desktop, web, and IDE pages have screenshots), `anthropics/claude-code` CHANGELOG.md, and anthropic.com/news.
- **Codex app (ChatGPT):** developers.openai.com/codex (app, cloud, and IDE pages), `openai/codex` CHANGELOG.md, and help.openai.com release notes. The CLI and engine are open source; see the table.
- **Cursor:** cursor.com/docs (agent, review, and diff pages) and cursor.com/changelog.

## Open source

React unless noted. Engine paths are blank for UI-only projects. Paths checked 2026-11-04.

| Repo | Best for | UI | Engine |
| --- | --- | --- | --- |
| openai/codex (Rust) | The engine behind the closed Codex app: agent loop, sandboxing, and the event and approval protocol the app consumes | `codex-rs/tui/src/` | `codex-rs/core/src/`, `codex-rs/app-server/`, `codex-rs/app-server-protocol/src/`, `codex-rs/linux-sandbox/`, `codex-rs/exec/` (headless) |
| pingdotgg/t3code | Closest to Codex and Claude desktop: diff panel, approvals, branch toolbar; one UI over several agent providers | `apps/web/src/components/`, `apps/web/src/components/chat/` | `apps/server/src/`, `packages/provider-core/src/` and sibling `provider-*` packages, `packages/effect-acp/src/` |
| anomalyco/opencode (SolidJS) | The most-used open agent GUI: tool rows, prompt dock, review tab; client-server split | `packages/session-ui/src/components/`, `packages/app/src/composer/`, `packages/ui/src/components/` | `packages/core/src/`, `packages/server/src/`, `packages/protocol/src/` |
| OpenHands/OpenHands | Chat alongside terminal, browser, and diff panes; sandboxed remote runtime | `src/components/features/chat/`, `src/components/features/diff-viewer/` | Separate repo `OpenHands/software-agent-sdk` (Python): `openhands-sdk/`, `openhands-tools/`, `openhands-agent-server/`, `openhands-workspace/` |
| cline/cline | Tool-call and approval cards, task history | `apps/vscode/webview-ui/src/components/chat/` | `sdk/packages/core/`, `sdk/packages/agents/` |
| continuedev/continue | Composer, @-mentions, accept and reject controls for diffs; context providers | `gui/src/components/mainInput/`, `gui/src/components/StepContainer/` | `core/llm/`, `core/tools/`, `core/context/` |
| zed-industries/zed (Rust/GPUI) | Native agent panel and diff UX; hosts external agents over ACP; borrow the patterns, not the code | `crates/agent_ui/src/` | `crates/agent/src/`, `crates/acp_thread/src/`, `crates/agent_servers/src/`, `crates/context_server/src/` (MCP) |
| siteboon/claudecodeui | Web UI around Claude Code | `src/modules/chat/`, `src/modules/git-panel/` | |

ACP (Agent Client Protocol) recurs here: Zed's `acp_thread` and t3code's `effect-acp` use it to drive an agent from a separate UI. Check it before designing a bespoke agent-to-UI protocol.

## Agent UI component libraries

These apply to any agent chat surface, not only coding.

| Repo | Best for | UI |
| --- | --- | --- |
| vercel/ai-elements | shadcn-based AI SDK components: conversation, prompt input, tool, reasoning, plan, task, terminal, file tree, confirmation, checkpoint. Docs at elements.ai-sdk.dev; `vercel/chatbot` shows them composed in an app | `packages/elements/src/` |
| assistant-ui/assistant-ui | Headless thread, composer, message, and action-bar primitives, plus styled approval cards, code diffs, agent plans, and tool rows. Docs at assistant-ui.com | `packages/react/src/primitives/` (headless), `packages/ui/src/components/react/assistant-ui/elements/` (styled) |

## Secondary UI references

Use these for visual polish once the references above settle the structure. Never let them override the in-app pattern or that consensus.

- **Beautiful UI (beautifului.dev):** a gallery of copy-paste components for agent interfaces, built by the Turbo design studio. It covers loading and thinking states, streaming text, approval cards, tool chips, task rows, the prompt bar, diff tables, and code blocks. No source repo is linked, so cite the page and its rendered components.
