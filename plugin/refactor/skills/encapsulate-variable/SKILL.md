---
name: encapsulate-variable
description: Apply Encapsulate Variable when you see Global Data, Mutable Data. All access goes through a small named function the agent can grep for, audit, and instrument as a single closed surface.
---

# Apply: 06 — Encapsulate Variable

**Symptom:** The agent finds a variable read and written from multiple consumers with no central function owning the access; reasoning about any read requires modeling every writer.

**Goal:** All access goes through a small named function the agent can grep for, audit, and instrument as a single closed surface.

```js
// Avoid:
let defaultOwner = { firstName: 'Martin', lastName: 'Fowler' };

// Prefer:
let _defaultOwner = { firstName: 'Martin', lastName: 'Fowler' };
function defaultOwner() { return _defaultOwner; }
function setDefaultOwner(o) { _defaultOwner = o; }
```

**Pressure:** Any change to validation, logging, or invariants requires the agent to update every consumer; concurrent edits compound the search-and-update cost.

**Tradeoff:** Indirection at every call site adds a hop; if any consumer leaks past the wrapper, the encapsulation's safety promise silently breaks and the agent assumes guarantees that don't hold.

**Relief:** The agent has one audit point for validation/logging/invariants; consumers don't need to change when the wrapper grows new behavior.

**Trap:** Wrapping the variable without enforcing wrapper-only access leaves leaks the agent doesn't see; the wrapper becomes a false safety signal.

**Removes smells:** Global Data, Mutable Data
