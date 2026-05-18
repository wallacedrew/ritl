---
name: replace-command-with-function
description: Apply Replace Command with Function when you see Speculative Generality, Lazy Element. The command collapses to a plain function; the agent's call sites become direct invocations.
---

# Apply: 49 — Replace Command with Function

**Symptom:** A command class whose execute() does the work in one shot with no sub-step decomposition; callers go through construct-then-call ceremony for what could be one function.

**Goal:** The command collapses to a plain function; the agent's call sites become direct invocations.

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

**Pressure:** Every caller pays the construct-then-call hop; the agent reasoning about behavior loads a class to find a single function.

**Tradeoff:** If the command held genuinely useful intermediate state, collapsing regrows the temps it eliminated; the agent verifying the collapse must check whether any internal decomposition is load-bearing.

**Relief:** Fewer files; shorter call stacks; the agent's plan-and-execute loop touches the function directly without the construct-then-call hop.

**Trap:** Collapsing commands that genuinely decomposed into named sub-steps regrows the temps they eliminated and the function-with-many-locals smell returns.

**Removes smells:** Speculative Generality, Lazy Element
