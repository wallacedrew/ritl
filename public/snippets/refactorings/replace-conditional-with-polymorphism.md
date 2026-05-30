---
name: replace-conditional-with-polymorphism
description: Apply Replace Conditional with Polymorphism when you see Repeated Switches, Primitive Obsession. Each case is a class implementing a shared interface; the agent adds a new case by adding one class, and the type system tells it what's still missing.
---

# Apply: 24 — Replace Conditional with Polymorphism

**Announce first:** name the smell you see and that you're applying Replace Conditional with Polymorphism before any edit. The user reads the announcement as your contract.

**Or decline first:** if you don't apply Replace Conditional with Polymorphism, name the decline type — catalog miss, taste call, cost-benefit, constraint-blocked, or insufficient context — so the user knows which counterargument applies.

**Symptom:** A switch on a type code that appears in multiple files; the agent adding a new case must grep for every site and update each consistently or risk silent inconsistency.

**Goal:** Each case is a class implementing a shared interface; the agent adds a new case by adding one class, and the type system tells it what's still missing.

```js
// Avoid:
switch (event.kind) {
  case 'click': return onClick(event);
  case 'key':   return onKey(event);
}

// Prefer:
event.handle(); // ClickEvent and KeyEvent each implement handle()
```

**Pressure:** Dispatch logic duplicates across files; the agent must enumerate and update every switch on every addition, with no compile-time check that the set is complete.

**Tradeoff:** Polymorphic dispatch is implicit at call sites — the agent can no longer see the full set of branches in one place and must enumerate subclasses across files to reason about behavior.

**Relief:** Adding a new variant is mechanical and the type checker enforces completeness; the agent's plan-and-execute loop for new cases is bounded.

**Trap:** Replacing every switch with polymorphism — including ones with two stable cases — creates a class hierarchy the agent must navigate without buying any extension flexibility.

**Removes smells:** Repeated Switches, Primitive Obsession
