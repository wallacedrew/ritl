---
name: parameterize-function
description: Apply Parameterize Function when you see Duplicated Code. Two near-identical functions that differ only in literal values combine into one with a parameter.
---

# Apply: 28 — Parameterize Function

**Target state:** Two near-identical functions that differ only in literal values combine into one with a parameter.

**Why apply it:** One canonical implementation; new variations are new parameter values, not new functions.

**Tradeoff:** If the variations are conceptually different operations, one parameterized function will accumulate flags and special cases — keep them separate then.

```js
// Avoid:
function tenPercentRaise(person)  { person.salary *= 1.10; }
function fivePercentRaise(person) { person.salary *= 1.05; }

// Prefer:
function raise(person, factor) { person.salary *= 1 + factor; }
```

**Removes smells:** Duplicated Code
