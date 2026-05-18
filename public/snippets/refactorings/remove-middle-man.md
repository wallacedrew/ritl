---
name: remove-middle-man
description: Apply Remove Middle Man when you see Middle Man. Callers talk to the real object directly; the agent's call traces are shorter and the implementation's location is obvious.
---

# Apply: 42 — Remove Middle Man

**Target state:** Callers talk to the real object directly; the agent's call traces are shorter and the implementation's location is obvious.

**Why apply it:** Fewer files; shorter call stacks; the agent's plan-and-execute loop touches the real implementation directly.

**Tradeoff:** Direct access exposes the real object's full surface to every consumer; the agent loses any encapsulation the middle man was providing (even if mostly cosmetic).

```js
// Avoid:
class Manager {
  reports() { return this.team.members(); }
}

// Prefer:
// Expose team directly when the wrapper adds nothing.
manager.team.members();
```

**Removes smells:** Middle Man
