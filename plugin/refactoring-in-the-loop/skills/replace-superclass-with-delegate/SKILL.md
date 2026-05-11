---
name: replace-superclass-with-delegate
description: Apply Replace Superclass with Delegate when you see Refused Bequest, Insider Trading. Inheritance from a superclass that doesn't really fit (Liskov violations, awkward methods) becomes composition; the former subclass holds an instance and delegates explicitly.
---

# Apply: 66 — Replace Superclass with Delegate

**Target state:** Inheritance from a superclass that doesn't really fit (Liskov violations, awkward methods) becomes composition: the former subclass holds an instance and delegates explicitly.

**Why apply it:** The misleading is-a relationship disappears; the former subclass can change its delegate's class without affecting its callers.

**Pitfall:** Adds a forwarding method on the former subclass for every method the old superclass exposed — only worth it when the superclass relationship is misleading.

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
