---
name: split-phase
description: Apply Split Phase when you see Divergent Change, Long Function. Each phase reads and writes its own well-defined inputs and outputs; the agent reasons about phases independently with the intermediate shape as the contract.
---

# Apply: 11 — Split Phase

**Target state:** Each phase reads and writes its own well-defined inputs and outputs; the agent reasons about phases independently with the intermediate shape as the contract.

**Why apply it:** Each phase becomes the agent's unit of reasoning; the intermediate shape documents the contract; testing and modification isolate to one phase at a time.

**Tradeoff:** The intermediate data structure is overhead; for functions where the two phases are tightly coupled (shared mutable locals, observer effects), splitting adds a seam without buying isolation.

```js
// Avoid:
function priceAndRender(input) {
  let total = 0;
  for (const item of input.items) total += item.qty * item.price;
  if (input.member) total *= 0.95;
  return `<p>Total: ${(total / 100).toFixed(2)} for ${input.items.length} items</p>`;
}

// Prefer:
function pricing(input) {
  let total = 0;
  for (const item of input.items) total += item.qty * item.price;
  if (input.member) total *= 0.95;
  return { items: input.items, totalCents: total };
}
function render({ items, totalCents }) {
  return `<p>Total: ${(totalCents / 100).toFixed(2)} for ${items.length} items</p>`;
}
```

**Removes smells:** Divergent Change, Long Function
