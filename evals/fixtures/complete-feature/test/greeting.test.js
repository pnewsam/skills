import assert from "node:assert/strict";
import test from "node:test";

import { greeting } from "../src/greeting.js";

test("greets a named person", () => {
  assert.equal(greeting("Ada"), "Hello, Ada!");
});

test("supports an enthusiastic greeting", () => {
  assert.equal(greeting("Ada", { enthusiastic: true }), "Hello, Ada!!");
});
