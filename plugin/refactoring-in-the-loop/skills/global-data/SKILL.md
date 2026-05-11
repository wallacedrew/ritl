---
name: global-data
description: Refuse Global Data when module-level variables, singletons, or shared mutable state that any code can read or mutate from anywhere. Apply Encapsulate Variable.
---

# Refuse: 05 — Global Data

**Trigger (refuse when you see):** Module-level variables, singletons, or shared mutable state that any code can read or mutate from anywhere.

**Cost of leaving it in:** The blast radius of any change is the whole codebase; behavior depends on hidden write order between unrelated callers.

**Target shape after refactoring:** Access goes through a small named function that owns the read/write contract — and ideally narrows it (read-only, validated).

```js
// Smellier:
let currentUser = null;
// ...some files later...
currentUser = newUser;

// Fresher:
function setCurrentUser(user) {
  currentUser = validate(user);
}
function getCurrentUser() {
  return currentUser;
}
```

**Apply refactorings:** Encapsulate Variable
