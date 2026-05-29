---
name: replace-superclass-with-delegate
description: Apply Replace Superclass with Delegate when you see Refused Bequest, Insider Trading. The former subclass holds a delegate of the former parent's role; the agent reads the new class's interface as the contract instead of loading the former parent to filter out methods the subclass refused.
---

# Apply: 66 — Replace Superclass with Delegate

**Symptom:** A subclass that overrides parent methods to no-ops or 'unsupported'; the agent reasoning about polymorphic calls on parent-typed references cannot trust the contract.

**Goal:** The former subclass holds a delegate of the former parent's role; the agent reads the new class's interface as the contract instead of loading the former parent to filter out methods the subclass refused.

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

**Relief:** References typed against the former subclass hold only the methods the class actually implements; generated code that calls a method on a reference no longer dispatches through inherited methods the subclass overrode to no-op or unsupported.

**Trap:** Replacing inheritance with delegation on hierarchies where the subclass uses every inherited method adds a forwarding method per parent method without changing what the agent's generated calls do.

**Removes smells:** Refused Bequest, Insider Trading
