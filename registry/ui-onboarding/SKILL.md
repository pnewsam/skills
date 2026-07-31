---
name: ui-onboarding
description: User onboarding and first-run experience patterns — progressive onboarding, empty states as onboarding opportunities, feature discovery without annoying power users, tooltip tours, and getting users to value quickly. Use when designing the first-run experience, adding onboarding flows, or improving user activation.
---

# UI Onboarding — First-Run Experience & Feature Discovery

A decision engine for designing the first-run experience — how users go from "never seen this before" to "getting value from this product." For empty state visual patterns and layout, see `ui-feedback`. For empty state messaging, see `ui-content`.

## 1. The Onboarding Philosophy

Onboarding is not a tour. It's not a checklist of features to explain. Onboarding is the shortest path from signup to the moment the user thinks "this is useful."

### Core Principles

1. **Get to value in the fewest possible steps.** Every step between the user and their first "aha" moment is a step where they might leave. Remove steps, don't add explanatory steps.

2. **Show, don't tell.** An empty state with a sample project that the user can explore is better than a 5-step tooltip tour explaining every button. Let the user discover by doing.

3. **Onboarding is progressive, not front-loaded.** Don't explain everything on day one. Reveal features as the user approaches the point where they'd be useful.

4. **Respect the power user.** Every onboarding pattern must be skippable. If a user knows what they're doing, let them do it without friction.

---

## 2. The Onboarding Spectrum

From lightest to heaviest:

| Pattern | When to Use | User Commitment |
| :--- | :--- | :--- |
| **Empty state as onboarding** | The product is simple and self-explanatory. The empty state explains what goes here and has a clear CTA. | Very low — the user is already in the product |
| **Sample/pre-filled data** | The product is easier to understand by seeing it working. Provide example data that the user can explore. | Low — the user learns by interacting with real UI |
| **Progressive prompts** | The product has features that aren't needed on day one. Show contextual prompts when the user reaches the relevant point. | Low-medium — prompts appear over time, not all at once |
| **Setup wizard** | The product requires configuration before it's useful (connecting integrations, importing data, configuring settings). | Medium — the user is committing to setup |
| **Guided tour / tooltips** | The product has a non-obvious interaction model that benefits from a brief walkthrough. | Medium — the user is committing to a tour |
| **Checklist** | The product has 3-7 setup tasks the user should complete to get full value. Tasks are concrete and completable. | Medium — the user works through items at their own pace |
| **Video / demo** | The product is complex and watching someone use it is the fastest way to understand. | High — the user is committing to watching content |

**Start with the lightest pattern that works.** Don't build a guided tour if an empty state with a good CTA would suffice.

---

## 3. Empty State as Onboarding

The first-run empty state is the most important onboarding surface. It's the first thing the user sees in a new, empty product.

### The Pattern

```
+------------------------------------------+
|                                          |
|            [Illustration]                |
|                                          |
|        No projects yet                   |
|  Create your first project to start      |
|  collaborating with your team.           |
|                                          |
|        [Create Project]                  |
|                                          |
+------------------------------------------+
```

**Components:**
1. **Illustration (optional):** Helps emotionally but isn't required. A clear headline and CTA do 90% of the work. If you include an illustration, it should be simple, on-brand, and not push the CTA below the fold.
2. **Headline:** "No [entities] yet." Tells the user what goes here.
3. **Body:** One sentence explaining what creating an entity enables. Not a paragraph. Not feature bullet points.
4. **CTA:** The exact action that populates the view. Primary button, prominent.

### What NOT to Do

- **Don't put feature explanations in the empty state.** The empty state is about getting the user to their first entity, not about explaining every feature. "No invoices yet. Invoices let you bill clients, track payments, and generate reports." — too much. Just "No invoices yet. Create your first invoice." — the features become obvious once there's data.
- **Don't use the empty state for marketing.** "Welcome to InvoicePro! The world's leading invoicing platform." — the user already signed up. They don't need to be sold again.
- **Don't leave the empty state blank or broken-looking.** An empty table with just column headers looks like an error. Always show the onboarding empty state.

---

## 4. Sample / Pre-Filled Data

For products where the value is easier to experience than to explain, pre-fill the user's account with sample data.

**Good for:** Project management tools (sample project with tasks), analytics tools (sample dashboard with data), design tools (sample file to explore), API tools (sample requests).

**Not good for:** Products where real data is immediately available (email client, calendar), financial/legal tools where sample data could be confused with real data, products where the setup IS the product (website builders).

### Sample Data Best Practices

- **Clearly label as sample data.** "Sample Project" or "Example Dashboard." The user should never wonder if this is real.
- **Make it representative.** Show the product's best features at work. A sample project with 2 tasks doesn't show what makes the product special.
- **Make it deletable.** One-click "Delete sample data" so the user can clear it and start fresh.
- **Make it explorable.** The sample data should demonstrate real workflows, not just exist as static decoration.

---

## 5. Setup Checklist

For products that require multiple setup steps, a checklist guides the user through them in a logical order.

```
+------------------------------------------+
| Get Started                       2 of 5 |
|                                          |
| ✓ Create your workspace                  |
| ✓ Invite your team                       |
| → Connect your GitHub account    [Do it] |
| ○ Import your first project              |
| ○ Set up billing                         |
+------------------------------------------+
```

### Checklist Rules

- **3-7 items.** Fewer than 3 isn't a checklist. More than 7 is overwhelming.
- **Ordered by dependency.** Items that unlock others go first. Items that can be done in any order are grouped lower.
- **Each item is one concrete action.** "Set up your profile" not "Configure your account settings and preferences."
- **Show progress.** "2 of 5 complete" with a progress bar.
- **Items are completable in one session.** "Invite 50 team members" is not a checklist item. "Invite your first teammate" is.
- **Allow skipping.** Some items may not apply. A skip or dismiss affordance should be available.
- **The checklist should be dismissible.** Once the user has completed the critical items or decided to skip, they should be able to close the checklist entirely.

---

## 6. Progressive Feature Discovery

Don't explain every feature at signup. Reveal features when the user is in a context where that feature would help.

### Contextual Prompts

| Trigger | Prompt | Example |
| :--- | :--- | :--- |
| **User creates their 5th entity** | "You've created 5 invoices. Want to set up recurring invoices to save time?" | User has demonstrated repeated use |
| **User visits a feature area for the first time** | A subtle badge or tooltip pointing out a time-saving feature | User is in the relevant context |
| **User performs an action manually 3+ times** | "You've been copying the same invoice format. Try templates." | The system recognizes a pattern the user might not |
| **A teammate performs an action** | "Jane just commented on your invoice. You can @mention teammates to notify them." | Social proof + contextual relevance |

### When NOT to Prompt

- **During the user's first session.** Let them explore. Prompts on day one feel like nagging.
- **When the user is in the middle of a flow.** Don't interrupt a form submission or a focused task.
- **For features the user demonstrably already uses.** "Did you know you can create invoices?" when they've created 50.
- **Too frequently.** If the user dismisses a prompt, don't show it again for that feature.

### Prompt Visual Treatment

Contextual prompts should be subtle — a dismissible banner, a badge on a menu item, or a one-line suggestion. They should NOT be modals that interrupt the user's flow. If the user ignores a prompt, the system should respect that.

---

## 7. Guided Tours & Tooltips

Use sparingly. Most guided tours are closed immediately.

### When a Tour Is Justified

- The interaction model is genuinely novel (a new paradigm, not standard CRUD)
- Without context, the user can't figure out what to do (but first ask: can the UI itself be clearer?)
- User testing shows that 30%+ of new users get stuck on the same step

### When a Tour Is NOT Justified

- The product follows standard patterns (sidebar + content, create button, settings page) — users know how to use it
- The tour is a substitute for unclear UI — fix the UI instead
- The tour has more than 4-5 steps — it's too long

### Tour Best Practices

- **3-5 steps maximum.** Each step highlights one thing.
- **Show, don't tell in tooltip text.** "This is where your invoices live" → "Create, view, and manage all your invoices here."
- **Highlight one element per step.** A subtle spotlight or outline around the element, not a full-screen overlay.
- **Show progress.** "Step 2 of 4" with dots or a progress bar.
- **Allow skip and dismiss.** "Skip tour" link always visible. "×" close button on every tooltip.
- **Don't auto-advance.** Let the user read at their own pace. A tooltip that disappears before the user finishes reading is infuriating.
- **Bring the user back after dismissal.** "You can restart this tour anytime from the Help menu."

---

## 8. The Activation Moment

Onboarding is complete when the user reaches the **activation moment** — the point where they've experienced enough value to come back.

This moment is different for every product:
- **Project management tool:** Created a project, invited a teammate, and completed a task
- **Email tool:** Sent or received their first email
- **Analytics tool:** Connected a data source and saw their first dashboard
- **API tool:** Made their first successful API call
- **Design tool:** Created and exported their first design

**Identify the activation moment for your product.** Everything in onboarding should lead the user toward it. Don't distract them with features, settings, or explanations that don't contribute to reaching it.

### Measuring Onboarding Effectiveness

If you can measure it, track:
- **% of signups who reach the activation moment** (activation rate)
- **Time from signup to activation moment** (time-to-value)
- **% who complete each onboarding step** (to find drop-off points)
- **% who dismiss the tour/checklist before completing** (to gauge annoyance)

---

## 9. Onboarding for Returning Users (Re-onboarding)

When a user returns after a long absence, or when a major new feature launches:

### Feature Announcements

- **Show once, then dismiss.** A small banner or badge: "New: Recurring Invoices." Don't show it again after the user sees it.
- **Contextual, not on login.** Announce the feature on the page where it lives, not on the dashboard. The user is more likely to act when they're in the right context.
- **Avoid "What's New" modals on login.** The user came to do something, not to read release notes. A subtle "What's new" link in the nav is sufficient.

### Re-activation After Inactivity

If the user hasn't logged in for 30+ days:
- Don't start the onboarding tour again. They're not new.
- Show a summary of what's changed since they last visited (if significant).
- Surface their existing data immediately — remind them why they used the product.

---

## 10. Common Onboarding Mistakes

| Mistake | Why It Happens | Fix |
| :--- | :--- | :--- |
| **The "wall of features" tour** | The team wants to show off everything they built | Cut to 3-5 steps that lead to the activation moment. Everything else can be discovered later. |
| **Unskippable onboarding** | Fear that users who skip won't understand the product | Always allow skip. A user who's forced through a tour resents the product. Trust that the UI is learnable. |
| **Onboarding as a substitute for clear UI** | The UI is confusing, so onboarding explains it | Fix the UI. Onboarding should introduce concepts, not compensate for poor design. |
| **Asking for too much too early** | "While you're setting up, pick your theme, set your notification preferences, and upload an avatar" | Only ask for what's strictly necessary for the activation moment. Settings and preferences can wait. |
| **No empty state** | Developer focused on the populated view; forgot about first-run | Always design the empty state. It's the first thing new users see. |
| **Onboarding that targets the team, not the user** | Tour explains admin features to a regular team member | Different roles need different onboarding. A team member who can't create projects doesn't need the "Create Project" tour. |

---

## Review Format (Required)

When reviewing onboarding, you MUST use this structure:

1. **Current State Summary:** What onboarding patterns are used? What's the activation moment? How many steps from signup to value?
2. **Finding → Recommendation Table:**

| # | Current | Issue | Recommendation | Why |
| :--- | :--- | :--- | :--- | :--- |
| 1 | 8-step guided tour on first login covering every feature | Users dismiss by step 3; the activation moment is step 7 | Cut to 3 steps leading to the first project creation; leave settings for progressive discovery | Tours with >5 steps have near-zero completion rates |
| 2 | Empty dashboard shows a blank white page with column headers | Looks broken; no guidance on what to do | Add a first-run empty state: "No projects yet · Create your first project to start collaborating · [Create Project]" | Empty states should guide, not confuse |
| 3 | Onboarding checklist with 12 items including "Set up SSO" and "Configure webhooks" | Items like SSO and webhooks are not relevant to the activation moment | Split into: required setup (3-4 items) + optional advanced setup (available later in Settings) | Checklists over 7 items are overwhelming; advanced config doesn't belong in onboarding |

3. **Ergonomic Rationale:** 2-4 sentences on the core onboarding principle driving these recommendations.
