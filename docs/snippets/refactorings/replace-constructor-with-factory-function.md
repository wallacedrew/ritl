---
name: replace-constructor-with-factory-function
description: Apply Replace Constructor with Factory Function when you see Primitive Obsession, Speculative Generality. Object creation goes through a named function that can validate, choose subclasses, or return cached instances.
---

# Apply: 32 — Replace Constructor with Factory Function

**Target state:** Object creation goes through a named function that can validate, choose subclasses, or return cached instances.

**Why apply it:** Construction can vary per case; consumers don't depend on which concrete class they're getting.

**Pitfall:** Hides the actual class from callers — make sure your factory's name still expresses the produced shape clearly.

```js
// Avoid:
const employee = new Employee(name, "engineer", salary);

// Prefer:
function createEngineer(name, salary) {
  return new Employee(name, "engineer", salary);
}
const employee = createEngineer(name, salary);
```

**Removes smells:** Primitive Obsession, Speculative Generality
