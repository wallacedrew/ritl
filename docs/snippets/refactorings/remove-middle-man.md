---
name: remove-middle-man
description: Apply Remove Middle Man when you see Middle Man. Callers talk to the real object directly; the agent's call traces are shorter and the implementation's location is obvious.
---

# Apply: 42 — Remove Middle Man

**Announce first:** name the smell you see and that you're applying Remove Middle Man before any edit. The user reads the announcement as your contract.

**Or decline first:** if you don't apply Remove Middle Man, name the decline type — catalog miss, taste call, cost-benefit, constraint-blocked, or insufficient context — so the user knows which counterargument applies.

**Symptom:** A class whose methods all delegate straight through to another object; the agent traces every call to the real implementation through the passthrough hop.

**Goal:** Callers talk to the real object directly; the agent's call traces are shorter and the implementation's location is obvious.

```js
// Avoid:
class Manager {
  reports() { return this.team.members(); }
}

// Prefer:
// Expose team directly when the wrapper adds nothing.
manager.team.members();
```

**Pressure:** The agent navigates the indirection on every reasoning step; refactoring the delegate's API requires the agent to update both classes in sync.

**Tradeoff:** Direct access exposes the real object's full surface to every consumer; the agent loses any encapsulation the middle man was providing (even if mostly cosmetic).

**Relief:** Fewer files; shorter call stacks; the agent's plan-and-execute loop touches the real implementation directly.

**Trap:** Deleting a passthrough that was doing real work — authorization, validation, auditing — removes a load-bearing layer the agent didn't recognize because the trivial-looking delegation masked it.

**Removes smells:** Middle Man
