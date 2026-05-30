---
name: replace-type-code-with-class
description: Apply Replace Type Code With Class when you see Primitive Obsession, Replace Primitive with Object, Replace Type Code with Subclasses. Static type-checking enforces that comparisons are only against the named instances.
---

# Apply: 25 — Replace Type Code With Class

**Announce first:** name the chain of refactorings pointing at Replace Type Code With Class and that you're applying it before the next edit. The user reads the announcement as your contract.

**Symptom:** Magic-literal comparisons across N consumers the agent must verify match a documented (or undocumented) set of valid values. The type system cannot enforce membership; typos and stale literals ship silently to runtime.

**Goal:** Static type-checking enforces that comparisons are only against the named instances. The agent verifies consumers by class membership; per-status behaviour is locally readable as methods on the class.

```js
// Before:
// Status is an integer; every consumer comparisons it against magic literals.
class Order {
  constructor() {
    this.status = 0; // 0=pending, 1=paid, 2=shipped, 3=delivered, 4=cancelled
  }
  describe() {
    if (this.status === 0) return 'Pending';
    if (this.status === 1) return 'Paid';
    if (this.status === 2) return 'Shipped';
    if (this.status === 3) return 'Delivered';
    if (this.status === 4) return 'Cancelled';
    return 'Unknown';
  }
  canCancel() {
    return this.status === 0 || this.status === 1;
  }
}

// After:
// Status is a typed value object; comparisons and behaviour live on the class.
class OrderStatus {
  static PENDING = new OrderStatus('Pending', true);
  static PAID = new OrderStatus('Paid', true);
  static SHIPPED = new OrderStatus('Shipped', false);
  static DELIVERED = new OrderStatus('Delivered', false);
  static CANCELLED = new OrderStatus('Cancelled', false);
  constructor(label, cancellable) {
    this.label = label;
    this.cancellable = cancellable;
  }
  describe() { return this.label; }
  canCancel() { return this.cancellable; }
}

class Order {
  constructor() {
    this.status = OrderStatus.PENDING;
  }
  describe() { return this.status.describe(); }
  canCancel() { return this.status.canCancel(); }
}
```

_Example source: Illustrative example written for this site, faithful to Kerievsky's pattern shape in Refactoring to Patterns (Addison-Wesley, 2004), chapter 9. Distinct from Fowler's Replace Type Code With Subclasses (which makes the type code drive a hierarchy): this pattern is the lower-ceremony first move — turn the primitive into a value object that can carry methods and validation; subclasses come later if behaviour diverges enough to warrant them._

**Pressure:** Magic literals defeat static analysis at every comparison site. The agent's verification cost on a new status × M consumers scales with consumer count; cross-consumer consistency requires holistic test coverage that may not exist.

**Tradeoff:** Value-object instances are reference-equality-checked in JavaScript; serialization round-trips require explicit handling. The agent must verify that deserialization produces the same canonical instances, not new equivalents, or `===` comparisons silently fail.

**Relief:** Adding a new status is one new subclass; the type checker confirms consumers handle every variant, and per-status behavior lives on the variant's class instead of in switch branches across every consumer.

**Trap:** Value objects relying on reference equality across serialization boundaries (HTTP, persistence, message queues) require careful canonicalization; getting it wrong produces runtime equality bugs the agent cannot detect statically. The pattern is straightforward in pure-runtime code; thornier across persistence boundaries.

**Triggered by:** Primitive Obsession (smells), Replace Primitive with Object (refactorings), Replace Type Code with Subclasses (refactorings)
