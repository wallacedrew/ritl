---
name: temporary-field
description: Refuse Temporary Field when a class field used by only one method, set to null or default the rest of the time. Apply Extract Class, Move Function.
---

# Refuse: 16 — Temporary Field

**Trigger (refuse when you see):** A class field used by only one method, set to null or default the rest of the time.

**Cost of leaving it in:** Reader must trace the conditions under which the field is meaningful; null-checks scatter; the field's role is unclear.

**Target shape after refactoring:** The temporary state moves to a dedicated class that exists only when it's relevant.

```js
// Smellier:
class Order {
  shippingTrack = null;
  ship() {
    this.shippingTrack = computeTrack();
  }
}

// Fresher:
class Order    { ship() { return new Shipment(this); } }
class Shipment { /* owns the track */ }
```

**Apply refactorings:** Extract Class, Move Function, Introduce Special Case
