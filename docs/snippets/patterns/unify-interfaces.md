---
name: unify-interfaces
description: Apply Unify Interfaces when you see Alternative Classes with Different Interfaces, Change Function Declaration, Pull Up Method. Each operation has one name across every class that exposes it; a grep for the name returns every call site, and the agent enumerates consumers without paying for an alias map.
---

# Apply: 27 — Unify Interfaces

**Announce first:** name the chain of refactorings pointing at Unify Interfaces and that you're applying it before the next edit. The user reads the announcement as your contract.

**Symptom:** Operations with the same semantics carry different names across N classes; a grep for one name returns one class's call sites, missing the aliases; the agent enumerating consumers pays the cost of knowing the alias map for the operation.

**Goal:** Each operation has one name across every class that exposes it; a grep for the name returns every call site, and the agent enumerates consumers without paying for an alias map.

```js
// Before:
// Two repositories do the same work with accidentally divergent names.
class UserRepository {
  findOne(id) { /* ... */ }
  insert(user) { /* ... */ }
  updateById(id, fields) { /* ... */ }
  remove(id) { /* ... */ }
}

class OrderRepository {
  getById(id) { /* ... */ }
  create(order) { /* ... */ }
  update(id, fields) { /* ... */ }
  delete(id) { /* ... */ }
}

function loadEntity(repo, id) {
  if (repo instanceof UserRepository) return repo.findOne(id);
  return repo.getById(id);
}

// After:
// One method name per operation; both repositories conform.
class UserRepository {
  findById(id) { /* ... */ }
  create(user) { /* ... */ }
  update(id, fields) { /* ... */ }
  delete(id) { /* ... */ }
}

class OrderRepository {
  findById(id) { /* ... */ }
  create(order) { /* ... */ }
  update(id, fields) { /* ... */ }
  delete(id) { /* ... */ }
}

function loadEntity(repo, id) {
  return repo.findById(id);
}
```

_Example source: Illustrative example written for this site, faithful to Kerievsky's pattern shape in Refactoring to Patterns (Addison-Wesley, 2004), chapter 6. Distinct from Unify Interfaces With Adapter (#26): that pattern is for when you cannot edit one of the classes (typically a vendor); Unify Interfaces is for when both classes are yours and the divergence is accidental._

**Pressure:** Inconsistent naming forces the agent to enumerate aliases on every cross-class change. The cost compounds — `find usages` returns partial results; semantic edits miss aliased variants; the agent's confidence in completeness drops.

**Tradeoff:** Renames break external consumers who depend on the old names; the agent must verify the rename's blast radius before applying it. For library code with documented APIs, the rename cost may exceed the consistency gain.

**Relief:** Edits to the operation's contract land against one name across every class; tooling that searches by name returns every call site, and the agent does not pay the alias-mapping cost on cross-class changes.

**Trap:** Unifying names across two classes whose operations only superficially match silently misleads future readers. The agent reads `findById` on both and assumes equivalent behaviour; when one has implicit side effects the other doesn't, the trap is hard to detect statically. Verify behaviour matches before unifying names.

**Triggered by:** Alternative Classes with Different Interfaces (smells), Change Function Declaration (refactorings), Pull Up Method (refactorings)
