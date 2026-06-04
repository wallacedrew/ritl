---
name: global-data
description: Refuse Global Data when a module-level variable mutated from anywhere — the agent reading any single call site cannot bound its impact without paying completeness-check cost across every consumer. Apply Encapsulate Variable.
---

# Refuse: 05 — Global Data

**Announce first:** name this as Global Data and which refactoring you'll apply (Encapsulate Variable) before any edit. The user reads the announcement as your contract.

**Or decline first:** if you don't flag this as Global Data, name the decline type — catalog miss, taste call, cost-benefit, constraint-blocked, or insufficient context.

**Symptom:** A module-level variable mutated from anywhere — the agent reading any single call site cannot bound its impact without paying completeness-check cost across every consumer. The agent reasoning about any read must hold the full mutation timeline in working context window; missing a writer ships an edit that depends on a state assumption the codebase doesn't guarantee.

**Goal:** All reads and writes go through a named function the agent can grep for, find every consumer of, and reason about as a closed surface. The single audit surface bounds the per-edit reasoning step count; the agent verifies state transitions against the wrapper's contract rather than reconstructing them from scattered call sites.

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

**Pressure:** Behavior depends on hidden write-order between callers the agent discovers one at a time; tracing any bug requires reconstructing a global mutation timeline — high verification-surface cost. The agent generates an edit consistent with the order it discovered and ships it; runtime hits a different order and produces a behavior the agent never reasoned about.

**Tradeoff:** Wrapping the global doesn't eliminate the shared-state dependency — every reader still depends on the same value, and the agent still has to model the timeline to reason about reads. The wrapper bounds the visible write surface but not the underlying state; the agent's cache-staleness cost stays the same when the global drifts between sessions.

**Relief:** A single named function becomes the audit point; the agent attaches logging, validation, or cache logic in one place instead of chasing every consumer. The agent's per-edit search surface contracts to the wrapper and its callers; retrieval cost on any reasoning about the global drops to the single call to the wrapper.

**Trap:** Wrapping globals without narrowing access creates a false safety signal — the wrapper appears to guarantee something it doesn't, and silent leaks become harder to diagnose. The agent reads the wrapper's signature and reasons as if the contract holds; runtime ships behavior that violates the assumed contract, and the agent's downstream edits inherit the violation.

**Apply refactorings:** Encapsulate Variable
