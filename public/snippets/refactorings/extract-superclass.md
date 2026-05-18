---
name: extract-superclass
description: Apply Extract Superclass when you see Duplicated Code, Alternative Classes with Different Interfaces. The shared structure lives in a common parent; the agent reasons about shared behavior in one place.
---

# Apply: 36 — Extract Superclass

**Symptom:** Two classes with substantial shared structure (fields, methods); the agent verifying changes must update both consistently.

**Goal:** The shared structure lives in a common parent; the agent reasons about shared behavior in one place.

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

**Relief:** Shared behavior lives in one place; the agent's reasoning about the relationship is documented in code via the inheritance link.

**Trap:** Extracting superclasses for shallow duplication locks the agent into inheritance constraints when composition would have left both classes free to diverge.

**Removes smells:** Duplicated Code, Alternative Classes with Different Interfaces
