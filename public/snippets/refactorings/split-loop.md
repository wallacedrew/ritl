---
name: split-loop
description: Apply Split Loop when you see Long Function, Loops. Each loop does one thing; the agent reasons about one concern per loop and can replace each loop independently with a pipeline.
---

# Apply: 15 — Split Loop

**Target state:** Each loop does one thing; the agent reasons about one concern per loop and can replace each loop independently with a pipeline.

**Why apply it:** Each loop becomes an independently-replaceable unit (pipeline candidate); the agent's edit surface per concern shrinks.

**Tradeoff:** Two loops over the same collection cost more per iteration than one; for hot paths the runtime overhead matters and the agent verifying performance must measure.

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

**Removes smells:** Long Function, Loops
