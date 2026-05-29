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

**Relief:** Each pipeline stage carries a typed input and output; the agent verifies one stage at a time against its signature instead of simulating the full loop body to predict the result.

**Trap:** Forcing every loop into a pipeline, including ones with early-exit, side-effecting accumulators, or sequential dependencies, produces .reduce() bodies whose accumulator state and per-iteration side effects the agent has to simulate at every read; the simulation cost exceeds what the original loop's straight-line control flow required.

**Apply refactorings:** Replace Loop with Pipeline
