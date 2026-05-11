---
name: push-down-field
description: Apply Push Down Field when you see Refused Bequest, Large Class. A field used by only one subclass moves out of the parent and into that subclass.
---

# Apply: 64 — Push Down Field

**Target state:** A field used by only one subclass moves out of the parent and into that subclass.

**Why apply it:** Other subclasses no longer carry storage they ignore; the parent's surface shrinks; the field's meaning becomes local.

**Pitfall:** If the field is occasionally consulted in the parent for type checks, pushing it down forces awkward downcasts — verify usage first.

```js
// Avoid:
class Employee {
  quota; // only Salesperson uses this
}

// Prefer:
class Employee {}
class Salesperson extends Employee { quota; }
```

**Removes smells:** Refused Bequest, Large Class
