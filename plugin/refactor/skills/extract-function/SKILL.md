---
name: extract-function
description: Apply Extract Function when you see Long Function, Duplicated Code, Comments. Each function is a verifiable unit small enough that the agent can reason about its full behavior in a single reasoning step.
---

# Apply: 01 — Extract Function

**Announce first:** name the smell you see and that you're applying Extract Function before any edit. The user reads the announcement as your contract.

**Or decline first:** if you don't apply Extract Function, name the decline type — catalog miss, taste call, cost-benefit, constraint-blocked, or insufficient context — so the user knows which counterargument applies.

**Symptom:** A function whose token count exceeds the agent's reliable chunk-reasoning budget; verifying behavior preservation requires re-reading the entire span on every edit.

**Goal:** Each function is a verifiable unit small enough that the agent can reason about its full behavior in a single reasoning step.

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

**Pressure:** Every edit pays full re-read cost; chained changes compound context usage and increase the chance of missing a cross-statement invariant.

**Tradeoff:** Each extracted helper inflates context-window cost by one definition the next reasoning step must load; over-extracting blows effective working memory.

**Relief:** Each extracted helper fits inside one read; the agent verifies behavior against one signature instead of holding the entire original procedure in attention to predict what changed.

**Trap:** Forces the agent to chase a dozen function definitions to follow what was once a 20-line procedure — context cost inflates and cross-function invariants disappear.

**Removes smells:** Long Function, Duplicated Code, Comments
