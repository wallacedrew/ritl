---
name: split-phase
description: Apply Split Phase when you see Divergent Change, Long Function. Each phase reads and writes its own well-defined inputs and outputs; the seam between them is data, not control flow.
---

# Apply: 11 — Split Phase

**Target state:** Each phase reads and writes its own well-defined inputs and outputs; the seam between them is data, not control flow.

**Why apply it:** Phases evolve independently; tests target each phase in isolation; the intermediate shape becomes a documented contract.

**Tradeoff:** An intermediate data structure between the phases is overhead — earn it by separating two clearly different concerns.

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
