### Apply: 03 — Extract Variable

**Target state:** A complex expression earns a name that says what it represents in the domain.

**Why apply it:** Reusable in nearby code; debugging shows the intermediate value; comments explaining the expression become unnecessary.

**Pitfall:** Over-extracting tiny expressions clutters scope with one-shot names; extract when the expression carries domain meaning the surrounding code can't speak.

```js
// Avoid:
if (order.qty * order.price - Math.max(0, order.qty - 500) * order.price * 0.05 > 1000) {
  /* ... */
}

// Prefer:
const basePrice = order.qty * order.price;
const discount = Math.max(0, order.qty - 500) * order.price * 0.05;
if (basePrice - discount > 1000) {
  /* ... */
}
```

**Removes smells:** Mysterious Name, Comments
