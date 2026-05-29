---
name: slide-statements
description: Apply Slide Statements when you see Long Function, Comments. Related statements sit next to each other; the agent reads the function as a sequence of cohesive blocks ready for extraction.
---

# Apply: 14 — Slide Statements

**Symptom:** A function whose related statements are interleaved with unrelated work; the agent reasoning about any sub-step must track state across non-adjacent lines.

**Goal:** Related statements sit next to each other; the agent reads the function as a sequence of cohesive blocks ready for extraction.

```js
// Avoid:
const basePrice = qty * itemPrice;
logPriceCalc(basePrice);
const tax = basePrice * 0.1;
logTaxCalc(tax);

// Prefer:
const basePrice = qty * itemPrice;
const tax = basePrice * 0.1;
logPriceCalc(basePrice);
logTaxCalc(tax);
```

**Pressure:** The agent holds partial sub-step state across non-adjacent lines; reasoning about any single concern requires tracking the others through the interleave.

**Tradeoff:** Sliding can silently change behavior if statements aren't truly independent (hidden side effects, timing dependencies, observer effects); the agent verifying the slide must confirm independence at every gap.

**Relief:** Statements that depend on one another sit next to each other; the agent reads each cluster as a unit without paging tokens between unrelated lines to follow data flow.

**Trap:** Aggressive sliding without verifying side-effect ordering — observer logs, time reads, async dispatch — silently changes behavior the agent's local tests may not catch.

**Removes smells:** Long Function, Comments
