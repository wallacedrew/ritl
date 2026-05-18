---
name: replace-superclass-with-delegate
description: Apply Replace Superclass with Delegate when you see Refused Bequest, Insider Trading. Composition replaces inheritance; the agent reasons about explicit delegation with no Liskov ambiguity.
---

# Apply: 66 — Replace Superclass with Delegate

**Target state:** Composition replaces inheritance; the agent reasons about explicit delegation with no Liskov ambiguity.

**Why apply it:** The misleading is-a relationship disappears; the agent's polymorphic reasoning becomes trustworthy because every reference type honors its declared contract.

**Tradeoff:** Composition adds a forwarding method on the former subclass for every parent method exposed; the agent loses syntactic polymorphism and pays ceremony for explicit delegation.

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

**Removes smells:** Refused Bequest, Insider Trading
