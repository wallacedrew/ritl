---
name: parameterize-function
description: Apply Parameterize Function when you see Duplicated Code. One canonical function with a parameter; the agent reasons about one body and verifies parameter values at call sites.
---

# Apply: 28 — Parameterize Function

**Symptom:** The agent finds near-identical functions differing only in literal values; consistency depends on every variant staying in sync.

**Goal:** One canonical function with a parameter; the agent reasons about one body and verifies parameter values at call sites.

```js
// Avoid:
function tenPercentRaise(person)  { person.salary *= 1.10; }
function fivePercentRaise(person) { person.salary *= 1.05; }

// Prefer:
function raise(person, factor) { person.salary *= 1 + factor; }
```

**Pressure:** Bug fixes must land in every variant; the agent must find and update each consistently or risk drift.

**Tradeoff:** If the variations encode conceptually different operations, the parameterized function grows flags and special cases the agent must thread through — worse than the original duplication.

**Relief:** One canonical implementation the agent reasons about; new variations are new parameter values, not new code paths.

**Trap:** Parameterizing conceptually different operations accumulates flag-driven branches the agent must reason about — the function becomes a switch statement in disguise.

**Removes smells:** Duplicated Code
