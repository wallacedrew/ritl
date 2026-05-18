---
name: replace-subclass-with-delegate
description: Apply Replace Subclass with Delegate when you see Refused Bequest, Insider Trading. Variants live in delegate objects swappable at runtime; the agent reasons about composition with explicit delegation calls.
---

# Apply: 38 — Replace Subclass with Delegate

**Target state:** Variants live in delegate objects swappable at runtime; the agent reasons about composition with explicit delegation calls.

**Why apply it:** Variants can be combined or swapped at runtime; Liskov violations vanish; the agent reasons about explicit delegation.

**Tradeoff:** Composition is more verbose at construction sites; the agent loses syntactic polymorphism and must verify behavior through explicit delegation calls.

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

**Removes smells:** Refused Bequest, Insider Trading
