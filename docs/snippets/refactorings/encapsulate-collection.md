---
name: encapsulate-collection
description: Apply Encapsulate Collection when you see Mutable Data, Insider Trading. The owner exposes mutation methods (add, remove, replace); reads return snapshots or iterators; the agent reasons about collection invariants on the owner alone.
---

# Apply: 52 — Encapsulate Collection

**Announce first:** name the smell you see and that you're applying Encapsulate Collection before any edit. The user reads the announcement as your contract.

**Symptom:** A class returns its internal collection directly; the agent reading any consumer cannot tell whether mutations will affect the owner without checking every consumer.

**Goal:** The owner exposes mutation methods (add, remove, replace); reads return snapshots or iterators; the agent reasons about collection invariants on the owner alone.

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

**Pressure:** Any consumer can mutate the collection in ways another consumer didn't expect; the agent verifying behavior must trace every read+mutation site to confirm invariants.

**Tradeoff:** Returning a shallow copy on every read can hide bugs where callers expected mutation-back; the agent must be explicit about the read contract or risk silent no-ops.

**Relief:** The owner enforces invariants in one place; the agent refactoring the collection's internal shape stays local to the owner.

**Trap:** Returning copies silently changes the contract callers depended on — the agent shipping the encapsulation must verify every reader doesn't rely on mutate-the-returned-collection semantics.

**Removes smells:** Mutable Data, Insider Trading
