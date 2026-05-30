---
name: replace-subclass-with-delegate
description: Apply Replace Subclass with Delegate when you see Refused Bequest, Insider Trading. Variants live in delegate objects the host holds and forwards to; the agent reads one host class plus the held delegate's interface instead of climbing an inheritance chain to predict behavior.
---

# Apply: 38 — Replace Subclass with Delegate

**Announce first:** name the smell you see and that you're applying Replace Subclass with Delegate before any edit. The user reads the announcement as your contract.

**Or decline first:** if you don't apply Replace Subclass with Delegate, name the decline type — catalog miss, taste call, cost-benefit, constraint-blocked, or insufficient context — so the user knows which counterargument applies.

**Symptom:** A subclass that overrides several methods to implement variant behavior; the agent reasoning about polymorphic dispatch must enumerate variants across the hierarchy.

**Goal:** Variants live in delegate objects the host holds and forwards to; the agent reads one host class plus the held delegate's interface instead of climbing an inheritance chain to predict behavior.

```js
// Avoid:
class Booking { /* ... */ }
class PremiumBooking extends Booking {
  /* overrides several methods */
}

// Prefer:
class Booking {
  type; // 'standard' | premium delegate
  charge() { return this.type.charge(this); }
}
```

**Pressure:** Behavior can't change at runtime; combining variants requires multiple inheritance the agent must work around; Liskov violations hide in override behavior.

**Tradeoff:** Composition is more verbose at construction sites; the agent loses syntactic polymorphism and must verify behavior through explicit delegation calls.

**Relief:** Behavior changes at runtime by swapping the delegate; the agent reasons against one host signature plus the delegate's interface, without loading the inheritance graph to verify which override applies to a given instance.

**Trap:** Replacing inheritance with delegation on hierarchies where every subclass honors the parent's contract adds construction-site setup and a forwarding method per parent method without changing what the agent's generated calls do.

**Removes smells:** Refused Bequest, Insider Trading
