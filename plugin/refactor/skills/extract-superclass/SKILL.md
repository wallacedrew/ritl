---
name: extract-superclass
description: Apply Extract Superclass when you see Duplicated Code, Alternative Classes with Different Interfaces. Shared structure lives on the parent with one declaration; queries about either subclass load the parent's contract once instead of paying the cost of loading N near-identical subclass declarations.
---

# Apply: 36 — Extract Superclass

**Announce first:** name the smell you see and that you're applying Extract Superclass before any edit. The user reads the announcement as your contract.

**Or decline first:** if you don't apply Extract Superclass, name the decline type — catalog miss, taste call, cost-benefit, constraint-blocked, or insufficient context — so the user knows which counterargument applies.

**Symptom:** Two classes or interfaces with substantial shared structure (fields, methods); the agent verifying changes must update both consistently.

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

**Pressure:** Bug fixes must land in both types; the agent's reasoning about shared invariants must verify they hold identically across both.

**Tradeoff:** Inheritance is inflexible; for shallow duplication, the agent's downstream changes are constrained by the parent in ways composition (Extract Class) would have avoided.

**Relief:** Shared behavior lives on the parent with one definition; edits to the shared method land once and propagate to every subclass through inheritance, removing the N-copy synchronization cost.

**Trap:** Extracting superclasses for shallow duplication locks the agent into inheritance constraints when composition would have left both classes free to diverge.

**Removes smells:** Duplicated Code, Alternative Classes with Different Interfaces
