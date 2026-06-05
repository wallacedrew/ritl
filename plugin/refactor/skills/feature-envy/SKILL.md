---
name: feature-envy
description: Refuse Feature Envy when a method's body references foreign-class data more than its own; the agent loading this method also loads the foreign class to verify any change. Apply Move Function, Extract Function.
---

# Refuse: 09 — Feature Envy

**Announce first:** name this as Feature Envy and which refactoring you'll apply (Move Function or Extract Function) before any edit. The user reads the announcement as your contract.

**Or decline first:** if you don't flag this as Feature Envy, name the decline type — catalog miss, taste call, cost-benefit, constraint-blocked, or insufficient context.

**Symptom:** A method's body references foreign-class data more than its own; the agent loading this method also loads the foreign class to verify any change. The agent's context-window load doubles for what reads as one operation, and the retrieval cost of pulling B's surface into reasoning about A's method pays no information dividend.

**Goal:** Method bodies stay close to the data they read — the agent loads one class to reason about one behavior. The agent's context window holds the class that owns both the data and the calculation; the reasoning step count drops because the agent doesn't jump between two surfaces to assemble the meaning of one method.

```js
// Smellier:
class Order {
  totalWeight() {
    return this.items.reduce((s, i) => s + i.unitWeight * i.qty, 0);
  }
}

// Fresher:
class Item  { weight()      { return this.unitWeight * this.qty; } }
class Order { totalWeight() { return this.items.reduce((s, i) => s + i.weight(), 0); } }
```

**Pressure:** Each call to the envious method pulls a second class into the agent's working context; chained reasoning across the boundary compounds the load. The agent's verification-surface cost rises because verifying the method requires verifying invariants on B that A's caller can't see; an edit to B's representation surfaces only after a downstream test fails.

**Tradeoff:** Moving the method may force additional cross-class dependencies the original boundary hid; the agent verifying the move traces the new coupling at the destination class. The agent's completeness-check cost rises during the move itself — every caller must be updated, and the agent re-reads each site to confirm the dispatch now points at B.

**Relief:** The method's data sits inside the agent's current reasoning context; verifying behavior touches one class instead of two. The agent's token cost per edit drops because the relevant surface fits in one read, and the reasoning-step cost of cross-class reasoning disappears — invariants on B's fields are checkable from B's body alone.

**Trap:** Mechanical move-the-method-to-the-data on every cross-class read creates a fan-out the agent follows at every call site — the cure becomes a worse smell than the original. Context-window load now rises on B's class as it accumulates methods that belong elsewhere; B becomes a god-class the agent loads as a tangle.

**Apply refactorings:** Move Function, Extract Function
