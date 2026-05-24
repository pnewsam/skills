---
name: functional-patterns
description: principles for writing JavaScript and TypeScript in a functional style. covers immutability, pure functions, array methods over imperative loops, composition over inheritance, and avoiding side effects. reference this skill when writing data transformations, reviewing imperative code, or deciding between mutable and immutable approaches.
---

# Functional Patterns

## Overview

This skill defines the principles for writing JavaScript and TypeScript in a functional style. The core philosophy: prefer data transformations over mutation, pure functions over side effects, and composition over imperative control flow.

These principles apply wherever TypeScript or JavaScript is written — React components, utility functions, data processing, API handlers. They are not a workflow; they inform how code is written and reviewed.

## Principles

### 1. Prefer immutable data

Do not mutate objects, arrays, or other data structures in place. Create new copies with the changes applied.

```ts
// Bad: mutates the original
function addItem(cart: Cart, item: Item) {
  cart.items.push(item);
  return cart;
}

// Good: returns a new object
function addItem(cart: Cart, item: Item): Cart {
  return { ...cart, items: [...cart.items, item] };
}
```

For nested updates, prefer spread or libraries like Immer when the nesting gets deep. Avoid manual deep cloning — target only the paths that need to change.

```ts
// Shallow spread for flat objects
const updated = { ...user, name: "new name" };

// Deeper updates with spread
const updated = {
  ...user,
  profile: { ...user.profile, avatar: newAvatar },
};

// Immer for anything deeper than 2 levels
const updated = produce(user, (draft) => {
  draft.preferences.notifications.email.digest = "weekly";
});
```

Const assertions (`as const`) and `readonly` modifiers make immutability explicit in the type system:

```ts
const COLORS = ["red", "green", "blue"] as const;
type Color = (typeof COLORS)[number];

interface Config {
  readonly apiKey: string;
  readonly endpoints: readonly string[];
}
```

### 2. Write pure functions

A pure function's output depends only on its inputs and it has no side effects. Given the same arguments, it always returns the same result.

```ts
// Bad: depends on mutable external state
let taxRate = 0.08;
function calculateTax(amount: number) {
  return amount * taxRate;
}

// Good: all dependencies are explicit parameters
function calculateTax(amount: number, taxRate: number) {
  return amount * taxRate;
}
```

Side effects are sometimes necessary (writing to a database, updating the DOM, logging). When a function must have side effects, make the boundary explicit:

- Keep the side-effecting function thin — do the pure computation separately
- Name side-effecting functions clearly: `saveUser`, `renderPage`, `logEvent`
- Push side effects to the edges of the system (handlers, entry points)

```ts
// Pure computation, easy to test
function buildEmailTemplate(user: User, invoice: Invoice): EmailTemplate {
  // ... pure data transformation
}

// Side-effecting function, thin wrapper
async function sendInvoiceEmail(user: User, invoice: Invoice): Promise<void> {
  const template = buildEmailTemplate(user, invoice);
  await emailService.send(template);
}
```

### 3. Use array methods over imperative loops

Prefer `map`, `filter`, `reduce`, `find`, `some`, `every`, and `flatMap` over `for` and `while` loops. Array methods describe intent — a reader sees `filter` and knows you're selecting a subset.

```ts
// Bad: imperative loop — reader must parse the loop body
const activeUsers: User[] = [];
for (const user of users) {
  if (user.status === "active") {
    activeUsers.push(user);
  }
}

// Good: declarative — intent is immediately visible
const activeUsers = users.filter((user) => user.status === "active");
```

Chain methods rather than assigning intermediate results:

```ts
// Bad: intermediate variables that only exist to feed the next step
const adults = users.filter((u) => u.age >= 18);
const adultNames = adults.map((u) => u.name);
const sortedAdultNames = adultNames.sort();

// Good: chained transformations, each step clear
const sortedAdultNames = users
  .filter((u) => u.age >= 18)
  .map((u) => u.name)
  .sort();
```

Avoid `reduce` when a more specific method exists:

```ts
// Avoid: reduce when filter+map says it clearer
const names = users.reduce((acc, u) => {
  if (u.isActive) acc.push(u.name);
  return acc;
}, [] as string[]);

// Prefer: the chain is self-documenting
const names = users.filter((u) => u.isActive).map((u) => u.name);
```

Use `reduce` when you genuinely need to accumulate from a sequence into a different shape (object, Map, Set, grouped structure).

### 4. Compose over inherit

Prefer function composition and module-level organization over class hierarchies.

```ts
// Bad: class with single-use methods and hidden state
class InvoiceFormatter {
  constructor(private invoice: Invoice) {}

  format(): string {
    return `${this.formatHeader()}\n${this.formatLineItems()}`;
  }

  private formatHeader(): string { /* ... */ }
  private formatLineItems(): string { /* ... */ }
}

// Good: exported functions composed together
export function formatInvoice(invoice: Invoice): string {
  return [formatHeader(invoice), formatLineItems(invoice)].join("\n");
}

export function formatHeader(invoice: Invoice): string { /* ... */ }
export function formatLineItems(invoice: Invoice): string { /* ... */ }
```

Classes are fine when you genuinely need encapsulated mutable state with a lifecycle (database connections, WebSocket managers, state machines). For everything else, prefer functions and modules.

### 5. Avoid void-returning mutations in transformation chains

When transforming data, return the result instead of mutating a parameter.

```ts
// Bad: mutates a passed-in object, returns void
function enrichInvoice(invoice: Invoice): void {
  invoice.total = invoice.items.reduce((sum, item) => sum + item.price, 0);
  invoice.status = invoice.total > 0 ? "active" : "empty";
}

// Good: takes data in, returns new data out
function enrichInvoice(invoice: Invoice): Invoice {
  const total = invoice.items.reduce((sum, item) => sum + item.price, 0);
  return { ...invoice, total, status: total > 0 ? "active" : "empty" };
}
```

### 6. Use ternaries and expressions over if/else statements for assignments

When the goal is to assign a value based on a condition, use an expression.

```ts
// Avoid: statement-based assignment
let status: string;
if (invoice.total > 0) {
  status = "active";
} else if (invoice.total === 0) {
  status = "empty";
} else {
  status = "credit";
}

// Prefer: expression-based assignment
const status =
  invoice.total > 0 ? "active"
  : invoice.total === 0 ? "empty"
  : "credit";
```

If the logic is too complex for a ternary, extract it into a named function rather than keeping the if/else inline:

```ts
function invoiceStatus(invoice: Invoice): string {
  if (invoice.total > 0) return "active";
  if (invoice.total === 0) return "empty";
  return "credit";
}

const status = invoiceStatus(invoice);
```

### 7. Prefer `Record`, `Map`, and plain objects over switch statements for lookups

When branching on a discrete value to return another value, use a lookup table.

```ts
// Bad: switch for simple value mapping
function getRoleLabel(role: string): string {
  switch (role) {
    case "admin": return "Administrator";
    case "editor": return "Content Editor";
    case "viewer": return "Read-only Viewer";
    default: return role;
  }
}

// Good: lookup table — data, not control flow
const ROLE_LABELS: Record<string, string> = {
  admin: "Administrator",
  editor: "Content Editor",
  viewer: "Read-only Viewer",
};

function getRoleLabel(role: string): string {
  return ROLE_LABELS[role] ?? role;
}
```

### 8. Guard against null/undefined early

Return early or throw at the top of a function when required values are missing. This keeps the main logic at the base indentation level.

```ts
// Bad: main logic nested inside a null check
function processOrder(order: Order | null): void {
  if (order) {
    validateOrder(order);
    chargeCustomer(order);
    sendConfirmation(order);
  }
}

// Good: guard clause removes the nesting
function processOrder(order: Order | null): void {
  if (!order) return;
  validateOrder(order);
  chargeCustomer(order);
  sendConfirmation(order);
}
```

### 9. Use optional chaining and nullish coalescing

```ts
// Avoid: verbose null checks
const city = user && user.address && user.address.city;
const name = userName !== null && userName !== undefined ? userName : "Anonymous";

// Prefer: built-in operators
const city = user?.address?.city;
const name = userName ?? "Anonymous";
```

Use `??` (nullish coalescing) over `||` when you only want to replace `null`/`undefined`, not all falsy values like `0`, `""`, or `false`.