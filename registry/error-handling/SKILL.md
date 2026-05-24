---
name: error-handling
description: principles for handling errors in JavaScript and TypeScript. covers error-as-values (Result types), typed errors, not using exceptions for control flow, error boundaries at system edges, and patterns for async error handling. reference this skill when designing error handling strategies, reviewing try/catch usage, or deciding how to model failure cases.
---

# Error Handling

## Overview

This skill defines the principles for handling errors in JavaScript and TypeScript. The core philosophy: treat errors as values, make failure cases explicit in the type system, and catch exceptions only at system boundaries.

## Principles

### 1. Errors are values, not exceptions

Represent expected failure cases as return values rather than throwing. The caller is forced to handle the failure because it's part of the return type.

```ts
// Bad: throwing for an expected failure — caller may forget to catch
function parseInvoice(input: unknown): Invoice {
  if (!isInvoice(input)) {
    throw new Error("Invalid invoice data");
  }
  return input;
}

// Good: return a discriminated result — caller must handle both cases
type Result<T, E = Error> =
  | { ok: true; value: T }
  | { ok: false; error: E };

function parseInvoice(input: unknown): Result<Invoice> {
  if (!isInvoice(input)) {
    return { ok: false, error: new Error("Invalid invoice data") };
  }
  return { ok: true, value: input };
}

// Caller is forced to handle the error case
const result = parseInvoice(rawData);
if (!result.ok) {
  // handle error — TypeScript narrows result.error
}
// result.value is safe to use
```

The `Result` pattern is appropriate for expected failure cases: validation, parsing, business rule violations, not-found conditions.

### 2. Throw only for truly exceptional situations

Reserve `throw` for unrecoverable programmer errors and invariant violations — situations where continuing execution is unsafe.

```ts
// Appropriate throw: invariant violation — this should never happen
function assertNever(value: never): never {
  throw new Error(`Unexpected value: ${value}`);
}

// Appropriate throw: programmer error caught early
function divide(a: number, b: number): number {
  if (b === 0) throw new Error("Division by zero — programmer error");
  return a / b;
}
```

A thrown exception signals "the program cannot reasonably continue from this point." If the caller has a reasonable recovery path, use a Result.

### 3. Catch at the boundary, not at every call site

Don't wrap every function call in try/catch. Place catch blocks at system boundaries where you can meaningfully respond.

```ts
// Good: try/catch at the boundary — express route handler
app.post("/api/invoices", async (req, res) => {
  try {
    const invoice = await createInvoice(req.body);
    res.status(201).json(invoice);
  } catch (error) {
    // Boundary: translate to HTTP response
    if (error instanceof ValidationError) {
      res.status(422).json({ error: error.message });
    } else {
      console.error("Unhandled error creating invoice:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  }
});
```

Internal functions should return Results or typed errors. Only the outermost layer (HTTP handler, event handler, CLI entry point) should have catch blocks.

### 4. Use typed errors, not strings

Error messages are for humans and logs. Error types are for programmatic handling.

```ts
// Bad: string-based — caller must parse the message
throw new Error("INVOICE_NOT_FOUND: inv_123");

// Good: typed errors — caller can check the type
class InvoiceNotFoundError extends Error {
  constructor(readonly invoiceId: string) {
    super(`Invoice ${invoiceId} not found`);
    this.name = "InvoiceNotFoundError";
  }
}

// In the boundary handler
if (error instanceof InvoiceNotFoundError) {
  res.status(404).json({ error: "Invoice not found", id: error.invoiceId });
}
```

For APIs or library code, consider discriminated error types in the Result pattern:

```ts
type ApiError =
  | { code: "NOT_FOUND"; entityId: string }
  | { code: "VALIDATION_ERROR"; fields: Record<string, string> }
  | { code: "UNAUTHORIZED" };

type ApiResult<T> = Result<T, ApiError>;
```

### 5. Don't swallow errors

Every catch block should either recover, translate, or re-throw. Never silently swallow.

```ts
// Bad: swallowed — the error disappears
try {
  await sendEmail(user);
} catch (e) {
  // nothing
}

// Bad: swallowed with a log — the caller doesn't know it failed
try {
  await sendEmail(user);
} catch (e) {
  console.error("Failed to send email", e);
}

// Good: the decision to ignore (or retry, or report) is explicit and named
async function trySendEmail(user: User): Promise<boolean> {
  try {
    await sendEmail(user);
    return true;
  } catch {
    return false;
  }
}
```

### 6. Avoid error-throwing in filter/map callbacks

Throwing inside array methods is surprising and hard to debug. Use Result types or filter first.

```ts
// Bad: throwing inside map — unexpected control flow
const parsed = items.map((item) => {
  try {
    return parseItem(item);
  } catch {
    return null;
  }
});

// Good: partition success and failure explicitly
const results = items.map((item) => tryParseItem(item));
const parsed = results.filter((r) => r.ok).map((r) => r.value);
const errors = results.filter((r) => !r.ok).map((r) => r.error);
```

### 7. Handle async errors explicitly

Unhandled promise rejections crash processes in modern Node.js. Every promise chain must have a rejection handler.

```ts
// Safe patterns for fire-and-forget async work:
void doSomething().catch((error) => {
  // Explicitly handle or log
  console.error("Background task failed:", error);
});
```

Prefer `await` with try/catch at the boundary over `.then().catch()` chains.

### 8. Fail fast at system boundaries

Validate inputs at the boundary and return errors immediately.

```ts
// Good: validate at the boundary, use validated types internally
async function createInvoice(input: unknown): Promise<Result<Invoice>> {
  // Validate and parse at the boundary
  const parsed = parseInvoiceInput(input);
  if (!parsed.ok) return parsed;

  // Internal functions can assume valid data
  const invoice = buildInvoice(parsed.value);
  await saveInvoice(invoice);

  return { ok: true, value: invoice };
}
```

This pattern (parse, don't validate) means internal functions work with known-valid types and don't need defensive checks.