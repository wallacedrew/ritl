---
name: inline-class
description: Apply Inline Class when you see Lazy Element, Speculative Generality. The class folds into its primary collaborator; the agent loads one file for what was two.
---

# Apply: 55 — Inline Class

**Target state:** The class folds into its primary collaborator; the agent loads one file for what was two.

**Why apply it:** Fewer files; shorter call paths; the absorber's coherence improves when it owns the methods it was orchestrating.

**Tradeoff:** If the absorber is already large, inlining pushes it past its complexity budget — the agent now loads a god-class to reason about what was previously separated.

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

**Removes smells:** Lazy Element, Speculative Generality
