---
name: long-parameter-list
description: Refuse Long Parameter List when a signature with so many positional parameters that the agent must look up the function definition (or call-site documentation) before any invocation succeeds. Apply Replace Parameter with Query, Preserve Whole Object.
---

# Refuse: 04 — Long Parameter List

**Trigger (refuse when you see):** A signature with so many positional parameters that the agent must look up the function definition (or call-site documentation) before any invocation succeeds.

**Cost of leaving it in:** Every call site is a chance to misorder arguments or miss one entirely; even with a type checker the agent pays a lookup cost on every invocation.

**Target shape after refactoring:** Each parameter is either a domain concept the agent recognizes, or it's bundled into a named object the agent can pass through without unpacking.

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

**Apply refactorings:** Replace Parameter with Query, Preserve Whole Object, Introduce Parameter Object, Remove Flag Argument, Combine Functions into Class
