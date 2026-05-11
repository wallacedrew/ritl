### Apply: 15 — Split Loop

**Target state:** Each loop does one thing; mixed-purpose loops separate into named single-purpose passes.

**Why apply it:** Each loop can then be replaced by a pipeline or extracted by name; bugs concentrate in one purpose at a time.

**Pitfall:** Two loops over the same collection are slower than one — only split when the doubled cost is dwarfed by the readability gain (which it usually is).

```js
// Avoid:
let totalSalary = 0;
let youngest = Infinity;
for (const p of people) {
  if (p.age < youngest) youngest = p.age;
  totalSalary += p.salary;
}

// Prefer:
const totalSalary = people.reduce((s, p) => s + p.salary, 0);
const youngest    = Math.min(...people.map(p => p.age));
```

**Removes smells:** Long Function, Loops
