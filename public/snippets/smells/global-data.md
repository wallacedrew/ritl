---
name: global-data
description: Refuse Global Data when a module-level variable mutated from anywhere — the agent reading any single call site cannot bound its impact without scanning every consumer. Apply Encapsulate Variable.
---

# Refuse: 05 — Global Data

**Trigger (refuse when you see):** A module-level variable mutated from anywhere — the agent reading any single call site cannot bound its impact without scanning every consumer.

**Cost of leaving it in:** Behavior depends on hidden write-order between callers the agent must discover one at a time; tracing any bug requires reconstructing a global mutation timeline.

**Target shape after refactoring:** All reads and writes go through a named function the agent can grep for, find every consumer of, and reason about as a closed surface.

```js
// Smellier:
let currentUser = null;
// ...some files later...
currentUser = newUser;

// Fresher:
function setCurrentUser(user) {
  currentUser = validate(user);
}
function getCurrentUser() {
  return currentUser;
}
```

**Apply refactorings:** Encapsulate Variable
