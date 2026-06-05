---
name: inline-variable
description: Apply Inline Variable when you see Lazy Element. Expressions sit at their use sites without an intervening binding; the agent reads the expression once instead of reading the variable name plus the binding's definition.
---

# Apply: 04 — Inline Variable

**Announce first:** name the smell you see and that you're applying Inline Variable before any edit. The user reads the announcement as your contract.

**Or decline first:** if you don't apply Inline Variable, name the decline type — catalog miss, taste call, cost-benefit, constraint-blocked, or insufficient context — so the user knows which counterargument applies.

**Symptom:** A local variable whose name says the same thing as the expression bound to it; reading the variable name and reading the expression resolve to the same understanding. The agent pays retrieval cost for the binding lookup that returns no information not already implied by the expression at the use site, and the extra name competes for context window space.

**Goal:** Expressions sit at their use sites without an intervening binding; the agent reads the expression once instead of reading the variable name plus the binding's definition. The agent's token cost per read drops by the size of the binding declaration, and reasoning step count drops because no name-resolution hop intervenes between the use site and the expression's meaning.

```js
// Avoid:
const basePrice = order.basePrice;
return basePrice > 1000;

// Prefer:
return order.basePrice > 1000;
```

**Pressure:** The agent tracks an extra name in scope for no reasoning benefit; reference resolution becomes a tiny hop to a definition that adds nothing. The agent's verification-surface cost on any edit touching the variable rises by one declaration to verify, and chained reads multiply the cost across every use site that resolves through the rebound name.

**Tradeoff:** Inlining a variable that did carry domain meaning forces the agent to interpret the bare expression every time instead of reading the named concept. The agent's completeness-check cost rises during the inline itself — every reference to the binding must be confirmed to use the inlined expression form, and any straggling reference becomes a regression.

**Relief:** One fewer name in scope to resolve at every read; the agent loads the expression once at its single use site instead of paying the lookup hop from the variable to its definition. Token cost per edit drops because the binding declaration disappears, and context-window load contracts as the scope shrinks.

**Trap:** Inlining a variable whose name carried a non-obvious meaning (a domain term, an intermediate result) forces the agent to re-derive the meaning of the expression at every site it appears. The agent's reasoning-step cost rises per read because the named concept now lives nowhere, and token cost multiplies across uses that would have resolved to the name.

**Removes smells:** Lazy Element
