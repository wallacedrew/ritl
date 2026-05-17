---
name: extract-function
description: Apply Extract Function when you see Long Function, Duplicated Code, Comments. Each function reads as a single named domain step — what it does, not how.
---

# Apply: 01 — Extract Function

**Target state:** Each function reads as a single named domain step — what it does, not how.

**Why apply it:** Calling code becomes a sequence of named intentions; bugs concentrate inside the now-named subroutines.

**Tradeoff:** Over-eager extraction can produce a maze of one-line functions; aim for extractions that earn their name with at least one decision or one transformation.

```js
// Avoid:
function invoiceTotal(invoice) {
  let total = 0;
  for (const line of invoice.lines) {
    total += line.qty * line.unitPrice;
    if (line.qty >= 100) total -= line.qty * line.unitPrice * 0.05;
  }
  total += total * invoice.taxRate;
  return Math.round(total * 100) / 100;
}

// Prefer:
function invoiceTotal(invoice) {
  const subtotal = subtotalAfterBulkDiscount(invoice);
  const withTax  = subtotal * (1 + invoice.taxRate);
  return roundToCents(withTax);
}
```

**Removes smells:** Long Function, Duplicated Code, Comments
