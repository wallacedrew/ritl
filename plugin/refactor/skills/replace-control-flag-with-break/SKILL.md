---
name: replace-control-flag-with-break
description: Apply Replace Control Flag with Break when you see Loops, Long Function. The exit happens at the moment it's decided via break/return/continue; the agent reads the loop's termination as a direct statement.
---

# Apply: 58 — Replace Control Flag with Break

**Target state:** The exit happens at the moment it's decided via break/return/continue; the agent reads the loop's termination as a direct statement.

**Why apply it:** The agent reads termination as a direct statement at the point of decision; the loop's intent becomes literal.

**Tradeoff:** If the loop body is large, the break point becomes hidden inside the body and the agent must scan to find termination; extract a function around the body to keep the exit obvious.

```js
// Avoid:
let found = false;
for (const p of people) {
  if (!found && p.name === target) {
    matched = p;
    found = true;
  }
}

// Prefer:
for (const p of people) {
  if (p.name === target) {
    matched = p;
    break;
  }
}
```

**Removes smells:** Loops, Long Function
