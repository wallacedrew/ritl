---
name: replace-exception-with-precheck
description: Apply Replace Exception with Precheck when you see Comments. The precheck appears at the point of decision; the agent reads the code top-to-bottom as the rule, with exceptions reserved for truly exceptional cases.
---

# Apply: 61 — Replace Exception with Precheck

**Symptom:** The agent finds try/catch for conditions the caller could check directly; control flow via exceptions obscures the rule.

**Goal:** The precheck appears at the point of decision; the agent reads the code top-to-bottom as the rule, with exceptions reserved for truly exceptional cases.

```js
// Avoid:
try {
  return amounts[i] / 100;
} catch (e) {
  return 0;
}

// Prefer:
if (i >= amounts.length) return 0;
return amounts[i] / 100;
```

**Pressure:** The agent debugging exception flow must reason about catch handlers; benign throws fire breakpoints; the rule that 'should fire' isn't obvious from reading.

**Tradeoff:** Race conditions: the precheck may pass and the operation still fail (TOCTOU); the agent using prechecks must verify the caller can check the condition atomically.

**Relief:** The agent reads the rule top-to-bottom; debuggers stop catching benign throws; exception handlers reserve for truly exceptional cases.

**Trap:** Replacing exceptions with prechecks for conditions the caller can't atomically verify introduces race windows the agent's local tests won't catch.

**Removes smells:** Comments
