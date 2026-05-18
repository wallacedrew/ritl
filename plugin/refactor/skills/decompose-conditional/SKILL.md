---
name: decompose-conditional
description: Apply Decompose Conditional when you see Long Function, Comments. Conditions read as named domain decisions; the agent reasons about isSummer(date) instead of re-deriving the month range.
---

# Apply: 21 — Decompose Conditional

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

**Relief:** The agent reasons about named domain decisions; the branching logic reads top-to-bottom as a story.

**Trap:** Extracting names that don't sharpen the condition — `isMonthBetweenFiveAndEight` instead of `isSummer` — adds indirection without revealing intent.

**Removes smells:** Long Function, Comments
