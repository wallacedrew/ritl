---
name: parameterize-function
description: Apply Parameterize Function when you see Duplicated Code. One canonical function with a parameter; the agent reasons about one body and verifies parameter values at call sites.
---

# Apply: 28 — Parameterize Function

**Target state:** One canonical function with a parameter; the agent reasons about one body and verifies parameter values at call sites.

**Why apply it:** One canonical implementation the agent reasons about; new variations are new parameter values, not new code paths.

**Tradeoff:** If the variations encode conceptually different operations, the parameterized function grows flags and special cases the agent must thread through — worse than the original duplication.

```js
// Avoid:
function tenPercentRaise(person)  { person.salary *= 1.10; }
function fivePercentRaise(person) { person.salary *= 1.05; }

// Prefer:
function raise(person, factor) { person.salary *= 1 + factor; }
```

**Removes smells:** Duplicated Code
