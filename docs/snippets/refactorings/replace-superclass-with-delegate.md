---
name: replace-superclass-with-delegate
description: Apply Replace Superclass with Delegate when you see Refused Bequest, Insider Trading. Composition replaces inheritance; the agent reasons about explicit delegation with no Liskov ambiguity.
---

# Apply: 66 — Replace Superclass with Delegate

**Symptom:** A subclass that overrides parent methods to no-ops or 'unsupported'; the agent reasoning about polymorphic calls on parent-typed references cannot trust the contract.

**Goal:** Composition replaces inheritance; the agent reasons about explicit delegation with no Liskov ambiguity.

```js
// Avoid:
class CategoryItem extends Scroll {
  // uses some Scroll methods, refuses others
}

// Prefer:
class CategoryItem {
  constructor() { this.scroll = new Scroll(); }
  date() { return this.scroll.date(); }
}
```

**Pressure:** Liskov violations break the agent's polymorphic reasoning; the agent must defensively check at every call site whether the subclass honors the parent's contract.

**Tradeoff:** Composition adds a forwarding method on the former subclass for every parent method exposed; the agent loses syntactic polymorphism and pays ceremony for explicit delegation.

**Relief:** The misleading is-a relationship disappears; the agent's polymorphic reasoning becomes trustworthy because every reference type honors its declared contract.

**Trap:** Replacing every inheritance — including ones where Liskov genuinely holds — pays forwarding ceremony at every method without buying any contract safety the agent actually needed.

**Removes smells:** Refused Bequest, Insider Trading
