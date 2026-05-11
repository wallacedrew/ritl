### Apply: 34 — Push Down Method

**Target state:** Methods used by only one subclass live with that subclass, not on the shared superclass.

**Why apply it:** The superclass surface shrinks; subclasses that don't need the method aren't burdened by it.

**Pitfall:** If the method is occasionally needed in the parent, pushing it down forces awkward type checks back at consumers — verify usage first.

```js
// Avoid:
class Employee {
  quota() { /* used only by Salesperson */ }
}

// Prefer:
class Salesperson extends Employee {
  quota() { /* ... */ }
}
```

**Removes smells:** Refused Bequest, Large Class
