---
name: typescript-types
description: principles for using the TypeScript type system effectively. covers avoiding `any`, discriminated unions, type narrowing, `satisfies`, branded types, const assertions, `as` vs type declarations, and deriving types from values. reference this skill when writing type definitions, reviewing type usage, or deciding how to model data variants.
---

# TypeScript Types

## Overview

This skill defines the principles for using TypeScript's type system to catch errors at compile time and make code self-documenting. The core philosophy: model data precisely so invalid states are unrepresentable, and let the compiler verify correctness rather than relying on runtime checks.

## Principles

### 1. No `any` — use `unknown` instead

`any` disables type checking. `unknown` forces you to narrow the type before using the value.

```ts
// Bad: any bypasses all type checking
function parseJSON(json: string): any {
  return JSON.parse(json);
}
const data = parseJSON(input);
data.user.name.toUpperCase(); // crashes at runtime, no compile error

// Good: unknown forces validation
function parseJSON(json: string): unknown {
  return JSON.parse(json);
}
const data = parseJSON(input);
// TypeScript error: Object is of type 'unknown'
// data.user.name.toUpperCase();

// Must validate first
if (isUserData(data)) {
  data.user.name.toUpperCase(); // safe
}
```

If you must use `as any` as an escape hatch (e.g., working around a third-party type bug), add a comment explaining why, and scope it as narrowly as possible.

### 2. Use discriminated unions for variant data

When data can be one of several shapes, use a literal `type` or `kind` field so TypeScript can narrow automatically.

```ts
// Bad: optional fields — valid states include impossible combinations
interface ApiResponse {
  data?: User[];
  error?: string;
}

// Good: discriminated union — only valid states exist
type ApiResponse =
  | { status: "ok"; data: User[] }
  | { status: "error"; error: string }
  | { status: "loading" };

function handleResponse(response: ApiResponse) {
  switch (response.status) {
    case "ok":
      // response.data is known to exist, response.error is known absent
      return response.data;
    case "error":
      // response.error is known to exist
      throw new Error(response.error);
    case "loading":
      return null;
  }
}
```

This pattern eliminates entire categories of bugs: you can never access `.data` when the response is an error, because the type system prevents it.

### 3. Narrow types explicitly, don't cast

Use type guards to narrow from a broader type to a specific one. Avoid `as` casts that lie to the compiler.

```ts
// Bad: casting bypasses verification
function getArea(shape: Shape): number {
  return (shape as Circle).radius ** 2 * Math.PI;
}

// Good: narrowing verifies the type at runtime
function getArea(shape: Shape): number {
  if (shape.kind === "circle") {
    return shape.radius ** 2 * Math.PI;
  }
  if (shape.kind === "rectangle") {
    return shape.width * shape.height;
  }
  // TypeScript enforces exhaustiveness
  const _exhaustive: never = shape;
  throw new Error(`Unknown shape: ${_exhaustive}`);
}
```

Write custom type guards for complex narrowing:

```ts
function isUser(obj: unknown): obj is User {
  return (
    typeof obj === "object" &&
    obj !== null &&
    "id" in obj &&
    "email" in obj
  );
}
```

### 4. Derive types from values, don't duplicate

When a type mirrors a runtime value, derive the type from the value so they stay in sync.

```ts
// Bad: duplicated — the array and type can drift apart
const ROLES = ["admin", "editor", "viewer"];
type Role = "admin" | "editor" | "viewer";

// Good: derived — removing from the array removes from the type
const ROLES = ["admin", "editor", "viewer"] as const;
type Role = (typeof ROLES)[number];
```

This applies to config objects, lookup tables, and any constant where the type mirrors a value:

```ts
const STATUS_MAP = {
  draft: { label: "Draft", color: "gray" },
  published: { label: "Published", color: "green" },
  archived: { label: "Archived", color: "red" },
} as const;

type Status = keyof typeof STATUS_MAP;
type StatusConfig = (typeof STATUS_MAP)[Status];
```

### 5. Use `satisfies` for validation without widening

`satisfies` checks that a value matches a type without changing its inferred type. Use it when you want validation but still need the narrower inferred type.

```ts
// Without satisfies: type is widened to Record<string, RouteConfig>
const routes = {
  home: { path: "/", component: HomePage },
  user: { path: "/user/:id", component: UserPage },
} satisfies Record<string, { path: string; component: ComponentType }>;

// routes.home.path is still "/" (literal), not string
// routes.user.path is still "/user/:id" (literal), not string
```

Use `satisfies` over a type annotation when the inferred type is more precise and you don't want to lose that precision.

### 6. Prefer type annotation on the thing being assigned, not `as` on the value

```ts
// Bad: as cast — can hide missing properties
const user = {
  name: "Alice",
  email: "alice@example.com",
} as User;

// Good: type annotation — compiler checks completeness
const user: User = {
  name: "Alice",
  email: "alice@example.com",
};
```

`as` is appropriate for:
- Narrowing within a type guard you've already verified: `(event.target as HTMLInputElement).value`
- Working around known third-party type inaccuracies (with a comment)
- Asserting non-null after a check: `container!` (sparingly)

### 7. Use template literal types for string patterns

```ts
// Model precise string formats instead of using `string`
type EventName = `user.${"created" | "updated" | "deleted"}`;
// "user.created" | "user.updated" | "user.deleted"

type RouteParam = `:${string}`;
type ApiPath = `/api/${string}`;
```

### 8. Model empty and error states explicitly

Don't use `null` or `undefined` to mean "error" or "empty" when those are distinct states.

```ts
// Bad: null means both "no data yet" and "error"
const [data, setData] = useState<User | null>(null);

// Good: discriminated state
type AsyncState<T> =
  | { status: "idle" }
  | { status: "loading" }
  | { status: "error"; error: Error }
  | { status: "ok"; data: T };
```

### 9. Use `readonly` aggressively in interfaces

Mark properties `readonly` by default. Only make them mutable when mutation is required.

```ts
interface User {
  readonly id: string;
  readonly email: string;
  name: string; // only this may change
}
```

Use `Readonly<T>`, `ReadonlyArray<T>`, and `readonly` tuples to signal immutability intentions through the type system.

### 10. Prefer `interface` for public APIs, `type` for unions and composition

```ts
// Interface: best for object shapes that may be extended
interface User {
  id: string;
  email: string;
}

// Type: best for unions, intersections, and mapped types
type ApiResponse<T> =
  | { status: "ok"; data: T }
  | { status: "error"; error: string };

// Type for composing from other types
type UserWithSession = User & { session: Session };
```

The practical difference is small in modern TypeScript. The convention matters for consistency:
- `interface` signals "this is an object shape, possibly extendable"
- `type` signals "this is a type expression — union, intersection, alias"