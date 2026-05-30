---
name: split-variable
description: Apply Split Variable when you see Mysterious Name, Mutable Data. Each variable holds one role with a stable name; the agent reasons about names without tracking reassignment timeline.
---

# Apply: 18 — Split Variable

**Announce first:** name the smell you see and that you're applying Split Variable before any edit. The user reads the announcement as your contract.

**Symptom:** The agent finds a variable reassigned with values of conceptually different types or domains; reasoning about any expression involving it requires knowing which role is currently active.

**Goal:** Each variable holds one role with a stable name; the agent reasons about names without tracking reassignment timeline.

```js
// Avoid:
let temp = 2 * (height + width);
console.log(temp);
temp = height * width;
console.log(temp);

// Prefer:
const perimeter = 2 * (height + width);
console.log(perimeter);
const area = height * width;
console.log(area);
```

**Pressure:** The agent must trace through reassignments to know what any reference currently means; type-narrowing in unions becomes guesswork at every read site.

**Tradeoff:** If the two uses were actually coupled (shared init, synchronized update), splitting forces the agent to re-derive the coupling across two variables.

**Relief:** The agent reasons about each variable as a stable name; the type system can narrow each role; each use becomes independently refactorable.

**Trap:** Splitting variables whose uses genuinely shared state forces the agent to re-establish the coupling outside the variable, complicating the original logic.

**Removes smells:** Mysterious Name, Mutable Data
