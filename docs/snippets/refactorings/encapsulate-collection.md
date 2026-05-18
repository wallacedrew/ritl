---
name: encapsulate-collection
description: Apply Encapsulate Collection when you see Mutable Data, Insider Trading. The owner exposes mutation methods (add, remove, replace); reads return snapshots or iterators; the agent reasons about collection invariants on the owner alone.
---

# Apply: 52 — Encapsulate Collection

**Target state:** The owner exposes mutation methods (add, remove, replace); reads return snapshots or iterators; the agent reasons about collection invariants on the owner alone.

**Why apply it:** The owner enforces invariants in one place; the agent refactoring the collection's internal shape stays local to the owner.

**Tradeoff:** Returning a shallow copy on every read can hide bugs where callers expected mutation-back; the agent must be explicit about the read contract or risk silent no-ops.

```js
// Avoid:
class Person {
  courses;
  getCourses() { return this.courses; }
}

// Prefer:
class Person {
  #courses = [];
  courses()       { return [...this.#courses]; }
  enroll(course)  { this.#courses.push(course); }
  drop(course)    { this.#courses = this.#courses.filter(c => c !== course); }
}
```

**Removes smells:** Mutable Data, Insider Trading
