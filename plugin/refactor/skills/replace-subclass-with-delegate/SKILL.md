---
name: replace-subclass-with-delegate
description: Apply Replace Subclass with Delegate when you see Refused Bequest, Insider Trading. Behavior that varied via inheritance now varies via a delegate object that implements the variant interface.
---

# Apply: 38 — Replace Subclass with Delegate

**Target state:** Behavior that varied via inheritance now varies via a delegate object that implements the variant interface.

**Why apply it:** Variants can be combined or swapped at runtime; Liskov violations vanish; the hierarchy tree flattens.

**Pitfall:** Composition is more verbose at construction sites — accept the verbosity in exchange for the flexibility.

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
