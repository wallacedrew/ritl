---
name: split-phase
description: Apply Split Phase when you see Divergent Change, Long Function. Each phase reads and writes its own well-defined inputs and outputs; the seam between them is data, not control flow.
---

# Apply: 11 — Split Phase

**Target state:** Each phase reads and writes its own well-defined inputs and outputs; the seam between them is data, not control flow.

**Why apply it:** Phases evolve independently; tests target each phase in isolation; the intermediate shape becomes a documented contract.

**Pitfall:** An intermediate data structure between the phases is overhead — earn it by separating two clearly different concerns.

```js
// Avoid:
function priceAndRender(input) {
  const price = computePrice(input);
  return renderHTML(input, price);
}

// Prefer:
function pricing(input) {
  return { ...input, price: computePrice(input) };
}
function render(priced) {
  return renderHTML(priced);
}
```

**Removes smells:** Divergent Change, Long Function
