---
name: long-function
description: Refuse Long Function when functions whose body has dozens of lines and a mix of concerns — fetching, calculating, formatting, and logging all interwoven. Apply Extract Function, Replace Temp with Query.
---

# Refuse: 03 — Long Function

**Trigger (refuse when you see):** Functions whose body has dozens of lines and a mix of concerns — fetching, calculating, formatting, and logging all interwoven.

**Cost of leaving it in:** Each line is an opportunity for the reader to lose context; understanding requires holding the whole function in working memory.

**Target shape after refactoring:** Each function reads as a sequence of named single-responsibility steps; nothing does more than its name advertises.

```js
// Smellier:
function ship(order) {
  if (!order.id) throw new Error('missing id');
  const tax = order.total * 0.1;
  const grand = order.total + tax;
  email(order.user, `Total ${grand}`);
  log(order);
}

// Fresher:
function ship(order) {
  validate(order);
  const grand = withTax(order);
  notify(order, grand);
}
```

**Apply refactorings:** Extract Function, Replace Temp with Query, Introduce Parameter Object, Preserve Whole Object, Replace Function with Command, Decompose Conditional, Split Loop, Replace Loop with Pipeline, Replace Control Flag with Break
