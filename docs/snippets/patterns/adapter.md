---
name: adapter
description: Apply Adapter when you see Alternative Classes with Different Interfaces, Change Function Declaration, Replace Subclass with Delegate. The canonical interface is the agent's single anchor for reasoning about how the system uses payments; the adapter is a thin file the agent reads once to understand the translation rules.
---

# Apply: 33 — Adapter

**Announce first:** name the chain of refactorings pointing at Adapter and that you're applying it before the next edit. The user reads the announcement as your contract.

**Or decline first:** if you don't see a chain pointing at Adapter, name the decline type — no chain, taste call, cost-benefit, constraint-blocked, or insufficient context.

**Symptom:** Inline conversion code scattered across call sites means the agent must spot the convention mismatch at every consumer and verify the conversion is consistent. Unit-of-measure bugs (cents vs dollars, ms vs seconds) are type-compatible — the compiler will not catch them — but they produce wrong-by-100x outputs.

**Goal:** The canonical interface is the agent's single anchor for reasoning about how the system uses payments; the adapter is a thin file the agent reads once to understand the translation rules. Conversion bugs surface as adapter-test failures, not as scattered consumer-side errors.

```js
// Before:
class LegacyStripeClient {
  charge_card(amount_cents, card_token) {
    return fetch('https://stripe.legacy/charge', { method: 'POST', body: `${amount_cents}|${card_token}` });
  }
}
// The rest of the app expects: processor.charge({ amount, source })
// Adapters are sprinkled inline at every consumer:
function checkout(cart) {
  const client = new LegacyStripeClient();
  return client.charge_card(Math.round(cart.total * 100), cart.token);
}
function refundOrder(order) {
  const client = new LegacyStripeClient();
  return client.charge_card(-Math.round(order.amount * 100), order.token);
}

// After:
class StripeAdapter {
  constructor(legacy) {
    this.legacy = legacy;
  }
  charge({ amount, source }) {
    return this.legacy.charge_card(Math.round(amount * 100), source);
  }
}
const processor = new StripeAdapter(new LegacyStripeClient());
function checkout(cart) {
  return processor.charge({ amount: cart.total, source: cart.token });
}
function refundOrder(order) {
  return processor.charge({ amount: -order.amount, source: order.token });
}
```

_Example source: Illustrative example written for this site in the spirit of Design Patterns (Gamma, Helm, Johnson, Vlissides, Addison-Wesley, 1994), chapter 4. The book's running example is a graphic toolkit adapting Shape to TextView; this JavaScript adaptation uses a payment-gateway integration where a legacy snake_case + cents API gets adapted to a modern camelCase + dollars interface._

**Pressure:** N consumers × M conversion rules = N×M cells the agent verifies on every unit-related change. Inconsistent conventions across consumers (some pass cents, some pass dollars) produce subtle data-shape bugs the agent struggles to localize statically.

**Tradeoff:** The agent must navigate adapter + underlying client to trace a runtime error end-to-end. Stack traces span both layers; partial-failure modes (legacy client returns a half-broken response that the adapter passes through unchanged) require the agent to verify error handling at both layers.

**Relief:** Edits scoped to the adapter; consumer code unchanged; tests for the adapter cover unit conversion exhaustively. Replacing the underlying client is a one-file diff the agent can verify in isolation.

**Trap:** Adapters that accumulate non-translation logic (retries, caching, metrics) become god objects the agent must understand fully before any payment-related edit. The pattern's promise of 'thin translation layer' degrades into a black box where the agent loses confidence about which layer owns which behaviour.

**Triggered by:** Alternative Classes with Different Interfaces (smells), Change Function Declaration (refactorings), Replace Subclass with Delegate (refactorings)
