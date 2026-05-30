---
name: split-phase
description: Apply Split Phase when you see Divergent Change, Long Function. Each phase reads and writes its own well-defined inputs and outputs; the agent reasons about phases independently with the intermediate shape as the contract.
---

# Apply: 11 — Split Phase

**Announce first:** name the smell you see and that you're applying Split Phase before any edit. The user reads the announcement as your contract.

**Symptom:** The agent finds a function that conflates two concerns in interleaved code; reasoning about either concern requires tracing through the other.

**Goal:** Each phase reads and writes its own well-defined inputs and outputs; the agent reasons about phases independently with the intermediate shape as the contract.

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

**Pressure:** The agent must trace interleaved concerns through one function body; testing or modifying either requires reasoning about both.

**Tradeoff:** The intermediate data structure is overhead; for functions where the two phases are tightly coupled (shared mutable locals, observer effects), splitting adds a seam without buying isolation.

**Relief:** Each phase becomes the agent's unit of reasoning; the intermediate shape documents the contract; testing and modification isolate to one phase at a time.

**Trap:** Splitting tightly-coupled phases creates an artificial seam the agent must coordinate across — the intermediate shape leaks one phase's implementation into the next.

**Removes smells:** Divergent Change, Long Function
