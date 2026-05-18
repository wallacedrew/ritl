---
name: replace-conditional-with-polymorphism
description: Apply Replace Conditional with Polymorphism when you see Repeated Switches, Primitive Obsession. Each case is a class implementing a shared interface; the agent adds a new case by adding one class, and the type system tells it what's still missing.
---

# Apply: 24 — Replace Conditional with Polymorphism

**Target state:** Each case is a class implementing a shared interface; the agent adds a new case by adding one class, and the type system tells it what's still missing.

**Why apply it:** Adding a new variant is mechanical and the type checker enforces completeness; the agent's plan-and-execute loop for new cases is bounded.

**Tradeoff:** Polymorphic dispatch is implicit at call sites — the agent can no longer see the full set of branches in one place and must enumerate subclasses across files to reason about behavior.

```js
// Avoid:
switch (event.kind) {
  case 'click': return onClick(event);
  case 'key':   return onKey(event);
}

// Prefer:
event.handle(); // ClickEvent and KeyEvent each implement handle()
```

**Removes smells:** Repeated Switches, Primitive Obsession
