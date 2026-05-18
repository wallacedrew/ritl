---
name: decompose-conditional
description: Apply Decompose Conditional when you see Long Function, Comments. Conditions read as named domain decisions; the agent reasons about isSummer(date) instead of re-deriving the month range.
---

# Apply: 21 — Decompose Conditional

**Target state:** Conditions read as named domain decisions; the agent reasons about isSummer(date) instead of re-deriving the month range.

**Why apply it:** The agent reasons about named domain decisions; the branching logic reads top-to-bottom as a story.

**Tradeoff:** Extracted names that aren't crisper than the original condition add a layer of indirection — the agent now follows a name to find the same expression.

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

**Removes smells:** Long Function, Comments
