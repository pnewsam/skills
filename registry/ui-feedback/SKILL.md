---
name: ui-feedback
description: Select the right feedback pattern for system states. Decision frameworks for empty states, loading states (skeleton vs spinner vs optimistic UI), error handling and placement, toast vs banner vs modal alerts, and confirmation vs undo patterns.
---

# UI Feedback — States, Notifications & Errors

A decision engine for choosing the right feedback, state, and notification patterns. For data display patterns, see `ui-patterns`. For form containers and fields, see `ui-forms`. For action affordances, see `ui-actions`.

## Initial Response

When this skill is first invoked without a specific request, respond only with:

> I'm ready to help you select feedback patterns for empty, loading, error, and notification states. What's the system state you're designing for, and how critical is it to the user's current task?

Do not provide any other information until the user asks a question or presents a state to review.

---

## 1. Empty States

A well-designed empty state converts a dead-end into an onboarding opportunity.

### The Four Types of Empty States

| Type | When It Appears | Pattern |
| :--- | :--- | :--- |
| **First-run / Virgin** | User hasn't created any data yet. | Illustration + headline + CTA button + educational microcopy. "No projects yet. Create your first project to get started." [Create Project] |
| **No results** | User searched/filtered and got zero matches. | "No results" message + suggested action (clear filters, broaden search). "No issues match 'refactor'. Try clearing your filters." [Clear Filters] |
| **Error-caused** | Data should be there but can't load (network, permissions, server error). | Error message + retry action. **Distinguish this from "no data"** so users don't think their data was deleted. |
| **User-cleared** | User deleted/archived everything or completed all items. | Positive reinforcement or neutral confirmation. "All caught up! You've completed every task." |

### Empty State Principles

- **Never show a blank white void.** An empty table with only column headers signals brokenness, not emptiness. Show purposeful messaging.
- **The CTA in first-run states should be the exact action that populates this view.** "Create your first project" not "Get started" (too vague).
- **Illustrations help emotionally but aren't required.** A clear headline and CTA do 90% of the work.
- **Differentiate "no data exists" from "data failed to load."** Users panic if they think their data is gone.

---

## 2. Loading States

### Loading Pattern Selection

| Scenario | Pattern | Details |
| :--- | :--- | :--- |
| **Initial page load** (< 1s) | Nothing or subtle top-bar progress indicator. | Perceived as instant. |
| **Initial page load** (1–3s) | **Skeleton screen** (shape placeholders). | Reduces perceived wait time. Use muted, pulsing shapes matching the eventual layout. |
| **Initial page load** (> 3s) | Skeleton screen or branded loading state. If common, fix the backend — no loading state compensates for >3s waits. | |
| **Button-triggered action** (< 0.5s) | **Optimistic UI** — show the result immediately, roll back if server rejects. | Feels instant. Linear toggles issue status optimistically. |
| **Button-triggered action** (0.5–2s) | Button loading spinner + disable the button. | Prevents double-submission. |
| **Button-triggered action** (> 2s) | Loading spinner + progress indicator + allow cancellation. | Long operations need progress visibility and an escape hatch. |
| **Incremental / lazy loading** | "Load more" button or infinite scroll with skeleton items below. | See `ui-patterns` for pagination vs. infinite scroll decision. |
| **Filtering / sorting in-memory data** | Instant. No loading state. | If it's not instant, it should be — debounce or virtualize. |

### Skeleton vs. Spinner

- **Skeleton screens** are for **page-level** or **section-level** initial loads. They show where content will appear, reducing the jarring "pop-in" effect.
- **Spinners** are for **isolated, small** loading zones: a button, a single card, a dropdown fetching options.
- **Never** put a full-page spinner over a blank white page. It's the worst of both worlds — no spatial preview and no sense of progress.

### Optimistic UI

- **Use when** the success rate is very high (>99%) and the consequence of being wrong is low (a brief flash that self-corrects).
- **Don't use when** the consequence of wrongness is high (financial transactions, destructive actions, permission changes).
- Always handle the error case: if the server rejects the optimistic update, revert the UI and show an error toast.

---

## 3. Feedback & Notifications

How loudly to communicate with the user.

| Urgency | Pattern | Behavior | Example |
| :--- | :--- | :--- | :--- |
| **Transient, low-stakes** | **Toast** | Corner, auto-dismisses 3–5s, doesn't block. | "File saved", "Invitation sent", "Copied to clipboard" |
| **Persistent, contextual** | **Inline Alert / Banner** | Embedded in page. Stays until dismissed or condition resolves. | "Your trial ends in 2 days", "Connection lost — reconnecting..." |
| **Critical, blocking** | **Modal Alert** | Interrupts all interaction until acknowledged. | "Permanently delete this database?" |
| **Ambient, passive** | **Badge / Dot** | Numeric count or colored dot on an icon or tab. | Unread message count, new feature indicator. |
| **Real-time, streaming** | **Live region / Activity feed** | Updates in-place as events occur. | Live deployment logs, WebSocket event streams. |

### Toast Best Practices

- **Maximum 1 toast visible at a time.** Stacking toasts creates a backlog the user feels pressured to clear. Queue them.
- **Include an action when appropriate.** "Item deleted. [Undo]" is a toast. A separate toast saying "Click here to undo" is a mess.
- **Don't use toasts for errors that block the user's current task.** A failed form submission should show validation errors inline, not in a corner toast.
- **Position consistently:** Bottom-right on desktop, bottom-center on mobile (within thumb reach).

### Banner / Inline Alert Best Practices

- **Use for state that persists.** "Your trial ends in 2 days" isn't transient — the user needs to see it until they act.
- **Banners push content down** rather than overlaying it. This is intentional — the banner is part of the page state, not a transient overlay.
- **Provide a clear action** (e.g., "Upgrade plan") and a dismiss affordance for non-critical banners.

---

## 4. Confirmation & Undo Patterns

### The Confirmation Escalation Ladder

| Action Severity | Pattern | Example |
| :--- | :--- | :--- |
| **Low — easily reversible, minor impact** | **Undo pattern** (no confirmation). Execute immediately, show undo toast for 5–10s. | Archiving an email, removing a label, moving a task column. |
| **Medium — annoying to reverse, moderate impact** | **Inline confirmation** (lightweight popover or expand-in-place). | Deleting a comment, removing a team member, changing a plan tier. |
| **High — hard/impossible to reverse, significant impact** | **Modal confirmation** with explicit action phrasing. Typed confirmation for most severe cases. | Deleting a project, closing an account, transferring ownership. |

### Undo Pattern (Preferred Over Confirmation for Reversible Actions)

- Execute the action immediately.
- Show a non-blocking toast: "Item archived. [Undo]" (5–10 second duration).
- If the user clicks Undo, reverse and confirm: "Item restored."
- **This is strictly superior to confirmation dialogs for reversible actions** — it saves a click in the common case and provides a safety net for mistakes.
- Pioneered by Gmail; now standard in Linear, Notion, and most modern productivity tools.

### When a Confirmation Modal IS Warranted

- The action is **irreversible** or nearly so (permanent deletion, account closure).
- The action has **cascading side effects** (deleting a parent deletes all children).
- The action involves a **financial or legal consequence** (refund, contract acceptance).
- The action is **extremely infrequent** — the confirmation adds meaningful friction to a rarely-used, high-stakes path.

### Confirmation Modal Best Practices

- **Use specific verbs, not "OK" / "Cancel."** "Delete project" / "Keep project" is clearer.
- **For truly catastrophic actions**, require the user to type the entity name to confirm (GitHub's "delete repository" pattern). Use sparingly.
- **Never** use a confirmation dialog for an action the user performs dozens of times per day.

---

## 5. Error Handling & Error States

Where and how errors appear shapes user confidence in the system.

### Form Validation Errors

| Timing | Pattern | Use Case |
| :--- | :--- | :--- |
| **On blur** | Validate when the user leaves the field. Error below the field. | Most form fields. Immediate but not interruptive. |
| **On submit** | Validate all fields on submit. Show all errors at once, scroll to first. | Long forms where per-field validation could feel like nagging. |
| **On keystroke** (real-time) | Validate as user types, but show errors only after first blur or debounce. | Password strength meters, username availability. Show success states too. |

### Error Message Best Practices

- **Say what happened, why, and how to fix it.** "Invalid email" is lazy. "Please enter a valid email address (e.g., name@example.com)" is helpful.
- **Place the error directly adjacent to the problem field**, not in a toast or top-of-page banner.
- **For server errors (500s, timeouts),** show a persistent inline message near the affected content. Don't use a toast that disappears while the problem persists.
- **Differentiate client errors from server errors.** "That username is taken" (client → inline) vs. "We're having trouble. Try again." (server → banner or inline retry).

### Error Recovery Patterns

| Error Type | Recovery Pattern |
| :--- | :--- |
| **Network failure** | Retry button + "Check your connection" message. Auto-retry with exponential backoff for background operations. |
| **Validation error** | Inline field errors. Scroll to first error on submit. Preserve all user input. |
| **Permission error** | Explain what permission is needed + who to contact. "You need Admin access to change billing. Contact your workspace owner." |
| **Not found (404)** | Clear messaging that the resource doesn't exist or was moved. Offer navigation back to safety. |
| **Rate limit / quota** | Show the limit, current usage, and when it resets. "You've used 98/100 API calls. Resets in 23 minutes." |

---

## Review Format (Required)

When reviewing feedback and state patterns, use this structure:

1. **Current State Summary:** What state is shown? What's the user's expectation vs. reality?
2. **Finding → Recommendation Table:**

| # | Current | Issue | Recommendation | Why |
| :--- | :--- | :--- | :--- | :--- |
| 1 | Blank white page on first visit | Looks broken, no guidance | First-run empty state with illustration + CTA | Converts dead-end into onboarding |
| 2 | "Are you sure?" modal on archive action | Unnecessary friction for reversible action | Undo toast pattern | Saves a click; undo provides safety net |
| 3 | Validation errors in a toast | User must look away to find the error | Inline errors below each field | Error adjacent to cause = faster correction |

3. **Ergonomic Rationale:** 2–4 sentences on the core UX principle.