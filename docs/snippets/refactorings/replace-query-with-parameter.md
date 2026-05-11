### Apply: 59 — Replace Query with Parameter

**Target state:** A function that reads from a query (global, singleton, instance state) instead accepts the value as a parameter and becomes referentially transparent.

**Why apply it:** The function becomes testable in isolation; its dependencies are visible in its signature; pure-function reasoning becomes possible.

**Pitfall:** Passing the value pushes the responsibility onto callers; for many call sites, signatures grow noisily — prefer this when the query touches global or volatile state.

```js
// Avoid:
function rebate(order) {
  return order.total * currency().rate;
}

// Prefer:
function rebate(order, rate) {
  return order.total * rate;
}
```

**Removes smells:** Mutable Data, Insider Trading
