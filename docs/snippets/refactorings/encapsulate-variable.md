---
name: encapsulate-variable
description: Apply Encapsulate Variable when you see Global Data, Mutable Data. All access goes through a small named function the agent can grep for, audit, and instrument as a single closed surface.
---

# Apply: 06 — Encapsulate Variable

**Target state:** All access goes through a small named function the agent can grep for, audit, and instrument as a single closed surface.

**Why apply it:** The agent has one audit point for validation/logging/invariants; consumers don't need to change when the wrapper grows new behavior.

**Tradeoff:** Indirection at every call site adds a hop; if any consumer leaks past the wrapper, the encapsulation's safety promise silently breaks and the agent assumes guarantees that don't hold.

```js
// Avoid:
let defaultOwner = { firstName: 'Martin', lastName: 'Fowler' };

// Prefer:
let _defaultOwner = { firstName: 'Martin', lastName: 'Fowler' };
function defaultOwner() { return _defaultOwner; }
function setDefaultOwner(o) { _defaultOwner = o; }
```

**Removes smells:** Global Data, Mutable Data
