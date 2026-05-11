### Apply: 35 — Replace Type Code with Subclasses

**Target state:** A 'kind' string field becomes a real subclass type; the type system enforces the legal set.

**Why apply it:** Compile-time checks that no kind is missed; per-kind behavior lives where it belongs.

**Pitfall:** If only one or two switches exist on the type code, subclassing is over-design; combine with Replace Conditional with Polymorphism only when dispatch repeats.

```js
// Avoid:
class Employee {
  type; // 'engineer' | 'manager'
}

// Prefer:
class Employee {}
class Engineer extends Employee {}
class Manager extends Employee {}
```

**Removes smells:** Repeated Switches, Primitive Obsession
