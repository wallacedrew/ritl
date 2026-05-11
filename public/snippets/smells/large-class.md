---
name: large-class
description: Refuse Large Class when a class with too many fields and methods — multiple unrelated responsibilities under one type. Apply Extract Class, Extract Superclass.
---

# Refuse: 20 — Large Class

**Trigger (refuse when you see):** A class with too many fields and methods — multiple unrelated responsibilities under one type.

**Cost of leaving it in:** Cognitive load: every reader pays for fields they don't care about; merge conflicts spike; testing is unfocused.

**Target shape after refactoring:** Each class has one cohesive purpose; methods cluster around fields they actually use.

```js
// Smellier:
class Order {
  // lineItems, totals, customer info, shipping address, audit log, ...
}

// Fresher:
class Order    { /* lineItems, totals */ }
class Customer { /* name, email */ }
class Shipping { /* address, track */ }
```

**Apply refactorings:** Extract Class, Extract Superclass, Replace Type Code with Subclasses
