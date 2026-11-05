# MindsDB Cowork

Competitors and open-source peers for MindsHub Cowork, MindsDB's AI coworker app: an Electron and web React client over a local FastAPI sidecar (`mindsdb/cowork`, `mindsdb/cowork-server`). Product facts and repo paths checked 2026-11-04.

## Pick references by surface

| Cowork surface | Start with |
| --- | --- |
| Chat, tasks, and projects | Claude Cowork, ChatGPT, Eigent, LibreChat, LobeHub |
| Scheduled and background work | Claude Cowork scheduled tasks, goose scheduler, OpenClaw cron, LibreChat schedules, Open WebUI automations |
| Skills, plugins, and extensions | Claude Cowork plugins, goose recipes and MCP extensions, OpenClaw skills, Kortix skills and marketplace |
| Connectors and enterprise data, including Minds | Copilot Cowork, Onyx connectors and permission sync, Kortix connectors, AnythingLLM collectors |
| Artifacts and live apps | Claude artifacts, LibreChat artifacts |
| Permissions, sandboxing, and governance | Copilot Cowork (tenant-level), Eigent permission policy, Codex sandbox, Kortix sandboxes |
| Sharing and multiplayer | Perplexity Projects, Kortix CompanyOS, Open WebUI channels |
| Desktop shell and sidecar server | Eigent, goose, LobeHub desktop |
| Chat UI components | The component libraries in [coding agents](coding-agents.md#agent-ui-component-libraries) |
| Code Mode | [Coding agents](coding-agents.md) |

## Closed

- **Claude Cowork (Anthropic):** the closest competitor. A desktop agent for knowledge work, now also on web and mobile, with projects, scheduled tasks, plugins that bundle skills, connectors, commands, and sub-agents, computer use, and Dispatch for assigning work from a phone. Sources: anthropic.com/news, support.claude.com release notes, and the Claude apps.
- **Microsoft Copilot Cowork:** built on Anthropic's Cowork agent but runs inside the Microsoft 365 tenant with tenant-level governance. The reference for enterprise admin controls. Source: learn.microsoft.com/microsoft-365/copilot/release-notes.
- **ChatGPT (OpenAI):** agent mode, projects, connectors, and apps. OpenAI launched a separate Work mode in July 2026 and announced in November 2026 that it is folding it back into chat, so check the current state. Source: help.openai.com release notes.
- **Perplexity Computer and Projects:** a research-first agent that orchestrates sub-agents across models, with shared multiplayer projects. Source: perplexity.ai/hub/blog.
- **Manus:** long-running autonomous tasks on a cloud computer, plus a local desktop agent. Source: manus.im/blog.

## Open source

| Repo | Best for | UI | Engine |
| --- | --- | --- | --- |
| eigent-ai/eigent | Self-described open-source Cowork desktop: Electron shell over a Python multi-agent backend, like Cowork's sidecar | `src/components/`, `src/pages/`, `electron/main/` | `backend/app/agent/`, `backend/app/agent/toolkit/`, `backend/app/permission_policy/` |
| aaif-goose/goose (Rust, Electron UI) | Desktop agent with MCP extensions, shareable recipes, a scheduler, and ACP | `ui/desktop/src/components/` | `crates/goose/src/agents/`, `crates/goose/src/recipe/`, `crates/goose/src/scheduler/`, `crates/goose-mcp/src/` |
| openclaw/openclaw | Personal agent reachable from chat channels and devices: gateway, cron, skills, extensions | `ui/src/`, `apps/macos/` | `src/gateway/`, `src/agents/`, `src/channels/`, `src/cron/`, `skills/`, `extensions/` |
| kortix-ai/CompanyOS (formerly Suna) | Multiplayer company agents with connectors, skills, a marketplace, and sandboxes | `apps/web/src/` | `apps/api/src/connectors/`, `apps/api/src/skills/`, `apps/api/src/sandbox-proxy/` |
| lobehub/lobehub | Agent workspace with a desktop app and server-side workflows | `src/features/`, `apps/desktop/src/main/` | `packages/agent-runtime/`, `apps/server/src/workflows/` |
| LibreChat-AI/LibreChat | Multi-provider chat with agents, MCP, skills, artifacts, and schedules | `client/src/components/` (`Agents/`, `Artifacts/`, `MCP/`) | `api/server/services/` (`Agents/`, `MCP/`, `Skills/`, `Schedules/`, `Artifacts/`) |
| open-webui/open-webui (Svelte) | Self-hosted chat with knowledge, automations, channels, notes, and MCP | `src/lib/components/chat/`, `src/lib/components/automations/` | `backend/open_webui/routers/`, `backend/open_webui/retrieval/`, `backend/open_webui/utils/mcp/` |
| onyx-dot-app/onyx (Next.js, Python) | Enterprise connectors and permission-aware search and chat | `web/src/app/` | `backend/onyx/connectors/`, `backend/onyx/agents/`, `backend/onyx/chat/`, `backend/ee/onyx/external_permissions/` |
| Mintplex-Labs/anything-llm | Document workspaces, data connectors, and agents | `frontend/src/components/WorkspaceChat/` | `server/utils/agents/`, `collector/` |

## Protocols

- **MCP** is the common extension and connector protocol: goose, LibreChat, Open WebUI, Kortix, and Zed all speak it. Check how they configure, scope, and permission servers before designing a Cowork connector or extension surface.
- **ACP (Agent Client Protocol)** drives an agent from a separate UI: goose's `acp` module and OpenHands' ACP service use it, as do the coding agents noted in [coding agents](coding-agents.md). Check it before designing a bespoke agent-to-UI protocol.
