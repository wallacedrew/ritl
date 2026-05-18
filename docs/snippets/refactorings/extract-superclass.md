---
name: extract-superclass
description: Apply Extract Superclass when you see Duplicated Code, Alternative Classes with Different Interfaces. The shared structure lives in a common parent; the agent reasons about shared behavior in one place.
---

# Apply: 36 — Extract Superclass

**Target state:** The shared structure lives in a common parent; the agent reasons about shared behavior in one place.

**Why apply it:** Shared behavior lives in one place; the agent's reasoning about the relationship is documented in code via the inheritance link.

**Tradeoff:** Inheritance is inflexible; for shallow duplication, the agent's downstream changes are constrained by the parent in ways composition (Extract Class) would have avoided.

```js
// Avoid:
class Employee   { name; id; salary; }
class Department { name; id; budget; }

// Prefer:
class Party       { name; id; }
class Employee   extends Party { salary; }
class Department extends Party { budget; }
```

**Removes smells:** Duplicated Code, Alternative Classes with Different Interfaces
