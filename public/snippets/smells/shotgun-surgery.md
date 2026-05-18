---
name: shotgun-surgery
description: Refuse Shotgun Surgery when a single conceptual edit forces the agent to identify, load, and modify many small sites — each one cheap individually but the search and completeness check is expensive. Apply Move Function, Move Field.
---

# Refuse: 08 — Shotgun Surgery

**Symptom:** A single conceptual edit forces the agent to identify, load, and modify many small sites — each one cheap individually but the search and completeness check is expensive.

**Goal:** All code that varies together sits in one place; the agent loads one module to make any change along this axis and verifies completeness in one read.

```js
// Smellier:
// Five files each have:
log(`event=${event}, user=${user}`);

// Fresher:
// One file:
function logEvent({ event, user }) {
  // one place to evolve
}
```

**Pressure:** Every change carries a risk of missing a site the agent didn't grep for; reviewers (human or agent) can't easily verify completeness without re-running the same search.

**Tradeoff:** Consolidation creates a new boundary the agent must respect; previously-independent sites now route through one module that can become a contention point for unrelated edits.

**Relief:** Change cost becomes proportional to the conceptual change; the agent reasons about one location instead of N scattered ones.

**Trap:** Pulling every superficially-related edit into one module creates a god-module the agent now must reason about as a tangle of unrelated concerns — the smell migrated, not vanished.

**Apply refactorings:** Move Function, Move Field, Combine Functions into Class, Combine Functions into Transform, Split Phase, Inline Function, Inline Class
