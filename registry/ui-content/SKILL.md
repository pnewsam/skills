---
name: ui-content
description: UX writing and microcopy patterns — button labels, empty state messaging, error message structure, helpful descriptions, and consistent terminology. Use when writing or reviewing any user-facing text in an interface. For confirmation and notification patterns, see ui-feedback.
---

# UI Content — UX Writing & Microcopy

A decision engine for writing clear, helpful, consistent text throughout the UI. Covers button labels, empty states, error messages, field descriptions, and terminology. For which feedback pattern to use (toast vs banner vs modal), see `ui-feedback`. For empty state layout and placement, see `ui-feedback`.

## Initial Response

When this skill is first invoked without a specific request, respond only with:

> I'm ready to help you with UI text — button labels, empty states, error messages, field help, or terminology. What text are you working on, and what's the context?

Do not provide any other information until the user asks a question or presents text to review.

---

## 1. Button Labels

Button labels are the most important microcopy in the UI — they're where the user commits to an action. Bad labels cause hesitation; good labels make the next step obvious.

### The Rule: Specific Verbs, Not Generic

| Bad | Good | Why |
| :--- | :--- | :--- |
| Submit | Create Invoice | Says what will happen |
| OK | Save Changes | Confirms the specific action |
| Yes / No | Delete Project / Keep Project | Eliminates ambiguity about what "Yes" means |
| Click Here | View Documentation | Describes the destination, not the interaction |
| Continue | Add Team Member | The user shouldn't have to guess what "Continue" does |
| Done | Complete Setup | Especially important in multi-step flows |

**Exception:** "OK" is acceptable only when:
- The context makes the action unambiguously clear (a native alert that says "Your changes have been saved" with an OK button)
- The alternative would be awkwardly verbose

### Button Label Patterns

| Context | Label Pattern | Examples |
| :--- | :--- | :--- |
| **Creation** | `Create [Entity]` | "Create Project", "Add Team Member", "New Invoice" |
| **Saving** | `Save [Entity]` or `Save Changes` | "Save Settings", "Save Changes" |
| **Deletion** | `Delete [Entity]` | "Delete Project", "Remove Member" |
| **Confirmation** | Same verb as the action that triggered it | If the button said "Delete", the confirm button says "Delete" too |
| **Navigation** | `View [Destination]` or the destination name | "View Invoice", "Go to Dashboard" |
| **Cancellation** | `Cancel` (standard) or `Keep [Entity]` (in delete confirmations) | "Cancel", "Keep Project" |
| **Next step (wizard)** | Describes the next step | "Add Team Members", "Review Summary" |

### Button Label Length

- **1-3 words.** If the label needs 4+ words, the action is too complex for a button. Consider a confirmation step.
- **Start with the verb.** "Create Project", not "Project Create." Users scan the first word to understand the action type.
- **Sentence case.** "Create project", not "Create Project" (for most modern UIs). Be consistent across all buttons.

### Primary vs Secondary in Labels

Primary and secondary buttons should use different label patterns to reinforce the hierarchy:

```
Primary: [Create Invoice]   ← Filled, colored, the recommended path
Secondary: [Save as Draft]  ← Outlined, the alternative path
```

The primary button label should describe the action most users want. The secondary label should describe the alternative. Don't make the user read both labels carefully to figure out which is primary.

---

## 2. Empty State Messaging

An empty state is a blank page waiting to be filled. The message should explain what goes here and how to get started. See `ui-feedback` for empty state layout, types, and placement.

### Empty State Formula

```
[Optional illustration]
Headline: What this view is for
Body: What the user can do here, in plain language
[CTA Button]
```

### Headline Patterns

| State | Headline Pattern | Example |
| :--- | :--- | :--- |
| **First run (no data yet)** | No [entities] yet | "No invoices yet" |
| **No search results** | No [entities] match [query] | "No invoices match 'refactor'" |
| **All complete** | Positive statement | "All caught up!" |
| **No access** | Honest explanation | "You don't have access to any projects yet" |

### Body Patterns

| State | Body Pattern | Example |
| :--- | :--- | :--- |
| **First run** | One sentence about what creating an entity enables | "Create your first invoice to start tracking payments and sending bills to clients." |
| **No search results** | Suggestion for next action | "Try broadening your search or clearing your filters." |
| **All complete** | Positive reinforcement | "You've completed every task. Nice work." |
| **No access** | What to do about it | "Ask your workspace admin to invite you to a project." |

### CTA Labels

The empty state CTA should be the exact action that populates the view:

| State | CTA Label |
| :--- | :--- |
| No invoices | "Create Invoice" |
| No team members | "Invite Members" |
| No projects | "New Project" |
| No search results | "Clear Filters" |

**Don't use:** "Get Started" (too vague — get started with what?), "Add New" (what kind of thing?), "Click Here" (describes the interaction, not the outcome).

---

## 3. Error Messages

An error message must answer three questions:
1. **What went wrong?** (in user terms, not technical terms)
2. **Why did it happen?** (if not obvious)
3. **How do I fix it?**

### Error Message Structure

```
Bad:
"Invalid input"
"Error 500"
"Something went wrong"

Good:
"Please enter a valid email address (e.g., name@example.com)."
"We couldn't save your changes. The server is temporarily unavailable. Try again in a moment."
"This project name is already taken. Try a different name."
```

### Field Validation Errors

| Error Type | Message Pattern | Example |
| :--- | :--- | :--- |
| **Required field** | [Field] is required | "Email address is required" |
| **Format error** | Enter a valid [format] | "Enter a valid email address (e.g., name@example.com)" |
| **Too short** | Must be at least [N] characters | "Password must be at least 8 characters" |
| **Too long** | Must be under [N] characters | "Project name must be under 100 characters" |
| **Already taken** | This [field] is already in use | "This email address is already registered" |
| **Mismatch** | [Fields] don't match | "Passwords don't match" |

### Server & System Errors

| Error Type | Message Pattern | Example |
| :--- | :--- | :--- |
| **Network failure** | Connection lost. [Action to take.] | "Connection lost. Check your internet and try again." |
| **Server error (500)** | We're having trouble. [Action.] | "We're having trouble saving your changes. Try again in a moment." |
| **Not found (404)** | This [entity] doesn't exist or was moved. | "This invoice doesn't exist. It may have been deleted." |
| **Permission denied** | You need [permission] to [action]. [Who to contact.] | "You need Admin access to change billing settings. Contact your workspace owner." |
| **Rate limited** | You've reached the limit. [When it resets.] | "You've used 98/100 API calls. Limit resets in 23 minutes." |
| **Timeout** | This is taking too long. [Action.] | "This report is taking longer than expected. Try narrowing the date range." |

### Error Message Principles

- **No blame.** "Please enter a valid email" is better than "You entered an invalid email."
- **No jargon.** "The server encountered an error" means nothing to most users. "We couldn't save your changes" is clear.
- **No dead ends.** Every error should offer a path forward: a retry button, a suggestion, a contact link.
- **Be specific, not dramatic.** "Something went wrong" is vague and alarming. "We couldn't load your invoices. Try refreshing the page." is specific and calm.

---

## 4. Field Descriptions & Help Text

Help text below or beside a field should explain what to enter, why it matters, or what the format is.

### When to Add Help Text

| Situation | Help Text Example |
| :--- | :--- |
| **Unusual format required** | "Use the format YYYY-MM-DD" |
| **Non-obvious requirement** | "Must be at least 8 characters and include a number" |
| **Consequence isn't obvious** | "This name will be visible to all workspace members" |
| **Input affects something elsewhere** | "Changing the slug will break existing links" |
| **Unfamiliar concept** | "A workspace contains your projects and team members" |

### When NOT to Add Help Text

- The field is self-explanatory ("Email", "Password", "Name")
- The placeholder already shows the format ("name@example.com")
- The label already explains everything the user needs to know

**Don't add help text "just to be safe."** Every piece of text on the page adds cognitive load. If the field doesn't need explanation, let it be quiet.

### Help Text Format

- **One line** if possible. Two lines if necessary. Never a paragraph.
- **No period** unless it's a full sentence (inconsistent across codebases — match the existing convention).
- **Muted, smaller text** (12-13px, secondary color).

---

## 5. Placeholder Text

Placeholder text in inputs should be used sparingly and strategically.

### Good Placeholders

- **Format example:** "name@example.com" in an email field
- **Sample input:** "e.g., Q3 Marketing Campaign" when the field name is clear but an example helps
- **Search hint:** "Search invoices..." in a search box (the only place "Search..." is acceptable)

### Bad Placeholders

- **Repeating the label:** If the label says "Email", the placeholder should not say "Email"
- **Instructions:** "Enter your password" — that's what the label is for
- **Critical information:** Placeholder text disappears when the user types. If the user needs the information while filling in the field, use help text below the field instead.

### Placeholder as Only Label

Never use placeholder text as the only label for an input. Placeholders disappear on focus, leaving the user with no indication of what the field is for. Always have a visible label.

---

## 6. Consistent Terminology

Pick a word for each concept and use it everywhere. Don't alternate between synonyms.

| Choose One | Avoid Alternating With |
| :--- | :--- |
| Project | Workspace, Space, Board |
| Team Member | User, Collaborator, Person |
| Delete | Remove, Erase, Destroy |
| Create | Add, New, Make |
| Settings | Preferences, Config, Options |
| Invoice | Bill, Statement, Receipt |

**Rules:**
- **Pick the most common, widely-understood term.** "Settings" over "Preferences" for most apps. "Delete" over "Remove."
- **Document terminology choices** in the project's design system or style guide so new contributors use the same words.
- **Audit for synonyms** periodically. Search the codebase for alternative terms and align them.

---

## 7. Confirmation & Destructive Action Text

When the user is about to do something irreversible, the confirmation text must be unambiguous.

### Modal Title

Describe the action, not the question:

```
Bad: "Are you sure?"
Good: "Delete Project"
```

### Modal Body

Explain the consequences clearly:

```
"Deleting 'API Migration' will permanently remove the project and all its invoices, team members, and settings. This cannot be undone."
```

**Include:**
- What will be deleted/affected (name the specific entity)
- What the cascading effects are (child entities that will also be deleted)
- Whether it can be undone

### Confirm Button

Use the same verb as the action:

```
If the user clicked "Delete Project", the confirm button says "Delete Project"
If the user clicked "Remove Member", the confirm button says "Remove Member"
```

Never use "OK" for destructive confirmation buttons.

### Cancel Button

Give it a specific label when the action is destructive:

```
[Delete Project]  [Keep Project]
```

"Keep Project" is clearer than "Cancel" because it tells the user what will happen (nothing).

---

## 8. Success & Confirmation Messages

After the user completes an action, confirm what happened.

### Success Toast Formula

```
[Action completed]. [Optional: what changed or what's next.]
```

| Action | Success Message |
| :--- | :--- |
| Created an invoice | "Invoice #1234 created." |
| Saved settings | "Settings saved." |
| Invited a member | "Invitation sent to name@example.com." |
| Deleted something | "Project deleted. [Undo]" (if undoable) |
| Copied to clipboard | "Copied to clipboard." |

**Keep success messages short.** The user should be able to read them in passing, not stop and study them. "Invoice created" is sufficient — don't add "Your invoice has been successfully created and is now available in your invoice list" (redundant, slows the user down).

---

## 9. Tone & Voice

### Default Tone: Clear, Helpful, Human

| Principle | Good | Avoid |
| :--- | :--- | :--- |
| **Be concise** | "No invoices yet." | "It looks like you haven't created any invoices in this workspace yet. Would you like to create one now?" |
| **Be helpful** | "Try broadening your search." | "Your search returned 0 results." |
| **Be human** | "We couldn't save your changes." | "Error: Request failed with status code 500." |
| **Be calm** | "This project name is already taken." | "DUPLICATE NAME DETECTED." |

### When to Be Playful

Playful microcopy is appropriate for:
- Consumer apps where personality is part of the brand
- Empty states and onboarding (low-stakes contexts)
- Celebration moments (completing a task, reaching a milestone)

Playful microcopy is NOT appropriate for:
- Error messages (the user is already frustrated)
- Financial or legal contexts
- Destructive actions (deletion, permission changes)
- Enterprise/admin tools (professional tone expected)

---

## Review Format (Required)

When reviewing UI text, you MUST use this structure:

1. **Current State Summary:** What text is present? What's the user's context (creating, editing, troubleshooting)?
2. **Finding → Recommendation Table:**

| # | Current | Issue | Recommendation | Why |
| :--- | :--- | :--- | :--- | :--- |
| 1 | "Submit" button on a create-invoice form | Generic label doesn't tell user what will happen | "Create Invoice" | Specific verbs reduce cognitive load and confirm intent |
| 2 | "Error: Invalid input" on email field | Doesn't explain what's wrong or how to fix it | "Please enter a valid email address (e.g., name@example.com)" | Error messages must explain what happened and how to fix it |
| 3 | Empty state says "No data" | No guidance on what the view is for or how to populate it | "No invoices yet · Create your first invoice to start tracking payments." | Empty states should provide both explanation and a clear next action |

3. **Ergonomic Rationale:** 2-4 sentences on the core UX writing principle driving these recommendations.