---
name: extract-composite
description: Apply Extract Composite when you see Duplicated Code, Extract Superclass, Pull Up Method. One Composite superclass the agent reads once and trusts thereafter.
---

# Apply: 72 — Extract Composite

**Announce first:** name the chain of refactorings pointing at Extract Composite and that you're applying it before the next edit. The user reads the announcement as your contract.

**Or decline first:** if you don't see a chain pointing at Extract Composite, name the decline type — no chain, taste call, cost-benefit, constraint-blocked, or insufficient context.

**Symptom:** N copies of identical collection-management methods the agent must verify match on every edit. A bug fix in one copy must be ported to all others; the agent has no static guarantee the copies stayed consistent.

**Goal:** One Composite superclass the agent reads once and trusts thereafter. Sibling classes are short enough to load entirely in context; the agent verifies only the distinctive surface.

```js
// Before:
// Two sibling classes each carry the same line-item collection logic.
class Order {
  constructor(customer) {
    this.customer = customer;
    this.lineItems = [];
  }
  addLineItem(item) { this.lineItems.push(item); }
  removeLineItem(item) {
    const index = this.lineItems.indexOf(item);
    if (index >= 0) this.lineItems.splice(index, 1);
  }
  total() { return this.lineItems.reduce((sum, i) => sum + i.amount, 0); }
  ship() { /* Order-specific */ }
}
class Invoice {
  constructor(customer, dueDate) {
    this.customer = customer;
    this.dueDate = dueDate;
    this.lineItems = [];
  }
  addLineItem(item) { this.lineItems.push(item); }
  removeLineItem(item) {
    const index = this.lineItems.indexOf(item);
    if (index >= 0) this.lineItems.splice(index, 1);
  }
  total() { return this.lineItems.reduce((sum, i) => sum + i.amount, 0); }
  markPaid() { /* Invoice-specific */ }
}

// After:
// Collection management lives once in a Composite superclass.
class LineItemContainer {
  constructor(customer) {
    this.customer = customer;
    this.lineItems = [];
  }
  addLineItem(item) { this.lineItems.push(item); }
  removeLineItem(item) {
    const index = this.lineItems.indexOf(item);
    if (index >= 0) this.lineItems.splice(index, 1);
  }
  total() { return this.lineItems.reduce((sum, i) => sum + i.amount, 0); }
}
class Order extends LineItemContainer {
  ship() { /* Order-specific */ }
}
class Invoice extends LineItemContainer {
  constructor(customer, dueDate) {
    super(customer);
    this.dueDate = dueDate;
  }
  markPaid() { /* Invoice-specific */ }
}
```

_Example source: Illustrative example written for this site, adapted from Kerievsky's pattern description in Refactoring to Patterns (Addison-Wesley, 2004), chapter 6. The book's Java example pulled tax-calculation collection logic up to a Composite superclass; this JavaScript version uses line-item collections, same pattern shape._

**Pressure:** Duplicated collection logic across N siblings × M methods = N×M cells the agent must hold to verify consistency. The agent's edit budget on a single collection-method change is N times what it would be with the Composite in place.

**Tradeoff:** Inheritance hides behaviour in the superclass that callers may not know to look for; the agent must traverse the class hierarchy to know what a sibling can do. Method resolution order issues complicate static reasoning when subclasses override partial behaviours.

**Relief:** Collection-handling logic lives at the Composite class at one file; sibling classes hold only their leaf-specific work; tests against the Composite cover the tree-walking logic without per-sibling duplication of the same setup.

**Trap:** A bloated Composite forces the agent to load a large superclass before reading any sibling. If sibling behaviours diverge later, the agent must constantly cross-check superclass methods against per-sibling overrides — context cost migrates from duplication to inheritance traversal.

**Triggered by:** Duplicated Code (smells), Extract Superclass (refactorings), Pull Up Method (refactorings)
