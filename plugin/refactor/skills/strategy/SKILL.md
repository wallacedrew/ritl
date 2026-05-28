---
name: strategy
description: Apply Strategy when you see Repeated Switches, Replace Conditional with Polymorphism, Move Function. One strategy interface and N small implementations the agent reads independently.
---

# Apply: 48 — Strategy

**Symptom:** Algorithm-specific code lives inside a host class with type-tag dispatch the agent must read to understand variant behaviour. Adding an algorithm requires the agent to edit the host; the diff blast radius is unpredictable; per-algorithm tests require constructing the host's full graph.

**Goal:** One strategy interface and N small implementations the agent reads independently. Per-algorithm verification is one-file-scoped; strategy selection is one expression at the construction site; the host's relevant method is a one-line delegation.

```js
// Before:
class Order {
  constructor(shippingType) {
    this.shippingType = shippingType;
  }
  shippingCost(weight, distance) {
    if (this.shippingType === 'standard') {
      return weight * 0.5 + distance * 0.01;
    } else if (this.shippingType === 'express') {
      return weight * 1.0 + distance * 0.02 + 5;
    } else if (this.shippingType === 'overnight') {
      return weight * 2.0 + distance * 0.05 + 15;
    }
    throw new Error(`unknown shippingType: ${this.shippingType}`);
  }
}
// Adding 'two-day' or 'international' = a new branch.
// Testing one algorithm requires constructing a full Order.

// After:
class StandardShipping {
  calculate(weight, distance) {
    return weight * 0.5 + distance * 0.01;
  }
}
class ExpressShipping {
  calculate(weight, distance) {
    return weight * 1.0 + distance * 0.02 + 5;
  }
}
class OvernightShipping {
  calculate(weight, distance) {
    return weight * 2.0 + distance * 0.05 + 15;
  }
}
class Order {
  constructor(shippingStrategy) {
    this.shippingStrategy = shippingStrategy;
  }
  shippingCost(weight, distance) {
    return this.shippingStrategy.calculate(weight, distance);
  }
}
const order = new Order(new ExpressShipping());
const cost = order.shippingCost(5, 200);
```

_Example source: Illustrative example written for this site in the spirit of Design Patterns (Gamma, Helm, Johnson, Vlissides, Addison-Wesley, 1994), chapter 5. The book uses a Composition class with line-breaking strategies; this JavaScript adaptation uses shipping-cost algorithms to make the family-of-interchangeable-formulas shape concrete without overlapping with Kerievsky's loan-calculator example for the same pattern._

**Pressure:** Type-tag dispatch inside the host blows up the agent's context budget on every algorithm-related edit. Tests for one algorithm pulling in the host's collaborator graph multiply the agent's setup cost per per-algorithm verification.

**Tradeoff:** N strategy classes is N files the agent navigates per algorithm-related task. Strategy interface design matters — extra optional methods bloat every implementation and force per-implementation no-op tests the agent must verify.

**Relief:** Per-algorithm reasoning is one-file; tests are unit-sized; static analysis enumerates strategies by interface; the host class is a stable surface the agent reads once. Diff surface for a new algorithm is a new file + one construction-site edit.

**Trap:** Strategy interfaces with optional methods (some algorithms implement calibrate(), others do not) blur the contract. The agent must verify per-implementation interface completeness rather than reading the interface as a structural promise. Define one focused interface, or split the family by capability.

**Triggered by:** Repeated Switches (smells), Replace Conditional with Polymorphism (refactorings), Move Function (refactorings)
