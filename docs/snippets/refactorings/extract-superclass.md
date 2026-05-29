---
name: extract-superclass
description: Apply Extract Superclass when you see Duplicated Code, Alternative Classes with Different Interfaces. Shared structure lives on the parent with one declaration; queries about either subclass load the parent's contract once instead of paying the cost of loading N near-identical subclass declarations.
---

# Apply: 36 — Extract Superclass

**Symptom:** Two classes with substantial shared structure (fields, methods); the agent verifying changes must update both consistently.

**Goal:** Shared structure lives on the parent with one declaration; queries about either subclass load the parent's contract once instead of paying the cost of loading N near-identical subclass declarations.

```js
// Avoid:
class Employee   { name; id; salary; }
class Department { name; id; budget; }

// Prefer:
class Party       { name; id; }
class Employee   extends Party { salary; }
class Department extends Party { budget; }
```

**Pressure:** Bug fixes must land in both classes; the agent's reasoning about shared invariants must verify they hold identically across both.

**Tradeoff:** Inheritance is inflexible; for shallow duplication, the agent's downstream changes are constrained by the parent in ways composition (Extract Class) would have avoided.

**Relief:** Shared behavior lives on the parent with one definition; edits to the shared method land once and propagate to every subclass through inheritance, removing the N-copy synchronization cost.

**Trap:** Extracting superclasses for shallow duplication locks the agent into inheritance constraints when composition would have left both classes free to diverge.

**Removes smells:** Duplicated Code, Alternative Classes with Different Interfaces
