---
name: replace-conditional-with-polymorphism
description: Apply Replace Conditional with Polymorphism when you see Repeated Switches, Primitive Obsession. Each case becomes a class implementing a shared interface; dispatch happens once via virtual call.
---

# Apply: 24 — Replace Conditional with Polymorphism

**Target state:** Each case becomes a class implementing a shared interface; dispatch happens once via virtual call.

**Why apply it:** Adding a new case is one new class; the type system tells you what's missing.

**Tradeoff:** If only one switch on the type code exists, polymorphism is overkill — wait for the second or third repeat before extracting subclasses.

```js
// Avoid:
switch (event.kind) {
  case 'click': return onClick(event);
  case 'key':   return onKey(event);
}

// Prefer:
event.handle(); // ClickEvent and KeyEvent each implement handle()
```

**Removes smells:** Repeated Switches, Primitive Obsession
