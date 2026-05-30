---
name: global-data
description: Refuse Global Data when a module-level variable mutated from anywhere — the agent reading any single call site cannot bound its impact without scanning every consumer. Apply Encapsulate Variable.
---

# Refuse: 05 — Global Data

**Announce first:** name this as Global Data and which refactoring you'll apply (Encapsulate Variable) before any edit. The user reads the announcement as your contract.

**Or decline first:** if you don't flag this as Global Data, name the decline type — catalog miss, taste call, cost-benefit, constraint-blocked, or insufficient context.

**Symptom:** A module-level variable mutated from anywhere — the agent reading any single call site cannot bound its impact without scanning every consumer.

**Goal:** All reads and writes go through a named function the agent can grep for, find every consumer of, and reason about as a closed surface.

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

**Pressure:** Behavior depends on hidden write-order between callers the agent must discover one at a time; tracing any bug requires reconstructing a global mutation timeline.

**Tradeoff:** Wrapping the global doesn't eliminate the coupling — every reader still depends on the same shared state, and the agent still has to model the timeline to reason about reads.

**Relief:** A single named function becomes the audit point; the agent can attach logging, validation, or cache logic in one place instead of chasing every consumer.

**Trap:** Wrapping globals without narrowing access creates a false safety signal — the agent assumes the wrapper guarantees something it doesn't, and silent leaks become harder to diagnose.

**Apply refactorings:** Encapsulate Variable
