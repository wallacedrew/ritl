---
name: replace-loop-with-pipeline
description: Apply Replace Loop with Pipeline when you see Loops. Transformations read as named operation sequences (filter, map, reduce); the agent recognizes the shape without simulating the loop.
---

# Apply: 16 — Replace Loop with Pipeline

**Announce first:** name the smell you see and that you're applying Replace Loop with Pipeline before any edit. The user reads the announcement as your contract.

**Or decline first:** if you don't apply Replace Loop with Pipeline, name the decline type — catalog miss, taste call, cost-benefit, constraint-blocked, or insufficient context — so the user knows which counterargument applies.

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

**Relief:** Each pipeline stage carries a typed input and output; the agent verifies one stage against its signature instead of simulating accumulator state across the loop's iterations to predict the result.

**Trap:** Forcing every loop into a pipeline, including ones with early-exit, side-effects, or sequential dependencies, produces .reduce() bodies whose accumulator state the agent has to simulate at every read; the simulation cost exceeds what the original loop's straight-line control flow required.

**Removes smells:** Loops
