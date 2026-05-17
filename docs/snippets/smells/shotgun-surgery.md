---
name: shotgun-surgery
description: Refuse Shotgun Surgery when a single conceptual edit forces the agent to identify, load, and modify many small sites — each one cheap individually but the search and completeness check is expensive. Apply Move Function, Move Field.
---

# Refuse: 08 — Shotgun Surgery

**Trigger (refuse when you see):** A single conceptual edit forces the agent to identify, load, and modify many small sites — each one cheap individually but the search and completeness check is expensive.

**Cost of leaving it in:** Every change carries a risk of missing a site the agent didn't grep for; reviewers (human or agent) can't easily verify completeness without re-running the same search.

**Target shape after refactoring:** All code that varies together sits in one place; the agent loads one module to make any change along this axis and verifies completeness in one read.

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

**Apply refactorings:** Move Function, Move Field, Combine Functions into Class, Combine Functions into Transform, Split Phase, Inline Function, Inline Class
