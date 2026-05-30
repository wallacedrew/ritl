---
name: decompose-conditional
description: Apply Decompose Conditional when you see Long Function, Comments. Conditions read as named domain decisions; the agent reasons about isSummer(date) instead of re-deriving the month range.
---

# Apply: 21 — Decompose Conditional

**Announce first:** name the smell you see and that you're applying Decompose Conditional before any edit. The user reads the announcement as your contract.

**Symptom:** Multi-clause conditional expressions whose domain meaning isn't readable from the syntax; the agent must parse the expression every time it encounters it.

**Goal:** Conditions read as named domain decisions; the agent reasons about isSummer(date) instead of re-deriving the month range.

```js
// Avoid:
if (date < SUMMER_START || date > SUMMER_END) {
  charge = qty * winterRate + winterFee;
} else {
  charge = qty * summerRate;
}

// Prefer:
charge = isSummer(date)
  ? summerCharge(qty)
  : winterCharge(qty);
```

**Pressure:** The agent re-parses the expression at every reference; debugging the condition's value requires the agent to mentally evaluate the full chain.

**Tradeoff:** Extracted names that aren't crisper than the original condition add a layer of indirection — the agent now follows a name to find the same expression.

**Relief:** Each condition and branch lives at one named function the agent reads against the function's name instead of recovering the predicate's domain meaning from its boolean expression.

**Trap:** Extracting names that don't sharpen the condition — `isMonthBetweenFiveAndEight` instead of `isSummer` — adds indirection without revealing intent.

**Removes smells:** Long Function, Comments
