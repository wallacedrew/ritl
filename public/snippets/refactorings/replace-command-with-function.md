---
name: replace-command-with-function
description: Apply Replace Command with Function when you see Speculative Generality, Lazy Element. The command collapses to a plain function; the agent's call sites become direct invocations.
---

# Apply: 49 — Replace Command with Function

**Target state:** The command collapses to a plain function; the agent's call sites become direct invocations.

**Why apply it:** Fewer files; shorter call stacks; the agent's plan-and-execute loop touches the function directly without the construct-then-call hop.

**Tradeoff:** If the command held genuinely useful intermediate state, collapsing regrows the temps it eliminated; the agent verifying the collapse must check whether any internal decomposition is load-bearing.

```js
// Avoid:
class ChargeCalculator {
  constructor(c, o) { this.c = c; this.o = o; }
  execute() { return this.c.base + this.o.tax; }
}
new ChargeCalculator(c, o).execute();

// Prefer:
function charge(c, o) { return c.base + o.tax; }
charge(c, o);
```

**Removes smells:** Speculative Generality, Lazy Element
