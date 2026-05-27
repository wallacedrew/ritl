---
name: replace-hard-coded-notifications-with-observer
description: Apply Replace Hard-Coded Notifications With Observer when you see Insider Trading, Extract Class, Move Function. The publisher is short and consumer-agnostic; the agent reads it once and trusts it.
---

# Apply: 20 — Replace Hard-Coded Notifications With Observer

**Symptom:** Publisher methods the agent must trace through to know what side effects occur. Adding a new consumer requires editing the publisher; per-edit context cost grows with consumer count; tests for the publisher load every consumer's mock.

**Goal:** The publisher is short and consumer-agnostic; the agent reads it once and trusts it. Each consumer is one file with one event-handling concern; the agent verifies each consumer in isolation.

```js
// Before:
// Cart knows which collaborators to notify and how.
class Cart {
  constructor(inventory, analytics, shipping) {
    this.items = [];
    this.inventory = inventory;
    this.analytics = analytics;
    this.shipping = shipping;
  }
  addItem(item, quantity) {
    this.items.push({ item, quantity });
    this.inventory.reserve(item, quantity);
    this.analytics.recordAdd(item, quantity);
    this.shipping.updateEstimate(this.items);
  }
}

// After:
// Cart publishes events; listeners subscribe at the composition root.
class Cart {
  constructor() {
    this.items = [];
    this.listeners = [];
  }
  subscribe(listener) {
    this.listeners.push(listener);
  }
  addItem(item, quantity) {
    this.items.push({ item, quantity });
    this.notify({ type: 'item-added', item, quantity, cart: this });
  }
  notify(event) {
    this.listeners.forEach((listener) => listener.handle(event));
  }
}

class InventoryListener {
  constructor(inventory) { this.inventory = inventory; }
  handle(event) {
    if (event.type === 'item-added') this.inventory.reserve(event.item, event.quantity);
  }
}
class AnalyticsListener {
  constructor(analytics) { this.analytics = analytics; }
  handle(event) {
    if (event.type === 'item-added') this.analytics.recordAdd(event.item, event.quantity);
  }
}
class ShippingListener {
  constructor(shipping) { this.shipping = shipping; }
  handle(event) {
    if (event.type === 'item-added') this.shipping.updateEstimate(event.cart.items);
  }
}

const cart = new Cart();
cart.subscribe(new InventoryListener(inventory));
cart.subscribe(new AnalyticsListener(analytics));
cart.subscribe(new ShippingListener(shipping));
```

_Example source: Illustrative example written for this site, faithful to Kerievsky's pattern shape in Refactoring to Patterns (Addison-Wesley, 2004), chapter 10. The book uses a Stock class with hard-coded calls to InvestmentTracker and PortfolioView; this JavaScript version uses a Cart with three listeners — same pattern, e-commerce host._

**Pressure:** Hard-coded notifications couple the publisher to the full consumer surface. The agent's per-publisher-edit verification cost scales with consumer count; static analysis cannot enforce that the publisher's events fully describe its state changes.

**Tradeoff:** Observer's dynamic dispatch defeats static call-graph analysis at the event boundary. The agent cannot statically determine which listeners fire on which events without reading the subscription wiring; ordering assumptions are invisible in the code.

**Relief:** Diff surface for adding a consumer is one new file. Publisher tests don't load consumer mocks; consumer tests don't load the publisher. Static analysis of the publisher's surface is unburdened by downstream collaborators.

**Trap:** Subscription wiring scattered across the composition root requires the agent to grep for `subscribe(` calls to enumerate the consumer set. Stale subscriptions (uncleaned references) cause hard-to-debug memory and behaviour leaks the agent cannot detect statically.

**Triggered by:** Insider Trading (smells), Extract Class (refactorings), Move Function (refactorings)
