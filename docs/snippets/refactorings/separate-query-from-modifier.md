### Apply: 27 — Separate Query from Modifier

**Target state:** Functions either return a value or mutate state, never both — callers can compose them without surprise.

**Why apply it:** Reasoning about side effects is local; tests target each shape independently.

**Pitfall:** If the modification and the query truly cannot be separated (e.g. find-and-remove on a queue), the constraint is fundamental — leave the combined operation but document it.

```js
// Avoid:
function findMiscreant(people) {
  for (const p of people) {
    if (p.isMiscreant) {
      alert(p);
      return p;
    }
  }
}

// Prefer:
function findMiscreant(people) {
  return people.find((p) => p.isMiscreant);
}
function alertMiscreant(people) {
  const m = findMiscreant(people);
  if (m) alert(m);
}
```

**Removes smells:** Mutable Data
