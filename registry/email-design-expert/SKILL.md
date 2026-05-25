---
name: email-design-expert
description: Design polished, premium HTML emails with strong aesthetics and real email-client constraints. Use before creating, redesigning, or critiquing transactional emails, analytics digests, product updates, reports, lifecycle emails, or any email template where visual quality, hierarchy, copy, and deliverability all matter. Combines aesthetic references from strong email galleries with practical email-safe implementation guidance.
---

# Email Design Expert

## Use This Skill When

- Designing or redesigning HTML email templates.
- A user says an email feels unprofessional, generic, cluttered, or not aesthetically refined.
- Improving transactional emails, analytics digests, weekly reports, receipts, confirmations, notifications, or lifecycle emails.
- Translating web-app design quality into inbox-safe email.
- Choosing references before applying `design-crit`, `design-polish`, `redesign-component`, or `design-fix` to an email.

## Core Principle

Great product emails are not web pages in miniature. They are restrained, high-signal notes: one clear message, one clear action, carefully paced evidence, and enough brand texture to feel intentional without fighting email-client limits.

## Aesthetic Reference Set

Use these as taste calibration, not templates to copy directly.

### Curated Galleries

- Really Good Emails digest examples: `https://www.reallygoodemails.com/categories/email-digest`
- Email Love transactional gallery: `https://emaillove.com/inspiration/transactional`
- Email Love article, transactional emails that do not feel transactional: `https://emaillove.com/transactional-emails-that-dont-feel-transactional`

### Useful Archetypes

- **Redfin / calm confirmation**: narrow centered panel, strong whitespace, clear label-value structure, one obvious action, restrained color.
- **Stripe / receipt-report**: crisp transactional data, compact tables, low-drama hierarchy, precise spacing.
- **LinkedIn stat notification**: one metric or event as the hook, then concise context and CTA.
- **Airbnb / editorial digest**: lead story first, supporting sections after; warm but controlled pacing.
- **InVision / curated digest**: clean section rhythm and scannable modules.
- **Aesop / Merit / Nike / Ritual examples on Email Love**: premium restraint, quiet palettes, considered typography, fewer boxes.

For analytics emails, combine the archetypes:

1. LinkedIn-style metric hook.
2. Stripe-style evidence tables.
3. Redfin-style transactional clarity.
4. Airbnb/InVision-style digest pacing.
5. Aesop/Merit-style restraint.

## Analytics Email Content Model

Do not copy lifestyle or ecommerce structures blindly. Analytics emails should answer:

1. **What happened?** One clear headline.
2. **Why does it matter?** One human sentence.
3. **What drove it?** Top pages, sources, geography, trends.
4. **What should I inspect next?** One CTA to the dashboard/report.

If a module does not help answer one of those questions, remove it or move it lower.

## Design Rules

### First Viewport

- Lead with the user-specific signal, not the email type.
- Make the cadence/report type a small eyebrow or metadata label.
- Keep the date range in metadata, not repeated in the main summary sentence.
- Put one CTA near the top after the core message.
- Avoid more than one heavy bordered region before the first CTA.

### Typography

- Custom fonts are progressive enhancement only. Use robust stacks.
- Polish comes mostly from scale, weight, line height, and selective emphasis.
- Avoid long bold paragraphs.
- Use bold for labels, key metrics, or short hooks; use regular/medium for explanatory text.
- Prefer tighter heading line height and comfortable body line height.
- Keep uppercase labels small, quiet, and letter-spaced modestly.

### Layout

- Favor one clean centered column.
- Use generous whitespace, but keep information density appropriate for email.
- Avoid nested cards. Use cards sparingly for repeated metric cells or clear framed modules.
- Prefer tables and inline styles for layout.
- Do not rely on CSS grid, JavaScript, interactive widgets, or fragile web layout primitives.

### Color

- Use mostly neutral surfaces with one brand accent.
- Avoid default browser link blue unless it is the brand color.
- Style links intentionally.
- Keep borders very light; repeated dark borders make emails feel like admin UI.
- Design for dark-mode resilience, but do not depend on dark-mode media queries.

### Data Visualization

- Treat SVG, canvas, and remote chart images as risky unless tested in target clients.
- For critical meaning, use text plus email-safe table/div visuals.
- A chart should have a textual takeaway immediately nearby.
- Keep charts simple: bars, ranked lists, sparklines made from tables/divs.

### CTA

- Use one primary CTA.
- Make it visible in the first viewport when the email asks the user to inspect something.
- Keep button copy concrete: "View dashboard", "Open report", "Review traffic".
- Use email-safe button markup and adequate tap target height.

## Workflow

1. **Choose an archetype**
   - Pick 1-2 aesthetic references from the list above.
   - State which traits you are borrowing and which you are not.

2. **Define the first viewport**
   - Write the headline, metadata, why-it-matters sentence, and CTA before touching layout.
   - Check that the first viewport answers "what happened?" and "what should I do?"

3. **Map modules to the content model**
   - Keep only modules that answer what happened, why it matters, what drove it, or what to inspect next.
   - Order modules from highest signal to lowest detail.

4. **Apply email-safe visual design**
   - One centered column.
   - Minimal borders.
   - Inline styles.
   - Table-safe charts and rows.
   - Brand links/buttons.

5. **Polish against references**
   - Compare density, type weight, whitespace, borders, and CTA prominence against the chosen references.
   - If it still feels like a dashboard, reduce boxes and shorten copy.

6. **Validate**
   - Render representative fixtures.
   - Check plain text.
   - Test Gmail, Apple Mail, Outlook, mobile width, and dark mode when the change is visually meaningful.

## Common Failure Modes

- **Dashboard in an inbox**: too many cards, too many metrics, too little editorial hierarchy.
- **Generic report prose**: long sentences with date ranges and all metrics packed into one paragraph.
- **Overdecorated template**: gradients, heavy borders, large rounded cards, or too many accent colors.
- **False custom-font confidence**: relying on a font that Gmail/Outlook may strip.
- **Invisible chart**: SVG or unsupported visual disappears in real inboxes.
- **Blue-link takeover**: default link styling becomes the strongest visual element.

## Pairing With Other Skills

- Use `design-crit` after this skill for structural critique.
- Use `design-polish` after this skill for spacing, color, typography, and component finish.
- Use `plan-design-fixes` when critique/polish findings are numerous.
- Use `redesign-component` for top-section or module-level rework.
- Use `design-fix` only for mechanical token/value fixes.
