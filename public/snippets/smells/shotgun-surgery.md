### Refuse: 08 — Shotgun Surgery

**Trigger (refuse when you see):** A single conceptual change forces edits in many small places — adding a logging field means touching 17 files.

**Cost of leaving it in:** Easy to miss a site; reviewers can't easily verify completeness; small changes feel disproportionately risky.

**Target shape after refactoring:** All code that varies together lives together. Adding a new field is one change in one module.

```js
// Smellier:
// Five files each have:
log(`event=${event}, user=${user}`);

// Fresher:
// One file:
function logEvent({ event, user }) {
  // one place to evolve
}
```

**Apply refactorings:** Move Function, Move Field, Combine Functions into Class, Combine Functions into Transform, Split Phase, Inline Function, Inline Class
