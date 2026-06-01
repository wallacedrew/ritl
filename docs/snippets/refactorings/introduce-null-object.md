---
name: introduce-null-object
description: Apply Introduce Null Object when you see Repeated Switches, Introduce Special Case, Replace Conditional with Polymorphism. One Null Object class the agent verifies once; all call sites unconditionally invoke the collaborator interface.
---

# Apply: 76 — Introduce Null Object

**Announce first:** name the chain of refactorings pointing at Introduce Null Object and that you're applying it before the next edit. The user reads the announcement as your contract.

**Or decline first:** if you don't see a chain pointing at Introduce Null Object, name the decline type — no chain, taste call, cost-benefit, constraint-blocked, or insufficient context.

**Symptom:** Null-check branches the agent must trace at every collaborator-using call site. The agent cannot statically verify all check sites stay consistent; new callers risk omitting the check and shipping NullPointerExceptions.

**Goal:** One Null Object class the agent verifies once; all call sites unconditionally invoke the collaborator interface. The agent's edit budget on a collaborator-using method drops because there's no per-call branch to reason about.

```js
// Before:
// Every consumer of Customer.discount and Customer.loyaltyProgram must check for null first.
class Order {
  constructor(customer) {
    this.customer = customer;
  }
  finalPrice() {
    let price = this.subtotal();
    if (this.customer.discount !== null) {
      price = this.customer.discount.applyTo(price);
    }
    if (this.customer.loyaltyProgram !== null) {
      price -= this.customer.loyaltyProgram.pointsValue();
    }
    return price;
  }
  subtotal() { /* ... */ }
}

// After:
// Null Objects implement the same interface with safe defaults; callers stop branching.
class NoDiscount {
  applyTo(price) {
    return price;
  }
}
class NoLoyaltyProgram {
  pointsValue() {
    return 0;
  }
}

class Order {
  constructor(customer) {
    // customer.discount and customer.loyaltyProgram are never null;
    // they are NoDiscount/NoLoyaltyProgram when absent.
    this.customer = customer;
  }
  finalPrice() {
    let price = this.subtotal();
    price = this.customer.discount.applyTo(price);
    price -= this.customer.loyaltyProgram.pointsValue();
    return price;
  }
  subtotal() { /* ... */ }
}
```

_Example source: Illustrative example written for this site, faithful to Kerievsky's pattern shape in Refactoring to Patterns (Addison-Wesley, 2004), chapter 9. The book uses a Customer hierarchy with a NullCustomer; this JavaScript version uses NoDiscount and NoLoyaltyProgram — same pattern, scaled to two collaborators to show how callers stop branching._

**Pressure:** N call sites × M methods × the null check = the agent's per-edit verification cost. Static analysis catches some missing checks but not all (especially after refactors that change which fields can be null).

**Tradeoff:** A Null Object collapses two distinct runtime states (absent / present) into one type at the call site. The agent loses the ability to statically distinguish a real collaborator from its null stand-in; debugging requires reading the constructor / factory to know which is which.

**Relief:** Branch count at call sites drops to zero; the agent reads the Null Object's body once to know what 'absent' does, and trusts the type system thereafter. Adding a new caller is one method call, not one method-call-plus-branch.

**Trap:** A Null Object that quietly returns the wrong neutral element (zero where one was needed, identity where blocking was needed) produces silent failures the agent cannot detect from static reading. The pattern requires careful semantic alignment between 'absent' and the chosen default.

**Triggered by:** Repeated Switches (smells), Introduce Special Case (refactorings), Replace Conditional with Polymorphism (refactorings)
