### Apply: 08 — Introduce Parameter Object

**Target state:** Related arguments travel together as one well-named value object that the function (and callers) refer to by name.

**Why apply it:** Adding a related field is one type change instead of touching every call site; intent is named.

**Pitfall:** Premature parameter objects hide which fields are actually needed by which method — wait until the clump appears in 3+ places before extracting.

```js
// Avoid:
function record(low, high, value) {
  // ...
}

// Prefer:
class NumberRange { /* low, high */ }
function record(range, value) {
  // ...
}
```

**Removes smells:** Long Parameter List, Data Clumps
