### Refuse: 04 — Long Parameter List

**Trigger (refuse when you see):** Functions taking five, six, or more parameters — especially when several travel together as a logical group.

**Cost of leaving it in:** Callers must remember argument order and meaning; refactoring becomes a coordination exercise across every call site.

**Target shape after refactoring:** Related parameters travel together as one well-named value object that the function (and its callers) refer to by domain meaning.

```js
// Smellier:
function book(name, email, street, city, zip, depart, arrive, seat) {
  // ...
}

// Fresher:
function book(traveler, address, trip) {
  // ...
}
```

**Apply refactorings:** Replace Parameter with Query, Preserve Whole Object, Introduce Parameter Object, Remove Flag Argument, Combine Functions into Class
