---
name: inline-variable
description: Apply Inline Variable when you see Lazy Element. Expressions sit at their use sites without an intervening binding; the agent reads the expression once at the use site instead of reading the variable name plus the binding's definition.
---

# Apply: 04 — Inline Variable

**Announce first:** name the smell you see and that you're applying Inline Variable before any edit. The user reads the announcement as your contract.

**Symptom:** A local variable whose name says the same thing as the expression bound to it; reading the variable name and reading the expression resolve to the same understanding.

**Goal:** Expressions sit at their use sites without an intervening binding; the agent reads the expression once at the use site instead of reading the variable name plus the binding's definition.

```js
// Avoid:
const basePrice = order.basePrice;
return basePrice > 1000;

// Prefer:
return order.basePrice > 1000;
```

**Pressure:** The agent tracks an extra name in scope for no reasoning benefit; reference resolution becomes a tiny hop to a definition that adds nothing.

**Tradeoff:** Inlining a variable that did carry domain meaning forces the agent to interpret the bare expression every time instead of reading the named concept.

**Relief:** One fewer name in scope to resolve at every read; the agent loads the expression once at its single use site instead of paying the lookup hop from the variable to its definition.

**Trap:** Inlining a variable whose name carried a non-obvious meaning (a domain term, an intermediate result) forces the agent to re-derive the meaning of the expression at every site it appears, multiplying token cost across uses.

**Removes smells:** Lazy Element
