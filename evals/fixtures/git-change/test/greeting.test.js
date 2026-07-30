import assert from "node:assert/strict";
import test from "node:test";

import { greeting } from "../src/greeting.js";

test("welcomes a named person", () => {
  assert.equal(greeting("Ada"), "Welcome, Ada!");
});
