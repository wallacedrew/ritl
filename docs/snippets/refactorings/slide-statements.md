---
name: slide-statements
description: Apply Slide Statements when you see Long Function, Comments. Related statements sit next to each other; the agent reads the function as a sequence of cohesive blocks ready for extraction.
---

# Apply: 14 — Slide Statements

**Target state:** Related statements sit next to each other; the agent reads the function as a sequence of cohesive blocks ready for extraction.

**Why apply it:** The function reads as cohesive blocks the agent can extract or reason about as units; setup for further refactoring becomes mechanical.

**Tradeoff:** Sliding can silently change behavior if statements aren't truly independent (hidden side effects, timing dependencies, observer effects); the agent verifying the slide must confirm independence at every gap.

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
