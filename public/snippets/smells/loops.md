---
name: loops
description: Refuse Loops when imperative for/while loops where filter, map, and reduce concerns are mixed by hand; the agent cannot tell what the loop is producing without mentally executing it. Apply Replace Loop with Pipeline.
---

# Refuse: 13 — Loops

**Symptom:** Imperative for/while loops where filter, map, and reduce concerns are mixed by hand; the agent cannot tell what the loop is producing without mentally executing it.

**Goal:** The transformation reads as a sequence of named operations; the agent recognizes the shape (filter, map, reduce) without simulating the loop.

```js
// Smellier:
const seniors = [];
for (const u of users) {
  if (u.age >= 65) seniors.push(u.name);
}

// Fresher:
const seniors = users
  .filter(u => u.age >= 65)
  .map(u => u.name);
```

**Pressure:** The agent must mentally execute the loop to learn its result; off-by-one and accumulator bugs hide in the body and only surface at test time.

**Tradeoff:** Pipeline form adds per-element call overhead and forces the agent to track intermediate collection types through the chain; for hot paths the runtime cost matters.

**Relief:** Intent jumps off the page; the agent reasons about each step independently and the type signatures at each pipeline stage document the transformation.

**Trap:** Forcing every loop into a pipeline — including ones with early-exit, side-effecting accumulators, or sequential dependencies — produces twisted .reduce() bodies the agent has to untangle to understand.

**Apply refactorings:** Replace Loop with Pipeline
