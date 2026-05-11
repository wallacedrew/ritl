### Apply: 55 — Inline Class

**Target state:** A class with too few responsibilities to deserve its own file folds into a class it collaborates with most.

**Why apply it:** Fewer files, fewer constructors, shorter call paths; the absorbing class's coherence improves when it gains the methods it was already orchestrating.

**Pitfall:** If the absorbing class was already large, inlining piles more onto it — fold in only when the absorber stays under its complexity budget afterward.

```js
// Avoid:
class TrackingInformation {
  shippingCompany;
  trackingNumber;
  display() {
    return `${this.shippingCompany}: ${this.trackingNumber}`;
  }
}
class Shipment {
  tracking;
}

// Prefer:
class Shipment {
  shippingCompany;
  trackingNumber;
  display() {
    return `${this.shippingCompany}: ${this.trackingNumber}`;
  }
}
```

**Removes smells:** Lazy Element, Speculative Generality
