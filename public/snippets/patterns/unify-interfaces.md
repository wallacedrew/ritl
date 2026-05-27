---
name: unify-interfaces
description: Apply Unify Interfaces when you see Alternative Classes with Different Interfaces, Change Function Declaration, Pull Up Method. One canonical name per operation across the codebase; the agent's static reasoning about 'where is X called?' returns a complete answer.
---

# Apply: 27 — Unify Interfaces

**Symptom:** Accidental name divergence across N classes the agent must remember when reading or editing code. Search results for one operation miss the variants under different names; refactoring tools can't unify the rename without manual mapping.

**Goal:** One canonical name per operation across the codebase; the agent's static reasoning about 'where is X called?' returns a complete answer. Per-class behaviour is verified once against the canonical interface.

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

**Relief:** Static analysis returns complete results; the agent's verification budget on cross-class edits drops to the unified surface. Diff surface for future variants is well-defined: implement the canonical names.

**Trap:** Unifying names across two classes whose operations only superficially match silently misleads future readers. The agent reads `findById` on both and assumes equivalent behaviour; when one has implicit side effects the other doesn't, the trap is hard to detect statically. Verify behaviour matches before unifying names.

**Triggered by:** Alternative Classes with Different Interfaces (smells), Change Function Declaration (refactorings), Pull Up Method (refactorings)
