---
name: extract-function
description: Apply Extract Function when you see Long Function, Duplicated Code, Comments. Each function is a verifiable unit small enough that the agent reasons about its full behavior in a single reasoning step.
---

# Apply: 01 — Extract Function

**Announce first:** name the smell you see and that you're applying Extract Function before any edit. The user reads the announcement as your contract.

**Or decline first:** if you don't apply Extract Function, name the decline type — catalog miss, taste call, cost-benefit, constraint-blocked, or insufficient context — so the user knows which counterargument applies.

**Symptom:** A function whose token cost exceeds the agent's reliable chunk-reasoning budget; verifying behavior preservation requires re-reading the entire span on every edit. The context-window load of the unstructured body crowds out other reasoning, and the reasoning step count rises as the agent re-derives the function's internal structure on each read.

**Goal:** Each function is a verifiable unit small enough that the agent reasons about its full behavior in a single reasoning step. The agent's context window holds the relevant helper and its signature; verifying behavior touches one named unit, and the reasoning-step cost of any edit drops because the agent doesn't re-derive structure on each read.

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

**Pressure:** Every edit pays full re-read cost; chained changes compound context usage and increase the chance of missing a cross-statement invariant. The agent's verification-surface cost multiplies with body length — verifying any single change requires scanning every other statement to confirm it didn't shift, and the agent's retrieval cost on chained edits compounds.

**Tradeoff:** Each extracted helper inflates the agent's context-window load by one definition the next reasoning step must load; over-extracting blows the agent's effective context-window capacity. The agent's completeness-check cost rises during the extraction itself — every reference to the body must be confirmed to route through the new helper rather than continuing to inline what's left.

**Relief:** Each extracted helper fits inside one read; the agent verifies behavior against one signature instead of loading the entire original procedure into context to detect what changed. The agent's token cost per edit drops because the relevant unit is the helper, not the parent — and helper boundaries surface cross-statement invariants as parameter types rather than runtime drift.

**Trap:** Forces the agent to chase a dozen function definitions to follow what was once a 20-line procedure — context cost inflates and cross-function invariants disappear. The agent's retrieval cost across the call graph rises faster than the per-helper context-window load drops; tiny helpers cost more to assemble than to inline.

**Removes smells:** Long Function, Duplicated Code, Comments
