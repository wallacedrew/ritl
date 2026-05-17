---
name: slide-statements
description: Apply Slide Statements when you see Long Function, Comments. Related statements sit next to each other; the function reads as a sequence of cohesive sub-steps that are easy to extract.
---

# Apply: 14 — Slide Statements

**Target state:** Related statements sit next to each other; the function reads as a sequence of cohesive sub-steps that are easy to extract.

**Why apply it:** Setup for Extract Function becomes trivial; the implicit grouping inside the function becomes explicit.

**Tradeoff:** Reordering can change behavior if statements aren't actually independent — verify side effects and dependencies before sliding.

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

**Removes smells:** Long Function, Comments
