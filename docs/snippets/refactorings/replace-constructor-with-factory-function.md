---
name: replace-constructor-with-factory-function
description: Apply Replace Constructor with Factory Function when you see Primitive Obsession, Speculative Generality. Construction goes through a named factory the agent can extend with validation, polymorphism, or caching as one location.
---

# Apply: 32 — Replace Constructor with Factory Function

**Target state:** Construction goes through a named factory the agent can extend with validation, polymorphism, or caching as one location.

**Why apply it:** The agent extends construction in one place; consumers don't depend on which concrete class they're getting.

**Tradeoff:** The factory hides the actual class from callers; the agent must ensure the factory's name still expresses the produced shape clearly or call sites become opaque.

```js
// Avoid:
const employee = new Employee(name, 'engineer', salary);

// Prefer:
function createEngineer(name, salary) {
  return new Employee(name, 'engineer', salary);
}
const employee = createEngineer(name, salary);
```

**Removes smells:** Primitive Obsession, Speculative Generality
