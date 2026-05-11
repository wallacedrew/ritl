---
name: encapsulate-collection
description: Apply Encapsulate Collection when you see Mutable Data, Insider Trading. A class's internal collection is never returned directly; callers add or remove via methods on the class, and reads return a snapshot or iterator.
---

# Apply: 52 — Encapsulate Collection

**Target state:** A class's internal collection is never returned directly; callers add or remove via methods on the class, and reads return a snapshot or iterator.

**Why apply it:** The owner can enforce invariants (uniqueness, ordering, max size); refactoring the collection's internal shape is local.

**Pitfall:** Returning a shallow copy on every read can hide bugs where callers expected mutation to be reflected — be explicit about the contract.

```js
// Avoid:
class Person {
  courses;
  getCourses() {
    return this.courses;
  }
}

// Prefer:
class Person {
  #courses = [];
  courses() {
    return [...this.#courses];
  }
  enroll(course) {
    this.#courses.push(course);
  }
  drop(course) {
    this.#courses = this.#courses.filter((c) => c !== course);
  }
}
```

**Removes smells:** Mutable Data, Insider Trading
