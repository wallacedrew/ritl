---
name: encapsulate-variable
description: Apply Encapsulate Variable when you see Global Data, Mutable Data. All reads and writes pass through a small named function that owns validation, logging, and invariants.
---

# Apply: 06 — Encapsulate Variable

**Target state:** All reads and writes pass through a small named function that owns validation, logging, and invariants.

**Why apply it:** A bug fix or audit becomes a one-line addition inside the wrapper; consumers never need to change.

**Pitfall:** Adds a layer of indirection that pays off only when every access goes through the wrapper — leakage of direct access undoes the benefit.

```js
// Avoid:
let defaultOwner = { firstName: "Martin", lastName: "Fowler" };

// Prefer:
let _defaultOwner = { firstName: "Martin", lastName: "Fowler" };
function defaultOwner() {
  return _defaultOwner;
}
function setDefaultOwner(o) {
  _defaultOwner = o;
}
```

**Removes smells:** Global Data, Mutable Data
