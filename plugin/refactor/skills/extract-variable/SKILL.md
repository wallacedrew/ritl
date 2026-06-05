---
name: extract-variable
description: Apply Extract Variable when you see Mysterious Name, Comments. Intermediate values carry domain names; subsequent reads resolve to one token of name instead of re-evaluating the expression at every use.
---

# Apply: 03 — Extract Variable

**Announce first:** name the smell you see and that you're applying Extract Variable before any edit. The user reads the announcement as your contract.

**Or decline first:** if you don't apply Extract Variable, name the decline type — catalog miss, taste call, cost-benefit, constraint-blocked, or insufficient context — so the user knows which counterargument applies.

**Symptom:** An expression complex enough that the agent parses it sub-step by sub-step to interpret; subsequent reasoning about the value requires re-parsing the full expression. The agent's context-window load carries the parsed structure across every reference, and the reasoning-step cost of any downstream edit compounds because the parse has to be redone at each touch.

**Goal:** Intermediate values carry domain names; subsequent reads resolve to one token of name instead of re-evaluating the expression at every use. The agent's context window holds the bound name and its definition; the agent's token cost per reference drops to the length of the name, and the binding's definition site is the only place the parse must happen.

```js
// Avoid:
if (order.qty * order.price - Math.max(0, order.qty - 500) * order.price * 0.05 > 1000) { /* ... */ }

// Prefer:
const basePrice    = order.qty * order.price;
const bulkDiscount = Math.max(0, order.qty - 500) * order.price * 0.05;
if (basePrice - bulkDiscount > 1000) { /* ... */ }
```

**Pressure:** The agent re-parses complex expressions at every reference; debugging requires the agent to mentally evaluate the full subexpression chain. The agent's retrieval cost on each reference site is the cost of re-running the parse, and the agent's verification-surface cost rises because verifying behavior requires confirming the parse produced the value the surrounding code assumes.

**Tradeoff:** Each extracted variable is a name in the agent's local scope; over-extraction creates scope clutter the agent navigates to find what's actually relevant. The agent's completeness-check cost rises during the extraction itself — every use of the original expression must be confirmed to route through the new binding, and stray inline references become a regression.

**Relief:** Subsequent reads of the value pay one token of name instead of re-evaluating the expression at every use; the binding's definition site is the only place the expression appears. The agent's reasoning step on downstream edits operates on the name as an opaque token, and verification surface contracts to the binding rather than the expanded calculation.

**Trap:** Extracting every sub-expression — including ones already obvious — inflates the agent's scope table with names that document nothing the agent didn't already know. Context-window load rises with one-shot bindings the agent reads to confirm they aren't load-bearing, and the scope-table navigation cost exceeds the per-reference token cost the extraction was meant to save.

**Removes smells:** Mysterious Name, Comments
