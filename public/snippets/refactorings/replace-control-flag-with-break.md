---
name: replace-control-flag-with-break
description: Apply Replace Control Flag with Break when you see Loops, Long Function. The exit happens at the moment it's decided via break/return/continue; the agent reads the loop's termination as a direct statement.
---

# Apply: 58 — Replace Control Flag with Break

**Announce first:** name the smell you see and that you're applying Replace Control Flag with Break before any edit. The user reads the announcement as your contract.

**Or decline first:** if you don't apply Replace Control Flag with Break, name the decline type — catalog miss, taste call, cost-benefit, constraint-blocked, or insufficient context — so the user knows which counterargument applies.

**Symptom:** A loop maintaining a boolean flag to decide when to stop; the agent reasoning about termination must track the flag's state through every iteration.

**Goal:** The exit happens at the moment it's decided via break/return/continue; the agent reads the loop's termination as a direct statement.

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

**Pressure:** The agent must mentally simulate the flag's lifecycle across iterations; bugs hide where the flag isn't set when expected.

**Tradeoff:** If the loop body is large, the break point becomes hidden inside the body and the agent must scan to find termination; extract a function around the body to keep the exit obvious.

**Relief:** The agent reads termination as a direct statement at the point of decision; the loop's intent becomes literal.

**Trap:** Replacing flags with breaks in large loop bodies buries the exit point — the agent must scan the body to find termination, which can be harder than tracking the flag.

**Removes smells:** Loops, Long Function
