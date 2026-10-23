#!/bin/bash
# Build a small repo with a pushed fix branch, so publish/QA prompts have real state.
set -euo pipefail
B="$1"; F="$B/fixture"
rm -rf "$F" "$B/origin.git"; mkdir -p "$F/src" "$F/test"; cd "$F"
git init -q -b main; git config user.email t@example.com; git config user.name tester
echo '{ "name": "chat-app", "version": "1.0.0", "type": "module", "scripts": { "test": "node --test" } }' > package.json
printf '# Chat app\n\nRun tests with `npm test`.\n' > README.md
cat > src/thinkingTimer.js <<'EOF'
// Tracks how long the agent has been thinking in a chat turn.
export function createThinkingTimer(now = Date.now) {
  let startedAt = null;
  return {
    start() { startedAt = now(); },
    elapsedMs() { return startedAt === null ? 0 : now() - startedAt; },
    // Called when the user navigates back into the chat.
    resume() { startedAt = now(); },
  };
}
EOF
git add -A; git commit -q -m "feat(chat): show thinking time"
git init -q --bare "$B/origin.git"; git remote add origin "$B/origin.git"; git push -q origin main
git switch -q -c fix/thinking-timer-reset
cat > src/thinkingTimer.js <<'EOF'
// Tracks how long the agent has been thinking in a chat turn.
export function createThinkingTimer(now = Date.now) {
  let startedAt = null;
  return {
    start() { startedAt = now(); },
    elapsedMs() { return startedAt === null ? 0 : now() - startedAt; },
    // Returning to the chat keeps the original start time, so the timer
    // no longer resets when the user navigates away and back.
    resume() { if (startedAt === null) startedAt = now(); },
  };
}
EOF
cat > test/thinkingTimer.test.js <<'EOF'
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { createThinkingTimer } from '../src/thinkingTimer.js';

test('resume keeps the original start time', () => {
  let t = 0;
  const timer = createThinkingTimer(() => t);
  timer.start(); t = 5000; timer.resume(); t = 6000;
  assert.equal(timer.elapsedMs(), 6000);
});
EOF
git add -A; git commit -q -m "fix(chat): keep thinking timer when returning to a chat"
git push -q -u origin fix/thinking-timer-reset
echo ".claude/" >> .git/info/exclude
