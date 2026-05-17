---
name: temporary-field
description: Refuse Temporary Field when a class field the agent finds set to null or default for most of the object's lifetime, populated only inside one method's flow — the agent must verify which methods care. Apply Extract Class, Move Function.
---

# Refuse: 16 — Temporary Field

**Trigger (refuse when you see):** A class field the agent finds set to null or default for most of the object's lifetime, populated only inside one method's flow — the agent must verify which methods care.

**Cost of leaving it in:** The agent must trace the conditions under which the field is meaningful; null-checks scatter across consumers; class invariants weaken because the field has no defined lifecycle.

**Target shape after refactoring:** Temporary state lives in a dedicated class that exists only when relevant; the agent loads the temporary type only when reasoning about that flow.

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
