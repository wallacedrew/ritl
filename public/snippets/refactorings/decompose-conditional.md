---
name: decompose-conditional
description: Apply Decompose Conditional when you see Long Function, Comments. Conditions and their consequents read as named domain decisions; isInSummer(), discountFor(date), etc.
---

# Apply: 21 — Decompose Conditional

**Target state:** Conditions and their consequents read as named domain decisions: isInSummer(), discountFor(date), etc.

**Why apply it:** The branching logic reads top-to-bottom as a story; bugs concentrate in the named pieces.

**Pitfall:** Names that aren't crisper than the underlying condition add ceremony — only extract when the named function/variable says something the condition can't.

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
