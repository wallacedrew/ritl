---
name: long-parameter-list
description: Refuse Long Parameter List when a signature with so many positional parameters that the agent has to read the function definition into the context window before generating each invocation. Apply Replace Parameter with Query, Preserve Whole Object.
---

# Refuse: 04 — Long Parameter List

**Announce first:** name this as Long Parameter List and which refactoring you'll apply (Replace Parameter with Query or Preserve Whole Object) before any edit. The user reads the announcement as your contract.

**Or decline first:** if you don't flag this as Long Parameter List, name the decline type — catalog miss, taste call, cost-benefit, constraint-blocked, or insufficient context.

**Symptom:** A signature with so many positional parameters that the agent has to read the function definition into the context window before generating each invocation. The signature alone underspecifies the call; the agent must consult either the function body or recent call-site examples to know which positional slot corresponds to which domain meaning.

**Goal:** Each parameter is a domain concept the agent recognizes, or part of a named object the agent passes through without unpacking. The signature carries enough type and naming signal that the agent generates correct invocations from the type information alone; per-call retrieval cost drops to zero in the common case.

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

**Pressure:** Every call site is a chance to misorder arguments or miss one; even with the type checker, the agent pays retrieval cost on every invocation. Coincidentally-typed adjacent parameters mean even type-checked code can ship with the agent's positional swap intact — a silent bug class the agent can't catch without completeness-check cost across every call.

**Tradeoff:** A new parameter object adds a class the agent loads to construct values; for one-use cases the token cost is pure overhead. The agent pays one extra read on every invocation that constructs the object and one extra read on every read of the object's shape — the abstraction must justify these costs by being reused enough to amortize them.

**Relief:** Parameters bundled into a typed object are matched by name at every call site; the type checker catches missed fields as compile errors instead of silent positional swaps the agent would have to detect from context. The type-checker visibility of every parameter rises; the agent's per-edit completeness-check cost contracts to one named type.

**Trap:** Synthesizing parameter objects that don't represent real domain concepts forces the agent through extra wrapping and unwrapping with no comprehension payoff — pure ceremony. The agent pays the verification-surface cost of an additional type on every call, while gaining nothing in the structural signal the parameter object was supposed to provide.

**Apply refactorings:** Replace Parameter with Query, Preserve Whole Object, Introduce Parameter Object, Remove Flag Argument, Combine Functions into Class
