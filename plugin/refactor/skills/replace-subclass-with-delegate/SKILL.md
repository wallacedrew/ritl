---
name: replace-subclass-with-delegate
description: Apply Replace Subclass with Delegate when you see Refused Bequest, Insider Trading. Variants live in delegate objects swappable at runtime; the agent reasons about composition with explicit delegation calls.
---

# Apply: 38 — Replace Subclass with Delegate

**Symptom:** A subclass that overrides several methods to implement variant behavior; the agent reasoning about polymorphic dispatch must enumerate variants across the hierarchy.

**Goal:** Variants live in delegate objects swappable at runtime; the agent reasons about composition with explicit delegation calls.

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

**Relief:** Variants can be combined or swapped at runtime; Liskov violations vanish; the agent reasons about explicit delegation.

**Trap:** Replacing every subclass — including ones where Liskov genuinely holds — pays construction-site verbosity without buying flexibility the agent will actually use.

**Removes smells:** Refused Bequest, Insider Trading
