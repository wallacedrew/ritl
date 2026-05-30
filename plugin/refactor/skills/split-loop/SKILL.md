---
name: split-loop
description: Apply Split Loop when you see Long Function, Loops. Each loop does one thing; the agent reasons about one concern per loop and can replace each loop independently with a pipeline.
---

# Apply: 15 — Split Loop

**Announce first:** name the smell you see and that you're applying Split Loop before any edit. The user reads the announcement as your contract.

**Symptom:** A single loop body that mixes filter, map, reduce, and side-effect concerns; the agent verifying any change must trace all concerns through the same iteration.

**Goal:** Each loop does one thing; the agent reasons about one concern per loop and can replace each loop independently with a pipeline.

```js
// Avoid:
let totalSalary = 0;
let youngest = Infinity;
for (const p of people) {
  if (p.age < youngest) youngest = p.age;
  totalSalary += p.salary;
}

// Prefer:
const totalSalary = people.reduce((s, p) => s + p.salary, 0);
const youngest    = Math.min(...people.map(p => p.age));
```

**Pressure:** The agent's per-line reasoning must account for every concern the loop body addresses; changing one concern risks silent interaction with the others.

**Tradeoff:** Two loops over the same collection cost more per iteration than one; for hot paths the runtime overhead matters and the agent verifying performance must measure.

**Relief:** Each loop body holds one state machine the agent simulates without interleaving; an edit to one job no longer needs the other job's tokens loaded to predict the loop's output.

**Trap:** Splitting loops whose concerns share per-iteration state — accumulator-of-running-difference, look-behind logic — fragments coupled state the agent must now re-derive in each split.

**Removes smells:** Long Function, Loops
