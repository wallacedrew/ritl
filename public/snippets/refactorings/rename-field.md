### Apply: 19 — Rename Field

**Target state:** Field names match the domain role they play; readers don't need to inspect usage to know what a field means.

**Why apply it:** Stronger encapsulation; future-you reads the class definition and immediately understands its shape.

**Pitfall:** Field renames cross every reader/writer of the class — refactor in tooling-supported steps and update tests with each batch.

```js
// Avoid:
class Org { name; }

// Prefer:
class Org { title; }
```

**Removes smells:** Mysterious Name
