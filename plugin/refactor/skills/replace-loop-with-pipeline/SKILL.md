---
name: replace-loop-with-pipeline
description: Apply Replace Loop with Pipeline when you see Loops. Transformations read as named operation sequences (filter, map, reduce); the agent recognizes the shape without simulating the loop.
---

# Apply: 16 — Replace Loop with Pipeline

**Symptom:** Imperative for/while loops where the agent must mentally execute the body to learn the result; the loop's purpose isn't readable from its shape.

**Goal:** Transformations read as named operation sequences (filter, map, reduce); the agent recognizes the shape without simulating the loop.

```js
// Avoid:
const seniors = [];
for (const u of users) {
  if (u.age >= 65) seniors.push(u.name);
}

// Prefer:
const seniors = users
  .filter(u => u.age >= 65)
  .map(u => u.name);
```

**Pressure:** The agent must trace the loop body step by step to verify behavior; off-by-one bugs hide where the agent's mental simulation diverges from runtime.

**Tradeoff:** Pipeline form adds per-element call overhead and forces the agent to track intermediate collection types through the chain; for hot paths the runtime cost matters.

**Relief:** Intent is readable; the agent reasons about each pipeline stage independently with type signatures documenting the transformation.

**Trap:** Forcing every loop into a pipeline — including ones with early-exit, side-effects, or sequential dependencies — produces twisted .reduce() bodies the agent has to untangle to understand.

**Removes smells:** Loops
