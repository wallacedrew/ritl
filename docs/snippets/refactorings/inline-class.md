---
name: inline-class
description: Apply Inline Class when you see Lazy Element, Speculative Generality. The class folds into its primary collaborator; the agent loads one file for what was two.
---

# Apply: 55 — Inline Class

**Announce first:** name the smell you see and that you're applying Inline Class before any edit. The user reads the announcement as your contract.

**Or decline first:** if you don't apply Inline Class, name the decline type — catalog miss, taste call, cost-benefit, constraint-blocked, or insufficient context — so the user knows which counterargument applies.

**Symptom:** A class with too few responsibilities for its own file; the agent loads the class to reason about behavior that would naturally live with the absorber.

**Goal:** The class folds into its primary collaborator; the agent loads one file for what was two.

```js
// Avoid:
class TrackingInformation {
  shippingCompany;
  trackingNumber;
  display() { return `${this.shippingCompany}: ${this.trackingNumber}`; }
}
class Shipment { tracking; }

// Prefer:
class Shipment {
  shippingCompany;
  trackingNumber;
  display() { return `${this.shippingCompany}: ${this.trackingNumber}`; }
}
```

**Pressure:** Every reference site costs a file-jump the agent must pay; the indirection is overhead for trivial behavior.

**Tradeoff:** If the absorber is already large, inlining pushes it past its complexity budget — the agent now loads a god-class to reason about what was previously separated.

**Relief:** Fewer files; shorter call paths; the absorber's coherence improves when it owns the methods it was orchestrating.

**Trap:** Inlining into an already-large class creates a worse Large Class smell — the agent must reason about a god-class instead of two focused ones.

**Removes smells:** Lazy Element, Speculative Generality
