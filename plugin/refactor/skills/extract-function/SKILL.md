---
name: extract-function
description: Apply Extract Function when you see Long Function, Duplicated Code, Comments. Each function is a verifiable unit small enough that the agent can reason about its full behavior in a single reasoning step.
---

# Apply: 01 — Extract Function

**Target state:** Each function is a verifiable unit small enough that the agent can reason about its full behavior in a single reasoning step.

**Why apply it:** Smaller diff surface per commit; behavior preservation verifiable per refactoring step; chained orchestrations work from named subroutines instead of re-derived semantics.

**Tradeoff:** Each extracted helper inflates context-window cost by one definition the next reasoning step must load; over-extracting blows effective working memory.

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
