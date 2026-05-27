---
name: move-creation-knowledge-to-factory
description: Apply Move Creation Knowledge To Factory when you see Long Function, Extract Class, Move Function. One factory file the agent reads as the construction contract; callers are short delegations the agent treats opaquely.
---

# Apply: 15 — Move Creation Knowledge To Factory

**Symptom:** Construction recipes duplicated across N caller sites the agent must verify match on every recipe change. Each call site assembles the object with its own subset of defaults; the agent cannot statically guarantee the assemblies stay consistent.

**Goal:** One factory file the agent reads as the construction contract; callers are short delegations the agent treats opaquely. Per-edit budget for a recipe change collapses to one file.

```js
// Before:
// The caller knows the entire assembly recipe.
function placeOrder(customerId, line1, city, postal, items, jurisdiction) {
  const customer = new Customer(customerId);
  const address = new Address(line1, city, postal);
  customer.setShippingAddress(address);
  customer.setBillingAddress(address);
  const order = new Order(customer);
  for (const item of items) {
    const lineItem = new LineItem(item.product, item.quantity);
    lineItem.applyDiscount(customer.discountRate);
    order.addLineItem(lineItem);
  }
  order.calculateTotal();
  order.applyTax(jurisdiction);
  return order;
}

// After:
// The factory owns the recipe; the caller asks for a finished order.
class OrderFactory {
  constructor(taxJurisdiction) {
    this.taxJurisdiction = taxJurisdiction;
  }
  createOrder(customerId, line1, city, postal, items) {
    const customer = this.buildCustomer(customerId, line1, city, postal);
    const order = new Order(customer);
    items.forEach((item) => order.addLineItem(this.buildLineItem(item, customer)));
    order.calculateTotal();
    order.applyTax(this.taxJurisdiction);
    return order;
  }
  buildCustomer(customerId, line1, city, postal) {
    const customer = new Customer(customerId);
    const address = new Address(line1, city, postal);
    customer.setShippingAddress(address);
    customer.setBillingAddress(address);
    return customer;
  }
  buildLineItem(item, customer) {
    const lineItem = new LineItem(item.product, item.quantity);
    lineItem.applyDiscount(customer.discountRate);
    return lineItem;
  }
}

// Client:
const factory = new OrderFactory(jurisdiction);
const order = factory.createOrder(customerId, line1, city, postal, items);
```

_Example source: Illustrative example written for this site, faithful to Kerievsky's pattern shape in Refactoring to Patterns (Addison-Wesley, 2004), chapter 6. The book pulls complex assembly out of client code into a dedicated factory; this JavaScript version uses an order-with-line-items + customer-with-addresses assembly, distinct from Encapsulate Classes With Factory whose focus is subclass hiding._

**Pressure:** Recipe duplication × N callers × M recipe steps inflates the agent's context cost on every assembly-related edit. Subtle inconsistencies between caller-side recipes are invisible until they manifest as bugs; static reasoning cannot enforce 'every caller applies the discount'.

**Tradeoff:** A factory hides construction details from the call site; the agent must read the factory to know what the returned object actually carries. Static type information at the call site narrows to the return type, with construction-level invariants pushed inside the factory.

**Relief:** Diff surface for a recipe change is one file. Tests cover the factory's contract once; per-call-site behaviour reduces to verifying the intent, not the assembly. Recipe drift across callers becomes statically impossible.

**Trap:** A factory whose recipe is itself a long sequence of conditional steps can become as opaque as the duplicated callers were — the agent must trace the factory body line-by-line to know what came out. The pattern's gain materializes when the factory's recipe is itself decomposed into named build steps.

**Triggered by:** Long Function (smells), Extract Class (refactorings), Move Function (refactorings)
