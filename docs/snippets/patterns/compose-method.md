---
name: compose-method
description: Apply Compose Method when you see Long Function, Extract Function, Replace Temp with Query. The method reads as a sequence of named operations the agent can verify against without re-deriving the algorithm.
---

# Apply: 01 — Compose Method

**Symptom:** A method whose body the agent must trace line-by-line to understand the algorithm; the high-level shape is obscured by interleaved details. Verifying behavior preservation requires re-reading the entire span on every edit.

**Goal:** The method reads as a sequence of named operations the agent can verify against without re-deriving the algorithm. Each helper is small enough to reason about in a single step.

```js
// Before:
function add(item, quantity) {
  if (this.readOnly) throw new Error('list is read-only');
  const existing = this.items.find(line => line.product.id === item.id);
  if (existing) {
    existing.quantity += quantity;
  } else {
    this.items.push({ product: item, quantity });
    this.items.sort((a, b) => a.product.id - b.product.id);
  }
  this.recalculateTotal();
}

// After:
function add(item, quantity) {
  assertWritable(this);
  const existing = findLineFor(this.items, item);
  if (existing) {
    increaseQuantity(existing, quantity);
  } else {
    insertNewLine(this.items, item, quantity);
  }
  this.recalculateTotal();
}
```

_Example source: Illustrative example written for this site, not a quotation from the book. The pattern itself is Joshua Kerievsky's, from Refactoring to Patterns (Addison-Wesley, 2004)._

**Pressure:** Every edit re-loads the full method body to confirm behavior preservation. Chained orchestration changes compound context cost; reasoning about cross-step invariants gets harder as the method grows.

**Tradeoff:** Each helper inflates context-window cost by one definition the next reasoning step must load. Over-decomposing fragments a single procedure across many files.

**Relief:** The composed method captures the algorithm in named steps; helpers are independently verifiable; refactoring orchestration is a localized change. Smaller diff surface per commit.

**Trap:** A deeply-nested hierarchy of helpers where the agent must chase multiple definitions to understand a single original method — context cost multiplies and cross-helper invariants vanish from view.

**Triggered by:** Long Function (smells), Extract Function (refactorings), Replace Temp with Query (refactorings)
