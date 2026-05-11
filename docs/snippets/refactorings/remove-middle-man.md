---
name: remove-middle-man
description: Apply Remove Middle Man when you see Middle Man. Callers talk directly to the real object; trivial passthroughs are deleted.
---

# Apply: 42 — Remove Middle Man

**Target state:** Callers talk directly to the real object; trivial passthroughs are deleted.

**Why apply it:** Fewer files, shorter call stacks, the implementation's location is obvious.

**Pitfall:** Direct access to the delegate exposes its surface to every consumer — only remove the middle man when most of its methods are passthroughs.

```js
// Avoid:
class Manager {
  reports() {
    return this.team.members();
  }
}

// Prefer:
// Expose team directly when the wrapper adds nothing.
manager.team.members();
```

**Removes smells:** Middle Man
