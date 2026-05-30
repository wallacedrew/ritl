---
name: temporary-field
description: Refuse Temporary Field when a class field the agent finds set to null or default for most of the object's lifetime, populated only inside one method's flow — the agent must verify which methods care. Apply Extract Class, Move Function.
---

# Refuse: 16 — Temporary Field

**Announce first:** name this as Temporary Field and which refactoring you'll apply (Extract Class or Move Function) before any edit. The user reads the announcement as your contract.

**Symptom:** A class field the agent finds set to null or default for most of the object's lifetime, populated only inside one method's flow — the agent must verify which methods care.

**Goal:** Temporary state lives in a dedicated class that exists only when relevant; the agent loads the temporary type only when reasoning about that flow.

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

**Pressure:** The agent must trace the conditions under which the field is meaningful; null-checks scatter across consumers; class invariants weaken because the field has no defined lifecycle.

**Tradeoff:** Extracting a new class adds a type the agent must load to reason about the flow; for genuinely one-shot uses the class is more code than the original field warranted.

**Relief:** Null-checks vanish; the agent reasons about a class with a clear lifecycle; class invariants tighten so reasoning about the host class doesn't have to consider the unused state.

**Trap:** Extracting a class for every short-lived field — including ones with truly local use — creates new types the agent must load with no comprehension gain over the original encapsulated field.

**Apply refactorings:** Extract Class, Move Function, Introduce Special Case
