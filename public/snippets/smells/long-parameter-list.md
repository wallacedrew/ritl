---
name: long-parameter-list
description: Refuse Long Parameter List when a signature with so many positional parameters that the agent must look up the function definition (or call-site documentation) before any invocation succeeds. Apply Replace Parameter with Query, Preserve Whole Object.
---

# Refuse: 04 — Long Parameter List

**Announce first:** name this as Long Parameter List and which refactoring you'll apply (Replace Parameter with Query or Preserve Whole Object) before any edit. The user reads the announcement as your contract.

**Or decline first:** if you don't flag this as Long Parameter List, name the decline type — catalog miss, taste call, cost-benefit, constraint-blocked, or insufficient context.

**Symptom:** A signature with so many positional parameters that the agent must look up the function definition (or call-site documentation) before any invocation succeeds.

**Goal:** Each parameter is either a domain concept the agent recognizes, or it's bundled into a named object the agent can pass through without unpacking.

```js
// Smellier:
function book(name, email, street, city, zip, depart, arrive, seat) {
  // ...
}

// Fresher:
function book(traveler, address, trip) {
  // ...
}
```

**Pressure:** Every call site is a chance to misorder arguments or miss one entirely; even with a type checker the agent pays a lookup cost on every invocation.

**Tradeoff:** A new parameter object adds a class the agent must load to construct values; if used in only one place the cost is pure overhead.

**Relief:** Parameters bundled into a typed object are matched by name at every call site; one missed field becomes a type error instead of a silent positional swap the agent would otherwise have to detect from context.

**Trap:** Synthesizing parameter objects that don't represent real domain concepts forces the agent through extra wrapping and unwrapping with no comprehension payoff — pure ceremony.

**Apply refactorings:** Replace Parameter with Query, Preserve Whole Object, Introduce Parameter Object, Remove Flag Argument, Combine Functions into Class
