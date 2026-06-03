---
name: facade
description: Apply Facade when you see Message Chains, Insider Trading, Hide Delegate. One Facade method the agent reads end-to-end to understand the full choreography.
---

# Apply: 10 — Facade

**Announce first:** name the chain of refactorings pointing at Facade and that you're applying it before the next edit. The user reads the announcement as your contract.

**Or decline first:** if you don't see a chain pointing at Facade, name the decline type — no chain, taste call, cost-benefit, constraint-blocked, or insufficient context.

**Symptom:** Multi-subsystem orchestration scattered across consumers means the agent must reason about subsystem ordering, error handling, and failure recovery at every call site. Verifying 'do all consumers correctly release inventory on payment-fail' requires enumerating every consumer; static analysis cannot prove uniformity.

**Goal:** One Facade method the agent reads end-to-end to understand the full choreography. Per-consumer reasoning collapses to 'this consumer calls submitOrder(cart, customer)' — the agent does not re-verify orchestration at each consumer site.

```js
// Before:
function checkout(cart, customer) {
  if (!inventory.reserve(cart.items)) {
    throw new Error('out of stock');
  }
  const charge = payment.charge(cart.total, customer.cardToken);
  if (!charge.success) {
    inventory.release(cart.items);
    throw new Error('payment failed');
  }
  const shipment = shipping.createShipment(cart.items, customer.address);
  notifications.sendOrderConfirmation(customer.email, shipment.trackingNumber);
  audit.recordPurchase(customer.id, cart.total);
  return { orderId: shipment.trackingNumber, total: cart.total };
}
// Every consumer that calls checkout knows about 5 subsystems
// and the right ordering. Forgetting inventory.release on payment-fail
// silently leaks reserved inventory.

// After:
class CheckoutFacade {
  constructor(inventory, payment, shipping, notifications, audit) {
    this.inventory = inventory;
    this.payment = payment;
    this.shipping = shipping;
    this.notifications = notifications;
    this.audit = audit;
  }
  submitOrder(cart, customer) {
    if (!this.inventory.reserve(cart.items)) {
      throw new Error('out of stock');
    }
    const charge = this.payment.charge(cart.total, customer.cardToken);
    if (!charge.success) {
      this.inventory.release(cart.items);
      throw new Error('payment failed');
    }
    const shipment = this.shipping.createShipment(cart.items, customer.address);
    this.notifications.sendOrderConfirmation(customer.email, shipment.trackingNumber);
    this.audit.recordPurchase(customer.id, cart.total);
    return { orderId: shipment.trackingNumber, total: cart.total };
  }
}
// Client: checkout.submitOrder(cart, customer)
```

_Example source: Illustrative example written for this site in the spirit of Design Patterns (Gamma, Helm, Johnson, Vlissides, Addison-Wesley, 1994), chapter 4. The book's running example is a compiler with parser/lexer/codegen subsystems; this JavaScript adaptation uses an e-commerce checkout because the multi-subsystem choreography (inventory + payment + shipping + notifications + audit) makes the encapsulation payoff more visible._

**Pressure:** Per-consumer orchestration is N consumers × M subsystems × K error-modes = N×M×K cells the agent verifies on every change. Insider Trading is the worst input shape for the agent's verification budget: every consumer must be checked for correctness against every subsystem's contract.

**Tradeoff:** Facade opacity means runtime errors from inside the facade surface to the consumer as 'submitOrder failed' with no structural breadcrumb. The agent investigating a regression must trace into the facade implementation; stack traces span the facade + subsystem boundary, and the consumer's mental model is one level removed from the actual failure.

**Relief:** Edits scoped to the Facade; consumer code unchanged when subsystems are added or refactored; one set of tests covers orchestration and error recovery exhaustively. The agent's cross-consumer verification budget drops to zero on subsystem changes.

**Trap:** When the Facade grows to N user tasks (submitOrder + refund + modify + audit + ...), it becomes a god object the agent must read fully before any edit. The pattern's clarity wins were proportional to focused scope; god-facade scope reintroduces the verification problem at a higher level.

**Triggered by:** Message Chains (smells), Insider Trading (smells), Hide Delegate (refactorings)
